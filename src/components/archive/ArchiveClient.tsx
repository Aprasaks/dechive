'use client';

import { useState, useEffect } from 'react';
import type { Post, Category, Series } from '@/types/archive';
import BookArchive from './BookArchive';

interface ArchiveClientProps {
  koPosts: Post[];
  enPosts: Post[];
  koCategories: Category[];
  enCategories: Category[];
  koSeries: Series[];
  enSeries: Series[];
  fontClassName: string;
}

export default function ArchiveClient({
  koPosts,
  enPosts,
  koCategories,
  enCategories,
  koSeries,
  enSeries,
  fontClassName,
}: ArchiveClientProps) {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved === 'ko' || saved === 'en') setLang(saved as 'ko' | 'en');
  }, []);

  const posts = lang === 'ko' ? koPosts : enPosts;
  const categories = lang === 'ko' ? koCategories : enCategories;
  const series = lang === 'ko' ? koSeries : enSeries;

  return (
    <BookArchive
      posts={posts}
      categories={categories}
      series={series}
      fontClassName={fontClassName}
    />
  );
}
