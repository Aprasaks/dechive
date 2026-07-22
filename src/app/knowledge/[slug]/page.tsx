/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DechiveDocumentRenderer } from '@/features/admin/DechiveDocumentRenderer';
import { KnowledgeShareButton } from '@/features/admin/KnowledgeShareButton';
import { formatKnowledgeDateTime } from '@/features/knowledge/date-format';
import {
  createPublishedKnowledgeDatabase,
  getPublishedKnowledge,
} from '@/services/published-knowledge';
import styles from '../knowledge.module.css';

const BASE_URL = 'https://dechive.dev';
export const revalidate = 300;
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
        modifiedTime: knowledge.updatedAt,
        images: knowledge.hero ? [{ url: knowledge.hero.publicUrl, width: knowledge.hero.width ?? undefined, height: knowledge.hero.height ?? undefined, alt: knowledge.hero.alt }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: knowledge.title,
        description: knowledge.summary,
        images: [knowledge.hero?.publicUrl ?? `${BASE_URL}/images/thumb.webp`],
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
    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: knowledge.title,
      description: knowledge.summary,
      image: [knowledge.hero?.publicUrl ?? `${BASE_URL}/images/thumb.webp`],
      author: { '@type': 'Organization', name: 'Dechive', url: BASE_URL },
      datePublished: knowledge.publishedAt,
      dateModified: knowledge.updatedAt,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/knowledge/${knowledge.slug}` },
      publisher: { '@type': 'Organization', name: 'Dechive', url: BASE_URL },
    }).replace(/[<>&\u2028\u2029]/g, (character) => ({ '<': '\\u003c', '>': '\\u003e', '&': '\\u0026', '\u2028': '\\u2028', '\u2029': '\\u2029' })[character] ?? character);
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
                  발행일 · {formatKnowledgeDateTime(knowledge.publishedAt)}
                </time>
              </div>
            </header>
            {knowledge.hero ? (
              <figure className={styles.heroMedia}>
                <img src={knowledge.hero.publicUrl} alt={knowledge.hero.alt} width={knowledge.hero.width ?? undefined} height={knowledge.hero.height ?? undefined} loading="eager" decoding="async" fetchPriority="high" />
                {knowledge.hero.caption ? <figcaption>{knowledge.hero.caption}</figcaption> : null}
              </figure>
            ) : null}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
            <DechiveDocumentRenderer
              document={knowledge.document}
              className={styles.document}
            />
            <footer className={styles.detailFooter}>
              {knowledge.tags.length ? <ul className={styles.tags} aria-label="태그">{knowledge.tags.map((tag) => <li className={styles.tag} key={tag}>{tag}</li>)}</ul> : null}
              <dl className={styles.publicDates}>
                <div><dt>작성일</dt><dd><time dateTime={knowledge.createdAt}>{formatKnowledgeDateTime(knowledge.createdAt)}</time></dd></div>
                <div><dt>발행일</dt><dd><time dateTime={knowledge.publishedAt}>{formatKnowledgeDateTime(knowledge.publishedAt)}</time></dd></div>
                <div><dt>최종 수정일</dt><dd><time dateTime={knowledge.updatedAt}>{formatKnowledgeDateTime(knowledge.updatedAt)}</time></dd></div>
              </dl>
              <KnowledgeShareButton url={`${BASE_URL}/knowledge/${knowledge.slug}`} />
            </footer>
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
