'use client';

import type { Category } from '@/types/archive';

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onChange: (id: string) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <nav className="flex items-center gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
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
    </nav>
  );
}
