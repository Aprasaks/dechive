import fs from 'fs';
import path from 'path';
import { dailyIssues, type DailyIssue, type DailyIssueLayout } from '@/data/dailyIssues';
import { dailyAiUpdates, type DailyAiUpdates } from '@/data/dailyAiUpdates';
import { weeklyEditions, type WeeklyEdition } from '@/data/weeklyEditions';
import { getArchivePosts, getDeepDivePosts, getPostBySlug } from '@/lib/posts';
import type { Post } from '@/types/archive';

const FALLBACK_COVER_IMAGE = '/images/bg.webp';
const TEMPLATE_LAYOUTS: DailyIssueLayout[] = [
  'classic-editorial',
  'big-question',
  'side-cover-lines',
];
const TEMPLATE_COVER_FILENAMES: Record<DailyIssueLayout, string> = {
  'classic-editorial': 'template-classic-editorial.webp',
  'big-question': 'template-big-question.webp',
  'side-cover-lines': 'template-side-cover-lines.webp',
};
const EMPTY_DAILY_AI_UPDATES: DailyAiUpdates = {
  date: '',
  label: {
    ko: '확인한 AI 업데이트',
    en: 'VERIFIED AI UPDATES',
  },
  updates: [],
};

function compareIssueDateDesc(a: DailyIssue, b: DailyIssue) {
  return b.date.localeCompare(a.date);
}

function getLayoutForDate(date: string): DailyIssueLayout {
  const day = Number(date.slice(-2));

  if (!Number.isFinite(day)) return 'classic-editorial';

  return TEMPLATE_LAYOUTS[day % TEMPLATE_LAYOUTS.length] ?? 'classic-editorial';
}

function getTemplateCoverImage(date: string, layout: DailyIssueLayout) {
  const month = date.slice(0, 7);
  const filename = TEMPLATE_COVER_FILENAMES[layout];

  return `/images/covers/${month}/${filename}`;
}

function getLatestConfiguredIssueDate() {
  return [...dailyIssues].sort(compareIssueDateDesc)[0]?.date ?? '';
}

function getAutoDailyIssuesFromContentPosts(): DailyIssue[] {
  const configuredIssueDates = new Set(dailyIssues.map((issue) => issue.date));
  const latestConfiguredDate = getLatestConfiguredIssueDate();
  const koPostsByDate = new Map<string, Post>();
  const enPostsBySlug = new Map(getArchivePosts('en').map((post) => [post.slug, post]));
  const enDeepDivePostsBySlug = new Map(getDeepDivePosts('en').map((post) => [post.slug, post]));

  for (const post of getDeepDivePosts('ko')) {
    if (post.date > latestConfiguredDate && !configuredIssueDates.has(post.date)) {
      koPostsByDate.set(post.date, post);
    }
  }

  for (const post of getArchivePosts('ko')) {
    if (post.date > latestConfiguredDate && !configuredIssueDates.has(post.date)) {
      koPostsByDate.set(post.date, post);
    }
  }

  return Array.from(koPostsByDate.values())
    .map((post) => {
      const layout = getLayoutForDate(post.date);
      const enPost = post.type === 'deepdive'
        ? enDeepDivePostsBySlug.get(post.slug)
        : enPostsBySlug.get(post.slug);
      const hrefBase = post.type === 'deepdive' ? 'deep-dive' : 'archive';

      return {
        id: post.date,
        date: post.date,
        coverImage: getTemplateCoverImage(post.date, layout),
        layout,
        question: {
          label: {
            ko: '오늘의 질문',
            en: 'QUESTION',
          },
          title: {
            ko: post.title,
            en: enPost?.title ?? post.title,
          },
          href: `/${hrefBase}/${post.slug}`,
        },
        theme: {
          text: '#1f1712',
          accent: '#a24f16',
          muted: '#5f5144',
        },
      };
    });
}

function getConfiguredAndAutoDailyIssues() {
  return [
    ...dailyIssues,
    ...getAutoDailyIssuesFromContentPosts(),
  ];
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

function getArchiveSlugFromHref(href: string) {
  const normalizedHref = href.replace(/^\/en/, '');
  const match = normalizedHref.match(/^\/archive\/([^/?#]+)/);

  return match?.[1] ?? null;
}

function getMonday(date: string) {
  const currentDate = new Date(`${date}T00:00:00Z`);
  const day = currentDate.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  currentDate.setUTCDate(currentDate.getUTCDate() + diff);

  return currentDate.toISOString().slice(0, 10);
}

function addDays(date: string, days: number) {
  const currentDate = new Date(`${date}T00:00:00Z`);
  currentDate.setUTCDate(currentDate.getUTCDate() + days);

  return currentDate.toISOString().slice(0, 10);
}

function getWeekLabel(weekStart: string) {
  const startDate = new Date(`${weekStart}T00:00:00Z`);
  const month = startDate.getUTCMonth() + 1;
  const weekNumber = Math.floor((startDate.getUTCDate() - 1) / 7) + 1;
  const koWeekLabels = ['첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째'];
  const enMonth = startDate.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' }).toUpperCase();
  const paddedWeekNumber = String(weekNumber).padStart(2, '0');

  return {
    ko: `${month}월 ${koWeekLabels[weekNumber - 1] ?? `${weekNumber}번째`} 주`,
    en: `${enMonth} WEEK ${paddedWeekNumber}`,
  };
}

function getAutoWeeklyEditionByDate(date: string): WeeklyEdition | null {
  const weekStart = getMonday(date);
  const weekEnd = addDays(weekStart, 6);
  const koDeepDive = getDeepDivePosts('ko').find((post) =>
    weekStart <= post.date && post.date <= weekEnd
  );

  if (!koDeepDive) return null;

  const enDeepDive = getPostBySlug(koDeepDive.slug, 'en');

  return {
    weekStart,
    weekEnd,
    label: getWeekLabel(weekStart),
    verification: {
      label: {
        ko: '검증 기록',
        en: 'VERIFICATION',
      },
      title: {
        ko: koDeepDive.title,
        en: enDeepDive?.title ?? koDeepDive.title,
      },
      href: `/deep-dive/${koDeepDive.slug}`,
    },
  };
}

function resolveQuestionTitle(issue: DailyIssue): DailyIssue {
  const slug = getArchiveSlugFromHref(issue.question.href);

  if (!slug) return issue;

  const koPost = getPostBySlug(slug, 'ko');
  const enPost = getPostBySlug(slug, 'en');

  if (!koPost && !enPost) return issue;

  return {
    ...issue,
    question: {
      ...issue.question,
      title: {
        ko: koPost?.title ?? issue.question.title.ko,
        en: enPost?.title ?? issue.question.title.en,
      },
    },
  };
}

function resolveDailyIssue(issue: DailyIssue): DailyIssue {
  return resolveQuestionTitle(resolveCoverImage(issue));
}

export function getAllDailyIssues(): DailyIssue[] {
  return getConfiguredAndAutoDailyIssues()
    .sort(compareIssueDateDesc)
    .map(resolveDailyIssue);
}

export function getLatestDailyIssue(): DailyIssue {
  const latestIssue = getAllDailyIssues()[0];

  if (!latestIssue) {
    throw new Error('No daily issues configured.');
  }

  return latestIssue;
}

export function getDailyIssueByDate(date: string): DailyIssue | null {
  const issue = getConfiguredAndAutoDailyIssues().find((dailyIssue) => dailyIssue.date === date);

  return issue ? resolveDailyIssue(issue) : null;
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
  const configuredWeeklyEdition = weeklyEditions.find((edition) =>
    edition.weekStart <= date && date <= edition.weekEnd
  );

  if (configuredWeeklyEdition) return configuredWeeklyEdition;

  return getAutoWeeklyEditionByDate(date);
}

export function getDailyAiUpdatesByDate(date: string): DailyAiUpdates {
  return dailyAiUpdates.find((updates) => updates.date === date) ?? {
    ...EMPTY_DAILY_AI_UPDATES,
    date,
  };
}
