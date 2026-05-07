'use client';

import { useMemo } from 'react';
import { parseHeadings } from '@/lib/parseHeadings';
import { useActiveHeading } from '@/hooks/useActiveHeading';
import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const headings = useMemo(() => parseHeadings(content), [content]);
  const ids = useMemo(() => headings.map((h) => h.id), [headings]);
  const activeId = useActiveHeading(ids);
  const { lang } = useLang();
  const t = i18n[lang];

  if (headings.length === 0) return null;

  return (
    <nav aria-label="목차">
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500/80">
        {t.tocTitle}
      </p>
      <ul className="space-y-1.5">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'pl-3' : ''}>
            <a
              href={`#${heading.id}`}
              className={[
                'block truncate border-l pl-3 text-xs leading-relaxed transition-colors duration-150',
                activeId === heading.id
                  ? 'border-amber-200/45 font-medium text-amber-50/90'
                  : 'border-white/5 text-zinc-600 hover:border-white/15 hover:text-zinc-400',
              ].join(' ')}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
