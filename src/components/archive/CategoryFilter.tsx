'use client';

import type { Category, PostLang } from '@/types/archive';

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onChange: (id: string) => void;
  lang: PostLang;
  onLangChange: (lang: PostLang) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onChange,
  lang,
  onLangChange,
}: CategoryFilterProps) {
  return (
    <nav className="flex items-center gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
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
    </nav>
  );
}
