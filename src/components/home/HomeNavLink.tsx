'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { HomeNavItem } from '@/components/home/homeNavigation';

export default function HomeNavLink({
  item,
  onClick,
}: {
  item: HomeNavItem;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  if (item.disabled) {
    return (
      <span
        className="text-muted-foreground inline-flex min-h-11 cursor-not-allowed items-center px-2 text-sm font-medium"
        aria-disabled="true"
        title="준비 중"
      >
        {item.label}
      </span>
    );
  }

  const active =
    item.href !== null &&
    (pathname === item.href || pathname.startsWith(`${item.href}/`));
  return (
    <Link
      href={item.href ?? '/'}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className="inline-flex min-h-11 items-center border-b-2 border-transparent px-2 text-sm font-medium text-secondary-foreground transition-colors hover:text-accent"
    >
      {item.label}
    </Link>
  );
}
