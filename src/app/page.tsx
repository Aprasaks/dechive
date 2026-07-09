import type { Metadata } from 'next';
import { Noto_Serif_KR } from 'next/font/google';
import HomeClient from '@/components/home/HomeClient';

const notoSerifKR = Noto_Serif_KR({
  weight: ['500'],
  subsets: ['latin'],
  variable: '--font-home-serif-kr',
  preload: false,
});

export const metadata: Metadata = {
  title: 'Dechive — A living archive built from verified knowledge',
  description:
    'Dechive is a personal knowledge system where records, sources, questions, and verified thoughts become searchable context for your AI.',
  alternates: { canonical: 'https://dechive.dev', languages: { 'x-default': 'https://dechive.dev' } },
  openGraph: {
    title: 'Dechive — A living archive built from verified knowledge',
    description:
      'Dechive is a personal knowledge system where records, sources, questions, and verified thoughts become searchable context for your AI.',
    url: 'https://dechive.dev',
    siteName: 'Dechive',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://dechive.dev/images/thumb.webp',
        width: 1200,
        height: 630,
        alt: 'Dechive — A living archive built from verified knowledge',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dechive — A living archive built from verified knowledge',
    description:
      'Dechive is a personal knowledge system where records, sources, questions, and verified thoughts become searchable context for your AI.',
    images: ['https://dechive.dev/images/thumb.webp'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dechive',
  url: 'https://dechive.dev',
  logo: 'https://dechive.dev/logo-icon.svg',
  sameAs: ['https://github.com/Aprasaks'],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient heroSerifClassName={notoSerifKR.className} />
    </>
  );
}
