'use client';

import { useState } from 'react';
import type { Post, Category, PostLang } from '@/types/archive';
import CategoryFilter from './CategoryFilter';
import PostCard from './PostCard';

interface PostGridProps {
  posts: Post[];
  categories: Category[];
  highlightedSlugs: string[];
  lang: PostLang;
  onLangChange: (lang: PostLang) => void;
}

export default function PostGrid({
  posts,
  categories,
  highlightedSlugs,
  lang,
  onLangChange,
}: PostGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered =
    selectedCategory === 'all'
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const hasHighlight = highlightedSlugs.length > 0;

  return (
    <section className="flex flex-col gap-6">
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onChange={setSelectedCategory}
        lang={lang}
        onLangChange={onLangChange}
      />

      <div className="grid grid-cols-3 gap-4">
        {filtered.map((post) => {
          const highlighted = hasHighlight && highlightedSlugs.includes(post.slug);
          const dimmed = hasHighlight && !highlightedSlugs.includes(post.slug);
          return (
            <PostCard
              key={post.slug}
              post={post}
              highlighted={highlighted}
              dimmed={dimmed}
            />
          );
        })}
      </div>
    </section>
  );
}
