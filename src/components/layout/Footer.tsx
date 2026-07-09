'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/components/layout/LangProvider';

export default function Footer() {
  const pathname = usePathname();
  const { lang } = useLang();
  const rssHref = lang === 'en' ? '/en/feed.xml' : '/feed.xml';
  const footerClassName = 'border-white/8 bg-[#030303] text-white/46';
  const brandClassName = 'text-white/68';
  const accentClassName = 'text-[#f6d29b]/70';
  const copyrightClassName = 'text-white/36';
  const linkClassName = 'text-white/48 hover:text-[#f6d29b]';

  if (pathname === '/' || pathname === '/about' || pathname.startsWith('/admin')) return null;

  return (
    <footer className={`w-full border-t px-6 py-10 sm:px-8 ${footerClassName}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className={`text-sm font-semibold tracking-[0.38em] uppercase ${brandClassName}`}>
            Dechive
          </p>
          <p className={`mt-3 text-xs font-medium tracking-[0.22em] uppercase ${accentClassName}`}>
            Verify. Archive. Elevate.
          </p>
          <p className={`mt-5 text-xs ${copyrightClassName}`}>
            © 2026 Demian. All rights reserved.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="/guestbook"
            className={`text-xs font-medium transition-colors ${linkClassName}`}
          >
            Guestbook
          </Link>
          <Link
            href={rssHref}
            className={`text-xs font-medium transition-colors ${linkClassName}`}
          >
            RSS
          </Link>
          <Link
            href="/privacy-policy"
            className={`text-xs font-medium transition-colors ${linkClassName}`}
          >
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
