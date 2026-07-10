'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bookmark,
  ChevronDown,
  CircleDot,
  Command,
  Grid2X2,
  List,
  Search,
  Sparkles,
  Sun,
  Tag,
} from 'lucide-react';
import type { Post } from '@/types/archive';
import { useLang } from '@/components/layout/LangProvider';

interface BookArchiveProps {
  posts: Post[];
  serifFontClassName: string;
  sansFontClassName: string;
}

type SortMode = 'latest' | 'oldest';
type ViewMode = 'list' | 'grid';

const PAGE_SIZE = 8;

function formatDate(date: string) {
  return date.replaceAll('-', '.');
}

function getPostHref(post: Post) {
  return post.lang === 'en' ? `/en/archive/${post.slug}` : `/archive/${post.slug}`;
}

function getSafeLabels(values: Array<string | null | undefined>) {
  return values
    .filter((value): value is string => typeof value === 'string')
    .map((label) => label.trim())
    .filter(Boolean);
}

function getPostTags(post: Post) {
  return Array.isArray(post.tags) ? post.tags : [];
}

function getPostConcepts(post: Post) {
  return Array.isArray(post.concepts) ? post.concepts : [];
}

function getChipLabels(post: Post) {
  const labels = getSafeLabels([post.category, ...getPostTags(post), ...getPostConcepts(post)]);

  return Array.from(new Set(labels)).slice(0, 5);
}

function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage]);
  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);

  return Array.from(pages).sort((a, b) => a - b);
}

export default function BookArchive({
  posts,
  serifFontClassName,
  sansFontClassName,
}: BookArchiveProps) {
  const { lang } = useLang();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('latest');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentPage, setCurrentPage] = useState(1);

  const copy = {
    eyebrow: lang === 'en' ? 'Archive' : 'Archive',
    title: 'Questions do not disappear. They become records.',
    description:
      lang === 'en'
        ? 'Every record begins with one question. Dechive stores it as a unit of knowledge for future answers.'
        : '모든 기록은 하나의 질문에서 시작됩니다. Dechive는 그것을 나중에 다시 찾을 수 있는 지식으로 남깁니다.',
    sideTitle: lang === 'en' ? 'Each record stands on its own.' : '각 기록은 하나의 질문으로 남습니다.',
    sideBody:
      lang === 'en'
        ? 'Independent questions, stored over time. Dechive revisits them when answering later.'
        : '독립된 질문들이 시간 위에 저장되고, 나중에 다시 답할 때 Dechive 안에서 연결됩니다.',
    searchPlaceholder: lang === 'en' ? 'Search by question...' : '질문으로 기록 찾기...',
    ask: lang === 'en' ? 'Ask' : 'Ask',
    latest: lang === 'en' ? 'Latest first' : '최신순',
    oldest: lang === 'en' ? 'Oldest first' : '오래된순',
    empty:
      lang === 'en'
        ? 'No records match this question yet.'
        : '이 질문에 맞는 기록이 아직 없습니다.',
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredPosts = useMemo(() => {
    const matchedPosts = posts.filter((post) => {
      if (!normalizedQuery) return true;

      const searchableText = getSafeLabels([
        post.title,
        post.seoTitle,
        post.description,
        post.category,
        ...getPostTags(post),
        ...getPostConcepts(post),
      ]);

      return searchableText.some((value) => value.toLowerCase().includes(normalizedQuery));
    });

    return [...matchedPosts].sort((a, b) => {
      const diff = a.date.localeCompare(b.date);
      return sortMode === 'latest' ? -diff : diff;
    });
  }, [normalizedQuery, posts, sortMode]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * PAGE_SIZE;
  const visiblePosts = filteredPosts.slice(pageStart, pageStart + PAGE_SIZE);
  const pageNumbers = getPageNumbers(safeCurrentPage, totalPages);

  const setQuery = (nextQuery: string) => {
    setSearchQuery(nextQuery);
    setCurrentPage(1);
  };

  const setSort = (nextSortMode: SortMode) => {
    setSortMode(nextSortMode);
    setCurrentPage(1);
  };

  return (
    <section
      className={`relative min-h-[calc(100vh-4.5rem)] flex-1 overflow-hidden bg-[#030303] text-[#f3eadb] ${sansFontClassName}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(246,210,155,0.08),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(127,198,192,0.055),transparent_28%),linear-gradient(180deg,#030303_0%,#050505_52%,#030303_100%)]"
      />

      <div className="relative mx-auto w-full max-w-[92rem] px-4 pt-12 pb-10 sm:px-6 lg:px-8 lg:pt-16">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.26em] text-white/42 uppercase">
              {copy.eyebrow}
            </p>
            <h1 className={`mt-5 max-w-3xl text-4xl leading-tight font-medium text-white sm:text-5xl lg:text-[3.4rem] ${serifFontClassName}`}>
              {copy.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#e8dfcd]/66">
              {copy.description}
            </p>
          </div>

          <aside className="rounded-md border border-white/10 bg-[#080808]/82 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.2)]">
            <div className="grid grid-cols-[auto_1fr] gap-4">
              <Sun size={22} strokeWidth={1.6} className="mt-1 text-[#f6d29b]" />
              <div>
                <h2 className={`text-lg leading-snug text-white ${serifFontClassName}`}>
                  {copy.sideTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#e8dfcd]/62">
                  {copy.sideBody}
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-8">
          <form
            onSubmit={(event) => event.preventDefault()}
            className="flex min-h-15 items-center rounded-md border border-white/12 bg-[#070707]/86 shadow-[0_16px_50px_rgba(0,0,0,0.2)] transition-colors focus-within:border-[#d7ad73]/58"
          >
            <label htmlFor="archive-search" className="sr-only">
              {copy.searchPlaceholder}
            </label>
            <Search size={24} strokeWidth={1.6} className="ml-5 shrink-0 text-white/82" />
            <input
              id="archive-search"
              value={searchQuery}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent px-4 text-base text-white outline-none placeholder:text-[#e8dfcd]/34 sm:text-lg"
            />
            <div className="mr-3 hidden h-11 items-center overflow-hidden rounded-full border border-white/10 sm:flex">
              <button
                type="submit"
                className="inline-flex h-full items-center gap-2 border-r border-white/10 px-4 text-xs font-semibold tracking-[0.16em] text-[#f6d29b] uppercase transition-colors hover:bg-[#c89b62]/10"
              >
                <Sparkles size={16} strokeWidth={1.7} />
                {copy.ask}
              </button>
              <span className="inline-flex h-full items-center gap-2 px-4 text-xs text-white/50">
                <Command size={14} strokeWidth={1.6} />
                K
              </span>
            </div>
          </form>
        </section>

        <section className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#e8dfcd]/50">
            {lang === 'en' ? `${filteredPosts.length} records` : `${filteredPosts.length}개의 기록`}
          </p>
          <div className="flex items-center gap-3">
            <label className="relative block">
              <span className="sr-only">{lang === 'en' ? 'Sort records' : '정렬'}</span>
              <select
                value={sortMode}
                onChange={(event) => setSort(event.target.value as SortMode)}
                className="h-10 appearance-none rounded-md border border-white/10 bg-[#080808] pr-9 pl-4 text-sm text-[#e8dfcd]/62 outline-none transition-colors hover:border-[#d7ad73]/36 focus:border-[#d7ad73]/58"
              >
                <option value="latest">{copy.latest}</option>
                <option value="oldest">{copy.oldest}</option>
              </select>
              <ChevronDown
                size={16}
                strokeWidth={1.6}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#e8dfcd]/44"
              />
            </label>

            <div className="flex h-10 overflow-hidden rounded-md border border-white/10 bg-[#080808]">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`inline-flex w-12 items-center justify-center transition-colors ${
                  viewMode === 'list' ? 'bg-[#d7ad73]/12 text-[#f6d29b]' : 'text-white/44 hover:text-white'
                }`}
                aria-label={lang === 'en' ? 'List view' : '리스트 보기'}
              >
                <List size={18} strokeWidth={1.7} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex w-12 items-center justify-center border-l border-white/10 transition-colors ${
                  viewMode === 'grid' ? 'bg-[#d7ad73]/12 text-[#f6d29b]' : 'text-white/44 hover:text-white'
                }`}
                aria-label={lang === 'en' ? 'Grid view' : '그리드 보기'}
              >
                <Grid2X2 size={17} strokeWidth={1.7} />
              </button>
            </div>
          </div>
        </section>

        <section className="mt-4">
          {visiblePosts.length > 0 ? (
            <div className={`grid gap-3 ${viewMode === 'list' ? 'lg:grid-cols-2' : 'sm:grid-cols-2 xl:grid-cols-3'}`}>
              {visiblePosts.map((post) => {
                const chips = getChipLabels(post);

                return (
                  <Link
                    key={post.slug}
                    href={getPostHref(post)}
                    className="group relative rounded-md border border-white/10 bg-[#080808]/86 p-5 transition-colors hover:border-[#d7ad73]/42 hover:bg-[#101010] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b]"
                  >
                    <div className="flex min-h-[8.7rem] flex-col">
                      <div className="flex items-start justify-between gap-5">
                        <h2 className={`text-[1.35rem] leading-snug font-medium text-white transition-colors group-hover:text-[#f6d29b] ${serifFontClassName}`}>
                          {post.seoTitle ?? post.title}
                        </h2>
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 text-[#e8dfcd]/52 transition-colors group-hover:border-[#d7ad73]/36 group-hover:text-[#f6d29b]">
                          <Bookmark size={17} strokeWidth={1.6} />
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {chips.map((chip, index) => (
                          <span
                            key={`${post.slug}-${chip}`}
                            className="inline-flex h-8 items-center gap-2 rounded-md border border-[#d7ad73]/16 bg-[#d7ad73]/6 px-3 text-xs text-[#f6d29b]/82"
                          >
                            {index === 0 ? (
                              <Tag size={14} strokeWidth={1.6} />
                            ) : (
                              <CircleDot size={13} strokeWidth={1.6} />
                            )}
                            {chip}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                        <time dateTime={post.date} className="text-xs tracking-[0.08em] text-[#e8dfcd]/42">
                          {formatDate(post.date)}
                        </time>
                        <ArrowRight
                          size={16}
                          strokeWidth={1.6}
                          className="text-[#f6d29b]/60 transition-transform group-hover:translate-x-1 group-hover:text-[#f6d29b]"
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="rounded-md border border-white/10 bg-[#080808]/86 px-5 py-10 text-sm text-[#e8dfcd]/62">
              {copy.empty}
            </p>
          )}
        </section>

        {totalPages > 1 ? (
          <nav className="mt-6 flex items-center justify-center gap-2" aria-label={lang === 'en' ? 'Archive pagination' : '아카이브 페이지'}>
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
              disabled={safeCurrentPage === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-[#e8dfcd]/50 transition-colors hover:border-[#d7ad73]/36 hover:text-white disabled:pointer-events-none disabled:opacity-35"
              aria-label={lang === 'en' ? 'Previous page' : '이전 페이지'}
            >
              ‹
            </button>
            {pageNumbers.map((pageNumber, index) => {
              const previousPage = pageNumbers[index - 1];
              const shouldShowGap = previousPage && pageNumber - previousPage > 1;

              return (
                <span key={pageNumber} className="inline-flex items-center gap-2">
                  {shouldShowGap ? <span className="text-sm text-[#e8dfcd]/38">...</span> : null}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm transition-colors ${
                      safeCurrentPage === pageNumber
                        ? 'border-[#d7ad73]/50 bg-[#d7ad73]/12 text-[#f6d29b]'
                        : 'border-white/10 text-[#e8dfcd]/50 hover:border-[#d7ad73]/36 hover:text-white'
                    }`}
                  >
                    {pageNumber}
                  </button>
                </span>
              );
            })}
            <button
              type="button"
              onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
              disabled={safeCurrentPage === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-[#e8dfcd]/50 transition-colors hover:border-[#d7ad73]/36 hover:text-white disabled:pointer-events-none disabled:opacity-35"
              aria-label={lang === 'en' ? 'Next page' : '다음 페이지'}
            >
              ›
            </button>
          </nav>
        ) : null}
      </div>
    </section>
  );
}
