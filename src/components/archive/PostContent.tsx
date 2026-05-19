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
    const normalizedSrc = src.replace(/^\.\//, '');
    const imgSrc = normalizedSrc.startsWith('http') ? normalizedSrc : `/images/posts/${normalizedSrc}`;
    return (
      <span className="block w-full my-6 rounded-xl overflow-hidden">
        <Image
          src={imgSrc}
          alt={alt ?? src.split('/').pop() ?? 'image'}
          width={1200}
          height={630}
          className="w-full h-auto rounded-xl"
          sizes="(max-width: 1400px) 60vw"
        />
      </span>
    );
  },
  // 테이블 → 가로 스크롤 래퍼
  table({ children }) {
    return (
      <div className="my-6 overflow-x-auto rounded-sm border border-[#2a211b]/10">
        <table className="min-w-full">{children}</table>
      </div>
    );
  },
};

export default function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose max-w-none
      prose-headings:font-[family-name:var(--font-header-serif)] prose-headings:font-semibold prose-headings:text-[#17120d] prose-headings:tracking-tight
      prose-h2:mt-16 prose-h2:mb-5 prose-h2:text-2xl prose-h2:leading-[1.35]
      prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-xl prose-h3:leading-[1.4]
      prose-h4:mt-8 prose-h4:mb-3 prose-h4:text-base prose-h4:leading-[1.5]
      prose-p:my-5 prose-p:text-[#2f2924] prose-p:leading-[1.9]
      prose-ul:my-6 prose-ol:my-6
      prose-li:my-2 prose-li:text-[#2f2924] prose-li:leading-[1.85]
      prose-strong:text-[#17120d]
      prose-blockquote:my-8 prose-blockquote:rounded-sm prose-blockquote:border-l prose-blockquote:border-[#9a7a3f]/35 prose-blockquote:bg-[#efe7da]/55 prose-blockquote:px-5 prose-blockquote:py-1 prose-blockquote:text-[#5f564d]
      prose-blockquote:prose-p:my-4 prose-blockquote:prose-p:text-[#5f564d] prose-blockquote:prose-p:leading-[1.8]
      prose-code:rounded prose-code:bg-[#e8dfd2] prose-code:px-1 prose-code:text-[#17120d] prose-pre:prose-code:bg-transparent prose-pre:prose-code:px-0 prose-pre:prose-code:rounded-none
      prose-pre:my-8 prose-pre:overflow-x-auto prose-pre:rounded-sm prose-pre:border prose-pre:border-[#2a211b]/10 prose-pre:bg-[#17120d] prose-pre:text-[#f8f6f1]
      prose-table:w-full
      prose-td:px-3 prose-td:py-2 prose-th:px-3 prose-th:py-2
      prose-p:break-words prose-li:break-words prose-a:break-all
      prose-a:text-[#7f612e] prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-[#17120d]
      prose-hr:border-[#2a211b]/10
      [&_pre_code]:!bg-transparent [&_pre_code]:!p-0 [&_pre_code]:!text-[#f4ede3] [&_pre_code]:before:content-none [&_pre_code]:after:content-none
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
