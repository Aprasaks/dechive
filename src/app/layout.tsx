import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteChrome } from '@/components/site/SiteChrome';
import './globals.css';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dechive.dev';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Dechive — AI를 이해하고 다루는 지식 저장소',
    template: '%s | Dechive',
  },
  description:
    'AI를 이해하고 다루는 데 필요한 지식을 확인하고, 나의 언어로 다시 설명해 축적합니다.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main-content">
          본문으로 이동
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
