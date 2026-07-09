'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import type { Post } from '@/types/archive';
import { useLang } from '@/components/layout/LangProvider';
import DechiveSectionHeader from '@/components/layout/DechiveSectionHeader';

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
      className={`relative min-h-[calc(100vh-4.5rem)] flex-1 bg-[#030303] text-[#f3eadb] ${sansFontClassName}`}
    >
      <div className="mx-auto w-full max-w-[92rem] px-5 pb-10 sm:px-8 lg:px-10">
        <DechiveSectionHeader
          eyebrow={lang === 'en' ? 'Archive · Verified records' : 'Archive · 검증된 기록'}
          title={lang === 'en' ? 'Records that become searchable memory.' : '검색 가능한 기억이 되는 기록들.'}
          description={
            lang === 'en'
              ? 'Questions, notes, and traces accumulate into a memory layer that Dechive can reconnect and verify later.'
              : '질문, 노트, 흔적이 Dechive 안에 축적되어 나중에 다시 연결하고 검증할 수 있는 기억의 층이 됩니다.'
          }
          meta={lang === 'en' ? 'Questions · Notes · Traces' : 'Questions · Notes · Verification'}
        />

        <section className="relative z-20 mx-auto -mt-8 max-w-[76rem] overflow-hidden rounded-md border border-[#f5ead5]/12 bg-[#070707]/96 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm">
          <div className="flex flex-col gap-4 border-b border-[#f5ead5]/10 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`rounded-sm border px-3 py-2 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors ${
                    selectedCategory === null
                      ? 'border-[#c89b62]/70 bg-[#c89b62]/16 text-[#f6d29b]'
                      : 'border-[#f5ead5]/12 text-[#e8dfcd]/62 hover:border-[#c89b62]/55 hover:text-[#f3eadb]'
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
                          ? 'border-[#c89b62]/70 bg-[#c89b62]/16 text-[#f6d29b]'
                          : 'border-[#f5ead5]/12 text-[#e8dfcd]/62 hover:border-[#c89b62]/55 hover:text-[#f3eadb]'
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
                className="h-9 rounded-sm border border-[#f5ead5]/14 bg-[#090909] px-3 text-[11px] font-semibold tracking-[0.16em] text-[#f3eadb] uppercase outline-none transition-colors hover:border-[#c89b62]/60 focus:border-[#f6d29b]/70"
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
                  className="h-9 w-full rounded-sm border border-[#f5ead5]/14 bg-[#090909] pr-3 pl-9 text-sm text-[#f3eadb] outline-none transition-colors placeholder:text-[#e8dfcd]/38 hover:border-[#c89b62]/60 focus:border-[#f6d29b]/70"
                />
              </label>
            </div>
          </div>

          <div id="archive-records" className="px-5 py-6 sm:px-7 lg:px-8 lg:py-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.24em] text-[#d7ad73] uppercase">
                  Latest Questions
                </p>
                <h2 className={`mt-2 text-2xl font-medium text-[#f5ead5] sm:text-3xl ${serifFontClassName}`}>
                  {lang === 'en' ? 'Question Records' : '질문 기록'}
                </h2>
              </div>
              <p className="text-sm text-[#e8dfcd]/58">
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
                      className={`group relative overflow-hidden rounded-md border border-[#f5ead5]/12 bg-[#090909]/92 transition-colors hover:border-[#c89b62]/45 hover:bg-[#101010] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b] ${
                        isFeatured ? 'lg:col-span-2 lg:grid lg:grid-cols-[1fr_0.55fr]' : ''
                      }`}
                    >
                      <span className="flex min-h-[13rem] flex-col p-5 sm:p-6">
                        <span className="flex items-center gap-5 text-[10px] font-semibold tracking-[0.18em] text-[#d7ad73] uppercase">
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <span>{post.category}</span>
                        </span>
                        <span
                          className={`mt-5 block text-[1.35rem] leading-snug font-medium text-[#f5ead5] transition-colors group-hover:text-[#f6d29b] ${serifFontClassName}`}
                        >
                          {post.seoTitle ?? post.title}
                        </span>
                        <span className="mt-4 block max-w-xl text-sm leading-7 text-[#e8dfcd]/62">
                          {post.description}
                        </span>
                        <span className="mt-auto flex items-end justify-between gap-4 pt-7">
                          <span className="text-xs tracking-[0.08em] text-[#e8dfcd]/48">
                            {post.date.replaceAll('-', '.')}
                          </span>
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f5ead5]/12 text-[#f6d29b] transition-colors group-hover:border-[#c89b62]/55 group-hover:bg-[#c89b62]/12 group-hover:text-[#f6d29b]">
                            <ArrowUpRight size={16} strokeWidth={1.6} />
                          </span>
                        </span>
                      </span>

                      {isFeatured ? (
                        <span className="relative hidden min-h-full border-l border-[#f5ead5]/10 lg:block">
                          <Image
                            src={ARCHIVE_HERO_IMAGE}
                            alt=""
                            fill
                            sizes="24rem"
                            className="object-cover object-center opacity-45 grayscale"
                          />
                          <span className="absolute inset-0 bg-[#030303]/32" />
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="border-t border-[#f5ead5]/10 pt-8 text-sm text-[#e8dfcd]/62">
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
