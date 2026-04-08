import { getAllPosts, getCategories, getSeries } from '@/lib/posts';
import ArchiveClient from '@/components/archive/ArchiveClient';

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
