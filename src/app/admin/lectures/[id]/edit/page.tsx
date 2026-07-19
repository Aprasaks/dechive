import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LecturePublishPanel } from '@/features/admin/LecturePublishPanel';
import { LectureEditor } from '@/features/admin/KnowledgeEditor';
import styles from '@/features/admin/KnowledgeEditor.module.css';
import {
  createAdminDatabase,
  getLectureDraft,
  getLecturePublishState,
  listKnowledgeOptions,
} from '@/services/knowledge-drafts';

export const metadata: Metadata = {
  title: '강의 Draft 편집',
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
      getLectureDraft(pool, id),
      listKnowledgeOptions(pool),
      getLecturePublishState(pool, id),
    ]);
    if (!draft || !publish) notFound();
    return (
      <main className={styles.shell}>
        <nav className={styles.nav}>
          <Link href="/admin/lectures">← 강의 목록</Link>
          <Link href={`/admin/lectures/${id}/preview`}>미리보기</Link>
        </nav>
        <p className={styles.eyebrow}>Lecture · Version {draft.versionNumber}</p>
        <h1 className={styles.title}>강의 Draft 편집</h1>
        <LecturePublishPanel
          localizationId={id}
          draftVersionNumber={publish.draftVersionNumber}
          publishedVersionNumber={publish.publishedVersionNumber}
          ready={publish.readiness.ready}
          blockingErrors={publish.readiness.blockingErrors}
          warnings={publish.readiness.warnings}
          publicSlug={draft.slug}
        />
        <LectureEditor
          mode="edit"
          localizationId={id}
          knowledgeOptions={options}
          slugLocked={Boolean(publish.publishedVersionId)}
          initial={{
            title: draft.title,
            slug: draft.slug,
            locale: draft.locale,
            summary: draft.summary,
            primarySourceKnowledgeId: draft.primarySourceKnowledgeId,
            learningObjectives: draft.learningObjectives,
            difficulty: draft.difficulty,
            recommendedOrder: draft.recommendedOrder,
            checkpoints: draft.checkpoints,
            audience: draft.audience,
            estimatedDurationMinutes: draft.estimatedDurationMinutes,
            coreMessage: draft.coreMessage,
            references: draft.references,
            document: draft.document,
          }}
        />
      </main>
    );
  } finally {
    await pool.end();
  }
}
