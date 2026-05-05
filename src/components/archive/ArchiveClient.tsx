'use client';

import type { Post, Category, Subject } from '@/types/archive';
import { useLang } from '@/components/layout/LangProvider';
import BookArchive from './BookArchive';

interface ArchiveClientProps {
  koPosts: Post[];
  enPosts: Post[];
  koCategories: Category[];
  enCategories: Category[];
  koSubjects: Subject[];
  enSubjects: Subject[];
  serifFontClassName: string;
  sansFontClassName: string;
}

export default function ArchiveClient({
  koPosts,
  enPosts,
  koCategories,
  enCategories,
  koSubjects,
  enSubjects,
  serifFontClassName,
  sansFontClassName,
}: ArchiveClientProps) {
  const { lang } = useLang();

  const posts = lang === 'ko' ? koPosts : enPosts;
  const categories = lang === 'ko' ? koCategories : enCategories;
  const subjects = lang === 'ko' ? koSubjects : enSubjects;

  return (
    <BookArchive
      posts={posts}
      categories={categories}
      subjects={subjects}
      serifFontClassName={serifFontClassName}
      sansFontClassName={sansFontClassName}
    />
  );
}
