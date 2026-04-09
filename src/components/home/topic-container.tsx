import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';

export default function TopicContainer() {
  const posts = getAllPosts('ko');

  const featured = [...posts]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <div className="flex h-full flex-col gap-3">
      {featured.map((post) => (
        <Link
          key={post.slug}
          href={`/archive/${post.slug}?lang=ko`}
          className="group relative flex-1 w-full overflow-hidden rounded-xl border border-white/10 transition-all hover:border-white/20"
        >
          {post.thumbnail ? (
            <Image
              src={`/images/posts/${post.thumbnail}`}
              alt={post.title}
              fill
              priority
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 1400px) 30vw"
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-900" />
          )}

          {/* 하단 그라데이션 + 제목 */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-2.5">
            <p className="line-clamp-1 text-xs font-semibold text-white">
              {post.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
