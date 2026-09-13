'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return children;
  }

  return (
    <div className="site-chrome">
      <SiteHeader />
      <div className="site-content">{children}</div>
      <SiteFooter />
    </div>
  );
}
