'use client';

import * as React from 'react';
import KnowledgeHelix from '@/components/home/KnowledgeHelix';
import { Search, Sparkles } from 'lucide-react';

const EXAMPLE_QUESTIONS = [
  '프롬프트란 결국 무엇인가?',
  '프로젝트의 범위는 어떻게 정해야하나?',
  'mcp 만드는 법',
] as const;

function ArchiveSearch() {
  const [query, setQuery] = React.useState('');
  const [submittedQuery, setSubmittedQuery] = React.useState<string | null>(null);

  const markPlaceholderSubmission = React.useCallback((nextQuery: string) => {
    setSubmittedQuery(nextQuery);
  }, []);

  return (
    <div className="mx-auto mt-8 w-full max-w-[22.5rem] lg:mx-0 lg:max-w-none">
      <form
        className="w-full"
        onSubmit={(event) => {
          event.preventDefault();
          markPlaceholderSubmission(query);
        }}
      >
        <label htmlFor="ask-archive" className="sr-only">
          Ask Dechive
        </label>
        <div className="group flex min-h-14 w-full items-center gap-3 rounded-[12px] border border-white/20 bg-[#060606]/88 px-3 shadow-[0_0_72px_rgba(215,173,115,0.08)] transition-colors focus-within:border-[#d7ad73]/68 sm:min-h-18 sm:px-5">
          <Search size={22} className="shrink-0 text-white/86" />
          <input
            id="ask-archive"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask Dechive..."
            className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/36 sm:text-lg"
          />
          <button
            type="submit"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c89b62]/44 text-[#f6d29b] transition-colors hover:border-[#f6d29b]/72 hover:bg-[#c89b62]/12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b] sm:h-11 sm:w-auto sm:px-4"
            aria-label="Submit placeholder archive question"
          >
            <Sparkles size={18} />
            <span className="ml-2 hidden text-[11px] font-semibold tracking-[0.14em] uppercase sm:inline">
              Ask
            </span>
          </button>
        </div>
        <p className="mx-auto mt-4 max-w-[21rem] text-sm leading-6 break-keep text-white/66 lg:mx-0 lg:max-w-none">
          Dechive는 정리되고 검증된 지식에서만 답을 합니다.
        </p>
        <p className="sr-only" aria-live="polite">
          {submittedQuery ? `Search placeholder prepared for ${submittedQuery}.` : ''}
        </p>
      </form>

      <div className="mx-auto mt-5 flex max-w-[22.5rem] flex-wrap justify-center gap-2 pb-1 lg:mx-0 lg:max-w-none lg:justify-start">
        {EXAMPLE_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => setQuery(question)}
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-left text-xs leading-5 text-white/68 transition-colors hover:border-[#d7ad73]/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b]"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}

export function HeroSection({ heroSerifClassName }: { heroSerifClassName: string }) {
  const [glowPosition, setGlowPosition] = React.useState({ x: 50, y: 42 });
  const [allowMotion, setAllowMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const updateMotion = () => setAllowMotion(mediaQuery.matches);

    updateMotion();
    mediaQuery.addEventListener('change', updateMotion);
    return () => mediaQuery.removeEventListener('change', updateMotion);
  }, []);

  return (
    <section
      className="relative isolate overflow-hidden border-b border-[#d7ad73]/10 bg-[#030303]"
      onPointerMove={(event) => {
        if (!allowMotion || event.pointerType !== 'mouse') return;

        const rect = event.currentTarget.getBoundingClientRect();
        setGlowPosition({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      }}
      style={
        {
          '--glow-x': `${glowPosition.x}%`,
          '--glow-y': `${glowPosition.y}%`,
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_26%_58%,rgba(255,255,255,0.035),transparent_32%),radial-gradient(circle_at_70%_43%,rgba(255,255,255,0.018),transparent_32%),linear-gradient(180deg,#030303_0%,#040404_48%,#030303_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden opacity-0 transition-opacity duration-300 lg:block lg:opacity-100"
        style={{
          background:
            'radial-gradient(circle 340px at var(--glow-x) var(--glow-y), rgba(215,173,115,0.10), rgba(255,255,255,0.018) 34%, transparent 72%)',
        }}
      />

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-start gap-10 px-4 pt-20 pb-12 sm:px-6 sm:pt-24 sm:pb-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-14 lg:px-8 lg:pt-32 lg:pb-8">
        <div className="order-2 hidden lg:order-1 lg:block">
          <KnowledgeHelix />
        </div>

        <div className="order-1 mx-auto w-full max-w-[23.5rem] text-center lg:order-2 lg:mx-0 lg:max-w-none lg:translate-y-10 lg:text-left">
          <p className="inline-flex rounded-full border border-[#c89b62]/28 bg-[#c89b62]/8 px-3 py-1.5 text-[10px] font-semibold tracking-[0.22em] text-[#f6d29b] uppercase">
            Living Archive
          </p>

          <h1 className={`mx-auto mt-7 max-w-[22rem] font-semibold tracking-normal text-white sm:max-w-3xl lg:mx-0 ${heroSerifClassName}`}>
            <span className="block text-[1.85rem] leading-[1.08] sm:text-[3rem] lg:text-[3.25rem]">
              AI creates answers.
            </span>
            <span className="mt-1 block text-[2.12rem] leading-[1.04] sm:text-[4.15rem] lg:text-[4.65rem]">
              Humans verify them.
            </span>
          </h1>

          <ArchiveSearch />
        </div>
      </div>
    </section>
  );
}
