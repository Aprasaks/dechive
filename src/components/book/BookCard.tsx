import Link from 'next/link';
import BookCover from '@/components/book/BookCover';
import type { BookNote } from '@/lib/books';

interface BookCardProps {
  book: BookNote;
}

function formatDate(date: string) {
  return date.replaceAll('-', '.');
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link
      href={`/book/${book.slug}`}
      className="group grid gap-5 rounded-md border border-[#f5ead5]/12 bg-[#090909]/92 p-5 transition-colors hover:border-[#c89b62]/45 hover:bg-[#101010] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b] sm:grid-cols-[8.5rem_1fr] sm:p-6"
    >
      <BookCover
        src={book.coverImage}
        title={book.title}
        className="w-full max-w-36 sm:max-w-none"
      />
      <div className="flex flex-col justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[#d7ad73] uppercase">
            {formatDate(book.readDate || book.date)}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-header-serif)] text-2xl leading-tight font-medium text-[#f5ead5] transition-colors group-hover:text-[#f6d29b]">
            {book.title}
          </h2>
          <p className="mt-2 text-sm text-[#e8dfcd]/52">
            {book.author}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#e8dfcd]/62">
            {book.summary}
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {book.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-sm border border-[#f5ead5]/12 bg-[#f5ead5]/5 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#e8dfcd]/62 uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
