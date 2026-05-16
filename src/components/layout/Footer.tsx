'use client';

import Link from 'next/link';
import { useLang } from '@/components/layout/LangProvider';

export default function Footer() {
  const { lang } = useLang();
  const rssHref = lang === 'en' ? '/en/feed.xml' : '/feed.xml';

  return (
    <footer className="w-full border-t border-amber-200/25 bg-[#050403] px-6 py-10 text-stone-300 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.38em] text-stone-100 uppercase">
            Dechive
          </p>
          <p className="mt-3 text-xs font-medium tracking-[0.22em] text-amber-100/65 uppercase">
            Verify. Archive. Elevate.
          </p>
          <p className="mt-5 text-xs text-stone-500">
            © 2026 Demian. All rights reserved.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/guestbook"
            className="text-xs font-medium text-stone-400 transition-colors hover:text-amber-100"
          >
            Guestbook
          </Link>
          <Link
            href={rssHref}
            className="text-xs font-medium text-stone-400 transition-colors hover:text-amber-100"
          >
            RSS
          </Link>
          <Link
            href="/privacy-policy"
            className="text-xs font-medium text-stone-400 transition-colors hover:text-amber-100"
          >
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
