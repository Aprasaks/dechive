import type { Metadata } from 'next';
import { ContentList } from '@/components/content/ContentList';
import { searchPublishedContent } from '@/lib/content/public';

export const metadata: Metadata = { title: '검색' };
export const dynamic = 'force-dynamic';

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.trim() : '';
  let unavailable = false;
  let results: Awaited<ReturnType<typeof searchPublishedContent>> = [];

  try {
    results = query ? await searchPublishedContent(query) : [];
  } catch {
    unavailable = true;
  }

  return (
    <main id="main-content" className="site-shell search-page">
      <header className="search-heading">
        <p className="eyebrow">DECHIVE SEARCH</p>
        <h1>저장된 지식을 찾습니다.</h1>
        <p>공개된 글의 제목과 한 줄 설명에서 찾습니다.</p>
      </header>
      <form role="search" action="/search" method="get">
        <label htmlFor="site-search">검색어</label>
        <div>
          <input
            autoFocus
            defaultValue={query}
            id="site-search"
            name="q"
            placeholder="예: 컨텍스트 윈도우"
            type="search"
          />
          <button type="submit">찾기 →</button>
        </div>
      </form>

      {query ? (
        <section className="search-results" aria-label="검색 결과">
          <div className="search-results-heading">
            <span>RESULT</span>
            <h2>“{query}” 검색 결과</h2>
            <p>{unavailable ? '검색 실패' : `${results.length}개의 기록`}</p>
          </div>
          <ContentList
            items={results}
            type="mixed"
            emptyMessage={
              unavailable
                ? '검색 결과를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.'
                : '일치하는 공개 기록이 없습니다.'
            }
          />
        </section>
      ) : null}
    </main>
  );
}
