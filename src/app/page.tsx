import type { Metadata } from 'next';
import { Noto_Serif_KR } from 'next/font/google';
import HomeClient from '@/components/home/HomeClient';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
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
    'Dechive는 AI가 만든 답을 그대로 소비하지 않고, 개념과 예시, 실수와 판단 기준을 따라 검증하고 추론하는 개인 지식 아카이브입니다.',
  alternates: { canonical: 'https://dechive.dev', languages: { 'x-default': 'https://dechive.dev' } },
  openGraph: {
    title: 'Dechive — 검증을 넘어 추론까지',
    description:
      'Dechive는 AI가 만든 답을 그대로 소비하지 않고, 개념과 예시, 실수와 판단 기준을 따라 검증하고 추론하는 개인 지식 아카이브입니다.',
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
      'Dechive는 AI가 만든 답을 그대로 소비하지 않고, 개념과 예시, 실수와 판단 기준을 따라 검증하고 추론하는 개인 지식 아카이브입니다.',
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
  function getHomePosts(lang: PostLang) {
    const posts = getAllPosts(lang);
    const featuredPost = getPostBySlug('what-null-leaves-behind', lang) ?? posts[0];
    const latestPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      category: post.category,
      subject: post.subject ?? '',
      seoTitle: post.seoTitle,
    }));

    return {
      featuredPost: featuredPost ? {
        slug: featuredPost.slug,
        title: featuredPost.title,
        description: featuredPost.description,
        category: featuredPost.category,
        subject: featuredPost.subject ?? '',
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
