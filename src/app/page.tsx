import type { Metadata } from 'next';
import HeroSection from '@/components/home/hero-section';

export const metadata: Metadata = {
  alternates: { canonical: 'https://dechive.dev' },
};

export default function Home() {
  return (
    <main className="relative w-full px-4 sm:px-6 overflow-hidden">
      <div className="flex items-center min-h-[calc(100vh-64px)]">
        <HeroSection />
      </div>
    </main>
  );
}
