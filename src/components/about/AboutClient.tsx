'use client';

import { ArrowUpRight, Check, Search, Sparkles } from 'lucide-react';
import { useLang } from '@/components/layout/LangProvider';

const copy = {
  ko: {
    eyebrow: 'About Dechive',
    headlineTop: 'AI creates answers.',
    headlineBottom: 'Humans verify them.',
    lead:
      'AI가 답을 내뱉어 주지만 지식을 걸러주지는 않는다. 무수히 많은 지식 속에서 진실된 지식을 찾는 것은 오로지 사람의 능력이자 권한이다.',
    note:
      'Dechive는 그 권한을 포기하지 않기 위해 만든 개인 지식 아카이브입니다. 질문, 출처, 생각, 검증의 흔적을 남기고 다시 찾을 수 있게 쌓아둡니다.',
    principleEyebrow: 'What Dechive Keeps',
    principles: [
      {
        title: 'Answers are not knowledge yet.',
        body: '답은 시작점입니다. Dechive는 답을 그대로 믿기보다 출처와 맥락, 한계를 함께 남깁니다.',
      },
      {
        title: 'Verification belongs to humans.',
        body: '무엇을 믿을지, 무엇을 보류할지, 무엇을 다시 물을지는 사람의 판단으로 결정합니다.',
      },
      {
        title: 'A private archive comes first.',
        body: '외부 검색보다 먼저 내가 쌓아둔 기록 안에서 찾고, 연결하고, 다시 검토합니다.',
      },
    ],
    searchLabel: 'Ask my archive',
    searchPlaceholder: '내 기록 안에서 먼저 묻기',
    closingTitle: 'Dechive is a living private library for verified knowledge.',
    closingBody:
      'AI는 연결을 돕고, 사람은 검증합니다. Dechive는 그 사이에 쌓이는 기록의 장소입니다.',
    links: ['Archive', 'Deep Dive', 'AI Update', 'Library'],
  },
  en: {
    eyebrow: 'About Dechive',
    headlineTop: 'AI creates answers.',
    headlineBottom: 'Humans verify them.',
    lead:
      'AI can produce answers, but it does not filter knowledge for truth. In a flood of information, finding what is true remains a human ability and a human authority.',
    note:
      'Dechive is a private knowledge archive built to keep that authority intact. It stores questions, sources, thoughts, and traces of verification so they can be found again.',
    principleEyebrow: 'What Dechive Keeps',
    principles: [
      {
        title: 'Answers are not knowledge yet.',
        body: 'An answer is only a starting point. Dechive keeps the source, context, and limits beside it.',
      },
      {
        title: 'Verification belongs to humans.',
        body: 'What to trust, what to hold, and what to ask again remains a human decision.',
      },
      {
        title: 'A private archive comes first.',
        body: 'Before searching outside, Dechive returns to the records already collected inside.',
      },
    ],
    searchLabel: 'Ask my archive',
    searchPlaceholder: 'Ask inside my records first',
    closingTitle: 'Dechive is a living private library for verified knowledge.',
    closingBody:
      'AI helps connect. Humans verify. Dechive is the place where that process becomes a record.',
    links: ['Archive', 'Deep Dive', 'AI Update', 'Library'],
  },
} as const;

export default function AboutClient() {
  const { lang } = useLang();
  const t = copy[lang];

  return (
    <main className="min-h-screen bg-[#030303] text-[#f3eadb]">
      <section className="relative isolate overflow-hidden border-b border-[#d7ad73]/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_22%,rgba(246,210,155,0.11),transparent_28%),radial-gradient(circle_at_78%_48%,rgba(127,198,192,0.08),transparent_32%),linear-gradient(180deg,#030303_0%,#060606_52%,#030303_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent via-[#f6d29b]/38 to-transparent"
        />

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-[#c89b62]/28 bg-[#c89b62]/8 px-3 py-1.5 text-[10px] font-semibold tracking-[0.22em] text-[#f6d29b] uppercase">
              {t.eyebrow}
            </p>

            <h1 className="mt-8 font-[family-name:var(--font-header-serif)] text-[3rem] leading-[1.02] font-semibold tracking-normal text-white sm:text-[4.7rem] lg:text-[5.8rem]">
              <span className="block">{t.headlineTop}</span>
              <span className="mt-2 block text-[#f6d29b]">{t.headlineBottom}</span>
            </h1>

            <div className="mt-8 max-w-2xl space-y-5 text-base leading-8 text-[#e8dfcd]/76 sm:text-lg sm:leading-9">
              <p>{t.lead}</p>
              <p className="text-[#e8dfcd]/58">{t.note}</p>
            </div>
          </div>

          <aside className="relative self-end rounded-md border border-white/10 bg-[#070707]/88 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-6 lg:mb-2">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-md bg-[radial-gradient(circle_at_80%_12%,rgba(246,210,155,0.12),transparent_30%)]"
            />
            <div className="relative">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <p className="text-[10px] font-semibold tracking-[0.22em] text-[#d7ad73] uppercase">
                  {t.searchLabel}
                </p>
                <Sparkles size={17} className="text-[#f6d29b]" />
              </div>

              <div className="mt-5 flex min-h-14 items-center gap-3 rounded-[12px] border border-white/14 bg-black/40 px-4">
                <Search size={19} className="shrink-0 text-white/70" />
                <p className="min-w-0 flex-1 truncate text-sm text-white/40">
                  {t.searchPlaceholder}
                </p>
                <ArrowUpRight size={17} className="shrink-0 text-[#f6d29b]/78" />
              </div>

              <ul className="mt-5 grid gap-3 text-sm leading-6 text-[#e8dfcd]/68">
                {t.links.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check size={15} className="shrink-0 text-[#f6d29b]/76" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-white/8 bg-[#030303] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.24em] text-[#d7ad73] uppercase">
            {t.principleEyebrow}
          </p>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {t.principles.map((item, index) => (
              <article
                key={item.title}
                className="rounded-md border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-[#c89b62]/34 hover:bg-white/[0.04] sm:p-6"
              >
                <p className="font-mono text-xs text-[#d7ad73]">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="mt-5 font-[family-name:var(--font-header-serif)] text-2xl leading-tight text-[#f5ead5]">
                  {item.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#e8dfcd]/64">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-md border border-[#d7ad73]/16 bg-[#070707] px-5 py-8 sm:px-8 lg:flex lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-3xl">
            <p className="font-[family-name:var(--font-header-serif)] text-3xl leading-tight text-white sm:text-4xl">
              {t.closingTitle}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#e8dfcd]/62">
              {t.closingBody}
            </p>
          </div>
          <p className="mt-8 text-[10px] font-semibold tracking-[0.24em] text-[#d7ad73] uppercase lg:mt-0">
            always recording · always becoming
          </p>
        </div>
      </section>
    </main>
  );
}
