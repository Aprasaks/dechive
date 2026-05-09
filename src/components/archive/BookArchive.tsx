'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { Post, Category, Subject } from '@/types/archive';
import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';

interface BookArchiveProps {
  posts: Post[];
  categories: Category[];
  subjects: Subject[];
  serifFontClassName: string;
  sansFontClassName: string;
}

const GOLD = '#ffffff';
const GOLD_DIM = 'rgba(255,255,255,0.3)';
const GOLD_FAINT = 'rgba(255,255,255,0.1)';
const PAGE_BG = 'rgba(10,8,5,0.60)';
const TEXT_ACTIVE = '#ffffff';
const TEXT_INACTIVE = '#d4d4d8';
const TEXT_LABEL = '#ffffff';
const ACTIVE_TEXT = '#fffbeb';
const ACTIVE_COUNT = 'rgba(253,230,138,0.72)';
const ACTIVE_BULLET = 'rgba(253,230,138,0.95)';
const ACTIVE_BG = 'rgba(253,230,138,0.05)';

function stripPrefix(title: string) {
  return title
    .replace(/^.+\s\d+편:\s*/, '')
    .replace(/^[\w\s]+(?:Episode|Vol\.)\s*\d+[:.]\s*/i, '')
    .replace(/^[\w\s]+Part\s+\d+:\s*/i, '');
}

function getMatchedTerms(value: string, terms: string[]) {
  const normalized = value.toLowerCase();
  return terms.filter((term) => normalized.includes(term));
}

function getSearchScore(post: Post, terms: string[]) {
  let score = 0;
  const title = post.title;
  const tags = post.tags.join(' ');
  const subject = post.subject ?? '';
  const description = post.description;
  const content = post.content;
  const category = post.category;

  if (getMatchedTerms(title, terms).length > 0) score += 100;
  if (getMatchedTerms(tags, terms).length > 0) score += 80;
  if (getMatchedTerms(subject, terms).length > 0) score += 60;
  if (getMatchedTerms(description, terms).length > 0) score += 40;
  if (getMatchedTerms(content, terms).length > 0) score += 20;
  if (getMatchedTerms(category, terms).length > 0) score += 10;

  return score;
}

function getMatchedTermCount(post: Post, terms: string[]) {
  const searchableText = [
    post.title,
    post.tags.join(' '),
    post.subject ?? '',
    post.description,
    post.content,
    post.category,
  ].join(' ').toLowerCase();

  return terms.filter((term) => searchableText.includes(term)).length;
}

function shouldIncludeSearchResult(score: number, matchedTermCount: number, totalTermCount: number) {
  if (score === 0) return false;
  if (totalTermCount === 1) return matchedTermCount >= 1;
  if (totalTermCount === 2) return matchedTermCount >= 2 || score >= 80;
  return matchedTermCount >= Math.ceil(totalTermCount / 2);
}

function searchPosts(posts: Post[], query: string) {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) return posts;

  return posts
    .map((post) => ({
      post,
      score: getSearchScore(post, terms),
      matchedTermCount: getMatchedTermCount(post, terms),
    }))
    .filter(({ score, matchedTermCount }) => shouldIncludeSearchResult(score, matchedTermCount, terms.length))
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      if (a.matchedTermCount !== b.matchedTermCount) {
        return b.matchedTermCount - a.matchedTermCount;
      }
      return a.post.date > b.post.date ? -1 : 1;
    })
    .map(({ post }) => post);
}

function RulingLines() {
  return (
    <div className="flex flex-col gap-[3px]">
      <div className="h-px" style={{ background: GOLD_DIM }} />
      <div className="h-px" style={{ background: GOLD_FAINT }} />
    </div>
  );
}

function Ornament() {
  return (
    <div className="flex items-center gap-2 my-1">
      <div className="flex-1 h-px" style={{ background: GOLD_FAINT }} />
      <span className="text-[10px]" style={{ color: GOLD_DIM }}>✦</span>
      <div className="flex-1 h-px" style={{ background: GOLD_FAINT }} />
    </div>
  );
}

export default function BookArchive({
  posts,
  categories,
  subjects,
  serifFontClassName,
  sansFontClassName,
}: BookArchiveProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobilePage, setMobilePage] = useState<'posts' | 'index'>('posts');
  const { lang } = useLang();
  const t = i18n[lang];

  const scopedPosts = posts
    .filter((p) => {
      const catMatch = selectedCategory === 'all' || p.category === selectedCategory;
      const subjectMatch = !selectedSubject || p.subject === selectedSubject;
      return catMatch && subjectMatch;
    })
    .sort((a, b) => {
      if (selectedSubject) return a.date < b.date ? -1 : 1;
      return a.date > b.date ? -1 : 1;
    });
  const normalizedSearchQuery = searchQuery.trim();
  const isSearching = normalizedSearchQuery.length > 0;
  const filtered = isSearching ? searchPosts(scopedPosts, normalizedSearchQuery) : scopedPosts;

  const isActive = (catId: string, subjectId = '') =>
    subjectId ? selectedSubject === subjectId : selectedCategory === catId && !selectedSubject;

  const visibleSubjects = selectedCategory === 'all'
    ? subjects
    : Array.from(
        posts
          .filter((post) => post.category === selectedCategory && post.subject)
          .reduce((countMap, post) => {
            const subject = post.subject;
            if (!subject) return countMap;
            countMap.set(subject, (countMap.get(subject) ?? 0) + 1);
            return countMap;
          }, new Map<string, number>()),
      ).map(([id, count]) => ({ id, label: id, count }));

  const selectedCategoryLabel = selectedCategory === 'all'
    ? t.allPosts
    : categories.find((category) => category.id === selectedCategory)?.label ?? selectedCategory;
  const inferredSubjectCategory = selectedSubject
    ? posts.find((post) => post.subject === selectedSubject)?.category
    : '';
  const scopeLabel = selectedSubject
    ? `${selectedCategory === 'all' ? inferredSubjectCategory || selectedCategoryLabel : selectedCategoryLabel} > ${selectedSubject}`
    : selectedCategoryLabel;
  const rangeLabel = lang === 'en'
    ? `${scopeLabel} contains ${filtered.length} record${filtered.length === 1 ? '' : 's'}`
    : `${scopeLabel} 안에서 ${filtered.length}개의 기록`;
  const rightPageTitle = isSearching
    ? `‘${normalizedSearchQuery}’ ${lang === 'en' ? 'search results' : '검색 결과'}`
    : selectedSubject || (selectedCategory === 'all' ? t.allPosts : selectedCategoryLabel);

  const BOOK_HEIGHT = '74vh';

  const pageStyle = {
    background: PAGE_BG,
    height: BOOK_HEIGHT,
  };

  return (
    <>
    {/* ── 모바일 전용 ── */}
    <div className={`flex flex-1 flex-col md:hidden px-4 py-4 ${sansFontClassName}`}>
      <div
        className="flex flex-col overflow-hidden flex-1"
        style={{
          background: 'rgba(8,6,4,0.85)',
          backdropFilter: 'blur(16px)',
          boxShadow: `0 20px 60px rgba(0,0,0,0.9), 0 0 0 1px ${GOLD_FAINT}`,
          borderRadius: '4px',
        }}
      >
        {/* 모바일 탭 헤더 */}
        <div className="flex shrink-0" style={{ borderBottom: `1px solid ${GOLD_FAINT}` }}>
          <button
            onClick={() => setMobilePage('index')}
            className="flex-1 py-3 text-xs tracking-widest uppercase transition-colors"
            style={{ color: mobilePage === 'index' ? TEXT_ACTIVE : TEXT_INACTIVE, borderBottom: mobilePage === 'index' ? `1px solid ${GOLD}` : 'none' }}
          >
            {t.categoryLabel}
          </button>
          <div style={{ width: '1px', background: GOLD_FAINT }} />
          <button
            onClick={() => setMobilePage('posts')}
            className="flex-1 py-3 text-xs tracking-widest uppercase transition-colors"
            style={{ color: mobilePage === 'posts' ? TEXT_ACTIVE : TEXT_INACTIVE, borderBottom: mobilePage === 'posts' ? `1px solid ${GOLD}` : 'none' }}
          >
            {t.allPosts}
          </button>
        </div>

        {/* 모바일 목차 페이지 */}
        {mobilePage === 'index' && (
          <div className="flex flex-col flex-1 overflow-y-auto px-5 py-5" style={{ scrollbarWidth: 'none' }}>
            <RulingLines />
            <div className="mt-5 mb-4">
              <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: TEXT_LABEL }}>{t.archiveLabel}</p>
              <h1 className={`text-2xl leading-tight ${serifFontClassName}`} style={{ color: TEXT_ACTIVE }}>{t.infiniteArchive}</h1>
            </div>
            <div className="mb-4">
              <label className="mb-3 block text-[10px] tracking-[0.35em] uppercase" style={{ color: 'rgba(255,255,255,0.62)' }}>
                Search
              </label>
              <div className="flex h-11 items-center gap-3 rounded-md border bg-black/25 px-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-sm" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
                <Search size={15} className="shrink-0 text-white/70" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={lang === 'en' ? 'Search by title, tag, or content' : '제목, 태그, 내용으로 찾아보기'}
                  className={`w-full bg-transparent text-sm text-white outline-none placeholder:text-white/60 ${sansFontClassName}`}
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
                {lang === 'en' ? `Current scope: ${scopeLabel}` : `현재 범위: ${scopeLabel}`}
              </p>
            </div>
            <Ornament />
            {/* 카테고리 */}
            <div className="flex flex-col mt-3 gap-0.5">
              <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: TEXT_LABEL }}>{t.categoryLabel}</p>
              {[{ id: 'all', label: t.allPosts, count: posts.length }, ...categories.filter(c => c.id !== 'all')].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSelectedSubject(''); setMobilePage('posts'); }}
                  className="text-left flex items-center justify-between rounded-sm px-2 py-2 text-sm transition-all"
                  style={{
                    color: isActive(cat.id) ? ACTIVE_TEXT : TEXT_INACTIVE,
                    background: isActive(cat.id) ? ACTIVE_BG : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: isActive(cat.id) ? ACTIVE_BULLET : TEXT_INACTIVE }} />
                    <span className={sansFontClassName}>{cat.label}</span>
                  </div>
                  <span className="text-xs" style={{ color: isActive(cat.id) ? ACTIVE_COUNT : TEXT_INACTIVE }}>{cat.count}</span>
                </button>
              ))}
            </div>
            {/* 주제 */}
            {visibleSubjects.length > 0 && (
              <>
                <Ornament />
                <div className="flex flex-col mt-1 gap-0.5">
                  <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: TEXT_LABEL }}>{t.subjectLabel}</p>
                  {visibleSubjects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedSubject(s.id); setMobilePage('posts'); }}
                      className="text-left flex items-center justify-between rounded-sm px-2 py-2 text-sm transition-all"
                      style={{
                        color: isActive('', s.id) ? ACTIVE_TEXT : TEXT_INACTIVE,
                        background: isActive('', s.id) ? ACTIVE_BG : 'transparent',
                      }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ background: isActive('', s.id) ? ACTIVE_BULLET : TEXT_INACTIVE }} />
                        <span className={`truncate ${sansFontClassName}`}>{s.label}</span>
                      </div>
                      <span className="text-xs shrink-0 ml-2" style={{ color: isActive('', s.id) ? ACTIVE_COUNT : TEXT_INACTIVE }}>{s.count}{t.recordCount}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            <div className="mt-auto pt-4"><Ornament /></div>
          </div>
        )}

        {/* 모바일 글 목록 페이지 */}
        {mobilePage === 'posts' && (
          <div className="flex flex-col flex-1 overflow-y-auto px-5 py-5" style={{ scrollbarWidth: 'none' }}>
            <RulingLines />
            <div className="mt-4 mb-4">
              <p className={`text-base leading-snug tracking-[0.12em] ${serifFontClassName}`} style={{ color: TEXT_ACTIVE }}>
                {rightPageTitle}
              </p>
              {isSearching && (
                <p className="mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  {rangeLabel}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-4">
              {filtered.length === 0 ? (
                <div className="mt-8 flex flex-col items-center text-center">
                  <p className={`text-base ${sansFontClassName}`} style={{ color: TEXT_INACTIVE }}>
                    {isSearching ? (lang === 'en' ? 'No records were found in this range yet.' : '이 범위에서는 아직 해당 기록을 찾지 못했습니다.') : t.noRecords}
                  </p>
                  {isSearching && (
                    <>
                      <p className="mt-2 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {lang === 'en'
                          ? 'Try another word, or open the search across all records.'
                          : '다른 단어로 찾거나, 전체 기록에서 다시 펼쳐보세요.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => { setSelectedCategory('all'); setSelectedSubject(''); }}
                        className="mt-5 rounded-md border bg-black/25 px-4 py-2 text-xs transition-colors hover:bg-black/40"
                        style={{ borderColor: 'rgba(255,255,255,0.18)', color: TEXT_ACTIVE }}
                      >
                        {lang === 'en' ? 'Search All Records' : '전체 기록에서 찾기'}
                      </button>
                    </>
                  )}
                </div>
              ) : (
                filtered.map((post, i) => (
                  <Link
                    key={post.slug}
                    href={post.lang === 'en' ? `/en/archive/${post.slug}` : `/archive/${post.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="text-xs mt-[5px] w-5 shrink-0 text-right font-light transition-colors group-hover:text-white" style={{ color: TEXT_INACTIVE }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex flex-col gap-0.5 border-b pb-3 flex-1 transition-colors group-hover:border-white/30" style={{ borderColor: GOLD_FAINT }}>
                      <span className={`text-sm leading-snug transition-all group-hover:text-white ${serifFontClassName}`} style={{ color: TEXT_ACTIVE }}>
                        {stripPrefix(post.title)}
                      </span>
                      <span className="text-[11px]" style={{ color: TEXT_INACTIVE }}>{post.date.slice(2).replace(/-/g, '.')}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <div className="mt-auto pt-4"><RulingLines /></div>
          </div>
        )}
      </div>
    </div>

    {/* ── 데스크탑 전용 ── */}
    <div className={`hidden md:flex flex-1 items-center justify-center px-2 py-4 ${sansFontClassName}`}>
      <div
        className="flex w-full max-w-6xl overflow-hidden"
        style={{
          height: BOOK_HEIGHT,
          boxShadow: `
            -8px 0 0 0 #0a0806,
            8px 0 0 0 #0a0806,
            0 40px 80px rgba(0,0,0,0.95),
            0 0 0 1px ${GOLD_FAINT}
          `,
          borderRadius: '2px',
        }}
      >
        {/* 왼쪽 표지 테두리 */}
        <div
          className="w-2 shrink-0 rounded-l-sm"
          style={{ background: 'linear-gradient(to right, #080603, #1a1208, #100d08)' }}
        />

        {/* 왼쪽 페이지 — 목차 */}
        <div
          className="flex-1 px-6 py-6 flex flex-col"
          style={{
            ...pageStyle,
            backdropFilter: 'blur(16px)',
            boxShadow: 'inset -6px 0 18px rgba(0,0,0,0.5), inset 0 0 60px rgba(0,0,0,0.45)',
          }}
        >
          <RulingLines />

          {/* 검색 */}
          <div className="mt-6 mb-5">
            <label className="mb-3 block text-[10px] tracking-[0.35em] uppercase" style={{ color: 'rgba(255,255,255,0.62)' }}>
              Search
            </label>
            <div className="mx-auto flex h-11 w-[92%] items-center gap-3 rounded-md border bg-black/25 px-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-sm" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
              <Search size={15} className="shrink-0 text-white/70" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={lang === 'en' ? 'Search by title, tag, or content' : '제목, 태그, 내용으로 찾아보기'}
                className={`w-full bg-transparent text-sm text-white outline-none placeholder:text-white/60 ${sansFontClassName}`}
              />
            </div>
            <p className="mx-auto mt-3 w-[92%] text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
              {lang === 'en' ? `Current scope: ${scopeLabel}` : `현재 범위: ${scopeLabel}`}
            </p>
          </div>

          <Ornament />

          {/* 카테고리 */}
          <div className="flex flex-col mt-3 gap-0.5">
            <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: TEXT_LABEL }}>
              {t.categoryLabel}
            </p>
            {[{ id: 'all', label: t.allPosts, count: posts.length }, ...categories.filter(c => c.id !== 'all')].map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setSelectedSubject(''); }}
                className="group text-left flex items-center justify-between rounded-sm px-2 py-2 text-sm transition-all"
                style={{
                  color: isActive(cat.id) ? ACTIVE_TEXT : TEXT_INACTIVE,
                  background: isActive(cat.id) ? ACTIVE_BG : 'transparent',
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{ background: isActive(cat.id) ? ACTIVE_BULLET : TEXT_INACTIVE }}
                  />
                  <span className={sansFontClassName}>{cat.label}</span>
                </div>
                <span className="text-xs" style={{ color: isActive(cat.id) ? ACTIVE_COUNT : TEXT_INACTIVE }}>{cat.count}</span>
              </button>
            ))}
          </div>

          {/* 주제 */}
          {visibleSubjects.length > 0 && (
            <>
              <Ornament />
              <div className="flex flex-col mt-1 gap-0.5">
                <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: TEXT_LABEL }}>
                  {t.subjectLabel}
                </p>
                {visibleSubjects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedSubject(s.id); }}
                    className="text-left flex items-center justify-between rounded-sm px-2 py-2 text-sm transition-all"
                    style={{
                      color: isActive('', s.id) ? ACTIVE_TEXT : TEXT_INACTIVE,
                      background: isActive('', s.id) ? ACTIVE_BG : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-1.5 h-1.5 shrink-0 rounded-full transition-all"
                        style={{ background: isActive('', s.id) ? ACTIVE_BULLET : TEXT_INACTIVE }}
                      />
                      <span className={`truncate ${sansFontClassName}`}>{s.label}</span>
                    </div>
                    <span className="text-[11px] shrink-0 ml-2" style={{ color: isActive('', s.id) ? ACTIVE_COUNT : TEXT_INACTIVE }}>{s.count}{t.recordCount}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* 하단 */}
          <div className="mt-auto">
            <Ornament />
            <div className="mt-4">
              <RulingLines />
            </div>
            <p className="text-center text-[10px] mt-3" style={{ color: TEXT_INACTIVE }}>Ⅰ</p>
          </div>
        </div>

        {/* 책 등(Spine) */}
        <div
          className="w-6 shrink-0 flex items-center justify-center"
          style={{
            background: 'linear-gradient(to right, #060402, #0f0b06, #161008, #0f0b06, #060402)',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.8)',
          }}
        >
          <div className="h-full w-px" style={{ background: `linear-gradient(to bottom, transparent, ${GOLD_DIM} 20%, ${GOLD_DIM} 80%, transparent)` }} />
        </div>

        {/* 오른쪽 페이지 — 글 목록 */}
        <div
          className="flex-1 px-6 py-6 flex flex-col"
          style={{
            ...pageStyle,
            backdropFilter: 'blur(16px)',
            boxShadow: 'inset 6px 0 18px rgba(0,0,0,0.4), inset 0 0 60px rgba(0,0,0,0.45)',
          }}
        >
          <RulingLines />


          <div className="mt-6 mb-5">
            <p className={`text-lg leading-snug tracking-[0.12em] ${serifFontClassName}`} style={{ color: TEXT_ACTIVE }}>
              {rightPageTitle}
            </p>
            {isSearching && (
              <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>
                {rangeLabel}
              </p>
            )}
          </div>

          {/* 포스트 목록 */}
          <div
            className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1"
            style={{ scrollbarWidth: 'none' }}
          >
            {filtered.length === 0 ? (
              <div className="mt-8 flex flex-col items-center text-center">
                <p className={`text-lg ${sansFontClassName}`} style={{ color: TEXT_INACTIVE }}>
                  {isSearching ? (lang === 'en' ? 'No records were found in this range yet.' : '이 범위에서는 아직 해당 기록을 찾지 못했습니다.') : t.noRecords}
                </p>
                {isSearching && (
                  <>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {lang === 'en'
                        ? 'Try another word, or open the search across all records.'
                        : '다른 단어로 찾거나, 전체 기록에서 다시 펼쳐보세요.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => { setSelectedCategory('all'); setSelectedSubject(''); }}
                      className="mt-5 rounded-md border bg-black/25 px-4 py-2 text-xs transition-colors hover:bg-black/40"
                      style={{ borderColor: 'rgba(255,255,255,0.18)', color: TEXT_ACTIVE }}
                    >
                      {lang === 'en' ? 'Search All Records' : '전체 기록에서 찾기'}
                    </button>
                  </>
                )}
              </div>
            ) : (
              filtered.map((post, i) => (
                <Link
                  key={post.slug}
                  href={post.lang === 'en' ? `/en/archive/${post.slug}` : `/archive/${post.slug}`}
                  className="flex items-start gap-3 group"
                >
                  <span
                    className="text-xs mt-[5px] w-5 shrink-0 text-right font-light transition-colors group-hover:text-white"
                    style={{ color: TEXT_INACTIVE }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col gap-0.5 border-b pb-3 flex-1 transition-colors group-hover:border-white/30" style={{ borderColor: GOLD_FAINT }}>
                    <span
                      className={`text-[0.95rem] leading-snug transition-all group-hover:text-white ${serifFontClassName}`}
                      style={{ color: TEXT_ACTIVE }}
                    >
                      {stripPrefix(post.title)}
                    </span>
                    <span className="text-[11px]" style={{ color: TEXT_INACTIVE }}>{post.date.slice(2).replace(/-/g, '.')}</span>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* 하단 */}
          <div className="mt-auto pt-4">
            <RulingLines />
            <p className="text-center text-[10px] mt-3" style={{ color: TEXT_INACTIVE }}>Ⅱ</p>
          </div>
        </div>

        {/* 오른쪽 표지 테두리 */}
        <div
          className="w-2 shrink-0 rounded-r-sm"
          style={{ background: 'linear-gradient(to left, #080603, #1a1208, #100d08)' }}
        />
      </div>
    </div>
    </>
  );
}
