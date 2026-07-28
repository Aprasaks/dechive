import assert from 'node:assert/strict';
import { generateHTML, generateJSON } from '@tiptap/html/server';
import type { JSONContent } from '@tiptap/core';
import { editorExtensions } from '../../src/features/editor-lab/editor-extensions';
import { fromTipTapJSON, normalizeAnchors, normalizeDocumentLinks, type DechiveDocument } from '../../src/features/editor-lab/document';
import { markdownToDechiveDocument } from '../../src/features/editor-lab/markdown';
import { assertSafeRenderedHtml, sanitizeImportedHtml, validateDechiveDocument } from '../../src/features/editor-lab/security';

const markdown = `## Markdown 붙여넣기

### 세부 문법

**굵게**, *기울임*, \`인라인 코드\`, [Dechive](https://dechive.dev)

> 인용문입니다.

\`\`\`ts
const answer = 42;
\`\`\`

- 첫 번째 항목
- 두 번째 항목

1. 순서 있는 항목
2. 다음 항목

---

| 이름 | 설명 |
| --- | --- |
| Markdown | 표 |
`;

function countNodes(document: JSONContent, type: string): number {
  let count = 0;
  const visit = (node: JSONContent) => {
    if (node.type === type) count += 1;
    node.content?.forEach(visit);
  };
  visit(document);
  return count;
}

function hasMark(document: JSONContent, type: string): boolean {
  let found = false;
  const visit = (node: JSONContent) => {
    if (node.marks?.some((mark) => mark.type === type)) found = true;
    node.content?.forEach(visit);
  };
  visit(document);
  return found;
}

function isEmptyParagraph(node: JSONContent): boolean {
  return node.type === 'paragraph' && !(node.content ?? []).some((child) => child.type !== 'text' || Boolean(child.text?.trim()));
}

function countEmptyParagraphs(document: JSONContent): number {
  let count = 0;
  const visit = (node: JSONContent) => {
    if (isEmptyParagraph(node)) count += 1;
    node.content?.forEach(visit);
  };
  visit(document);
  return count;
}

function countEmptyListItems(document: JSONContent): number {
  let count = 0;
  const visit = (node: JSONContent) => {
    if (node.type === 'listItem' && !(node.content ?? []).some((child) => !isEmptyParagraph(child))) count += 1;
    node.content?.forEach(visit);
  };
  visit(document);
  return count;
}

function countInvalidTextContainers(document: JSONContent): number {
  let count = 0;
  const visit = (node: JSONContent) => {
    if (node.type === 'text' && node.content) count += 1;
    node.content?.forEach(visit);
  };
  visit(document);
  return count;
}

function textContent(node: JSONContent): string {
  return node.type === 'text' ? node.text ?? '' : (node.content ?? []).map(textContent).join('');
}

function linkMark(document: JSONContent, text: string): NonNullable<JSONContent['marks']>[number] {
  let found: NonNullable<JSONContent['marks']>[number] | undefined;
  const visit = (node: JSONContent) => {
    if (node.type === 'text' && node.text === text)
      found = node.marks?.find((mark) => mark.type === 'link');
    node.content?.forEach(visit);
  };
  visit(document);
  if (!found) throw new Error(`link_mark_missing:${text}`);
  return found;
}

function assertValid(document: JSONContent): void {
  assert.notEqual(validateDechiveDocument(document, 'draft').status, 'rejected');
  assert.equal(countInvalidTextContainers(document), 0);
  assert.equal(countEmptyParagraphs(document), 0);
  assert.equal(countEmptyListItems(document), 0);
}

const threeBullets = markdownToDechiveDocument(`- **하나**\n- 둘\n- 셋`);
assertValid(threeBullets);
assert.equal(countNodes(threeBullets, 'listItem'), 3);
assert(hasMark(threeBullets, 'bold'));

const longKnowledgeDocument: DechiveDocument = {
  type: 'doc',
  schemaVersion: 1,
  content: [{ type: 'paragraph', content: [{ type: 'text', text: '긴 지식 노드 '.repeat(20_001) }] }],
};
const longKnowledgeValidation = validateDechiveDocument(longKnowledgeDocument, 'draft');
assert.notEqual(longKnowledgeValidation.status, 'rejected');
assert.equal(longKnowledgeValidation.stats.textLength, '긴 지식 노드 '.repeat(20_001).length);

const manyBlockDocument: DechiveDocument = {
  type: 'doc',
  schemaVersion: 1,
  content: Array.from({ length: 20_001 }, (_, index) => ({
    type: 'paragraph' as const,
    content: [{ type: 'text' as const, text: `블록 ${index}` }],
  })),
};
const manyBlockValidation = validateDechiveDocument(manyBlockDocument, 'draft');
assert.notEqual(manyBlockValidation.status, 'rejected');
assert.equal(manyBlockValidation.stats.nodes, 40_002);

const threeOrdered = markdownToDechiveDocument(`1. 하나\n2. 둘\n3. 셋`);
assertValid(threeOrdered);
assert.equal(countNodes(threeOrdered, 'listItem'), 3);
const tiptapOrdered = JSON.parse(JSON.stringify(threeOrdered)) as JSONContent;
const tiptapOrderedList = tiptapOrdered.content?.find((node) => node.type === 'orderedList');
if (!tiptapOrderedList) throw new Error('ordered_list_missing');
tiptapOrderedList.attrs = { ...tiptapOrderedList.attrs, type: null };
assert.notEqual(validateDechiveDocument(tiptapOrdered, 'publish').status, 'rejected');

const oneQuote = markdownToDechiveDocument('> 한 줄짜리 인용문');
assertValid(oneQuote);
assert.equal(countNodes(oneQuote, 'blockquote'), 1);
assert.equal(oneQuote.content[0]?.content?.length, 1);
assert.equal(oneQuote.content[0]?.content?.[0]?.type, 'paragraph');

const oneCode = markdownToDechiveDocument('```ts\nconst answer = 42;\n```');
assertValid(oneCode);
assert.equal(textContent(oneCode.content[0] ?? {}), 'const answer = 42;');
assert(!textContent(oneCode.content[0] ?? {}).endsWith('\n'));

const looseList = markdownToDechiveDocument('- 하나\n\n- 둘\n\n- 셋');
assertValid(looseList);
assert.equal(countNodes(looseList, 'listItem'), 3);

const nestedList = markdownToDechiveDocument('- 바깥\n  - 안쪽 하나\n  - 안쪽 둘\n- 다음');
assertValid(nestedList);
assert.equal(countNodes(nestedList, 'bulletList'), 2);
assert.equal(countNodes(nestedList, 'listItem'), 4);

const blankCornerTable = markdownToDechiveDocument(`| | 판별 용도 | 생성 용도 |
|---|---|---|
| **판별 모델** | 분류 | 해당 없음 |
| **생성 모델** | 감정 분류 | 이미지 생성 |`);
assert.notEqual(validateDechiveDocument(blankCornerTable, 'draft').status, 'rejected');
assert.equal(countInvalidTextContainers(blankCornerTable), 0);
assert.equal(countEmptyListItems(blankCornerTable), 0);
const blankCornerCell = blankCornerTable.content[0]?.content?.[0]?.content?.[0];
assert.equal(blankCornerCell?.type, 'tableCell');
assert.equal(blankCornerCell?.content?.[0]?.type, 'paragraph');
assert(generateHTML(blankCornerTable, editorExtensions).includes('<table'));

const document = markdownToDechiveDocument(markdown);
assertValid(document);
assert.equal(countNodes(document, 'heading'), 2);
assert.equal(countNodes(document, 'blockquote'), 1);
assert.equal(countNodes(document, 'codeBlock'), 1);
assert.equal(document.content.find((node) => node.type === 'codeBlock')?.attrs?.language, 'ts');
assert.equal(countNodes(document, 'bulletList'), 1);
assert.equal(countNodes(document, 'orderedList'), 1);
assert.equal(countNodes(document, 'horizontalRule'), 1);
assert.equal(countNodes(document, 'table'), 1);
assert(hasMark(document, 'bold'));
assert(hasMark(document, 'italic'));
assert(hasMark(document, 'code'));
assert(hasMark(document, 'link'));

const linkCases = markdownToDechiveDocument(
  '[내부](/knowledge/foo) [외부](https://example.com/reference) [절대주소](https://dechive.dev/knowledge/foo?tab=1#section) [앵커](#section-name) [메일](mailto:test@example.com) [전화](tel:+821012345678) [www](https://www.dechive.dev/path) [미디어](https://media.dechive.dev/image.webp)',
  { siteOrigins: ['https://dechive.dev'] },
);
assert.deepEqual(linkMark(linkCases, '내부').attrs, { href: '/knowledge/foo' });
assert.deepEqual(linkMark(linkCases, '외부').attrs, { href: 'https://example.com/reference', target: '_blank', rel: 'noopener noreferrer' });
assert.deepEqual(linkMark(linkCases, '절대주소').attrs, { href: '/knowledge/foo?tab=1#section' });
assert.deepEqual(linkMark(linkCases, '앵커').attrs, { href: '#section-name' });
assert.deepEqual(linkMark(linkCases, '메일').attrs, { href: 'mailto:test@example.com' });
assert.deepEqual(linkMark(linkCases, '전화').attrs, { href: 'tel:+821012345678' });
assert.deepEqual(linkMark(linkCases, 'www').attrs, { href: 'https://www.dechive.dev/path', target: '_blank', rel: 'noopener noreferrer' });
assert.deepEqual(linkMark(linkCases, '미디어').attrs, { href: 'https://media.dechive.dev/image.webp', target: '_blank', rel: 'noopener noreferrer' });
const normalizedLinkCases = normalizeDocumentLinks(linkCases, { siteOrigins: ['https://dechive.dev'] });
assert.deepEqual(normalizedLinkCases, linkCases);
const legacyLinkDocument: DechiveDocument = {
  type: 'doc',
  schemaVersion: 1,
  content: [{
    type: 'paragraph',
    content: [{
      type: 'text',
      text: '기존 링크',
      marks: [{ type: 'link', attrs: { href: 'https://dechive.dev/knowledge/foo', target: '_blank', rel: 'noopener noreferrer nofollow' } }],
    }],
  }],
};
const normalizedLegacyLinkDocument = normalizeDocumentLinks(legacyLinkDocument, { siteOrigins: ['https://dechive.dev'] });
assert.deepEqual(normalizedLegacyLinkDocument.content[0]?.content?.[0]?.marks?.[0]?.attrs, { href: '/knowledge/foo' });
const linkCasesHtml = generateHTML(linkCases, editorExtensions);
assert(linkCasesHtml.includes('<a href="/knowledge/foo">내부</a>'));
assert(linkCasesHtml.includes('<a target="_blank" rel="noopener noreferrer" href="https://example.com/reference">외부</a>'));
assert(linkCasesHtml.includes('<a href="#section-name">앵커</a>'));
assert(linkCasesHtml.includes('<a href="mailto:test@example.com">메일</a>'));
assert(linkCasesHtml.includes('<a href="tel:+821012345678">전화</a>'));
assert(!linkCasesHtml.includes('nofollow'));

const rendered = generateHTML(document, editorExtensions);
assert(rendered.includes('<blockquote>'));
assert(rendered.includes('<pre'));
assert(rendered.includes('<ul>'));
assert(rendered.includes('<ol'));
assert(rendered.includes('<hr'));
assert(rendered.includes('<table'));
assert(rendered.includes('href="https://dechive.dev"'));
assert.deepEqual(assertSafeRenderedHtml(rendered), []);

const persisted = JSON.parse(JSON.stringify(document)) as JSONContent;
const restored = normalizeAnchors(fromTipTapJSON(persisted));
assert.deepEqual(restored, persisted);
assert.notEqual(validateDechiveDocument(restored, 'draft').status, 'rejected');

const plainText = markdownToDechiveDocument('그냥 붙여넣은 평범한 문장입니다.');
assert.equal(plainText.content[0]?.type, 'paragraph');
assert.equal(plainText.content[0]?.content?.[0]?.text, '그냥 붙여넣은 평범한 문장입니다.');

const imported = sanitizeImportedHtml('<p>안전한 텍스트</p><script>window.evil = true</script><a href="javascript:alert(1)">위험한 링크</a>');
assert(!imported.html.includes('<script'));
assert(!imported.html.includes('javascript:'));
const importedDocument = fromTipTapJSON(generateJSON(imported.html, editorExtensions));
assert.deepEqual(assertSafeRenderedHtml(generateHTML(importedDocument, editorExtensions)), []);

console.log('Knowledge Markdown paste verification passed.');
