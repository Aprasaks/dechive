'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="border-t border-white/8 bg-[#030303] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-center gap-2 text-xs leading-none text-white/46 sm:min-h-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-[family-name:var(--font-header-serif)] tracking-[0.18em] text-white/58">
          DECHIVE
        </p>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <li>
              <Link
                href="/privacy-policy"
                className="transition-colors hover:text-[#f6d29b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b]"
              >
                Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="transition-colors hover:text-[#f6d29b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b]"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="transition-colors hover:text-[#f6d29b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b]"
              >
                Contact
              </Link>
            </li>
            <li>
              <a
                href="https://studio.dechive.dev"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-[#f6d29b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b]"
              >
                studio.dechive.dev
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
