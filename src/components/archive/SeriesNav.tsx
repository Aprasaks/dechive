import Link from 'next/link';
import type { Post, PostLang } from '@/types/archive';

interface SeriesNavProps {
  prev: Post | null;
  next: Post | null;
  lang: PostLang;
}

export default function SeriesNav({ prev, next, lang }: SeriesNavProps) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-16 border-t border-white/10 pt-8">
      <p className="mb-4 text-xs font-medium tracking-widest text-zinc-500 uppercase">
        Series
      </p>
      <div className="grid grid-cols-2 gap-4">
        {/* 이전 편 */}
        <div>
          {prev ? (
            <Link
              href={`/archive/${prev.slug}?lang=${lang}`}
              className="group flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <span className="text-xs text-zinc-500">← 이전 편</span>
              <span className="text-sm font-medium text-zinc-200 line-clamp-2 group-hover:text-white transition-colors">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* 다음 편 */}
        <div>
          {next ? (
            <Link
              href={`/archive/${next.slug}?lang=${lang}`}
              className="group flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 p-4 text-right transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <span className="text-xs text-zinc-500">다음 편 →</span>
              <span className="text-sm font-medium text-zinc-200 line-clamp-2 group-hover:text-white transition-colors">
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </nav>
  );
}
