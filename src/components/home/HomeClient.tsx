'use client';

import { type ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/components/layout/LangProvider';
import LangToggle from '@/components/layout/LangToggle';
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
    dailyArchiveLabel: 'Daily Archive',
    dailyArchive: ['오늘의 질문,', '내일의 기준'],
    deepDiveLabel: 'Deep Dive',
    deepDive: ['한계를 넘어서', '신뢰할 수 있는 기록'],
    insideLabel: 'Inside',
    inside: ['지식은 검증으로', '완성된다'],
    soloAgileLabel: 'Solo Agile',
    soloAgile: ['AI가 빨라질수록', '방향은 더 자주', '검증되어야 한다'],
    archiveLabel: 'Archive',
    archive: ['시간이 지나도', '검증 가능한 기록을', '남긴다'],
    thinkingEyebrow: 'How Dechive Thinks',
    thinkingTitle: 'Dechive의 글은 하나의 질문에서 시작합니다.',
    thinkingDescription: '정의에서 끝나지 않고, 예시와 실수, 한계와 검증 기준까지 따라갑니다.',
    thinkingItems: [
      {
        title: 'Concept',
        body: '개념을 먼저 세웁니다. 무엇인지보다, 왜 필요한지를 묻습니다.',
      },
      {
        title: 'Example',
        body: '코드와 상황으로 확인합니다. 설명은 실제 예시 안에서 검증됩니다.',
      },
      {
        title: 'Mistake',
        body: '자주 틀리는 지점을 남깁니다. 오류는 개념이 무너지는 곳에서 드러납니다.',
      },
      {
        title: 'Verification',
        body: 'AI가 만든 답을 검증합니다. 왜 맞는지, 언제 틀릴 수 있는지 확인합니다.',
      },
    ],
    featuredEyebrow: 'Featured Deep Dive',
    featuredTitle: '하나의 질문을 끝까지 검증합니다.',
    featuredDescription: ['개념, 예시, 실수, 한계, 판단 기준까지 따라가며', 'AI가 만든 답을 사람이 이해하고 검증할 수 있는 기록으로 정리합니다.'],
    featuredMetaFallback: 'Archive / Verification',
    featuredFallbackTitle: 'SQL NULL은 왜 빈칸이 아닌가?',
    featuredDescriptionWithPost: '값이 없다는 사실은 계산과 집계에 조용히 흔적을 남깁니다. IS NULL, COALESCE, COUNT의 차이를 따라가며 AI가 만든 SQL 답을 검증하는 기준까지 정리합니다.',
    featuredDescriptionFallback: '값이 없다는 사실은 계산과 집계에 조용히 흔적을 남깁니다. SQL NULL의 의미와 검증 기준을 정리합니다.',
    readDeepDive: 'Read Deep Dive',
    latestEyebrow: 'Latest Archive',
    latestTitle: '오늘의 질문, 내일의 이해.',
    latestDescription: '개념과 실수, 생각과 관찰을 다시 꺼내볼 수 있는 기록으로 남깁니다.',
    archiveAll: 'Archive 전체 보기',
    manifestoEyebrow: 'Manifesto',
    manifestoLead: ['AI가 답을 만들어주는 시대에도,', '사람은 그 답을 이해하고 검증할 수 있어야 합니다.'],
    manifestoBody: ['Dechive는 책과 문서와 AI를 뒤지며 얻은 이해를', '다시 꺼내볼 수 있는 기록으로 남깁니다.', '', '이곳의 글은 빠른 요약이 아니라,', '다음 질문까지 견디는 지식으로 쌓입니다.'],
    aboutLink: 'About Dechive',
  },
  en: {
    topLine: 'Verifying knowledge, archiving value',
    editorNoteLabel: "Editor's Note",
    editorNote: ['AI makes answers.', 'Dechive verifies.'],
    dailyArchiveLabel: 'Daily Archive',
    dailyArchive: ["Today's questions,", "tomorrow's standards"],
    deepDiveLabel: 'Deep Dive',
    deepDive: ['Beyond limits,', 'records you can trust'],
    insideLabel: 'Inside',
    inside: ['Knowledge is completed', 'through verification'],
    soloAgileLabel: 'Solo Agile',
    soloAgile: ['As AI gets faster,', 'direction must be', 'verified more often'],
    archiveLabel: 'Archive',
    archive: ['Even after time passes,', 'verifiable records', 'remain'],
    thinkingEyebrow: 'How Dechive Thinks',
    thinkingTitle: 'Every Dechive piece begins with one question.',
    thinkingDescription: 'It does not stop at definitions. It follows examples, mistakes, limits, and verification criteria.',
    thinkingItems: [
      {
        title: 'Concept',
        body: 'It builds the concept first. It asks why it matters before what it is.',
      },
      {
        title: 'Example',
        body: 'It checks ideas through code and situations. Explanation is verified inside examples.',
      },
      {
        title: 'Mistake',
        body: 'It leaves the common failure points visible. Mistakes show where a concept breaks.',
      },
      {
        title: 'Verification',
        body: 'It verifies answers made by AI. It asks why they are right and when they can fail.',
      },
    ],
    featuredEyebrow: 'Featured Deep Dive',
    featuredTitle: 'A question followed until it can be verified.',
    featuredDescription: ['Following concepts, examples, mistakes, limits, and judgment criteria,', 'Dechive turns AI-made answers into records people can understand and verify.'],
    featuredMetaFallback: 'Archive / Verification',
    featuredFallbackTitle: 'Why SQL NULL Is Not Empty',
    featuredDescriptionWithPost: 'The absence of a value leaves quiet traces in calculation and aggregation. This deep dive follows IS NULL, COALESCE, and COUNT to build criteria for verifying SQL answers made by AI.',
    featuredDescriptionFallback: 'The absence of a value leaves quiet traces in calculation and aggregation. This record organizes the meaning and verification criteria of SQL NULL.',
    readDeepDive: 'Read Deep Dive',
    latestEyebrow: 'Latest Archive',
    latestTitle: "Today's questions, tomorrow's understanding.",
    latestDescription: 'Concepts, mistakes, thoughts, and observations are left as records that can be opened again.',
    archiveAll: 'View All Archive',
    manifestoEyebrow: 'Manifesto',
    manifestoLead: ['Even in an age when AI makes answers,', 'people still need to understand and verify them.'],
    manifestoBody: ['Dechive records the understanding found through books, documents, and AI', 'so it can be opened again later.', '', 'The writing here is not a quick summary.', 'It becomes knowledge that can withstand the next question.'],
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
  const featuredHref = featuredPost
    ? `${archiveRootHref}/${featuredPost.slug}`
    : archiveRootHref;

  return (
    <main className="flex flex-1 flex-col bg-[#F8F6F1] text-[#111111]">
      <section className="relative isolate grid min-h-screen overflow-hidden border-b border-black/10 px-6 pt-16 pb-12 sm:px-10 lg:px-20">
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

        <div className="absolute top-6 right-6 z-20 sm:right-10 lg:right-20">
          <LangToggle tone="light" />
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

        <div className="absolute top-[26%] right-6 z-10 hidden max-w-68 bg-[#F8F6F1]/66 px-5 py-6 text-right shadow-[0_18px_60px_rgba(17,17,17,0.08)] backdrop-blur-sm sm:right-10 sm:max-w-xs sm:px-6 md:block lg:right-20">
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

          <div className="mt-7">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#6f461d] uppercase">
              {t.soloAgileLabel}
            </p>
            <p
              className={`mt-2 text-base leading-snug text-[#111111] ${heroSerifClassName}`}
            >
              {renderLines(t.soloAgile)}
            </p>
          </div>

          <div className="mt-8 ml-auto h-px w-16 bg-[#3a2416]/40" />

          <div className="mt-7">
            <p className="text-[11px] font-bold tracking-[0.22em] text-[#6f461d] uppercase">
              {t.archiveLabel}
            </p>
            <p
              className={`mt-2 text-base leading-snug text-[#111111] ${heroSerifClassName}`}
            >
              {renderLines(t.archive)}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 px-6 py-24 sm:px-10 lg:px-20">
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

      <section className="border-b border-black/10 px-6 py-24 sm:px-10 lg:px-20">
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
                ? `${featuredPost.category} / ${featuredPost.subject || 'Archive'} / Verification`
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
                ? t.featuredDescriptionWithPost
                : t.featuredDescriptionFallback}
            </p>
            <Link
              href={featuredHref}
              className="mt-9 inline-flex border border-[#111111] px-6 py-3 text-sm font-semibold text-[#111111] transition-colors hover:border-[#B08D57] hover:text-[#7a5d2c]"
            >
              {t.readDeepDive}
            </Link>
          </article>
        </div>
      </section>

      <section className="border-b border-black/10 px-6 py-24 sm:px-10 lg:px-20">
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
                href={`${archiveRootHref}/${post.slug}`}
                className="grid gap-5 border-b border-black/15 py-7 transition-colors hover:bg-white/45 sm:grid-cols-[72px_1fr]"
              >
                <span className="text-sm font-semibold text-[#B08D57]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block text-xl font-semibold text-[#111111]">
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

      <section className="px-6 py-24 sm:px-10 lg:px-20">
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
