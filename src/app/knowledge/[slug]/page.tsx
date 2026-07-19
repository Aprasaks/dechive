import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DechiveDocumentRenderer } from '@/features/admin/DechiveDocumentRenderer';
import {
  createPublishedKnowledgeDatabase,
  getPublishedKnowledge,
} from '@/services/published-knowledge';
import styles from '../knowledge.module.css';

const BASE_URL = 'https://dechive.dev';
export const revalidate = 300;
const date = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { pool } = createPublishedKnowledgeDatabase();
  try {
    const knowledge = await getPublishedKnowledge(pool, slug);
    if (!knowledge) return {};
    const url = `${BASE_URL}/knowledge/${knowledge.slug}`;
    return {
      title: knowledge.title,
      description: knowledge.summary,
      alternates: { canonical: url },
      openGraph: {
        title: knowledge.title,
        description: knowledge.summary,
        url,
        type: 'article',
        publishedTime: knowledge.publishedAt,
      },
    };
  } finally {
    await pool.end();
  }
}
export default async function KnowledgeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { pool } = createPublishedKnowledgeDatabase();
  try {
    const knowledge = await getPublishedKnowledge(pool, slug);
    if (!knowledge) notFound();
    return (
      <main id="main-content" className={`page-shell ${styles.detail}`}>
        <div className={styles.detailInner}>
          <Link href="/knowledge" className={styles.back}>
            ← 지식 목록
          </Link>
          <article>
            <header className={styles.detailHeader}>
              <p className={styles.eyebrow}>Knowledge</p>
              <h1 className={styles.detailTitle}>{knowledge.title}</h1>
              <p className={styles.summary}>{knowledge.summary}</p>
              <div className={styles.detailMeta}>
                <time dateTime={knowledge.publishedAt}>
                  발행 version {knowledge.versionNumber} ·{' '}
                  {date(knowledge.publishedAt)}
                </time>
                {knowledge.tags.length ? (
                  <ul className={styles.tags} aria-label="태그">
                    {knowledge.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </header>
            <DechiveDocumentRenderer
              document={knowledge.document}
              className={styles.document}
            />
            {knowledge.references.length ? (
              <section
                className={styles.references}
                aria-labelledby="references-title"
              >
                <h2 id="references-title">참고문헌</h2>
                <ol className={styles.referenceList}>
                  {knowledge.references.map((reference, index) => (
                    <li
                      className={styles.reference}
                      key={`${reference.type}-${index}`}
                    >
                      <span className={styles.referenceType}>
                        {reference.type === 'external'
                          ? '외부 자료'
                          : '직접 검증'}
                      </span>
                      <strong className={styles.referenceTitle}>
                        {reference.title}
                      </strong>
                      {reference.authorOrOrganization ? (
                        <p className={styles.referenceMeta}>
                          {reference.authorOrOrganization}
                        </p>
                      ) : null}
                      {reference.url ? (
                        <a
                          className={styles.external}
                          href={reference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          외부 자료 열기 <span aria-hidden="true">↗</span>
                          <span className="sr-only"> (새 창)</span>
                        </a>
                      ) : null}
                      {reference.accessedAt ? (
                        <p className={styles.referenceMeta}>
                          {reference.type === 'external' ? '접근일' : '검증일'}:{' '}
                          {reference.accessedAt}
                        </p>
                      ) : null}
                      {reference.note ? (
                        <p className={styles.referenceNote}>{reference.note}</p>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
            <Link href="/knowledge" className={styles.returnLink}>
              ← 모든 지식 보기
            </Link>
          </article>
        </div>
      </main>
    );
  } finally {
    await pool.end();
  }
}
