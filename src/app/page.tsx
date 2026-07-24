import type { Metadata } from 'next';
import { HomeSections, type LatestRecord } from '@/components/home/HomeSections';
import { createDatabase } from '@/db/client';
import { listPublishedKnowledge } from '@/services/published-knowledge';
import { listPublishedLectures } from '@/services/published-lectures';
import { listPublishedPractices } from '@/services/published-practices';
import { getPublishedBooks } from '@/services/published-books';

export const metadata: Metadata = {
  title: 'Dechive — 공부하고, 검증하고, 다시 설명하는 AI',
  description: 'Dechive는 사람이 이해하고 검증한 내용을 지식과 기록으로 다시 설명하는 아카이브입니다.',
  alternates: { canonical: 'https://dechive.dev' },
  openGraph: {
    title: 'Dechive',
    description: '공부하고, 검증하고, 다시 설명하는 AI',
    url: 'https://dechive.dev',
    type: 'website',
  },
};

export const revalidate = 300;

async function getLatestRecord(): Promise<LatestRecord | null> {
  const { pool } = createDatabase();
  try {
    const [knowledge, lectures, practices, books] = await Promise.all([
      listPublishedKnowledge(pool),
      listPublishedLectures(pool),
      listPublishedPractices(pool),
      getPublishedBooks(pool),
    ]);
    const candidates: LatestRecord[] = [];
    if (knowledge[0]) {
      candidates.push({ category: 'Knowledge', title: knowledge[0].title, publishedAt: knowledge[0].publishedAt, href: `/knowledge/${knowledge[0].slug}`, indexHref: '/knowledge' });
    }
    if (lectures[0]) {
      candidates.push({ category: 'Lecture', title: lectures[0].title, publishedAt: lectures[0].publishedAt, href: `/lecture/${lectures[0].slug}`, indexHref: '/lecture' });
    }
    if (practices[0]) {
      candidates.push({ category: 'Practice', title: practices[0].title, publishedAt: practices[0].publishedAt, href: `/practice/${practices[0].slug}`, indexHref: '/practice' });
    }
    if (books[0]) {
      candidates.push({ category: 'Books', title: books[0].title, publishedAt: books[0].publishedAt, href: '/books', indexHref: '/books' });
    }
    if (!candidates.length) return null;
    return candidates.reduce((latest, item) => (item.publishedAt > latest.publishedAt ? item : latest));
  } catch {
    return null;
  } finally {
    await pool.end();
  }
}

export default async function Home() {
  const latestRecord = await getLatestRecord();
  return (
    <main id="main-content" className="-mt-16 min-h-screen bg-background text-foreground">
      <HomeSections latestRecord={latestRecord} />
    </main>
  );
}
