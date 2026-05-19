import Image from 'next/image';
import type { Post } from '@/types/archive';

interface PostHeaderProps {
  post: Post;
}

function formatDisplayDate(date: string, lang: Post['lang']) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed);
}

export default function PostHeader({ post }: PostHeaderProps) {
  const metaItems = [post.category, post.subject].filter(Boolean);
  const headerImage = post.thumbnail || post.coverImage?.replace(/^\.\//, '');

  return (
    <header className="mb-12">
      {/* 썸네일 */}
      {headerImage && (
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-sm border border-[#2a211b]/10">
          <Image
            src={`/images/posts/${headerImage}`}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) calc(100vw - 2rem), 672px"
          />
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-[0.18em] text-[#9a7a3f]">
        {metaItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
        {metaItems.length > 0 && <span className="text-[#2a211b]/25">/</span>}
        <time dateTime={post.date}>{formatDisplayDate(post.date, post.lang)}</time>
      </div>

      <h1 className="font-[family-name:var(--font-header-serif)] text-4xl font-semibold leading-[1.18] tracking-tight text-[#17120d] sm:text-5xl">
        {post.title}
      </h1>

      <p className="mt-6 text-lg leading-[1.8] text-[#5f564d]">{post.description}</p>

      <div className="mt-9 border-b border-[#2a211b]/10" />
    </header>
  );
}
