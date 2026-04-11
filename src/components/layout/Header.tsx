'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Archive', href: '/archive' },
  { name: 'Projects', href: '/projects' },
  { name: 'Logs', href: '/logs' },
  { name: 'About', href: '/about' },
];

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 w-full pt-4 transition-all duration-300">
      <div className="mx-auto relative flex max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* 🏠 좌측: 로고 */}
        <Link href="/" className="group flex h-8 items-center gap-3">
          <div className="relative h-8 w-8 transition-transform group-hover:scale-105">
            <Image
              src="/logo-icon.svg"
              alt="Dechive Logo"
              width={32}
              height={32}
              priority
            />
          </div>
          <span className="text-foreground text-xl leading-none font-bold tracking-tight">
            Dechive
          </span>
        </Link>

        {/* 📚 데스크톱 메뉴 — 절대 중앙 배치 */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
          <ul className="flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="hover:text-foreground text-sm font-medium tracking-tight text-zinc-500 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 🌓 우측: 로고 영역과 동일한 너비로 균형 맞춤 */}
        <div className="flex h-8 items-center justify-end gap-3" style={{ minWidth: '7rem' }}>
          {/* 모바일 햄버거 버튼 */}
          <button
            className="hover:text-foreground text-zinc-500 transition-colors md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 📱 모바일 드롭다운 메뉴 (헤더 높이를 해치지 않음) */}
      {isOpen && (
        <nav className="absolute top-16 left-0 w-full border-b border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur-md md:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
          <ul className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-base font-medium text-zinc-600 dark:text-zinc-400"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
