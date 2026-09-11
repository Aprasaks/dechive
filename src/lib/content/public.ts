import type { ContentType } from '@/lib/supabase/database.types';
import { createClient } from '@/lib/supabase/server';

export type PublicContentSummary = {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  verifiedAt: string | null;
};

export async function getPublishedContent(
  type?: ContentType,
  limit = 12,
): Promise<PublicContentSummary[]> {
  const supabase = await createClient();

  let query = supabase
    .from('contents')
    .select(
      'id,type,slug,published_at,last_verified_at,current_revision_id',
    )
    .eq('status', 'published')
    .eq('visibility', 'public')
    .is('deleted_at', null)
    .not('current_revision_id', 'is', null)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (type) {
    query = query.eq('type', type);
  }

  const { data: contents, error: contentsError } = await query;

  if (contentsError) {
    throw contentsError;
  }

  const revisionIds = (contents ?? [])
    .map((item) => item.current_revision_id)
    .filter((id): id is string => Boolean(id));

  if (revisionIds.length === 0) {
    return [];
  }

  const { data: revisions, error: revisionsError } = await supabase
    .from('content_revisions')
    .select('id,title,summary,published_at')
    .in('id', revisionIds);

  if (revisionsError) {
    throw revisionsError;
  }

  const revisionsById = new Map(
    (revisions ?? []).map((revision) => [revision.id, revision]),
  );

  return (contents ?? []).flatMap((content) => {
    const revision = content.current_revision_id
      ? revisionsById.get(content.current_revision_id)
      : undefined;

    if (!revision || !content.published_at) {
      return [];
    }

    return [
      {
        id: content.id,
        type: content.type,
        slug: content.slug,
        title: revision.title,
        summary: revision.summary,
        publishedAt: revision.published_at,
        verifiedAt: content.last_verified_at,
      },
    ];
  });
}
