import { getAllPosts, getCategories } from '@/lib/posts';
import ArchiveClient from '@/components/archive/ArchiveClient';

export default function ArchivePage() {
  const koPosts = getAllPosts('ko');
  const enPosts = getAllPosts('en');
  const koCategories = getCategories('ko');
  const enCategories = getCategories('en');

  return (
    <main className="flex-1 min-h-0 overflow-hidden">
      <ArchiveClient
        koPosts={koPosts}
        enPosts={enPosts}
        koCategories={koCategories}
        enCategories={enCategories}
      />
    </main>
  );
}
