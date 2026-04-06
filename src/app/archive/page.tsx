import { getAllPosts, getCategories } from '@/lib/posts';
import ArchiveClient from '@/components/archive/ArchiveClient';

export default function ArchivePage() {
  const posts = getAllPosts('ko');
  const categories = getCategories('ko');

  return (
    <main className="flex-1 min-h-0 overflow-hidden">
      <ArchiveClient posts={posts} categories={categories} />
    </main>
  );
}
