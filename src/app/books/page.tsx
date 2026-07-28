import type { Metadata } from 'next';
import { generateHTML } from '@tiptap/html/server';
import { editorExtensions } from '@/features/editor-lab/editor-extensions';
import BooksShowcase, { type BookShowcaseItem } from '@/features/books/BooksShowcase';
import AnalyticsContentTracker from '@/components/analytics/AnalyticsContentTracker';
import {
  createPublishedBookDatabase,
  getPublishedBooks,
  type PublishedBook,
} from '@/services/published-books';
import styles from './books.module.css';

const BASE_URL = 'https://dechive.dev';
const BOOK_PURCHASE_URL = 'https://www.latpeed.com/products/ufElk';
const PREVIEW_PAGE_PATHS = Array.from({ length: 8 }, (_, index) =>
  `/images/books/preview/book-1-page-${String(index + 4).padStart(3, '0')}.jpg`,
);

export const metadata: Metadata = {
  title: 'Books',
  description: '축적된 지식과 검증의 과정을 한 권의 흐름으로 엮은 Dechive의 책.',
  alternates: { canonical: `${BASE_URL}/books` },
  openGraph: {
    title: 'Books | Dechive',
    description: '축적된 지식과 검증의 과정을 한 권의 흐름으로 엮은 Dechive의 책.',
    url: `${BASE_URL}/books`,
    type: 'website',
  },
};

export const revalidate = 300;

const fallbackBook: BookShowcaseItem = {
  id: 'making-before-verification',
  slug: 'making-before-verification',
  title: '만들기 전에 검증하라',
  subtitle: '바이브코딩, 1인 창업, AI SaaS의 착각들',
  summary: '빠르게 만드는 시대, 실패하는 이유는 단 하나. 검증 없이 만들기 때문입니다. 이 책은 AI와 바이브코딩, 1인 창업의 성공 확률을 높이는 검증의 모든 단계를 다룹니다.',
  authorName: 'Dechive',
  pageCount: 154,
  coverImageUrl: '/images/books/book-1.webp',
  publishedOn: '2025-05-26',
  previewHtml: '<p>무엇을 만들지보다 먼저 물어야 할 질문이 있습니다.</p><p>이 문제가 정말 존재하는가? 누가 이 문제를 해결하고 싶은가? 지금 만들려는 것이 검증된 가설 위에 서 있는가?</p><h2>검증은 속도를 늦추는 일이 아닙니다</h2><p>검증은 만드는 속도를 줄이는 장치가 아니라, 잘못된 방향으로 달리는 시간을 줄이는 방법입니다.</p>',
  previewPages: PREVIEW_PAGE_PATHS,
  purchaseHref: BOOK_PURCHASE_URL,
  purchaseLabel: '전자책 구매',
};

function toPreviewHtml(book: PublishedBook): string {
  try {
    return generateHTML(book.body, editorExtensions);
  } catch {
    return `<p>${book.summary}</p>`;
  }
}

function toShowcaseItem(book: PublishedBook): BookShowcaseItem {
  const isFree = book.accessType === 'free';
  return {
    id: book.localizationId,
    slug: book.slug,
    title: book.title,
    subtitle: book.subtitle,
    summary: book.summary,
    authorName: book.authorName,
    pageCount: book.pageCount,
    coverImageUrl: book.coverImageUrl || '/images/books/book-1.webp',
    publishedOn: book.publishedOn,
    previewHtml: toPreviewHtml(book),
    previewPages: book.title === fallbackBook.title ? PREVIEW_PAGE_PATHS : [],
    purchaseHref: book.title === fallbackBook.title
      ? BOOK_PURCHASE_URL
      : isFree && book.freeDownloadUrl
      ? book.freeDownloadUrl
      : '/contact?subject=book-purchase',
    purchaseLabel: book.title === fallbackBook.title || !(isFree && book.freeDownloadUrl) ? '전자책 구매' : '전자책 받기',
  };
}

async function loadBooks(): Promise<BookShowcaseItem[]> {
  const { pool } = createPublishedBookDatabase();
  try {
    const books = await getPublishedBooks(pool);
    return books.map(toShowcaseItem);
  } catch {
    // Books should remain useful while the optional public-book database is unavailable.
    return [];
  } finally {
    await pool.end();
  }
}

export default async function BooksPage() {
  const books = await loadBooks();
  const featuredBook = books[0] ?? fallbackBook;

  return (
    <main id="main-content" className={styles.booksPage}>
      <section className={`page-shell ${styles.intro}`}>
        <p className={styles.eyebrow}>Books</p>
        <h1 className={styles.pageTitle}>책으로 엮은 지식</h1>
        <p className={styles.pageLead}>쌓아온 지식과 경험을 한 권의 흐름으로 엮습니다.</p>
      </section>

      <BooksShowcase book={featuredBook} />
      <AnalyticsContentTracker contentType="book" contentId={featuredBook.id} route="/books" progress={false} />

      <section className={`page-shell ${styles.nextBook}`} aria-label="다음 책 안내">
        <p>다음 책도 준비하고 있습니다.</p>
      </section>
    </main>
  );
}
