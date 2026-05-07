import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import PostHeader from '@/components/archive/PostHeader';
import PostContent from '@/components/archive/PostContent';
import TableOfContents from '@/components/archive/TableOfContents';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateStaticParams() {
  const koPosts = getAllPosts('ko');
  return koPosts.map((post) => ({ slug: post.slug }));
}

const BASE_URL = 'https://dechive.dev';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, 'ko');
  if (!post) return {};

  const canonical = `${BASE_URL}/archive/${slug}`;
  const image = `${BASE_URL}/images/thumb.webp`;

  const rawDesc = post.description;
  const description = rawDesc.length > 160 ? `${rawDesc.slice(0, 157)}...` : rawDesc;

  return {
    title: post.title,
    description,
    alternates: {
      canonical,
      languages: {
        ko: canonical,
        en: `${BASE_URL}/en/archive/${slug}`,
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

export default async function PostPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;

  // 이전 ?lang=en URL → 새 경로로 301 리다이렉트
  if (lang === 'en') redirect(`/en/archive/${slug}`);

  const post = getPostBySlug(slug, 'ko');

  if (!post) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-12 min-h-[calc(100vh-64px-56px)]">
      <div className="fixed inset-0 -z-[5] bg-black/50" />
      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/archive/${post.slug}` },
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
            url: `${BASE_URL}/archive/${post.slug}`,
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
              { '@type': 'ListItem', position: 4, name: post.title, item: `${BASE_URL}/archive/${post.slug}` },
            ],
          }),
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* 본문 */}
        <article className="mx-auto min-w-0 w-full max-w-[720px] rounded-md border border-white/10 bg-black/25 px-5 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-[2px] sm:px-8">
          <PostHeader post={post} />
          <PostContent content={post.content} />
        </article>

        {/* TOC는 본문을 밀지 않는 보조 책갈피로 배치 */}
        <aside className="absolute left-[calc(50%+390px)] top-0 hidden w-52 xl:block">
          <div className="sticky top-24 rounded-md border border-white/10 bg-black/20 p-4 shadow-[0_16px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm">
            <TableOfContents content={post.content} />
          </div>
        </aside>
      </div>
    </main>
  );
}
