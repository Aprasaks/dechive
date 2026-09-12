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
  image?: {
    url: string;
    alt: string;
    width: number | null;
    height: number | null;
  } | null;
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

type JsonRecord = { [key: string]: Json | undefined };

function isJsonRecord(value: Json | undefined): value is JsonRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function labeledLinks(
  value: Json | undefined,
  labelKeys: string[],
): { label: string; url: string }[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isJsonRecord(item) || typeof item.url !== 'string') {
      return [];
    }

    const label = labelKeys
      .map((key) => item[key])
      .find((candidate): candidate is string => typeof candidate === 'string');

    return label ? [{ label, url: item.url }] : [];
  });
}

function timestampItems(
  value: Json | undefined,
): { time: string; label: string }[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isJsonRecord(item)) {
      return [];
    }

    const time = typeof item.time === 'string' ? item.time : null;
    const label = typeof item.label === 'string' ? item.label : null;
    return time && label ? [{ time, label }] : [];
  });
}

export type PublicBaseDetail = PublicContentSummary & {
  revisionId: string;
  revisionNumber: number;
  bodyJson: Json;
  cover: {
    url: string;
    alt: string;
    caption: string | null;
  } | null;
};

export type PublicLectureDetail = PublicBaseDetail & {
  introduction: string;
  learningObjectives: string[];
  youtubeUrl: string | null;
  timestamps: { time: string; label: string }[];
  materials: { label: string; url: string }[];
};

export type PublicPracticeDetail = PublicBaseDetail & {
  resultDescription: string;
  demoUrl: string | null;
  requirements: string;
  tools: string[];
  estimatedCost: string | null;
};

export type PublicAiUpdateDetail = PublicBaseDetail & {
  updateDate: string;
  changeSummary: string;
};

export type PublicBookDetail = PublicBaseDetail & {
  author: string;
  publisher: string | null;
  publicationDate: string | null;
  isbn: string | null;
  pageCount: number | null;
  format: string | null;
  purchaseLinks: { label: string; url: string }[];
  tableOfContents: string[];
  preview: string | null;
};

async function getPublishedBaseDetail(
  type: Exclude<ContentType, 'knowledge'>,
  slug: string,
): Promise<PublicBaseDetail | null> {
  const supabase = await createClient();
  const { data: content, error: contentError } = await supabase
    .from('contents')
    .select(
      'id,type,slug,published_at,last_verified_at,current_revision_id',
    )
    .eq('type', type)
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

  const { data: revision, error: revisionError } = await supabase
    .from('content_revisions')
    .select(
      'id,revision_number,title,summary,body_json,verified_at,published_at',
    )
    .eq('id', content.current_revision_id)
    .maybeSingle();

  if (revisionError) {
    throw revisionError;
  }

  if (!revision) {
    return null;
  }

  const { data: coverLink } = await supabase
    .from('revision_assets')
    .select('asset_id,caption')
    .eq('revision_id', revision.id)
    .eq('usage', 'cover')
    .order('position')
    .limit(1)
    .maybeSingle();
  const { data: coverAsset } = coverLink
    ? await supabase
        .from('assets')
        .select('bucket_id,object_path,alt_text,original_filename')
        .eq('id', coverLink.asset_id)
        .maybeSingle()
    : { data: null };
  const cover = coverAsset
    ? {
        url: supabase.storage
          .from(coverAsset.bucket_id)
          .getPublicUrl(coverAsset.object_path).data.publicUrl,
        alt: coverAsset.alt_text ?? coverAsset.original_filename,
        caption: coverLink?.caption ?? null,
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
    revisionId: revision.id,
    revisionNumber: revision.revision_number,
    bodyJson: revision.body_json,
    cover,
  };
}

export async function getPublishedLectureDetail(
  slug: string,
): Promise<PublicLectureDetail | null> {
  const base = await getPublishedBaseDetail('lecture', slug);
  if (!base) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lecture_revision_details')
    .select(
      'introduction,learning_objectives,youtube_url,timestamps,materials',
    )
    .eq('revision_id', base.revisionId)
    .maybeSingle();

  if (error) throw error;

  return {
    ...base,
    introduction: data?.introduction ?? '',
    learningObjectives: stringArray(data?.learning_objectives),
    youtubeUrl: data?.youtube_url ?? null,
    timestamps: timestampItems(data?.timestamps),
    materials: labeledLinks(data?.materials, ['label', 'title', 'name']),
  };
}

export async function getPublishedPracticeDetail(
  slug: string,
): Promise<PublicPracticeDetail | null> {
  const base = await getPublishedBaseDetail('practice', slug);
  if (!base) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('practice_revision_details')
    .select(
      'result_description,demo_url,requirements,tools,estimated_cost',
    )
    .eq('revision_id', base.revisionId)
    .maybeSingle();

  if (error) throw error;

  return {
    ...base,
    resultDescription: data?.result_description ?? '',
    demoUrl: data?.demo_url ?? null,
    requirements: data?.requirements ?? '',
    tools: stringArray(data?.tools),
    estimatedCost: data?.estimated_cost ?? null,
  };
}

export async function getPublishedAiUpdateDetail(
  slug: string,
): Promise<PublicAiUpdateDetail | null> {
  const base = await getPublishedBaseDetail('ai_update', slug);
  if (!base) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ai_update_revision_details')
    .select('update_date,change_summary')
    .eq('revision_id', base.revisionId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...base,
    updateDate: data.update_date,
    changeSummary: data.change_summary,
  };
}

export async function getPublishedBookDetail(
  slug: string,
): Promise<PublicBookDetail | null> {
  const base = await getPublishedBaseDetail('book', slug);
  if (!base) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('book_revision_details')
    .select(
      'author,publisher,publication_date,isbn,page_count,format,purchase_links,table_of_contents,preview',
    )
    .eq('revision_id', base.revisionId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...base,
    author: data.author,
    publisher: data.publisher,
    publicationDate: data.publication_date,
    isbn: data.isbn,
    pageCount: data.page_count,
    format: data.format,
    purchaseLinks: labeledLinks(data.purchase_links, [
      'store',
      'label',
      'name',
    ]),
    tableOfContents: stringArray(data.table_of_contents),
    preview: data.preview,
  };
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

  const { data: imageLinks, error: imageLinksError } = await supabase
    .from('revision_assets')
    .select('revision_id,asset_id,usage,position')
    .in('revision_id', revisionIds)
    .eq('usage', 'cover')
    .order('position');

  if (imageLinksError) {
    throw imageLinksError;
  }

  const imageLinkByRevision = new Map<string, string>();

  for (const link of imageLinks ?? []) {
    if (link.usage !== 'cover' || imageLinkByRevision.has(link.revision_id)) {
      continue;
    }

    imageLinkByRevision.set(link.revision_id, link.asset_id);
  }

  const imageAssetIds = Array.from(imageLinkByRevision.values());
  const { data: imageAssets, error: imageAssetsError } =
    imageAssetIds.length > 0
      ? await supabase
          .from('assets')
          .select(
            'id,bucket_id,object_path,alt_text,original_filename,width,height',
          )
          .in('id', imageAssetIds)
          .is('deleted_at', null)
      : { data: [], error: null };

  if (imageAssetsError) {
    throw imageAssetsError;
  }

  const imageAssetsById = new Map(
    (imageAssets ?? []).map((asset) => [asset.id, asset]),
  );

  return (contents ?? []).flatMap((content) => {
    const revision = content.current_revision_id
      ? revisionsById.get(content.current_revision_id)
      : undefined;

    if (!revision || !content.published_at) {
      return [];
    }

    const imageAssetId = imageLinkByRevision.get(revision.id);
    const imageAsset = imageAssetId
      ? imageAssetsById.get(imageAssetId)
      : undefined;
    const image = imageAsset
      ? {
          url: supabase.storage
            .from(imageAsset.bucket_id)
            .getPublicUrl(imageAsset.object_path).data.publicUrl,
          alt: imageAsset.alt_text ?? imageAsset.original_filename,
          width: imageAsset.width,
          height: imageAsset.height,
        }
      : null;

    return [
      {
        id: content.id,
        type: content.type,
        slug: content.slug,
        title: revision.title,
        summary: revision.summary,
        publishedAt: revision.published_at,
        verifiedAt: content.last_verified_at,
        image,
      },
    ];
  });
}

export async function searchPublishedContent(
  query: string,
  limit = 40,
): Promise<PublicContentSummary[]> {
  const terms = query
    .trim()
    .toLocaleLowerCase('ko-KR')
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) {
    return [];
  }

  const candidates = await getPublishedContent(undefined, 500);

  return candidates
    .filter((item) => {
      const searchable = `${item.title} ${item.summary}`.toLocaleLowerCase(
        'ko-KR',
      );
      return terms.every((term) => searchable.includes(term));
    })
    .slice(0, limit);
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
