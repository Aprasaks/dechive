'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import HomeMobileMenu from '@/components/home/HomeMobileMenu';
import HomeNavLink from '@/components/home/HomeNavLink';
import { MOBILE_NAV_ITEMS } from '@/components/home/homeNavigation';

export default function Header({ overlay = false }: { overlay?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

  const closeMenu = React.useCallback(() => {
    setIsOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  return (
    <header
      className={`z-50 text-foreground ${
        overlay
          ? 'absolute inset-x-0 top-0 border-b border-transparent bg-transparent backdrop-blur-[2px]'
          : 'sticky top-0 border-b border-border-subtle bg-background/95 backdrop-blur-md'
      }`}
    >
      <a href="#main-content" className="sr-only z-[1000] bg-surface-elevated px-4 py-3 text-accent focus:not-sr-only focus:absolute focus:left-4 focus:top-4">
        본문으로 바로가기
      </a>
      <div className={`page-shell flex items-center justify-between gap-4 ${overlay ? 'min-h-16 py-2.5' : 'min-h-18 py-3'}`}>
        <Link href="/" className="shrink-0 text-[1.25rem] font-bold leading-none tracking-[0.14em] sm:text-[1.4rem]" aria-label="Dechive 홈">
          DECHIVE
        </Link>

        <nav className="hidden min-w-0 lg:block" aria-label="주 메뉴">
          <ul className="flex items-center gap-3 xl:gap-6">
            {MOBILE_NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <HomeNavLink item={item} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center lg:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-border text-secondary-foreground transition-colors hover:border-accent hover:text-accent"
            onClick={() => setIsOpen(true)}
            aria-label="메뉴 열기"
            aria-expanded={isOpen}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <HomeMobileMenu isOpen={isOpen} onClose={closeMenu} />
    </header>
  );
}
