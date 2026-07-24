'use client';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header overlay />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
