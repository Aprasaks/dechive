import fs from 'fs';
import path from 'path';
import { dailyIssues, type DailyIssue } from '@/data/dailyIssues';

const FALLBACK_COVER_IMAGE = '/images/bg.webp';

function compareIssueDateDesc(a: DailyIssue, b: DailyIssue) {
  return b.date.localeCompare(a.date);
}

function resolveCoverImage(issue: DailyIssue): DailyIssue {
  const imagePath = issue.coverImage.startsWith('/')
    ? issue.coverImage.slice(1)
    : issue.coverImage;
  const publicPath = path.join(process.cwd(), 'public', imagePath);

  if (fs.existsSync(publicPath)) {
    return issue;
  }

  return {
    ...issue,
    coverImage: FALLBACK_COVER_IMAGE,
  };
}

export function getLatestDailyIssue(): DailyIssue {
  const latestIssue = [...dailyIssues].sort(compareIssueDateDesc)[0];

  if (!latestIssue) {
    throw new Error('No daily issues configured.');
  }

  return resolveCoverImage(latestIssue);
}

export function getDailyIssueByDate(date: string): DailyIssue | null {
  const issue = dailyIssues.find((dailyIssue) => dailyIssue.date === date);

  return issue ? resolveCoverImage(issue) : null;
}

export function getDailyIssueDates(): string[] {
  return dailyIssues
    .map((issue) => issue.date)
    .sort((a, b) => b.localeCompare(a));
}
