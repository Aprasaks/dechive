import type { Metadata } from 'next';
import AiUpdatesClient from '@/components/ai-updates/AiUpdatesClient';
import { AI_UPDATES_MONTH, aiUpdateDays } from '@/data/aiUpdates';

const AI_UPDATES_DESCRIPTION =
  '매일 공식 문서 기반 AI 업데이트를 날짜별 브리핑으로 기록하는 Dechive AiUpdate 페이지입니다.';

export const metadata: Metadata = {
  title: 'AiUpdate',
  description: AI_UPDATES_DESCRIPTION,
  alternates: {
    canonical: 'https://dechive.dev/ai-updates',
  },
  openGraph: {
    title: 'AiUpdate | Dechive',
    description: AI_UPDATES_DESCRIPTION,
    url: 'https://dechive.dev/ai-updates',
    siteName: 'Dechive',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://dechive.dev/images/thumb.webp',
        width: 1200,
        height: 630,
        alt: 'Dechive AiUpdate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AiUpdate | Dechive',
    description: AI_UPDATES_DESCRIPTION,
    images: ['https://dechive.dev/images/thumb.webp'],
  },
};

export default function AiUpdatesPage() {
  return <AiUpdatesClient month={AI_UPDATES_MONTH} days={aiUpdateDays} />;
}
