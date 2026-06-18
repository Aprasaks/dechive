import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Noto_Serif_KR } from 'next/font/google';
import DailyIssuePageClient from '@/components/issues/DailyIssuePageClient';
import {
  getDailyAiUpdatesByDate,
  getDailyIssueByDate,
  getDailyIssueDates,
  getNextDailyIssue,
  getPreviousDailyIssue,
  getWeeklyEditionByDate,
} from '@/lib/dailyIssues';

const notoSerifKR = Noto_Serif_KR({
  weight: ['500'],
  subsets: ['latin'],
  variable: '--font-home-serif-kr',
  preload: false,
});

interface PageProps {
  params: Promise<{ date: string }>;
}

export function generateStaticParams() {
  return getDailyIssueDates().map((date) => ({ date }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date } = await params;
  const issue = getDailyIssueByDate(date);

  if (!issue) return {};

  return {
    title: `${issue.date} Daily Issue — Dechive`,
    description: issue.question.title.ko,
    alternates: { canonical: `https://dechive.dev/issues/${issue.date}` },
    openGraph: {
      title: `${issue.date} Daily Issue — Dechive`,
      description: issue.question.title.ko,
      url: `https://dechive.dev/issues/${issue.date}`,
      images: [{ url: issue.coverImage, width: 1200, height: 750, alt: issue.question.title.ko }],
    },
  };
}

export default async function IssueDatePage({ params }: PageProps) {
  const { date } = await params;
  const issue = getDailyIssueByDate(date);

  if (!issue) notFound();

  const previousIssue = getPreviousDailyIssue(date);
  const nextIssue = getNextDailyIssue(date);
  const weeklyEdition = getWeeklyEditionByDate(date);
  const dailyAiUpdates = getDailyAiUpdatesByDate(date);

  return (
    <DailyIssuePageClient
      issue={issue}
      weeklyEdition={weeklyEdition}
      dailyAiUpdates={dailyAiUpdates}
      previousIssueDate={previousIssue?.date ?? null}
      nextIssueDate={nextIssue?.date ?? null}
      heroSerifClassName={notoSerifKR.className}
    />
  );
}
