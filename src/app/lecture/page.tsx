import type { Metadata } from 'next';
import Link from 'next/link';
import {
  createPublishedLectureDatabase,
  listPublishedLectures,
} from '@/services/published-lectures';
import styles from '../knowledge/knowledge.module.css';

const BASE_URL = 'https://dechive.dev';
export const metadata: Metadata = {
  title: '강의',
  description: 'Dechive에서 공개한 강의 설계와 설명 자료',
  alternates: { canonical: `${BASE_URL}/lecture` },
  openGraph: {
    title: '강의 | Dechive',
    description: 'Dechive에서 공개한 강의 설계와 설명 자료',
    url: `${BASE_URL}/lecture`,
    type: 'website',
  },
};
export const revalidate = 300;

const date = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));

const difficulty = {
  beginner: '기초',
  intermediate: '중급',
  advanced: '심화',
} as const;

export default async function LectureIndexPage() {
  const { pool } = createPublishedLectureDatabase();
  try {
    const items = await listPublishedLectures(pool);
    return (
      <main id="main-content" className={`page-shell ${styles.index}`}>
        <div className={styles.indexInner}>
          <header className={styles.indexHeader}>
            <p className={styles.eyebrow}>Dechive Lecture</p>
            <h1 className={styles.indexTitle}>강의</h1>
            <p className={styles.indexLead}>
              지식을 다른 사람에게 설명하는 순서와 질문, 활동을 담은 공개 강의
              설계 자료입니다.
            </p>
          </header>
          {items.length ? (
            <>
              <p className={styles.count}>발행된 강의 {items.length}개</p>
              <ul className={styles.list}>
                {items.map((item) => (
                  <li key={item.slug} className={styles.item}>
                    <Link className={styles.itemLink} href={`/lecture/${item.slug}`}>
                      <span>{item.title}</span>
                      <span className={styles.arrow} aria-hidden="true">→</span>
                    </Link>
                    <p className={styles.itemSummary}>{item.summary}</p>
                    {item.coreMessage ? <p className={styles.referenceNote}>핵심 메시지: {item.coreMessage}</p> : null}
                    <div className={styles.meta}>
                      <time dateTime={item.publishedAt}>발행 version {item.versionNumber} · {date(item.publishedAt)}</time>
                      <span>{difficulty[item.difficulty]}</span>
                      {item.audience ? <span>대상: {item.audience}</span> : null}
                      {item.estimatedDurationMinutes ? <span>{item.estimatedDurationMinutes}분</span> : null}
                      {item.primaryKnowledge ? <span>기반 지식: {item.primaryKnowledge.title}</span> : null}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : <p className={styles.empty}>아직 발행된 강의가 없습니다.</p>}
        </div>
      </main>
    );
  } finally {
    await pool.end();
  }
}
