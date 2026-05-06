import type { Metadata } from 'next';
import { Noto_Serif_KR } from 'next/font/google';
import HomeClient from '@/components/home/HomeClient';
import { getAllPosts } from '@/lib/posts';

const notoSerifKR = Noto_Serif_KR({
  weight: ['500'],
  subsets: ['latin'],
  variable: '--font-home-serif-kr',
});

export const metadata: Metadata = {
  title: 'Dechive — 생각이 머무는 도서관',
  description:
    '생각이 기록이 되는 순간, 의미를 가진다. Dechive는 지식과 생각을 짧은 책처럼 남기는 개인 도서관입니다.',
  alternates: { canonical: 'https://dechive.dev', languages: { 'x-default': 'https://dechive.dev' } },
  openGraph: {
    title: 'Dechive — 생각이 머무는 도서관',
    description:
      '생각이 기록이 되는 순간, 의미를 가진다. Dechive는 지식과 생각을 짧은 책처럼 남기는 개인 도서관입니다.',
    url: 'https://dechive.dev',
    siteName: 'Dechive',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://dechive.dev/images/thumb.webp',
        width: 1200,
        height: 630,
        alt: 'Dechive — 생각이 머무는 도서관',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dechive — 생각이 머무는 도서관',
    description:
      '생각이 기록이 되는 순간, 의미를 가진다. Dechive는 지식과 생각을 짧은 책처럼 남기는 개인 도서관입니다.',
    images: ['https://dechive.dev/images/thumb.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dechive',
  url: 'https://dechive.dev',
  logo: 'https://dechive.dev/logo-icon.svg',
  sameAs: ['https://github.com/Aprasaks'],
};

export default function Home() {
  const koPostHrefs = getAllPosts('ko').map((post) => `/archive/${post.slug}`);
  const enPostHrefs = getAllPosts('en').map((post) => `/en/archive/${post.slug}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient
        koPostHrefs={koPostHrefs}
        enPostHrefs={enPostHrefs}
        heroSerifClassName={notoSerifKR.className}
      />
    </>
  );
}
