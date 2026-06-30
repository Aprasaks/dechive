import fs from 'fs';
import path from 'path';
import { dailyIssues, type DailyIssue, type DailyIssueLayout } from '@/data/dailyIssues';
import { dailyAiUpdates, type DailyAiUpdates } from '@/data/dailyAiUpdates';
import { weeklyEditions, type WeeklyEdition } from '@/data/weeklyEditions';
import { getArchivePosts, getPostBySlug } from '@/lib/posts';

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

function getAutoDailyIssuesFromArchivePosts(): DailyIssue[] {
  const configuredIssueDates = new Set(dailyIssues.map((issue) => issue.date));
  const latestConfiguredDate = getLatestConfiguredIssueDate();
  const enPostsBySlug = new Map(getArchivePosts('en').map((post) => [post.slug, post]));

  return getArchivePosts('ko')
    .filter((post) => post.date > latestConfiguredDate)
    .filter((post) => !configuredIssueDates.has(post.date))
    .map((post) => {
      const layout = getLayoutForDate(post.date);
      const enPost = enPostsBySlug.get(post.slug);

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
          href: `/archive/${post.slug}`,
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
    ...getAutoDailyIssuesFromArchivePosts(),
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
