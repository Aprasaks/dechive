import type {
  ContentType,
  Json,
} from '@/lib/supabase/database.types';
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

export type PublicKnowledgeDetail = PublicContentSummary & {
  revisionId: string;
  revisionNumber: number;
  bodyJson: Json;
  learningObjectives: string[];
  tocEnabled: boolean;
  verificationStatus:
    | 'unverified'
    | 'reviewed'
    | 'verified'
    | 'needs_review';
  cover: {
    url: string;
    alt: string;
    width: number | null;
    height: number | null;
    caption: string | null;
  } | null;
  sources: {
    id: string;
    title: string;
    url: string;
    publisher: string | null;
    relationship: string;
    claimNote: string | null;
  }[];
  relations: (PublicContentSummary & {
    relationType: string;
    note: string | null;
  })[];
  tags: {
    slug: string;
    label: string;
  }[];
};

function stringArray(value: Json | undefined): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

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

export async function getPublishedKnowledgeDetail(
  slug: string,
): Promise<PublicKnowledgeDetail | null> {
  const supabase = await createClient();
  const { data: content, error: contentError } = await supabase
    .from('contents')
    .select(
      'id,type,slug,published_at,last_verified_at,current_revision_id',
    )
    .eq('type', 'knowledge')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .is('deleted_at', null)
    .maybeSingle();

  if (contentError) {
    throw contentError;
  }

  if (!content?.current_revision_id || !content.published_at) {
    return null;
  }

  const revisionId = content.current_revision_id;
  const [
    revisionResult,
    detailResult,
    sourceLinksResult,
    relationLinksResult,
    tagLinksResult,
    coverLinkResult,
  ] = await Promise.all([
    supabase
      .from('content_revisions')
      .select(
        'id,revision_number,title,summary,body_json,verification_status,verified_at,published_at',
      )
      .eq('id', revisionId)
      .maybeSingle(),
    supabase
      .from('knowledge_revision_details')
      .select('learning_objectives,toc_enabled')
      .eq('revision_id', revisionId)
      .maybeSingle(),
    supabase
      .from('revision_sources')
      .select('source_id,relationship,claim_note,position')
      .eq('revision_id', revisionId)
      .order('position'),
    supabase
      .from('content_relations')
      .select('to_content_id,relation_type,note,position')
      .eq('from_revision_id', revisionId)
      .order('position'),
    supabase
      .from('revision_tags')
      .select('tag_id,position')
      .eq('revision_id', revisionId)
      .order('position'),
    supabase
      .from('revision_assets')
      .select('asset_id,caption')
      .eq('revision_id', revisionId)
      .eq('usage', 'cover')
      .order('position')
      .limit(1)
      .maybeSingle(),
  ]);

  if (revisionResult.error) {
    throw revisionResult.error;
  }

  const revision = revisionResult.data;

  if (!revision) {
    return null;
  }

  const sourceLinks = sourceLinksResult.data ?? [];
  const relationLinks = relationLinksResult.data ?? [];
  const tagLinks = tagLinksResult.data ?? [];
  const sourceIds = sourceLinks.map((item) => item.source_id);
  const relationIds = relationLinks.map((item) => item.to_content_id);
  const tagIds = tagLinks.map((item) => item.tag_id);
  const coverAssetId = coverLinkResult.data?.asset_id;

  const [sourcesResult, relationContentsResult, tagsResult, coverResult] =
    await Promise.all([
      sourceIds.length > 0
        ? supabase
            .from('sources')
            .select('id,title,url,publisher')
            .in('id', sourceIds)
        : Promise.resolve({ data: [], error: null }),
      relationIds.length > 0
        ? supabase
            .from('contents')
            .select(
              'id,type,slug,published_at,last_verified_at,current_revision_id',
            )
            .in('id', relationIds)
            .eq('status', 'published')
            .eq('visibility', 'public')
            .is('deleted_at', null)
        : Promise.resolve({ data: [], error: null }),
      tagIds.length > 0
        ? supabase.from('tags').select('id,slug,label').in('id', tagIds)
        : Promise.resolve({ data: [], error: null }),
      coverAssetId
        ? supabase
            .from('assets')
            .select(
              'id,bucket_id,object_path,alt_text,width,height,original_filename',
            )
            .eq('id', coverAssetId)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);

  const relationRevisionIds = (relationContentsResult.data ?? [])
    .map((item) => item.current_revision_id)
    .filter((id): id is string => Boolean(id));
  const relationRevisionsResult =
    relationRevisionIds.length > 0
      ? await supabase
          .from('content_revisions')
          .select('id,title,summary,published_at')
          .in('id', relationRevisionIds)
      : { data: [], error: null };

  const sourcesById = new Map(
    (sourcesResult.data ?? []).map((item) => [item.id, item]),
  );
  const tagsById = new Map(
    (tagsResult.data ?? []).map((item) => [item.id, item]),
  );
  const relationRevisionsById = new Map(
    (relationRevisionsResult.data ?? []).map((item) => [item.id, item]),
  );
  const relationLinksById = new Map(
    relationLinks.map((item) => [item.to_content_id, item]),
  );
  const coverAsset = coverResult.data;
  const cover = coverAsset
    ? {
        url: supabase.storage
          .from(coverAsset.bucket_id)
          .getPublicUrl(coverAsset.object_path).data.publicUrl,
        alt: coverAsset.alt_text ?? coverAsset.original_filename,
        width: coverAsset.width,
        height: coverAsset.height,
        caption: coverLinkResult.data?.caption ?? null,
      }
    : null;

  return {
    id: content.id,
    type: content.type,
    slug: content.slug,
    title: revision.title,
    summary: revision.summary,
    publishedAt: revision.published_at,
    verifiedAt: revision.verified_at ?? content.last_verified_at,
    revisionId,
    revisionNumber: revision.revision_number,
    bodyJson: revision.body_json,
    learningObjectives: stringArray(
      detailResult.data?.learning_objectives,
    ),
    tocEnabled: detailResult.data?.toc_enabled ?? true,
    verificationStatus: revision.verification_status,
    cover,
    sources: sourceLinks.flatMap((link) => {
      const source = sourcesById.get(link.source_id);
      return source
        ? [
            {
              id: source.id,
              title: source.title,
              url: source.url,
              publisher: source.publisher,
              relationship: link.relationship,
              claimNote: link.claim_note,
            },
          ]
        : [];
    }),
    relations: (relationContentsResult.data ?? []).flatMap((target) => {
      const targetRevision = target.current_revision_id
        ? relationRevisionsById.get(target.current_revision_id)
        : undefined;
      const relation = relationLinksById.get(target.id);

      if (!targetRevision || !relation || !target.published_at) {
        return [];
      }

      return [
        {
          id: target.id,
          type: target.type,
          slug: target.slug,
          title: targetRevision.title,
          summary: targetRevision.summary,
          publishedAt: targetRevision.published_at,
          verifiedAt: target.last_verified_at,
          relationType: relation.relation_type,
          note: relation.note,
        },
      ];
    }),
    tags: tagLinks.flatMap((link) => {
      const tag = tagsById.get(link.tag_id);
      return tag ? [{ slug: tag.slug, label: tag.label }] : [];
    }),
  };
}
