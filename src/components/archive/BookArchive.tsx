'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import type { Post } from '@/types/archive';
import { useLang } from '@/components/layout/LangProvider';

const ARCHIVE_HERO_IMAGE = '/images/archive/image.webp';

interface BookArchiveProps {
  posts: Post[];
  serifFontClassName: string;
  sansFontClassName: string;
}

function getYear(date: string) {
  return date.slice(0, 4) || 'Unknown';
}

export default function BookArchive({
  posts,
  serifFontClassName,
  sansFontClassName,
}: BookArchiveProps) {
  const { lang } = useLang();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const discoveredCategories = Array.from(
    new Set(posts.map((post) => post.category.toUpperCase()).filter(Boolean)),
  );
  const preferredCategories = ['AI', 'DATA', 'PRODUCT', 'CULTURE', 'WORK'];
  const indexCategories = [
    ...preferredCategories.filter((category) => discoveredCategories.includes(category)),
    ...discoveredCategories.filter((category) => !preferredCategories.includes(category)),
  ];
  const years = Array.from(new Set(posts.map((post) => getYear(post.date))));
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category.toUpperCase() === selectedCategory)
    : posts;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visiblePosts = filteredPosts.filter((post) => {
    const matchesYear = selectedYear === 'all' || getYear(post.date) === selectedYear;
    const searchableText = [post.title, post.seoTitle, post.description, post.category].filter(
      (value): value is string => Boolean(value),
    );
    const matchesSearch =
      !normalizedQuery ||
      searchableText.some((value) => value.toLowerCase().includes(normalizedQuery));

    return matchesYear && matchesSearch;
  });
  const allButtonLabel = lang === 'en' ? 'ALL' : '전체';

  return (
    <section
      className={`relative min-h-[calc(100vh-4.5rem)] flex-1 bg-[#f5f5f2] text-[#181716] ${sansFontClassName}`}
    >
      <div className="mx-auto w-full max-w-[92rem] px-5 pb-10 sm:px-8 lg:px-10">
        <section className="relative grid overflow-hidden border-b border-[#d8d6d0] bg-white/50 lg:min-h-[430px] lg:grid-cols-[0.38fr_0.62fr]">
          <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.26em] text-[#8a6a3a] uppercase">
                WELCOME TO THE READING ROOM
              </p>
              <h1
                className={`mt-7 max-w-xl text-[2.45rem] leading-[1.18] font-medium tracking-[-0.04em] text-[#181716] sm:text-5xl lg:text-[3.8rem] ${lang === 'en' ? 'lg:max-w-none lg:text-[3.35rem]' : ''} ${serifFontClassName}`}
              >
                {lang === 'en' ? (
                  <>
                    Good questions
                    <br />
                    change thought.
                  </>
                ) : (
                  <>
                    좋은 질문은
                    <br />
                    생각을 바꿉니다.
                  </>
                )}
              </h1>
              <p className="mt-6 max-w-md text-sm leading-7 text-[#6b6863] sm:text-[15px]">
                {lang === 'en' ? (
                  <>
                    DECHIVE begins with one question
                    <br className="hidden sm:block" />
                    and keeps it as a record of reasoning that can be checked again.
                  </>
                ) : (
                  <>
                    DECHIVE는 하나의 질문에서 시작해,
                    <br className="hidden sm:block" />
                    다시 확인할 수 있는 추론의 기록으로 남깁니다.
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="relative min-h-[245px] sm:min-h-[330px] lg:min-h-0">
            <Image
              src={ARCHIVE_HERO_IMAGE}
              alt={lang === 'en' ? 'Dechive archive reading room visual' : 'Dechive 아카이브 열람실 비주얼'}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </section>

        <section className="relative z-20 mx-auto -mt-8 max-w-[76rem] overflow-hidden rounded-md border border-[#d8d6d0] bg-white/82 shadow-[0_24px_70px_rgba(24,23,22,0.08)] backdrop-blur-sm">
          <div className="flex flex-col gap-4 border-b border-[#d8d6d0] px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`rounded-sm border px-3 py-2 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors ${
                    selectedCategory === null
                      ? 'border-[#181716] bg-[#181716] text-[#f5f5f2]'
                      : 'border-[#d8d6d0] text-[#6b6863] hover:border-[#8a6a3a]/60 hover:text-[#181716]'
                  }`}
                >
                  {allButtonLabel}
                </button>
                {indexCategories.map((label) => {
                  const isSelected = selectedCategory === label;

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setSelectedCategory(label)}
                      className={`rounded-sm border px-3 py-2 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors ${
                        isSelected
                          ? 'border-[#181716] bg-[#181716] text-[#f5f5f2]'
                          : 'border-[#d8d6d0] text-[#6b6863] hover:border-[#8a6a3a]/60 hover:text-[#181716]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className="h-9 rounded-sm border border-[#d8d6d0] bg-white/70 px-3 text-[11px] font-semibold tracking-[0.16em] text-[#181716] uppercase outline-none transition-colors hover:border-[#8a6a3a]/60"
                aria-label={lang === 'en' ? 'Select year' : '연도 선택'}
              >
                <option value="all">{lang === 'en' ? 'ALL YEARS' : '전체 연도'}</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <label className="relative block sm:w-64">
                <span className="sr-only">
                  {lang === 'en' ? 'Search archive records' : '아카이브 기록 검색'}
                </span>
                <Search
                  size={14}
                  strokeWidth={1.7}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#8a6a3a]"
                />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={lang === 'en' ? 'Search questions' : '질문 검색'}
                  className="h-9 w-full rounded-sm border border-[#d8d6d0] bg-white/70 pr-3 pl-9 text-sm text-[#181716] outline-none transition-colors placeholder:text-[#6b6863]/70 hover:border-[#8a6a3a]/60 focus:border-[#8a6a3a]"
                />
              </label>
            </div>
          </div>

          <div id="archive-records" className="px-5 py-6 sm:px-7 lg:px-8 lg:py-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.24em] text-[#8a6a3a] uppercase">
                  Latest Questions
                </p>
                <h2 className={`mt-2 text-2xl font-medium text-[#181716] sm:text-3xl ${serifFontClassName}`}>
                  {lang === 'en' ? 'Question Records' : '질문 기록'}
                </h2>
              </div>
              <p className="text-sm text-[#6b6863]">
                {lang === 'en' ? `${visiblePosts.length} records` : `${visiblePosts.length}개의 기록`}
              </p>
            </div>

            {visiblePosts.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-3">
                {visiblePosts.map((post, index) => {
                  const isFeatured = index === 0;

                  return (
                    <Link
                      key={post.slug}
                      href={
                        post.lang === 'en'
                          ? `/en/archive/${post.slug}`
                          : `/archive/${post.slug}`
                      }
                      className={`group relative overflow-hidden rounded-md border border-[#e4e1da] bg-[#fffdf8]/78 transition-colors hover:border-[#c9b894] hover:bg-white ${
                        isFeatured ? 'lg:col-span-2 lg:grid lg:grid-cols-[1fr_0.55fr]' : ''
                      }`}
                    >
                      <span className="flex min-h-[13rem] flex-col p-5 sm:p-6">
                        <span className="flex items-center gap-5 text-[10px] font-semibold tracking-[0.18em] text-[#8a6a3a] uppercase">
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <span>{post.category}</span>
                        </span>
                        <span
                          className={`mt-5 block text-[1.35rem] leading-snug font-medium text-[#181716] transition-colors group-hover:text-[#8a6a3a] ${serifFontClassName}`}
                        >
                          {post.seoTitle ?? post.title}
                        </span>
                        <span className="mt-4 block max-w-xl text-sm leading-7 text-[#6b6863]">
                          {post.description}
                        </span>
                        <span className="mt-auto flex items-end justify-between gap-4 pt-7">
                          <span className="text-xs tracking-[0.08em] text-[#6b6863]">
                            {post.date.replaceAll('-', '.')}
                          </span>
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d8d6d0] text-[#8a6a3a] transition-colors group-hover:border-[#181716] group-hover:bg-[#181716] group-hover:text-[#fffdf8]">
                            <ArrowUpRight size={16} strokeWidth={1.6} />
                          </span>
                        </span>
                      </span>

                      {isFeatured ? (
                        <span className="relative hidden min-h-full border-l border-[#e4e1da] lg:block">
                          <Image
                            src={ARCHIVE_HERO_IMAGE}
                            alt=""
                            fill
                            sizes="24rem"
                            className="object-cover object-center opacity-80 grayscale"
                          />
                          <span className="absolute inset-0 bg-white/15" />
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="border-t border-[#d8d6d0] pt-8 text-sm text-[#6b6863]">
                {lang === 'en'
                  ? 'No records in this category yet.'
                  : '이 조건에 맞는 기록이 없습니다.'}
              </p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
