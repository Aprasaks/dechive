import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllLogs, getLogBySlug } from '@/lib/logs';
import PostContent from '@/components/archive/PostContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BASE_URL = 'https://dechive.dev';

export async function generateStaticParams() {
  const logs = getAllLogs();
  return logs.map((log) => ({ slug: log.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const log = getLogBySlug(slug);
  if (!log) return {};

  const url = `${BASE_URL}/logs/${slug}`;
  const rawDesc = log.description || log.summary;
  const description = rawDesc.length > 160 ? `${rawDesc.slice(0, 157)}...` : rawDesc;

  return {
    title: log.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: log.title,
      description,
      url,
      type: 'article',
      publishedTime: log.date,
      images: [{ url: `${BASE_URL}/images/thumb.webp`, width: 1200, height: 630, alt: log.title }],
    },
  };
}

export default async function LogPage({ params }: PageProps) {
  const { slug } = await params;
  const log = getLogBySlug(slug);

  if (!log) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 min-h-[calc(100vh-64px-56px)] overflow-x-hidden">
      <div className="fixed inset-0 -z-[5] bg-black/50" />
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/logs/${log.slug}` },
            headline: log.title,
            description: log.description,
            datePublished: log.date,
            author: { '@type': 'Person', name: 'Demian' },
            publisher: {
              '@type': 'Organization',
              name: 'Dechive',
              logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/thumb.webp` },
            },
            url: `${BASE_URL}/logs/${log.slug}`,
          }),
        }}
      />

      {/* 헤더 */}
      <header className="mb-10">
        <Link
          href="/logs"
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-6 inline-block"
        >
          ← Logs
        </Link>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {log.tags.map((tag) => (
            <span key={tag} className="text-xs text-zinc-600">#{tag}</span>
          ))}
        </div>

        <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-zinc-100 mb-3">
          {log.title}
        </h1>

        {log.summary && (
          <p className="text-sm leading-relaxed text-zinc-400 mb-4">{log.summary}</p>
        )}

        <time dateTime={log.date} className="text-xs text-zinc-600 tabular-nums">
          {log.date}
        </time>

        <div className="mt-6 border-b border-zinc-800" />
      </header>

      <PostContent content={log.content} />
    </main>
  );
}
