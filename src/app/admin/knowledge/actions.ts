'use server';
import { revalidatePath } from 'next/cache';
import { requireOwnerAction } from '@/features/admin/owner-auth';
import type { DechiveDocument } from '@/features/editor-lab/document';
import {
  createAdminDatabase,
  createKnowledgeDraft,
  publishKnowledgeDraft,
  updateKnowledgeDraft,
  type KnowledgeReference,
} from '@/services/knowledge-drafts';
export type KnowledgeSaveRequest = {
  mode: 'create' | 'edit';
  localizationId?: string;
  title: string;
  slug: string;
  locale: 'ko' | 'en';
  summary: string;
  tags: string[];
  references: KnowledgeReference[];
  document: DechiveDocument;
};
export async function saveKnowledgeDraftAction(request: KnowledgeSaveRequest) {
  const actorId = await requireOwnerAction();
  const { pool } = createAdminDatabase();
  try {
    const saved =
      request.mode === 'create'
        ? await createKnowledgeDraft(pool, request, { actorId })
        : await updateKnowledgeDraft(
            pool,
            request.localizationId ?? '',
            request,
            { actorId },
          );
    for (const path of [
      '/admin',
      '/admin/knowledge',
      `/admin/knowledge/${saved.localizationId}/edit`,
      `/admin/knowledge/${saved.localizationId}/preview`,
    ])
      revalidatePath(path);
    return {
      ok: true as const,
      localizationId: saved.localizationId,
      versionNumber: saved.versionNumber,
    };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error ? error.message.split(':')[0] : 'save_failed',
    };
  } finally {
    await pool.end();
  }
}

export async function publishKnowledgeDraftAction(localizationId: string) {
  const actorId = await requireOwnerAction();
  const { pool } = createAdminDatabase();
  try {
    const published = await publishKnowledgeDraft(pool, localizationId, {
      actorId,
    });
    for (const path of [
      '/admin',
      '/admin/knowledge',
      `/admin/knowledge/${localizationId}/edit`,
      `/admin/knowledge/${localizationId}/preview`,
      '/knowledge',
      `/knowledge/${published.slug}`,
    ])
      revalidatePath(path);
    return {
      ok: true as const,
      warnings: published.warnings,
      alreadyPublished: published.alreadyPublished,
    };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error ? error.message.split(':')[0] : 'publish_failed',
    };
  } finally {
    await pool.end();
  }
}
