import type { Metadata } from 'next';
import ParentsAiGuidePage from '@/app/downloads/parents-ai-guide/page';

const BOOK_DESCRIPTION =
  'AI에 낯선 사람들이 AI를 제대로 이해할 수 있도록 정리한 무료 전자책입니다.';

export const metadata: Metadata = {
  title: 'AI가 낯선 사람들을 위한 AI 이해 가이드',
  description: BOOK_DESCRIPTION,
  alternates: {
    canonical: 'https://dechive.dev/book/parents-ai-guide',
  },
  openGraph: {
    title: 'AI가 낯선 사람들을 위한 AI 이해 가이드 | Dechive',
    description: BOOK_DESCRIPTION,
    url: 'https://dechive.dev/book/parents-ai-guide',
    siteName: 'Dechive',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://dechive.dev/downloads/parents-ai-guide-cover.webp',
        width: 1200,
        height: 630,
        alt: 'AI가 낯선 사람들을 위한 AI 이해 가이드',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI가 낯선 사람들을 위한 AI 이해 가이드 | Dechive',
    description: BOOK_DESCRIPTION,
    images: ['https://dechive.dev/downloads/parents-ai-guide-cover.webp'],
  },
};

export default ParentsAiGuidePage;
