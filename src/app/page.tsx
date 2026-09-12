import Image from 'next/image';
import Link from 'next/link';
import { CONTENT_SECTIONS, getContentSection } from '@/lib/content/catalog';
import {
  getPublishedContent,
  getPublishedKnowledgeDetail,
  type PublicContentSummary,
  type PublicKnowledgeDetail,
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

function ContentImage({
  item,
  priority = false,
}: {
  item: PublicContentSummary;
  priority?: boolean;
}) {
  if (!item.image) {
    return (
      <div className="home-image-fallback" aria-hidden="true">
        <span>DECHIVE</span>
        <strong>{getContentSection(item.type).label}</strong>
      </div>
    );
  }

  return (
    <Image
      src={item.image.url}
      alt={item.image.alt}
      fill
      priority={priority}
      sizes={
        priority
          ? '(max-width: 900px) 100vw, 42vw'
          : '(max-width: 900px) 100vw, 22vw'
      }
    />
  );
}

function LearningFeature({
  item,
  kind,
}: {
  item: PublicContentSummary;
  kind: 'lecture' | 'practice';
}) {
  const section = getContentSection(kind);

  return (
    <article className="home-learning-card">
      <div className="home-section-heading">
        <div>
          <h2>{section.navLabel}</h2>
          <p>
            {kind === 'lecture'
              ? 'AI를 더 깊이 이해하는 학습 과정'
              : '직접 만들며 익히는 AI 활용법'}
          </p>
        </div>
        <Link href={section.href}>
          더보기 <span aria-hidden="true">→</span>
        </Link>
      </div>
      <Link className="home-learning-entry" href={detailHref(item)}>
        <div className="home-learning-image">
          <ContentImage item={item} />
        </div>
        <div className="home-learning-copy">
          <span>{kind === 'lecture' ? '강의' : '실습'}</span>
          <h3>{item.title}</h3>
          {item.summary ? <p>{item.summary}</p> : null}
          <ContentDate item={item} />
        </div>
      </Link>
    </article>
  );
}

export default async function HomePage() {
  let latest: PublicContentSummary[] = [];
  let featuredDetail: PublicKnowledgeDetail | null = null;

  try {
    latest = await getPublishedContent(undefined, 24);
    const firstKnowledge = latest.find((item) => item.type === 'knowledge');
    if (firstKnowledge) {
      featuredDetail = await getPublishedKnowledgeDetail(firstKnowledge.slug);
    }
  } catch {
    latest = [];
    featuredDetail = null;
  }

  const featured =
    latest.find((item) => item.type === 'knowledge') ?? latest[0];
  const lecture = latest.find((item) => item.type === 'lecture');
  const practice = latest.find((item) => item.type === 'practice');
  const update = latest.find((item) => item.type === 'ai_update');
  const book = latest.find((item) => item.type === 'book');
  const recentKnowledge = latest
    .filter((item) => item.type === 'knowledge' && item.id !== featured?.id)
    .slice(0, 4);
  const learningObjectives =
    featured?.type === 'knowledge'
      ? featuredDetail?.learningObjectives ?? []
      : [];

  return (
    <main id="main-content" className="home-page home-editorial">
      {featured ? (
        <section
          className={`site-shell home-lead-grid${
            recentKnowledge.length === 0 ? ' without-ledger' : ''
          }`}
          aria-label="대표 콘텐츠와 최신 지식"
        >
          <Link className="home-lead-image" href={detailHref(featured)}>
            <ContentImage item={featured} priority />
            <span>{getContentSection(featured.type).navLabel}</span>
          </Link>

          <article className="home-lead-copy">
            <p className="home-kicker">AI를 다루기 위해 알아야 할 지식</p>
            <h1>
              <Link href={detailHref(featured)}>{featured.title}</Link>
            </h1>
            {featured.summary ? (
              <p className="home-lead-summary">{featured.summary}</p>
            ) : null}
            <ContentDate item={featured} />

            {learningObjectives.length > 0 ? (
              <section
                className="home-objectives"
                aria-labelledby="home-objectives-title"
              >
                <h2 id="home-objectives-title">이번 글에서 알아야 할 것</h2>
                <ol>
                  {learningObjectives.slice(0, 3).map((objective, index) => (
                    <li key={objective}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <p>{objective}</p>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </article>

          {recentKnowledge.length > 0 ? (
            <aside className="home-recent" aria-labelledby="home-recent-title">
              <div className="home-recent-heading">
                <h2 id="home-recent-title">최신 지식</h2>
                <Link href="/knowledge">
                  더보기 <span aria-hidden="true">→</span>
                </Link>
              </div>
              <ol>
                {recentKnowledge.map((item) => (
                  <li key={item.id}>
                    <Link href={detailHref(item)}>
                      <div className="home-recent-image">
                        <ContentImage item={item} />
                      </div>
                      <div>
                        <h3>{item.title}</h3>
                        {item.summary ? <p>{item.summary}</p> : null}
                        <ContentDate item={item} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </aside>
          ) : null}
        </section>
      ) : (
        <section
          className="site-shell home-empty"
          aria-labelledby="home-empty-title"
        >
          <p>DECHIVE</p>
          <h1 id="home-empty-title">AI를 이해하고 다루는 모든 지식.</h1>
          <p>원본을 찾고, 직접 확인하고, 이해한 언어로 다시 설명합니다.</p>
          <nav aria-label="콘텐츠 둘러보기">
            {CONTENT_SECTIONS.map((section) => (
              <Link href={section.href} key={section.type}>
                {section.navLabel}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
        </section>
      )}

      {lecture || practice || update ? (
        <section
          className="site-shell home-content-grid"
          aria-label="강의, 실습, AI Update"
        >
          {lecture ? <LearningFeature item={lecture} kind="lecture" /> : null}
          {practice ? <LearningFeature item={practice} kind="practice" /> : null}
          {update ? (
            <article className="home-update-card">
              <div className="home-section-heading">
                <div>
                  <h2>오늘의 AI 변화</h2>
                  <p>
                    <ContentDate item={update} />
                  </p>
                </div>
                <Link href="/ai-updates">
                  더보기 <span aria-hidden="true">→</span>
                </Link>
              </div>
              <Link className="home-update-entry" href={detailHref(update)}>
                <span aria-hidden="true" />
                <h3>{update.title}</h3>
                {update.summary ? <p>{update.summary}</p> : null}
                <b aria-hidden="true">→</b>
              </Link>
            </article>
          ) : null}
        </section>
      ) : null}

      {book ? (
        <section className="home-book">
          <div className="site-shell home-book-inner">
            <div className="home-book-copy">
              <p>전자책</p>
              <h2>왜 이 책을 읽어야 하는가</h2>
              {book.summary ? <p>{book.summary}</p> : null}
            </div>
            <Link className="home-book-cover" href={detailHref(book)}>
              <ContentImage item={book} />
            </Link>
            <div className="home-book-action">
              <h3>{book.title}</h3>
              <Link href={detailHref(book)}>
                책 자세히 보기 <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
