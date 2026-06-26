'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  Boxes,
  CircleAlert,
  Database,
  FileSearch,
  FlaskConical,
  Layers3,
  PackageCheck,
  Sparkles,
} from 'lucide-react';

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

type LensKey = 'all' | 'concept' | 'case' | 'failure' | 'verification' | 'product' | 'ai' | 'data';

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

function matchesLens(deepDive: DeepDivePost, lens: LensKey) {
  if (lens === 'all') return true;

  const searchText = [deepDive.meta, deepDive.title, deepDive.description, ...deepDive.tags]
    .join(' ')
    .toLowerCase();
  const patterns: Record<Exclude<LensKey, 'all'>, string[]> = {
    concept: ['concept', '개념', '원리', 'prompt', 'context', 'scrum', 'agile'],
    case: ['case', 'example', '사례', '예시', 'ga4'],
    failure: ['failure', 'mistake', 'trap', '실수', '실패', '오해', '한계'],
    verification: ['verification', '검증', 'criteria', '기준'],
    product: ['product', '제품', 'saas', 'agile'],
    ai: ['ai', 'gpt', 'prompt', 'context', 'agent'],
    data: ['data', '데이터', 'ga4', 'sql', 'analysis'],
  };

  return patterns[lens].some((pattern) => searchText.includes(pattern));
}

export default function DeepDiveLanding({
  basePath,
  deepDives,
  serifFontClassName,
  sansFontClassName,
}: DeepDiveLandingProps) {
  const [selectedLens, setSelectedLens] = useState<LensKey>('all');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const isEnglish = basePath.startsWith('/en');
  const visibleDeepDives = deepDives.length > 0 ? deepDives : fallbackDeepDives;
  const featuredDeepDive = visibleDeepDives[featuredIndex] ?? visibleDeepDives[0];
  const filteredDeepDives = visibleDeepDives.filter((deepDive) => matchesLens(deepDive, selectedLens));
  const copy = isEnglish
    ? {
        heroTitle: 'Documents that carry one deep question to the end.',
        heroBody: 'Deep Dive follows one question through concepts, context, examples, mistakes, limits, and verification criteria.',
        guide: 'View Deep Dive guide',
        featured: 'FEATURED DOSSIER',
        read: 'Read Deep Dive',
        lens: 'Explore by Lens',
        all: 'All Deep Dives',
        noResult: 'No dossiers in this lens yet.',
        minRead: 'min read',
      }
    : {
        heroTitle: '하나의 깊은 질문을\n끝까지 밀고 가는 문서들.',
        heroBody: 'Deep Dive는 개념, 배경, 예시, 실수, 한계, 검증 기준까지 하나의 질문을 끝까지 추적한 심층 문서입니다.',
        guide: 'Deep Dive 가이드 보기',
        featured: 'FEATURED DOSSIER',
        read: 'Read Deep Dive',
        lens: 'Explore by Lens',
        all: 'All Deep Dives',
        noResult: '이 Lens에 해당하는 문서가 아직 없습니다.',
        minRead: '분 읽기',
      };
  const lenses: Array<{ key: LensKey; label: string; Icon: typeof FileSearch }> = [
    { key: 'concept', label: 'Concept', Icon: Layers3 },
    { key: 'case', label: 'Case', Icon: Boxes },
    { key: 'failure', label: 'Failure', Icon: CircleAlert },
    { key: 'verification', label: 'Verification', Icon: FileSearch },
    { key: 'product', label: 'Product', Icon: PackageCheck },
    { key: 'ai', label: 'AI', Icon: Sparkles },
    { key: 'data', label: 'Data', Icon: Database },
    { key: 'all', label: isEnglish ? 'All' : '전체 보기', Icon: FlaskConical },
  ];
  const featuredTags = featuredDeepDive.tags.length > 0
    ? featuredDeepDive.tags
    : ['Verification', 'AI', 'Product'];

  useEffect(() => {
    if (visibleDeepDives.length <= 1) return undefined;

    setFeaturedIndex(Math.floor(Math.random() * visibleDeepDives.length));

    const timer = window.setInterval(() => {
      setFeaturedIndex((currentIndex) => (currentIndex + 1) % visibleDeepDives.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [visibleDeepDives.length]);

  return (
    <section className={`flex min-h-[calc(100vh-4.5rem)] flex-1 bg-[#f5f5f2] text-[#181716] ${sansFontClassName}`}>
      <div className="mx-auto w-full max-w-[92rem] px-5 pb-12 sm:px-8 lg:px-10">
        <section className="grid overflow-hidden border-b border-[#d8d6d0] bg-white/54 lg:min-h-[430px] lg:grid-cols-[0.42fr_0.58fr]">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
            <p className="text-[10px] font-semibold tracking-[0.28em] text-[#8a6a3a] uppercase">
              DEEP DIVE
            </p>
            <h1
              className={`mt-7 max-w-xl whitespace-pre-line text-[2.4rem] leading-[1.16] font-medium tracking-[-0.04em] text-[#181716] sm:text-5xl lg:text-[3.65rem] ${serifFontClassName}`}
            >
              {copy.heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#6b6863] sm:text-[15px]">
              {copy.heroBody}
            </p>
            <Link
              href="#deep-dive-dossiers"
              className="mt-8 inline-flex w-fit items-center gap-2 border-b border-[#8a6a3a]/60 pb-1 text-xs font-semibold tracking-[0.18em] text-[#181716] uppercase transition-colors hover:border-[#181716] hover:text-[#8a6a3a]"
            >
              {copy.guide}
              <ArrowUpRight size={14} strokeWidth={1.6} />
            </Link>
          </div>
          <div className="relative min-h-[250px] sm:min-h-[330px] lg:min-h-0">
            <Image
              src="/images/deep-dive/deep-dive-hero.webp"
              alt={isEnglish ? 'Dechive Deep Dive research dossier visual' : 'Dechive Deep Dive 심층 문서관 비주얼'}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-right"
            />
          </div>
        </section>

        <article className="relative z-10 mx-auto -mt-8 max-w-[76rem] overflow-hidden rounded-md border border-[#d8d6d0] bg-white/84 text-[#181716] shadow-[0_24px_64px_rgba(24,22,20,0.09)]">
          <Image
            src={featuredDeepDive.image}
            alt=""
            fill
            sizes="76rem"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-white/18" />
          <div className="relative min-h-[28rem] p-5 sm:p-7 lg:p-8">
            <div className="flex min-h-[25.5rem] max-w-2xl flex-col justify-center rounded-md border border-white/55 bg-white/58 px-6 py-8 shadow-[0_22px_70px_rgba(24,23,22,0.10)] backdrop-blur-md sm:px-8 lg:px-10">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.28em] text-[#c7a160] uppercase">
                {copy.featured}
              </p>
              <p className="mt-5 text-[11px] font-semibold tracking-[0.18em] text-[#6b6863] uppercase">
                {featuredDeepDive.meta} · Verification · Dossier
              </p>
              <h2 className={`mt-5 max-w-3xl text-3xl leading-tight font-medium tracking-[-0.04em] sm:text-4xl lg:text-5xl ${serifFontClassName}`}>
                {featuredDeepDive.title}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6b6863]">
                {featuredDeepDive.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {featuredTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#d8d6d0] px-3 py-1 text-xs text-[#6b6863]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`${basePath}/${featuredDeepDive.slug}`}
                className="mt-8 inline-flex items-center gap-3 rounded-sm border border-[#8a6a3a]/60 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#181716] uppercase transition-colors hover:border-[#181716] hover:bg-[#181716] hover:text-[#f5f5f2]"
              >
                {copy.read}
                <ArrowUpRight size={15} strokeWidth={1.7} />
              </Link>
              {visibleDeepDives.length > 1 ? (
                <div className="mt-7 flex items-center gap-2" aria-label="Featured dossier slides">
                  {visibleDeepDives.map((deepDive, index) => (
                    <button
                      key={deepDive.slug}
                      type="button"
                      onClick={() => setFeaturedIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        featuredIndex === index
                          ? 'w-8 bg-[#8a6a3a]'
                          : 'w-3 bg-[#d8d6d0] hover:bg-[#8a6a3a]/45'
                      }`}
                      aria-label={`${index + 1}: ${deepDive.title}`}
                      aria-pressed={featuredIndex === index}
                    />
                  ))}
                </div>
              ) : null}
            </div>
            </div>
          </div>
        </article>

        <section className="mx-auto mt-7 max-w-[76rem] rounded-md border border-[#d8d6d0] bg-white/74 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[10px] font-semibold tracking-[0.24em] text-[#8a6a3a] uppercase">
              {copy.lens}
            </p>
            <div className="flex flex-wrap gap-2">
              {lenses.map(({ key, label, Icon }) => {
                const isSelected = selectedLens === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedLens(key)}
                    className={`inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${
                      isSelected
                        ? 'border-[#181716] bg-[#181716] text-[#f5f5f2]'
                        : 'border-[#d8d6d0] text-[#6b6863] hover:border-[#8a6a3a]/60 hover:text-[#181716]'
                    }`}
                  >
                    <Icon size={13} strokeWidth={1.7} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section id="deep-dive-dossiers" className="mx-auto mt-10 max-w-[76rem]">
          <div className="mb-4 flex items-end justify-between border-b border-[#d8d6d0] pb-5">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.24em] text-[#8a6a3a] uppercase">
                {copy.all}
              </p>
              <h2 className={`mt-2 text-3xl font-medium text-[#181716] ${serifFontClassName}`}>
                Research Dossiers
              </h2>
            </div>
            <p className="text-sm text-[#6b6863]">
              {filteredDeepDives.length} docs
            </p>
          </div>

          <div className="divide-y divide-[#d8d6d0]">
            {filteredDeepDives.length > 0 ? (
              filteredDeepDives.map((deepDive, index) => (
                <Link
                  key={deepDive.slug}
                  href={`${basePath}/${deepDive.slug}`}
                  className="group grid gap-4 py-6 transition-colors hover:bg-white/55 sm:grid-cols-[3rem_1fr_auto]"
                >
                  <span className="text-xs font-semibold tracking-[0.18em] text-[#8a6a3a]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className={`block text-2xl leading-snug font-medium text-[#181716] transition-colors group-hover:text-[#8a6a3a] ${serifFontClassName}`}>
                      {deepDive.title}
                    </span>
                    <span className="mt-3 block max-w-3xl text-sm leading-7 text-[#6b6863]">
                      {deepDive.description}
                    </span>
                    <span className="mt-4 flex flex-wrap gap-2">
                      {deepDive.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="border border-[#d8d6d0] px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-[#6b6863] uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="flex items-center gap-5 text-sm text-[#6b6863] sm:justify-end">
                    <span>{formatDisplayDate(deepDive.date)}</span>
                    <span>
                      {deepDive.readingTime} {copy.minRead}
                    </span>
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.6}
                      className="text-[#8a6a3a] transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              ))
            ) : (
              <p className="py-8 text-sm text-[#6b6863]">{copy.noResult}</p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
