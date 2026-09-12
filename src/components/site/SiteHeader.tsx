import Link from 'next/link';
import { CONTENT_SECTIONS } from '@/lib/content/catalog';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link className="wordmark" href="/" aria-label="Dechive 홈">
          <strong>DECHIVE</strong>
        </Link>
        <nav aria-label="주요 메뉴" className="desktop-nav">
          {CONTENT_SECTIONS.map((section) => (
            <Link href={section.href} key={section.type}>
              {section.navLabel}
            </Link>
          ))}
        </nav>
        <Link className="header-search" href="/search" aria-label="Dechive 검색">
          <span>Search</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
            <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="m15.5 15.5 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </Link>
      </div>
      <nav aria-label="모바일 주요 메뉴" className="mobile-nav site-shell">
        {CONTENT_SECTIONS.map((section) => (
          <Link href={section.href} key={section.type}>
            {section.navLabel}
          </Link>
        ))}
      </nav>
    </header>
  );
}
