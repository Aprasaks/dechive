'use client';

import { useState, useEffect } from 'react';
import type { Post, Category, PostLang } from '@/types/archive';
import CategoryFilter from './CategoryFilter';
import PostCard from './PostCard';

interface PostGridProps {
  posts: Post[];
  categories: Category[];
  highlightedSlugs: string[];
  lang: PostLang;
  onLangChange: (lang: PostLang) => void;
  initialCount?: number;
}

const INITIAL_COUNT = 9;
const LOAD_MORE = 9;

function PlaceholderCard() {
  return (
    <div className="flex flex-col rounded-2xl border border-zinc-800/50 overflow-hidden opacity-30">
      <div className="aspect-video bg-zinc-900 flex items-center justify-center">
        <span className="text-xs text-zinc-600">준비중</span>
      </div>
      <div className="px-3 py-2.5">
        <div className="h-3.5 w-3/4 rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}

export default function PostGrid({
  posts,
  categories,
  highlightedSlugs,
  lang,
  onLangChange,
  initialCount = INITIAL_COUNT,
}: PostGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(initialCount);

  // 언어/카테고리 바뀌면 더보기 초기화
  useEffect(() => {
    setVisibleCount(initialCount);
  }, [posts, selectedCategory, initialCount]);

  const filtered =
    selectedCategory === 'all'
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const hasHighlight = highlightedSlugs.length > 0;
  const visiblePosts = filtered.slice(0, visibleCount);
  const placeholderCount = Math.max(0, initialCount - filtered.length);
  const hasMore = filtered.length > visibleCount;

  return (
    <div className="flex flex-col h-full">
      {/* 카테고리 필터 - 상단 고정 */}
      <div className="shrink-0 px-4 pt-4 pb-3 border-b border-white/10">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
          lang={lang}
          onLangChange={onLangChange}
        />
      </div>

      {/* 포스트 그리드 - 내부 스크롤 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {visiblePosts.map((post) => {
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
          {Array.from({ length: placeholderCount }).map((_, i) => (
            <PlaceholderCard key={`placeholder-${i}`} />
          ))}
        </div>
      </div>

      {/* 더보기 버튼 - 하단 고정 */}
      {hasMore && (
        <div className="shrink-0 border-t border-white/10 py-3 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE)}
            className="rounded-full bg-white/10 hover:bg-white/20 px-6 py-1.5 text-sm font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
}
