'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import LangToggle from './LangToggle';
import MusicToggle from './MusicToggle';

const NAV_ITEMS = [
  { name: 'Archive', href: '/archive' },
  { name: 'Projects', href: '/projects' },
  { name: 'Logs', href: '/logs' },
  { name: 'About', href: '/about' },
];

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const close = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 h-16 w-full pt-4 transition-all duration-300">
      <div className="mx-auto relative flex max-w-7xl items-center justify-between px-6 sm:px-8">

        {/* 로고 */}
        <Link href="/" onClick={close} className="group flex h-8 items-center gap-3">
          <div className="relative h-8 w-8 transition-transform group-hover:scale-105">
            <Image src="/logo-icon.svg" alt="Dechive Logo" width={32} height={32} priority />
          </div>
          <span className="text-foreground text-xl leading-none font-bold tracking-tight">
            Dechive
          </span>
        </Link>

        {/* 데스크탑 메뉴 — 절대 중앙 */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
          <ul className="flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`text-base font-semibold tracking-tight transition-colors ${
                    pathname === item.href
                      ? 'text-white'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 우측: 언어 토글 + 햄버거 */}
        <div className="flex h-8 items-center justify-end gap-4" style={{ minWidth: '7rem' }}>
          <div className="hidden md:flex items-center gap-3">
            <LangToggle />
            <span className="text-zinc-700">·</span>
            <MusicToggle />
          </div>
          <button
            className="relative z-[110] text-zinc-500 transition-colors hover:text-zinc-100 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* 모바일 풀스크린 오버레이 */}
      <div
        className={`fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-2xl transition-all duration-500 ease-in-out md:hidden ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* 메뉴 */}
        <nav className="flex h-full flex-col items-center justify-center gap-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={close}
              className={`text-lg font-light tracking-[0.3em] uppercase transition-colors ${
                pathname === item.href ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-100'
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* 구분선 + 언어 토글 + 음악 */}
          <div className="flex flex-col items-center gap-4">
            <div className="h-px w-12 bg-zinc-800" />
            <div className="flex items-center gap-3">
              <LangToggle />
              <span className="text-zinc-700">·</span>
              <MusicToggle />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
