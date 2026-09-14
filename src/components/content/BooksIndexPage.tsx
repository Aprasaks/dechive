import Image from 'next/image';
import Link from 'next/link';
import {
  FEATURED_BOOK,
  resolveBookCover,
  resolveBookPurchaseLinks,
} from '@/lib/content/book-catalog';
import {
  getPublishedBookDetail,
  getPublishedContent,
  type PublicBookDetail,
  type PublicContentSummary,
} from '@/lib/content/public';

const DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function PurchaseLinks({
  links,
}: {
  links: { label: string; url: string }[];
}) {
  const safeLinks = links.filter((link) => {
    try {
      const url = new URL(link.url);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
      return false;
    }
  });

  return (
    <div className="books-purchase-links" aria-label="외부 판매처">
      {safeLinks.map((link) => (
        <a
          href={link.url}
          key={`${link.label}-${link.url}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {link.label}에서 보기 <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

function PublishedBook({
  book,
  detail,
}: {
  book: PublicContentSummary;
  detail: PublicBookDetail | null;
}) {
  const cover = resolveBookCover(book.title, book.image ?? detail?.cover);
  const purchaseLinks = resolveBookPurchaseLinks(
    book.title,
    detail?.purchaseLinks ?? [],
  );

  return (
    <article className="books-featured">
      <Link className="books-featured-cover" href={`/books/${book.slug}`}>
        {cover ? (
          <Image
            alt={cover.alt}
            fill
            priority
            sizes="(max-width: 760px) 72vw, 24rem"
            src={cover.url}
          />
        ) : (
          <span className="books-cover-fallback">DECHIVE BOOKS</span>
        )}
      </Link>

      <div className="books-featured-copy">
        <p className="eyebrow">WHY THIS BOOK</p>
        <h2>
          <Link href={`/books/${book.slug}`}>{book.title}</Link>
        </h2>
        {book.summary ? (
          <p className="books-featured-summary">{book.summary}</p>
        ) : null}
        {detail ? (
          <dl className="books-facts">
            <div>
              <dt>저자</dt>
              <dd>{detail.author}</dd>
            </div>
            {detail.publisher ? (
              <div>
                <dt>출판</dt>
                <dd>{detail.publisher}</dd>
              </div>
            ) : null}
            {detail.publicationDate ? (
              <div>
                <dt>출간</dt>
                <dd>{DATE_FORMATTER.format(new Date(detail.publicationDate))}</dd>
              </div>
            ) : null}
            {detail.format ? (
              <div>
                <dt>형식</dt>
                <dd>{detail.format}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
        <div className="books-featured-actions">
          <Link href={`/books/${book.slug}`}>
            책 소개 읽기 <span aria-hidden="true">→</span>
          </Link>
          <PurchaseLinks links={purchaseLinks} />
        </div>
      </div>
    </article>
  );
}

function CatalogBook() {
  return (
    <article className="books-featured books-featured-catalog">
      <div className="books-featured-cover">
        <Image
          alt={FEATURED_BOOK.coverAlt}
          fill
          priority
          sizes="(max-width: 760px) 72vw, 24rem"
          src={FEATURED_BOOK.cover}
        />
      </div>
      <div className="books-featured-copy">
        <p className="eyebrow">WHY THIS BOOK</p>
        <h2>{FEATURED_BOOK.title}</h2>
        <p className="books-subtitle">{FEATURED_BOOK.subtitle}</p>
        <p className="books-featured-summary">{FEATURED_BOOK.reason}</p>
        <dl className="books-facts">
          <div>
            <dt>저자</dt>
            <dd>{FEATURED_BOOK.author}</dd>
          </div>
          <div>
            <dt>출판</dt>
            <dd>{FEATURED_BOOK.publisher}</dd>
          </div>
          <div>
            <dt>출간</dt>
            <dd>2026. 09. 04.</dd>
          </div>
          <div>
            <dt>형식</dt>
            <dd>{FEATURED_BOOK.format}</dd>
          </div>
        </dl>
        <div className="books-featured-actions">
          <PurchaseLinks links={[...FEATURED_BOOK.purchaseLinks]} />
          <p>구매와 열람은 선택한 외부 판매처에서 진행됩니다.</p>
        </div>
      </div>
    </article>
  );
}

function CatalogBookDetails() {
  return (
    <div className="site-shell books-detail-content">
      <section className="books-problem" aria-labelledby="books-problem-title">
        <div className="books-detail-label">
          <span>01</span>
          <p>THE PROBLEM</p>
        </div>
        <div>
          <h2 id="books-problem-title">만드는 속도보다 먼저 확인할 것</h2>
          <p>{FEATURED_BOOK.problem}</p>
          <ol className="books-question-list">
            {FEATURED_BOOK.questions.map((question, index) => (
              <li key={question}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{question}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="books-reader-grid" aria-label="추천 독자와 읽고 얻을 것">
        <div>
          <div className="books-detail-label">
            <span>02</span>
            <p>FOR WHOM</p>
          </div>
          <h2>이런 분에게 필요합니다</h2>
          <ul>
            {FEATURED_BOOK.audiences.map((audience) => (
              <li key={audience}>{audience}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="books-detail-label">
            <span>03</span>
            <p>TAKEAWAYS</p>
          </div>
          <h2>읽고 나면 남는 기준</h2>
          <ul>
            {FEATURED_BOOK.takeaways.map((takeaway) => (
              <li key={takeaway}>{takeaway}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="books-toc" aria-labelledby="books-toc-title">
        <div className="books-toc-heading">
          <div className="books-detail-label">
            <span>04</span>
            <p>CONTENTS</p>
          </div>
          <div>
            <h2 id="books-toc-title">여섯 개의 질문 흐름</h2>
            <p>45개의 짧은 장과 실제 제작 기록인 CASE NOTE로 이어집니다.</p>
          </div>
        </div>
        <ol>
          {FEATURED_BOOK.tableOfContents.map((item) => (
            <li key={item.part}>
              <span>{item.part}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="books-final-cta" aria-label="전자책 판매처">
        <div>
          <p>DECHIVE DEEPDIVE</p>
          <h2>{FEATURED_BOOK.title}</h2>
          <span>PDF · 약 {FEATURED_BOOK.pageCount}쪽 · ISBN {FEATURED_BOOK.isbn}</span>
        </div>
        <PurchaseLinks links={[...FEATURED_BOOK.purchaseLinks]} />
      </section>
    </div>
  );
}

export async function BooksIndexPage() {
  let books: PublicContentSummary[] = [];
  let details: (PublicBookDetail | null)[] = [];

  try {
    books = await getPublishedContent('book', 30);
    details = await Promise.all(
      books.map((book) => getPublishedBookDetail(book.slug)),
    );
  } catch {
    books = [];
    details = [];
  }

  return (
    <main className="books-index" id="main-content">
      <header className="site-shell books-heading">
        <p>DECHIVE / BOOKS</p>
        <h1>전자책</h1>
        <p>하나의 질문을 오래 붙들고 정리한 글과 프롬프트를 책으로 엮습니다.</p>
      </header>

      <section className="books-showcase" aria-label="전자책 소개">
        <div className="site-shell">
          {books.length > 0 ? (
            <PublishedBook book={books[0]} detail={details[0] ?? null} />
          ) : (
            <CatalogBook />
          )}
        </div>
      </section>

      {books.length === 0 ? <CatalogBookDetails /> : null}

      {books.length > 1 ? (
        <section
          aria-labelledby="books-archive-title"
          className="site-shell books-archive"
        >
          <div className="books-archive-heading">
            <p>ARCHIVE</p>
            <h2 id="books-archive-title">발행한 책</h2>
          </div>
          <ol>
            {books.slice(1).map((book) => {
              const cover = resolveBookCover(book.title, book.image);
              return (
                <li key={book.id}>
                  <Link href={`/books/${book.slug}`}>
                    <div className="books-archive-cover">
                      {cover ? (
                        <Image
                          alt={cover.alt}
                          fill
                          sizes="16rem"
                          src={cover.url}
                        />
                      ) : (
                        <span className="books-cover-fallback">DECHIVE BOOKS</span>
                      )}
                    </div>
                    <h3>{book.title}</h3>
                    {book.summary ? <p>{book.summary}</p> : null}
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}
    </main>
  );
}
