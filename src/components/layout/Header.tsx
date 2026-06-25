'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useLang } from '@/components/layout/LangProvider';
import LangToggle from './LangToggle';
import MusicToggle from './MusicToggle';

const NAV_ITEMS = [
  { name: 'ARCHIVE', href: '/archive' },
  { name: 'DEEP DIVE', href: '/deep-dive' },
  { name: 'BOOK', href: '/book' },
  { name: 'AI UPDATE', href: '/ai-updates' },
  { name: 'ABOUT', href: '/about' },
];

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const { lang } = useLang();
  const isHome = pathname === '/';
  const isAdmin = pathname.startsWith('/admin');
  const guestbookLabel = lang === 'en' ? 'Guestbook' : '방명록';
  const getLocalizedHref = (href: string) => {
    if (lang !== 'en') return href;
    if (href === '/archive') return '/en/archive';
    if (href === '/deep-dive') return '/en/deep-dive';
    return href;
  };

  const close = () => setIsOpen(false);
  const isActive = (href: string) => {
    if (href === '/archive') {
      return pathname.startsWith('/archive') || pathname.startsWith('/en/archive');
    }
    if (href === '/deep-dive') {
      return pathname.startsWith('/deep-dive') || pathname.startsWith('/en/deep-dive');
    }
    if (href === '/book') {
      return pathname.startsWith('/book');
    }
    if (href === '/ai-updates') {
      return pathname.startsWith('/ai-updates');
    }
    return pathname === href;
  };

  if (isHome || isAdmin) return null;

  return (
    <>
      <header className="sticky top-0 z-50 h-[4.5rem] w-full border-b border-[#d8d6d0] bg-[#fafaf7]/96 text-[#181716] backdrop-blur-sm">
        <div className="relative grid h-full w-full grid-cols-[2rem_1fr_2rem] items-center px-6 sm:px-8 md:grid-cols-[minmax(12rem,18rem)_1fr_minmax(12rem,18rem)] md:px-10">
          <div className="h-8 w-8 md:hidden" aria-hidden="true" />

          <Link
            href="/"
            onClick={close}
            className="group col-start-2 mx-auto flex flex-col items-center md:col-start-1 md:mx-0 md:items-start"
            aria-label="Dechive home"
          >
            <span className="font-[family-name:var(--font-header-serif)] text-[2rem] leading-none font-medium tracking-[0.05em] text-[#181716] transition-colors group-hover:text-[#8a6a3a] md:text-[2.7rem] lg:text-[3.1rem]">
              DECHIVE
            </span>
          </Link>

          <nav className="hidden items-center justify-center md:flex" aria-label="Magazine sections">
            <ul className="flex items-center gap-5 lg:gap-7 xl:gap-9">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link
                    href={getLocalizedHref(item.href)}
                    className={`group/section relative inline-flex min-h-10 items-center px-1 pt-1 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors ${
                      isActive(item.href)
                        ? 'text-[#181716] after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-7 after:-translate-x-1/2 after:bg-[#8a6a3a]'
                        : 'text-[#6b6863] hover:text-[#181716] after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:bg-[#8a6a3a] after:transition-all group-hover/section:after:w-5'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center justify-end gap-3 md:flex">
            <Link
              href="/guestbook"
              className={`rounded-sm border px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${
                pathname === '/guestbook'
                  ? 'border-[#181716] bg-[#181716] text-[#fafaf7]'
                  : 'border-[#d8d6d0] text-[#6b6863] hover:border-[#8a6a3a]/55 hover:bg-[#f7f6f2] hover:text-[#181716]'
              }`}
            >
              {guestbookLabel}
            </Link>
            <div className="flex h-8 items-center gap-3 border-l border-[#d8d6d0] pl-3">
              <LangToggle tone="light" />
              <span className="h-3 w-px bg-[#d8d6d0]" />
              <MusicToggle tone="light" />
            </div>
          </div>

          <div className="flex h-8 w-8 items-center justify-end md:hidden">
            <button
              className="text-[#6b6863] transition-colors hover:text-[#181716]"
              onClick={() => setIsOpen(true)}
              aria-label="메뉴 열기"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 풀스크린 오버레이 */}
      <div
        className={`fixed inset-0 z-[999] bg-[#fafaf7] transition-all duration-500 ease-in-out md:hidden ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <button
          className="absolute top-6 right-6 text-[#6b6863] transition-colors hover:text-[#181716]"
          onClick={close}
          aria-label="메뉴 닫기"
        >
          <X size={24} />
        </button>

        <Link href="/" onClick={close} className="absolute top-6 left-6">
          <span className="font-[family-name:var(--font-header-serif)] text-[2.35rem] leading-none font-medium tracking-[0.05em] text-[#181716]">
            DECHIVE
          </span>
          <span className="mt-1 block text-[9px] font-semibold tracking-[0.22em] text-[#6b6863] uppercase">
            Digital daily magazine
          </span>
        </Link>

        <nav className="flex min-h-dvh flex-col items-center justify-center gap-8" aria-label="Mobile magazine sections">
          <p className="mb-1 text-[10px] font-semibold tracking-[0.3em] text-[#8a6a3a] uppercase">
            Sections
          </p>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={getLocalizedHref(item.href)}
              onClick={close}
              className={`relative text-sm font-semibold tracking-[0.24em] uppercase transition-colors ${
                isActive(item.href)
                  ? 'text-[#181716] after:absolute after:-bottom-2 after:left-1/2 after:h-px after:w-8 after:-translate-x-1/2 after:bg-[#8a6a3a]'
                  : 'text-[#6b6863] hover:text-[#181716]'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/guestbook"
            onClick={close}
            className={`mt-2 rounded-sm border px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase transition-colors ${
              pathname === '/guestbook'
                ? 'border-[#181716] bg-[#181716] text-[#fafaf7]'
                : 'border-[#d8d6d0] text-[#6b6863] hover:border-[#8a6a3a]/55 hover:bg-[#f7f6f2] hover:text-[#181716]'
            }`}
          >
            {guestbookLabel}
          </Link>
        </nav>
      </div>
    </>
  );
}
