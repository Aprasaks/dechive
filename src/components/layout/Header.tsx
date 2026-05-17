'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import LangToggle from './LangToggle';
import MusicToggle from './MusicToggle';

const NAV_ITEMS = [
  { name: 'Archive', href: '/archive' },
  { name: 'Deep Dive', href: '/archive/what-null-leaves-behind' },
  { name: 'About', href: '/about' },
];

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  const close = () => setIsOpen(false);
  const isActive = (href: string) => {
    if (href === '/archive') {
      return pathname === '/archive' || pathname.startsWith('/en/archive');
    }
    return pathname === href;
  };

  if (isHome) return null;

  return (
    <header className="sticky top-0 z-50 h-20 w-full border-b border-[#ded6c9] bg-[#f8f6f1]/94 text-[#17120d] backdrop-blur-xl">
      <div className="relative flex h-full w-full items-center justify-between px-7 sm:px-10">

        <Link href="/" onClick={close} className="group flex items-center">
          <span className="font-[family-name:var(--font-header-serif)] text-4xl leading-none font-medium tracking-[0.04em] text-[#6f6257] transition-colors group-hover:text-[#17120d] lg:text-5xl">
            DECHIVE
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
          <ul className="flex items-center gap-11">
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`relative py-2 font-[family-name:var(--font-header-serif)] text-sm font-medium tracking-[0.12em] uppercase transition-colors ${
                    isActive(item.href)
                      ? 'text-[#17120d] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-[#b08d57]'
                      : 'text-[#6f6257] hover:text-[#17120d]'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LangToggle tone="light" />
          <span className="h-4 w-px bg-[#cfc5b8]" />
          <MusicToggle tone="light" />
        </div>

        <div className="flex h-8 w-8 items-center justify-end md:hidden">
          <button
            className="relative z-[110] text-[#6f6257] transition-colors hover:text-[#17120d]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* 모바일 풀스크린 오버레이 */}
      <div
        className={`fixed inset-0 z-50 bg-[#f8f6f1]/98 backdrop-blur-2xl transition-all duration-500 ease-in-out md:hidden ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={close}
              className={`relative font-[family-name:var(--font-header-serif)] text-lg font-medium tracking-[0.22em] uppercase transition-colors ${
                isActive(item.href)
                  ? 'text-[#17120d] after:absolute after:-bottom-3 after:left-1/2 after:h-px after:w-10 after:-translate-x-1/2 after:bg-[#b08d57]'
                  : 'text-[#6f6257] hover:text-[#17120d]'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
