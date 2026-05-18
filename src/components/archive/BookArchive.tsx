'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Braces, ChevronDown, Compass, Database, Sparkles } from 'lucide-react';
import type { Post } from '@/types/archive';
import { useLang } from '@/components/layout/LangProvider';

interface BookArchiveProps {
  posts: Post[];
  serifFontClassName: string;
  sansFontClassName: string;
}

function formatDateParts(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return { day: date, month: '' };
  }

  const parts = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
  }).formatToParts(parsed);

  return {
    day: parts.find((part) => part.type === 'day')?.value ?? '',
    month: parts.find((part) => part.type === 'month')?.value.toUpperCase() ?? '',
  };
}

function getYear(date: string) {
  return date.slice(0, 4) || 'Unknown';
}

function groupPostsByYear(posts: Post[]) {
  return posts.reduce<Array<{ year: string; posts: Post[] }>>((groups, post) => {
    const year = getYear(post.date);
    const group = groups.find((item) => item.year === year);

    if (group) {
      group.posts.push(post);
    } else {
      groups.push({ year, posts: [post] });
    }

    return groups;
  }, []);
}

export default function BookArchive({
  posts,
  serifFontClassName,
  sansFontClassName,
}: BookArchiveProps) {
  const { lang } = useLang();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const indexCategories = [
    { label: 'AI', Icon: Sparkles },
    { label: 'DEV', Icon: Braces },
    { label: 'DATA', Icon: Database },
    { label: 'PRODUCT', Icon: Compass },
  ];
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category.toUpperCase() === selectedCategory)
    : posts;
  const groupedPosts = groupPostsByYear(filteredPosts);

  return (
    <section className={`relative min-h-[calc(100vh-5rem)] flex-1 overflow-visible bg-[#f8f6f1] text-[#17120d] lg:h-[calc(100vh-5rem)] lg:overflow-hidden ${sansFontClassName}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 right-0 h-96 w-96 rounded-full border border-[#b08d57]/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-24 right-24 h-[34rem] w-px bg-linear-to-b from-transparent via-[#b08d57]/20 to-transparent"
      />

      <div className="grid min-h-[calc(100vh-5rem)] lg:h-full lg:min-h-0 lg:grid-cols-[15.5rem_1fr] xl:grid-cols-[17rem_1fr]">
        <aside className="hidden h-full overflow-hidden border-r border-[#ded6c9] bg-[#f2eee6]/70 px-6 pt-8 pb-12 sm:px-7 lg:block lg:px-8">
          <div>
            <p className={`text-sm font-semibold tracking-[0.08em] text-[#8a6332] uppercase ${serifFontClassName}`}>
              Browse Archives
            </p>
            <div className="mt-6 flex w-14 items-center gap-1.5">
              <span className="h-px flex-1 bg-[#b08d57]/70" />
              <span className="h-1.5 w-1.5 rotate-45 border border-[#b08d57]/80" />
              <span className="h-px flex-1 bg-[#b08d57]/70" />
            </div>

            <div className="mt-10">
              <p className={`text-base font-semibold tracking-[0.03em] text-[#17120d] uppercase ${serifFontClassName}`}>
                Categories
              </p>
              <div className="mt-6 flex flex-col gap-5">
                {indexCategories.map(({ label, Icon }) => {
                  const isSelected = selectedCategory === label;

                  return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedCategory(label)}
                    className={`flex items-center gap-3 rounded-sm px-3 py-2 text-left text-[15px] leading-none transition-colors ${serifFontClassName} ${
                      isSelected
                        ? 'bg-[#e8e1d6] text-[#17120d] shadow-[inset_2px_0_0_#b08d57]'
                        : 'text-[#3f342b] hover:bg-[#ece6dc]/70 hover:text-[#17120d]'
                    }`}
                  >
                    <Icon
                      size={15}
                      strokeWidth={1.6}
                      className={isSelected ? 'text-[#6f461d]' : 'text-[#8a6332]'}
                    />
                    {label}
                  </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <div className="px-6 py-8 sm:px-8 lg:h-full lg:overflow-y-auto lg:px-14 lg:py-16 xl:px-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileCategoryOpen((open) => !open)}
                className={`flex w-full items-center justify-between border border-[#ded6c9] bg-[#f2eee6]/80 px-4 py-3 text-left text-sm font-semibold tracking-[0.12em] text-[#3f342b] uppercase ${serifFontClassName}`}
                aria-expanded={isMobileCategoryOpen}
              >
                <span>{selectedCategory ?? 'Categories'}</span>
                <ChevronDown
                  size={16}
                  strokeWidth={1.6}
                  className={`text-[#8a6332] transition-transform ${isMobileCategoryOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`${isMobileCategoryOpen ? 'grid' : 'hidden'} mt-2 gap-1 border border-[#ded6c9] bg-[#f8f6f1] p-2 shadow-[0_18px_50px_rgba(42,33,27,0.08)]`}>
                {indexCategories.map(({ label, Icon }) => {
                  const isSelected = selectedCategory === label;

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(label);
                        setIsMobileCategoryOpen(false);
                      }}
                      className={`flex items-center gap-3 rounded-sm px-3 py-3 text-left text-sm leading-none transition-colors ${serifFontClassName} ${
                        isSelected
                          ? 'bg-[#e8e1d6] text-[#17120d] shadow-[inset_2px_0_0_#b08d57]'
                          : 'text-[#3f342b] hover:bg-[#ece6dc]/70 hover:text-[#17120d]'
                      }`}
                    >
                      <Icon
                        size={13}
                        strokeWidth={1.6}
                        className={isSelected ? 'text-[#6f461d]' : 'text-[#8a6332]'}
                      />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-b border-[#ded6c9] pb-12">
              <p className={`max-w-xl text-2xl leading-snug text-[#2b2119] ${serifFontClassName}`}>
                {lang === 'en'
                  ? 'Records left from a single question.'
                  : '하나의 질문으로 남긴 기록들.'}
              </p>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#6f6257]">
                {lang === 'en' ? (
                  <>
                    Questions held between books, documents, code, and AI
                    <br />
                    are left as records that can be opened again.
                  </>
                ) : (
                  <>
                    책과 문서, 코드와 AI 사이에서 붙잡은 질문을
                    <br />
                    다시 꺼내볼 수 있는 기록으로 남깁니다.
                  </>
                )}
              </p>
            </div>

            <div className="pt-12">
                <div className="mt-10 flex flex-col gap-14">
                  {groupedPosts.length > 0 ? groupedPosts.map((group) => (
                    <section key={group.year}>
                      <h3 className={`text-4xl font-medium tracking-[-0.03em] text-[#17120d] ${serifFontClassName}`}>
                        {group.year}
                      </h3>
                      <div className="mt-6 divide-y divide-[#ded6c9] border-t border-[#ded6c9]">
                        {group.posts.map((post) => {
                          const date = formatDateParts(post.date);

                          return (
                          <Link
                            key={post.slug}
                            href={post.lang === 'en' ? `/en/archive/${post.slug}` : `/archive/${post.slug}`}
                            className="grid gap-4 py-7 transition-colors hover:bg-white/45 md:grid-cols-[4.5rem_1fr]"
                          >
                          <span className={`flex flex-col items-center text-[#8a6332] ${serifFontClassName}`}>
                            <span className="text-3xl leading-none font-medium tracking-[-0.03em]">
                              {date.day}
                            </span>
                            <span className="mt-1 text-xs font-semibold tracking-[0.14em]">
                              {date.month}
                            </span>
                          </span>
                          <span>
                            <span className={`block text-2xl leading-snug text-[#17120d] ${serifFontClassName}`}>
                              {post.seoTitle ?? post.title}
                              </span>
                              <span className="mt-3 block max-w-3xl text-sm leading-7 text-[#6f6257]">
                                {post.description}
                              </span>
                            </span>
                          </Link>
                          );
                        })}
                      </div>
                    </section>
                  )) : (
                    <p className="border-t border-[#ded6c9] pt-8 text-sm text-[#6f6257]">
                      {lang === 'en'
                        ? 'No records in this category yet.'
                        : '이 카테고리에는 아직 기록이 없습니다.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}
