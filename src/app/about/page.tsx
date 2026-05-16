import type { Metadata } from 'next';
import AboutClient from '@/components/about/AboutClient';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Dechive는 AI가 만든 답을 검증하고, 근거와 맥락을 따라 추론 가능한 지식으로 정리하는 개인 아카이브입니다.',
  alternates: {
    canonical: 'https://dechive.dev/about',
    languages: {
      'ko-KR': 'https://dechive.dev/about',
      'x-default': 'https://dechive.dev/about',
    },
  },
  openGraph: {
    title: 'About | Dechive — 검증을 넘어 추론까지',
    description:
      'Dechive는 AI가 만든 답을 검증하고, 근거와 맥락을 따라 추론 가능한 지식으로 정리하는 개인 아카이브입니다.',
    url: 'https://dechive.dev/about',
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
    title: 'About | Dechive — 검증을 넘어 추론까지',
    description:
      'Dechive는 AI가 만든 답을 검증하고, 근거와 맥락을 따라 추론 가능한 지식으로 정리하는 개인 아카이브입니다.',
    images: ['https://dechive.dev/images/thumb.webp'],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
