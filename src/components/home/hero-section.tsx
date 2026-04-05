import React from 'react';

export default function HeroSection() {
  return (
    <div className="flex flex-col gap-6 py-10">
      <h1 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
        Archive your thoughts, <br />
        <span className="text-zinc-400 dark:text-zinc-500">
          Log your growth.
        </span>
      </h1>

      <p className="max-w-150 text-lg leading-relaxed text-zinc-500 sm:text-xl dark:text-zinc-400">
        데미안의 지식 저장소, <strong>Dechive</strong>에 오신 것을 환영해.
        여기에는 정제된 기술 지식과 삐그덕거리는 성장의 기록들을 차곡차곡
        쌓아두고 있어.
      </p>

      {/* 🖱️ 간단한 CTA (나중에 링크 연결) */}
      <div className="mt-4 flex gap-4">
        <button className="bg-foreground text-background rounded-full px-6 py-2.5 text-sm font-semibold transition-transform hover:scale-105 active:scale-95">
          Explore Archive
        </button>
      </div>
    </div>
  );
}
