import type { Metadata } from 'next';
import KnowledgeListClient from '@/features/knowledge/KnowledgeListClient';
import { normalizeKnowledgeCategory, type KnowledgeCategory } from '@/features/knowledge/categories';
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
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const query = normalizeKnowledgeSearchQuery(params.q);
  const category = normalizeKnowledgeCategory(params.category);
  const { pool } = createPublishedKnowledgeDatabase();
  try {
    const [{ items, nextCursor }, count] = await Promise.all([
      searchPublishedKnowledge(pool, { query, category, limit: 12 }),
      countPublishedKnowledge(pool, category),
    ]);
    return (
      <main id="main-content" className={`page-shell ${styles.index}`}>
        <div className={styles.indexInner}>
          <header className={styles.indexHeader}>
            <div className={styles.indexIntro}>
              <h1 className={styles.indexTitle}>
                우리가 알고 있는, 하지만 제대로 알지 못하는 개념들을
                <br className={styles.desktopBreak} />
                {' '}하나씩 알아봅시다.
              </h1>
              <p className={styles.indexLead}>계속 확장되는 AI 개념 아카이브에서 궁금한 내용을 찾아보세요.</p>
            </div>
            <aside className={styles.indexAside} aria-label="Knowledge 안내">
              <span className={styles.asideIcon} aria-hidden="true">▱</span>
              <strong>4개 층</strong>
              <span aria-hidden="true">·</span>
              <strong>19개 영역</strong>
              <span aria-hidden="true">·</span>
              <span>계속 확장 중</span>
            </aside>
          </header>
          <KnowledgeListClient
            initialItems={items}
            initialNextCursor={nextCursor}
            initialQuery={query}
            initialCategory={category as KnowledgeCategory}
            publishedCount={count}
          />
        </div>
      </main>
    );
  } finally {
    await pool.end();
  }
}
