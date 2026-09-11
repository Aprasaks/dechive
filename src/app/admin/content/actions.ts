'use server';

import { createHash, randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth/require-owner';
import { getContentSection } from '@/lib/content/catalog';
import { deriveContentArtifacts } from '@/lib/content/artifacts';
import type { ContentType, Json } from '@/lib/supabase/database.types';

const CONTENT_TYPES: readonly ContentType[] = [
  'knowledge',
  'lecture',
  'practice',
  'ai_update',
  'book',
];

export type CreateContentState = {
  error: string | null;
};

export type SaveDraftInput = {
  contentId: string;
  expectedVersion: number;
  slug: string;
  title: string;
  summary: string;
  bodyJson: Json;
  metadata: Json;
};

export type SaveDraftResult =
  | {
      ok: true;
      version: number;
      updatedAt: string;
    }
  | {
      ok: false;
      conflict: boolean;
      error: string;
    };

export type PublishDraftInput = {
  contentId: string;
  expectedVersion: number;
};

export type PublishDraftResult =
  | {
      ok: true;
      revisionNumber: number;
      publishedAt: string;
    }
  | {
      ok: false;
      conflict: boolean;
      error: string;
    };

function isContentType(value: string): value is ContentType {
  return CONTENT_TYPES.some((type) => type === value);
}

function isTiptapDocument(value: Json): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    value.type === 'doc'
  );
}

function isJsonObject(value: Json): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function createInitialSlug(type: ContentType) {
  return `${type.replace('_', '-')}-${Date.now().toString(36)}-${randomUUID().slice(0, 6)}`;
}

export async function createContent(
  _previousState: CreateContentState,
  formData: FormData,
): Promise<CreateContentState> {
  const rawType = formData.get('type');
  const rawTitle = formData.get('title');

  if (
    typeof rawType !== 'string' ||
    !isContentType(rawType) ||
    typeof rawTitle !== 'string' ||
    !rawTitle.trim()
  ) {
    return { error: '콘텐츠 유형과 제목을 확인해 주세요.' };
  }

  const { supabase } = await requireOwner();
  const { data: contentId, error } = await supabase.rpc(
    'create_content_draft',
    {
      p_type: rawType,
      p_slug: createInitialSlug(rawType),
      p_title: rawTitle.trim(),
    },
  );

  if (error || !contentId) {
    return { error: '초안을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.' };
  }

  redirect(`/admin/content/${contentId}/edit`);
}

export async function saveDraft(
  input: SaveDraftInput,
): Promise<SaveDraftResult> {
  if (
    !input.contentId ||
    !Number.isInteger(input.expectedVersion) ||
    input.expectedVersion < 1 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug) ||
    !isTiptapDocument(input.bodyJson) ||
    !isJsonObject(input.metadata)
  ) {
    return {
      ok: false,
      conflict: false,
      error: '제목과 주소를 확인한 뒤 다시 저장해 주세요.',
    };
  }

  const { supabase } = await requireOwner();
  const { data, error } = await supabase.rpc('save_content_draft', {
    p_content_id: input.contentId,
    p_expected_version: input.expectedVersion,
    p_slug: input.slug,
    p_title: input.title.trim(),
    p_summary: input.summary.trim(),
    p_body_json: input.bodyJson,
    p_metadata: input.metadata,
  });

  const saved = data?.[0];

  if (error || !saved) {
    const conflict = error?.code === '40001';

    return {
      ok: false,
      conflict,
      error: conflict
        ? '다른 화면에서 이 초안이 변경됐습니다. 새로고침 후 다시 확인해 주세요.'
        : '저장하지 못했습니다. 작성 내용은 화면에 남아 있습니다.',
    };
  }

  return {
    ok: true,
    version: saved.version,
    updatedAt: saved.updated_at,
  };
}

export async function publishDraft(
  input: PublishDraftInput,
): Promise<PublishDraftResult> {
  if (
    !input.contentId ||
    !Number.isInteger(input.expectedVersion) ||
    input.expectedVersion < 1
  ) {
    return {
      ok: false,
      conflict: false,
      error: '먼저 초안을 저장한 뒤 다시 발행해 주세요.',
    };
  }

  const { supabase } = await requireOwner();
  const { data: content, error: contentError } = await supabase
    .from('contents')
    .select('id,type,slug')
    .eq('id', input.contentId)
    .is('deleted_at', null)
    .maybeSingle();
  const { data: draft, error: draftError } = await supabase
    .from('content_drafts')
    .select('title,summary,body_json,metadata,version')
    .eq('content_id', input.contentId)
    .maybeSingle();

  if (contentError || draftError || !content || !draft) {
    return {
      ok: false,
      conflict: false,
      error: '발행할 초안을 불러오지 못했습니다.',
    };
  }

  if (draft.version !== input.expectedVersion) {
    return {
      ok: false,
      conflict: true,
      error: '저장 중인 변경이 있습니다. 저장 완료 후 다시 발행해 주세요.',
    };
  }

  if (!draft.title.trim()) {
    return {
      ok: false,
      conflict: false,
      error: '제목을 입력해 주세요.',
    };
  }

  const artifacts = deriveContentArtifacts(draft.body_json);
  if (!artifacts.plainText) {
    return {
      ok: false,
      conflict: false,
      error: '본문을 한 문장 이상 작성해 주세요.',
    };
  }

  const checksum = createHash('sha256')
    .update(
      JSON.stringify({
        title: draft.title,
        summary: draft.summary,
        body: draft.body_json,
        metadata: draft.metadata,
      }),
    )
    .digest('hex');
  const { data, error } = await supabase.rpc('publish_content', {
    p_content_id: input.contentId,
    p_expected_version: input.expectedVersion,
    p_body_checksum: checksum,
    p_html: artifacts.html,
    p_plain_text: artifacts.plainText,
    p_markdown: artifacts.markdown,
  });
  const publication = data?.[0];

  if (error || !publication) {
    const conflict = error?.code === '40001';
    const unchanged = error?.code === '23505';
    return {
      ok: false,
      conflict,
      error: conflict
        ? '저장 상태가 바뀌었습니다. 저장 완료 후 다시 발행해 주세요.'
        : unchanged
          ? '마지막 발행본과 달라진 내용이 없습니다.'
          : error?.message || '발행하지 못했습니다. 입력값을 확인해 주세요.',
    };
  }

  const section = getContentSection(content.type);
  revalidatePath('/');
  revalidatePath(section.href);
  revalidatePath(`${section.href}/${content.slug}`);
  revalidatePath('/search');
  revalidatePath('/admin');

  return {
    ok: true,
    revisionNumber: publication.revision_number,
    publishedAt: publication.published_at,
  };
}
