import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getSeriesPosts } from '@/lib/posts';

const SERIES_CONFIG = [
  { name: '프롬프트 가이드', total: 18, href: '/archive?series=%ED%94%84%EB%A1%AC%ED%94%84%ED%8A%B8+%EA%B0%80%EC%9D%B4%EB%93%9C' },
  { name: 'SQL 완전 정복', total: 28, href: '/archive?series=SQL+%EC%99%84%EC%A0%84+%EC%A0%95%EB%B3%B5' },
] as const;

export default function TopicContainer() {
  const posts = getAllPosts('ko');
  const latestPost = posts[0];

  const seriesData = SERIES_CONFIG.map((s) => ({
    ...s,
    current: getSeriesPosts(s.name, 'ko').length,
  }));

  return (
    <div className="flex h-full flex-col gap-3">
      {/* 시리즈 진행 카드 */}
      {seriesData.map((series) => (
        <Link
          key={series.name}
          href={series.href}
          className="group flex-1 flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-all hover:border-white/20 hover:bg-white/8"
        >
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">Series</p>
            <p className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">
              {series.name}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                {series.current}
                <span className="text-zinc-600">/{series.total}편</span>
              </span>
              <span className="text-xs text-zinc-500">
                {Math.round((series.current / series.total) * 100)}%
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-white/40 transition-all"
                style={{ width: `${Math.round((series.current / series.total) * 100)}%` }}
              />
            </div>
          </div>
        </Link>
      ))}

      {/* 최신 포스트 */}
      {latestPost && (
        <Link
          href={`/archive/${latestPost.slug}?lang=ko`}
          className="group relative flex-1 w-full overflow-hidden rounded-xl border border-white/10 transition-all hover:border-white/20"
        >
          <Image
            src={latestPost.thumbnail ? `/images/posts/${latestPost.thumbnail}` : '/images/thumb.webp'}
            alt={latestPost.title}
            fill
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 1400px) 30vw"
          />
          <div className="absolute inset-x-0 top-0 px-3 py-2">
            <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-zinc-300 backdrop-blur-sm">
              최신 포스트
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-2.5">
            <p className="line-clamp-1 text-xs font-semibold text-white">
              {latestPost.title}
            </p>
          </div>
        </Link>
      )}
    </div>
  );
}
