import type { Metadata } from 'next';
import DailyIssuesAlbumClient from '@/components/issues/DailyIssuesAlbumClient';
import { getAllDailyIssues, getWeeklyEditionByDate } from '@/lib/dailyIssues';

export const metadata: Metadata = {
  title: 'Daily Issues — Dechive',
  description: 'Dechive 일간 표지를 날짜별로 다시 볼 수 있는 이슈 앨범입니다.',
  alternates: { canonical: 'https://dechive.dev/issues' },
};

export default function IssuesPage() {
  const issues = getAllDailyIssues();
  const items = issues.map((issue) => ({
    issue,
    weeklyEdition: getWeeklyEditionByDate(issue.date),
  }));

  return <DailyIssuesAlbumClient items={items} />;
}
