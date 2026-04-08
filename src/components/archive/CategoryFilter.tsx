'use client';

import { useState } from 'react';
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

  const handleSeriesClick = (id: string) => {
    onSeriesChange(selectedSeries === id ? '' : id);
    setSeriesOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 메인 필터 행 */}
      <nav className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer',
                selected === cat.id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100',
              ].join(' ')}
            >
              {cat.label}
              <span className="ml-1.5 text-xs opacity-60">{cat.count}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* 시리즈 버튼 */}
          {series.length > 0 && (
            <button
              onClick={() => setSeriesOpen((v) => !v)}
              className={[
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer border',
                seriesOpen || selectedSeries
                  ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white'
                  : 'border-zinc-300 dark:border-zinc-600 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100',
              ].join(' ')}
            >
              Series {seriesOpen ? '▲' : '▼'}
            </button>
          )}

          {/* 언어 토글 */}
          <div className="flex items-center rounded-full border border-zinc-300 dark:border-zinc-600 overflow-hidden text-sm font-medium">
            <button
              onClick={() => onLangChange('ko')}
              className={[
                'px-3 py-1.5 transition-colors cursor-pointer',
                lang === 'ko'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300',
              ].join(' ')}
            >
              한국어
            </button>
            <span className="text-zinc-300 dark:text-zinc-600 select-none">/</span>
            <button
              onClick={() => onLangChange('en')}
              className={[
                'px-3 py-1.5 transition-colors cursor-pointer',
                lang === 'en'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300',
              ].join(' ')}
            >
              English
            </button>
          </div>
        </div>
      </nav>

      {/* 시리즈 드롭다운 패널 */}
      {seriesOpen && (
        <div className="flex flex-wrap gap-2 pt-1">
          {series.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSeriesClick(s.id)}
              className={[
                'rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer border',
                selectedSeries === s.id
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-400',
              ].join(' ')}
            >
              📚 {s.label}
              <span className="ml-1.5 text-xs opacity-70">{s.count}편</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
