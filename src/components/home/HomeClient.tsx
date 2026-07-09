'use client';

import { HeroSection, HomeSummaryStrip } from '@/components/home/HomeSections';

export default function HomeClient({ heroSerifClassName }: { heroSerifClassName: string }) {
  return (
    <main className="min-h-screen bg-[#030303] text-[#f3eadb]">
      <HeroSection heroSerifClassName={heroSerifClassName} />
      <HomeSummaryStrip />
    </main>
  );
}
