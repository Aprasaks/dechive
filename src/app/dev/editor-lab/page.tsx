import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EditorLabClient } from '@/features/editor-lab/EditorLabClient';
import { loadEditorFixtures } from '@/features/editor-lab/server-fixtures';

export const metadata: Metadata = { title: 'Editor Runtime Lab · Dechive', robots: { index: false, follow: false, nocache: true } };
export const dynamic = 'force-dynamic';

export default async function EditorLabPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  const fixtures = await loadEditorFixtures();
  return <EditorLabClient fixtures={fixtures} />;
}
