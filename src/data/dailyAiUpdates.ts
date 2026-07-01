import type { LocalizedText } from '@/data/dailyIssues';

export type DailyAiUpdateItem = {
  title: string;
  description: LocalizedText;
  href: string;
};

export type DailyAiUpdates = {
  date: string;
  officialDate?: string;
  checkedDateKST?: string;
  label: LocalizedText;
  updates: DailyAiUpdateItem[];
};

export const dailyAiUpdates: DailyAiUpdates[] = [
  {
    date: '2026-07-01',
    officialDate: '2026-06-30',
    checkedDateKST: '2026-07-01',
    label: {
      ko: '확인한 AI 업데이트',
      en: 'VERIFIED AI UPDATES',
    },
    updates: [
      {
        title: 'Model / Agent',
        description: {
          ko: 'Claude Sonnet 5와 Copilot 모델 제공으로 에이전트형 AI가 일상 개발 도구 안으로 들어간다',
          en: 'Claude Sonnet 5 and Copilot availability move agentic AI into everyday developer tools',
        },
        href: '/ai-updates/2026-06-30',
      },
      {
        title: 'Research / Verification',
        description: {
          ko: 'Claude Science, GeneBench-Pro, Core dump epidemiology를 연구 작업대와 검증 기록으로 분리한다',
          en: 'Claude Science, GeneBench-Pro, and core dump epidemiology are separated as research workbench and verification records',
        },
        href: '/ai-updates/2026-06-30',
      },
      {
        title: 'Enterprise Control',
        description: {
          ko: 'Fable 5 재배포와 AI credit budget은 접근 정책과 비용 거버넌스 흐름으로 기록한다',
          en: 'Fable 5 redeployment and AI credit budgets are tracked as access policy and cost governance',
        },
        href: '/ai-updates/2026-06-30',
      },
    ],
  },
  {
    date: '2026-06-30',
    officialDate: '2026-06-29',
    checkedDateKST: '2026-06-30',
    label: {
      ko: '확인한 AI 업데이트',
      en: 'VERIFIED AI UPDATES',
    },
    updates: [
      {
        title: 'OpenAI Workforce Research',
        description: {
          ko: '유럽 노동시장에서 AI가 만들 변화 압력을 제품 출시가 아닌 연구/분석 자료로 기록한다',
          en: 'AI workforce pressure in Europe is recorded as research, not a product launch',
        },
        href: '/ai-updates/2026-06-29',
      },
      {
        title: 'Copilot / Codex Control',
        description: {
          ko: 'Claude Opus 4.8 fast mode preview와 Codex Permission Profiles beta를 구분한다',
          en: 'Claude Opus 4.8 fast mode preview and Codex Permission Profiles beta are separated',
        },
        href: '/ai-updates/2026-06-29',
      },
      {
        title: 'Gemini / Anthropic Status',
        description: {
          ko: '기업 데이터 실행 범위와 Opus 4.5 안정성 이슈를 기능 업데이트와 분리해 본다',
          en: 'enterprise action boundaries and Opus 4.5 reliability status are tracked separately',
        },
        href: '/ai-updates/2026-06-29',
      },
    ],
  },
  {
    date: '2026-06-29',
    officialDate: '2026-06-28',
    checkedDateKST: '2026-06-29',
    label: {
      ko: '확인한 AI 업데이트',
      en: 'VERIFIED AI UPDATES',
    },
    updates: [
      {
        title: 'No Major Launch',
        description: {
          ko: '대형 새 모델이나 일반 사용자용 새 기능 출시는 확인되지 않았다',
          en: 'no major new model or consumer product launch was confirmed',
        },
        href: '/ai-updates/2026-06-28',
      },
      {
        title: 'OpenAI × HP Frontier',
        description: {
          ko: 'AI가 파일럿을 넘어 기업 운영 모델로 들어가는 사례로 기록한다',
          en: 'AI moves from pilot usage into an enterprise operating model',
        },
        href: '/ai-updates/2026-06-28',
      },
      {
        title: 'Anthropic Status',
        description: {
          ko: '6월 28일 신규 incident 없음으로 짧게 상태 기록을 남긴다',
          en: 'June 28 is recorded as a no-incident status watch',
        },
        href: '/ai-updates/2026-06-28',
      },
    ],
  },
  {
    date: '2026-06-28',
    officialDate: '2026-06-27',
    checkedDateKST: '2026-06-28',
    label: {
      ko: '확인한 AI 업데이트',
      en: 'VERIFIED AI UPDATES',
    },
    updates: [
      {
        title: 'No Major Launch',
        description: {
          ko: '대형 새 기능 출시가 확인되지 않은 날도 검증 로그로 남긴다',
          en: 'a day without a major launch is still recorded as a verification log',
        },
        href: '/ai-updates/2026-06-27',
      },
      {
        title: 'GPT-4.5 Retirement',
        description: {
          ko: 'ChatGPT 종료 시행과 공식 문서 날짜 차이를 함께 기록한다',
          en: 'ChatGPT retirement and official date discrepancy are recorded together',
        },
        href: '/ai-updates/2026-06-27',
      },
      {
        title: 'Opus 4.8 Status',
        description: {
          ko: 'elevated errors는 기능 출시가 아니라 안정성 이슈로 분리한다',
          en: 'elevated errors are tracked as reliability status, not a feature launch',
        },
        href: '/ai-updates/2026-06-27',
      },
    ],
  },
  {
    date: '2026-06-27',
    officialDate: '2026-06-26',
    checkedDateKST: '2026-06-27',
    label: {
      ko: '확인한 AI 업데이트',
      en: 'VERIFIED AI UPDATES',
    },
    updates: [
      {
        title: 'GPT-5.6 Sol',
        description: {
          ko: '강한 모델을 제한 프리뷰와 안전장치 속에서 공개한다',
          en: 'a stronger model enters limited preview with safeguards',
        },
        href: '/ai-updates/2026-06-26',
      },
      {
        title: 'ChatGPT Dictation',
        description: {
          ko: '음성 입력 정확도가 다국어와 소음 환경에서 개선된다',
          en: 'dictation improves across languages and noisy settings',
        },
        href: '/ai-updates/2026-06-26',
      },
      {
        title: 'GitHub Desktop 3.6',
        description: {
          ko: 'Copilot이 커밋과 충돌 해결 흐름 안으로 들어간다',
          en: 'Copilot moves into commits and merge conflict workflows',
        },
        href: '/ai-updates/2026-06-26',
      },
    ],
  },
  {
    date: '2026-06-26',
    officialDate: '2026-06-25',
    checkedDateKST: '2026-06-26',
    label: {
      ko: '확인한 AI 업데이트',
      en: 'VERIFIED AI UPDATES',
    },
    updates: [
      {
        title: 'Codex Remote',
        description: {
          ko: '모바일과 원격 워크스페이스로 AI 코딩이 확장된다',
          en: 'AI coding expands into mobile and remote workspaces',
        },
        href: '/ai-updates/2026-06-25',
      },
      {
        title: 'Business Memory',
        description: {
          ko: '업무 맥락을 기억하되 사용자가 확인하고 관리한다',
          en: 'work memory becomes visible and manageable',
        },
        href: '/ai-updates/2026-06-25',
      },
      {
        title: 'Copilot for Jira',
        description: {
          ko: 'AI가 코드 밖의 이슈 관리 흐름으로 들어간다',
          en: 'AI moves into issue-management workflows',
        },
        href: '/ai-updates/2026-06-25',
      },
    ],
  },
  {
    date: '2026-06-25',
    officialDate: '2026-06-24',
    checkedDateKST: '2026-06-25',
    label: {
      ko: '확인한 AI 업데이트',
      en: 'VERIFIED AI UPDATES',
    },
    updates: [
      {
        title: 'GPT-5.5 Instant',
        description: {
          ko: '조건과 반박을 따라가는 대화 품질 업데이트',
          en: 'conversation quality improves for constraints and pushback',
        },
        href: '/ai-updates/2026-06-24',
      },
      {
        title: 'Gemini Computer Use',
        description: {
          ko: '컴퓨터 환경을 사용하는 도구 공개 프리뷰',
          en: 'computer use tool enters public preview',
        },
        href: '/ai-updates/2026-06-24',
      },
      {
        title: 'Jalapeño Inference',
        description: {
          ko: 'LLM 추론 인프라 경쟁으로 확장된다',
          en: 'AI competition expands into inference infrastructure',
        },
        href: '/ai-updates/2026-06-24',
      },
    ],
  },
  {
    date: '2026-06-24',
    officialDate: '2026-06-23',
    checkedDateKST: '2026-06-24',
    label: {
      ko: '확인한 AI 업데이트',
      en: 'VERIFIED AI UPDATES',
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
    date: '2026-06-23',
    officialDate: '2026-06-22',
    checkedDateKST: '2026-06-23',
    label: {
      ko: '확인한 AI 업데이트',
      en: 'VERIFIED AI UPDATES',
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
    date: '2026-06-22',
    label: {
      ko: '확인한 AI 업데이트',
      en: 'VERIFIED AI UPDATES',
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
      ko: '확인한 AI 업데이트',
      en: 'VERIFIED AI UPDATES',
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
      ko: '확인한 AI 업데이트',
      en: 'VERIFIED AI UPDATES',
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
      ko: '확인한 AI 업데이트',
      en: 'VERIFIED AI UPDATES',
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
      ko: '확인한 AI 업데이트',
      en: 'VERIFIED AI UPDATES',
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
