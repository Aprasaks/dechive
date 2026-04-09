import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllLogs } from '@/lib/logs';

export const metadata: Metadata = {
  title: 'Logs',
  description: 'AI와 함께하는 트러블슈팅과 데일리 로그. 날것의 성장 기록.',
  alternates: { canonical: 'https://dechive.dev/logs' },
  openGraph: {
    title: 'Logs | Dechive',
    description: 'AI와 함께하는 트러블슈팅과 데일리 로그. 날것의 성장 기록.',
    url: 'https://dechive.dev/logs',
    images: [{ url: 'https://dechive.dev/images/thumb.webp', width: 1200, height: 630, alt: 'Dechive Logs' }],
  },
};

export default function LogsPage() {
  const logs = getAllLogs();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 min-h-[calc(100vh-64px-56px)]">

      {/* 히어로 */}
      <section className="flex flex-col items-center text-center mb-16">
        <div className="relative w-32 h-32 mb-6">
          <Image
            src="/images/logs.webp"
            alt="Logs mascot"
            fill
            sizes="128px"
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-3">
          Dechive · Logs
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100 leading-snug mb-4">
          날것의 성장을 기록한다.
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-zinc-400">
          에러, 삽질, 해결. 정제되지 않은 현장 기록.
        </p>
      </section>

      {/* 로그 리스트 */}
      {logs.length === 0 ? (
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
      ) : (
        <section className="flex flex-col">
          {logs.map((log, i) => (
            <Link
              key={log.slug}
              href={`/logs/${log.slug}`}
              className={[
                'group flex gap-6 py-5 transition-colors hover:bg-white/5 -mx-4 px-4 rounded-xl',
                i !== logs.length - 1 ? 'border-b border-zinc-800/60' : '',
              ].join(' ')}
            >
              {/* 날짜 */}
              <time
                dateTime={log.date}
                className="shrink-0 w-20 text-xs text-zinc-600 pt-0.5 tabular-nums"
              >
                {log.date}
              </time>

              {/* 본문 */}
              <div className="flex flex-col gap-1.5 min-w-0">
                <h2 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-snug">
                  {log.title}
                </h2>
                {log.summary && (
                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                    {log.summary}
                  </p>
                )}
                {log.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {log.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-zinc-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
