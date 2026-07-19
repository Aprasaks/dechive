import StarterKit from '@tiptap/starter-kit';
import { TableKit } from '@tiptap/extension-table';
import { Caption, Callout, DechiveDoc, Figure, PersistentHeading, SourceReference, UnknownBlock } from './extensions';

export const editorExtensions = [
  DechiveDoc,
  StarterKit.configure({ document: false, heading: false }),
  PersistentHeading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
  TableKit.configure({ table: { resizable: true } }),
  Caption,
  Figure,
  SourceReference,
  Callout,
  UnknownBlock,
];
