'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, X } from 'lucide-react';
import { MOBILE_NAV_ITEMS } from '@/components/home/homeNavigation';

export default function HomeMobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={`${isOpen ? 'fixed' : 'hidden'} inset-0 z-[999] overflow-y-auto bg-surface-elevated px-5 py-5 md:hidden`}
      role="dialog"
      aria-modal="true"
      aria-label="모바일 메뉴"
      aria-hidden={!isOpen}
      inert={!isOpen ? true : undefined}
    >
      <div className="mx-auto max-w-lg">
        <div className="flex items-center justify-between border-b border-border-subtle pb-5">
          <Link href="/" onClick={onClose} className="text-xl font-bold tracking-[0.14em]">
            DECHIVE
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-border text-secondary-foreground transition-colors hover:border-accent hover:text-accent"
            onClick={onClose}
            aria-label="메뉴 닫기"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8" aria-label="모바일 주 메뉴">
          <ul className="border-t border-border-subtle">
            {MOBILE_NAV_ITEMS.map((item) => (
              <li key={item.label} className="border-b border-border-subtle">
                {item.disabled ? (
                  <span className="flex min-h-16 cursor-not-allowed items-center justify-between text-base text-muted-foreground" aria-disabled="true">
                    <span>{item.label}</span>
                    <span className="text-xs">준비 중</span>
                  </span>
                ) : (
                  <Link
                    href={item.href ?? '/'}
                    onClick={onClose}
                    aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? 'page' : undefined}
                    className={`flex min-h-16 items-center justify-between text-base font-medium transition-colors hover:text-accent ${pathname === item.href || pathname.startsWith(`${item.href}/`) ? 'text-accent' : 'text-foreground'}`}
                  >
                    {item.label}
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
