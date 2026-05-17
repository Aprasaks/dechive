import type { Metadata } from 'next';
import { Geist, Noto_Serif_KR } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import 'highlight.js/styles/atom-one-dark.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MusicProvider } from '@/components/layout/MusicProvider';
import { ChatProvider } from '@/components/layout/ChatProvider';
import ChatDrawer from '@/components/layout/ChatDrawer';
import { LangProvider } from '@/components/layout/LangProvider';

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
  title: { default: 'Dechive — 검증을 넘어 추론까지', template: '%s | Dechive' },
  description:
    'Dechive는 AI, 데이터, 제품, 웹 기술에 대한 질문을 검증하고, 근거와 맥락을 따라 추론 가능한 기록으로 정리하는 개인 지식 아카이브입니다.',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: 'Dechive — 검증을 넘어 추론까지',
    description:
      'Dechive는 AI, 데이터, 제품, 웹 기술에 대한 질문을 검증하고, 근거와 맥락을 따라 추론 가능한 기록으로 정리하는 개인 지식 아카이브입니다.',
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
    title: 'Dechive — 검증을 넘어 추론까지',
    description:
      'Dechive는 AI, 데이터, 제품, 웹 기술에 대한 질문을 검증하고, 근거와 맥락을 따라 추론 가능한 기록으로 정리하는 개인 지식 아카이브입니다.',
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
    <html lang="ko" className="dark">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Dechive"
          href={`${BASE_URL}/feed.xml`}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Dechive English"
          href={`${BASE_URL}/en/feed.xml`}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4611005224374273"
          crossOrigin="anonymous"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y08SJBLW8G"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y08SJBLW8G');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${headerSerif.variable} flex min-h-screen flex-col overflow-x-clip bg-black font-sans text-zinc-100 antialiased`}
      >
        <MusicProvider>
          <LangProvider>
            <ChatProvider>
              <Header />
              {children}
              <Footer />
              <ChatDrawer />
            </ChatProvider>
          </LangProvider>
        </MusicProvider>
      </body>
    </html>
  );
}
