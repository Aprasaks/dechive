import fs from 'fs';
import path from 'path';
import { dailyIssues, type DailyIssue } from '@/data/dailyIssues';
import { dailyAiUpdates, type DailyAiUpdates } from '@/data/dailyAiUpdates';
import { weeklyEditions, type WeeklyEdition } from '@/data/weeklyEditions';

const FALLBACK_COVER_IMAGE = '/images/bg.webp';
const EMPTY_DAILY_AI_UPDATES: DailyAiUpdates = {
  date: '',
  label: {
    ko: '오늘의 AI 업데이트',
    en: 'AI UPDATE',
  },
  updates: [],
};

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

export function getAllDailyIssues(): DailyIssue[] {
  return [...dailyIssues]
    .sort(compareIssueDateDesc)
    .map(resolveCoverImage);
}

export function getLatestDailyIssue(): DailyIssue {
  const latestIssue = getAllDailyIssues()[0];

  if (!latestIssue) {
    throw new Error('No daily issues configured.');
  }

  return latestIssue;
}

export function getDailyIssueByDate(date: string): DailyIssue | null {
  const issue = dailyIssues.find((dailyIssue) => dailyIssue.date === date);

  return issue ? resolveCoverImage(issue) : null;
}

export function getDailyIssueDates(): string[] {
  return getAllDailyIssues().map((issue) => issue.date);
}

export function getPreviousDailyIssue(date: string): DailyIssue | null {
  const olderIssues = getAllDailyIssues().filter((issue) => issue.date < date);

  return olderIssues[0] ?? null;
}

export function getNextDailyIssue(date: string): DailyIssue | null {
  const newerIssues = getAllDailyIssues()
    .filter((issue) => issue.date > date)
    .sort((a, b) => a.date.localeCompare(b.date));

  return newerIssues[0] ?? null;
}

export function getWeeklyEditionByDate(date: string): WeeklyEdition | null {
  return weeklyEditions.find((edition) =>
    edition.weekStart <= date && date <= edition.weekEnd
  ) ?? null;
}

export function getDailyAiUpdatesByDate(date: string): DailyAiUpdates {
  return dailyAiUpdates.find((updates) => updates.date === date) ?? {
    ...EMPTY_DAILY_AI_UPDATES,
    date,
  };
}
