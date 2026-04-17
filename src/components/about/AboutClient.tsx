'use client';

import Link from 'next/link';
import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';

const GOLD = '#c8963a';
const GOLD_FAINT = 'rgba(200,150,58,0.2)';

function Divider() {
  return (
    <div className="my-8 flex items-center gap-3">
      <div className="h-px flex-1 bg-zinc-800" />
      <span className="text-[10px] text-zinc-700">✦</span>
      <div className="h-px flex-1 bg-zinc-800" />
    </div>
  );
}

export default function AboutClient() {
  const { lang } = useLang();
  const t = i18n[lang];

  return (
    <main className="mx-auto min-h-[calc(100vh-64px-56px)] w-full max-w-xl px-6 pt-20 pb-10">
      {/* 인트로 */}
      <section className="text-center">
        <p className="text-base leading-loose whitespace-pre-line text-white">
          {t.aboutIntro}
        </p>
      </section>

      <Divider />

      {/* 타임라인 */}
      <section className="flex flex-col items-center gap-0">
        {/* 항목 1 */}
        <div className="flex flex-col items-center gap-2 pb-2 text-center">
          <div className="size-2.5 rounded-full" style={{ background: GOLD }} />
          <span className="text-sm font-bold" style={{ color: GOLD }}>
            {t.aboutTimeline1Date}
          </span>
          <span className="text-base text-white">{t.aboutTimeline1Text}</span>
        </div>
        {/* 연결선 */}
        <div className="h-8 w-px" style={{ background: GOLD_FAINT }} />
        {/* 항목 2 */}
        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <div className="size-2.5 rounded-full" style={{ background: GOLD }} />
          <span className="text-sm font-bold" style={{ color: GOLD }}>
            {t.aboutTimeline2Date}
          </span>
          <span className="text-base text-white">{t.aboutTimeline2Text}</span>
        </div>
      </section>

      <Divider />

      {/* 클로징 */}
      <section className="text-center">
        <p className="mb-20 text-lg leading-loose whitespace-pre-line text-white">
          {t.aboutClosing}
        </p>
        <p className="animate-brand-shimmer text-5xl font-extrabold tracking-tight">
          {t.aboutBrand}
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-block text-sm text-zinc-300 underline underline-offset-4 transition-colors hover:text-white"
        >
          by Demian
        </Link>
      </section>
    </main>
  );
}
