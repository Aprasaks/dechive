import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8">
        <span className="text-xs text-zinc-600">
          © 2026 Demian. All rights reserved.
        </span>
        <nav className="flex items-center gap-6">
          <Link
            href="/about"
            className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
          >
            About
          </Link>
          <Link
            href="/privacy-policy"
            className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
          >
            Privacy Policy
          </Link>
          <Link
            href="/contact"
            className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
