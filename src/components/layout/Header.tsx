'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import HomeMobileMenu from '@/components/home/HomeMobileMenu';
import HomeNavLink from '@/components/home/HomeNavLink';
import LivingTimeCounter from '@/components/home/LivingTimeCounter';
import { MOBILE_NAV_ITEMS } from '@/components/home/homeNavigation';

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#d7ad73]/10 bg-[#030303]/92 backdrop-blur-xl">
      <div className="mx-auto grid min-h-16 max-w-7xl grid-cols-[auto_minmax(0,1fr)_2.25rem] items-center gap-3 px-4 py-3 sm:min-h-18 sm:grid-cols-[auto_minmax(0,1fr)_2.5rem] sm:px-6 lg:grid-cols-[auto_1fr_auto] lg:gap-9 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center" aria-label="Dechive home">
          <span className="font-[family-name:var(--font-header-serif)] text-[1.45rem] leading-none font-medium tracking-[0.12em] text-white transition-colors group-hover:text-[#f6d29b] sm:text-[2rem]">
            DECHIVE
          </span>
        </Link>

        <nav className="hidden justify-self-center lg:block" aria-label="Main navigation">
          <ul className="flex items-center justify-center gap-7 xl:gap-10">
            {MOBILE_NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <HomeNavLink item={item} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex min-w-0 justify-end lg:hidden">
          <LivingTimeCounter compact className="max-w-full text-[8px] tracking-[0.03em] text-white/30 min-[390px]:text-[9px]" />
        </div>

        <div className="hidden justify-end lg:flex">
          <LivingTimeCounter />
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
