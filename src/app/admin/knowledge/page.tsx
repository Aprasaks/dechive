import type { Metadata } from 'next';
import Link from 'next/link';
import { formatKnowledgeDateTime } from '@/features/knowledge/date-format';
import { createAdminDatabase, listKnowledgeDrafts } from '@/services/knowledge-drafts';
import { KnowledgeListActions } from '@/features/admin/KnowledgeListActions';
import styles from '@/features/admin/KnowledgeEditor.module.css';

export const metadata: Metadata = { title: '지식 목록', robots: { index: false, follow: false, nocache: true } };

const workflowLabels = {
  draft: '작성 중',
  published: '발행됨',
  withdrawn: '발행 취소됨',
  archived: '보관됨',
} as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ locale?: string; status?: string }> }) {
  const filters = await searchParams;
  const { pool } = createAdminDatabase();
  try {
    const items = await listKnowledgeDrafts(pool, filters);
    return (
      <main className={styles.shell}>
        <nav className={styles.nav}>
          <Link href="/admin">DECHIVE ADMIN</Link>
          <Link className={`${styles.button} ${styles.primary} ${styles.createKnowledgeButton}`} href="/admin/knowledge/new" aria-label="새 지식 작성">+ 새 지식 작성</Link>
        </nav>
        <h1 className={styles.title}>지식</h1>
        <p className={styles.lead}>독립적으로 읽을 수 있는 원본 지식 문서를 관리합니다.</p>
        <DraftFilters filters={filters} />
        {items.length ? (
          <div className={styles.tableWrap}>
            <table className={styles.list}>
              <thead><tr><th>제목</th><th>언어</th><th>상태</th><th>버전</th><th>작성일</th><th>최근 수정</th><th>작업</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.title}</strong><small className={styles.tableSub}>{item.slug}</small></td>
                    <td>{item.locale === 'ko' ? '한국어' : 'English'}</td>
                    <td>{workflowLabels[item.workflowStatus]}{item.hasUnpublishedChanges ? ' · 변경 있음' : ''}</td>
                    <td>{item.versionNumber}</td>
                    <td>{formatKnowledgeDateTime(item.createdAt)}</td>
                    <td>{formatKnowledgeDateTime(item.updatedAt)}</td>
                    <td><KnowledgeListActions item={item} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className={styles.empty}>지식 문서가 없습니다.</p>}
      </main>
    );
  } finally {
    await pool.end();
  }
}

function DraftFilters({ filters }: { filters: { locale?: string; status?: string } }) {
  return (
    <form className={styles.filters}>
      <label className={styles.field}>언어<select name="locale" defaultValue={filters.locale ?? ''}><option value="">전체</option><option value="ko">한국어</option><option value="en">English</option></select></label>
      <label className={styles.field}>상태<select name="status" defaultValue={filters.status ?? ''}><option value="">전체</option><option value="draft">작성 중</option><option value="published">발행됨</option><option value="withdrawn">발행 취소됨</option><option value="archived">보관됨</option></select></label>
      <button className={styles.button}>필터 적용</button>
    </form>
  );
}
