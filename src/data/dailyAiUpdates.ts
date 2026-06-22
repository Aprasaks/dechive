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
    date: '2026-06-22',
    label: {
      ko: '오늘의 AI 업데이트',
      en: 'AI UPDATE',
    },
    updates: [
      {
        title: 'Zoom Workplace',
        description: {
          ko: 'AI가 회의와 문서 흐름 안으로 들어간다',
          en: 'AI moves deeper into meetings and documents',
        },
        href: '/ai-updates/2026-06-22',
      },
      {
        title: 'ZoomMate Workflow',
        description: {
          ko: '전화와 회의 요약이 AI 워크플로우의 시작점이 된다',
          en: 'calls and meeting summaries become workflow triggers',
        },
        href: '/ai-updates/2026-06-22',
      },
      {
        title: 'Google Cloud MCP',
        description: {
          ko: 'AI 애플리케이션이 클라우드 저장소 자원과 연결된다',
          en: 'AI apps connect to cloud storage resources',
        },
        href: '/ai-updates/2026-06-22',
      },
    ],
  },
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
