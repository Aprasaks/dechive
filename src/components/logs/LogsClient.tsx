'use client';

import Link from 'next/link';
import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';
import type { Log } from '@/types/archive';

interface LogsClientProps {
  logs: Log[];
}

const PANEL_BG = 'rgba(10,8,5,0.78)';
const LINE_COLOR = 'rgba(255,255,255,0.10)';
const DOT_DIM = 'rgba(255,255,255,0.20)';
const TEXT_PRIMARY = '#ffffff';
const TEXT_SECONDARY = 'rgba(255,255,255,0.45)';
const TEXT_DATE = 'rgba(255,255,255,0.60)';
const TEXT_TAG = 'rgba(255,255,255,0.25)';

export default function LogsClient({ logs }: LogsClientProps) {
  const { lang } = useLang();
  const t = i18n[lang];

  const sorted = [...logs].sort((a, b) => (a.date > b.date ? -1 : 1));

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 min-h-[calc(100vh-64px-56px)]">
      <div
        className="overflow-hidden"
        style={{
          background: PANEL_BG,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)',
          borderRadius: '3px',
        }}
      >
        {/* Header */}
        <div className="px-8 pt-9 pb-7" style={{ borderBottom: `1px solid ${LINE_COLOR}` }}>
          <h1 className="text-xl font-bold tracking-tight mb-2" style={{ color: TEXT_PRIMARY }}>
            {t.logsTagline}
          </h1>
          <p className="text-xs leading-relaxed" style={{ color: TEXT_SECONDARY }}>
            {t.logsDesc}
          </p>
        </div>

        {/* Timeline */}
        <div className="px-8 py-8">
          {sorted.length === 0 ? (
            <p className="text-sm text-center py-12" style={{ color: TEXT_SECONDARY }}>
              {t.logsEmpty}
            </p>
          ) : (
            <div className="relative">
              <div
                className="absolute left-[6px] top-2 bottom-2"
                style={{ width: '1px', background: LINE_COLOR }}
              />
              <div className="flex flex-col gap-8">
                {sorted.map((log) => (
                  <Link key={log.slug} href={`/logs/${log.slug}`} className="group relative pl-7">
                    {/* dot */}
                    <div
                      className="absolute left-0 top-[5px] size-[13px] rounded-full border flex items-center justify-center"
                      style={{ borderColor: DOT_DIM, background: 'rgba(10,8,5,0.95)' }}
                    >
                      <div
                        className="size-[4px] rounded-full transition-all duration-200 group-hover:scale-[2]"
                        style={{ background: DOT_DIM }}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <time
                        dateTime={log.date}
                        className="font-mono text-xs"
                        style={{ color: TEXT_DATE }}
                      >
                        {log.date.slice(2).replace(/-/g, '.')}
                      </time>
                      <h2
                        className="text-base font-semibold leading-snug transition-colors duration-150 group-hover:text-white"
                        style={{ color: TEXT_PRIMARY }}
                      >
                        {log.title}
                      </h2>
                      {log.summary && (
                        <p
                          className="text-sm leading-relaxed line-clamp-2"
                          style={{ color: TEXT_SECONDARY }}
                        >
                          {log.summary}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-3" style={{ borderTop: `1px solid ${LINE_COLOR}` }}>
          <p className="font-mono text-[10px] text-right" style={{ color: TEXT_TAG }}>
            {sorted.length} {lang === 'ko' ? '개의 기록' : 'entries'}
          </p>
        </div>
      </div>
    </main>
  );
}
