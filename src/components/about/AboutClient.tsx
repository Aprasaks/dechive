'use client';

import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';

type EditorialItem = {
  number: string;
  title: string;
  body: string;
};

const promiseCopy = {
  ko: {
    kicker: 'Our Promise',
    title: '우리는 자극적인 주장보다,\n검증된 기록을 남깁니다.',
    points: [
      '출처를 남깁니다',
      '맥락을 설명합니다',
      '한계를 인정합니다',
      '다시 검토할 수 있도록 기록합니다',
    ],
  },
  en: {
    kicker: 'Our Promise',
    title: 'We leave verified records,\nnot louder claims.',
    points: [
      'Leave the source',
      'Explain the context',
      'Admit the limits',
      'Keep records that can be checked again',
    ],
  },
};

export default function AboutClient() {
  const { lang } = useLang();
  const t = i18n[lang];
  const promise = promiseCopy[lang];
  const editorialItems: EditorialItem[] = [
    {
      number: '01',
      title: t.aboutWhyTitle,
      body: `${t.aboutWhyDescription}\n\n${
        lang === 'ko'
          ? 'Dechive는 그 과정을 기록하고,\n검증의 궤적을 남깁니다.'
          : 'Dechive records that process\nand leaves a trail of verification.'
      }`,
    },
    {
      number: '02',
      title: t.aboutHowTitle,
      body: `${t.aboutHowDescription}\n\n${
        lang === 'ko'
          ? '정리하고, 고도화하고, 연결하며\n생각의 흐름을 보존합니다.'
          : 'It organizes, deepens, connects,\nand preserves the flow of thought.'
      }`,
    },
    {
      number: '03',
      title: t.aboutArchiveTitle,
      body: t.aboutArchiveDescription,
    },
    {
      number: '04',
      title: t.aboutDeepDiveTitle,
      body: t.aboutDeepDiveDescription,
    },
  ];

  return (
    <main className="bg-[#f4efe6] text-[#1c1712]">
      <section className="relative overflow-hidden border-b border-[#3b2a1e]/12">
        <div className="grid min-h-[420px] lg:grid-cols-[44%_56%]">
          <div className="relative z-10 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#9a6f35] uppercase">
              {t.aboutKicker}
            </p>
            <h1 className="mt-5 max-w-[500px] font-[family-name:var(--font-header-serif)] text-[clamp(28px,2.8vw,42px)] leading-[1.12] font-semibold tracking-[-0.03em] text-[#1c1712]">
              {t.aboutTitle}
            </h1>
            <div className="mt-6 max-w-[500px] space-y-4 text-[clamp(14px,1vw,16px)] leading-[1.75] text-[#332820]">
              <p className="whitespace-pre-line">{t.aboutDefinition}</p>
              <div className="h-px w-9 bg-[#9a6f35]/55" />
              <p className="text-[clamp(13px,0.92vw,15px)] whitespace-pre-line text-[#5e5146]">
                {t.aboutPurpose}
              </p>
            </div>
          </div>
          <div className="relative min-h-[320px] lg:min-h-[420px]">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/about/about-hero.webp')",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-[42%] bg-linear-to-r from-[#f4efe6] via-[#f4efe6]/74 to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[#23180f]/8"
            />
          </div>
        </div>
      </section>

      <section className="grid border-b border-[#3b2a1e]/12 bg-[#f7f1e8] lg:grid-cols-4">
        {editorialItems.map((item) => (
          <article
            key={item.number}
            className="min-h-[210px] border-b border-[#3b2a1e]/12 px-6 py-7 sm:px-10 lg:border-r lg:border-b-0 lg:px-9 lg:py-6 xl:px-12"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-[family-name:var(--font-header-serif)] text-[13px] tracking-[0.14em] text-[#4f3926]">
                  {item.number}
                </p>
                <div className="mt-2 h-px w-4 bg-[#9a6f35]/55" />
              </div>
            </div>
            <h2 className="mt-5 text-[13px] font-semibold tracking-[0.28em] text-[#6f4f2d] uppercase">
              {item.title}
            </h2>
            <p className="mt-4 text-[13px] leading-[1.7] whitespace-pre-line text-[#3d332b]">
              {item.body}
            </p>
          </article>
        ))}
      </section>

      <section className="relative overflow-hidden bg-[#0d0d0a] text-[#f8f1e6]">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-full bg-cover bg-center opacity-[0.68] md:w-[44%]"
          style={{ backgroundImage: "url('/images/about/about-promise.webp')" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-[#080806]/36 via-[#080806]/68 to-[#080806]/86"
        />
        <div className="relative grid min-h-[210px] items-center gap-8 px-6 py-9 sm:px-10 lg:grid-cols-[36%_34%_30%] lg:px-16 xl:px-20">
          <div className="hidden lg:block" />
          <div>
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[#b99255] uppercase">
              {promise.kicker}
            </p>
            <p className="mt-4 font-[family-name:var(--font-header-serif)] text-[clamp(24px,1.9vw,34px)] leading-[1.2] whitespace-pre-line text-[#f6efe3]">
              {promise.title}
            </p>
          </div>
          <ul className="space-y-3 text-[13px] leading-none text-[#d8c9b8]/84">
            {promise.points.map((point) => (
              <li
                key={point}
                className="grid grid-cols-[auto_1fr] items-center gap-4"
              >
                <span className="h-1 w-1 rounded-full bg-[#b99255]" />
                <span className="border-b border-[#f8f1e6]/14 pb-2">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
