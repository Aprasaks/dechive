'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DailyIssueCover from '@/components/home/DailyIssueCover';
import { useLang } from '@/components/layout/LangProvider';
import LangToggle from '@/components/layout/LangToggle';
import MusicToggle from '@/components/layout/MusicToggle';
import type { DailyAiUpdates } from '@/data/dailyAiUpdates';
import type { DailyIssue } from '@/data/dailyIssues';
import type { WeeklyEdition } from '@/data/weeklyEditions';
import type { Lang } from '@/lib/i18n';

interface HomePost {
  slug: string;
  title: string;
  description: string;
  category: string;
  seoTitle?: string;
}

interface HomeClientProps {
  featuredPosts: Record<Lang, HomePost | null>;
  latestPosts: Record<Lang, HomePost[]>;
  latestIssue: DailyIssue;
  latestWeeklyEdition: WeeklyEdition | null;
  latestAiUpdates: DailyAiUpdates;
  heroSerifClassName: string;
}

const homeCopy = {
  ko: {
    topLine: '지식을 검증하고, 가치를 아카이빙하다',
    desktopArchiveLabel: 'Archive',
    desktopArchive: ['하나의 질문,', '하나의 기록'],
    desktopDeepDiveLabel: 'Deep Dive',
    desktopDeepDive: ['깊은 질문을', '끝까지'],
    desktopAiBriefLabel: 'AI Brief',
    desktopAiBrief: ['짧게 보기'],
    desktopEnglishLabel: 'English',
    desktopEnglish: ['밖으로 보내기'],
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
    desktopArchiveLabel: 'Archive',
    desktopArchive: ['One question,', 'one record'],
    desktopDeepDiveLabel: 'Deep Dive',
    desktopDeepDive: ['Deep questions', 'to the end'],
    desktopAiBriefLabel: 'AI Brief',
    desktopAiBrief: ['Short reads'],
    desktopEnglishLabel: 'English',
    desktopEnglish: ['Send it outward'],
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
                  <LangToggle tone="hero" />
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
  latestIssue,
  latestWeeklyEdition,
  latestAiUpdates,
  heroSerifClassName,
}: HomeClientProps) {
  const { lang } = useLang();
  const t = homeCopy[lang];
  const archiveRootHref = lang === 'en' ? '/en/archive' : '/archive';
  const deepDiveRootHref = lang === 'en' ? '/en/deep-dive' : '/deep-dive';

  return (
    <main className="flex flex-1 flex-col bg-[#F8F6F1] text-[#111111]">
      <MobileHomeCover
        lang={lang}
        t={t}
        archiveRootHref={archiveRootHref}
        featuredHref={deepDiveRootHref}
        heroSerifClassName={heroSerifClassName}
      />

      <DailyIssueCover
        issue={latestIssue}
        weeklyEdition={latestWeeklyEdition}
        dailyAiUpdates={latestAiUpdates}
        lang={lang}
        heroSerifClassName={heroSerifClassName}
      />
    </main>
  );
}
