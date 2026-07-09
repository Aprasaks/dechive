import Link from 'next/link';
import type { HomeNavItem } from '@/components/home/homeNavigation';

export default function HomeNavLink({ item, onClick }: { item: HomeNavItem; onClick?: () => void }) {
  if (item.disabled) {
    return (
      <span
        className="inline-flex min-h-10 cursor-default items-center rounded-full px-3 text-[11px] font-semibold tracking-[0.14em] text-white/28 uppercase"
        aria-disabled="true"
      >
        {item.label}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className="inline-flex min-h-10 items-center rounded-full px-3 text-[11px] font-semibold tracking-[0.14em] text-white/62 uppercase transition-colors hover:bg-white/6 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b]"
    >
      {item.label}
    </Link>
  );
}
