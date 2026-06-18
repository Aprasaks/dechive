'use client';

import Link from 'next/link';
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
      previous: '이전 표지',
      all: '전체 표지',
      next: '다음 표지',
    },
    en: {
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
        className="absolute top-6 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-4 text-[11px] font-black tracking-[0.18em] text-[#3a2416]/70 uppercase md:flex"
      >
        {previousIssueDate ? (
          <Link href={`/issues/${previousIssueDate}`} className="transition-opacity hover:opacity-70">
            {labels.previous}
          </Link>
        ) : (
          <span className="opacity-35">{labels.previous}</span>
        )}
        <span className="opacity-45">·</span>
        <Link href="/issues" className="transition-opacity hover:opacity-70">
          {labels.all}
        </Link>
        <span className="opacity-45">·</span>
        {nextIssueDate ? (
          <Link href={`/issues/${nextIssueDate}`} className="transition-opacity hover:opacity-70">
            {labels.next}
          </Link>
        ) : (
          <span className="opacity-35">{labels.next}</span>
        )}
      </nav>
    </main>
  );
}
