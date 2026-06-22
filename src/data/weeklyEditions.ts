import type { DailyIssueBook, DailyIssueLink, LocalizedText } from '@/data/dailyIssues';

export type WeeklyEdition = {
  weekStart: string;
  weekEnd: string;
  label: LocalizedText;
  verification: DailyIssueLink;
  book?: DailyIssueBook;
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
  {
    weekStart: '2026-06-22',
    weekEnd: '2026-06-28',
    label: {
      ko: '6월 넷째 주',
      en: 'JUNE WEEK 04',
    },
    verification: {
      label: {
        ko: '검증 기록',
        en: 'VERIFICATION',
      },
      title: {
        ko: '데이터 분석은\n기업에만 필요한 것인가?',
        en: 'Is data analysis only for companies?',
      },
      href: '/deep-dive/data-analysis-beyond-business',
    },
    book: {
      label: {
        ko: '도서',
        en: 'BOOK',
      },
      title: {
        ko: '듀얼 브레인',
        en: 'Dual Brain',
      },
      author: '이선 몰릭',
      href: '/book/dual-brain',
      coverImage: '/images/books/2026-06-22.webp',
    },
  },
];
