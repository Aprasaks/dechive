import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-12 border-t border-white/10 pt-8 font-[family-name:var(--font-header-serif)] text-2xl font-medium text-[#f5ead5]">
      {children}
    </h2>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-sm leading-8 text-[#e8dfcd]/76">
      {children}
    </p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-5 border-l border-[#d7ad73]/45 bg-white/[0.035] px-5 py-4 font-[family-name:var(--font-header-serif)] text-lg leading-8 text-[#f5ead5]">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 space-y-2 text-sm leading-7 text-[#e8dfcd]/76">
      {children}
    </ul>
  ),
  li: ({ children }) => (
    <li className="flex gap-3">
      <span className="mt-3 h-px w-4 shrink-0 bg-[#d7ad73]" aria-hidden="true" />
      <span>{children}</span>
    </li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-semibold text-[#f6d29b] underline decoration-[#d7ad73]/40 underline-offset-4 transition-colors hover:text-white"
    >
      {children}
    </a>
  ),
};

export default function BookContent({ content }: { content: string }) {
  return (
    <div className="book-note-content">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
