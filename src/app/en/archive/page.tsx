import type { Metadata } from 'next';
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';
import { getArchivePosts } from '@/lib/posts';
import ArchiveClient from '@/components/archive/ArchiveClient';

const ARCHIVE_DESCRIPTION =
  'Dechive Archive keeps AI, data, product, and web technology questions as independent records that can be reopened and verified.';

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
  alternates: {
    canonical: 'https://dechive.dev/en/archive',
    languages: {
      ko: 'https://dechive.dev/archive',
      en: 'https://dechive.dev/en/archive',
      'x-default': 'https://dechive.dev/archive',
    },
  },
  openGraph: {
    title: 'Archive | Dechive',
    description: ARCHIVE_DESCRIPTION,
    url: 'https://dechive.dev/en/archive',
    images: [{ url: 'https://dechive.dev/images/thumb.webp', width: 1200, height: 630, alt: 'Dechive Archive' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Dechive Archive',
  description: ARCHIVE_DESCRIPTION,
  url: 'https://dechive.dev/en/archive',
  isPartOf: { '@type': 'WebSite', name: 'Dechive', url: 'https://dechive.dev' },
};

export default function EnArchivePage() {
  const koPosts = getArchivePosts('ko');
  const enPosts = getArchivePosts('en');

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
          serifFontClassName="font-[family-name:var(--font-noto-serif-kr)]"
          sansFontClassName="font-[family-name:var(--font-noto-sans-kr)]"
        />
      </main>
    </>
  );
}
