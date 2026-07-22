import type { Metadata } from 'next';
import Link from 'next/link';
import { formatKnowledgeDateTime } from '@/features/knowledge/date-format';
import {
  createPublishedKnowledgeDatabase,
  listPublishedKnowledge,
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
export default async function KnowledgeIndexPage() {
  const { pool } = createPublishedKnowledgeDatabase();
  try {
    const items = await listPublishedKnowledge(pool);
    return (
      <main id="main-content" className={`page-shell ${styles.index}`}>
        <div className={styles.indexInner}>
          <header className={styles.indexHeader}>
            <p className={styles.eyebrow}>Dechive Knowledge</p>
            <h1 className={styles.indexTitle}>지식</h1>
            <p className={styles.indexLead}>
              각 문서는 하나의 개념과 판단 기준을 독립적으로 다룹니다. 필요한
              곳에서 바로 읽고, 다시 찾아볼 수 있도록 정리합니다.
            </p>
          </header>
          {items.length ? (
            <>
              <p className={styles.count}>발행된 지식 {items.length}개</p>
              <ul className={styles.list}>
                {items.map((item) => (
                  <li key={item.slug} className={styles.item}>
                    <Link
                      className={styles.itemLink}
                      href={`/knowledge/${item.slug}`}
                    >
                      <span>{item.title}</span>
                      <span className={styles.arrow} aria-hidden="true">
                        →
                      </span>
                    </Link>
                    <p className={styles.itemSummary}>{item.summary}</p>
                    <div className={styles.meta}>
                      <time dateTime={item.publishedAt}>
                        발행일 · {formatKnowledgeDateTime(item.publishedAt)}
                      </time>
                      <time dateTime={item.updatedAt}>
                        최종 수정일 · {formatKnowledgeDateTime(item.updatedAt)}
                      </time>
                      {item.tags.length ? (
                        <ul className={styles.tags} aria-label="태그">
                          {item.tags.map((tag) => (
                            <li key={tag} className={styles.tag}>
                              {tag}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className={styles.empty}>아직 발행된 지식이 없습니다.</p>
          )}
        </div>
      </main>
    );
  } finally {
    await pool.end();
  }
}
