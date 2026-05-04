import type { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  alternates: { canonical: 'https://dechive.dev', languages: { 'x-default': 'https://dechive.dev' } },
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
  const koPostHrefs = getAllPosts('ko').map((post) => `/archive/${post.slug}`);
  const enPostHrefs = getAllPosts('en').map((post) => `/en/archive/${post.slug}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient koPostHrefs={koPostHrefs} enPostHrefs={enPostHrefs} />
    </>
  );
}
