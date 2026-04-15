'use client';

import { useMemo } from 'react';
import { parseHeadings } from '@/lib/parseHeadings';
import { useActiveHeading } from '@/hooks/useActiveHeading';

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const headings = useMemo(() => parseHeadings(content), [content]);
  const ids = useMemo(() => headings.map((h) => h.id), [headings]);
  const activeId = useActiveHeading(ids);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="목차">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        On this page
      </p>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'pl-3' : ''}>
            <a
              href={`#${heading.id}`}
              className={[
                'block truncate text-xs leading-relaxed transition-colors duration-150',
                activeId === heading.id
                  ? 'font-medium text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300',
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
