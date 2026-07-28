'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useAnalytics } from '@/components/analytics/AnalyticsProvider';
import styles from './BooksShowcase.module.css';

export type BookShowcaseItem = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  authorName: string;
  pageCount: number | null;
  coverImageUrl: string;
  publishedOn: string;
  previewHtml: string;
  previewPages: string[];
  purchaseHref: string;
  purchaseLabel: string;
};

function formatPublishedOn(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export default function BooksShowcase({ book }: { book: BookShowcaseItem }) {
  const { track } = useAnalytics();
  const trackPurchase = (source: string) => track(book.purchaseLabel === '전자책 받기' ? 'file_download' : 'book_purchase_click', { contentType: 'book', contentId: book.id, route: '/books', metadata: { href: book.purchaseHref, label: book.purchaseLabel, source } });
  const [previewOpen, setPreviewOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!previewOpen) return;
    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
      lastFocusedRef.current?.focus();
    };
  }, [previewOpen]);

  return (
    <>
      <section className={`page-shell ${styles.featuredBook}`} aria-labelledby="featured-book-title">
        <div className={styles.coverColumn}>
          <div className={styles.bookCover}>
            <div className={styles.bookSpine} aria-hidden="true" />
            <Image
              src={book.coverImageUrl}
              alt={`${book.title} 책 표지`}
              width={1076}
              height={1532}
              unoptimized
              priority
              className={styles.coverImage}
              sizes="(max-width: 47.99rem) 68vw, (max-width: 63.99rem) 34vw, 25rem"
            />
          </div>
        </div>

        <div className={styles.bookInfo}>
          <p className={styles.bookNumber}>Dechive Book 01</p>
          <span className={styles.accentRule} aria-hidden="true" />
          <h2 id="featured-book-title" className={styles.bookTitle}>{book.title}</h2>
          <p className={styles.bookSummary}>{book.summary}</p>
          <p className={styles.bookMeta}>
            {book.authorName ? `${book.authorName} · ` : ''}
            {book.pageCount ? `${book.pageCount}쪽` : '전자책'}
          </p>

          <div className={styles.actions}>
            <a
              className={styles.purchaseButton}
              href={book.purchaseHref}
              target={book.purchaseHref.startsWith('/') ? undefined : '_blank'}
              rel={book.purchaseHref.startsWith('/') ? undefined : 'noopener noreferrer'}
              onClick={() => trackPurchase('featured_cta')}
            >
              {book.purchaseLabel}
            </a>
          </div>

          <div className={styles.previewPrompt}>
            <p>구매 전에 몇 페이지를 먼저 읽어보세요.</p>
            <button type="button" onClick={() => { setPreviewOpen(true); track('book_preview_open', { contentType: 'book', contentId: book.id, route: '/books', metadata: { pageCount: book.previewPages.length } }); }}>미리보기 열기 <span aria-hidden="true">→</span></button>
          </div>
          <p className={styles.publishedDate}>출간 {formatPublishedOn(book.publishedOn)}</p>
        </div>
      </section>

      {previewOpen ? (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setPreviewOpen(false)}>
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-preview-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className={styles.modalHeader}>
              <div>
                <p className={styles.modalEyebrow}>Book Preview</p>
                <h2 id="book-preview-title">{book.title}</h2>
              </div>
              <button ref={closeButtonRef} type="button" className={styles.closeButton} onClick={() => setPreviewOpen(false)} aria-label="미리보기 닫기">×</button>
            </header>
            {book.previewPages.length ? (
              <div className={styles.previewPages} aria-label="책 미리보기 페이지">
                {book.previewPages.map((page, index) => (
                  <Image
                    key={page}
                    src={page}
                    alt={`${book.title} 미리보기 ${index + 1}페이지`}
                    width={1422}
                    height={2011}
                    unoptimized
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className={styles.previewPage}
                    sizes="(max-width: 52rem) 100vw, 48rem"
                  />
                ))}
              </div>
            ) : (
              <div className={styles.previewDocument} dangerouslySetInnerHTML={{ __html: book.previewHtml }} />
            )}
            <footer className={styles.modalFooter}>
              <span>미리보기 끝</span>
              <a href={book.purchaseHref} onClick={() => { setPreviewOpen(false); trackPurchase('preview_modal'); }}>{book.purchaseLabel} →</a>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}
