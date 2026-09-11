import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireOwner } from '@/lib/auth/require-owner';
import type { Json } from '@/lib/supabase/database.types';
import { DraftEditor } from './DraftEditor';

export const metadata: Metadata = {
  title: '초안 작성',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

function getLearningObjectives(metadata: Json) {
  if (
    typeof metadata !== 'object' ||
    metadata === null ||
    Array.isArray(metadata) ||
    !Array.isArray(metadata.learningObjectives)
  ) {
    return '';
  }

  return metadata.learningObjectives
    .filter((item): item is string => typeof item === 'string')
    .join('\n');
}

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ contentId: string }>;
}) {
  const { contentId } = await params;
  const { supabase } = await requireOwner();
  const [contentResult, draftResult] = await Promise.all([
    supabase
      .from('contents')
      .select('id,type,slug,status')
      .eq('id', contentId)
      .is('deleted_at', null)
      .maybeSingle(),
    supabase
      .from('content_drafts')
      .select('content_id,title,summary,body_json,metadata,version,updated_at')
      .eq('content_id', contentId)
      .maybeSingle(),
  ]);

  if (
    contentResult.error ||
    draftResult.error ||
    !contentResult.data ||
    !draftResult.data
  ) {
    notFound();
  }

  const content = contentResult.data;
  const draft = draftResult.data;

  return (
    <DraftEditor
      contentId={content.id}
      contentType={content.type}
      initialDraft={{
        title: draft.title,
        slug: content.slug,
        summary: draft.summary,
        learningObjectivesText: getLearningObjectives(draft.metadata),
        bodyJson: draft.body_json,
      }}
      initialUpdatedAt={draft.updated_at}
      initialVersion={draft.version}
    />
  );
}
