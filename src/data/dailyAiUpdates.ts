import type { LocalizedText } from '@/data/dailyIssues';

export type DailyAiUpdateItem = {
  title: string;
  description: LocalizedText;
  href: string;
};

export type DailyAiUpdates = {
  date: string;
  label: LocalizedText;
  updates: DailyAiUpdateItem[];
};

export const dailyAiUpdates: DailyAiUpdates[] = [
  {
    date: '2026-06-18',
    label: {
      ko: '오늘의 AI 업데이트',
      en: 'AI UPDATE',
    },
    updates: [
      {
        title: 'Grok for PowerPoint',
        description: {
          ko: 'AI가 발표 자료 안으로 들어왔다',
          en: 'AI moved into slide decks',
        },
        href: '#',
      },
      {
        title: 'Facebook AI Mode',
        description: {
          ko: 'SNS 검색이 AI 요약으로 바뀐다',
          en: 'social search turns into AI summaries',
        },
        href: '#',
      },
      {
        title: 'OpenAI Deployment Simulation',
        description: {
          ko: 'AI 출시 전 위험을 미리 시뮬레이션한다',
          en: 'risks are tested before launch',
        },
        href: '#',
      },
    ],
  },
  {
    date: '2026-06-17',
    label: {
      ko: '오늘의 AI 업데이트',
      en: 'AI UPDATE',
    },
    updates: [
      {
        title: 'Grok for PowerPoint',
        description: {
          ko: 'AI가 발표 자료 안으로 들어왔다',
          en: 'AI moved into slide decks',
        },
        href: '#',
      },
      {
        title: 'Facebook AI Mode',
        description: {
          ko: 'SNS 검색이 AI 요약으로 바뀐다',
          en: 'social search turns into AI summaries',
        },
        href: '#',
      },
      {
        title: 'OpenAI Deployment Simulation',
        description: {
          ko: 'AI 출시 전 위험을 미리 시뮬레이션한다',
          en: 'risks are tested before launch',
        },
        href: '#',
      },
    ],
  },
  {
    date: '2026-06-16',
    label: {
      ko: '오늘의 AI 업데이트',
      en: 'AI UPDATE',
    },
    updates: [
      {
        title: 'AI Change',
        description: {
          ko: '이번 주 AI 변화',
          en: 'This week in AI change',
        },
        href: '#',
      },
    ],
  },
  {
    date: '2026-06-15',
    label: {
      ko: '오늘의 AI 업데이트',
      en: 'AI UPDATE',
    },
    updates: [
      {
        title: 'Verification Criteria',
        description: {
          ko: '답보다 기준을 남기기',
          en: 'Keep criteria, not just answers',
        },
        href: '#',
      },
    ],
  },
];
