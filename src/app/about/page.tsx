import type { Metadata } from 'next';
import AboutClient from '@/components/about/AboutClient';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Dechive는 AI가 만든 답을 사람의 검증으로 걸러내고, 진실된 지식을 다시 찾을 수 있게 쌓아두는 개인 지식 아카이브입니다.',
  alternates: {
    canonical: 'https://dechive.dev/about',
    languages: {
      'ko-KR': 'https://dechive.dev/about',
      'x-default': 'https://dechive.dev/about',
    },
  },
  openGraph: {
    title: 'About | Dechive — AI creates answers. Humans verify them.',
    description:
      'AI가 답을 내뱉어 주지만 지식을 걸러주지는 않습니다. Dechive는 사람이 검증한 지식을 쌓아두는 개인 아카이브입니다.',
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
    title: 'About | Dechive — AI creates answers. Humans verify them.',
    description:
      'AI가 답을 내뱉어 주지만 지식을 걸러주지는 않습니다. Dechive는 사람이 검증한 지식을 쌓아두는 개인 아카이브입니다.',
    images: ['https://dechive.dev/images/thumb.webp'],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
