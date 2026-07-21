import type { Metadata } from 'next';
import { Geist, Noto_Serif_KR } from 'next/font/google';
import './globals.css';
import 'highlight.js/styles/atom-one-dark.css';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import SiteChrome from '@/components/layout/SiteChrome';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const headerSerif = Noto_Serif_KR({
  weight: ['500'],
  subsets: ['latin'],
  variable: '--font-header-serif',
  preload: false,
});

const BASE_URL = 'https://dechive.dev';

export const metadata: Metadata = {
  title: { default: 'Dechive — 공부하고, 검증하고, 다시 설명하는 AI', template: '%s | Dechive' },
  description:
    'Dechive는 사람이 직접 이해한 내용을 지식, 강의, 실습과 AI 변화 기록으로 다시 구성합니다.',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: 'Dechive',
    description:
      '공부하고, 검증하고, 다시 설명하는 AI',
    url: BASE_URL,
    siteName: 'Dechive',
    images: [
      { url: '/images/thumb.webp', width: 1200, height: 630, alt: 'Dechive — 검증을 넘어 추론까지' },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
      title: 'Dechive',
      description:
      '공부하고, 검증하고, 다시 설명하는 AI',
    images: ['/images/thumb.webp'],
  },
  robots: { index: true, follow: true },
  verification: {
    other: {
      'naver-site-verification': 'ca13b5bbfb7f3981b08fd61d44f999d6436500de',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4611005224374273"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${headerSerif.variable} flex min-h-screen flex-col overflow-x-clip bg-background font-sans text-foreground antialiased`}
      >
        <SiteChrome>{children}</SiteChrome>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
