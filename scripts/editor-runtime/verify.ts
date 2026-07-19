import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { generateHTML } from '@tiptap/html/server';
import type { JSONContent } from '@tiptap/core';
import { editorExtensions } from '../../src/features/editor-lab/editor-extensions';
import { findUnknownNodes, normalizeAnchors, plainText, toNormalizedMarkdown, validateDocument } from '../../src/features/editor-lab/document';
import { loadEditorFixtures } from '../../src/features/editor-lab/server-fixtures';

async function main() {
const fixtures = await loadEditorFixtures();
const results = [];
const timings = [];
for (const fixture of fixtures) {
  const parseStart = performance.now();
  const restored = JSON.parse(JSON.stringify(fixture.document)) as JSONContent;
  const jsonParseMs = performance.now() - parseStart;
  validateDocument(restored);
  const htmlStart = performance.now();
  const html = generateHTML(restored, editorExtensions);
  const htmlMs = performance.now() - htmlStart;
  const markdownStart = performance.now();
  const markdown = toNormalizedMarkdown(restored);
  const markdownMs = performance.now() - markdownStart;
  const normalizedAgain = toNormalizedMarkdown(JSON.parse(JSON.stringify(restored)) as JSONContent);
  if (markdown !== normalizedAgain) throw new Error(`${fixture.id}: Markdown is not deterministic`);
  results.push({ id: fixture.id, ...fixture.sourceMetrics, htmlLength: html.length, markdownLength: markdown.length, plainTextLength: plainText(restored).length, jsonSaveLoadEqual: JSON.stringify(restored) === JSON.stringify(fixture.document), unknownNodes: findUnknownNodes(restored).length });
  timings.push({ id: fixture.id, jsonParseMs, htmlMs, markdownMs });
}

const duplicate = normalizeAnchors({ type: 'doc', schemaVersion: 1, content: [
  { type: 'heading', attrs: { level: 2, anchorId: 'same' }, content: [{ type: 'text', text: '같은 제목' }] },
  { type: 'heading', attrs: { level: 2, anchorId: 'same' }, content: [{ type: 'text', text: '바뀐 제목' }] },
] });
if (duplicate.content[0].attrs?.anchorId !== 'same' || duplicate.content[1].attrs?.anchorId !== 'same-2') throw new Error('Duplicate anchor prevention failed');

const unknownPayload = { version: 7, values: ['보존', 2] };
const unknownDocument = normalizeAnchors({ type: 'doc', schemaVersion: 1, content: [
  { type: 'paragraph', content: [{ type: 'text', text: '앞 문단' }] },
  { type: 'unknownBlock', attrs: { originalType: 'futureNode', payload: unknownPayload, fallbackText: '대체 텍스트' } },
  { type: 'paragraph', content: [{ type: 'text', text: '뒤 문단' }] },
] });
const unknownRestored = JSON.parse(JSON.stringify(unknownDocument)) as JSONContent;
if (JSON.stringify(findUnknownNodes(unknownRestored)[0].attrs?.payload) !== JSON.stringify(unknownPayload)) throw new Error('Unknown payload preservation failed');
const publishBlocked = findUnknownNodes(unknownRestored).length > 0;
if (!publishBlocked || !plainText(unknownRestored).includes('대체 텍스트')) throw new Error('Unknown publish/fallback rule failed');
const customDocument = normalizeAnchors({ type: 'doc', schemaVersion: 1, content: [
  { type: 'callout', attrs: { kind: 'warning', title: '검증 필요' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '근거를 확인합니다.' }] }] },
  { type: 'sourceReference', attrs: { sourceId: 'source-1', locator: 'p. 7', note: '원문', label: '출처' } },
  { type: 'figure', attrs: { mediaId: null, src: '/images/posts/ai-learning-verification-desk.webp', legacySrc: './ai-learning-verification-desk.webp', alt: '학습 장면', alignment: 'center', width: 100, sourceReferenceId: 'source-1' }, content: [{ type: 'caption', content: [{ type: 'text', text: '설명' }] }] },
] });
const customHtml = generateHTML(customDocument, editorExtensions);
if (!customHtml.includes('data-callout') || !customHtml.includes('data-source-reference') || !customHtml.includes('data-dechive-figure')) throw new Error('Custom node HTML failed');

const longBase = fixtures.find((fixture) => fixture.id === 'heading-heavy-ko')?.document.content ?? [];
const synthetic = normalizeAnchors({ type: 'doc', schemaVersion: 1, content: Array.from({ length: 3 }, () => longBase).flat().map((node, index) => node.type === 'heading' ? { ...node, attrs: { ...node.attrs, anchorId: `${String(node.attrs?.anchorId)}-${index}` } } : node) });
const longStart = performance.now();
const longHtml = generateHTML(synthetic, editorExtensions);
const longHtmlMs = performance.now() - longStart;
const longMarkdownStart = performance.now();
const longMarkdown = toNormalizedMarkdown(synthetic);
const longMarkdownMs = performance.now() - longMarkdownStart;

const report = {
  version: 1,
  environment: { node: process.version, note: 'Node/server measurements; browser editor creation and interaction are measured separately.' },
  fixtures: results,
  invariants: { schemaValidation: true, stableExistingAnchor: duplicate.content[0].attrs?.anchorId === 'same', duplicateAnchorPrevention: true, jsonSaveLoad: results.every((item) => item.jsonSaveLoadEqual), deterministicMarkdown: true, htmlOutput: results.every((item) => item.htmlLength > 0), customNodeHtml: true, unknownPayloadPreserved: true, unknownPublishBlocked: publishBlocked, unknownPlainTextFallback: true },
  syntheticLongDocument: { characters: plainText(synthetic).length, htmlLength: longHtml.length, markdownLength: longMarkdown.length },
};
const serialized = `${JSON.stringify(report, null, 2)}\n`;
const output = path.join(process.cwd(), 'fixtures/editor-runtime/output/runtime-report.json');
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, serialized, 'utf8');
console.log(`editor runtime verification: ${results.length} fixtures, sha256=${createHash('sha256').update(serialized).digest('hex')}`);
console.log(`development timings (non-deterministic): ${JSON.stringify({ fixtures: timings, synthetic: { htmlMs: longHtmlMs, markdownMs: longMarkdownMs } })}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
