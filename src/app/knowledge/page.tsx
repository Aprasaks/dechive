import type { Metadata } from 'next';
import KnowledgeListClient from '@/features/knowledge/KnowledgeListClient';
import { normalizeKnowledgeSearchQuery } from '@/features/knowledge/search';
import {
  countPublishedKnowledge,
  createPublishedKnowledgeDatabase,
  searchPublishedKnowledge,
} from '@/services/published-knowledge';
import styles from './knowledge.module.css';

const BASE_URL = 'https://dechive.dev';
export const metadata: Metadata = {
  title: '지식',
  description: 'Dechive에서 발행한 독립적인 원본 지식 문서',
  alternates: { canonical: `${BASE_URL}/knowledge` },
  openGraph: {
    title: '지식 | Dechive',
    description: 'Dechive에서 발행한 독립적인 원본 지식 문서',
    url: `${BASE_URL}/knowledge`,
    type: 'website',
  },
};
export const revalidate = 300;

export default async function KnowledgeIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = normalizeKnowledgeSearchQuery(params.q);
  const { pool } = createPublishedKnowledgeDatabase();
  try {
    const [{ items, nextCursor }, count] = await Promise.all([
      searchPublishedKnowledge(pool, { query, limit: 12 }),
      countPublishedKnowledge(pool),
    ]);
    return (
      <main id="main-content" className={`page-shell ${styles.index}`}>
        <div className={styles.indexInner}>
          <header className={styles.indexHeader}>
            <h1 className={styles.indexTitle}>
              우리가 알고 있는, 하지만 제대로 알지 못하는 개념들을
              <br className={styles.desktopBreak} />
              {' '}하나씩 알아봅시다.
            </h1>
            <p className={styles.count}>지금까지 {count}개의 개념을 정리했어요.</p>
          </header>
          <KnowledgeListClient
            initialItems={items}
            initialNextCursor={nextCursor}
            initialQuery={query}
          />
        </div>
      </main>
    );
  } finally {
    await pool.end();
  }
}
