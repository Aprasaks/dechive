'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Grid2X2 } from 'lucide-react';
import DailyIssueCover from '@/components/home/DailyIssueCover';
import { useLang } from '@/components/layout/LangProvider';
import type { DailyAiUpdates } from '@/data/dailyAiUpdates';
import type { DailyIssue } from '@/data/dailyIssues';
import type { WeeklyEdition } from '@/data/weeklyEditions';

interface DailyIssuePageClientProps {
  issue: DailyIssue;
  weeklyEdition: WeeklyEdition | null;
  dailyAiUpdates: DailyAiUpdates;
  previousIssueDate: string | null;
  nextIssueDate: string | null;
  heroSerifClassName: string;
}

export default function DailyIssuePageClient({
  issue,
  weeklyEdition,
  dailyAiUpdates,
  previousIssueDate,
  nextIssueDate,
  heroSerifClassName,
}: DailyIssuePageClientProps) {
  const { lang } = useLang();
  const labels = {
    ko: {
      kicker: 'Issue Navigator',
      current: '현재 표지',
      previous: '이전 표지',
      all: '전체 표지',
      next: '다음 표지',
    },
    en: {
      kicker: 'Issue Navigator',
      current: 'Current Cover',
      previous: 'Previous Issue',
      all: 'All Issues',
      next: 'Next Issue',
    },
  }[lang];

  return (
    <main className="relative min-h-screen bg-[#f8f6f1]">
      <DailyIssueCover
        issue={issue}
        weeklyEdition={weeklyEdition}
        dailyAiUpdates={dailyAiUpdates}
        lang={lang}
        heroSerifClassName={heroSerifClassName}
      />
      <nav
        aria-label={lang === 'ko' ? '이슈 이동' : 'Issue navigation'}
        className="absolute top-1/2 right-5 z-30 hidden w-44 -translate-y-1/2 overflow-hidden border border-[#fffaf0]/18 bg-[#080806]/58 text-[#fffaf0] shadow-[-18px_22px_70px_rgba(0,0,0,0.22)] backdrop-blur-[5px] md:block xl:right-8"
      >
        <div className="border-b border-[#fffaf0]/14 px-5 py-4">
          <p className="text-[10px] font-black tracking-[0.24em] text-[#d6a352] uppercase">
            {labels.kicker}
          </p>
          <p className="mt-2 text-[11px] font-bold tracking-[0.16em] text-[#fffaf0]/62 uppercase">
            {labels.current}
          </p>
          <time
            dateTime={issue.date}
            className="mt-1 block font-[family-name:var(--font-header-serif)] text-2xl leading-none font-semibold tracking-[-0.03em]"
          >
            {issue.date.replaceAll('-', '.')}
          </time>
        </div>
        <div className="divide-y divide-[#fffaf0]/12">
          {previousIssueDate ? (
            <Link href={`/issues/${previousIssueDate}`} className="flex items-center justify-between gap-4 px-5 py-4 text-[11px] font-black tracking-[0.16em] uppercase transition-colors hover:bg-[#fffaf0]/8">
              <span>{labels.previous}</span>
              <ArrowLeft size={15} strokeWidth={1.8} />
            </Link>
          ) : (
            <span className="flex items-center justify-between gap-4 px-5 py-4 text-[11px] font-black tracking-[0.16em] text-[#fffaf0]/28 uppercase">
              <span>{labels.previous}</span>
              <ArrowLeft size={15} strokeWidth={1.8} />
            </span>
          )}
          <Link href="/issues" className="flex items-center justify-between gap-4 px-5 py-4 text-[11px] font-black tracking-[0.16em] uppercase transition-colors hover:bg-[#fffaf0]/8">
            <span>{labels.all}</span>
            <Grid2X2 size={15} strokeWidth={1.8} />
          </Link>
          {nextIssueDate ? (
            <Link href={`/issues/${nextIssueDate}`} className="flex items-center justify-between gap-4 px-5 py-4 text-[11px] font-black tracking-[0.16em] uppercase transition-colors hover:bg-[#fffaf0]/8">
              <span>{labels.next}</span>
              <ArrowRight size={15} strokeWidth={1.8} />
            </Link>
          ) : (
            <span className="flex items-center justify-between gap-4 px-5 py-4 text-[11px] font-black tracking-[0.16em] text-[#fffaf0]/28 uppercase">
              <span>{labels.next}</span>
              <ArrowRight size={15} strokeWidth={1.8} />
            </span>
          )}
        </div>
      </nav>
      <nav
        aria-label={lang === 'ko' ? '모바일 이슈 이동' : 'Mobile issue navigation'}
        className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-3 overflow-hidden border border-[#fffaf0]/16 bg-[#080806]/72 text-[#fffaf0] shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-[6px] md:hidden"
      >
        {previousIssueDate ? (
          <Link href={`/issues/${previousIssueDate}`} className="flex h-12 items-center justify-center gap-2 border-r border-[#fffaf0]/12 text-[10px] font-black tracking-[0.14em] uppercase">
            <ArrowLeft size={14} strokeWidth={1.8} />
            {labels.previous}
          </Link>
        ) : (
          <span className="flex h-12 items-center justify-center gap-2 border-r border-[#fffaf0]/12 text-[10px] font-black tracking-[0.14em] text-[#fffaf0]/30 uppercase">
            <ArrowLeft size={14} strokeWidth={1.8} />
            {labels.previous}
          </span>
        )}
        <Link href="/issues" className="flex h-12 items-center justify-center gap-2 border-r border-[#fffaf0]/12 text-[10px] font-black tracking-[0.14em] uppercase">
          <Grid2X2 size={14} strokeWidth={1.8} />
          {labels.all}
        </Link>
        {nextIssueDate ? (
          <Link href={`/issues/${nextIssueDate}`} className="flex h-12 items-center justify-center gap-2 text-[10px] font-black tracking-[0.14em] uppercase">
            {labels.next}
            <ArrowRight size={14} strokeWidth={1.8} />
          </Link>
        ) : (
          <span className="flex h-12 items-center justify-center gap-2 text-[10px] font-black tracking-[0.14em] text-[#fffaf0]/30 uppercase">
            {labels.next}
            <ArrowRight size={14} strokeWidth={1.8} />
          </span>
        )}
      </nav>
    </main>
  );
}
