import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DechiveDocumentRenderer } from '@/features/admin/DechiveDocumentRenderer';
import {
  createPublishedLectureDatabase,
  getPublishedLecture,
} from '@/services/published-lectures';
import styles from '../../knowledge/knowledge.module.css';

const BASE_URL = 'https://dechive.dev';
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { pool } = createPublishedLectureDatabase();
  try {
    const lecture = await getPublishedLecture(pool, slug);
    if (!lecture) return {};
    const url = `${BASE_URL}/lecture/${lecture.slug}`;
    return {
      title: lecture.title,
      description: lecture.summary,
      alternates: { canonical: url },
      openGraph: {
        title: lecture.title,
        description: lecture.summary,
        url,
        type: 'article',
        publishedTime: lecture.publishedAt,
      },
    };
  } finally {
    await pool.end();
  }
}

export default async function LectureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { pool } = createPublishedLectureDatabase();
  try {
    const lecture = await getPublishedLecture(pool, slug);
    if (!lecture) notFound();
    return (
      <main id="main-content" className={`page-shell ${styles.detail}`}>
        <div className={styles.detailInner}>
          <Link href="/lecture" className={styles.back}>← 강의 목록</Link>
          <article>
            <header className={styles.detailHeader}>
              <p className={styles.eyebrow}>Lecture</p>
              <h1 className={styles.detailTitle}>{lecture.title}</h1>
              <p className={styles.summary}>{lecture.summary}</p>
              {lecture.coreMessage ? <p className={styles.notice}><strong>핵심 메시지</strong><br />{lecture.coreMessage}</p> : null}
              <div className={styles.detailMeta}>
                <time dateTime={lecture.publishedAt}>발행 version {lecture.versionNumber} · {date(lecture.publishedAt)}</time>
                <span>{difficulty[lecture.difficulty]}</span>
                {lecture.audience ? <span>대상: {lecture.audience}</span> : null}
                {lecture.estimatedDurationMinutes ? <span>예상 시간: {lecture.estimatedDurationMinutes}분</span> : null}
              </div>
            </header>
            {lecture.learningObjectives.length ? <section className={styles.references} aria-labelledby="lecture-objectives"><h2 id="lecture-objectives">학습 목표</h2><ul className={styles.referenceList}>{lecture.learningObjectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></section> : null}
            {lecture.primaryKnowledge ? <section className={styles.references} aria-labelledby="primary-knowledge"><h2 id="primary-knowledge">기반 지식</h2><Link className={styles.external} href={`/knowledge/${lecture.primaryKnowledge.slug}`}>{lecture.primaryKnowledge.title} <span aria-hidden="true">→</span></Link></section> : null}
            <DechiveDocumentRenderer document={lecture.document} className={styles.document} />
            {lecture.checkpoints.length ? <section className={styles.references} aria-labelledby="lecture-checkpoints"><h2 id="lecture-checkpoints">실습 및 확인</h2><ul className={styles.referenceList}>{lecture.checkpoints.map((checkpoint) => <li key={checkpoint}>{checkpoint}</li>)}</ul></section> : null}
            {lecture.references.length ? <section className={styles.references} aria-labelledby="references-title"><h2 id="references-title">참고자료</h2><ol className={styles.referenceList}>{lecture.references.map((reference, index) => <li className={styles.reference} key={`${reference.type}-${index}`}><span className={styles.referenceType}>{reference.type === 'external' ? '외부 자료' : '직접 검증'}</span><strong className={styles.referenceTitle}>{reference.title}</strong>{reference.authorOrOrganization ? <p className={styles.referenceMeta}>{reference.authorOrOrganization}</p> : null}{reference.url ? <a className={styles.external} href={reference.url} target="_blank" rel="noopener noreferrer">외부 자료 열기 <span aria-hidden="true">↗</span><span className="sr-only"> (새 창)</span></a> : null}{reference.accessedAt ? <p className={styles.referenceMeta}>{reference.type === 'external' ? '접근일' : '검증일'}: {reference.accessedAt}</p> : null}{reference.note ? <p className={styles.referenceNote}>{reference.note}</p> : null}</li>)}</ol></section> : null}
            <Link href="/lecture" className={styles.returnLink}>← 모든 강의 보기</Link>
          </article>
        </div>
      </main>
    );
  } finally {
    await pool.end();
  }
}
