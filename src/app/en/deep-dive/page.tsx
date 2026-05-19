import type { Metadata } from 'next';
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';
import DeepDiveLanding from '@/components/deep-dive/DeepDiveLanding';
import { getDeepDivePosts } from '@/lib/posts';

const DEEP_DIVE_DESCRIPTION =
  'Long-form Dechive knowledge documents that follow one question through concepts, examples, mistakes, limits, and verification criteria.';
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
    canonical: 'https://dechive.dev/en/deep-dive',
    languages: {
      ko: 'https://dechive.dev/deep-dive',
      en: 'https://dechive.dev/en/deep-dive',
      'x-default': 'https://dechive.dev/deep-dive',
    },
  },
  openGraph: {
    title: 'Deep Dive | Dechive',
    description: DEEP_DIVE_DESCRIPTION,
    url: 'https://dechive.dev/en/deep-dive',
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

export default function EnDeepDivePage() {
  const deepDives = getDeepDivePosts('en')
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
        basePath="/en/deep-dive"
        deepDives={deepDives}
        serifFontClassName="font-[family-name:var(--font-noto-serif-kr)]"
        sansFontClassName="font-[family-name:var(--font-noto-sans-kr)]"
      />
    </main>
  );
}
