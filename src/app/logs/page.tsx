import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Logs | Dechive',
  description: 'AI와 함께하는 트러블슈팅과 데일리 로그. 날것의 성장 기록.',
};

export default function LogsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 min-h-[calc(100vh-64px-56px)]">

      {/* 히어로 */}
      <section className="flex flex-col items-center text-center mb-20">
        <div className="relative w-48 h-48 mb-8">
          <Image
            src="/images/logs.webp"
            alt="Logs mascot"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-4">
          Dechive · Logs
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 leading-snug mb-6">
          날것의 성장을<br />기록한다.
        </h1>
        <p className="max-w-lg text-base leading-relaxed text-zinc-400">
          AI와 함께하는 트러블슈팅, 데일리 로그, 그리고 개발하며 마주친 모든 것들.
          정제되지 않은 성장의 흔적.
        </p>
      </section>

      {/* Coming Soon */}
      <section className="flex flex-col items-center text-center">
        <div className="rounded-2xl border border-zinc-800 px-12 py-10">
          <p className="text-xs font-semibold tracking-widest text-zinc-600 uppercase mb-3">
            Coming Soon
          </p>
          <p className="text-sm text-zinc-500 leading-relaxed">
            로그 기록들이 곧 채워질 예정입니다.
          </p>
        </div>
      </section>

    </main>
  );
}
