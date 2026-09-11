import Link from 'next/link';
import { CONTENT_SECTIONS } from '@/lib/content/catalog';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-inner">
        <div>
          <strong>DECHIVE</strong>
          <p>AI를 이해하고 다루는 모든 지식.</p>
        </div>
        <nav aria-label="하단 메뉴">
          {CONTENT_SECTIONS.map((section) => (
            <Link href={section.href} key={section.type}>
              {section.label}
            </Link>
          ))}
        </nav>
        <p>© {new Date().getFullYear()} DECHIVE</p>
      </div>
    </footer>
  );
}
