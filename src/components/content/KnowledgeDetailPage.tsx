import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContentSection } from '@/lib/content/catalog';
import { getPublishedKnowledgeDetail } from '@/lib/content/public';
import { extractDocumentHeadings, TiptapDocument } from './TiptapDocument';

const DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const RELATION_LABELS: Record<string, string> = {
  prerequisite: '먼저 알아야 할 지식',
  next: '다음으로 읽을 지식',
  uses: '이 지식을 사용하는 콘텐츠',
  explains: '이 개념을 더 설명하는 콘텐츠',
  practice_for: '직접 연결되는 실습',
  affected_by: '이 변화의 영향을 받는 지식',
};

const VERIFICATION_LABELS = {
  unverified: '검증 전',
  reviewed: '검토 완료',
  verified: '검증 완료',
  needs_review: '재검증 필요',
} as const;

export async function KnowledgeDetailPage({ slug }: { slug: string }) {
  const detail = await getPublishedKnowledgeDetail(slug);

  if (!detail) {
    notFound();
  }

  const headings = extractDocumentHeadings(detail.bodyJson);
  const showToc = detail.tocEnabled && headings.length >= 3;
  const relationGroups = detail.relations.reduce(
    (groups, relation) => {
      const relations = groups.get(relation.relationType) ?? [];
      relations.push(relation);
      groups.set(relation.relationType, relations);
      return groups;
    },
    new Map<string, typeof detail.relations>(),
  );

  return (
    <main id="main-content" className="knowledge-article">
      <article>
        <header className="site-shell article-header">
          <div className="article-breadcrumbs">
            <Link href="/knowledge">Knowledge</Link>
            <span aria-hidden="true">/</span>
            <span>Revision {detail.revisionNumber}</span>
          </div>
          <div className="article-heading">
            <p className="eyebrow">DECHIVE KNOWLEDGE</p>
            <h1>{detail.title}</h1>
            {detail.summary ? <p>{detail.summary}</p> : null}
          </div>
          <dl className="article-meta">
            <div>
              <dt>작성</dt>
              <dd>
                <time dateTime={detail.publishedAt}>
                  {DATE_FORMATTER.format(new Date(detail.publishedAt))}
                </time>
              </dd>
            </div>
            <div>
              <dt>마지막 검증</dt>
              <dd>
                {detail.verifiedAt ? (
                  <time dateTime={detail.verifiedAt}>
                    {DATE_FORMATTER.format(new Date(detail.verifiedAt))}
                  </time>
                ) : (
                  '기록 없음'
                )}
              </dd>
            </div>
            <div>
              <dt>상태</dt>
              <dd>{VERIFICATION_LABELS[detail.verificationStatus]}</dd>
            </div>
          </dl>
        </header>

        {detail.cover ? (
          <figure className="site-shell article-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={detail.cover.url} alt={detail.cover.alt} />
            {detail.cover.caption ? (
              <figcaption>{detail.cover.caption}</figcaption>
            ) : null}
          </figure>
        ) : null}

        {detail.learningObjectives.length > 0 ? (
          <section className="site-shell learning-objectives" aria-labelledby="objectives-title">
            <span>WHAT TO KNOW</span>
            <div>
              <h2 id="objectives-title">이 글에서 알아야 할 것</h2>
              <ul>
                {detail.learningObjectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <div className={`site-shell article-reading-layout${showToc ? ' has-toc' : ''}`}>
          <TiptapDocument bodyJson={detail.bodyJson} />
          {showToc ? (
            <aside className="article-toc" aria-label="이 글의 목차">
              <p>이 글의 목차</p>
              <ol>
                {headings.map((heading) => (
                  <li className={`toc-level-${heading.level}`} key={heading.id}>
                    <a href={`#${heading.id}`}>{heading.text}</a>
                  </li>
                ))}
              </ol>
            </aside>
          ) : null}
        </div>

        {detail.sources.length > 0 ? (
          <section className="site-shell article-sources" aria-labelledby="sources-title">
            <div>
              <p className="eyebrow">SOURCES</p>
              <h2 id="sources-title">확인한 출처</h2>
            </div>
            <ol>
              {detail.sources.map((source, index) => (
                <li key={source.id}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    <strong>{source.title}</strong>
                    {source.publisher ? <small>{source.publisher}</small> : null}
                    {source.claimNote ? <p>{source.claimNote}</p> : null}
                  </a>
                  <b aria-hidden="true">↗</b>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {relationGroups.size > 0 ? (
          <section className="site-shell article-relations" aria-label="연결된 지식과 콘텐츠">
            {[...relationGroups.entries()].map(([relationType, relations]) => (
              <div key={relationType}>
                <h2>{RELATION_LABELS[relationType] ?? '연결된 콘텐츠'}</h2>
                <ol>
                  {relations.map((relation) => {
                    const section = getContentSection(relation.type);
                    return (
                      <li key={relation.id}>
                        <Link href={`${section.href}/${relation.slug}`}>
                          <span>{section.label}</span>
                          <strong>{relation.title}</strong>
                          <b aria-hidden="true">→</b>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </section>
        ) : null}

        {detail.tags.length > 0 ? (
          <footer className="site-shell article-tags" aria-label="태그">
            <span>INDEX</span>
            <ul>
              {detail.tags.map((tag) => (
                <li key={tag.slug}>#{tag.label}</li>
              ))}
            </ul>
          </footer>
        ) : null}
      </article>
    </main>
  );
}
