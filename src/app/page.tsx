import HeroSection from '@/components/home/hero-section';
import TopicContainer from '@/components/home/topic-container';

export default function Home() {
  return (
    <main className="relative mx-auto max-w-7xl px-6 sm:px-8 overflow-hidden">
      <div className="grid grid-cols-1 items-center gap-8 py-12 md:h-[calc(100vh-64px)] md:grid-cols-12 md:py-0">
        <section className="md:col-span-7">
          <HeroSection />
        </section>

        <aside className="md:col-span-5 h-[420px]">
          <TopicContainer />
        </aside>
      </div>

    </main>
  );
}
