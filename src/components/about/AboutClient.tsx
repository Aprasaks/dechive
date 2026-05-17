'use client';

import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';

function Divider() {
  return (
    <div className="my-12 flex items-center gap-3">
      <div className="h-px flex-1 bg-[#2a211b]/10" />
      <span className="text-[10px] text-[#9a7a3f]/45">✦</span>
      <div className="h-px flex-1 bg-[#2a211b]/10" />
    </div>
  );
}

export default function AboutClient() {
  const { lang } = useLang();
  const t = i18n[lang];

  return (
    <main className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[#f8f6f1] px-6 py-14 text-[#19140f] sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.86),transparent_34%),linear-gradient(180deg,rgba(176,141,87,0.08),transparent_42%)]" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-[460px] w-[min(760px,88vw)] -translate-x-1/2 rounded-t-full border border-b-0 border-[#9a7a3f]/14" />
      <div className="pointer-events-none absolute left-[12%] top-28 hidden h-[72%] w-px bg-linear-to-b from-transparent via-[#9a7a3f]/16 to-transparent lg:block" />
      <div className="pointer-events-none absolute right-[12%] top-28 hidden h-[72%] w-px bg-linear-to-b from-transparent via-[#9a7a3f]/16 to-transparent lg:block" />

      <section className="relative mx-auto w-full max-w-3xl text-center">
        <p className="mb-4 text-xs font-medium tracking-[0.18em] text-[#9a7a3f] uppercase">
          {t.aboutKicker}
        </p>
        <div className="mx-auto mb-6 h-px w-20 bg-[#9a7a3f]/35" />
        <h1 className="mb-8 font-[family-name:var(--font-header-serif)] text-5xl font-semibold tracking-tight text-[#17120d] sm:text-6xl">
          {t.aboutTitle}
        </h1>
        <div className="mx-auto flex max-w-2xl flex-col gap-5 text-center">
          <p className="whitespace-pre-line text-xl leading-loose text-[#2a211b]">
            {t.aboutDefinition}
          </p>
          <p className="whitespace-pre-line text-base leading-loose text-[#5f564d]">
            {t.aboutPurpose}
          </p>
        </div>
      </section>

      <section className="relative mx-auto mt-10 grid w-full max-w-4xl gap-4 md:grid-cols-2">
        <div className="rounded-sm border border-[#9a7a3f]/18 bg-white/48 p-6 text-center shadow-[0_24px_80px_rgba(42,33,27,0.08)]">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-[#9a7a3f]">
            {t.aboutWhyTitle}
          </p>
          <p className="whitespace-pre-line text-sm leading-loose text-[#5f564d]">
            {t.aboutWhyDescription}
          </p>
        </div>
        <div className="rounded-sm border border-[#9a7a3f]/18 bg-white/48 p-6 text-center shadow-[0_24px_80px_rgba(42,33,27,0.08)]">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-[#9a7a3f]">
            {t.aboutHowTitle}
          </p>
          <p className="whitespace-pre-line text-sm leading-loose text-[#5f564d]">
            {t.aboutHowDescription}
          </p>
        </div>
      </section>

      <section className="relative mx-auto mt-4 grid w-full max-w-4xl gap-4 md:grid-cols-2">
        <div className="rounded-sm border border-[#9a7a3f]/24 bg-[#efe7da]/55 p-6 text-center shadow-[0_24px_80px_rgba(42,33,27,0.1)] transition-colors hover:border-[#9a7a3f]/45">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-[#9a7a3f]">
            {t.aboutArchiveTitle}
          </p>
          <p className="whitespace-pre-line text-sm leading-loose text-[#443a32]">
            {t.aboutArchiveDescription}
          </p>
        </div>
        <div className="rounded-sm border border-[#9a7a3f]/24 bg-[#efe7da]/55 p-6 text-center shadow-[0_24px_80px_rgba(42,33,27,0.1)] transition-colors hover:border-[#9a7a3f]/45">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-[#9a7a3f]">
            {t.aboutDeepDiveTitle}
          </p>
          <p className="whitespace-pre-line text-sm leading-loose text-[#443a32]">
            {t.aboutDeepDiveDescription}
          </p>
        </div>
      </section>

      <section className="relative mx-auto mt-10 flex w-full max-w-2xl flex-col gap-5 text-center">
        <p className="whitespace-pre-line text-base leading-loose text-[#5f564d]">
          {t.aboutExplore}
        </p>
        <p className="whitespace-pre-line text-lg leading-loose text-[#2a211b]">
          {t.aboutClosing}
        </p>
      </section>

      <Divider />

      {/* 사서에게 닿을 곳 */}
      <section className="text-center">
        <p className="mb-3 text-xs font-medium tracking-[0.24em] text-[#9a7a3f] uppercase">
          {t.aboutContactTitle}
        </p>
        <a
          href={`mailto:${t.aboutContactEmail}`}
          className="text-sm text-[#5d4630] underline decoration-[#9a7a3f]/25 underline-offset-4 transition-colors hover:text-[#17120d] hover:decoration-[#9a7a3f]/55"
        >
          {t.aboutContactEmail}
        </a>
      </section>
    </main>
  );
}
