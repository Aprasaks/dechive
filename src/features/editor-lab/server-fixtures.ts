import { readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { JSONContent } from '@tiptap/core';
import type { FixtureDocument } from './document';
import { normalizeAnchors } from './document';
import { markdownToDechiveDocument } from './markdown';
import { migrateV1ToV2 } from './migration';

const fixtureSpecs = [
  ['short-archive', '짧은 Archive', 'content/posts/can-we-learn-directly-from-ai-answers.ko.md'],
  ['short-archive-en', '짧은 Archive EN', 'content/posts/can-we-learn-directly-from-ai-answers.en.md'],
  ['code-heavy-archive', '코드 블록 45개 Archive', 'content/posts/prompt-real-world-guide.ko.md'],
  ['code-heavy-archive-en', '코드 블록 Archive EN', 'content/posts/prompt-real-world-guide.en.md'],
  ['table-image-archive', '표와 이미지 Archive', 'content/posts/what-null-leaves-behind.ko.md'],
  ['table-image-archive-en', '표와 이미지 Archive EN', 'content/posts/what-null-leaves-behind.en.md'],
  ['heading-heavy-ko', 'Heading 104개 Deep Dive KO', 'content/posts/ai-era-agile-verification.ko.md'],
  ['heading-heavy-en', 'Heading 43개 Deep Dive EN', 'content/posts/ai-era-agile-verification.en.md'],
  ['book-note', 'Book note', 'src/content/books/knowing-what-we-know.ko.md'],
  ['multi-image', '이미지 5개 Deep Dive', 'content/posts/data-analysis-beyond-business.ko.md'],
  ['synthetic-scale-source', '100k자 수준 Deep Dive EN', 'content/posts/data-analysis-beyond-business.en.md'],
  ['short-archive-en-stage9', '짧은 Archive EN Stage 9', 'content/posts/can-we-learn-directly-from-ai-answers.en.md'],
  ['llm-architecture-ko', 'LLM Architecture KO', 'content/posts/llm-architecture.ko.md'],
  ['llm-architecture-en', 'LLM Architecture EN', 'content/posts/llm-architecture.en.md'],
  ['can-ai-replace-learning-ko', 'Can AI replace learning KO', 'content/posts/can-ai-replace-learning.ko.md'],
  ['can-ai-replace-learning-en', 'Can AI replace learning EN', 'content/posts/can-ai-replace-learning.en.md'],
  ['dual-brain-book', 'Dual Brain Book note', 'src/content/books/dual-brain.ko.md'],
] as const;

function count(document: JSONContent, type: string): number {
  let total = 0;
  const visit = (node: JSONContent) => { if (node.type === type) total += 1; node.content?.forEach(visit); };
  visit(document);
  return total;
}

export async function loadEditorFixtures(): Promise<FixtureDocument[]> {
  const fixtures: FixtureDocument[] = [];
  for (const [id, label, sourcePath] of fixtureSpecs) {
    const source = await readFile(path.join(/* turbopackIgnore: true */ process.cwd(), sourcePath), 'utf8');
    const parsed = matter(source);
    const document = markdownToDechiveDocument(parsed.content);
    fixtures.push({ id, label, sourcePath, document, sourceMetrics: { characters: parsed.content.length, headings: count(document, 'heading'), codeBlocks: count(document, 'codeBlock'), tables: count(document, 'table'), figures: count(document, 'figure') }, warnings: Array.isArray(parsed.data.tags) && parsed.data.tags.some((tag) => tag === null) ? ['YAML null tag: needs_review'] : [] });
  }
  fixtures.push({
    id: 'ai-update-example', label: 'AI Update 변환 예시', sourcePath: 'src/data/aiUpdates.ts#2026-07-02',
    document: normalizeAnchors({ type: 'doc', schemaVersion: 1, content: [
      { type: 'heading', attrs: { level: 2, anchorId: 'ai-update-runtime-example' }, content: [{ type: 'text', text: 'AI Update runtime 변환 예시' }] },
      { type: 'paragraph', content: [{ type: 'text', text: '실제 2026-07-02 Digest의 개별 변화 구조를 본문 node와 출처 node로 표현한다.' }] },
      { type: 'sourceReference', attrs: { sourceId: 'fixture-source', locator: '2026-07-02', note: '원본 TypeScript 데이터의 source granularity는 별도 검토가 필요합니다.', label: 'Fixture 출처' } },
    ] }), sourceMetrics: { characters: 0, headings: 1, codeBlocks: 0, tables: 0, figures: 0 }, warnings: ['Derivative fixture; original data not modified'],
  });
  const migrated = await migrateV1ToV2(fixtures[0].document);
  fixtures.push({ id: 'migration-v2', label: 'Schema v2 migration fixture', sourcePath: 'generated from short-archive fixture', document: migrated.document, sourceMetrics: { characters: 0, headings: count(migrated.document, 'heading'), codeBlocks: 0, tables: 0, figures: count(migrated.document, 'figure') }, warnings: [`migration:${migrated.log.changes.join(',')}`] });
  fixtures.push({ id: 'mixed-table-export', label: 'GFM + HTML fallback table fixture', sourcePath: 'fixtures/editor-security/generated-table-cases', document: normalizeAnchors({ type: 'doc', schemaVersion: 2, content: [
    { type: 'heading', attrs: { level: 2, anchorId: 'mixed-table' }, content: [{ type: 'text', text: 'Mixed table export' }] },
    { type: 'table', content: [{ type: 'tableRow', content: [{ type: 'tableHeader', content: [{ type: 'paragraph', content: [{ type: 'text', text: '단순' }] }] }] }, { type: 'tableRow', content: [{ type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'GFM' }] }] }] }] },
    { type: 'table', content: [{ type: 'tableRow', content: [{ type: 'tableCell', attrs: { colspan: 2, rowspan: 1 }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '복합 셀' }] }, { type: 'paragraph', content: [{ type: 'text', text: 'HTML fallback' }] }] }] }] },
  ] }), sourceMetrics: { characters: 0, headings: 1, codeBlocks: 0, tables: 2, figures: 0 }, warnings: ['mixed_gfm_html export expected'] });
  return fixtures;
}
