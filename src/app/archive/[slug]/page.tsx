import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import PostHeader from '@/components/archive/PostHeader';
import PostContent from '@/components/archive/PostContent';
import type { PostLang } from '@/types/archive';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts('ko');
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang } = await searchParams;
  const post = getPostBySlug(slug, (lang as PostLang) ?? 'ko');
  if (!post) return {};

  return {
    title: `${post.title} | Dechive`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.thumbnail ? [`/images/posts/${post.thumbnail}`] : [],
    },
  };
}

export default async function PostPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const post = getPostBySlug(slug, (lang as PostLang) ?? 'ko');

  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 min-h-[calc(100vh-64px-56px)]">
      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            image: post.thumbnail ? `/images/posts/${post.thumbnail}` : undefined,
            author: { '@type': 'Person', name: 'Demian' },
          }),
        }}
      />

      <PostHeader post={post} />
      <PostContent content={post.content} />
    </main>
  );
}
