'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Post, Category, Series } from '@/types/archive';
import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';

interface BookArchiveProps {
  posts: Post[];
  categories: Category[];
  series: Series[];
  fontClassName: string;
}

const GOLD = '#c8963a';
const GOLD_DIM = 'rgba(200,150,58,0.35)';
const GOLD_FAINT = 'rgba(200,150,58,0.12)';
const PAGE_BG = 'rgba(10,8,5,0.60)';
const TEXT_ACTIVE = '#f0e0b0';
const TEXT_INACTIVE = '#c8a870';
const TEXT_LABEL = '#e8d090';

function stripPrefix(title: string) {
  return title
    .replace(/^.+\s\d+편:\s*/, '')                          // 한글: "프롬프트 가이드 10편:"
    .replace(/^[\w\s]+(?:Episode|Vol\.)\s*\d+[:.]\s*/i, '') // 영문: "Prompt Guide Episode 2:" / "Vol.10:"
    .replace(/^[\w\s]+Part\s+\d+:\s*/i, '');                // "Part 1:"
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

export default function BookArchive({ posts, categories, series, fontClassName }: BookArchiveProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [mobilePage, setMobilePage] = useState<'posts' | 'index'>('posts');
  const { lang } = useLang();
  const t = i18n[lang];

  const SERIES_MAP: Record<string, string> = {
    '프롬프트 가이드': 'Prompt Guide',
    'SQL 완전 정복': 'SQL Mastery',
    '애자일 가이드': 'Agile Guide',
  };
  const SERIES_MAP_REVERSE = Object.fromEntries(
    Object.entries(SERIES_MAP).map(([k, v]) => [v, k])
  );

  useEffect(() => {
    if (!selectedSeries) return;
    if (lang === 'en') {
      const mapped = SERIES_MAP[selectedSeries];
      if (mapped) setSelectedSeries(mapped);
      else setSelectedSeries('');
    } else {
      const mapped = SERIES_MAP_REVERSE[selectedSeries];
      if (mapped) setSelectedSeries(mapped);
      else setSelectedSeries('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const filtered = posts
    .filter((p) => {
      const catMatch = selectedCategory === 'all' || p.category === selectedCategory;
      const seriesMatch = !selectedSeries || p.series === selectedSeries;
      return catMatch && seriesMatch;
    })
    .sort((a, b) => {
      if (selectedSeries) return a.date < b.date ? -1 : 1;
      return a.date > b.date ? -1 : 1;
    });

  const isActive = (catId: string, seriesId = '') =>
    seriesId ? selectedSeries === seriesId : selectedCategory === catId && !selectedSeries;

  const BOOK_HEIGHT = '74vh';

  const pageStyle = {
    background: PAGE_BG,
    height: BOOK_HEIGHT,
  };

  return (
    <>
    {/* ── 모바일 전용 ── */}
    <div className="flex flex-1 flex-col md:hidden px-4 py-4">
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
              <h1 className={`text-2xl leading-tight ${fontClassName}`} style={{ color: TEXT_ACTIVE }}>{t.infiniteArchive}</h1>
            </div>
            <Ornament />
            {/* 카테고리 */}
            <div className="flex flex-col mt-3 gap-0.5">
              <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: TEXT_LABEL }}>{t.categoryLabel}</p>
              {[{ id: 'all', label: t.allPosts, count: posts.length }, ...categories.filter(c => c.id !== 'all')].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSelectedSeries(''); setMobilePage('posts'); }}
                  className="text-left flex items-center justify-between py-2 text-sm transition-all"
                  style={{ color: isActive(cat.id) ? TEXT_ACTIVE : TEXT_INACTIVE }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: isActive(cat.id) ? GOLD : TEXT_INACTIVE }} />
                    <span className={fontClassName}>{cat.label}</span>
                  </div>
                  <span className="text-xs" style={{ color: TEXT_INACTIVE }}>{cat.count}</span>
                </button>
              ))}
            </div>
            {/* 시리즈 */}
            {series.length > 0 && (
              <>
                <Ornament />
                <div className="flex flex-col mt-1 gap-0.5">
                  <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: TEXT_LABEL }}>{t.seriesLabel}</p>
                  {series.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedSeries(s.id); setSelectedCategory('all'); setMobilePage('posts'); }}
                      className="text-left flex items-center justify-between py-2 text-sm transition-all"
                      style={{ color: isActive('', s.id) ? TEXT_ACTIVE : TEXT_INACTIVE }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ background: isActive('', s.id) ? GOLD : TEXT_INACTIVE }} />
                        <span className={`truncate ${fontClassName}`}>{s.label}</span>
                      </div>
                      <span className="text-xs shrink-0 ml-2" style={{ color: TEXT_INACTIVE }}>{s.count}{t.episodes}</span>
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
              <p className="text-xs tracking-[0.35em] uppercase" style={{ color: TEXT_LABEL }}>
                {selectedSeries || (selectedCategory === 'all' ? t.allPosts : selectedCategory)}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {filtered.length === 0 ? (
                <p className={`mt-8 text-center text-base ${fontClassName}`} style={{ color: TEXT_INACTIVE }}>{t.noRecords}</p>
              ) : (
                filtered.map((post, i) => (
                  <Link
                    key={post.slug}
                    href={post.lang === 'en' ? `/en/archive/${post.slug}` : `/archive/${post.slug}`}
                    className="flex items-start gap-3 group"
                  >
                    <span className="text-xs mt-[5px] w-5 shrink-0 text-right font-light transition-colors group-hover:text-[#c8963a]" style={{ color: TEXT_INACTIVE }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex flex-col gap-0.5 border-b pb-3 flex-1 transition-colors group-hover:border-[rgba(200,150,58,0.4)]" style={{ borderColor: GOLD_FAINT }}>
                      <span className={`text-sm leading-snug transition-all group-hover:text-[#f0dfa8] ${fontClassName}`} style={{ color: TEXT_ACTIVE }}>
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
    <div className="hidden md:flex flex-1 items-center justify-center px-2 py-4">
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

          {/* 헤더 */}
          <div className="mt-6 mb-5">
            <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: TEXT_LABEL }}>
              {t.archiveLabel}
            </p>
            <h1
              className={`text-2xl leading-tight ${fontClassName}`}
              style={{ color: TEXT_ACTIVE }}
            >
              {t.infiniteArchive}
            </h1>
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
                onClick={() => { setSelectedCategory(cat.id); setSelectedSeries(''); }}
                className="group text-left flex items-center justify-between py-2 text-sm transition-all"
                style={{ color: isActive(cat.id) ? TEXT_ACTIVE : TEXT_INACTIVE }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{ background: isActive(cat.id) ? GOLD : TEXT_INACTIVE }}
                  />
                  <span className={fontClassName}>{cat.label}</span>
                </div>
                <span className="text-xs" style={{ color: TEXT_INACTIVE }}>{cat.count}</span>
              </button>
            ))}
          </div>

          {/* 시리즈 */}
          {series.length > 0 && (
            <>
              <Ornament />
              <div className="flex flex-col mt-1 gap-0.5">
                <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: TEXT_LABEL }}>
                  {t.seriesLabel}
                </p>
                {series.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedSeries(s.id); setSelectedCategory('all'); }}
                    className="text-left flex items-center justify-between py-2 text-sm transition-all"
                    style={{ color: isActive('', s.id) ? TEXT_ACTIVE : TEXT_INACTIVE }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-1.5 h-1.5 shrink-0 rounded-full transition-all"
                        style={{ background: isActive('', s.id) ? GOLD : TEXT_INACTIVE }}
                      />
                      <span className={`truncate ${fontClassName}`}>{s.label}</span>
                    </div>
                    <span className="text-[11px] shrink-0 ml-2" style={{ color: TEXT_INACTIVE }}>{s.count}{t.episodes}</span>
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
            <p className="text-[9px] tracking-[0.35em] uppercase" style={{ color: TEXT_LABEL }}>
              {selectedSeries || (selectedCategory === 'all' ? t.allPosts : selectedCategory)}
            </p>
          </div>

          {/* 포스트 목록 */}
          <div
            className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1"
            style={{ scrollbarWidth: 'none' }}
          >
            {filtered.length === 0 ? (
              <p className={`mt-8 text-center text-lg ${fontClassName}`} style={{ color: TEXT_INACTIVE }}>
                {t.noRecords}
              </p>
            ) : (
              filtered.map((post, i) => (
                <Link
                  key={post.slug}
                  href={post.lang === 'en' ? `/en/archive/${post.slug}` : `/archive/${post.slug}`}
                  className="flex items-start gap-3 group"
                >
                  <span
                    className="text-xs mt-[5px] w-5 shrink-0 text-right font-light transition-colors group-hover:text-[#c8963a]"
                    style={{ color: TEXT_INACTIVE }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col gap-0.5 border-b pb-3 flex-1 transition-colors group-hover:border-[rgba(200,150,58,0.4)]" style={{ borderColor: GOLD_FAINT }}>
                    <span
                      className={`text-[0.95rem] leading-snug transition-all group-hover:text-[#f0dfa8] group-hover:drop-shadow-[0_0_8px_rgba(200,150,58,0.6)] ${fontClassName}`}
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
