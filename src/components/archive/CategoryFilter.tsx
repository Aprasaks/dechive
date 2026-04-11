'use client';

import { useState, useRef, useEffect } from 'react';
import type { Category, PostLang, Series } from '@/types/archive';

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onChange: (id: string) => void;
  lang: PostLang;
  onLangChange: (lang: PostLang) => void;
  series: Series[];
  selectedSeries: string;
  onSeriesChange: (id: string) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onChange,
  lang,
  onLangChange,
  series,
  selectedSeries,
  onSeriesChange,
}: CategoryFilterProps) {
  const [seriesOpen, setSeriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSeriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSeriesClick = (id: string) => {
    onSeriesChange(selectedSeries === id ? '' : id);
    setSeriesOpen(false);
  };

  return (
    <nav className="flex items-center gap-2">
      {/* 왼쪽: 카테고리 (가로 스크롤) */}
      <div className="flex flex-1 min-w-0 items-center gap-1.5 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={[
              'cursor-pointer shrink-0 rounded-full px-3 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm font-medium transition-colors',
              selected === cat.id
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100',
            ].join(' ')}
          >
            {cat.label}
            <span className="ml-1 text-xs opacity-60">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* 오른쪽: Series + KO/EN (고정) */}
      <div className="flex shrink-0 items-center gap-2">
        {/* 시리즈 드롭다운 */}
        {series.length > 0 && (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setSeriesOpen((v) => !v)}
              className={[
                'cursor-pointer rounded-full border px-3 py-1 text-xs sm:px-3.5 sm:py-1.5 sm:text-sm font-medium transition-colors max-w-[6rem] sm:max-w-none truncate',
                seriesOpen || selectedSeries
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                  : 'border-zinc-300 text-zinc-500 hover:text-zinc-900 dark:border-zinc-600 dark:hover:text-zinc-100',
              ].join(' ')}
            >
              {selectedSeries || 'Series'}{' '}
              {seriesOpen ? '▲' : '▼'}
            </button>

            {seriesOpen && (
              <div className="absolute top-full right-0 z-50 mt-2 min-w-48 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-xl backdrop-blur-md">
                {series.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSeriesClick(s.id)}
                    className={[
                      'flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-sm transition-colors',
                      selectedSeries === s.id
                        ? 'bg-violet-600/30 text-violet-300'
                        : 'text-zinc-300 hover:bg-white/10',
                    ].join(' ')}
                  >
                    <span>{s.label}</span>
                    <span className="ml-3 text-xs text-zinc-500">{s.count}편</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 언어 토글 */}
        <div className="flex items-center overflow-hidden rounded-full border border-zinc-300 text-xs sm:text-sm font-medium dark:border-zinc-600">
          <button
            onClick={() => onLangChange('ko')}
            className={[
              'cursor-pointer px-2.5 py-1 sm:px-3 sm:py-1.5 transition-colors',
              lang === 'ko'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300',
            ].join(' ')}
          >
            <span className="sm:hidden">KO</span>
            <span className="hidden sm:inline">한국어</span>
          </button>
          <span className="text-zinc-300 select-none dark:text-zinc-600">/</span>
          <button
            onClick={() => onLangChange('en')}
            className={[
              'cursor-pointer px-2.5 py-1 sm:px-3 sm:py-1.5 transition-colors',
              lang === 'en'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300',
            ].join(' ')}
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  );
}
