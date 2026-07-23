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

const document = markdownToDechiveDocument(markdown);
const validation = validateDechiveDocument(document, 'draft');
assert.notEqual(validation.status, 'rejected');
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
