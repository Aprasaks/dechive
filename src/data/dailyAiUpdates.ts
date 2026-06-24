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
    date: '2026-06-24',
    label: {
      ko: '오늘의 AI 업데이트',
      en: 'AI UPDATE',
    },
    updates: [
      {
        title: 'Claude Tag',
        description: {
          ko: 'Slack에서 Claude를 태그해 팀 작업을 맡긴다',
          en: 'Claude can be tagged for team work in Slack',
        },
        href: '/ai-updates/2026-06-24',
      },
      {
        title: 'Mistral OCR 4',
        description: {
          ko: '문서를 구조와 신뢰도까지 읽는다',
          en: 'documents are read with structure and confidence',
        },
        href: '/ai-updates/2026-06-24',
      },
      {
        title: 'Copilot CLI',
        description: {
          ko: '터미널이 이슈와 PR을 다루는 AI 작업 공간이 된다',
          en: 'the terminal becomes an AI workspace for issues and PRs',
        },
        href: '/ai-updates/2026-06-24',
      },
    ],
  },
  {
    date: '2026-06-23',
    label: {
      ko: '오늘의 AI 업데이트',
      en: 'AI UPDATE',
    },
    updates: [
      {
        title: 'ChatGPT Input',
        description: {
          ko: '긴 붙여넣기를 첨부파일처럼 정리한다',
          en: 'long paste input becomes attachment-like',
        },
        href: '/ai-updates/2026-06-23',
      },
      {
        title: 'OpenAI Security',
        description: {
          ko: 'AI 보안이 패치와 검증 자동화로 이동한다',
          en: 'AI security moves toward patch and verification',
        },
        href: '/ai-updates/2026-06-23',
      },
      {
        title: 'Claude Code MCP',
        description: {
          ko: 'MCP 인증과 CLI 워크플로우가 더 깊게 연결된다',
          en: 'MCP auth and CLI workflows become deeper',
        },
        href: '/ai-updates/2026-06-23',
      },
    ],
  },
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
