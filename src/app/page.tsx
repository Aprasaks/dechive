import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: 'https://dechive.dev' },
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center">
      <div className="flex flex-col items-center gap-8">
        {/* 구분선 */}
        <div className="h-px w-10 bg-zinc-700" />

        {/* 인트로 */}
        <h1 className="text-3xl font-extrabold leading-snug tracking-tight sm:text-4xl lg:text-5xl">
          <span className="text-zinc-400">생각이 기록이 되는 순간</span><br />
          <span className="text-white">의미를 가진다.</span>
        </h1>

        {/* 구분선 */}
        <div className="h-px w-10 bg-zinc-700" />

        {/* 서고 입장 */}
        <Link
          href="/archive"
          className="rounded-full border border-zinc-600 px-8 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-400 hover:text-white active:scale-95"
        >
          서고 입장 →
        </Link>
      </div>
    </main>
  );
}
