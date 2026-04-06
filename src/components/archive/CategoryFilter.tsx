'use client';

import type { Category, PostLang } from '@/types/archive';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

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

      <Select value={lang} onValueChange={(v) => onLangChange(v as PostLang)}>
        <SelectTrigger
          size="sm"
          className="gap-1.5 border-zinc-200 text-zinc-500 dark:border-zinc-700"
        >
          <Globe className="size-3.5" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ko">한국어</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
    </nav>
  );
}
