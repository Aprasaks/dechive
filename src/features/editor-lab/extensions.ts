import { mergeAttributes, Node } from '@tiptap/core';
import Heading from '@tiptap/extension-heading';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { slugifyAnchor } from './document';

function proseText(node: ProseMirrorNode): string { return node.textContent; }

export const DechiveDoc = Node.create({
  name: 'doc', topNode: true, content: 'block+',
  addAttributes() { return { schemaVersion: { default: 1 } }; },
});

export const PersistentHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      anchorId: {
        default: null,
        parseHTML: (element) => element.getAttribute('id'),
        renderHTML: (attributes) => attributes.anchorId ? { id: attributes.anchorId } : {},
      },
    };
  },
  addProseMirrorPlugins() {
    return [new Plugin({
      key: new PluginKey('dechivePersistentHeading'),
      appendTransaction: (_transactions, _oldState, newState) => {
        const used = new Set<string>();
        const updates: Array<{ pos: number; attrs: Record<string, unknown> }> = [];
        newState.doc.descendants((node, pos) => {
          if (node.type.name !== this.name) return;
          const base = typeof node.attrs.anchorId === 'string' && node.attrs.anchorId
            ? node.attrs.anchorId : slugifyAnchor(proseText(node));
          let anchorId = base;
          let suffix = 2;
          while (used.has(anchorId)) anchorId = `${base}-${suffix++}`;
          used.add(anchorId);
          if (anchorId !== node.attrs.anchorId) updates.push({ pos, attrs: { ...node.attrs, anchorId } });
        });
        if (!updates.length) return null;
        const transaction = newState.tr;
        updates.forEach(({ pos, attrs }) => transaction.setNodeMarkup(pos, undefined, attrs));
        return transaction;
      },
    })];
  },
});

export const Figure = Node.create({
  name: 'figure', group: 'block', content: 'caption?', isolating: true, draggable: true,
  addAttributes() { return {
    mediaId: { default: null }, src: { default: '' }, legacySrc: { default: null }, media: { default: null }, alt: { default: '' }, caption: { default: '' },
    alignment: { default: 'center' }, width: { default: 100 }, sourceReferenceId: { default: null },
  }; },
  parseHTML() { return [{ tag: 'figure[data-dechive-figure]' }]; },
  renderHTML({ HTMLAttributes }) {
    const attrs = { ...HTMLAttributes };
    const media = attrs.media as { displayUrl?: string; width?: number | null; height?: number | null } | null;
    const imageAttributes: Record<string, string | number> = {
      src: media?.displayUrl ?? attrs.src,
      alt: attrs.alt,
      loading: 'lazy',
      decoding: 'async',
    };
    if (typeof media?.width === 'number') imageAttributes.width = media.width;
    if (typeof media?.height === 'number') imageAttributes.height = media.height;
    return ['figure', mergeAttributes({ 'data-dechive-figure': '', 'data-media-id': attrs.mediaId ?? undefined }),
      ['img', imageAttributes],
      ['div', { 'data-caption-slot': '' }, 0]];
  },
});

export const Caption = Node.create({
  name: 'caption', content: 'inline*', defining: true,
  parseHTML() { return [{ tag: 'figcaption' }]; },
  renderHTML({ HTMLAttributes }) { return ['figcaption', HTMLAttributes, 0]; },
});

export const SourceReference = Node.create({
  name: 'sourceReference', group: 'block', atom: true,
  addAttributes() { return { sourceId: { default: '' }, locator: { default: '' }, note: { default: '' }, label: { default: '출처' } }; },
  parseHTML() { return [{ tag: 'aside[data-source-reference]' }]; },
  renderHTML({ HTMLAttributes }) { const locator = typeof HTMLAttributes.locator === 'object' ? HTMLAttributes.locator?.value : HTMLAttributes.locator; return ['aside', mergeAttributes(HTMLAttributes, { 'data-source-reference': '', role: 'note' }), `${HTMLAttributes.label}: ${HTMLAttributes.note}${locator ? ` (${String(locator)})` : ''}`]; },
});

export const Callout = Node.create({
  name: 'callout', group: 'block', content: 'block+', defining: true,
  addAttributes() { return { kind: { default: 'info' }, tone: { default: null }, title: { default: '참고' } }; },
  parseHTML() { return [{ tag: 'aside[data-callout]' }]; },
  renderHTML({ HTMLAttributes }) { return ['aside', mergeAttributes(HTMLAttributes, { 'data-callout': '', role: 'note' }), ['strong', {}, String(HTMLAttributes.title)], ['div', 0]]; },
});

export const UnknownBlock = Node.create({
  name: 'unknownBlock', group: 'block', atom: true, selectable: true,
  addAttributes() { return { originalType: { default: 'unknown' }, payload: { default: null }, fallbackText: { default: '' } }; },
  parseHTML() { return [{ tag: 'aside[data-unknown-node]' }]; },
  renderHTML({ HTMLAttributes }) { return ['aside', { 'data-unknown-node': String(HTMLAttributes.originalType), role: 'alert' }, `지원하지 않는 노드: ${String(HTMLAttributes.originalType)} — ${String(HTMLAttributes.fallbackText ?? '')}`]; },
});
