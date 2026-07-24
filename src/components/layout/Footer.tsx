'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  ['PrivacyPolicy', '/privacy-policy'],
  ['Terms', '/terms'],
  ['Contact', '/contact'],
  ['About', '/about'],
] as const;

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <footer className="border-border bg-surface border-t">
      <div className="page-shell flex flex-col gap-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-12">
          <p className="text-xl font-bold tracking-[0.14em]">DECHIVE</p>
          <p className="text-secondary-foreground max-w-md text-sm leading-7">
            AI creates answers.
            <br />
            Humans verify them.
          </p>
        </div>
        <nav aria-label="Footer 메뉴">
          <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
            {links.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-secondary-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
