'use client';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header overlay />
      {children}
      <Footer />
    </>
  );
}
