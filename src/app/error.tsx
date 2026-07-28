'use client';

import Link from 'next/link';
import AnalyticsErrorTracker from '@/components/analytics/AnalyticsErrorTracker';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <AnalyticsErrorTracker eventName="client_error" metadata={{ digest: error.digest ?? null }} />
      <main className="flex min-h-[calc(100vh-64px-56px)] flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-4 text-xs font-semibold tracking-widest text-zinc-500 uppercase">오류</p>
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-zinc-100">문제가 발생했어요.</h1>
        <p className="mb-10 text-base text-zinc-400">일시적인 오류입니다. 잠시 후 다시 시도해주세요.</p>
        <div className="flex items-center gap-4">
          <button onClick={reset} className="cursor-pointer rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-zinc-100 transition-all hover:bg-white/20">다시 시도</button>
          <Link href="/" className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:border-white/20 hover:text-zinc-200">홈으로</Link>
        </div>
      </main>
    </>
  );
}
