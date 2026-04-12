import React from 'react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-5xl border border-white/10 bg-zinc-950/20 px-10 py-14 transition-all hover:border-white/20 hover:shadow-2xl md:px-12 md:py-16 min-h-105">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-80 select-none">
        <Image
          src="/images/coded-library.webp"
          alt="Coded Library Background Scene"
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover object-bottom"
          priority
          quality={75}
        />
      </div>

      <div className="relative z-20 flex flex-col gap-6">
        <h1 className="text-foreground text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          Knowledge recorded,<br />
          <span className="text-zinc-400">
            becomes permanent.
          </span>
        </h1>
      </div>
    </div>
  );
}
