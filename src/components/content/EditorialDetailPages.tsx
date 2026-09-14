import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  resolveBookCover,
  resolveBookPurchaseLinks,
} from '@/lib/content/book-catalog';
import {
  getPublishedAiUpdateDetail,
  getPublishedBookDetail,
  getPublishedLectureDetail,
  getPublishedPracticeDetail,
  type PublicBaseDetail,
} from '@/lib/content/public';
import { TiptapDocument } from './TiptapDocument';

const DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function safeExternalUrl(value: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? value : null;
  } catch {
    return null;
  }
}

function youtubeEmbedUrl(value: string | null): string | null {
  const safeUrl = safeExternalUrl(value);
  if (!safeUrl) return null;

  const url = new URL(safeUrl);
  let videoId = '';

  if (url.hostname === 'youtu.be') {
    videoId = url.pathname.slice(1).split('/')[0] ?? '';
  } else if (url.hostname.endsWith('youtube.com')) {
    videoId =
      url.searchParams.get('v') ??
      (url.pathname.startsWith('/embed/')
        ? url.pathname.split('/')[2] ?? ''
        : '');
  }

  return /^[a-zA-Z0-9_-]{6,}$/.test(videoId)
    ? `https://www.youtube-nocookie.com/embed/${videoId}`
    : null;
}

function DetailHeader({
  detail,
  label,
  href,
  eyebrow,
}: {
  detail: PublicBaseDetail;
  label: string;
  href: string;
  eyebrow: string;
}) {
  return (
    <header className="site-shell editorial-detail-header">
      <div className="article-breadcrumbs">
        <Link href={href}>{label}</Link>
        <span aria-hidden="true">/</span>
        <span>Revision {detail.revisionNumber}</span>
      </div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{detail.title}</h1>
        {detail.summary ? <p>{detail.summary}</p> : null}
      </div>
      <dl>
        <div>
          <dt>공개일</dt>
          <dd>
            <time dateTime={detail.publishedAt}>
              {DATE_FORMATTER.format(new Date(detail.publishedAt))}
            </time>
          </dd>
        </div>
        {detail.verifiedAt ? (
          <div>
            <dt>마지막 검증</dt>
            <dd>
              <time dateTime={detail.verifiedAt}>
                {DATE_FORMATTER.format(new Date(detail.verifiedAt))}
              </time>
            </dd>
          </div>
        ) : null}
      </dl>
    </header>
  );
}

function DetailCover({ detail }: { detail: PublicBaseDetail }) {
  if (!detail.cover) return null;

  return (
    <figure className="site-shell editorial-cover">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={detail.cover.url} alt={detail.cover.alt} />
      {detail.cover.caption ? <figcaption>{detail.cover.caption}</figcaption> : null}
    </figure>
  );
}

function DetailBody({
  detail,
  label,
}: {
  detail: PublicBaseDetail;
  label: string;
}) {
  return (
    <section className="site-shell editorial-body-section" aria-label={label}>
      <TiptapDocument bodyJson={detail.bodyJson} />
    </section>
  );
}

export async function LectureDetailPage({ slug }: { slug: string }) {
  const detail = await getPublishedLectureDetail(slug);
  if (!detail) notFound();
  const embedUrl = youtubeEmbedUrl(detail.youtubeUrl);

  return (
    <main id="main-content" className="editorial-detail lecture-detail">
      <article>
        <DetailHeader
          detail={detail}
          label="Lecture"
          href="/lecture"
          eyebrow="LEARNING PATH"
        />
        <DetailCover detail={detail} />

        {detail.introduction || detail.learningObjectives.length > 0 ? (
          <section className="site-shell lecture-overview">
            <span>OVERVIEW</span>
            <div>
              {detail.introduction ? <p>{detail.introduction}</p> : null}
              {detail.learningObjectives.length > 0 ? (
                <>
                  <h2>이 강의에서 알아야 할 것</h2>
                  <ol>
                    {detail.learningObjectives.map((objective, index) => (
                      <li key={objective}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        {objective}
                      </li>
                    ))}
                  </ol>
                </>
              ) : null}
            </div>
          </section>
        ) : null}

        {embedUrl ? (
          <section className="site-shell lecture-video" aria-label="강의 영상">
            <div>
              <iframe
                src={embedUrl}
                title={`${detail.title} 강의 영상`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {detail.timestamps.length > 0 ? (
              <ol>
                {detail.timestamps.map((timestamp) => (
                  <li key={`${timestamp.time}-${timestamp.label}`}>
                    <span>{timestamp.time}</span>
                    <strong>{timestamp.label}</strong>
                  </li>
                ))}
              </ol>
            ) : null}
          </section>
        ) : null}

        <DetailBody detail={detail} label="강의 설명" />

        {detail.materials.length > 0 ? (
          <section className="site-shell detail-downloads" aria-labelledby="materials-title">
            <h2 id="materials-title">강의자료</h2>
            <ul>
              {detail.materials.map((material) => {
                const href = safeExternalUrl(material.url);
                return href ? (
                  <li key={`${material.label}-${material.url}`}>
                    <a href={href} target="_blank" rel="noreferrer">
                      <span>{material.label}</span>
                      <b aria-hidden="true">다운로드 ↗</b>
                    </a>
                  </li>
                ) : null;
              })}
            </ul>
          </section>
        ) : null}
      </article>
    </main>
  );
}

export async function PracticeDetailPage({ slug }: { slug: string }) {
  const detail = await getPublishedPracticeDetail(slug);
  if (!detail) notFound();
  const demoUrl = safeExternalUrl(detail.demoUrl);

  return (
    <main id="main-content" className="editorial-detail practice-detail">
      <article>
        <DetailHeader
          detail={detail}
          label="Practice"
          href="/practice"
          eyebrow="BUILD RECORD"
        />

        <section className="site-shell practice-result" aria-labelledby="result-title">
          <div className="practice-result-visual">
            {detail.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={detail.cover.url} alt={detail.cover.alt} />
            ) : (
              <span>COMPLETED OUTPUT</span>
            )}
          </div>
          <div>
            <p className="eyebrow">THE RESULT</p>
            <h2 id="result-title">무엇을 만들었는가</h2>
            {detail.resultDescription ? <p>{detail.resultDescription}</p> : null}
            {demoUrl ? (
              <a href={demoUrl} target="_blank" rel="noreferrer">
                완성 결과 열기 ↗
              </a>
            ) : null}
          </div>
        </section>

        {detail.requirements || detail.tools.length > 0 || detail.estimatedCost ? (
          <section className="site-shell practice-facts" aria-label="실습 준비 정보">
            {detail.requirements ? (
              <div><span>필요한 것</span><p>{detail.requirements}</p></div>
            ) : null}
            {detail.tools.length > 0 ? (
              <div><span>도구</span><p>{detail.tools.join(' · ')}</p></div>
            ) : null}
            {detail.estimatedCost ? (
              <div><span>예상 비용</span><p>{detail.estimatedCost}</p></div>
            ) : null}
          </section>
        ) : null}

        <DetailBody detail={detail} label="실습 제작 과정" />
      </article>
    </main>
  );
}

export async function AiUpdateDetailPage({ slug }: { slug: string }) {
  const detail = await getPublishedAiUpdateDetail(slug);
  if (!detail) notFound();

  return (
    <main id="main-content" className="editorial-detail update-detail">
      <article>
        <header className="site-shell update-detail-header">
          <div className="article-breadcrumbs">
            <Link href="/ai-updates">AI Update</Link>
            <span aria-hidden="true">/</span>
            <span>{detail.updateDate}</span>
          </div>
          <time dateTime={detail.updateDate}>{detail.updateDate}</time>
          <h1>{detail.title}</h1>
          {detail.changeSummary ? <p>{detail.changeSummary}</p> : null}
        </header>
        <DetailCover detail={detail} />
        <DetailBody detail={detail} label="AI 변경 사항 상세 설명" />
      </article>
    </main>
  );
}

export async function BookDetailPage({ slug }: { slug: string }) {
  const detail = await getPublishedBookDetail(slug);
  if (!detail) notFound();
  const cover = resolveBookCover(detail.title, detail.cover);
  const purchaseLinks = resolveBookPurchaseLinks(
    detail.title,
    detail.purchaseLinks,
  );

  return (
    <main id="main-content" className="editorial-detail book-detail">
      <article>
        <section className="site-shell book-hero">
          <div className="book-cover-area">
            {cover ? (
              <Image
                alt={cover.alt}
                fill
                priority
                sizes="(max-width: 900px) 86vw, 32rem"
                src={cover.url}
              />
            ) : (
              <div><span>DECHIVE BOOKS</span><strong>{detail.title}</strong></div>
            )}
          </div>
          <div className="book-intro">
            <div className="article-breadcrumbs">
              <Link href="/books">Books</Link>
              <span aria-hidden="true">/</span>
              <span>{detail.author}</span>
            </div>
            <p className="eyebrow">DECHIVE BOOKS</p>
            <h1>{detail.title}</h1>
            {detail.summary ? <p>{detail.summary}</p> : null}
            <dl>
              <div><dt>저자</dt><dd>{detail.author}</dd></div>
              {detail.publisher ? <div><dt>출판</dt><dd>{detail.publisher}</dd></div> : null}
              {detail.publicationDate ? (
                <div><dt>출간일</dt><dd>{DATE_FORMATTER.format(new Date(detail.publicationDate))}</dd></div>
              ) : null}
              {detail.pageCount ? <div><dt>분량</dt><dd>{detail.pageCount}쪽</dd></div> : null}
              {detail.format ? <div><dt>형식</dt><dd>{detail.format}</dd></div> : null}
              {detail.isbn ? <div><dt>ISBN</dt><dd>{detail.isbn}</dd></div> : null}
            </dl>
            {purchaseLinks.length > 0 ? (
              <div className="purchase-links">
                {purchaseLinks.map((link) => {
                  const href = safeExternalUrl(link.url);
                  return href ? (
                    <a key={`${link.label}-${link.url}`} href={href} target="_blank" rel="noopener noreferrer">
                      {link.label}에서 보기 ↗
                    </a>
                  ) : null;
                })}
              </div>
            ) : null}
          </div>
        </section>

        <section className="book-reason">
          <div className="site-shell book-reason-heading">
            <p>WHY THIS BOOK</p>
            <h2>왜 이 책을 읽어야 하는가</h2>
          </div>
          <DetailBody detail={detail} label="책 소개" />
        </section>

        {detail.tableOfContents.length > 0 || detail.preview ? (
          <section className="site-shell book-extras">
            {detail.tableOfContents.length > 0 ? (
              <div>
                <h2>목차</h2>
                <ol>
                  {detail.tableOfContents.map((item) => <li key={item}>{item}</li>)}
                </ol>
              </div>
            ) : null}
            {detail.preview ? (
              <div><h2>미리보기</h2><p>{detail.preview}</p></div>
            ) : null}
          </section>
        ) : null}
      </article>
    </main>
  );
}
