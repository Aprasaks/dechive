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
import DechiveSectionHeader from '@/components/layout/DechiveSectionHeader';

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
    <section className={`flex min-h-[calc(100vh-4.5rem)] flex-1 bg-[#050912] text-[#f3eadb] ${sansFontClassName}`}>
      <div className="mx-auto w-full max-w-[92rem] px-5 pb-12 sm:px-8 lg:px-10">
        <DechiveSectionHeader
          eyebrow={isEnglish ? 'Deep Dive · Verified concepts' : 'Deep Dive · 검증된 개념'}
          title={isEnglish ? 'Concepts examined beyond the first answer.' : '첫 답을 넘어 검증되는 개념들.'}
          description={
            isEnglish
              ? 'Follow the structure, evidence, mistakes, and limits behind an idea until it becomes reusable knowledge.'
              : '하나의 아이디어 뒤에 있는 구조, 근거, 실수, 한계를 따라가며 다시 쓸 수 있는 지식으로 만듭니다.'
          }
          meta={isEnglish ? 'Concepts · Evidence · Limits' : 'Concepts · Evidence · Verification'}
        />

        <article className="relative z-10 mx-auto -mt-8 max-w-[76rem] overflow-hidden rounded-md border border-[#f5ead5]/12 bg-[#0b1018] text-[#f3eadb] shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
          <Image
            src={featuredDeepDive.image}
            alt=""
            fill
            sizes="76rem"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#050912]/50" />
          <div className="relative min-h-[28rem] p-5 sm:p-7 lg:p-8">
            <div className="flex min-h-[25.5rem] max-w-2xl flex-col justify-center rounded-md border border-[#f5ead5]/14 bg-[#101722]/82 px-6 py-8 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-md sm:px-8 lg:px-10">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.28em] text-[#d7ad73] uppercase">
                {copy.featured}
              </p>
              <p className="mt-5 text-[11px] font-semibold tracking-[0.18em] text-[#e8dfcd]/50 uppercase">
                {featuredDeepDive.meta} · Verification · Dossier
              </p>
              <h2 className={`mt-5 max-w-3xl text-3xl leading-tight font-medium tracking-[-0.04em] sm:text-4xl lg:text-5xl ${serifFontClassName}`}>
                {featuredDeepDive.title}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#e8dfcd]/64">
                {featuredDeepDive.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {featuredTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#f5ead5]/12 bg-[#f5ead5]/5 px-3 py-1 text-xs text-[#e8dfcd]/68"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`${basePath}/${featuredDeepDive.slug}`}
                className="mt-8 inline-flex items-center gap-3 rounded-sm border border-[#c89b62]/45 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#f6d29b] uppercase transition-colors hover:border-[#c89b62]/70 hover:bg-[#c89b62]/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7fc6c0]"
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
                          ? 'w-8 bg-[#c89b62]'
                          : 'w-3 bg-[#f5ead5]/18 hover:bg-[#c89b62]/45'
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

        <section className="mx-auto mt-7 max-w-[76rem] rounded-md border border-[#f5ead5]/12 bg-[#0b1018]/94 px-4 py-4 shadow-[0_18px_55px_rgba(0,0,0,0.18)] sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[10px] font-semibold tracking-[0.24em] text-[#d7ad73] uppercase">
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
                        ? 'border-[#c89b62]/70 bg-[#c89b62]/16 text-[#f6d29b]'
                        : 'border-[#f5ead5]/12 text-[#e8dfcd]/62 hover:border-[#c89b62]/55 hover:text-[#f3eadb]'
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
          <div className="mb-4 flex items-end justify-between border-b border-[#f5ead5]/10 pb-5">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.24em] text-[#d7ad73] uppercase">
                {copy.all}
              </p>
              <h2 className={`mt-2 text-3xl font-medium text-[#f5ead5] ${serifFontClassName}`}>
                Research Dossiers
              </h2>
            </div>
            <p className="text-sm text-[#e8dfcd]/58">
              {filteredDeepDives.length} docs
            </p>
          </div>

          <div className="grid gap-3">
            {filteredDeepDives.length > 0 ? (
              filteredDeepDives.map((deepDive, index) => (
                <Link
                  key={deepDive.slug}
                  href={`${basePath}/${deepDive.slug}`}
                  className="group grid gap-4 rounded-md border border-[#f5ead5]/10 bg-[#101722]/82 p-5 transition-colors hover:border-[#c89b62]/42 hover:bg-[#121c28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7fc6c0] sm:grid-cols-[3rem_1fr_auto]"
                >
                  <span className="text-xs font-semibold tracking-[0.18em] text-[#d7ad73]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className={`block text-2xl leading-snug font-medium text-[#f5ead5] transition-colors group-hover:text-[#f6d29b] ${serifFontClassName}`}>
                      {deepDive.title}
                    </span>
                    <span className="mt-3 block max-w-3xl text-sm leading-7 text-[#e8dfcd]/62">
                      {deepDive.description}
                    </span>
                    <span className="mt-4 flex flex-wrap gap-2">
                      {deepDive.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="border border-[#f5ead5]/12 bg-[#f5ead5]/5 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-[#e8dfcd]/62 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="flex items-center gap-5 text-sm text-[#e8dfcd]/54 sm:justify-end">
                    <span>{formatDisplayDate(deepDive.date)}</span>
                    <span>
                      {deepDive.readingTime} {copy.minRead}
                    </span>
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.6}
                      className="text-[#7fc6c0] transition-transform group-hover:translate-x-1 group-hover:text-[#f6d29b]"
                    />
                  </span>
                </Link>
              ))
            ) : (
              <p className="py-8 text-sm text-[#e8dfcd]/62">{copy.noResult}</p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
