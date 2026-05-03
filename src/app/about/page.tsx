import type { Metadata } from 'next';
import AboutClient from '@/components/about/AboutClient';

export const metadata: Metadata = {
  title: 'About | Dechive — 생각이 머무는 도서관',
  description:
    'Dechive는 생각과 지식을 기록하고 다시 탐색하기 위한 개인 도서관입니다.',
  alternates: {
    canonical: 'https://dechive.dev/about',
    languages: {
      'ko-KR': 'https://dechive.dev/about',
      'x-default': 'https://dechive.dev/about',
    },
  },
  openGraph: {
    title: 'About | Dechive — 생각이 머무는 도서관',
    description:
      'Dechive는 생각과 지식을 기록하고 다시 탐색하기 위한 개인 도서관입니다.',
    url: 'https://dechive.dev/about',
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
    title: 'About | Dechive — 생각이 머무는 도서관',
    description:
      'Dechive는 생각과 지식을 기록하고 다시 탐색하기 위한 개인 도서관입니다.',
    images: ['https://dechive.dev/images/thumb.webp'],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
