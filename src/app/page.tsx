import Link from 'next/link';
import { CONTENT_SECTIONS, getContentSection } from '@/lib/content/catalog';
import {
  getPublishedContent,
  type PublicContentSummary,
} from '@/lib/content/public';

export const dynamic = 'force-dynamic';

const DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function detailHref(item: PublicContentSummary) {
  return `${getContentSection(item.type).href}/${item.slug}`;
}

function ContentDate({ item }: { item: PublicContentSummary }) {
  return (
    <time dateTime={item.publishedAt}>
      {DATE_FORMATTER.format(new Date(item.publishedAt))}
    </time>
  );
}

export default async function HomePage() {
  let latest: PublicContentSummary[] = [];

  try {
    latest = await getPublishedContent(undefined, 18);
  } catch {
    latest = [];
  }

  const featured =
    latest.find((item) => item.type === 'knowledge') ?? latest[0];
  const lecture = latest.find((item) => item.type === 'lecture');
  const practice = latest.find((item) => item.type === 'practice');
  const update = latest.find((item) => item.type === 'ai_update');
  const book = latest.find((item) => item.type === 'book');
  const recentKnowledge = latest
    .filter((item) => item.type === 'knowledge' && item.id !== featured?.id)
    .slice(0, 5);

  return (
    <main id="main-content" className="home-page">
      <section className="site-shell home-masthead">
        <div className="masthead-index" aria-hidden="true">
          <span>THE INFINITE INDEX</span>
          <strong>001</strong>
        </div>
        <div className="masthead-copy">
          <p className="eyebrow">DECHIVE · KNOWLEDGE ARCHIVE</p>
          <h1>AI를 이해하고 다루는 모든 지식.</h1>
          <p>
            원본을 찾고, 직접 확인하고, 이해한 언어로 다시 설명합니다.
            지식은 강의가 되고, 강의는 실제 만드는 과정으로 이어집니다.
          </p>
        </div>
      </section>

      {featured ? (
        <section className="site-shell home-feature-grid" aria-label="최근 콘텐츠">
          <article className="featured-story">
            <Link href={detailHref(featured)}>
              <span className="story-kicker">
                01 · {getContentSection(featured.type).label}
              </span>
              <div className="story-visual" aria-hidden="true">
                <span>KNOWLEDGE</span>
                <strong>{String(latest.length).padStart(3, '0')}</strong>
              </div>
              <div className="story-copy">
                <h2>{featured.title}</h2>
                {featured.summary ? <p>{featured.summary}</p> : null}
                <ContentDate item={featured} />
              </div>
            </Link>
          </article>

          <div className="learning-stories">
            {[lecture, practice].map((item, index) => {
              const section = CONTENT_SECTIONS[index + 1];

              return (
                <article key={section.type}>
                  <span className="story-kicker">
                    {section.index} · {section.label}
                  </span>
                  {item ? (
                    <Link href={detailHref(item)}>
                      <h2>{item.title}</h2>
                      {item.summary ? <p>{item.summary}</p> : null}
                      <ContentDate item={item} />
                    </Link>
                  ) : (
                    <Link className="section-entry" href={section.href}>
                      <h2>{section.description}</h2>
                      <span>전체 보기 →</span>
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="site-shell home-directory" aria-labelledby="directory-title">
          <div className="directory-heading">
            <p className="eyebrow">BROWSE THE ARCHIVE</p>
            <h2 id="directory-title">어디서부터 살펴볼까요?</h2>
          </div>
          <ol>
            {CONTENT_SECTIONS.map((section) => (
              <li key={section.type}>
                <Link href={section.href}>
                  <span>{section.index}</span>
                  <strong>{section.label}</strong>
                  <p>{section.description}</p>
                  <b aria-hidden="true">↗</b>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {recentKnowledge.length > 0 ? (
        <section className="site-shell knowledge-ledger" aria-labelledby="knowledge-title">
          <div className="ledger-heading">
            <p className="eyebrow">RECENT KNOWLEDGE</p>
            <h2 id="knowledge-title">최근 정리한 지식</h2>
            <Link href="/knowledge">모든 지식 보기 →</Link>
          </div>
          <ol>
            {recentKnowledge.map((item, index) => (
              <li key={item.id}>
                <Link href={detailHref(item)}>
                  <span>{String(index + 2).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <ContentDate item={item} />
                  <b aria-hidden="true">→</b>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {update || book ? (
        <section className="site-shell home-notes" aria-label="업데이트와 책">
          {update ? (
            <article className="update-note">
              <span className="story-kicker">04 · AI UPDATE</span>
              <Link href={detailHref(update)}>
                <ContentDate item={update} />
                <h2>{update.title}</h2>
                <span>변경 내용 확인 →</span>
              </Link>
            </article>
          ) : null}
          {book ? (
            <article className="book-note">
              <span className="story-kicker">05 · BOOKS</span>
              <Link href={detailHref(book)}>
                <h2>{book.title}</h2>
                {book.summary ? <p>{book.summary}</p> : null}
                <span>책 소개 보기 →</span>
              </Link>
            </article>
          ) : null}
        </section>
      ) : null}

      <section className="site-shell archive-principle" aria-label="Dechive의 지식 구조">
        <p className="eyebrow">HOW KNOWLEDGE MOVES</p>
        <ol>
          <li>
            <span>01</span>
            <strong>Knowledge</strong>
            <p>하나의 개념을 독립된 글로 정확하게 설명합니다.</p>
          </li>
          <li>
            <span>02</span>
            <strong>Lecture</strong>
            <p>필요한 지식을 순서대로 묶어 하나의 강의로 연결합니다.</p>
          </li>
          <li>
            <span>03</span>
            <strong>Practice</strong>
            <p>배운 지식으로 실제 결과물을 만든 과정을 기록합니다.</p>
          </li>
        </ol>
      </section>
    </main>
  );
}
