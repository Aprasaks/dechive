import React from 'react';

export default function TopicContainer() {
  return (
    <div className="flex flex-col gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="group cursor-pointer rounded-3xl border border-white/20 bg-white/60 p-6 backdrop-blur-md transition-all hover:border-white/40 hover:shadow-lg dark:border-white/10 dark:bg-zinc-900/50 dark:hover:border-white/20"
        >
          <div className="mb-2 text-xs font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-600">
            Topic 0{i}
          </div>
          <h3 className="text-foreground text-xl font-bold transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
            준비 중인 멋진 포스팅 제목
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-500">
            이곳에는 오라버니가 작성한 글 중 가장 반응이 좋았던 내용이 요약되어
            들어갈 거야.
          </p>
        </div>
      ))}
    </div>
  );
}
