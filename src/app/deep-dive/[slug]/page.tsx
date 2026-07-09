import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDeepDivePosts, getPostBySlug } from '@/lib/posts';
import PostHeader from '@/components/archive/PostHeader';
import PostContent from '@/components/archive/PostContent';
import GuestbookCTA from '@/components/guestbook/GuestbookCTA';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BASE_URL = 'https://dechive.dev';

function getDeepDivePost(slug: string) {
  const post = getPostBySlug(slug, 'ko');
  return post?.type === 'deepdive' ? post : null;
}

function resolvePostImage(image?: string) {
  if (!image) return `${BASE_URL}/images/thumb.webp`;
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return `${BASE_URL}${image}`;

  return `${BASE_URL}/images/posts/${image.replace(/^\.\//, '')}`;
}

export async function generateStaticParams() {
  return getDeepDivePosts('ko').map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getDeepDivePost(slug);
  if (!post) return {};

  const canonical = `${BASE_URL}/deep-dive/${slug}`;
  const rawDesc = post.description;
  const description = rawDesc.length > 160 ? `${rawDesc.slice(0, 157)}...` : rawDesc;
  const image = resolvePostImage(post.coverImage);

  return {
    title: post.seoTitle ?? post.title,
    description,
    alternates: {
      canonical,
      languages: {
        ko: canonical,
        'x-default': canonical,
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

export default async function DeepDivePostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getDeepDivePost(slug);

  if (!post) notFound();

  const canonical = `${BASE_URL}/deep-dive/${post.slug}`;
  const image = resolvePostImage(post.coverImage);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#030303] px-5 py-12 text-[#f3eadb] sm:px-8 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            keywords: post.tags.join(', '),
            articleSection: post.category,
            image,
            author: { '@type': 'Person', name: 'Demian', url: `${BASE_URL}/about` },
            publisher: {
              '@type': 'Organization',
              name: 'Dechive',
              logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo-icon.svg` },
            },
            url: canonical,
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
              { '@type': 'ListItem', position: 2, name: 'Deep Dive', item: `${BASE_URL}/deep-dive` },
              { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
            ],
          }),
        }}
      />

      <div className="mx-auto w-full max-w-[800px]">
        <Link
          href="/deep-dive"
          className="mb-10 inline-flex text-sm font-medium tracking-[0.16em] text-[#f6d29b]/72 transition hover:text-[#f6d29b]"
        >
          ← Deep Dive
        </Link>

        <article className="min-w-0 border-t border-white/10 pt-10">
          <PostHeader post={post} />
          <PostContent content={post.content} />
        </article>

        <GuestbookCTA lang="ko" />

        <div className="mt-16 border-t border-white/10 pt-8">
          <Link
            href="/deep-dive"
            className="inline-flex rounded-sm border border-[#d7ad73]/35 px-5 py-3 text-sm font-medium tracking-[0.12em] text-[#f6d29b]/78 transition hover:border-[#f6d29b]/70 hover:bg-[#d7ad73]/10"
          >
            Deep Dive로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
