import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BookContent from '@/components/book/BookContent';
import BookCover from '@/components/book/BookCover';
import { getAllBookNotes, getBookNoteBySlug } from '@/lib/books';

const BASE_URL = 'https://dechive.dev';
const COPYRIGHT_NOTICE =
  '이 기록은 책의 내용을 대체하지 않습니다. 짧은 인용과 개인적인 해석, 생각을 정리한 독서 기록입니다.';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatDate(date: string) {
  return date.replaceAll('-', '.');
}

export function generateStaticParams() {
  return getAllBookNotes('ko').map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookNoteBySlug(slug, 'ko');

  if (!book) return {};

  return {
    title: `${book.title} | Book`,
    description: book.summary,
    authors: [{ name: book.author }],
    keywords: book.tags,
    alternates: {
      canonical: `${BASE_URL}/book/${book.slug}`,
    },
    openGraph: {
      title: `${book.title} | Dechive Book`,
      description: book.summary,
      url: `${BASE_URL}/book/${book.slug}`,
      siteName: 'Dechive',
      locale: 'ko_KR',
      type: 'article',
      images: [
        {
          url: book.coverImage ? `${BASE_URL}${book.coverImage}` : `${BASE_URL}/images/thumb.webp`,
          width: 1200,
          height: 630,
          alt: book.title,
        },
      ],
    },
  };
}

export default async function BookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookNoteBySlug(slug, 'ko');

  if (!book) notFound();

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8f6f1] px-6 py-12 text-[#19140f] sm:px-8 lg:py-16">
      <article className="mx-auto max-w-5xl">
        <Link
          href="/book"
          className="text-xs font-semibold tracking-[0.16em] text-[#8a6a39] uppercase transition-colors hover:text-[#2a211b]"
        >
          ← Book
        </Link>

        <header className="mt-8 grid gap-10 border-b border-[#ded6c9] pb-10 md:grid-cols-[13rem_1fr]">
          <BookCover
            src={book.coverImage}
            title={book.title}
            priority
            className="w-full max-w-52"
          />

          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-[#9a7342] uppercase">
              Reading Note
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-header-serif)] text-4xl leading-tight font-medium text-[#2a211b] sm:text-5xl">
              {book.title}
            </h1>
            <div className="mt-5 space-y-2 text-sm leading-7 text-[#5f564d]">
              <p>저자: {book.author}</p>
              {book.publisher ? <p>출판사: {book.publisher}</p> : null}
              {book.readDate ? <p>읽은 날짜: {formatDate(book.readDate)}</p> : null}
              {book.date ? <p>기록 날짜: {formatDate(book.date)}</p> : null}
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5f564d]">
              {book.summary}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {book.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-[#bda77e]/40 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#6d5634] uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl">
          <BookContent content={book.content} />

          <section className="mt-12 border-t border-[#ded6c9] pt-8">
            <p className="rounded-sm border border-[#ded6c9] bg-[#fbfaf7]/70 px-5 py-4 text-xs leading-6 text-[#6f6257]">
              {COPYRIGHT_NOTICE}
            </p>
            <Link
              href="/book"
              className="mt-8 inline-flex text-xs font-semibold tracking-[0.16em] text-[#8a6a39] uppercase transition-colors hover:text-[#2a211b]"
            >
              목록으로 돌아가기
            </Link>
          </section>
        </div>
      </article>
    </main>
  );
}
