'use client';

import { useState } from 'react';
import type { Post, Category } from '@/types/archive';
import CategoryFilter from './CategoryFilter';
import PostCard from './PostCard';

interface PostGridProps {
  posts: Post[];
  categories: Category[];
  highlightedIds: string[];
}

export default function PostGrid({
  posts,
  categories,
  highlightedIds,
}: PostGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered =
    selectedCategory === 'all'
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const hasHighlight = highlightedIds.length > 0;

  return (
    <section className="flex flex-col gap-6">
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />

      <div className="grid grid-cols-3 gap-4">
        {filtered.map((post) => {
          const highlighted = hasHighlight && highlightedIds.includes(post.id);
          const dimmed = hasHighlight && !highlightedIds.includes(post.id);
          return (
            <PostCard
              key={post.id}
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
