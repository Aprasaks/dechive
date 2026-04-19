import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Image from 'next/image';
import Script from 'next/script';
import './globals.css';
import 'highlight.js/styles/atom-one-dark.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ParticleCanvas from '@/components/home/ParticleCanvas';
import { MusicProvider } from '@/components/layout/MusicProvider';
import { ChatProvider } from '@/components/layout/ChatProvider';
import ChatDrawer from '@/components/layout/ChatDrawer';
import { LangProvider } from '@/components/layout/LangProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const BASE_URL = 'https://dechive.dev';

export const metadata: Metadata = {
  title: { default: 'Dechive', template: '%s | Dechive' },
  description: '기록된 지식은 가치를 가진다. 기술, 철학, 사유의 흔적을 기록하는 공간.',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: 'Dechive',
    description: '기록된 지식은 가치를 가진다. 기술, 철학, 사유의 흔적을 기록하는 공간.',
    url: BASE_URL,
    siteName: 'Dechive',
    images: [{ url: '/images/thumb.webp', width: 1200, height: 630, alt: 'Dechive' }],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dechive',
    description: '기록된 지식은 가치를 가진다. 기술, 철학, 사유의 흔적을 기록하는 공간.',
    images: ['/images/thumb.webp'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <head>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4611005224374273"
          crossOrigin="anonymous"
          strategy="lazyOnload"
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
        className={`${geistSans.variable} flex min-h-screen flex-col font-sans antialiased overflow-x-clip`}
      >
        <div className="fixed inset-0 -z-10 flex justify-center overflow-hidden bg-black">
          <div className="relative h-full w-full max-w-344">
            <Image
              src="/images/library-main.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover brightness-[0.55]"
              priority
            />
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-black to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-black to-transparent" />
          </div>
        </div>
        <MusicProvider>
          <LangProvider>
          <ChatProvider>
            <ParticleCanvas />
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
