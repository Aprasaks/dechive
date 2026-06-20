import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAiUpdateBySlug,
  getAiUpdateStaticParams,
} from '@/data/aiUpdates';

const BASE_URL = 'https://dechive.dev';

interface PageProps {
  params: Promise<{
    date: string;
    slug: string;
  }>;
}

function formatDisplayDate(date: string) {
  return date.replaceAll('-', '.');
}

export function generateStaticParams() {
  return getAiUpdateStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date, slug } = await params;
  const update = getAiUpdateBySlug(date, slug);

  if (!update) return {};

  return {
    title: `${update.title} | AI-Update`,
    description: update.summary,
    alternates: {
      canonical: `${BASE_URL}/ai-updates/${date}/${slug}`,
    },
    openGraph: {
      title: `${update.title} | Dechive AI-Update`,
      description: update.summary,
      url: `${BASE_URL}/ai-updates/${date}/${slug}`,
      siteName: 'Dechive',
      locale: 'ko_KR',
      type: 'article',
      images: [
        {
          url: `${BASE_URL}/images/thumb.webp`,
          width: 1200,
          height: 630,
          alt: update.title,
        },
      ],
    },
  };
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-[#ded6c9] py-8">
      <h2 className="font-[family-name:var(--font-header-serif)] text-2xl font-medium text-[#2a211b]">
        {title}
      </h2>
      <div className="mt-4 text-sm leading-7 text-[#5f564d]">
        {children}
      </div>
    </section>
  );
}

export default async function AiUpdateDetailPage({ params }: PageProps) {
  const { date, slug } = await params;
  const update = getAiUpdateBySlug(date, slug);

  if (!update) notFound();

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8f6f1] px-6 py-12 text-[#19140f] sm:px-8 lg:py-16">
      <article className="mx-auto max-w-4xl">
        <Link
          href="/ai-updates"
          className="text-xs font-semibold tracking-[0.16em] text-[#8a6a39] uppercase transition-colors hover:text-[#2a211b]"
        >
          ← AI-Update
        </Link>

        <header className="mt-8 border-b border-[#ded6c9] pb-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-[#9a7342] uppercase">
            {formatDisplayDate(date)}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-header-serif)] text-4xl leading-tight font-medium text-[#2a211b] sm:text-5xl">
            {update.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#5f564d]">
            {update.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {update.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex rounded-sm border border-[#bda77e]/45 bg-[#fbfaf7] px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#6d5634] uppercase"
              >
                {badge}
              </span>
            ))}
          </div>
        </header>

        <DetailSection title="공식 문서">
          <a
            href={update.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#7a5d2c] underline decoration-[#b08d57]/40 underline-offset-4 transition-colors hover:text-[#2a211b]"
          >
            {update.source.label}
          </a>
          <p className="mt-3">{update.source.description}</p>
        </DetailSection>

        <DetailSection title="변경 내용">
          <p>{update.whatChanged}</p>
        </DetailSection>

        <DetailSection title="사용 기준">
          <p>{update.useCriteria}</p>
        </DetailSection>

        <DetailSection title="검증 메모">
          <ul className="space-y-2">
            {update.verificationNotes.map((note) => (
              <li key={note} className="flex gap-3">
                <span className="mt-3 h-px w-4 shrink-0 bg-[#b08d57]" aria-hidden="true" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </DetailSection>

        <DetailSection title="확인 화면">
          <div className="border border-[#ded6c9] bg-[#fbfaf7]/65 p-5">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#8a6a39] uppercase">
              {update.image.status === 'available'
                ? 'Image Available'
                : update.image.status === 'limited'
                  ? 'Limited Image'
                  : 'No Product Image'}
            </p>
            <p className="mt-3">{update.image.caption}</p>
          </div>
        </DetailSection>
      </article>
    </main>
  );
}
