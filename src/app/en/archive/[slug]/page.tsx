import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug, getSeriesPosts } from '@/lib/posts';
import PostHeader from '@/components/archive/PostHeader';
import PostContent from '@/components/archive/PostContent';
import SeriesNav from '@/components/archive/SeriesNav';
import TableOfContents from '@/components/archive/TableOfContents';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const enPosts = getAllPosts('en');
  return enPosts.map((post) => ({ slug: post.slug }));
}

const BASE_URL = 'https://dechive.dev';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'en');
  if (!post) return {};

  const canonical = `${BASE_URL}/en/archive/${slug}`;
  const image = `${BASE_URL}/images/thumb.webp`;

  const rawDesc = post.description || post.summary;
  const description = rawDesc.length > 160 ? `${rawDesc.slice(0, 157)}...` : rawDesc;

  return {
    title: post.title,
    description,
    alternates: {
      canonical,
      languages: {
        ko: `${BASE_URL}/archive/${slug}`,
        en: canonical,
      },
    },
    openGraph: {
      title: post.title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: post.date,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function EnPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'en');

  if (!post) notFound();

  const seriesPosts = post.series ? getSeriesPosts(post.series, 'en') : [];
  const currentIndex = seriesPosts.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
  const next = currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null;

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 min-h-[calc(100vh-64px-56px)]">
      <div className="fixed inset-0 -z-[5] bg-black/50" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/en/archive/${post.slug}` },
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            image: `${BASE_URL}/images/thumb.webp`,
            author: { '@type': 'Person', name: 'Demian' },
            publisher: {
              '@type': 'Organization',
              name: 'Dechive',
              logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/thumb.webp` },
            },
            url: `${BASE_URL}/en/archive/${post.slug}`,
          }),
        }}
      />

      <div className="flex gap-12">
        <article className="min-w-0 w-full max-w-3xl">
          <PostHeader post={post} />
          <PostContent content={post.content} />
          <SeriesNav prev={prev} next={next} lang="en" />
        </article>

        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <TableOfContents content={post.content} />
          </div>
        </aside>
      </div>
    </main>
  );
}
