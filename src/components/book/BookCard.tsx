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
      className="group grid gap-5 border-t border-[#ded6c9] py-7 transition-colors hover:border-[#b08d57] sm:grid-cols-[8.5rem_1fr]"
    >
      <BookCover
        src={book.coverImage}
        title={book.title}
        className="w-full max-w-36 sm:max-w-none"
      />
      <div className="flex flex-col justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[#9a7342] uppercase">
            {formatDate(book.readDate || book.date)}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-header-serif)] text-2xl leading-tight font-medium text-[#2a211b] transition-colors group-hover:text-[#7a5d2c]">
            {book.title}
          </h2>
          <p className="mt-2 text-sm text-[#6f6257]">
            {book.author}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f564d]">
            {book.summary}
          </p>
        </div>
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
    </Link>
  );
}
