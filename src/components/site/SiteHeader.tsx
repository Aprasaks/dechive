import Link from 'next/link';
import { CONTENT_SECTIONS } from '@/lib/content/catalog';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link className="wordmark" href="/" aria-label="Dechive 홈">
          DECHIVE
        </Link>
        <nav aria-label="주요 메뉴" className="desktop-nav">
          {CONTENT_SECTIONS.map((section) => (
            <Link href={section.href} key={section.type}>
              {section.label}
            </Link>
          ))}
        </nav>
        <Link className="header-search" href="/search">
          검색
          <span aria-hidden="true">⌕</span>
        </Link>
      </div>
    </header>
  );
}
