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
  href?: string;
  basis?: 'official' | 'global';
  label: LocalizedText;
  updates: DailyAiUpdateItem[];
};

export const dailyAiUpdates: DailyAiUpdates[] = [
  {
    date: '2026-07-05',
    officialDate: '2026-07-04',
    checkedDateKST: '2026-07-05',
    href: '/ai-updates/2026-07-04',
    basis: 'global',
    label: {
      ko: 'AI는 사용 방식과 책임의 문제로',
      en: 'AI moves into usage context and responsibility',
    },
    updates: [
      {
        title: 'Adoption / Small Business',
        description: {
          ko: 'Reuters는 AI가 소규모 비AI 창업자의 학습, 사업계획, 투자자 피치 준비를 도우며 실행 비용을 낮추는 사례를 보도했다',
          en: 'Reuters reported how AI helped a small non-AI business lower the cost of learning, business planning, and investor pitch preparation',
        },
        href: '/ai-updates/2026-07-04#small-business-ai-quick-start-expansion',
      },
      {
        title: 'Legal / Evidence',
        description: {
          ko: 'TechCrunch는 Midjourney가 할리우드 스튜디오의 AI 사용 내역 공개를 더 넓게 요구하고 있다고 보도했다',
          en: 'TechCrunch reported that Midjourney is seeking broader disclosure of Hollywood studios’ AI usage in copyright litigation',
        },
        href: '/ai-updates/2026-07-04#midjourney-hollywood-ai-usage-discovery',
      },
      {
        title: 'Culture / Advertising',
        description: {
          ko: 'Google의 독립기념일 AI 광고 반응은 AI가 역사적 상징과 인간 협업 안으로 들어갈 때 생기는 문화적 긴장을 보여준다',
          en: 'Reactions to Google’s Independence Day AI ad show cultural tension when AI enters historical symbols and human collaboration',
        },
        href: '/ai-updates/2026-07-04#google-declaration-independence-ai-ad-reaction',
      },
    ],
  },
  {
    date: '2026-07-04',
    officialDate: '2026-07-03',
    checkedDateKST: '2026-07-04',
    href: '/ai-updates/2026-07-03',
    basis: 'global',
    label: {
      ko: 'AI는 자본·노동·법·인프라로',
      en: 'AI moves into capital, labor, law, and infrastructure',
    },
    updates: [
      {
        title: 'Capital / Video',
        description: {
          ko: 'Kling AI의 대규모 투자 유치는 AI 영상 생성이 자본시장과 산업 인프라 안으로 들어가고 있음을 보여준다',
          en: 'Kling AI’s reported fundraise shows AI video generation moving into capital markets and industrial infrastructure',
        },
        href: '/ai-updates/2026-07-03#kuaishou-kling-ai-fundraise',
      },
      {
        title: 'Labor / Governance',
        description: {
          ko: '인도 IT 산업의 AI 채용 증가와 아르헨티나 AI 운영 기업 법제 논의는 AI가 역할 구조, 인간 감독, 법적 책임을 다시 묻게 만든다',
          en: 'India’s AI hiring shift and Argentina’s AI-run company debate ask how roles, human oversight, and legal responsibility change',
        },
        href: '/ai-updates/2026-07-03#india-it-ai-hiring-workforce-shift',
      },
      {
        title: 'Security / Infrastructure',
        description: {
          ko: 'Alibaba의 Claude Code 사용 금지 보도와 Deutz의 전력 수요 전망은 AI가 기업 보안과 물리 인프라의 문제로 확장되고 있음을 보여준다',
          en: 'Alibaba’s reported Claude Code ban and Deutz’s power-demand outlook show AI expanding into enterprise security and physical infrastructure',
        },
        href: '/ai-updates/2026-07-03#alibaba-claude-code-ban-compliance',
      },
    ],
  },
  {
    date: '2026-07-03',
    officialDate: '2026-07-02',
    checkedDateKST: '2026-07-03',
    href: '/ai-updates/2026-07-02',
    basis: 'official',
    label: {
      ko: 'AI는 운영과 통제 안으로',
      en: 'AI moves into operations and control',
    },
    updates: [
      {
        title: 'Safety / Policy',
        description: {
          ko: 'Anthropic은 Fable 5의 사이버 safeguard와 jailbreak 평가 기준을 공개하며 강한 모델의 신뢰가 안전 기준과 함께 검증되어야 함을 보여준다',
          en: 'Anthropic detailed Fable 5 safeguards and jailbreak severity criteria, showing that stronger models must be verified through safety criteria as well as capability',
        },
        href: '/ai-updates/2026-07-02#anthropic-fable-5-safeguards-jailbreak-framework',
      },
      {
        title: 'Enterprise Implementation',
        description: {
          ko: 'Microsoft Frontier Company는 기업 AI가 단순 도구 구독이 아니라 구현·보안·거버넌스·성과 관리의 문제로 이동했음을 보여준다',
          en: 'Microsoft Frontier Company frames enterprise AI as implementation, security, governance, and outcome management rather than tool subscription',
        },
        href: '/ai-updates/2026-07-02#microsoft-frontier-company-ai-engineering',
      },
      {
        title: 'Copilot Operations',
        description: {
          ko: 'GitHub Copilot 업데이트는 agent 관측성, 모델 생명주기, 사용량 측정, Actions 인증, AI credit 통제를 개발자 도구 운영 문제로 묶는다',
          en: 'GitHub Copilot updates connect agent observability, model lifecycle, usage metrics, Actions auth, and AI credit control as developer-tool operations',
        },
        href: '/ai-updates/2026-07-02#github-copilot-agent-session-streaming-public-preview',
      },
    ],
  },
  {
    date: '2026-07-02',
    officialDate: '2026-07-01',
    checkedDateKST: '2026-07-02',
    href: '/ai-updates/2026-07-01',
    basis: 'global',
    label: {
      ko: 'AI는 더 깊이 작업 안으로',
      en: 'AI moves deeper into work',
    },
    updates: [
      {
        title: 'Anthropic Access / Workbench',
        description: {
          ko: 'Fable 5 재배포와 Sonnet 5, Claude Science는 고성능 AI가 접근 조건, 보안 기준, 개발·연구 환경 안으로 들어가는 흐름이다',
          en: 'Fable 5 redeployment, Sonnet 5, and Claude Science show advanced AI moving into access rules, security criteria, and work environments',
        },
        href: '/ai-updates/2026-07-01#anthropic-fable-5-global-redeployment',
      },
      {
        title: 'Gemini Omni Flash',
        description: {
          ko: '텍스트와 이미지는 짧은 영상 제작 흐름으로 연결된다. 이미지는 빨라지고 영상은 쉬워지지만, 메시지의 선명함은 사람이 검증해야 한다',
          en: 'text and images connect into short video workflows; images get faster and video gets easier, but people still verify the message',
        },
        href: '/ai-updates/2026-07-01#google-gemini-omni-flash-creative-flow',
      },
      {
        title: 'OpenAI Risk / Responsibility',
        description: {
          ko: 'ChatGPT 관련 소송 이슈는 AI가 판단과 감정에 깊이 관여할 때, 무엇을 믿고 어디서 멈춰 검증할지 다시 묻는다',
          en: 'ChatGPT-related litigation asks what to trust and where to stop for verification when AI enters judgment and emotion',
        },
        href: '/ai-updates/2026-07-01#openai-chatgpt-risk-responsibility-watch',
      },
    ],
  },
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
