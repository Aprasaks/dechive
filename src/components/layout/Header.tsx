'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useLang } from '@/components/layout/LangProvider';
import LangToggle from './LangToggle';
import MusicToggle from './MusicToggle';

const NAV_ITEMS = [
  { name: 'Archive', href: '/archive' },
  { name: 'DeepDive', href: '/deep-dive' },
  { name: 'Book', href: '/book' },
  { name: 'AI-Update', href: '/ai-updates' },
  { name: 'About', href: '/about' },
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
      <header className="sticky top-0 z-50 h-20 w-full border-b border-[#ded6c9] bg-[#f8f6f1]/94 text-[#17120d] backdrop-blur-xl">
        <div className="relative flex h-full w-full items-center justify-between px-7 sm:px-10">
          <div className="h-8 w-8 md:hidden" aria-hidden="true" />

          <Link href="/" onClick={close} className="group absolute left-1/2 flex -translate-x-1/2 items-center md:static md:left-auto md:translate-x-0">
            <span className="font-[family-name:var(--font-header-serif)] text-3xl leading-none font-medium tracking-[0.04em] text-[#3a2416] transition-colors group-hover:text-[#17120d] md:text-4xl md:text-[#6f6257] lg:text-5xl">
              DECHIVE
            </span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
            <ul className="flex items-center gap-6 xl:gap-8">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link
                    href={getLocalizedHref(item.href)}
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
            <Link
              href="/guestbook"
              className={`rounded-sm border px-4 py-2 text-xs font-semibold tracking-[0.12em] transition-colors ${
                pathname === '/guestbook'
                  ? 'border-[#9a7a3f]/65 bg-[#2a211b] text-[#f8f6f1]'
                  : 'border-[#9a7a3f]/35 text-[#5d4630] hover:border-[#9a7a3f]/70 hover:bg-[#efe7da]'
              }`}
            >
              {guestbookLabel}
            </Link>
            <LangToggle tone="light" />
            <span className="h-4 w-px bg-[#cfc5b8]" />
            <MusicToggle tone="light" />
          </div>

          <div className="flex h-8 w-8 items-center justify-end md:hidden">
            <button
              className="text-[#6f6257] transition-colors hover:text-[#17120d]"
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
        className={`fixed inset-0 z-[999] bg-[#f8f6f1] transition-all duration-500 ease-in-out md:hidden ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <button
          className="absolute top-7 right-7 text-[#6f6257] transition-colors hover:text-[#17120d]"
          onClick={close}
          aria-label="메뉴 닫기"
        >
          <X size={24} />
        </button>

        <Link href="/" onClick={close} className="absolute top-7 left-7">
          <span className="font-[family-name:var(--font-header-serif)] text-4xl leading-none font-medium tracking-[0.04em] text-[#6f6257]">
            DECHIVE
          </span>
        </Link>

        <nav className="flex min-h-dvh flex-col items-center justify-center gap-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={getLocalizedHref(item.href)}
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
          <Link
            href="/guestbook"
            onClick={close}
            className={`rounded-sm border px-5 py-3 text-sm font-semibold tracking-[0.18em] transition-colors ${
              pathname === '/guestbook'
                ? 'border-[#9a7a3f]/65 bg-[#2a211b] text-[#f8f6f1]'
                : 'border-[#9a7a3f]/35 text-[#5d4630] hover:border-[#9a7a3f]/70 hover:bg-[#efe7da]'
            }`}
          >
            {guestbookLabel}
          </Link>
        </nav>
      </div>
    </>
  );
}
