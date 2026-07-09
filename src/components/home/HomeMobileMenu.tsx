import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { MOBILE_NAV_ITEMS } from '@/components/home/homeNavigation';

export default function HomeMobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-[999] min-h-dvh overflow-y-auto border-b border-[#d7ad73]/10 bg-[rgba(3,3,3,0.98)] px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl transition duration-300 lg:hidden ${
        isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <Link href="/" onClick={onClose} className="inline-flex">
          <span className="font-[family-name:var(--font-header-serif)] text-[1.9rem] leading-none tracking-[0.1em] text-white">
            DECHIVE
          </span>
        </Link>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/78 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b]"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="mt-14 flex flex-col gap-3 border-t border-[#d7ad73]/10" aria-label="Mobile navigation">
        {MOBILE_NAV_ITEMS.map((item) => (
          item.disabled ? (
            <span
              key={item.label}
              className="flex items-center justify-between border-b border-[#d7ad73]/10 py-5 text-sm font-semibold tracking-[0.18em] text-white/28 uppercase"
              aria-disabled="true"
            >
              {item.label}
            </span>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="flex items-center justify-between border-b border-[#d7ad73]/10 py-5 text-sm font-semibold tracking-[0.18em] text-white/82 uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b]"
            >
              {item.label}
              <ArrowRight size={16} className="text-[#c89b62]" />
            </Link>
          )
        ))}
      </nav>
    </div>
  );
}
