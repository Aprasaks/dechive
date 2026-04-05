import React from 'react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950/20 px-12 py-20 transition-all hover:border-white/20 hover:shadow-2xl md:px-16 md:py-28">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-80 select-none">
        <Image
          src="/images/coded-library.webp"
          alt="Coded Library Background Scene"
          fill
          className="object-cover object-bottom"
          priority
          quality={100}
        />
      </div>

      <div className="relative z-20 flex flex-col gap-6">
        <h1 className="text-foreground text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
          Archive your thoughts, <br />
          <span className="text-zinc-400 dark:text-zinc-500">
            Log your growth.
          </span>
        </h1>

        <p className="max-w-155 text-xl leading-relaxed text-zinc-500 dark:text-zinc-400">
          데미안의 지식 저장소, <strong>Dechive</strong>. <br />
          삐그덕거리는 성장의 기록을 유리 너머로 투명하게 기록해나가는 중이야.
        </p>

        <div className="mt-4 flex gap-4">
          <button className="bg-foreground text-background hover:bg-foreground/80 rounded-full px-8 py-3.5 text-base font-semibold transition-transform hover:scale-105 active:scale-95">
            Explore Archive
          </button>
        </div>
      </div>
    </div>
  );
}
