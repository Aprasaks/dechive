import React from 'react';

export default function TopicContainer() {
  return (
    <div className="flex flex-col gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="group cursor-pointer rounded-2xl border border-white/10 bg-zinc-900/50 p-5 backdrop-blur-md transition-all hover:border-white/20 hover:bg-zinc-900/70"
        >
          <div className="mb-1.5 text-xs font-semibold tracking-widest text-zinc-600 uppercase">
            Topic 0{i}
          </div>
          <h3 className="text-base font-bold text-zinc-100 transition-colors group-hover:text-white">
            준비 중인 멋진 포스팅 제목
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">
            이곳에는 오라버니가 작성한 글 중 가장 반응이 좋았던 내용이 요약되어 들어갈 거야.
          </p>
        </div>
      ))}
    </div>
  );
}
