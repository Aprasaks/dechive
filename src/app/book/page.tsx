import type { Metadata } from 'next';
import BookCard from '@/components/book/BookCard';
import DechiveSectionHeader from '@/components/layout/DechiveSectionHeader';
import { getAllBookNotes } from '@/lib/books';

const BOOK_DESCRIPTION =
  '수집한 자료와 독서 기록을 Dechive의 장기 참조와 지식 맥락으로 남기는 공간입니다.';

export const metadata: Metadata = {
  title: 'Knowledge Base',
  description: BOOK_DESCRIPTION,
  alternates: {
    canonical: 'https://dechive.dev/book',
  },
  openGraph: {
    title: 'Knowledge Base | Dechive',
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
        alt: 'Dechive Knowledge Base',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Knowledge Base | Dechive',
    description: BOOK_DESCRIPTION,
    images: ['https://dechive.dev/images/thumb.webp'],
  },
};

export default function BookPage() {
  const books = getAllBookNotes('ko');

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#030303] text-[#f3eadb]">
      <DechiveSectionHeader
        eyebrow="Knowledge Base · 수집된 맥락"
        title="Materials collected to feed the archive."
        description="The archive grows from what is collected, kept, and returned to. These records become source material for future questions."
        meta="Materials · References · Context"
      />

      <section className="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:py-12">
        <div className="grid gap-4">
          {books.length ? (
            books.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))
          ) : (
            <p className="rounded-md border border-[#f5ead5]/10 bg-[#090909]/88 p-7 text-sm leading-7 text-[#e8dfcd]/62">
              아직 공개된 독서 기록이 없습니다.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
