import type { JSONContent } from '@tiptap/core';
import sanitizeHtml from 'sanitize-html';

export type ValidationPhase = 'draft' | 'publish';
export type ValidationStatus = 'valid' | 'valid_with_warnings' | 'needs_review' | 'rejected';
export type ValidationIssue = { code: string; path: string; severity: 'warning' | 'review' | 'error'; message: string };
export type ValidationResult = { status: ValidationStatus; issues: ValidationIssue[]; stats: { nodes: number; depth: number; textLength: number } };

const nodes = new Set(['doc','paragraph','heading','text','blockquote','bulletList','orderedList','listItem','codeBlock','hardBreak','horizontalRule','table','tableRow','tableHeader','tableCell','figure','caption','callout','sourceReference','unknownBlock']);
const marks = new Set(['bold','italic','strike','code','link']);
const attributes: Record<string, Set<string>> = {
  doc: new Set(['schemaVersion']), heading: new Set(['level','anchorId']), orderedList: new Set(['start']), listItem: new Set(['checked','ordered']),
  codeBlock: new Set(['language','meta','filename','caption','highlightLines']), table: new Set(['style']), tableCell: new Set(['colspan','rowspan','colwidth','backgroundColor','align']), tableHeader: new Set(['colspan','rowspan','colwidth','backgroundColor','align']),
  figure: new Set(['mediaId','src','legacySrc','media','alt','caption','alignment','width','sourceReferenceId']), callout: new Set(['kind','tone','title']), sourceReference: new Set(['sourceId','locator','note','label']), unknownBlock: new Set(['originalType','payload','fallbackText']),
};
const safeLink = /^(https?:|mailto:|\/|#)/i;
const safeMedia = /^(\/images\/[A-Za-z0-9_./-]+|fixture:\/\/[A-Za-z0-9_./-]+)$/;
const dangerousKey = new Set(['__proto__','prototype','constructor']);

function issue(issues: ValidationIssue[], code: string, path: string, severity: ValidationIssue['severity'], message: string) { issues.push({ code, path, severity, message }); }
function scalarSize(value: unknown): number { try { return JSON.stringify(value).length; } catch { return Number.POSITIVE_INFINITY; } }
function hasDangerousKey(value: unknown, depth = 0): boolean {
  if (depth > 40 || !value || typeof value !== 'object') return false;
  return Object.entries(value).some(([key, child]) => dangerousKey.has(key) || hasDangerousKey(child, depth + 1));
}

export function validateDechiveDocument(document: JSONContent, phase: ValidationPhase): ValidationResult {
  const issues: ValidationIssue[] = [];
  const anchors = new Set<string>();
  let nodeCount = 0, maxDepth = 0, textLength = 0;
  if (document.type !== 'doc') issue(issues, 'root.type', '$', 'error', 'Root type must be doc.');
  const version = document.schemaVersion ?? document.attrs?.schemaVersion;
  if (version !== 1 && version !== 2) issue(issues, 'schema.version', '$', 'error', 'schemaVersion must be 1 or 2.');
  if (!Array.isArray(document.content)) issue(issues, 'root.content', '$', 'error', 'Root content must be an array.');
  if (hasDangerousKey(document)) issue(issues, 'object.prototype_key', '$', 'error', 'Prototype-significant keys are forbidden.');
  const visit = (node: JSONContent, path: string, depth: number) => {
    nodeCount += 1; maxDepth = Math.max(maxDepth, depth);
    if (nodeCount > 20_000) return;
    if (!node.type || !nodes.has(node.type)) issue(issues, 'node.unknown', path, phase === 'publish' ? 'error' : 'review', `Node ${node.type ?? '(missing)'} is not allowed.`);
    if (depth > 30) issue(issues, 'document.depth', path, 'error', 'Maximum nesting depth is 30.');
    if (node.type === 'text') { textLength += node.text?.length ?? 0; if ((node.text?.length ?? 0) > 200_000) issue(issues, 'text.node_too_large', path, 'error', 'A text node exceeds 200k characters.'); }
    for (const [key, value] of Object.entries(node.attrs ?? {})) {
      if (!attributes[node.type ?? '']?.has(key)) issue(issues, 'attribute.unknown', `${path}.attrs.${key}`, phase === 'publish' ? 'error' : 'review', 'Attribute is not allowlisted.');
      if (scalarSize(value) > 65_536) issue(issues, 'attribute.oversized', `${path}.attrs.${key}`, 'error', 'Attribute exceeds 64 KiB.');
      if (['title','note','label','fallbackText'].includes(key) && typeof value === 'string' && /<[^>]*>/.test(value)) issue(issues, 'attribute.markup', `${path}.attrs.${key}`, 'error', 'Markup is forbidden in text attributes.');
    }
    for (const [index, mark] of (node.marks ?? []).entries()) {
      if (!marks.has(mark.type)) issue(issues, 'mark.unknown', `${path}.marks[${index}]`, phase === 'publish' ? 'error' : 'review', `Mark ${mark.type} is not allowed.`);
      if (mark.type === 'link' && (typeof mark.attrs?.href !== 'string' || !safeLink.test(mark.attrs.href))) issue(issues, 'url.protocol', `${path}.marks[${index}].href`, 'error', 'Link protocol is forbidden.');
    }
    if (node.type === 'heading') {
      const level = node.attrs?.level; const anchor = node.attrs?.anchorId;
      if (!Number.isInteger(level) || Number(level) < 1 || Number(level) > 6) issue(issues, 'heading.level', path, 'error', 'Heading level must be 1..6.');
      if (typeof anchor !== 'string' || !anchor) issue(issues, 'heading.anchor_required', path, 'error', 'Heading anchorId is required.');
      else if (anchors.has(anchor)) issue(issues, 'heading.anchor_duplicate', path, 'error', 'Heading anchorId must be unique.'); else anchors.add(anchor);
    }
    if (node.type === 'figure') {
      const src = node.attrs?.media?.displayUrl ?? node.attrs?.src;
      const mediaId = typeof node.attrs?.mediaId === 'string' ? node.attrs.mediaId.trim() : '';
      if (!mediaId && (typeof src !== 'string' || !safeMedia.test(src))) issue(issues, 'media.reference', path, /^https?:/i.test(String(src)) ? 'review' : 'error', 'Publishable media must use an internal /images path or an approved media identity.');
      if (mediaId && typeof src !== 'string') issue(issues, 'media.reference', path, 'error', 'Media identity requires a source URL.');
      if (!node.attrs?.alt) issue(issues, 'media.alt_missing', path, 'error', 'Figure alt is required.');
    }
    if (node.type === 'unknownBlock') issue(issues, 'node.unknown_quarantined', path, phase === 'publish' ? 'error' : 'review', 'Unknown payload is preserved but cannot be published.');
    if (node.type === 'sourceReference' && typeof node.attrs?.sourceId !== 'string') issue(issues, 'source.id', path, 'error', 'sourceId is required.');
    if (node.type === 'table' && node.content?.some((child) => child.type !== 'tableRow')) issue(issues, 'table.child', path, 'error', 'Table may only contain tableRow nodes.');
    if (node.type === 'tableRow' && (!node.content?.length || node.content.some((child) => !['tableCell','tableHeader'].includes(child.type ?? '')))) issue(issues, 'table.row_child', path, 'error', 'Table row requires cell/header children.');
    if (['tableCell','tableHeader'].includes(node.type ?? '') && !node.content?.length) issue(issues, 'table.cell_empty', path, 'error', 'Table cell requires block content.');
    node.content?.forEach((child, index) => visit(child, `${path}.content[${index}]`, depth + 1));
  };
  document.content?.forEach((child, index) => visit(child, `$.content[${index}]`, 1));
  if (nodeCount > 20_000) issue(issues, 'document.node_count', '$', 'error', 'Maximum node count is 20,000.');
  if (textLength > 2_000_000) issue(issues, 'document.text_length', '$', 'error', 'Maximum document text is 2M characters.');
  const severities = new Set(issues.map((entry) => entry.severity));
  const status: ValidationStatus = severities.has('error') ? 'rejected' : severities.has('review') ? 'needs_review' : severities.has('warning') ? 'valid_with_warnings' : 'valid';
  return { status, issues, stats: { nodes: nodeCount, depth: maxDepth, textLength } };
}

export function sanitizeImportedHtml(input: string): { html: string; changed: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const html = sanitizeHtml(input, {
    allowedTags: ['p','br','h1','h2','h3','h4','h5','h6','strong','b','em','i','s','code','pre','blockquote','ul','ol','li','a','table','thead','tbody','tr','th','td','figure','figcaption','aside','hr','img'],
    allowedAttributes: { a: ['href','title'], img: ['src','alt'], th: ['colspan','rowspan'], td: ['colspan','rowspan'], aside: ['data-callout','data-source-reference'], figure: ['data-dechive-figure'] },
    allowedSchemes: ['http','https','mailto'], allowedSchemesByTag: { img: [] }, allowProtocolRelative: false,
    transformTags: {
      a: (_tag, attrs) => safeLink.test(attrs.href ?? '') ? { tagName: 'a', attribs: attrs } : (warnings.push('unsafe_link_removed'), { tagName: 'span', attribs: {} }),
      img: (_tag, attrs) => safeMedia.test(attrs.src ?? '') ? { tagName: 'img', attribs: attrs } : (warnings.push('external_or_invalid_image_quarantined'), { tagName: 'span', attribs: { 'data-image-quarantined': 'true' } }),
    },
    exclusiveFilter: (frame) => { if (['script','iframe','svg','style'].includes(frame.tag)) warnings.push(`unsafe_tag_removed:${frame.tag}`); return false; },
  });
  return { html, changed: html !== input, warnings: [...new Set(warnings)] };
}

export function assertSafeRenderedHtml(html: string): string[] {
  const failures: string[] = [];
  for (const pattern of [/<script/i,/\son\w+\s*=/i,/javascript:/i,/data:text\/html/i,/<iframe/i,/<svg/i,/<style/i]) if (pattern.test(html)) failures.push(pattern.source);
  return failures;
}
