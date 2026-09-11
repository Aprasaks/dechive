'use server';

import { randomUUID } from 'node:crypto';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/auth/require-owner';
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
  learningObjectives: string[];
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
    !isTiptapDocument(input.bodyJson)
  ) {
    return {
      ok: false,
      conflict: false,
      error: '제목과 주소를 확인한 뒤 다시 저장해 주세요.',
    };
  }

  const learningObjectives = input.learningObjectives
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
  const metadata: Json = { learningObjectives };
  const { supabase } = await requireOwner();
  const { data, error } = await supabase.rpc('save_content_draft', {
    p_content_id: input.contentId,
    p_expected_version: input.expectedVersion,
    p_slug: input.slug,
    p_title: input.title.trim(),
    p_summary: input.summary.trim(),
    p_body_json: input.bodyJson,
    p_metadata: metadata,
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
