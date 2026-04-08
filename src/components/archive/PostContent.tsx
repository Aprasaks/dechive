import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import Image from 'next/image';
import type { Components } from 'react-markdown';

interface PostContentProps {
  content: string;
}

const components: Components = {
  // 본문 이미지 → Next.js Image 최적화
  img({ src, alt }) {
    if (!src || typeof src !== 'string') return null;
    const imgSrc = src.startsWith('http') ? src : `/images/posts/${src}`;
    return (
      <span className="relative block w-full aspect-video my-6 rounded-xl overflow-hidden">
        <Image
          src={imgSrc}
          alt={alt ?? ''}
          fill
          className="object-cover"
          sizes="(max-width: 1400px) 60vw"
        />
      </span>
    );
  },
};

export default function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose prose-invert prose-zinc max-w-none
      prose-headings:font-bold prose-headings:text-zinc-100 prose-headings:tracking-tight
      prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
      prose-h4:text-base prose-h4:mt-6 prose-h4:mb-2
      prose-p:text-zinc-300 prose-p:leading-relaxed
      prose-li:text-zinc-300
      prose-strong:text-zinc-100
      prose-blockquote:border-zinc-700 prose-blockquote:text-zinc-400
      prose-code:text-zinc-300 prose-code:bg-zinc-800 prose-code:rounded prose-code:px-1
      prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl prose-pre:overflow-x-auto
      prose-table:block prose-table:overflow-x-auto prose-table:whitespace-nowrap
      prose-td:px-3 prose-td:py-2 prose-th:px-3 prose-th:py-2
      prose-a:text-zinc-300 prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-zinc-100
      prose-hr:border-zinc-800
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
