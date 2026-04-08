import type { Metadata } from 'next';
import { getAllPosts, getCategories, getSeries } from '@/lib/posts';
import ArchiveClient from '@/components/archive/ArchiveClient';

export const metadata: Metadata = {
  title: 'Archive',
  description: '기술, 철학, 사유의 흔적을 정제하고 기록하는 공간. Dechive의 모든 포스트를 탐색하세요.',
  alternates: { canonical: 'https://dechive.dev/archive' },
  openGraph: {
    title: 'Archive | Dechive',
    description: '기술, 철학, 사유의 흔적을 정제하고 기록하는 공간. Dechive의 모든 포스트를 탐색하세요.',
    url: 'https://dechive.dev/archive',
    images: [{ url: 'https://dechive.dev/images/thumb.webp', width: 1200, height: 630, alt: 'Dechive Archive' }],
  },
};

export default function ArchivePage() {
  const koPosts = getAllPosts('ko');
  const enPosts = getAllPosts('en');
  const koCategories = getCategories('ko');
  const enCategories = getCategories('en');
  const koSeries = getSeries('ko');
  const enSeries = getSeries('en');

  return (
    <main className="flex-1 min-h-0 overflow-hidden">
      <ArchiveClient
        koPosts={koPosts}
        enPosts={enPosts}
        koCategories={koCategories}
        enCategories={enCategories}
        koSeries={koSeries}
        enSeries={enSeries}
      />
    </main>
  );
}
