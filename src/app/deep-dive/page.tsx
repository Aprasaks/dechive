import type { Metadata } from 'next';
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';
import DeepDiveLanding from '@/components/deep-dive/DeepDiveLanding';

const DEEP_DIVE_DESCRIPTION =
  '빠른 답으로 끝나지 않는 질문을 개념, 예시, 실수, 한계, 검증 기준까지 정리하는 Dechive의 심층 지식 문서입니다.';

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

export default function DeepDivePage() {
  return (
    <main className={`flex flex-1 min-h-0 ${notoSerifKR.variable} ${notoSansKR.variable}`}>
      <DeepDiveLanding
        serifFontClassName="font-[family-name:var(--font-noto-serif-kr)]"
        sansFontClassName="font-[family-name:var(--font-noto-sans-kr)]"
      />
    </main>
  );
}
