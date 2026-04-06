'use client';

import { useState } from 'react';
import type { Post, Category, PostLang } from '@/types/archive';
import PostGrid from './PostGrid';
import ChatBot from './ChatBot';

interface ArchiveClientProps {
  koPosts: Post[];
  enPosts: Post[];
  koCategories: Category[];
  enCategories: Category[];
}

export default function ArchiveClient({
  koPosts,
  enPosts,
  koCategories,
  enCategories,
}: ArchiveClientProps) {
  const [highlightedSlugs, setHighlightedSlugs] = useState<string[]>([]);
  const [lang, setLang] = useState<PostLang>('ko');

  const posts = lang === 'ko' ? koPosts : enPosts;
  const categories = lang === 'ko' ? koCategories : enCategories;

  return (
    <div className="grid h-full grid-cols-10 gap-4 px-6 py-6 max-w-7xl mx-auto w-full">
      <div className="col-span-6 overflow-y-auto pr-2">
        <PostGrid
          posts={posts}
          categories={categories}
          highlightedSlugs={highlightedSlugs}
          lang={lang}
          onLangChange={setLang}
        />
      </div>

      <div className="col-span-4">
        <ChatBot onHighlight={setHighlightedSlugs} />
      </div>
    </div>
  );
}
