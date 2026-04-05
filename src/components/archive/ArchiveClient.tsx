'use client';

import { useState } from 'react';
import type { Post, Category } from '@/types/archive';
import PostGrid from './PostGrid';
import ChatBot from './ChatBot';

interface ArchiveClientProps {
  posts: Post[];
  categories: Category[];
}

export default function ArchiveClient({ posts, categories }: ArchiveClientProps) {
  const [highlightedSlugs, setHighlightedSlugs] = useState<string[]>([]);

  return (
    <div className="grid h-full grid-cols-10 gap-4 px-6 py-6">
      <div className="col-span-6 overflow-y-auto pr-2">
        <PostGrid
          posts={posts}
          categories={categories}
          highlightedSlugs={highlightedSlugs}
        />
      </div>

      <div className="col-span-4">
        <ChatBot onHighlight={setHighlightedSlugs} />
      </div>
    </div>
  );
}
