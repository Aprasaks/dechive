'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock, FileText } from 'lucide-react';

export interface DeepDivePost {
  slug: string;
  title: string;
  meta: string;
  description: string;
  image: string;
  tags: string[];
  date: string;
  readingTime: number;
}

interface DeepDiveLandingProps {
  basePath: string;
  deepDives: DeepDivePost[];
  serifFontClassName: string;
  sansFontClassName: string;
}

const fallbackDeepDives: DeepDivePost[] = [
  {
    slug: 'ai-era-agile-verification',
    title: 'Agile은 속도가 아니라 방향을 검증하는 방식이다',
    meta: 'Product · Agile',
    description: 'AI가 구현 속도를 높이는 시대에도 Agile이 왜 필요한지, 방향 검증의 방식으로 정리합니다.',
    image: '/images/posts/ai-era-agile-cover.webp',
    tags: ['Agile', 'AI', 'Verification'],
    date: '2026-06-22',
    readingTime: 12,
  },
];

function formatDisplayDate(date: string) {
  return date.replaceAll('-', '.');
}

function getSafeTags(tags: string[]) {
  if (!Array.isArray(tags)) return [];

  return tags
    .filter((tag): tag is string => typeof tag === 'string')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function DeepDiveLanding({
  basePath,
  deepDives,
  serifFontClassName,
  sansFontClassName,
}: DeepDiveLandingProps) {
  const isEnglish = basePath.startsWith('/en');
  const visibleDeepDives = deepDives.length > 0 ? deepDives : fallbackDeepDives;
  const [featuredDeepDive, ...otherDeepDives] = visibleDeepDives;
  const copy = isEnglish
    ? {
        title: 'Questions taken further.',
        body: 'A longer path through one question: evidence, limits, reasoning, and what can be verified.',
        featuredMeta: 'Start here',
        read: 'Read',
        latest: 'More to read',
        minRead: 'min read',
      }
    : {
        title: '질문을 끝까지 밀고 가는 기록.',
        body: '하나의 질문을 근거, 한계, 추론, 검증 가능한 판단까지 길게 따라갑니다.',
        featuredMeta: '먼저 읽기',
        read: '읽기',
        latest: '이어 읽을 기록',
        minRead: '분 읽기',
      };

  return (
    <section className={`relative flex min-h-[calc(100vh-4.5rem)] flex-1 overflow-hidden bg-[#030303] text-[#f3eadb] ${sansFontClassName}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(246,210,155,0.08),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(127,198,192,0.055),transparent_28%),linear-gradient(180deg,#030303_0%,#050505_58%,#030303_100%)]"
      />

      <div className="relative mx-auto w-full max-w-[92rem] px-4 pt-12 pb-12 sm:px-6 lg:px-8 lg:pt-16">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(22rem,0.62fr)] lg:items-end">
          <div>
            <h1 className={`max-w-3xl text-4xl leading-tight font-medium text-white sm:text-5xl lg:text-[3.55rem] ${serifFontClassName}`}>
              {copy.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#e8dfcd]/64">
              {copy.body}
            </p>
          </div>

          <div className="rounded-md border border-white/10 bg-[#080808]/82 p-5">
            <p className="text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
              {isEnglish ? 'Stored as essays' : '긴 글로 남긴 기록'}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#e8dfcd]/62">
              {isEnglish
                ? 'These are not quick answers. They are records that slow down, compare, and keep the reasoning visible.'
                : '빠른 답이 아니라, 잠시 멈춰 비교하고 판단의 과정을 보이게 남긴 기록입니다.'}
            </p>
          </div>
        </section>

        <section className="mt-10">
          <Link
            href={`${basePath}/${featuredDeepDive.slug}`}
            className="group grid overflow-hidden rounded-md border border-white/10 bg-[#080808]/86 transition-colors hover:border-[#d7ad73]/38 hover:bg-[#101010] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b] lg:grid-cols-[0.92fr_1.08fr]"
          >
            <div className="relative min-h-[17rem] overflow-hidden lg:min-h-[30rem]">
              <Image
                src={featuredDeepDive.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 44rem, 100vw"
                className="object-cover object-center opacity-78 grayscale-[0.18] transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#030303]/76 via-[#030303]/18 to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-[#030303]/10 lg:to-[#030303]/62" />
            </div>

            <div className="flex min-h-full flex-col p-5 sm:p-7 lg:p-9">
              <p className="text-[10px] font-semibold tracking-[0.24em] text-[#d7ad73] uppercase">
                {copy.featuredMeta}
              </p>
              <p className="mt-4 text-xs font-medium tracking-[0.12em] text-[#e8dfcd]/46 uppercase">
                {featuredDeepDive.meta} · {formatDisplayDate(featuredDeepDive.date)}
              </p>
              <h2 className={`mt-5 max-w-3xl text-3xl leading-tight font-medium text-white transition-colors group-hover:text-[#f6d29b] sm:text-4xl lg:text-[3.1rem] ${serifFontClassName}`}>
                {featuredDeepDive.title}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#e8dfcd]/64 sm:text-base sm:leading-8">
                {featuredDeepDive.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {getSafeTags(featuredDeepDive.tags).slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-[#e8dfcd]/68"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                <span className="inline-flex items-center gap-2 text-sm text-[#e8dfcd]/52">
                  <Clock size={15} strokeWidth={1.6} />
                  {featuredDeepDive.readingTime} {copy.minRead}
                </span>
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-[#f6d29b] uppercase">
                  {copy.read}
                  <ArrowUpRight size={16} strokeWidth={1.7} />
                </span>
              </div>
            </div>
          </Link>
        </section>

        {otherDeepDives.length > 0 ? (
          <section className="mt-12">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
                {copy.latest}
              </h2>
              <p className="text-sm text-[#e8dfcd]/46">
                {visibleDeepDives.length} docs
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {otherDeepDives.map((deepDive) => (
                <Link
                  key={deepDive.slug}
                  href={`${basePath}/${deepDive.slug}`}
                  className="group overflow-hidden rounded-md border border-white/10 bg-[#080808]/86 transition-colors hover:border-[#d7ad73]/38 hover:bg-[#101010] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={deepDive.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 30rem, (min-width: 768px) 50vw, 100vw"
                      className="object-cover object-center opacity-72 grayscale-[0.22] transition duration-500 group-hover:scale-[1.04] group-hover:opacity-88"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#030303]/70 via-transparent to-transparent" />
                  </div>

                  <div className="flex min-h-[18rem] flex-col p-5">
                    <div className="flex items-center justify-between gap-4 text-xs text-[#e8dfcd]/42">
                      <span className="inline-flex items-center gap-2">
                        <FileText size={14} strokeWidth={1.6} />
                        {deepDive.meta}
                      </span>
                      <span>{formatDisplayDate(deepDive.date)}</span>
                    </div>
                    <h3 className={`mt-5 text-2xl leading-tight font-medium text-white transition-colors group-hover:text-[#f6d29b] ${serifFontClassName}`}>
                      {deepDive.title}
                    </h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#e8dfcd]/60">
                      {deepDive.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {getSafeTags(deepDive.tags).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[11px] text-[#e8dfcd]/58"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-4 pt-7 text-sm">
                      <span className="inline-flex items-center gap-2 text-[#e8dfcd]/46">
                        <Clock size={14} strokeWidth={1.6} />
                        {deepDive.readingTime} {copy.minRead}
                      </span>
                      <ArrowUpRight
                        size={17}
                        strokeWidth={1.6}
                        className="text-[#f6d29b]/68 transition-transform group-hover:translate-x-1 group-hover:text-[#f6d29b]"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
