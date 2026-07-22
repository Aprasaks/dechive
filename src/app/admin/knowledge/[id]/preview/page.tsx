/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DechiveDocumentRenderer } from '@/features/admin/DechiveDocumentRenderer';
import { formatKnowledgeDateTime } from '@/features/knowledge/date-format';
import { createAdminDatabase, getKnowledgeDraft } from '@/services/knowledge-drafts';
import styles from '@/features/admin/KnowledgeEditor.module.css';

export const metadata: Metadata = { title: '지식 작성본 미리보기', robots: { index: false, follow: false, nocache: true } };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { pool } = createAdminDatabase();
  try {
    const draft = await getKnowledgeDraft(pool, id);
    if (!draft) notFound();
    return (
      <main className={styles.shell}>
        <nav className={styles.nav}><Link href={`/admin/knowledge/${id}/edit`}>← 편집</Link><span>작성본 미리보기 · 버전 {draft.versionNumber}</span></nav>
        <div className={styles.notice}>현재 작성본 미리보기이며 공개 콘텐츠가 아닙니다.</div>
        <article className={styles.preview}>
          <p className={styles.eyebrow}>Knowledge</p>
          <h1 className={styles.title}>{draft.title || '제목 없음'}</h1>
          <p className={styles.lead}>{draft.summary}</p>
          {draft.heroImageUrl && draft.hero ? <figure><img src={draft.heroImageUrl} alt={draft.hero.alt} />{draft.hero.caption ? <figcaption>{draft.hero.caption}</figcaption> : null}</figure> : null}
          <DechiveDocumentRenderer document={draft.document} />
          {draft.tags.length ? <ul className={styles.tags} aria-label="태그">{draft.tags.map((tag) => <li className={styles.tag} key={tag}>{tag}</li>)}</ul> : null}
          <dl className={styles.dateList}><div><dt>작성일</dt><dd>{formatKnowledgeDateTime(draft.createdAt)}</dd></div><div><dt>발행일</dt><dd>{draft.publishedAt ? formatKnowledgeDateTime(draft.publishedAt) : '아직 발행되지 않음'}</dd></div><div><dt>최종 수정</dt><dd>{formatKnowledgeDateTime(draft.updatedAt)}</dd></div></dl>
        </article>
      </main>
    );
  } finally {
    await pool.end();
  }
}
