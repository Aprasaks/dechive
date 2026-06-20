import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-12 border-t border-[#ded6c9] pt-8 font-[family-name:var(--font-header-serif)] text-2xl font-medium text-[#2a211b]">
      {children}
    </h2>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-sm leading-8 text-[#4f463e]">
      {children}
    </p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-5 border-l border-[#b08d57] bg-[#fbfaf7]/70 px-5 py-4 font-[family-name:var(--font-header-serif)] text-lg leading-8 text-[#2a211b]">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 space-y-2 text-sm leading-7 text-[#4f463e]">
      {children}
    </ul>
  ),
  li: ({ children }) => (
    <li className="flex gap-3">
      <span className="mt-3 h-px w-4 shrink-0 bg-[#b08d57]" aria-hidden="true" />
      <span>{children}</span>
    </li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-semibold text-[#7a5d2c] underline decoration-[#b08d57]/40 underline-offset-4 transition-colors hover:text-[#2a211b]"
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
