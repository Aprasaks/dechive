import type { Metadata } from 'next';
import AboutClient from '@/components/about/AboutClient';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Dechive는 하나의 질문을 독립 기록으로 남기는 Archive와 깊은 질문을 끝까지 밀고 가는 Deep Dive로 지식을 검증하는 개인 아카이브입니다.',
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
      'Dechive는 하나의 질문을 독립 기록으로 남기는 Archive와 깊은 질문을 끝까지 밀고 가는 Deep Dive로 지식을 검증하는 개인 아카이브입니다.',
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
      'Dechive는 하나의 질문을 독립 기록으로 남기는 Archive와 깊은 질문을 끝까지 밀고 가는 Deep Dive로 지식을 검증하는 개인 아카이브입니다.',
    images: ['https://dechive.dev/images/thumb.webp'],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
