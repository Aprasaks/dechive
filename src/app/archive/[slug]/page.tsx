import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug, getSeriesPosts } from '@/lib/posts';
import PostHeader from '@/components/archive/PostHeader';
import PostContent from '@/components/archive/PostContent';
import SeriesNav from '@/components/archive/SeriesNav';
import type { PostLang } from '@/types/archive';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateStaticParams() {
  const koPosts = getAllPosts('ko');
  const enPosts = getAllPosts('en');
  const allSlugs = [...new Set([...koPosts, ...enPosts].map((post) => post.slug))];
  return allSlugs.map((slug) => ({ slug }));
}

const BASE_URL = 'https://dechive.dev';

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const post = getPostBySlug(slug, (lang as PostLang) ?? 'ko');
  if (!post) return {};

  const baseUrl = `${BASE_URL}/archive/${slug}`;
  const canonical = post.lang === 'en' ? `${baseUrl}?lang=en` : baseUrl;
  const image = post.thumbnail
    ? `${BASE_URL}/images/posts/${post.thumbnail}`
    : `${BASE_URL}/images/thumb.webp`;

  const rawDesc = post.description || post.summary;
  const description = rawDesc.length > 160 ? `${rawDesc.slice(0, 157)}...` : rawDesc;

  return {
    title: post.title,
    description,
    alternates: {
      canonical,
      languages: {
        'ko': baseUrl,
        'en': `${baseUrl}?lang=en`,
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

export default async function PostPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const postLang = (lang as PostLang) ?? 'ko';
  const post = getPostBySlug(slug, postLang);

  if (!post) notFound();

  // 시리즈 이전/다음 편
  const seriesPosts = post.series ? getSeriesPosts(post.series, postLang) : [];
  const currentIndex = seriesPosts.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
  const next = currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null;

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 min-h-[calc(100vh-64px-56px)] overflow-x-hidden">
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
            image: post.thumbnail
              ? `${BASE_URL}/images/posts/${post.thumbnail}`
              : `${BASE_URL}/images/thumb.webp`,
            author: { '@type': 'Person', name: 'Demian' },
            publisher: {
              '@type': 'Organization',
              name: 'Dechive',
              logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/thumb.webp` },
            },
            url: `${BASE_URL}/archive/${post.slug}`,
          }),
        }}
      />

      <PostHeader post={post} />
      <PostContent content={post.content} />
      <SeriesNav prev={prev} next={next} lang={postLang} />
    </main>
  );
}
