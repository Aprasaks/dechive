'use client';

import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';

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
      {/* 정의 */}
      <section className="text-center">
        <p className="mb-4 text-xs font-medium tracking-[0.18em] text-white/55 uppercase">
          {t.aboutKicker}
        </p>
        <h1 className="mb-8 animate-brand-shimmer text-5xl font-extrabold tracking-tight">
          {t.aboutBrand}
        </h1>
        <div className="flex flex-col gap-6 text-center">
          <p className="whitespace-pre-line text-lg leading-loose text-white">
            {t.aboutDefinition}
          </p>
          <p className="whitespace-pre-line text-base leading-loose text-zinc-200">
            {t.aboutPurpose}
          </p>
          <p className="whitespace-pre-line text-base leading-loose text-zinc-200">
            {t.aboutReading}
          </p>
          <p className="whitespace-pre-line text-base leading-loose text-zinc-200">
            {t.aboutExplore}
          </p>
          <p className="whitespace-pre-line text-base leading-loose text-white">
            {t.aboutClosing}
          </p>
        </div>
      </section>

      <Divider />

      {/* 사서에게 닿을 곳 */}
      <section className="text-center">
        <p className="mb-3 text-xs font-medium tracking-[0.24em] text-amber-100/70 uppercase">
          {t.aboutContactTitle}
        </p>
        <a
          href={`mailto:${t.aboutContactEmail}`}
          className="text-sm text-amber-100/85 underline decoration-amber-100/25 underline-offset-4 transition-colors hover:text-amber-50 hover:decoration-amber-100/45"
        >
          {t.aboutContactEmail}
        </a>
      </section>
    </main>
  );
}
