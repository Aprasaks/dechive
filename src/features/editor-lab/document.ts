import type { JSONContent } from '@tiptap/core';

export type DechiveDocument = JSONContent & {
  type: 'doc';
  schemaVersion: 1 | 2;
  content: JSONContent[];
};

export type FixtureDocument = {
  id: string;
  label: string;
  sourcePath: string;
  document: DechiveDocument;
  sourceMetrics: Record<string, number>;
  warnings: string[];
};

export function slugifyAnchor(value: string): string {
  return value.normalize('NFKC').toLowerCase().trim()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-') || 'section';
}

function nodeText(node: JSONContent): string {
  if (node.type === 'text') return node.text ?? '';
  return (node.content ?? []).map(nodeText).join('');
}

export function normalizeAnchors(document: DechiveDocument): DechiveDocument {
  const used = new Set<string>();
  const visit = (node: JSONContent): JSONContent => {
    const content = node.content?.map(visit);
    if (node.type !== 'heading') return { ...node, ...(content ? { content } : {}) };
    const requested = typeof node.attrs?.anchorId === 'string' && node.attrs.anchorId.trim()
      ? node.attrs.anchorId.trim()
      : slugifyAnchor(nodeText(node));
    let anchorId = requested;
    let suffix = 2;
    while (used.has(anchorId)) anchorId = `${requested}-${suffix++}`;
    used.add(anchorId);
    return { ...node, attrs: { ...node.attrs, anchorId }, ...(content ? { content } : {}) };
  };
  return { ...visit(document), type: 'doc', schemaVersion: 1 } as DechiveDocument;
}

export function findUnknownNodes(document: JSONContent): JSONContent[] {
  const found: JSONContent[] = [];
  const visit = (node: JSONContent) => {
    if (node.type === 'unknownBlock') found.push(node);
    node.content?.forEach(visit);
  };
  visit(document);
  return found;
}

export function validateDocument(value: JSONContent): asserts value is DechiveDocument {
  if (value.type !== 'doc' || !Array.isArray(value.content)) throw new Error('Document root must be type=doc with content.');
  if (value.schemaVersion !== 1 && value.schemaVersion !== 2) throw new Error('Unsupported schemaVersion.');
  const anchors = new Set<string>();
  const visit = (node: JSONContent) => {
    if (!node.type) throw new Error('Every node requires a type.');
    if (node.type === 'heading') {
      const anchor = node.attrs?.anchorId;
      if (typeof anchor !== 'string' || !anchor) throw new Error('Heading anchorId is required.');
      if (anchors.has(anchor)) throw new Error(`Duplicate heading anchor: ${anchor}`);
      anchors.add(anchor);
    }
    node.content?.forEach(visit);
  };
  value.content.forEach(visit);
}

export function fromTipTapJSON(value: JSONContent): DechiveDocument {
  const schemaVersion = value.attrs?.schemaVersion;
  return {
    ...value,
    type: 'doc',
    schemaVersion: schemaVersion === 2 ? 2 : 1,
    content: value.content ?? [],
  };
}

export function toTipTapJSON(value: DechiveDocument): JSONContent {
  const { schemaVersion, ...document } = value;
  return { ...document, attrs: { ...document.attrs, schemaVersion } };
}

export function plainText(document: JSONContent): string {
  const chunks: string[] = [];
  const visit = (node: JSONContent) => {
    if (node.type === 'text' && node.text) chunks.push(node.text);
    if (node.type === 'figure' && node.attrs?.caption) chunks.push(String(node.attrs.caption));
    if (node.type === 'sourceReference') chunks.push(String(node.attrs?.label ?? node.attrs?.note ?? '출처'));
    if (node.type === 'unknownBlock' && node.attrs?.fallbackText) chunks.push(String(node.attrs.fallbackText));
    node.content?.forEach(visit);
    if (['paragraph', 'heading', 'codeBlock', 'listItem', 'blockquote'].includes(node.type ?? '')) chunks.push('\n');
  };
  visit(document);
  return chunks.join(' ').replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();
}

function escapeMarkdown(value: string): string { return value.replace(/([\\`*_[\]<>])/g, '\\$1'); }

export function toNormalizedMarkdown(document: JSONContent): string {
  const renderInline = (node: JSONContent): string => {
    if (node.type === 'text') {
      let value = escapeMarkdown(node.text ?? '');
      for (const mark of node.marks ?? []) {
        if (mark.type === 'bold') value = `**${value}**`;
        if (mark.type === 'italic') value = `*${value}*`;
        if (mark.type === 'code') value = `\`${node.text ?? ''}\``;
        if (mark.type === 'link') value = `[${value}](${String(mark.attrs?.href ?? '')})`;
      }
      return value;
    }
    return (node.content ?? []).map(renderInline).join('');
  };
  const render = (node: JSONContent, depth = 0): string => {
    const children = (node.content ?? []).map((child) => render(child, depth + 1)).join('');
    switch (node.type) {
      case 'doc': return children;
      case 'paragraph': return `${renderInline(node)}\n\n`;
      case 'heading': return `${'#'.repeat(Number(node.attrs?.level ?? 2))} ${renderInline(node)} {#${String(node.attrs?.anchorId)}}\n\n`;
      case 'blockquote': return children.split('\n').filter(Boolean).map((line) => `> ${line}`).join('\n') + '\n\n';
      case 'bulletList': return children;
      case 'orderedList': return children;
      case 'listItem': return `${node.attrs?.ordered ? '1.' : '-'} ${children.trim()}\n`;
      case 'codeBlock': return `\`\`\`${String(node.attrs?.language ?? '')}\n${node.content?.map((child) => child.text ?? '').join('') ?? ''}\n\`\`\`\n\n`;
      case 'horizontalRule': return '---\n\n';
      case 'figure': return `![${String(node.attrs?.alt ?? '')}](${String(node.attrs?.legacySrc ?? node.attrs?.src ?? '')})${children.trim() ? `\n_${children.trim()}_` : ''}\n\n`;
      case 'caption': return renderInline(node);
      case 'sourceReference': return `> 출처: ${String(node.attrs?.label ?? node.attrs?.sourceId ?? '')}${node.attrs?.locator ? ` — ${String(node.attrs.locator)}` : ''}\n\n`;
      case 'callout': return `> **${String(node.attrs?.title ?? node.attrs?.kind ?? '참고')}**\n> ${children.trim().replace(/\n/g, '\n> ')}\n\n`;
      case 'table': return '<!-- table: normalized HTML fallback -->\n\n' + children;
      case 'tableRow': return `${children}\n`;
      case 'tableHeader':
      case 'tableCell': return `| ${children.trim()} `;
      case 'unknownBlock': return `<!-- unsupported node preserved: ${String(node.attrs?.originalType ?? 'unknown')} -->\n\n`;
      default: return children || renderInline(node);
    }
  };
  return `${render(document).trim()}\n`;
}

export async function checksumSnapshot(parts: { document: JSONContent; markdown: string; html: string; text: string }): Promise<string> {
  const stable = JSON.stringify(parts);
  const bytes = new TextEncoder().encode(stable);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
