import type { JSONContent } from '@tiptap/core';
import type { DechiveDocument } from './document';
import { validateDechiveDocument } from './security';

export type MigrationEntry = { from: number; to: number; changes: string[]; checksumBefore: string; checksumAfter: string };
const stable = (value: unknown) => JSON.stringify(value);
async function digest(value: unknown) { const bytes = new TextEncoder().encode(stable(value)); const result = await crypto.subtle.digest('SHA-256', bytes); return Array.from(new Uint8Array(result), (byte) => byte.toString(16).padStart(2,'0')).join(''); }

export async function migrateV1ToV2(source: DechiveDocument): Promise<{ source: DechiveDocument; document: DechiveDocument; log: MigrationEntry; status: 'migrated' | 'needs_review' }> {
  if (source.schemaVersion !== 1) throw new Error('Expected schema v1.');
  const changes = new Set<string>();
  const visit = (node: JSONContent): JSONContent => {
    const content = node.content?.map(visit);
    if (node.type === 'figure') { changes.add('figure_media_envelope'); const { mediaId, src, legacySrc, ...rest } = node.attrs ?? {}; return { ...node, attrs: { ...rest, media: { id: mediaId ?? null, displayUrl: src ?? '', legacySrc: legacySrc ?? null } }, ...(content ? { content } : {}) }; }
    if (node.type === 'callout') { changes.add('callout_kind_to_tone'); const { kind, ...rest } = node.attrs ?? {}; return { ...node, attrs: { ...rest, tone: kind === 'info' ? 'informational' : kind ?? 'informational' }, ...(content ? { content } : {}) }; }
    if (node.type === 'sourceReference' && typeof node.attrs?.locator === 'string') { changes.add('structured_source_locator'); return { ...node, attrs: { ...node.attrs, locator: { value: node.attrs.locator, label: null } }, ...(content ? { content } : {}) }; }
    return { ...node, ...(content ? { content } : {}) };
  };
  const document = { ...visit(source), type: 'doc', schemaVersion: 2 } as DechiveDocument;
  const validation = validateDechiveDocument(document, 'publish');
  return { source, document, log: { from: 1, to: 2, changes: [...changes].sort(), checksumBefore: await digest(source), checksumAfter: await digest(document) }, status: validation.status === 'rejected' ? 'needs_review' : 'migrated' };
}
