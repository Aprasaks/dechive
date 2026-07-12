import type { Metadata } from 'next';
import AiUpdatesClient from '@/components/ai-updates/AiUpdatesClient';
import { AI_UPDATES_MONTH, aiUpdateDays } from '@/data/aiUpdates';

const AI_UPDATES_DESCRIPTION =
  '공식 출처 날짜를 확인하고 다음날 KST에 기록하는 Dechive AI Update 변화 카드입니다.';

export const metadata: Metadata = {
  title: 'AI Update',
  description: AI_UPDATES_DESCRIPTION,
  alternates: {
    canonical: 'https://dechive.dev/ai-updates',
  },
  openGraph: {
    title: 'AI Update | Dechive',
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
        alt: 'Dechive AI Update',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Update | Dechive',
    description: AI_UPDATES_DESCRIPTION,
    images: ['https://dechive.dev/images/thumb.webp'],
  },
};

export default function AiUpdatesPage() {
  return <AiUpdatesClient month={AI_UPDATES_MONTH} days={aiUpdateDays} />;
}
