'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  ['Privacy Policy', '/privacy-policy'],
  ['Terms', '/terms'],
  ['About', '/about'],
] as const;

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <footer className="border-border bg-surface border-t"><div className="page-shell flex flex-col gap-7 py-10 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xl font-bold tracking-[0.14em]">DECHIVE</p><p className="text-secondary-foreground mt-3 max-w-md text-sm leading-7">공부하고 검증한 내용을 지식, 강의, 실습과 기록으로 다시 구성합니다.</p></div><nav aria-label="정책 및 안내"><ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm">{links.map(([label, href])=><li key={href}><Link href={href} className="text-secondary-foreground hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">{label}</Link></li>)}</ul></nav></div><div className="border-border-subtle border-t"><div className="page-shell text-muted-foreground py-5 text-xs">© {new Date().getFullYear()} DECHIVE. All rights reserved.</div></div></footer>;
}
