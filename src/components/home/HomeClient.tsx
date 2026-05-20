'use client';

import { type ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/components/layout/LangProvider';
import LangToggle from '@/components/layout/LangToggle';
import MusicToggle from '@/components/layout/MusicToggle';
import type { Lang } from '@/lib/i18n';

interface HomePost {
  slug: string;
  title: string;
  description: string;
  category: string;
  subject: string;
  seoTitle?: string;
}

interface HomeClientProps {
  featuredPosts: Record<Lang, HomePost | null>;
  latestPosts: Record<Lang, HomePost[]>;
  heroSerifClassName: string;
}

const homeCopy = {
  ko: {
    topLine: '지식을 검증하고, 가치를 아카이빙하다',
    editorNoteLabel: "Editor's Note",
    editorNote: ['AI는 답을 만들고', 'Dechive는 검증한다'],
    dailyArchiveLabel: 'Archive',
    dailyArchive: ['하나의 질문,', '하나의 기록'],
    deepDiveLabel: 'Deep Dive',
    deepDive: ['깊은 질문을', '끝까지 밀고 가기'],
    insideLabel: 'Inside',
    inside: ['지식은 검증으로', '완성된다'],
    soloAgileLabel: 'Solo Agile',
    soloAgile: ['1인기업시대,', '회고는 필요없는것인가'],
    archiveLabel: '무료 전자책',
    archive: ['AI가 낯선 사람을', '위한 무료 전자책'],
    thinkingEyebrow: 'How Dechive Thinks',
    thinkingTitle: 'Dechive는 질문의 깊이에 따라 기록을 나눕니다.',
    thinkingDescription: 'Archive는 하나의 질문을 독립된 기록으로 남기고, Deep Dive는 더 깊은 질문을 길게 밀고 갑니다.',
    thinkingItems: [
      {
        title: 'Concept',
        body: 'Archive는 한 질문에 필요한 개념을 먼저 세웁니다.',
      },
      {
        title: 'Example',
        body: '예시와 상황으로 답이 실제로 성립하는지 확인합니다.',
      },
      {
        title: 'Mistake',
        body: '자주 틀리는 지점을 남겨 다시 검증할 수 있게 합니다.',
      },
      {
        title: 'Verification',
        body: 'Deep Dive는 깊은 질문을 한계와 판단 기준까지 이어갑니다.',
      },
    ],
    featuredEyebrow: 'Featured Deep Dive',
    featuredTitle: '깊은 질문을 끝까지 밀고 갑니다.',
    featuredDescription: ['Deep Dive는 심층적인 질문을 개념, 예시, 실수, 한계까지 따라가며', 'AI가 만든 답을 사람이 검증할 수 있는 긴 문서로 정리합니다.'],
    featuredMetaFallback: 'Deep Dive / Verification',
    featuredFallbackTitle: 'Agile은 속도가 아니라 방향을 검증하는 방식이다',
    featuredDescriptionFallback: 'AI가 구현 속도를 높이는 시대에도 Agile이 왜 필요한지, 방향 검증의 방식으로 정리합니다.',
    readDeepDive: 'Deep Dive 읽기',
    latestEyebrow: 'Latest Archive',
    latestTitle: '하나의 질문에서 시작한 기록들.',
    latestDescription: '각 글은 독립적으로 읽히는 질문의 기록입니다. 빠르게 답하지 않고 다시 검증할 수 있게 남깁니다.',
    archiveAll: 'Archive 전체 보기',
    manifestoEyebrow: 'Manifesto',
    manifestoLead: ['AI가 답을 만들어주는 시대에도,', '사람은 그 답을 이해하고 검증할 수 있어야 합니다.'],
    manifestoBody: ['Archive는 하나의 질문을 독립된 기록으로 남기고,', 'Deep Dive는 깊은 질문을 끝까지 밀고 갑니다.', '', '이곳의 글은 빠른 요약이 아니라,', '다음 질문까지 견디는 지식으로 쌓입니다.'],
    aboutLink: 'About Dechive',
  },
  en: {
    topLine: 'Verifying knowledge, archiving value',
    editorNoteLabel: "Editor's Note",
    editorNote: ['AI makes answers.', 'Dechive verifies.'],
    dailyArchiveLabel: 'Archive',
    dailyArchive: ['One question,', 'one record'],
    deepDiveLabel: 'Deep Dive',
    deepDive: ['Carrying deeper', 'questions through'],
    insideLabel: 'Inside',
    inside: ['Knowledge is completed', 'through verification'],
    soloAgileLabel: 'Solo Agile',
    soloAgile: ['In the solo business era,', 'is reflection unnecessary?'],
    archiveLabel: 'Free Ebook',
    archive: ['A free ebook', 'for AI newcomers'],
    thinkingEyebrow: 'How Dechive Thinks',
    thinkingTitle: 'Dechive separates records by the depth of the question.',
    thinkingDescription: 'Archive keeps one question as an independent record. Deep Dive carries a deeper question through a longer chain of reasoning.',
    thinkingItems: [
      {
        title: 'Concept',
        body: 'Archive first sets the concept needed for one question.',
      },
      {
        title: 'Example',
        body: 'Examples and situations check whether the answer holds.',
      },
      {
        title: 'Mistake',
        body: 'Common failure points stay visible so the record can be checked again.',
      },
      {
        title: 'Verification',
        body: 'Deep Dive follows a deeper question through limits and judgment criteria.',
      },
    ],
    featuredEyebrow: 'Featured Deep Dive',
    featuredTitle: 'A deep question carried to the end.',
    featuredDescription: ['Deep Dive follows a deeper question through concepts, examples, mistakes, and limits,', 'then turns AI-made answers into long-form records people can verify.'],
    featuredMetaFallback: 'Deep Dive / Verification',
    featuredFallbackTitle: 'Agile Is Not Speed, But a Way to Verify Direction',
    featuredDescriptionFallback: 'Why Agile still matters in an age when AI accelerates implementation, organized as a method for verifying direction.',
    readDeepDive: 'Read Deep Dive',
    latestEyebrow: 'Latest Archive',
    latestTitle: 'Records that begin with one question.',
    latestDescription: 'Each Archive post stands alone as a question record that can be reopened and verified.',
    archiveAll: 'View All Archive',
    manifestoEyebrow: 'Manifesto',
    manifestoLead: ['Even in an age when AI makes answers,', 'people still need to understand and verify them.'],
    manifestoBody: ['Archive keeps one question as an independent record,', 'and Deep Dive carries a deeper question to the end.', '', 'The writing here is not a quick summary.', 'It becomes knowledge that can withstand the next question.'],
    aboutLink: 'About Dechive',
  },
} as const;

function formatToday() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).formatToParts(new Date());

  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  const month =
    parts.find((part) => part.type === 'month')?.value.toUpperCase() ?? '';
  const year = parts.find((part) => part.type === 'year')?.value ?? '';

  return `${day} ${month} ${year}`.trim();
}

function TodayStamp() {
  const [today, setToday] = useState('');

  useEffect(() => {
    setToday(formatToday());
  }, []);

  if (!today) return null;

  return (
    <p className="mt-2 text-sm font-semibold tracking-[0.08em] text-[#111111] sm:text-base">
      {today}
    </p>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold tracking-[0.28em] text-[#B08D57] uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-5 text-3xl leading-tight font-semibold text-[#111111] sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <div className="mt-5 text-base leading-8 text-[#3f3f3f]">
          {description}
        </div>
      ) : null}
    </div>
  );
}

function renderLines(lines: readonly string[], hiddenBreak = false) {
  return lines.map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? (
        <br className={hiddenBreak ? 'hidden sm:block' : undefined} />
      ) : null}
    </span>
  ));
}

function MobileHomeCover({
  lang,
  t,
  archiveRootHref,
  featuredHref,
  heroSerifClassName,
}: {
  lang: Lang;
  t: (typeof homeCopy)[Lang];
  archiveRootHref: string;
  featuredHref: string;
  heroSerifClassName: string;
}) {
  const slides = [
    {
      index: '01',
      label: lang === 'ko' ? 'Intro' : 'Intro',
      title: 'The Age Of Verification',
      body: lang === 'ko' ? 'AI의 답을 의심하라\nDechive는 검증한다' : 'Question AI answers.\nDechive verifies.',
      href: null,
      linkLabel: null,
    },
    {
      index: '02',
      label: t.archiveLabel,
      title: lang === 'ko' ? '시간이 지나도\n검증 가능한 기록' : 'Verifiable records\nthat remain over time',
      body: '',
      href: archiveRootHref,
      linkLabel: t.archiveAll,
    },
    {
      index: '03',
      label: t.deepDiveLabel,
      title: renderLines(t.deepDive),
      body: '',
      href: featuredHref,
      linkLabel: t.readDeepDive,
    },
    {
      index: '04',
      label: t.manifestoEyebrow,
      title: lang === 'ko'
        ? '검증의 시대\n선택이 아니라 기준입니다.'
        : 'The Age of Verification\nNot optional. The standard.',
      body: '',
      href: '/about',
      linkLabel: t.aboutLink,
    },
  ];

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden border-b border-black/10 bg-[#f8f6f1] md:hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[url('/images/bg-mobile.webp')] bg-cover bg-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-white/18"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-white/18 via-transparent to-[#f8f6f1]/54"
      />

      <div className="flex min-h-[100svh] snap-x snap-mandatory overflow-x-auto scrollbar-hide">
        {slides.map((slide) => (
          <article
            key={slide.index}
            className="flex min-h-[100svh] w-screen shrink-0 snap-start flex-col justify-between px-6 py-8"
          >
            <div>
              <p className={`text-center text-[4.15rem] leading-[0.78] font-semibold tracking-[-0.06em] text-[#3a2416] ${heroSerifClassName}`}>
                DECHIVE
              </p>
              <div className="mt-5 flex items-center gap-3">
                <TodayStamp />
                <span className="h-px flex-1 bg-[#3a2416]/25" />
                <div className="flex items-center gap-3">
                  <LangToggle tone="light" />
                  <MusicToggle tone="light" />
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-sm bg-[#f8f6f1]/70 p-6 text-center shadow-[0_22px_70px_rgba(42,33,27,0.14)] backdrop-blur-sm">
                <p className="text-[11px] font-bold tracking-[0.26em] text-[#8a632f] uppercase">
                  {slide.label}
                </p>
                <h1 className={`mt-4 whitespace-pre-line text-2xl leading-tight font-semibold text-[#111111] ${heroSerifClassName}`}>
                  {slide.title}
                </h1>
                {slide.body ? (
                  <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#3f3f3f]">
                    {slide.body}
                  </p>
                ) : null}
                {slide.href && slide.linkLabel ? (
                  <Link
                    href={slide.href}
                    className="mt-7 inline-flex border border-[#111111] bg-[#111111] px-4 py-3 text-xs font-semibold text-white transition-colors hover:border-[#7a5d2c] hover:bg-[#7a5d2c]"
                  >
                    {slide.linkLabel}
                  </Link>
                ) : null}
            </div>

            <p className="text-center text-[11px] font-semibold tracking-[0.28em] text-[#8a632f] uppercase">
              {slide.index} / 04
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function HomeClient({
  featuredPosts,
  latestPosts,
  heroSerifClassName,
}: HomeClientProps) {
  const { lang } = useLang();
  const t = homeCopy[lang];
  const featuredPost = featuredPosts[lang];
  const currentLatestPosts = latestPosts[lang];
  const archiveRootHref = lang === 'en' ? '/en/archive' : '/archive';
  const deepDiveRootHref = lang === 'en' ? '/en/deep-dive' : '/deep-dive';
  const agileDeepDiveHref = `${deepDiveRootHref}/ai-era-agile-verification`;
  const featuredDeepDiveHref = featuredPost
    ? `${deepDiveRootHref}/${featuredPost.slug}`
    : deepDiveRootHref;

  return (
    <main className="flex flex-1 flex-col bg-[#F8F6F1] text-[#111111]">
      <MobileHomeCover
        lang={lang}
        t={t}
        archiveRootHref={archiveRootHref}
        featuredHref={deepDiveRootHref}
        heroSerifClassName={heroSerifClassName}
      />

      <section className="relative isolate hidden min-h-screen overflow-hidden border-b border-black/10 px-6 pt-16 pb-12 sm:px-10 md:grid md:min-h-[760px] lg:min-h-[820px] lg:px-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[url('/images/bg.webp')] bg-cover bg-center"
        />
        <div className="pointer-events-none absolute inset-x-4 top-7 z-10 text-center sm:top-8 lg:top-9">
          <p
            className={`text-[clamp(3.75rem,9.5vw,8.25rem)] leading-[0.82] font-semibold tracking-[-0.045em] text-[#3a2416] ${heroSerifClassName}`}
          >
            DECHIVE
          </p>
        </div>

        <div className="absolute top-6 right-6 z-20 flex items-center gap-4 sm:right-10 lg:right-20">
          <LangToggle tone="light" />
          <MusicToggle tone="light" />
        </div>

        <div className="absolute top-[clamp(6.2rem,12.5vw,11rem)] left-6 z-10 sm:left-10 lg:left-20">
          <TodayStamp />
        </div>
        <p className="absolute top-[clamp(6.35rem,12.8vw,11.25rem)] left-1/2 z-10 hidden -translate-x-1/2 text-xs font-semibold tracking-[0.55em] text-[#3a2416] uppercase md:block">
          VERIFY. ARCHIVE. ELEVATE.
        </p>
        <p className="absolute top-[clamp(6.25rem,12.6vw,11.05rem)] right-6 z-10 hidden text-sm font-semibold text-[#2f2923] sm:right-10 lg:right-20 xl:block">
          {t.topLine}
        </p>

        <div className="absolute top-[28%] left-6 z-10 max-w-68 bg-[#F8F6F1]/64 px-5 py-6 shadow-[0_18px_60px_rgba(17,17,17,0.08)] backdrop-blur-sm sm:left-10 sm:max-w-xs sm:px-6 lg:left-20">
          <div className="relative">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#6f461d] uppercase">
              {t.editorNoteLabel}
            </p>
            <p
              className={`mt-3 text-sm leading-snug text-[#111111] sm:text-base ${heroSerifClassName}`}
            >
              {renderLines(t.editorNote)}
            </p>
          </div>

          <div className="mt-8 h-px w-16 bg-[#3a2416]/40" />

          <div className="mt-7">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#6f461d] uppercase">
              {t.dailyArchiveLabel}
            </p>
            <p
              className={`mt-2 text-base leading-snug text-[#111111] ${heroSerifClassName}`}
            >
              {renderLines(t.dailyArchive)}
            </p>
          </div>

          <div className="mt-8 h-px w-16 bg-[#3a2416]/40" />

          <div className="mt-7">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#6f461d] uppercase">
              {t.deepDiveLabel}
            </p>
            <p
              className={`mt-2 text-base leading-snug text-[#111111] ${heroSerifClassName}`}
            >
              {renderLines(t.deepDive)}
            </p>
          </div>
        </div>

        <div className="absolute top-[28%] right-6 z-10 hidden max-w-68 bg-[#F8F6F1]/66 px-5 py-6 text-right shadow-[0_18px_60px_rgba(17,17,17,0.08)] backdrop-blur-sm sm:right-10 sm:max-w-xs sm:px-6 md:block lg:right-20">
          <div className="relative">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#6f461d] uppercase">
              {t.insideLabel}
            </p>
            <p
              className={`mt-2 text-base leading-snug text-[#111111] ${heroSerifClassName}`}
            >
              {renderLines(t.inside)}
            </p>
          </div>

          <div className="mt-8 ml-auto h-px w-16 bg-[#3a2416]/40" />

          <Link
            href={agileDeepDiveHref}
            className="mt-7 block text-right transition-colors hover:text-[#7a5d2c]"
          >
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#6f461d] uppercase">
              {t.soloAgileLabel}
            </p>
            <p
              className={`mt-2 text-base leading-snug text-[#111111] ${heroSerifClassName}`}
            >
              {renderLines(t.soloAgile)}
            </p>
          </Link>

          <div className="mt-8 ml-auto h-px w-16 bg-[#3a2416]/40" />

          <Link
            href="/downloads/parents-ai-guide"
            className="mt-7 block text-right transition-colors hover:text-[#7a5d2c]"
          >
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#6f461d] uppercase">
              {t.archiveLabel}
            </p>
            <p
              className={`mt-2 text-base leading-snug text-[#111111] ${heroSerifClassName}`}
            >
              {renderLines(t.archive)}
            </p>
          </Link>
        </div>
      </section>

      <section className="hidden border-b border-black/10 px-6 py-24 sm:px-10 md:block lg:px-20">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow={t.thinkingEyebrow}
            title={t.thinkingTitle}
            description={t.thinkingDescription}
          />
          <div className="mt-14 grid border-t border-black/15 md:grid-cols-2 lg:grid-cols-4">
            {t.thinkingItems.map((item) => (
              <article
                key={item.title}
                className="border-b border-black/15 py-8 md:odd:border-r lg:border-r lg:last:border-r-0"
              >
                <div className="px-0 md:px-7">
                  <p className="text-sm font-semibold tracking-[0.2em] text-[#B08D57] uppercase">
                    {item.title}
                  </p>
                  <p className="mt-5 text-base leading-8 text-[#3f3f3f]">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hidden border-b border-black/10 px-6 py-24 sm:px-10 md:block lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionTitle
            eyebrow={t.featuredEyebrow}
            title={t.featuredTitle}
            description={
              <>
                {t.featuredDescription[0]}
                <br />
                {t.featuredDescription[1]}
              </>
            }
          />
          <article className="border-l-2 border-[#B08D57] bg-white/55 p-8 shadow-[0_28px_80px_rgba(17,17,17,0.08)] sm:p-10">
            <p className="text-xs font-semibold tracking-[0.24em] text-[#777777] uppercase">
              {featuredPost
                ? `${featuredPost.category} / ${featuredPost.subject || 'Deep Dive'} / Deep Dive`
                : t.featuredMetaFallback}
            </p>
            <h3
              className={`mt-7 text-3xl leading-tight font-semibold text-[#111111] sm:text-4xl ${heroSerifClassName}`}
            >
              {featuredPost?.seoTitle ??
                featuredPost?.title ??
                t.featuredFallbackTitle}
            </h3>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#3f3f3f]">
              {featuredPost
                ? featuredPost.description
                : t.featuredDescriptionFallback}
            </p>
            <Link
              href={featuredDeepDiveHref}
              className="mt-9 inline-flex border border-[#111111] px-6 py-3 text-sm font-semibold text-[#111111] transition-colors hover:border-[#B08D57] hover:text-[#7a5d2c]"
            >
              {t.readDeepDive}
            </Link>
          </article>
        </div>
      </section>

      <section className="hidden border-b border-black/10 px-6 py-24 sm:px-10 md:block lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              eyebrow={t.latestEyebrow}
              title={t.latestTitle}
              description={t.latestDescription}
            />
            <Link
              href={archiveRootHref}
              className="text-sm font-semibold text-[#7a5d2c] underline decoration-[#B08D57]/40 underline-offset-4 transition-colors hover:text-[#111111]"
            >
              {t.archiveAll}
            </Link>
          </div>

          <div className="mt-14 border-t border-black/15">
            {currentLatestPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`${lang === 'en' ? '/en/archive' : '/archive'}/${post.slug}`}
                className="grid gap-5 border-b border-black/15 py-7 transition-colors hover:bg-white/45 sm:grid-cols-[72px_1fr]"
              >
                <span className="text-sm font-semibold text-[#B08D57]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block font-[family-name:var(--font-header-serif)] text-2xl font-semibold text-[#111111]">
                    {post.seoTitle ?? post.title}
                  </span>
                  <span className="mt-2 block max-w-3xl text-sm leading-7 text-[#555555]">
                    {post.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="hidden px-6 py-24 sm:px-10 md:block lg:px-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <p className="text-xs font-semibold tracking-[0.28em] text-[#B08D57] uppercase">
            {t.manifestoEyebrow}
          </p>
          <div
            className={`max-w-4xl text-3xl leading-relaxed text-[#111111] sm:text-4xl ${heroSerifClassName}`}
          >
            <p>
              {renderLines(t.manifestoLead)}
            </p>
            <p className="mt-8 text-xl leading-9 text-[#3f3f3f]">
              {renderLines(t.manifestoBody, true)}
            </p>
            <Link
              href="/about"
              className="mt-10 inline-flex border border-black/20 px-6 py-3 text-sm font-semibold text-[#111111] transition-colors hover:border-[#B08D57] hover:text-[#7a5d2c]"
            >
              {t.aboutLink}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
