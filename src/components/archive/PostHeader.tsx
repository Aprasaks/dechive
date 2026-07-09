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
  const metaItems = [post.category].filter(Boolean);

  return (
    <header className="mb-12">
      <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-[0.18em] text-[#f6d29b]/72">
        {metaItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
        {metaItems.length > 0 && <span className="text-white/22">/</span>}
        <time dateTime={post.date}>{formatDisplayDate(post.date, post.lang)}</time>
      </div>

      <h1 className="font-[family-name:var(--font-header-serif)] text-4xl font-semibold leading-[1.18] tracking-tight text-[#f5ead5] sm:text-5xl">
        {post.title}
      </h1>

      <p className="mt-6 text-lg leading-[1.8] text-[#e8dfcd]/68">{post.description}</p>

      <div className="mt-9 border-b border-white/10" />
    </header>
  );
}
