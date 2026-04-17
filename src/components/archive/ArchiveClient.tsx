'use client';

import type { Post, Category, Series } from '@/types/archive';
import { useLang } from '@/components/layout/LangProvider';
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
  const { lang } = useLang();

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
