import assert from 'node:assert/strict';
import { generateHTML, generateJSON } from '@tiptap/html/server';
import type { JSONContent } from '@tiptap/core';
import { editorExtensions } from '../../src/features/editor-lab/editor-extensions';
import { fromTipTapJSON, normalizeAnchors } from '../../src/features/editor-lab/document';
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

const threeOrdered = markdownToDechiveDocument(`1. 하나\n2. 둘\n3. 셋`);
assertValid(threeOrdered);
assert.equal(countNodes(threeOrdered, 'listItem'), 3);

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
