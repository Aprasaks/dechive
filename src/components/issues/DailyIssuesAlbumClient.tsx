'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/components/layout/LangProvider';
import type { DailyIssue } from '@/data/dailyIssues';
import type { WeeklyEdition } from '@/data/weeklyEditions';

export type DailyIssueAlbumItem = {
  issue: DailyIssue;
  weeklyEdition: WeeklyEdition | null;
};

interface DailyIssuesAlbumClientProps {
  items: DailyIssueAlbumItem[];
}

function formatIssueDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00+09:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate).toUpperCase();
}

export default function DailyIssuesAlbumClient({ items }: DailyIssuesAlbumClientProps) {
  const { lang } = useLang();
  const copy = {
    ko: {
      kicker: 'Daily Issues',
      title: '발행된 표지',
      description: '날짜별 Dechive 일간 표지를 다시 펼쳐봅니다.',
      empty: '아직 발행된 표지가 없습니다.',
    },
    en: {
      kicker: 'Daily Issues',
      title: 'Published Covers',
      description: 'Reopen Dechive daily covers by date.',
      empty: 'No issues have been published yet.',
    },
  }[lang];

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8f6f1] px-5 py-12 text-[#19140f] sm:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="border-b border-[#2a211b]/10 pb-9">
          <p className="text-xs font-black tracking-[0.26em] text-[#9b5a18] uppercase">
            {copy.kicker}
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-header-serif)] text-[clamp(42px,6vw,82px)] leading-none font-semibold tracking-[-0.04em] text-[#2a1d14]">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 font-medium text-[#5f5144] sm:text-base">
            {copy.description}
          </p>
        </div>

        {items.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map(({ issue, weeklyEdition }) => {
              const supportTitle = weeklyEdition?.verification.title[lang] ?? issue.verification?.title[lang] ?? '';

              return (
                <Link
                  key={issue.date}
                  href={`/issues/${issue.date}`}
                  className="group block border-t border-[#2a211b]/15 pt-5 transition-opacity hover:opacity-85"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#e7dccb]">
                    <Image
                      src={issue.coverImage}
                      alt={`${issue.date} Dechive cover`}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-[#2f2117]/14" />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[11px] font-black tracking-[0.18em] text-[#9b5a18] uppercase">
                        {formatIssueDate(issue.date)}
                      </p>
                      <h2 className="mt-2 font-[family-name:var(--font-header-serif)] text-2xl leading-tight font-semibold tracking-[-0.03em] text-[#1f1712]">
                        {issue.question.title[lang]}
                      </h2>
                      {supportTitle ? (
                        <p className="mt-3 text-sm leading-6 font-semibold text-[#5f5144]">
                          {supportTitle}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="mt-10 text-sm font-semibold tracking-[0.12em] text-[#5f5144] uppercase">
            {copy.empty}
          </p>
        )}
      </div>
    </main>
  );
}
