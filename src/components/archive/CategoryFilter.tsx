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

  // 바깥 클릭 시 닫기
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
        {/* 시리즈 드롭다운 */}
        {series.length > 0 && (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setSeriesOpen((v) => !v)}
              className={[
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer border',
                seriesOpen || selectedSeries
                  ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white'
                  : 'border-zinc-300 dark:border-zinc-600 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100',
              ].join(' ')}
            >
              {selectedSeries ? `📚 ${selectedSeries}` : 'Series'} {seriesOpen ? '▲' : '▼'}
            </button>

            {seriesOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 min-w-48 rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-md shadow-xl overflow-hidden">
                {series.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSeriesClick(s.id)}
                    className={[
                      'w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors cursor-pointer text-left',
                      selectedSeries === s.id
                        ? 'bg-violet-600/30 text-violet-300'
                        : 'text-zinc-300 hover:bg-white/10',
                    ].join(' ')}
                  >
                    <span>📚 {s.label}</span>
                    <span className="text-xs text-zinc-500 ml-3">{s.count}편</span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
  );
}
