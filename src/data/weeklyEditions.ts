import type { DailyIssueBook, DailyIssueLink, LocalizedText } from '@/data/dailyIssues';

export type WeeklyEdition = {
  weekStart: string;
  weekEnd: string;
  label: LocalizedText;
  verification: DailyIssueLink;
  book: DailyIssueBook;
};

export const weeklyEditions: WeeklyEdition[] = [
  {
    weekStart: '2026-06-15',
    weekEnd: '2026-06-21',
    label: {
      ko: '6월 셋째 주',
      en: 'JUNE WEEK 03',
    },
    verification: {
      label: {
        ko: '검증 기록',
        en: 'VERIFICATION',
      },
      title: {
        ko: '1인기업,\nAgile이 필요합니다',
        en: 'Solo companies need Agile',
      },
      href: '/deep-dive/ai-era-agile-verification',
    },
    book: {
      label: {
        ko: '도서',
        en: 'BOOK',
      },
      title: {
        ko: 'AI 버블이 온다',
        en: 'The AI Bubble Is Coming',
      },
      author: '아르빈드 나라야난, 사이쉬 카푸르',
      href: '/book/ai-bubble-is-coming',
      coverImage: '/images/books/2026-06-15.webp',
    },
  },
];
