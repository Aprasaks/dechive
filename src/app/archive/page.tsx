import { getAllPosts, getCategories } from '@/lib/posts';
import ArchiveClient from '@/components/archive/ArchiveClient';

export default function ArchivePage() {
  const posts = getAllPosts('ko');
  const categories = getCategories('ko');

  return (
    <main className="h-[calc(100vh-64px)] overflow-hidden">
      <ArchiveClient posts={posts} categories={categories} />
    </main>
  );
}
