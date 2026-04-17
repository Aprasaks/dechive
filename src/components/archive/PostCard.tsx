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
      href={`/archive/${post.slug}?lang=${post.lang}`}
      className={[
        'group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300',
        highlighted
          ? 'border-zinc-100 ring-2 ring-zinc-100'
          : 'border-zinc-800 hover:border-zinc-600 hover:shadow-md',
        dimmed ? 'opacity-30' : 'opacity-100',
      ].join(' ')}
    >
      {/* 썸네일 */}
      <div className="relative w-full aspect-[3/2] bg-zinc-800">
        <Image
          src={post.thumbnail ? `/images/posts/${post.thumbnail}` : '/images/thumb.webp'}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 1400px) 20vw"
        />
      </div>

      {/* 제목 */}
      <div className="px-3 py-2.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100 transition-colors group-hover:text-zinc-300">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}
