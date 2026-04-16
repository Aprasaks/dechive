'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center min-h-[calc(100vh-64px-56px)]">
      <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-4">
        오류
      </p>
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 mb-4">
        문제가 발생했어요.
      </h1>
      <p className="text-base text-zinc-400 mb-10">
        일시적인 오류입니다. 잠시 후 다시 시도해주세요.
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="rounded-full bg-white/10 hover:bg-white/20 px-6 py-2.5 text-sm font-medium text-zinc-100 transition-all cursor-pointer"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-full border border-white/10 hover:border-white/20 px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-all"
        >
          홈으로
        </Link>
      </div>
    </main>
  );
}
