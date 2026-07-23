import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import type { JSONContent } from '@tiptap/core';
import { normalizeAnchors, type DechiveDocument } from './document';

type MarkdownNode = {
  type: string;
  value?: string;
  depth?: number;
  lang?: string;
  meta?: string;
  url?: string;
  alt?: string;
  title?: string;
  ordered?: boolean;
  start?: number;
  checked?: boolean;
  align?: Array<string | null>;
  children?: MarkdownNode[];
};

const parser = unified().use(remarkParse).use(remarkGfm);

function markContent(content: JSONContent[] | undefined, type: string, attrs?: Record<string, unknown>): JSONContent {
  const apply = (node: JSONContent): JSONContent => node.type === 'text'
    ? { ...node, marks: [...(node.marks ?? []), { type, ...(attrs ? { attrs } : {}) }] }
    : { ...node, content: node.content?.map(apply) };
  return { type: 'text', text: '', content: content?.map(apply) };
}

function convert(node: MarkdownNode): JSONContent {
  const content = node.children?.map(convert);
  const common = content ? { content } : {};
  switch (node.type) {
    case 'root': return { type: 'doc', ...common };
    case 'text': return { type: 'text', text: node.value ?? '' };
    case 'paragraph': {
      if (node.children?.length === 1 && node.children[0].type === 'image') return convert(node.children[0]);
      return { type: 'paragraph', ...common };
    }
    case 'heading': return { type: 'heading', attrs: { level: node.depth ?? 2, anchorId: null }, ...common };
    case 'strong': return markContent(content, 'bold');
    case 'emphasis': return markContent(content, 'italic');
    case 'delete': return markContent(content, 'strike');
    case 'inlineCode': return { type: 'text', text: node.value ?? '', marks: [{ type: 'code' }] };
    case 'link': return markContent(content, 'link', { href: node.url ?? '', target: '_blank', rel: 'noopener noreferrer nofollow' });
    case 'image': {
      const legacySrc = node.url ?? '';
      const fileName = legacySrc.split('/').pop() ?? legacySrc;
      return { type: 'figure', attrs: { mediaId: null, src: `/images/posts/${fileName}`, legacySrc, alt: node.alt ?? '', alignment: 'center', width: 100, sourceReferenceId: null }, content: node.title ? [{ type: 'caption', content: [{ type: 'text', text: node.title }] }] : [] };
    }
    case 'code': return { type: 'codeBlock', attrs: { language: node.lang ?? null, meta: node.meta ?? null }, content: node.value ? [{ type: 'text', text: node.value }] : [] };
    case 'blockquote': return { type: 'blockquote', ...common };
    case 'list': return { type: node.ordered ? 'orderedList' : 'bulletList', attrs: node.ordered ? { start: node.start ?? 1 } : undefined, content: (content ?? []).map((child) => ({ ...child, attrs: { ...child.attrs, ordered: Boolean(node.ordered) } })) };
    case 'listItem': return { type: 'listItem', attrs: { checked: node.checked ?? null }, ...common };
    case 'table': return { type: 'table', ...common };
    case 'tableRow': return { type: 'tableRow', ...common };
    case 'tableCell': return { type: 'tableCell', ...common };
    case 'thematicBreak': return { type: 'horizontalRule' };
    case 'break': return { type: 'hardBreak' };
    case 'html': return { type: 'unknownBlock', attrs: { originalType: 'rawHtml', payload: node.value ?? '', fallbackText: 'Raw HTML은 자동 실행하지 않습니다.' } };
    default: return { type: 'unknownBlock', attrs: { originalType: node.type, payload: node, fallbackText: `미지원 Markdown node: ${node.type}` } };
  }
}

function flattenInvalidTextContainers(node: JSONContent): JSONContent[] {
  if (node.type === 'text' && node.content) return node.content.flatMap(flattenInvalidTextContainers);
  return [{ ...node, content: node.content?.flatMap(flattenInvalidTextContainers) }];
}

export function markdownToDechiveDocument(markdown: string): DechiveDocument {
  const converted = convert(parser.parse(markdown) as MarkdownNode);
  const content = converted.content?.flatMap(flattenInvalidTextContainers) ?? [];
  return normalizeAnchors({ ...converted, type: 'doc', schemaVersion: 1, content });
}

export function looksLikeMarkdown(value: string): boolean {
  return /(^|\n)\s*#{2,6}\s+\S/.test(value)
    || /(^|\n)\s*(?:[-+*]|\d+[.)])\s+\S/.test(value)
    || /(^|\n)\s*>\s?\S/.test(value)
    || /(^|\n)\s*(```|~~~)/.test(value)
    || /(^|\n)\s*-{3,}\s*$/.test(value)
    || /(^|\n).*\|.*\n\s*\|?\s*:?-{3,}/.test(value)
    || /\[[^\]\n]+\]\((?:https?:|mailto:|\/|#)[^)]+\)/.test(value)
    || /\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`/.test(value);
}
