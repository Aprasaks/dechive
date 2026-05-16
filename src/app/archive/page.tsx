import type { Metadata } from 'next';
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';
import { getAllPosts, getCategories, getSubjects } from '@/lib/posts';
import ArchiveClient from '@/components/archive/ArchiveClient';

const ARCHIVE_DESCRIPTION =
  'AI, 데이터, 제품, 웹 기술에 대한 질문을 검증하고, 근거와 맥락을 따라 다시 추론할 수 있게 남긴 Dechive의 지식 아카이브입니다.';

const notoSerifKR = Noto_Serif_KR({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-noto-serif-kr',
  preload: false,
});

const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  preload: false,
});

export const metadata: Metadata = {
  title: 'Archive',
  description: ARCHIVE_DESCRIPTION,
  alternates: { canonical: 'https://dechive.dev/archive', languages: { 'x-default': 'https://dechive.dev/archive' } },
  openGraph: {
    title: 'Archive | Dechive',
    description: ARCHIVE_DESCRIPTION,
    url: 'https://dechive.dev/archive',
    images: [{ url: 'https://dechive.dev/images/thumb.webp', width: 1200, height: 630, alt: 'Dechive Archive' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Dechive Archive',
  description: ARCHIVE_DESCRIPTION,
  url: 'https://dechive.dev/archive',
  isPartOf: { '@type': 'WebSite', name: 'Dechive', url: 'https://dechive.dev' },
};

export default function ArchivePage() {
  const koPosts = getAllPosts('ko');
  const enPosts = getAllPosts('en');
  const koCategories = getCategories('ko');
  const enCategories = getCategories('en');
  const koSubjects = getSubjects('ko');
  const enSubjects = getSubjects('en');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className={`flex flex-1 min-h-0 ${notoSerifKR.variable} ${notoSansKR.variable}`}>
        <ArchiveClient
          koPosts={koPosts}
          enPosts={enPosts}
          koCategories={koCategories}
          enCategories={enCategories}
          koSubjects={koSubjects}
          enSubjects={enSubjects}
          serifFontClassName="font-[family-name:var(--font-noto-serif-kr)]"
          sansFontClassName="font-[family-name:var(--font-noto-sans-kr)]"
        />
      </main>
    </>
  );
}
