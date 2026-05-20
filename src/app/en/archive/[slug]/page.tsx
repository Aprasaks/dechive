import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getArchivePosts, getPostBySlug } from '@/lib/posts';
import PostHeader from '@/components/archive/PostHeader';
import PostContent from '@/components/archive/PostContent';
import GuestbookCTA from '@/components/guestbook/GuestbookCTA';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const enPosts = getArchivePosts('en');
  return enPosts.map((post) => ({ slug: post.slug }));
}

const BASE_URL = 'https://dechive.dev';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'en');
  if (!post || post.type !== 'archive') return {};

  const canonical = `${BASE_URL}/en/archive/${slug}`;
  const image = `${BASE_URL}/images/thumb.webp`;

  const rawDesc = post.description;
  const description = rawDesc.length > 160 ? `${rawDesc.slice(0, 157)}...` : rawDesc;

  return {
    title: post.seoTitle ?? post.title,
    description,
    alternates: {
      canonical,
      languages: {
        ko: `${BASE_URL}/archive/${slug}`,
        en: canonical,
        'x-default': `${BASE_URL}/archive/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: post.date,
      authors: ['Demian'],
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [image],
    },
  };
}

export default async function EnPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'en');

  if (!post || post.type !== 'archive') notFound();

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8f6f1] px-5 py-12 text-[#19140f] sm:px-8 lg:py-16">
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
            keywords: post.tags.join(', '),
            articleSection: post.category,
            image: `${BASE_URL}/images/thumb.webp`,
            author: { '@type': 'Person', name: 'Demian', url: `${BASE_URL}/about` },
            publisher: {
              '@type': 'Organization',
              name: 'Dechive',
              logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo-icon.svg` },
            },
            url: `${BASE_URL}/en/archive/${post.slug}`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
              { '@type': 'ListItem', position: 2, name: 'Archive', item: `${BASE_URL}/archive` },
              { '@type': 'ListItem', position: 3, name: post.category, item: `${BASE_URL}/archive` },
              { '@type': 'ListItem', position: 4, name: post.title, item: `${BASE_URL}/en/archive/${post.slug}` },
            ],
          }),
        }}
      />

      <div className="mx-auto w-full max-w-[800px]">
        <Link
          href="/archive"
          className="mb-10 inline-flex text-sm font-medium tracking-[0.16em] text-[#9a7a3f] transition hover:text-[#17120d]"
        >
          ← Archive
        </Link>

        <article className="min-w-0 border-t border-[#2a211b]/10 pt-10">
          <PostHeader post={post} />
          <PostContent content={post.content} />
        </article>

        <GuestbookCTA lang="en" />

        <div className="mt-16 border-t border-[#2a211b]/10 pt-8">
          <Link
            href="/archive"
            className="inline-flex rounded-sm border border-[#9a7a3f]/35 px-5 py-3 text-sm font-medium tracking-[0.12em] text-[#5d4630] transition hover:border-[#9a7a3f]/70 hover:bg-[#efe7da]"
          >
            Back to Archive
          </Link>
        </div>
      </div>
    </main>
  );
}
