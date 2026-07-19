import type { JSONContent } from '@tiptap/core';
import { toNormalizedMarkdown } from './document';

export type MarkdownExportMode = 'gfm' | 'mixed_gfm_html' | 'blocked';
export type ExportMetadata = { markdownExportMode: MarkdownExportMode; exportWarnings: string[]; fallbackNodeCount: number; exporterVersion: '1.0.0' };

function escapeCell(value: string) { return value.replace(/\|/g, '\\|').replace(/\n+/g, '<br>'); }
function inline(node: JSONContent): string {
  if (node.type === 'text') {
    let value = node.text ?? '';
    for (const mark of node.marks ?? []) {
      if (mark.type === 'bold') value = `**${value}**`;
      if (mark.type === 'italic') value = `*${value}*`;
      if (mark.type === 'code') value = `\`${value.replace(/`/g, '\\`')}\``;
      if (mark.type === 'link') value = `[${value}](${String(mark.attrs?.href ?? '')})`;
    }
    return value;
  }
  return (node.content ?? []).map(inline).join('');
}
function simpleCell(cell: JSONContent) { return !cell.attrs?.colspan || cell.attrs.colspan === 1 ? !cell.attrs?.rowspan || cell.attrs.rowspan === 1 ? (cell.content ?? []).length <= 1 && (cell.content ?? []).every((node) => node.type === 'paragraph' && (node.content ?? []).every((child) => child.type === 'text')) : false : false; }
function tableRows(table: JSONContent) { return (table.content ?? []).filter((row) => row.type === 'tableRow'); }

function gfmTable(table: JSONContent): string | null {
  const rows = tableRows(table);
  if (!rows.length || rows.some((row) => !(row.content?.length) || row.content.some((cell) => !['tableCell','tableHeader'].includes(cell.type ?? '') || !simpleCell(cell)))) return null;
  const width = rows[0].content?.length ?? 0;
  if (!width || rows.some((row) => row.content?.length !== width)) return null;
  const values = rows.map((row) => (row.content ?? []).map((cell) => escapeCell((cell.content ?? []).map(inline).join(''))));
  return [`| ${values[0].join(' | ')} |`, `| ${values[0].map(() => '---').join(' | ')} |`, ...values.slice(1).map((row) => `| ${row.join(' | ')} |`)].join('\n');
}
function escapeHtml(value: string) { return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function tableHtml(table: JSONContent): string {
  const renderNode = (node: JSONContent): string => {
    if (node.type === 'text') return escapeHtml(node.text ?? '');
    if (node.type === 'paragraph') return `<p>${(node.content ?? []).map(renderNode).join('')}</p>`;
    if (node.type === 'bulletList') return `<ul>${(node.content ?? []).map(renderNode).join('')}</ul>`;
    if (node.type === 'orderedList') return `<ol>${(node.content ?? []).map(renderNode).join('')}</ol>`;
    if (node.type === 'listItem') return `<li>${(node.content ?? []).map(renderNode).join('')}</li>`;
    if (node.type === 'figure') return `<span data-media-reference="${escapeHtml(String(node.attrs?.mediaId ?? 'pending'))}">${escapeHtml(String(node.attrs?.alt ?? 'image'))}</span>`;
    return (node.content ?? []).map(renderNode).join('');
  };
  return `<table>\n${tableRows(table).map((row) => `<tr>${(row.content ?? []).map((cell) => { const tag = cell.type === 'tableHeader' ? 'th' : 'td'; const span = `${Number(cell.attrs?.colspan ?? 1) > 1 ? ` colspan="${Number(cell.attrs?.colspan)}"` : ''}${Number(cell.attrs?.rowspan ?? 1) > 1 ? ` rowspan="${Number(cell.attrs?.rowspan)}"` : ''}`; return `<${tag}${span}>${(cell.content ?? []).map(renderNode).join('')}</${tag}>`; }).join('')}</tr>`).join('\n')}\n</table>`;
}

export function exportPublishedMarkdown(document: JSONContent): { markdown: string; metadata: ExportMetadata } {
  const warnings: string[] = [];
  let fallbackNodeCount = 0;
  const tables = new Map<JSONContent, string>();
  const scan = (node: JSONContent) => { if (node.type === 'table') { const gfm = gfmTable(node); if (gfm) tables.set(node, gfm); else { tables.set(node, tableHtml(node)); fallbackNodeCount += 1; warnings.push('complex_table_exported_as_sanitized_html'); } } node.content?.forEach(scan); };
  scan(document);
  let tableIndex = 0;
  const placeholders = new Map<string, string>();
  const replace = (node: JSONContent): JSONContent => {
    if (node.type === 'table') { const key = `DECHIVETABLETOKEN${tableIndex++}`; placeholders.set(key, tables.get(node) ?? ''); return { type: 'paragraph', content: [{ type: 'text', text: key }] }; }
    return { ...node, content: node.content?.map(replace) };
  };
  let markdown = toNormalizedMarkdown(replace(document));
  for (const [key, value] of placeholders) markdown = markdown.replace(key, value);
  return { markdown, metadata: { markdownExportMode: fallbackNodeCount ? 'mixed_gfm_html' : 'gfm', exportWarnings: warnings, fallbackNodeCount, exporterVersion: '1.0.0' } };
}
