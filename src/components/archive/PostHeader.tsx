import Image from 'next/image';
import type { Post } from '@/types/archive';

interface PostHeaderProps {
  post: Post;
}

export default function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="mb-10">
      {/* 썸네일 */}
      {post.thumbnail && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
          <Image
            src={`/images/posts/${post.thumbnail}`}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) calc(100vw - 2rem), 672px"
          />
        </div>
      )}

      {/* 카테고리 + 태그 */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400">
          {post.category}
        </span>
        {post.tags.map((tag: string) => (
          <span key={tag} className="text-xs text-zinc-600">
            #{tag}
          </span>
        ))}
      </div>

      {/* 제목 */}
      <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-zinc-100">
        {post.title}
      </h1>

      {/* 요약 */}
      {post.summary && (
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          {post.summary}
        </p>
      )}

      {/* 날짜 */}
      <time dateTime={post.date} className="mt-4 block text-xs text-zinc-600 tabular-nums">
        {post.date}
      </time>

      <div className="mt-6 border-b border-zinc-800" />
    </header>
  );
}
