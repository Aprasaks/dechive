'use client';

import Link from 'next/link';
import { useLang } from '@/components/layout/LangProvider';

export default function Footer() {
  const { lang } = useLang();
  const rssHref = lang === 'en' ? '/en/feed.xml' : '/feed.xml';

  return (
    <footer className="w-full py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8">
        <span className="text-xs text-zinc-400">
          © 2026 Demian. All rights reserved.
        </span>
        <nav className="flex items-center gap-6">
          <Link
            href="/guestbook"
            className="text-xs text-zinc-400 transition-colors hover:text-zinc-200"
          >
            Guestbook
          </Link>
          <Link
            href={rssHref}
            className="text-xs text-zinc-400 transition-colors hover:text-zinc-200"
          >
            RSS
          </Link>
          <Link
            href="/privacy-policy"
            className="text-xs text-zinc-400 transition-colors hover:text-zinc-200"
          >
            Privacy Policy
          </Link>
          <Link
            href="/contact"
            className="text-xs text-zinc-400 transition-colors hover:text-zinc-200"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
