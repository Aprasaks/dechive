import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generateHTML, generateJSON } from '@tiptap/html/server';
import type { JSONContent } from '@tiptap/core';
import { editorExtensions } from '../../src/features/editor-lab/editor-extensions';
import { fromTipTapJSON, normalizeAnchors, plainText, toNormalizedMarkdown, type DechiveDocument } from '../../src/features/editor-lab/document';
import { exportPublishedMarkdown } from '../../src/features/editor-lab/export';
import { migrateV1ToV2 } from '../../src/features/editor-lab/migration';
import { assertSafeRenderedHtml, sanitizeImportedHtml, validateDechiveDocument } from '../../src/features/editor-lab/security';

type HtmlCase = { id: string; html: string };
const root = process.cwd();
async function main() {
const malicious = JSON.parse(await readFile(path.join(root, 'fixtures/editor-security/malicious.json'), 'utf8')) as { cases: HtmlCase[] };
const paste = JSON.parse(await readFile(path.join(root, 'fixtures/editor-security/paste.json'), 'utf8')) as { cases: HtmlCase[] };

const securityResults = malicious.cases.map((fixture) => {
  const sanitized = sanitizeImportedHtml(fixture.html);
  const document = normalizeAnchors(fromTipTapJSON(generateJSON(sanitized.html || '<p></p>', editorExtensions)));
  const rendered = generateHTML(document, editorExtensions);
  const failures = assertSafeRenderedHtml(rendered);
  if (failures.length) throw new Error(`${fixture.id}: unsafe renderer output ${failures.join(',')}`);
  return { id: fixture.id, changed: sanitized.changed, warnings: sanitized.warnings, safe: true, text: plainText(document) };
});

const jsonThreats: Array<{ id: string; document: JSONContent; draft: string; publish: string }> = [];
const base = (content: JSONContent[]): DechiveDocument => normalizeAnchors({ type: 'doc', schemaVersion: 1, content });
const threats = [
  { id: 'unknown-html-payload', document: base([{ type: 'unknownBlock', attrs: { originalType: 'htmlWidget', payload: '<img onerror=alert(1)>', fallbackText: '격리' } }]) },
  { id: 'source-html-note', document: base([{ type: 'sourceReference', attrs: { sourceId: 's1', locator: '', note: '<script>alert(1)</script>', label: '<b>출처</b>' } }]) },
  { id: 'callout-markup-title', document: base([{ type: 'callout', attrs: { kind: 'info', title: '<img onerror=alert(1)>' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'safe' }] }] }]) },
  { id: 'deep-list', document: base([Array.from({ length: 35 }).reduceRight<JSONContent>((child) => ({ type: 'bulletList', content: [{ type: 'listItem', content: [child] }] }), { type: 'paragraph', content: [{ type: 'text', text: 'deep' }] })]) },
  { id: 'oversized-attribute', document: base([{ type: 'callout', attrs: { kind: 'info', title: 'x'.repeat(70_000) }, content: [{ type: 'paragraph' }] }]) },
  { id: 'invalid-media', document: base([{ type: 'figure', attrs: { src: '../private/key', alt: 'bad', width: 100 }, content: [] }]) },
  { id: 'external-media', document: base([{ type: 'figure', attrs: { src: 'https://tracker.example/a.png', alt: 'external', width: 100 }, content: [] }]) },
  { id: 'javascript-json-link', document: base([{ type: 'paragraph', content: [{ type: 'text', text: 'bad', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }] }] }]) },
];
for (const fixture of threats) {
  const draft = validateDechiveDocument(fixture.document, 'draft');
  const publish = validateDechiveDocument(fixture.document, 'publish');
  jsonThreats.push({ id: fixture.id, document: fixture.document, draft: draft.status, publish: publish.status });
  if (['unknown-html-payload','javascript-json-link','deep-list','oversized-attribute','invalid-media'].includes(fixture.id) && publish.status !== 'rejected') throw new Error(`${fixture.id}: publish should reject`);
}

function cell(...content: JSONContent[]): JSONContent { return { type: 'tableCell', content }; }
function row(...content: JSONContent[]): JSONContent { return { type: 'tableRow', content }; }
const paragraph = (text: string, marks?: JSONContent['marks']): JSONContent => ({ type: 'paragraph', content: [{ type: 'text', text, ...(marks ? { marks } : {}) }] });
const tables: Array<{ id: string; table: JSONContent; expected: string }> = [
  { id: 'simple', table: { type: 'table', content: [row(cell(paragraph('A')),cell(paragraph('B'))),row(cell(paragraph('1')),cell(paragraph('2')))] }, expected: 'gfm' },
  { id: 'inline-bold-link', table: { type: 'table', content: [row(cell(paragraph('A')),cell(paragraph('B'))),row(cell(paragraph('bold',[{type:'bold'}])),cell(paragraph('link',[{type:'link',attrs:{href:'https://example.com'}}])))] }, expected: 'gfm' },
  { id: 'inline-code', table: { type: 'table', content: [row(cell(paragraph('Code'))),row(cell(paragraph('x',[{type:'code'}])))] }, expected: 'gfm' },
  { id: 'multiple-paragraphs', table: { type: 'table', content: [row(cell(paragraph('A'))),row(cell(paragraph('one'),paragraph('two')))] }, expected: 'mixed_gfm_html' },
  { id: 'list-cell', table: { type: 'table', content: [row(cell(paragraph('A'))),row(cell({type:'bulletList',content:[{type:'listItem',content:[paragraph('item')]}]}))] }, expected: 'mixed_gfm_html' },
  { id: 'image-cell', table: { type: 'table', content: [row(cell(paragraph('A'))),row(cell({type:'figure',attrs:{mediaId:'m1',alt:'img'}}))] }, expected: 'mixed_gfm_html' },
  { id: 'spans', table: { type: 'table', content: [row({type:'tableCell',attrs:{colspan:2,rowspan:1},content:[paragraph('A')]}),row(cell(paragraph('B')),cell(paragraph('C')))] }, expected: 'mixed_gfm_html' },
];
const tableResults = tables.map(({ id, table, expected }) => {
  const document = base([table]); const output = exportPublishedMarkdown(document);
  if (output.metadata.markdownExportMode !== expected) throw new Error(`${id}: expected ${expected}`);
  const reimport = generateJSON(sanitizeImportedHtml(output.markdown.includes('<table>') ? output.markdown.slice(output.markdown.indexOf('<table>')) : '<p>GFM import handled by Markdown importer</p>').html, editorExtensions);
  const countType = (node: JSONContent, type: string): number => (node.type === type ? 1 : 0) + (node.content ?? []).reduce((sum, child) => sum + countType(child, type), 0);
  const reimportTableCount = countType(reimport, 'table');
  if (expected === 'mixed_gfm_html' && reimportTableCount !== 1) throw new Error(`${id}: HTML fallback did not reimport as table`);
  return { id, mode: output.metadata.markdownExportMode, warnings: output.metadata.exportWarnings, fallbackNodeCount: output.metadata.fallbackNodeCount, reimportRoot: reimport.type, reimportTableCount };
});
const malformedTable = base([{ type: 'table', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'invalid child' }] }] }]);
const malformedResult = validateDechiveDocument(malformedTable, 'publish');

const pasteResults = paste.cases.map((fixture) => {
  const sanitized = sanitizeImportedHtml(fixture.html);
  const document = normalizeAnchors(fromTipTapJSON(generateJSON(sanitized.html || '<p></p>', editorExtensions)));
  const validation = validateDechiveDocument(document, 'draft');
  const rendered = generateHTML(document, editorExtensions);
  const safe = assertSafeRenderedHtml(rendered).length === 0;
  if (!safe || validation.status === 'rejected') throw new Error(`${fixture.id}: unsafe or rejected paste result`);
  return { id: fixture.id, changed: sanitized.changed, warnings: sanitized.warnings, validation: validation.status, safe, textLength: plainText(document).length };
});

const v1 = base([
  { type: 'heading', attrs: { level: 2, anchorId: 'stable' }, content: [{ type: 'text', text: 'Migration' }] },
  { type: 'figure', attrs: { mediaId: null, src: '/images/posts/a.webp', legacySrc: './a.webp', alt: 'a', alignment: 'center', width: 100, sourceReferenceId: 's1' }, content: [{ type: 'caption', content: [{ type: 'text', text: 'caption' }] }] },
  { type: 'callout', attrs: { kind: 'info', title: 'Note' }, content: [paragraph('body')] },
  { type: 'sourceReference', attrs: { sourceId: 's1', locator: 'p. 3', note: 'source', label: '출처' } },
]);
const migrated = await migrateV1ToV2(v1);
if (migrated.status !== 'migrated' || migrated.log.checksumBefore === migrated.log.checksumAfter) throw new Error('Migration failed');
const migrationHtml = generateHTML(migrated.document, editorExtensions);
const migrationMarkdown = toNormalizedMarkdown(migrated.document);

const report = {
  version: 1, sanitizer: { package: 'sanitize-html', policyVersion: '1.0.0' }, securityResults,
  jsonThreats: jsonThreats.map(({ id, draft, publish }) => ({ id, draft, publish })),
  tableResults, malformedTable: malformedResult.status, pasteResults,
  migration: { status: migrated.status, sourceVersion: v1.schemaVersion, targetVersion: migrated.document.schemaVersion, log: migrated.log, htmlLength: migrationHtml.length, markdownLength: migrationMarkdown.length, sourceImmutable: v1.schemaVersion === 1 },
};
const output = `${JSON.stringify(report, null, 2)}\n`;
await mkdir(path.join(root, 'fixtures/editor-security/output'), { recursive: true });
await writeFile(path.join(root, 'fixtures/editor-security/output/security-report.json'), output, 'utf8');
console.log(`editor security verification: sha256=${createHash('sha256').update(output).digest('hex')}`);
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
