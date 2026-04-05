import HeroSection from '@/components/home/hero-section';
import TopicContainer from '@/components/home/topic-container';

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-6 sm:px-8">
      <div className="grid grid-cols-1 items-center gap-12 py-12 md:h-[calc(100vh-64px)] md:grid-cols-12 md:py-0">
        <section className="md:col-span-8">
          <HeroSection />
        </section>

        <aside className="flex flex-col md:col-span-4">
          <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
              Featured Topics
            </h2>
          </div>
          <TopicContainer />
        </aside>
      </div>
    </main>
  );
}
