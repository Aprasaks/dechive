import type { Metadata } from 'next';

export const metadata: Metadata = { title: '검색' };

export default function SearchPage() {
  return (
    <main id="main-content" className="site-shell search-page">
      <p className="eyebrow">DECHIVE SEARCH</p>
      <h1>Dechive 안에서 찾기</h1>
      <form role="search">
        <label htmlFor="site-search">제목과 본문에서 검색합니다.</label>
        <div>
          <input
            id="site-search"
            name="q"
            placeholder="무엇을 알고 싶나요?"
            type="search"
          />
          <button type="submit">검색</button>
        </div>
      </form>
    </main>
  );
}
