import type { Metadata } from 'next';
import BookCard from '@/components/book/BookCard';
import { getAllBookNotes } from '@/lib/books';

const BOOK_DESCRIPTION =
  '책에서 만난 문장과 그 문장에서 출발한 생각을 남기는 Dechive 독서 기록 서가입니다.';

export const metadata: Metadata = {
  title: 'Book',
  description: BOOK_DESCRIPTION,
  alternates: {
    canonical: 'https://dechive.dev/book',
  },
  openGraph: {
    title: 'Book | Dechive',
    description: BOOK_DESCRIPTION,
    url: 'https://dechive.dev/book',
    siteName: 'Dechive',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://dechive.dev/images/thumb.webp',
        width: 1200,
        height: 630,
        alt: 'Dechive Book',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book | Dechive',
    description: BOOK_DESCRIPTION,
    images: ['https://dechive.dev/images/thumb.webp'],
  },
};

export default function BookPage() {
  const books = getAllBookNotes('ko');

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8f6f1] px-6 py-16 text-[#19140f] sm:px-8 lg:py-20">
      <section className="mx-auto max-w-6xl">
        <div className="border-b border-[#ded6c9] pb-10">
          <p className="text-xs font-medium tracking-[0.24em] text-[#9a7a3f] uppercase">
            Dechive Book
          </p>
          <h1 className="mt-5 font-[family-name:var(--font-header-serif)] text-4xl font-medium text-[#2a211b] sm:text-5xl">
            인용과 생각의 서가
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6f6257]">
            책의 내용을 대신하지 않고, 책에서 붙잡은 짧은 문장과 그 문장에서 출발한 생각을 남깁니다.
            <br className="hidden sm:block" />
            이곳은 요약본이 아니라 생각이 기록으로 남는 독서 기록입니다.
          </p>
        </div>

        <div className="mt-8">
          {books.length ? (
            books.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))
          ) : (
            <p className="py-10 text-sm leading-7 text-[#6f6257]">
              아직 공개된 독서 기록이 없습니다.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
