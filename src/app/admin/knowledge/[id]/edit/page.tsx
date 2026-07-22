import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { KnowledgeEditor } from '@/features/admin/KnowledgeEditor';
import { KnowledgePublishPanel } from '@/features/admin/KnowledgePublishPanel';
import styles from '@/features/admin/KnowledgeEditor.module.css';
import {
  createAdminDatabase,
  getKnowledgeDraft,
  getKnowledgePublishState,
  listKnowledgeOptions,
} from '@/services/knowledge-drafts';
export const metadata: Metadata = {
  title: '지식 작성본 편집',
  robots: { index: false, follow: false, nocache: true },
};
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { pool } = createAdminDatabase();
  try {
    const [draft, options, publish] = await Promise.all([
      getKnowledgeDraft(pool, id),
      listKnowledgeOptions(pool),
      getKnowledgePublishState(pool, id),
    ]);
    if (!draft || !publish) notFound();
    return (
      <main className={styles.shell}>
        <nav className={styles.nav}>
          <Link href="/admin/knowledge">← 지식 목록</Link>
          <Link href={`/admin/knowledge/${id}/preview`}>미리보기</Link>
        </nav>
        <p className={styles.eyebrow}>Knowledge · 버전 {draft.versionNumber} · {draft.workflowStatus === 'published' ? '발행됨' : draft.workflowStatus === 'archived' ? '보관됨' : draft.workflowStatus === 'withdrawn' ? '발행 취소됨' : '작성 중'}</p>
        <h1 className={styles.title}>지식 작성본 편집</h1>
        {draft.legacyMetadata.topic ||
        draft.legacyMetadata.recommendedOrder !== null ||
        draft.legacyMetadata.prerequisiteKnowledgeIds.length ||
        draft.legacyMetadata.relatedKnowledgeIds.length ||
        draft.legacyMetadata.verificationMetadata ? (
          <p className={styles.notice}>
            이 작성본의 기존 고급 metadata는 보존되며 기본 편집에서는 변경되지
            않습니다.
          </p>
        ) : null}
        <KnowledgeEditor
          mode="edit"
          localizationId={id}
          knowledgeOptions={options}
          slugLocked={Boolean(publish.publishedVersionId)}
          initial={{
            title: draft.title,
            slug: draft.slug,
            locale: draft.locale,
            summary: draft.summary,
            tags: draft.tags,
            hero: draft.hero,
            heroImageUrl: draft.heroImageUrl,
            document: draft.document,
          }}
        />
        <KnowledgePublishPanel
          localizationId={id}
          draftVersionNumber={publish.draftVersionNumber}
          publishedVersionNumber={publish.publishedVersionNumber}
          ready={publish.readiness.ready}
          blockingErrors={publish.readiness.blockingErrors}
          warnings={publish.readiness.warnings}
          workflowStatus={publish.workflowStatus}
          slug={draft.slug}
          createdAt={publish.createdAt}
          publishedAt={publish.publishedAt}
          lastPublishedAt={publish.lastPublishedAt}
        />
      </main>
    );
  } finally {
    await pool.end();
  }
}
