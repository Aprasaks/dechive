import Link from 'next/link';
import { ContentList } from '@/components/content/ContentList';
import { CONTENT_SECTIONS } from '@/lib/content/catalog';
import {
  getPublishedContent,
  type PublicContentSummary,
} from '@/lib/content/public';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let latest: PublicContentSummary[] = [];

  try {
    latest = await getPublishedContent(undefined, 8);
  } catch {
    latest = [];
  }

  return (
    <main id="main-content">
      <section className="site-shell home-intro">
        <div className="intro-copy">
          <p className="eyebrow">AI KNOWLEDGE ARCHIVE</p>
          <h1>
            지식의 원본을 찾고,
            <br />
            이해한 언어로 다시 남깁니다.
          </h1>
          <p className="intro-description">
            AI를 다루는 데 필요한 개념을 배우고, 출처를 확인하고,
            실제로 만들어 본 과정까지 하나의 지식으로 축적합니다.
          </p>
        </div>
        <ol className="section-directory">
          {CONTENT_SECTIONS.slice(0, 3).map((section) => (
            <li key={section.type}>
              <Link href={section.href}>
                <span>{section.index}</span>
                <strong>{section.label}</strong>
                <small>{section.description}</small>
                <b aria-hidden="true">↗</b>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {latest.length > 0 ? (
        <section className="site-shell latest-section">
          <div className="section-title">
            <p>RECENTLY PUBLISHED</p>
            <h2>최근 공개한 지식</h2>
          </div>
          <ContentList items={latest} emptyMessage="" />
        </section>
      ) : null}

      <section className="site-shell secondary-directory">
        {CONTENT_SECTIONS.slice(3).map((section) => (
          <Link href={section.href} key={section.type}>
            <span>{section.index}</span>
            <div>
              <strong>{section.label}</strong>
              <p>{section.description}</p>
            </div>
            <b aria-hidden="true">→</b>
          </Link>
        ))}
      </section>
    </main>
  );
}
