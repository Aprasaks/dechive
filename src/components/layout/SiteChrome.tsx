'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isIssueCover = pathname === '/issues' || pathname.startsWith('/issues/');

  if (isIssueCover) {
    return children;
  }

  return (
    <>
      <Header overlay={pathname === '/'} />
      {children}
      <Footer />
    </>
  );
}
