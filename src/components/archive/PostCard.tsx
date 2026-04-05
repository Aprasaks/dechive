import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/types/archive';

interface PostCardProps {
  post: Post;
  highlighted: boolean;
  dimmed: boolean;
}

export default function PostCard({ post, highlighted, dimmed }: PostCardProps) {
  return (
    <Link
      href={`/archive/${post.slug}`}
      className={[
        'group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300',
        highlighted
          ? 'border-zinc-100 ring-2 ring-zinc-100'
          : 'border-zinc-800 hover:border-zinc-600 hover:shadow-md',
        dimmed ? 'opacity-30' : 'opacity-100',
      ].join(' ')}
    >
      {/* 썸네일 */}
      <div className="relative w-full aspect-video bg-zinc-800">
        {post.thumbnail ? (
          <Image
            src={`/images/posts/${post.thumbnail}`}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 1400px) 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            <span className="text-xs text-zinc-600">No Image</span>
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-col gap-2.5 p-4">
        <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-400 self-start">
          {post.category}
        </span>

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100 transition-colors group-hover:text-zinc-300">
          {post.title}
        </h3>

        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">
          {post.summary}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="text-xs text-zinc-600">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
