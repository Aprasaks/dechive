import { Node } from '@tiptap/core';

export const DechiveImage = Node.create({
  name: 'image',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      assetId: { default: null },
      src: { default: null },
      alt: { default: '' },
      caption: { default: '' },
      width: { default: null },
      height: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-asset-id]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const image = element.querySelector('img');
          if (!image) return false;

          return {
            assetId: element.dataset.assetId ?? null,
            src: image.src,
            alt: image.alt,
            caption:
              element.querySelector('figcaption')?.textContent ??
              element.dataset.caption ??
              '',
            width: image.width || null,
            height: image.height || null,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      {
        class: 'editor-inline-image',
        'data-asset-id': HTMLAttributes.assetId,
        'data-caption': HTMLAttributes.caption ?? '',
      },
      [
        'img',
        {
          src: HTMLAttributes.src,
          alt: HTMLAttributes.alt ?? '',
          width: HTMLAttributes.width,
          height: HTMLAttributes.height,
        },
      ],
      HTMLAttributes.caption
        ? ['figcaption', {}, HTMLAttributes.caption]
        : ['figcaption', { hidden: 'hidden' }, ''],
    ];
  },
});
