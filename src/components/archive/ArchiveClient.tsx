'use client';

import type { Post } from '@/types/archive';
import { useLang } from '@/components/layout/LangProvider';
import BookArchive from './BookArchive';

interface ArchiveClientProps {
  koPosts: Post[];
  enPosts: Post[];
  serifFontClassName: string;
  sansFontClassName: string;
}

export default function ArchiveClient({
  koPosts,
  enPosts,
  serifFontClassName,
  sansFontClassName,
}: ArchiveClientProps) {
  const { lang } = useLang();

  const posts = lang === 'ko' ? koPosts : enPosts;
  return (
    <BookArchive
      posts={posts}
      serifFontClassName={serifFontClassName}
      sansFontClassName={sansFontClassName}
    />
  );
}
