import type { Json } from '@/lib/supabase/database.types';

type JsonRecord = { [key: string]: Json | undefined };

export type ContentArtifacts = {
  html: string;
  plainText: string;
  markdown: string;
};

function isRecord(value: Json | undefined): value is JsonRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function childrenOf(node: JsonRecord): Json[] {
  return Array.isArray(node.content) ? node.content : [];
}

function plainNode(value: Json): string {
  if (!isRecord(value)) return '';
  if (typeof value.text === 'string') return value.text;

  const separator =
    value.type === 'doc' ||
    value.type === 'paragraph' ||
    value.type === 'heading' ||
    value.type === 'listItem' ||
    value.type === 'blockquote'
      ? '\n'
      : '';

  return childrenOf(value).map(plainNode).join(separator);
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function headingLevel(node: JsonRecord) {
  if (!isRecord(node.attrs) || typeof node.attrs.level !== 'number') return 2;
  return Math.min(3, Math.max(2, node.attrs.level));
}

function markdownNode(value: Json): string {
  if (!isRecord(value)) return '';
  if (typeof value.text === 'string') return value.text;

  const content = childrenOf(value).map(markdownNode).join('');

  switch (value.type) {
    case 'doc':
      return childrenOf(value).map(markdownNode).join('\n\n');
    case 'heading':
      return `${'#'.repeat(headingLevel(value))} ${content}`;
    case 'paragraph':
      return content;
    case 'bulletList':
      return childrenOf(value)
        .map((child) => `- ${markdownNode(child).trim()}`)
        .join('\n');
    case 'orderedList':
      return childrenOf(value)
        .map((child, index) => `${index + 1}. ${markdownNode(child).trim()}`)
        .join('\n');
    case 'listItem':
      return content;
    case 'blockquote':
      return content
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
    case 'codeBlock':
      return `\`\`\`\n${plainNode(value).trim()}\n\`\`\``;
    case 'hardBreak':
      return '\n';
    case 'horizontalRule':
      return '---';
    default:
      return content;
  }
}

function htmlNode(value: Json): string {
  if (!isRecord(value)) return '';
  if (typeof value.text === 'string') return escapeHtml(value.text);

  const content = childrenOf(value).map(htmlNode).join('');

  switch (value.type) {
    case 'doc':
      return content;
    case 'paragraph':
      return `<p>${content}</p>`;
    case 'heading': {
      const level = headingLevel(value);
      return `<h${level}>${content}</h${level}>`;
    }
    case 'bulletList':
      return `<ul>${content}</ul>`;
    case 'orderedList':
      return `<ol>${content}</ol>`;
    case 'listItem':
      return `<li>${content}</li>`;
    case 'blockquote':
      return `<blockquote>${content}</blockquote>`;
    case 'codeBlock':
      return `<pre><code>${escapeHtml(plainNode(value).trim())}</code></pre>`;
    case 'hardBreak':
      return '<br>';
    case 'horizontalRule':
      return '<hr>';
    default:
      return content;
  }
}

export function deriveContentArtifacts(bodyJson: Json): ContentArtifacts {
  const plainText = plainNode(bodyJson)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');

  return {
    html: htmlNode(bodyJson),
    plainText,
    markdown: markdownNode(bodyJson).trim(),
  };
}
