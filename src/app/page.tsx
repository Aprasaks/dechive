import type { Metadata } from 'next';
import { Noto_Serif_KR } from 'next/font/google';
import HomeClient from '@/components/home/HomeClient';
import { getArchivePosts, getDeepDivePosts } from '@/lib/posts';
import type { PostLang } from '@/types/archive';

const notoSerifKR = Noto_Serif_KR({
  weight: ['500'],
  subsets: ['latin'],
  variable: '--font-home-serif-kr',
  preload: false,
});

export const metadata: Metadata = {
  title: 'Dechive — 검증을 넘어 추론까지',
  description:
    'Dechive는 하나의 질문을 독립된 기록으로 남기는 Archive와 깊은 질문을 길게 추적하는 Deep Dive로 AI 시대의 답을 검증합니다.',
  alternates: { canonical: 'https://dechive.dev', languages: { 'x-default': 'https://dechive.dev' } },
  openGraph: {
    title: 'Dechive — 검증을 넘어 추론까지',
    description:
      'Dechive는 하나의 질문을 독립된 기록으로 남기는 Archive와 깊은 질문을 길게 추적하는 Deep Dive로 AI 시대의 답을 검증합니다.',
    url: 'https://dechive.dev',
    siteName: 'Dechive',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://dechive.dev/images/thumb.webp',
        width: 1200,
        height: 630,
        alt: 'Dechive — 검증을 넘어 추론까지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dechive — 검증을 넘어 추론까지',
    description:
      'Dechive는 하나의 질문을 독립된 기록으로 남기는 Archive와 깊은 질문을 길게 추적하는 Deep Dive로 AI 시대의 답을 검증합니다.',
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

const FEATURED_DEEP_DIVE_SLUG = 'ai-era-agile-verification';

export default function Home() {
  function getHomePosts(lang: PostLang) {
    const archivePosts = getArchivePosts(lang);
    const deepDivePosts = getDeepDivePosts(lang);
    const featuredPost = deepDivePosts.find((post) => post.slug === FEATURED_DEEP_DIVE_SLUG) ?? deepDivePosts[0];
    const latestPosts = [...archivePosts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      category: post.category,
      seoTitle: post.seoTitle,
    }));

    return {
      featuredPost: featuredPost ? {
        slug: featuredPost.slug,
        title: featuredPost.title,
        description: featuredPost.description,
        category: featuredPost.category,
        seoTitle: featuredPost.seoTitle,
      } : null,
      latestPosts,
    };
  }

  const koHome = getHomePosts('ko');
  const enHome = getHomePosts('en');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient
        featuredPosts={{ ko: koHome.featuredPost, en: enHome.featuredPost }}
        latestPosts={{ ko: koHome.latestPosts, en: enHome.latestPosts }}
        heroSerifClassName={notoSerifKR.className}
      />
    </>
  );
}
