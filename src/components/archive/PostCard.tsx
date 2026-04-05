import type { Post } from '@/types/archive';

interface PostCardProps {
  post: Post;
  highlighted: boolean;
  dimmed: boolean;
}

export default function PostCard({ post, highlighted, dimmed }: PostCardProps) {
  return (
    <article
      className={[
        'group flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-300 cursor-pointer',
        highlighted
          ? 'border-zinc-900 bg-zinc-50 ring-2 ring-zinc-900 dark:border-zinc-100 dark:bg-zinc-800 dark:ring-zinc-100'
          : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700',
        dimmed ? 'opacity-30' : 'opacity-100',
      ].join(' ')}
    >
      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 self-start">
        {post.category}
      </span>

      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
        {post.title}
      </h3>

      <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
        {post.summary}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {post.tags.slice(0, 3).map((tag: string) => (
          <span
            key={tag}
            className="text-xs text-zinc-400 dark:text-zinc-600"
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
