import type { Metadata } from 'next';
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';
import DeepDiveLanding from '@/components/deep-dive/DeepDiveLanding';
import { getDeepDivePosts } from '@/lib/posts';

const DEEP_DIVE_DESCRIPTION =
  '하나의 깊은 질문을 개념, 예시, 실수, 한계, 검증 기준까지 길게 밀고 가는 Dechive의 심층 지식 문서입니다.';
const FEATURED_DEEP_DIVE_SLUG = 'ai-era-agile-verification';

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
  title: 'Deep Dive',
  description: DEEP_DIVE_DESCRIPTION,
  alternates: {
    canonical: 'https://dechive.dev/deep-dive',
    languages: { 'x-default': 'https://dechive.dev/deep-dive' },
  },
  openGraph: {
    title: 'Deep Dive | Dechive',
    description: DEEP_DIVE_DESCRIPTION,
    url: 'https://dechive.dev/deep-dive',
    images: [
      {
        url: 'https://dechive.dev/images/thumb.webp',
        width: 1200,
        height: 630,
        alt: 'Dechive Deep Dive',
      },
    ],
  },
};

function resolvePostImage(image?: string) {
  if (!image) return '/images/library-main.webp';
  if (image.startsWith('/')) return image;

  return `/images/posts/${image.replace(/^\.\//, '')}`;
}

export default function DeepDivePage() {
  const deepDives = getDeepDivePosts('ko')
    .sort((a, b) => {
      if (a.slug === FEATURED_DEEP_DIVE_SLUG) return -1;
      if (b.slug === FEATURED_DEEP_DIVE_SLUG) return 1;
      return b.date.localeCompare(a.date);
    })
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      meta: [post.category, post.subject].filter(Boolean).join(' · '),
      description: post.description,
      image: resolvePostImage(post.coverImage || post.thumbnail),
      tags: post.tags,
    }));

  return (
    <main className={`flex flex-1 min-h-0 ${notoSerifKR.variable} ${notoSansKR.variable}`}>
      <DeepDiveLanding
        basePath="/deep-dive"
        deepDives={deepDives}
        serifFontClassName="font-[family-name:var(--font-noto-serif-kr)]"
        sansFontClassName="font-[family-name:var(--font-noto-sans-kr)]"
      />
    </main>
  );
}
