'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import HomeMobileMenu from '@/components/home/HomeMobileMenu';
import HomeNavLink from '@/components/home/HomeNavLink';
import { LEFT_NAV_ITEMS, RIGHT_NAV_ITEMS } from '@/components/home/homeNavigation';

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#d7ad73]/10 bg-[#030303]/92 backdrop-blur-xl">
      <div className="mx-auto grid min-h-17 max-w-7xl grid-cols-[2.5rem_1fr_2.5rem] items-center px-4 py-3 sm:min-h-18 sm:px-6 lg:grid-cols-[minmax(19rem,1fr)_auto_minmax(21rem,1fr)] lg:gap-10 lg:px-8 xl:gap-16">
        <nav className="hidden justify-self-stretch lg:block" aria-label="Left navigation">
          <ul className="flex items-center justify-between gap-6">
            {LEFT_NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <HomeNavLink item={item} />
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/" className="group col-start-2 mx-auto flex items-center" aria-label="Dechive home">
          <span className="font-[family-name:var(--font-header-serif)] text-[1.55rem] leading-none font-medium tracking-[0.12em] text-white transition-colors group-hover:text-[#f6d29b] sm:text-[2rem]">
            DECHIVE
          </span>
        </Link>

        <div className="hidden justify-self-stretch lg:block">
          <nav aria-label="Right navigation">
            <ul className="flex items-center justify-between gap-6">
              {RIGHT_NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <HomeNavLink item={item} />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="col-start-3 flex justify-end lg:hidden">
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 text-white/78 transition-colors hover:border-[#c89b62]/60 hover:text-[#f6d29b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b] sm:h-10 sm:w-10"
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation"
            aria-expanded={isOpen}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <HomeMobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}
