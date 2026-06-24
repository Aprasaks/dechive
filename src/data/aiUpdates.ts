export type AiUpdateBadge =
  | 'Official Source'
  | 'Official Changelog'
  | 'Image Available'
  | 'Limited Image'
  | 'No Product Image'
  | 'Explainer'
  | 'Feature Update'
  | 'Product Integration'
  | 'Workflow Update'
  | 'Agentic Workflow'
  | 'Security / Governance'
  | 'Creative AI'
  | 'MCP'
  | 'Platform Integration'
  | 'Documentation Update'
  | 'Enterprise AI'
  | 'Official Screen Available'
  | 'Official Screen Not Confirmed'
  | 'Explanation Image Recommended'
  | 'Product Update'
  | 'Security Update'
  | 'Cyber Defense'
  | 'Developer Tool'
  | 'CLI Workflow'
  | 'Business Automation'
  | 'AI Operations'
  | 'Team AI'
  | 'Slack Agent'
  | 'Model Update'
  | 'Document Intelligence'
  | 'Security'
  | 'Organization Control'
  | 'Code Quality'
  | 'BYOK'
  | 'Model Provider'
  | 'Case Study'
  | 'Status Watch'
  | 'API'
  | 'Agentic Coding'
  | 'Bug Fix'
  | 'Copilot Reliability';

export interface AiUpdateItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  badges: AiUpdateBadge[];
  detailHref: string;
  source: {
    label: string;
    url: string;
    description: string;
  };
  whatChanged: string;
  useCriteria: string;
  verificationNotes: string[];
  image: {
    status: 'available' | 'limited' | 'none';
    src?: string;
    alt?: string;
    caption: string;
  };
}

export interface AiUpdateDay {
  date: string;
  title?: string;
  subtitle?: string;
  quickSummary?: string[];
  groups?: AiUpdateGroup[];
  verificationNote?: string;
  closingLine?: string;
  updates: AiUpdateItem[];
}

export interface AiUpdateGroup {
  name: string;
  intro: string;
  updates: AiUpdateBriefingItem[];
}

export interface AiUpdateBriefingItem {
  id: string;
  title: string;
  officialDate: string;
  checkedDateKST?: string;
  sourceType: string;
  officialSource?: {
    label: string;
    url: string;
  };
  updateType: string;
  badges: AiUpdateBadge[];
  summary: string;
  whatChanged: string;
  whyItMatters: string;
  dechiveView: string;
  readerTakeaway: string;
  screenMaterialStatus: string;
  cautionNote: string;
}

export const AI_UPDATES_MONTH = '2026.06';

export const aiUpdateDays: AiUpdateDay[] = [
  {
    date: '2026-06-24',
    title: 'AI가 팀 협업, 터미널, 문서 처리, 코드 보안 안으로 들어간 날',
    subtitle: '오늘의 업데이트는 새 챗봇 출시가 아니라, AI가 팀 협업 공간에서 호출되고, 문서의 구조를 읽고, 터미널에서 이슈와 PR을 다루고, 조직의 모델·보안 정책 안에서 작동하기 시작했다는 점이 핵심이다.',
    quickSummary: [
      'Anthropic은 Slack 안에서 Claude를 태그해 팀 작업을 맡기는 Claude Tag를 공개했고, Mistral은 OCR 4로 문서 구조와 신뢰도까지 읽는 방향을 보여줬다.',
      'Claude Code와 GitHub Copilot CLI는 터미널, MCP, 조직 제어, 이슈와 PR 작업 흐름 안으로 AI를 더 깊게 넣고 있다.',
      'GitHub Code Quality, Visual Studio/SSMS, Gemini 문서, OpenAI 사례, Anthropic Status는 기능 출시와 문서·사례·상태 기록을 구분해 보조 항목으로 다룬다.',
    ],
    groups: [
      {
        name: 'Anthropic',
        intro: 'AI가 별도 채팅창이 아니라 팀 협업 공간 안에서 호출되는 흐름이다.',
        updates: [
          {
            id: 'anthropic-claude-tag',
            title: 'Anthropic Claude Tag — Slack에서 Claude를 태그해 일을 맡기는 팀 AI',
            officialDate: '2026.06.23',
            checkedDateKST: '2026.06.24',
            sourceType: 'Official Blog',
            officialSource: {
              label: 'Anthropic — Introducing Claude Tag',
              url: 'https://www.anthropic.com/news/introducing-claude-tag',
            },
            updateType: 'Product Update / Team AI / Slack Agent',
            badges: ['Product Update', 'Team AI', 'Slack Agent', 'Official Source', 'Official Screen Not Confirmed'],
            summary: 'Anthropic이 Claude Tag를 공개했다. Slack에서 @Claude를 태그하면 Claude가 요청을 단계로 나누고, 접근 가능한 도구를 사용해 작업한 뒤, Slack 스레드에 결과를 남긴다.',
            whatChanged: 'AI가 별도 채팅창에서만 작동하는 것이 아니라, 팀이 실제로 협업하는 Slack 스레드 안에서 호출되고 작업을 수행하는 형태로 들어왔다.',
            whyItMatters: '팀 협업에서 중요한 것은 단순 답변이 아니라, 대화 맥락 안에서 요청을 이해하고, 필요한 작업을 분해하고, 결과를 다시 같은 스레드에 남기는 것이다.',
            dechiveView: '이 업데이트는 “AI 비서가 더 똑똑해졌다”보다 “AI의 위치가 바뀌었다”는 점이 중요하다. AI가 별도 창에 있는 도구에서, 팀이 실제로 일하는 협업 공간 안의 작업자로 이동하고 있다.',
            readerTakeaway: '이제 팀은 Slack에서 사람을 태그하듯 Claude를 태그해 일을 맡길 수 있다.',
            screenMaterialStatus: 'Slack 안에서 @Claude가 태그되고 스레드에 결과를 남기는 공식 화면이 있으면 가장 적합하다. 공식 화면이 명확하지 않으면 Slack 스레드 안에서 AI가 작업 결과를 남기는 설명 이미지가 적합하다.',
            cautionNote: '모든 Claude 사용자에게 제공되는 일반 기능처럼 쓰지 않는다. 현재는 Claude Enterprise와 Team 고객 대상 베타라는 점을 명확히 한다.',
          },
        ],
      },
      {
        name: 'Mistral',
        intro: '문서를 단순 텍스트가 아니라 구조와 신뢰도를 가진 데이터로 읽는 업데이트다.',
        updates: [
          {
            id: 'mistral-ocr-4',
            title: 'Mistral OCR 4 — 문서를 구조와 신뢰도까지 읽는 AI',
            officialDate: '2026.06.23',
            checkedDateKST: '2026.06.24',
            sourceType: 'Official Blog',
            officialSource: {
              label: 'Mistral AI — Mistral OCR 4',
              url: 'https://mistral.ai/news/ocr-4/',
            },
            updateType: 'Model Update / Document Intelligence',
            badges: ['Model Update', 'Document Intelligence', 'Official Source', 'Explanation Image Recommended'],
            summary: 'Mistral이 OCR 4를 공개했다. 이 모델은 추출된 텍스트와 함께 bounding boxes, block classification, inline confidence scores를 제공한다.',
            whatChanged: 'OCR이 단순 텍스트 추출 도구에서, 문서의 위치·구조·블록 유형·신뢰도까지 남기는 문서 이해 파이프라인으로 확장되고 있다.',
            whyItMatters: 'AI 검색이나 RAG 시스템에서 문서를 넣을 때 단순 텍스트만 추출하면 구조와 맥락이 사라질 수 있다. 어느 위치에서 어떤 정보가 나왔고 얼마나 신뢰할 수 있는지를 함께 남기는 것은 AI 검증에 중요하다.',
            dechiveView: 'AI가 답을 만들기 전에, 무엇을 근거로 읽었는지 기록해야 한다. 문서 구조와 신뢰도는 “AI가 읽었다”는 말을 검증 가능한 형태로 바꾸는 요소다.',
            readerTakeaway: '문서 AI는 이제 글자만 읽는 것이 아니라, 문서의 구조와 신뢰도까지 함께 남기는 방향으로 가고 있다.',
            screenMaterialStatus: '문서 페이지 위에 bounding box와 confidence score가 표시된 공식 이미지가 있으면 가장 적합하다. 공식 화면이 없으면 문서 → 구조화된 데이터 → RAG 입력 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '단순 OCR 성능 자랑처럼 쓰지 않는다. 핵심은 문서 추출 결과를 검증 가능한 구조로 남긴다는 점이다.',
          },
        ],
      },
      {
        name: 'Claude Code',
        intro: 'AI 코딩 도구가 자동 작업 환경의 보안, 조직 제어, MCP 안정성을 강화하는 흐름이다.',
        updates: [
          {
            id: 'claude-code-2-1-187-security-control',
            title: 'Claude Code 2.1.187 — 자동 작업 환경의 보안과 조직 제어 강화',
            officialDate: '2026.06.23',
            checkedDateKST: '2026.06.24',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'Claude Code changelog',
              url: 'https://code.claude.com/docs/en/changelog',
            },
            updateType: 'Developer Tool / Security / CLI Workflow / MCP / Organization Control',
            badges: ['Developer Tool', 'Security', 'CLI Workflow', 'MCP', 'Organization Control', 'Official Source'],
            summary: 'Claude Code 2.1.187에는 sandbox.credentials, 조직 제한 모델 표시/차단, remote MCP tool call timeout, 한국어/CJK 붙여넣기 수정이 포함됐다.',
            whatChanged: 'Claude Code가 더 많은 작업을 자동으로 수행하는 만큼, 비밀정보 접근 차단, 조직 정책 반영, 원격 도구 멈춤 처리, 다국어 터미널 입력 안정성이 강화됐다.',
            whyItMatters: 'AI 코딩 도구는 파일을 고치고, 명령어를 실행하고, 외부 도구와 연결된다. secret, credential, 조직 모델 정책, 원격 도구 장애를 제대로 다루지 못하면 실제 프로젝트에 문제가 생길 수 있다.',
            dechiveView: '좋은 AI 코딩 도구는 코드를 잘 만드는 것만으로 충분하지 않다. 비밀정보를 지키고, 조직의 정책을 따르고, 멈춘 도구를 무한히 기다리지 않고, 다양한 언어 입력을 안정적으로 처리해야 한다.',
            readerTakeaway: 'AI 코딩 도구는 더 강력해질수록, 보안과 조직 제어가 더 중요해진다.',
            screenMaterialStatus: 'CLI 업데이트라 실제 제품 화면보다는 터미널 화면 또는 AI 작업 환경 ↔ 보안 정책 ↔ 외부 MCP 도구 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '비전공자에게는 세부 명령어보다 “AI 코딩 도구가 비밀정보와 조직 정책을 더 조심스럽게 다루게 됐다”는 흐름으로 설명한다.',
          },
        ],
      },
      {
        name: 'GitHub',
        intro: '터미널과 모델 공급자 선택, 코드 품질 API가 AI 개발 흐름 안으로 들어오는 업데이트다.',
        updates: [
          {
            id: 'github-copilot-cli-terminal-ga',
            title: 'GitHub Copilot CLI — 새 터미널 인터페이스 정식 출시',
            officialDate: '2026.06.23',
            checkedDateKST: '2026.06.24',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Copilot CLI new terminal interface',
              url: 'https://github.blog/changelog/2026-06-23-copilot-cli-new-terminal-interface-is-generally-available/',
            },
            updateType: 'Developer Tool / CLI Workflow / Agentic Coding',
            badges: ['Developer Tool', 'CLI Workflow', 'Agentic Coding', 'Official Source', 'Official Screen Available'],
            summary: 'GitHub이 Copilot CLI의 새 터미널 인터페이스를 정식 출시했다. 터미널 안에서 Issues, Pull requests, Gists를 탭으로 탐색하고 Copilot 프롬프트에 참조로 넣을 수 있다.',
            whatChanged: '터미널이 단순 명령어 입력창에서, 이슈·PR·MCP·스킬·플러그인을 다루는 AI 작업 공간으로 확장되고 있다.',
            whyItMatters: '개발자는 이미 터미널에서 많은 작업을 한다. Copilot CLI가 터미널 안에서 이슈와 PR을 참조하고, MCP와 플러그인을 구성할 수 있게 되면 AI가 개발 흐름 안으로 더 깊게 들어온다.',
            dechiveView: 'AI 코딩 도구의 경쟁은 “누가 더 좋은 답변을 하느냐”에서 “어디에서 작업을 이어갈 수 있느냐”로 이동하고 있다.',
            readerTakeaway: 'AI 코딩 도구는 이제 IDE뿐 아니라 터미널 안에서도 이슈와 PR을 다루는 작업 환경이 되고 있다.',
            screenMaterialStatus: 'GitHub Copilot CLI의 새 터미널 UI 공식 화면이 있으면 적합하다. 공식 화면이 없으면 터미널 안에서 Issue/PR/MCP가 연결되는 설명 이미지가 적합하다.',
            cautionNote: '이 기능은 개발자용 업데이트다. 일반 독자에게는 “터미널 안에서 AI가 이슈와 PR을 참고해 작업을 돕는 기능”으로 풀어 설명한다.',
          },
          {
            id: 'github-copilot-app-byok',
            title: 'GitHub Copilot App — BYOK 지원',
            officialDate: '2026.06.23',
            checkedDateKST: '2026.06.24',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Copilot App BYOK',
              url: 'https://github.blog/changelog/2026-06-23-github-copilot-app-support-for-byok/',
            },
            updateType: 'Product Update / BYOK / Model Provider / Enterprise AI',
            badges: ['Product Update', 'BYOK', 'Model Provider', 'Enterprise AI', 'Official Source'],
            summary: 'GitHub Copilot App이 BYOK를 지원하기 시작했다. 사용자는 OpenAI, Azure OpenAI, Microsoft Foundry, Anthropic, LM Studio, Ollama, OpenAI-compatible endpoint 같은 공급자를 연결할 수 있다.',
            whatChanged: 'Copilot App이 기본 제공 모델만 쓰는 구조에서, 사용자가 가진 모델 키나 로컬 모델, 호환 엔드포인트를 연결할 수 있는 구조로 확장된다.',
            whyItMatters: '기업이나 개인 개발자는 비용, 보안, 데이터 정책, 모델 성능에 따라 다른 모델을 선택하고 싶어 한다. BYOK는 AI 코딩 도구가 하나의 모델에 묶이지 않고 사용자의 모델 환경과 연결되는 방향을 보여준다.',
            dechiveView: 'AI 도구는 점점 “하나의 모델을 쓰는 서비스”에서 “여러 모델과 연결되는 작업 환경”으로 변하고 있다.',
            readerTakeaway: 'AI 코딩 도구는 이제 기본 모델만 쓰는 것이 아니라, 내가 가진 모델 키와 로컬 모델을 연결하는 방향으로 가고 있다.',
            screenMaterialStatus: 'Copilot App의 모델 공급자 설정 화면이 공식적으로 공개되어 있으면 적합하다. 없으면 모델 공급자 → Copilot App → 작업 세션 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: 'BYOK는 “무료로 모든 모델을 쓸 수 있다”는 뜻이 아니다. 사용자가 직접 가진 키나 호환 엔드포인트를 연결하는 기능으로 설명한다.',
          },
          {
            id: 'github-code-quality-findings-api',
            title: 'GitHub Code Quality — Findings REST API 공개 프리뷰',
            officialDate: '2026.06.23',
            checkedDateKST: '2026.06.24',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Code Quality findings REST API',
              url: 'https://github.blog/changelog/2026-06-23-fetch-code-quality-findings-via-rest-api/',
            },
            updateType: 'Code Quality / API / Agentic Remediation',
            badges: ['Code Quality', 'API', 'Official Source', 'Explanation Image Recommended'],
            summary: 'GitHub이 Code Quality findings를 조회하는 REST API를 공개 프리뷰로 제공하기 시작했다.',
            whatChanged: '코드 품질 검사 결과가 UI 안에만 머무르지 않고, API를 통해 자동화 도구와 AI 수정 워크플로우가 읽을 수 있는 데이터가 된다.',
            whyItMatters: 'AI가 코드 품질 문제를 고치려면 먼저 어떤 문제가 있는지 구조화된 데이터로 읽을 수 있어야 한다. Findings API는 AI 기반 수정 흐름의 입력 데이터가 될 수 있다.',
            dechiveView: 'AI 코드 수정은 갑자기 코드를 고치는 것이 아니다. 먼저 문제를 읽고, 분류하고, 수정할 위치를 찾고, 그 결과를 검증해야 한다.',
            readerTakeaway: '코드 품질 결과가 AI와 자동화 도구가 읽을 수 있는 데이터로 열리고 있다.',
            screenMaterialStatus: 'API 업데이트이므로 실제 제품 화면보다는 Code Quality findings → REST API → 자동 수정 워크플로우 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '이 기능은 공개 프리뷰다. 정식 일반 기능처럼 단정하지 말고 Preview로 표기한다.',
          },
        ],
      },
      {
        name: 'Microsoft',
        intro: 'Copilot 기능 자체보다 안정성 수정과 reliability 이슈로 분리해 읽어야 하는 항목이다.',
        updates: [
          {
            id: 'microsoft-visual-studio-ssms-copilot-fixes',
            title: 'Microsoft Visual Studio / SSMS — Copilot 안정성 수정',
            officialDate: '2026.06.23',
            checkedDateKST: '2026.06.24',
            sourceType: 'Official Release Notes',
            officialSource: {
              label: 'Microsoft Visual Studio release notes',
              url: 'https://learn.microsoft.com/en-us/visualstudio/releases/2026/release-notes',
            },
            updateType: 'Bug Fix / Copilot Reliability',
            badges: ['Bug Fix', 'Copilot Reliability', 'Official Source', 'Explanation Image Recommended'],
            summary: 'Visual Studio 2026 18.7.2와 SSMS 22.7.2 계열에서 Copilot Chat 창, 인증 오류, Agent Mode preview 관련 안정성 문제가 수정됐다.',
            whatChanged: 'Copilot 관련 창이 열리지 않거나 인증 오류가 발생하거나, 에이전트 모드에서 도구가 잘못 실행될 수 있는 문제들이 수정됐다.',
            whyItMatters: 'AI 개발 도구는 새 기능보다 실제로 안정적으로 열리고 작동하는 것이 중요하다.',
            dechiveView: 'AI 도구의 품질은 모델 성능만으로 결정되지 않는다. 인증, 창 열림, 도구 실행, 쿼리 검증 같은 안정성 문제가 실제 사용 경험을 좌우한다.',
            readerTakeaway: 'AI 개발 도구는 새 기능만큼이나 안정적으로 열리고 실행되는 문제가 중요해지고 있다.',
            screenMaterialStatus: 'Visual Studio/SSMS 안의 Copilot 창 또는 에러 수정 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '이 항목은 신기능이 아니라 bug fix / reliability update로 분류한다.',
          },
        ],
      },
      {
        name: 'Google',
        intro: '모델 출시가 아니라 모델 문서 업데이트로 구분해 기록한다.',
        updates: [
          {
            id: 'gemini-3-1-flash-lite-docs',
            title: 'Gemini 3.1 Flash-Lite — 모델 문서 업데이트',
            officialDate: '2026.06.23 UTC',
            checkedDateKST: '2026.06.24',
            sourceType: 'Official Documentation',
            officialSource: {
              label: 'Google AI Developers — Gemini 3.1 Flash-Lite',
              url: 'https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite',
            },
            updateType: 'Documentation Update / Model Documentation',
            badges: ['Documentation Update', 'Model Update', 'Official Source', 'Explanation Image Recommended'],
            summary: 'Google AI Developers의 Gemini 3.1 Flash-Lite 모델 문서가 저지연·저비용 멀티모달 모델의 입력, 출력, 도구 지원, 토큰 한도 등을 정리하고 있다.',
            whatChanged: '새 기능 발표라기보다, 저비용·고빈도 작업용 모델의 지원 입력, 출력, 도구 기능, 토큰 한도 등이 공식 문서에 정리됐다.',
            whyItMatters: 'AI 모델을 실제 서비스에 쓰려면 성능뿐 아니라 입력 종류, 토큰 한도, 도구 지원, 비용 구조를 알아야 한다.',
            dechiveView: '이 항목은 “신규 모델 출시”가 아니라 “모델 문서 정리/업데이트”로 다뤄야 한다. 공식 문서가 무엇을 지원한다고 말하는지 기록하는 것이 중요하다.',
            readerTakeaway: 'Gemini 3.1 Flash-Lite는 저비용·고빈도 작업을 위한 모델로 문서가 정리되고 있다.',
            screenMaterialStatus: '모델 문서 화면 또는 모델 기능 표를 참고 자료로 사용할 수 있다. 공식 화면이 없으면 모델 기능 요약표 형태의 설명 자료가 적합하다.',
            cautionNote: '오늘 새 모델이 출시됐다고 쓰지 않는다. Documentation Update로 표기한다.',
          },
        ],
      },
      {
        name: 'OpenAI',
        intro: '제품 출시가 아니라 기업 적용 사례로 분리해 짧게 기록한다.',
        updates: [
          {
            id: 'openai-omio-case-study',
            title: 'OpenAI Omio 사례 공개',
            officialDate: '2026.06.23',
            checkedDateKST: '2026.06.24',
            sourceType: 'Official Case Study',
            officialSource: {
              label: 'OpenAI — Omio',
              url: 'https://openai.com/index/omio',
            },
            updateType: 'Case Study / Enterprise AI',
            badges: ['Case Study', 'Enterprise AI', 'Official Source', 'Official Screen Not Confirmed'],
            summary: 'OpenAI는 Omio가 ChatGPT, Codex, API를 활용해 여행 검색과 예약 경험을 대화형 AI로 전환하고 있다는 사례를 공개했다.',
            whatChanged: '신기능 발표라기보다, OpenAI 도구가 실제 여행 검색·예약 서비스와 내부 개발/운영에 적용되는 사례가 공개됐다.',
            whyItMatters: 'AI가 검색창을 대체하는 대화형 여행 인터페이스로 들어가는 흐름을 보여준다. 다만 제품 업데이트보다는 기업 적용 사례에 가깝다.',
            dechiveView: '이 항목은 오늘의 메인 업데이트보다는 기록용으로 적합하다. “AI가 여행 검색의 인터페이스가 되는 사례”로 짧게 남길 수 있다.',
            readerTakeaway: 'AI는 여행 검색과 예약 경험도 대화형 인터페이스로 바꾸고 있다.',
            screenMaterialStatus: 'OpenAI 사례 페이지의 공식 이미지가 있으면 참고 가능하다. 없으면 별도 대표 이미지는 만들 필요가 낮다.',
            cautionNote: '이건 기능 업데이트가 아니라 Case Study다. 메인 업데이트처럼 다루지 않는다.',
          },
        ],
      },
      {
        name: 'Status Watch',
        intro: '기능 업데이트가 아니라 서비스 운영 안정성 기록으로 분리한다.',
        updates: [
          {
            id: 'anthropic-status-claude-errors',
            title: 'Anthropic Status — Claude 서비스 오류 이슈 기록',
            officialDate: '2026.06.24 UTC',
            checkedDateKST: '2026.06.24',
            sourceType: 'Official Status Page',
            officialSource: {
              label: 'Anthropic Status',
              url: 'https://status.anthropic.com/',
            },
            updateType: 'Status Watch / Reliability',
            badges: ['Status Watch', 'Official Source', 'Official Screen Available'],
            summary: 'Anthropic Status에는 6월 24일 Opus 4.8 elevated error rate 이슈가 조사 중으로 표시되어 있다.',
            whatChanged: '기능 업데이트가 아니라 서비스 상태 이슈 기록이다.',
            whyItMatters: 'AI 서비스는 모델 성능뿐 아니라 실제 운영 안정성도 중요하다. 오류율 증가와 해결 기록은 AI 도구를 업무에 쓰는 조직에게 중요한 정보다.',
            dechiveView: '이 항목은 메인 업데이트가 아니라 Status Watch로 분리하는 것이 적절하다. AI는 잘하는 것뿐 아니라 안정적으로 작동하는지도 검증되어야 한다.',
            readerTakeaway: 'AI 서비스는 모델 성능뿐 아니라 운영 안정성도 함께 봐야 한다.',
            screenMaterialStatus: 'Status page 화면을 참고할 수 있다.',
            cautionNote: '기능 업데이트처럼 쓰지 않는다. Status Watch / Reliability 항목으로 분리한다.',
          },
        ],
      },
    ],
    verificationNote: '오늘 확인한 업데이트는 Anthropic, Mistral, Claude Code, GitHub, Microsoft, Google 문서, OpenAI 사례, Anthropic Status로 나뉜다. 메인 업데이트는 Claude Tag, Mistral OCR 4, Claude Code 2.1.187, GitHub Copilot CLI와 BYOK다. 다만 모든 항목을 같은 무게로 다루지 않는다. Claude Tag와 Mistral OCR 4는 일반 독자에게도 설명 가능한 메인 업데이트다. Claude Code와 GitHub Copilot CLI/BYOK는 개발자용 핵심 업데이트다. Gemini 3.1 Flash-Lite는 신규 출시가 아니라 Documentation Update다. OpenAI Omio는 Case Study다. Anthropic Status는 기능 업데이트가 아니라 Status Watch다. 공식 화면이 확인되지 않은 항목은 실제 화면처럼 단정하지 않고, 설명 이미지가 더 적절하다고 표시한다.',
    closingLine: 'AI는 더 이상 별도의 채팅창에 머물지 않는다. 팀 협업 공간에서 호출되고, 문서 구조를 읽고, 터미널에서 이슈와 PR을 다루며, 조직의 모델·보안 정책 안에서 작동하기 시작했다. Dechive는 그 변화가 실제로 무엇을 바꾸는지 기록한다.',
    updates: [
      {
        id: 'anthropic-claude-tag',
        slug: 'anthropic-claude-tag',
        title: 'Anthropic Claude Tag',
        summary: 'Slack에서 @Claude를 태그해 팀 작업을 맡길 수 있는 Claude Tag가 공개됐다.',
        badges: ['Product Update', 'Team AI', 'Slack Agent', 'Official Source'],
        detailHref: '/ai-updates/2026-06-24#anthropic-claude-tag',
        source: {
          label: 'Anthropic Official Blog',
          url: 'https://www.anthropic.com/news/introducing-claude-tag',
          description: 'Claude Tag 공식 발표를 확인하는 항목입니다.',
        },
        whatChanged: 'AI가 Slack 스레드 안에서 호출되고 작업 결과를 남긴다.',
        useCriteria: 'Claude Enterprise와 Team 고객 대상 베타로 읽어야 합니다.',
        verificationNotes: ['공식 블로그 기준으로 기록합니다.'],
        image: {
          status: 'none',
          caption: 'Slack 스레드 안에서 Claude가 작업하는 설명 이미지가 적합합니다.',
        },
      },
      {
        id: 'mistral-ocr-4',
        slug: 'mistral-ocr-4',
        title: 'Mistral OCR 4',
        summary: '문서를 텍스트뿐 아니라 구조, 좌표, 신뢰도와 함께 읽는 OCR 4가 공개됐다.',
        badges: ['Model Update', 'Document Intelligence', 'Official Source'],
        detailHref: '/ai-updates/2026-06-24#mistral-ocr-4',
        source: {
          label: 'Mistral Official Blog',
          url: 'https://mistral.ai/news/ocr-4/',
          description: 'Mistral OCR 4 공식 발표를 확인하는 항목입니다.',
        },
        whatChanged: 'OCR이 문서 구조와 신뢰도까지 남기는 파이프라인으로 확장된다.',
        useCriteria: '단순 OCR 성능이 아니라 검증 가능한 문서 인입 구조로 읽어야 합니다.',
        verificationNotes: ['공식 블로그 기준으로 기록합니다.'],
        image: {
          status: 'none',
          caption: '문서 → 구조화된 데이터 → RAG 입력 흐름 이미지가 적합합니다.',
        },
      },
      {
        id: 'github-copilot-cli-terminal-ga',
        slug: 'github-copilot-cli-terminal-ga',
        title: 'GitHub Copilot CLI',
        summary: 'Copilot CLI의 새 터미널 인터페이스가 정식 출시됐다.',
        badges: ['Developer Tool', 'CLI Workflow', 'Agentic Coding', 'Official Source'],
        detailHref: '/ai-updates/2026-06-24#github-copilot-cli-terminal-ga',
        source: {
          label: 'GitHub Changelog',
          url: 'https://github.blog/changelog/2026-06-23-copilot-cli-new-terminal-interface-is-generally-available/',
          description: 'Copilot CLI 새 터미널 인터페이스 정식 출시를 확인하는 항목입니다.',
        },
        whatChanged: '터미널 안에서 이슈, PR, MCP, 스킬, 플러그인을 다루는 AI 작업 공간이 확장된다.',
        useCriteria: '개발자용 업데이트로 분류해야 합니다.',
        verificationNotes: ['공식 changelog 기준으로 기록합니다.'],
        image: {
          status: 'available',
          caption: 'GitHub changelog의 터미널 UI 자료를 참고할 수 있습니다.',
        },
      },
    ],
  },
  {
    date: '2026-06-23',
    title: 'AI가 입력창, 보안, 코딩 CLI, 업무 자동화 안으로 들어간 날',
    subtitle: '오늘의 업데이트는 새 챗봇 출시가 아니라, AI가 긴 입력을 정리하고, 보안 패치를 돕고, CLI와 업무 워크플로우 안에서 실제 실행 흐름을 이어가는 변화다.',
    quickSummary: [
      'ChatGPT는 긴 붙여넣기를 자동으로 첨부파일처럼 처리하며, 긴 입력을 더 정리된 방식으로 다루기 시작했다.',
      'OpenAI Daybreak와 Codex Security는 AI 보안이 취약점 발견에서 패치와 검증 자동화로 이동하고 있음을 보여준다.',
      'Claude Code, ZoomMate, Zoom Phone 계열 업데이트는 AI가 CLI, 전화, 회의 요약, 업무 워크플로우 안으로 들어가는 흐름을 보여준다.',
    ],
    groups: [
      {
        name: 'OpenAI ChatGPT',
        intro: '일반 사용자의 입력창 경험에서 긴 자료를 다루는 방식이 정리되는 업데이트다.',
        updates: [
          {
            id: 'chatgpt-long-paste-attachments',
            title: 'OpenAI ChatGPT — 긴 붙여넣기를 자동 첨부파일로 처리하다',
            officialDate: '2026.06.22',
            checkedDateKST: '2026.06.23',
            sourceType: 'Official Release Notes',
            updateType: 'Product Update',
            badges: ['Product Update', 'Official Source', 'Official Screen Not Confirmed', 'Explanation Image Recommended'],
            summary: 'ChatGPT Free와 Go 사용자도 긴 텍스트를 붙여넣으면 입력창에 그대로 넣는 대신 자동으로 첨부파일처럼 처리되도록 바뀌었다.',
            whatChanged: '긴 텍스트를 대화 입력창에 그대로 넣는 방식에서, 10,000자를 넘으면 자동으로 파일처럼 정리하는 방식으로 바뀌었다. 사용자는 다시 Show in text field로 본문 입력창에 되돌릴 수 있다.',
            whyItMatters: '긴 문서, 긴 회의록, 긴 원고를 붙여넣을 때 입력창이 지나치게 복잡해지는 문제를 줄일 수 있다. AI가 긴 입력을 더 구조화된 자료로 다루게 되는 변화다.',
            dechiveView: '이 업데이트는 작아 보이지만 AI 사용 경험에서 중요하다. 사용자는 점점 더 긴 문서와 복잡한 자료를 AI에게 넘기고 있다. AI 도구는 단순히 답변을 잘하는 것뿐 아니라, 사용자가 넣는 자료를 어떻게 정리하고 다룰지도 중요해진다.',
            readerTakeaway: 'ChatGPT는 긴 글을 그냥 대화창에 쌓는 대신, 자료처럼 정리해서 다루는 방향으로 가고 있다.',
            screenMaterialStatus: 'ChatGPT 입력창에서 긴 붙여넣기가 첨부파일처럼 처리되는 실제 화면이 있으면 가장 좋다. 공식 릴리즈노트에 화면이 없다면, 설명 이미지는 조용한 UI 재현 형태로만 사용한다.',
            cautionNote: '이 기능을 “모든 긴 문서를 자동 분석한다”로 과장하지 않는다. 핵심은 긴 붙여넣기 입력 처리 방식의 개선이다.',
          },
        ],
      },
      {
        name: 'OpenAI Daybreak / Codex Security',
        intro: 'AI 보안이 취약점 발견에서 패치 제안과 검증 자동화로 확장되는 흐름이다.',
        updates: [
          {
            id: 'openai-daybreak-codex-security',
            title: 'OpenAI Daybreak / Codex Security — AI 보안이 취약점 발견에서 패치 자동화로 이동하다',
            officialDate: '2026.06.22',
            checkedDateKST: '2026.06.23',
            sourceType: 'Official Blog / Official Product Update',
            updateType: 'Security Update / Cyber Defense',
            badges: ['Security Update', 'Cyber Defense', 'Official Source', 'Explanation Image Recommended'],
            summary: 'OpenAI는 Daybreak를 확장하면서 Codex Security 플러그인 업데이트, GPT-5.5-Cyber 제한 출시, 파트너 프로그램과 Patch the Planet 이니셔티브를 발표했다.',
            whatChanged: 'AI 보안 도구가 “취약점 찾기” 중심에서 “패치와 검증을 돕는 흐름”으로 확장되고 있다. Codex Security는 코드베이스를 스캔하고, 발견된 문제를 fixed 상태로 판단하는 자동화 흐름을 포함한다.',
            whyItMatters: '보안에서 가장 큰 문제는 취약점을 찾는 것만이 아니다. 실제로 고치고, 그 수정이 맞는지 검증하고, 운영 코드에 안전하게 반영하는 과정이 중요하다.',
            dechiveView: 'AI가 답을 만드는 수준을 넘어 보안 문제를 발견하고 패치까지 제안하는 단계로 가고 있다. 하지만 이럴수록 검증은 더 중요해진다. AI가 제안한 보안 패치가 실제로 안전한지, 기존 기능을 망가뜨리지 않는지 사람이 확인해야 한다.',
            readerTakeaway: 'AI 보안은 문제를 찾는 단계에서, 고치고 검증하는 단계로 이동하고 있다.',
            screenMaterialStatus: '보안 대시보드나 Codex Security 플러그인 화면이 공식적으로 공개되어 있다면 참고 가능하다. 명확한 공식 화면이 없으면 “취약점 발견 → 패치 제안 → 검증” 흐름을 보여주는 설명 다이어그램이 적합하다.',
            cautionNote: '“AI가 모든 보안 문제를 자동으로 해결한다”라고 쓰지 않는다. 제한 출시, 검증된 방어자, 보안 조직 중심의 업데이트라는 점을 유지한다.',
          },
        ],
      },
      {
        name: 'Claude Code',
        intro: 'AI 코딩 도구가 MCP 인증과 워크플로우 조작을 CLI 안으로 더 깊게 가져오는 변화다.',
        updates: [
          {
            id: 'claude-code-2-1-186-mcp-cli',
            title: 'Claude Code 2.1.186 — MCP 인증과 워크플로우 조작을 CLI 안으로 더 깊게 넣다',
            officialDate: '2026.06.22',
            checkedDateKST: '2026.06.23',
            sourceType: 'Official Changelog',
            updateType: 'Developer Tool / CLI Workflow / MCP',
            badges: ['Developer Tool', 'CLI Workflow', 'MCP', 'Official Source', 'Explanation Image Recommended'],
            summary: 'Claude Code 2.1.186에는 claude mcp login/logout 명령, SSH 환경을 위한 --no-browser 흐름, workflow 상태 필터와 Bash 명령 출력 응답 흐름이 추가되었다.',
            whatChanged: 'Claude Code가 MCP 인증, 워크플로우 필터링, Bash 명령 출력 응답을 CLI 안에서 더 직접적으로 다룰 수 있게 되었다.',
            whyItMatters: 'AI 코딩 도구는 단순히 코드를 추천하는 도구가 아니라, 외부 도구와 연결되고 명령어 실행 결과를 이어받아 다음 작업으로 연결하는 환경이 되고 있다.',
            dechiveView: '비전공자에게는 어렵지만 방향은 분명하다. AI 코딩 도구는 점점 더 작업 환경에 가까워지고 있다. 로그인, 외부 도구 연결, 명령어 결과 해석, 워크플로우 상태 관리가 모두 AI 코딩 환경 안으로 들어온다.',
            readerTakeaway: 'AI 코딩 도구는 채팅창이 아니라, 외부 도구와 명령어를 이어주는 작업 환경으로 바뀌고 있다.',
            screenMaterialStatus: 'CLI 업데이트라서 제품 화면보다는 터미널 예시 또는 “Claude Code ↔ MCP Server ↔ 외부 도구” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '비전공자에게는 용어가 어렵다. 본문에서는 MCP를 “AI가 외부 도구와 연결되는 통로” 정도로 풀어 설명한다. 명령어 세부 사용법보다 변화의 방향을 중심으로 쓴다.',
          },
        ],
      },
      {
        name: 'ZoomMate',
        intro: 'AI 워크플로우가 전화, 문자, 회의 요약, 문서 저장 같은 업무 이벤트와 연결되는 흐름이다.',
        updates: [
          {
            id: 'zoommate-workflow-phone-meeting-documents',
            title: 'ZoomMate — AI 워크플로우를 전화·문자·회의 요약·문서 저장으로 확장하다',
            officialDate: '2026.06.22',
            checkedDateKST: '2026.06.23',
            sourceType: 'Official Release Notes',
            updateType: 'Workflow Update / Agentic Workflow / Business Automation',
            badges: ['Workflow Update', 'Agentic Workflow', 'Business Automation', 'Official Source', 'Explanation Image Recommended'],
            summary: 'ZoomMate는 Agentic Workflows의 오류/종료 상태 표시를 개선하고, Zoom Phone 이벤트와 회의 요약 저장을 워크플로우로 연결한다.',
            whatChanged: 'AI 워크플로우가 단순 실행에서 벗어나, 전화 이벤트 감지, 회의 요약 저장, 문서화, 오류 상태 설명까지 확장되고 있다.',
            whyItMatters: '업무 자동화에서 중요한 것은 “AI가 답을 주는가”가 아니라 “업무 이벤트를 감지하고 다음 행동으로 연결할 수 있는가”다.',
            dechiveView: 'AI는 점점 업무 흐름의 중간에 들어오고 있다. 사용자가 매번 명령하지 않아도, 부재중 전화나 문자, 회의 요약 생성 같은 사건이 다음 자동화의 시작점이 된다. 하지만 자동화가 강해질수록 어떤 조건에서 실행되고 어디에 저장되는지 검증해야 한다.',
            readerTakeaway: 'AI는 이제 답변만 하는 것이 아니라, 전화와 회의 요약을 감지해 다음 업무 흐름으로 이어주는 자동화 도구가 되고 있다.',
            screenMaterialStatus: '워크플로우 빌더, 전화 이벤트 트리거, 회의 요약 → Google Drive/OneDrive 저장 흐름을 보여주는 설명 이미지가 적합하다. 공식 화면이 명확히 없으면 다이어그램형 설명 자료를 사용한다.',
            cautionNote: '모든 Zoom 사용자에게 자동 적용되는 기능처럼 쓰지 않는다. ZoomMate, Zoom Phone, workflow 설정 맥락에서 설명한다.',
          },
        ],
      },
      {
        name: 'Zoom Phone / Zoom Workplace',
        intro: 'AI가 별도 Companion 브랜드가 아니라 업무 시스템 안의 기본 기능과 운영 단위로 정리되는 흐름이다.',
        updates: [
          {
            id: 'zoom-phone-workplace-ai-operations',
            title: 'Zoom Phone / Zoom Workplace — AI를 별도 Companion 기능이 아니라 업무 시스템 안의 기본 기능으로 정리하다',
            officialDate: '2026.06.22 / 일부 항목 2026.06.21',
            checkedDateKST: '2026.06.23',
            sourceType: 'Official Release Notes',
            updateType: 'Product Integration / AI Operations',
            badges: ['Product Integration', 'AI Operations', 'Official Source', 'Explanation Image Recommended'],
            summary: 'Zoom Phone 릴리즈노트에는 AI Companion 이름이 retired되고 기존 AI 기능은 Zoom Workplace 안의 AI 기능으로 유지된다고 안내되어 있다.',
            whatChanged: 'AI가 별도 Companion 브랜드로 분리되는 대신, Zoom 업무 시스템 안의 기본 AI 기능처럼 정리된다. 또한 AI 상담원을 전화 시스템 안에서 독립적인 개체로 관리할 수 있는 흐름이 추가된다.',
            whyItMatters: 'AI가 제품의 보조 기능에서 업무 시스템의 운영 단위로 이동하고 있다. Virtual Agent가 전화 시스템 안에서 번호와 확장을 부여받을 수 있다는 것은 AI 상담원이 실제 고객 접점의 일부로 관리될 수 있음을 보여준다.',
            dechiveView: 'AI가 “옆에서 도와주는 친구” 같은 Companion 개념에서 조직이 관리하는 업무 시스템의 한 구성요소로 바뀌고 있다. 이제 AI는 기능명이 아니라 운영 단위가 된다.',
            readerTakeaway: 'AI는 별도 도우미에서 업무 시스템 안의 기본 기능과 운영 단위로 이동하고 있다.',
            screenMaterialStatus: 'Zoom Phone 관리자 화면 또는 Virtual Agent 설정 화면이 있으면 적합하다. 공식 화면이 없으면 “AI Virtual Agent가 전화 시스템 안의 하나의 개체로 배치되는 구조”를 보여주는 설명 이미지가 적합하다.',
            cautionNote: '“AI Companion이 완전히 종료된다”처럼 쓰지 않는다. 명칭이 retired되고 기존 기능은 Zoom Workplace 안의 AI 기능으로 유지된다는 점을 명확히 쓴다.',
          },
        ],
      },
    ],
    verificationNote: '오늘 확인한 업데이트는 OpenAI, Claude Code, ZoomMate, Zoom Phone/Workplace에 집중되어 있다. OpenAI는 긴 입력 처리와 보안 자동화 흐름에서 변화가 있었고, Claude Code는 MCP와 CLI 작업 흐름을 강화했다. ZoomMate와 Zoom Phone은 AI를 전화, 회의, 문서, 업무 자동화 안으로 연결하는 방향을 보여준다. 다만 오늘 페이지에서는 기능 출시와 제품 명칭 정리, 보안 업데이트, 개발자용 CLI 개선, 업무 자동화를 구분한다. 공식 화면이 확인되지 않은 항목은 실제 화면처럼 단정하지 않고, 설명 이미지가 더 적절하다고 표시한다. Microsoft Power Automate, Gemini API, xAI 등은 오늘 AI Updates 메인으로 보기 어려우면 보류한다.',
    closingLine: 'AI는 답변창 안에 머무르지 않는다. 긴 입력을 정리하고, 보안을 점검하고, 외부 도구와 로그인하고, 전화와 회의 요약을 업무 흐름으로 연결한다. Dechive는 그 변화가 실제로 무엇을 바꾸는지 기록한다.',
    updates: [
      {
        id: 'chatgpt-long-paste-attachments',
        slug: 'chatgpt-long-paste-attachments',
        title: 'OpenAI ChatGPT — 긴 붙여넣기를 자동 첨부파일로 처리하다',
        summary: '긴 텍스트를 붙여넣으면 입력창에 그대로 넣는 대신 자동으로 첨부파일처럼 처리되도록 바뀌었다.',
        badges: ['Product Update', 'Official Source', 'Official Screen Not Confirmed'],
        detailHref: '/ai-updates/2026-06-23#chatgpt-long-paste-attachments',
        source: {
          label: 'OpenAI Release Notes',
          url: 'https://help.openai.com/',
          description: 'ChatGPT 긴 붙여넣기 입력 처리 변경을 확인하는 항목입니다.',
        },
        whatChanged: '10,000자를 넘는 긴 텍스트가 자동으로 첨부파일처럼 처리된다.',
        useCriteria: '긴 문서 입력 처리 방식의 개선으로 읽어야 하며, 모든 긴 문서 자동 분석 기능으로 과장하지 않는다.',
        verificationNotes: ['공식 릴리즈노트 기준으로 기록합니다.'],
        image: {
          status: 'none',
          caption: '공식 화면이 명확하지 않으면 조용한 UI 재현 이미지가 적절합니다.',
        },
      },
      {
        id: 'openai-daybreak-codex-security',
        slug: 'openai-daybreak-codex-security',
        title: 'OpenAI Daybreak / Codex Security — AI 보안이 취약점 발견에서 패치 자동화로 이동하다',
        summary: 'AI 보안 도구가 취약점 발견에서 패치와 검증을 돕는 흐름으로 확장되고 있다.',
        badges: ['Security Update', 'Cyber Defense', 'Official Source'],
        detailHref: '/ai-updates/2026-06-23#openai-daybreak-codex-security',
        source: {
          label: 'OpenAI Official Blog / Product Update',
          url: 'https://openai.com/',
          description: 'Daybreak와 Codex Security 관련 공식 발표를 확인하는 항목입니다.',
        },
        whatChanged: '보안 취약점 발견뿐 아니라 패치 제안과 검증 자동화 흐름이 강조된다.',
        useCriteria: 'AI가 모든 보안 문제를 자동 해결한다는 의미가 아니라, 방어자와 보안 조직을 돕는 흐름으로 읽어야 합니다.',
        verificationNotes: ['공식 블로그와 공식 제품 업데이트 기준으로 기록합니다.'],
        image: {
          status: 'none',
          caption: '취약점 발견 → 패치 제안 → 검증 흐름을 보여주는 설명 다이어그램이 적합합니다.',
        },
      },
      {
        id: 'claude-code-2-1-186-mcp-cli',
        slug: 'claude-code-2-1-186-mcp-cli',
        title: 'Claude Code 2.1.186 — MCP 인증과 워크플로우 조작을 CLI 안으로 더 깊게 넣다',
        summary: 'MCP 인증, 워크플로우 필터링, Bash 명령 출력 응답이 CLI 안에서 더 직접적으로 처리된다.',
        badges: ['Developer Tool', 'CLI Workflow', 'MCP', 'Official Source'],
        detailHref: '/ai-updates/2026-06-23#claude-code-2-1-186-mcp-cli',
        source: {
          label: 'Claude Code Changelog',
          url: 'https://docs.anthropic.com/',
          description: 'Claude Code 2.1.186 변경 기록을 확인하는 항목입니다.',
        },
        whatChanged: 'Claude Code가 외부 도구 인증과 명령어 출력 응답을 CLI 안으로 더 깊게 통합한다.',
        useCriteria: '개발자용 CLI 워크플로우 개선으로 분류하고, 일반 사용자 기능처럼 넓혀 쓰지 않는다.',
        verificationNotes: ['공식 변경 기록 기준으로 기록합니다.'],
        image: {
          status: 'none',
          caption: '터미널 예시 또는 Claude Code ↔ MCP Server 흐름 설명 이미지가 적합합니다.',
        },
      },
    ],
  },
  {
    date: '2026-06-22',
    title: 'AI가 업무 도구 안으로 더 깊게 들어간 날',
    subtitle: '오늘의 업데이트는 새 모델 발표보다, AI가 회의·전화·문서·워크플로우·클라우드 인프라 안으로 들어가는 변화가 중심이다.',
    quickSummary: [
      'Zoom Workplace와 ZoomMate는 AI를 회의, 문서, 화면 공유, 전화, 지식 검색, 워크플로우 안으로 더 깊게 통합하고 있다.',
      'Google Cloud는 MCP를 통해 AI 애플리케이션이 클라우드 저장소 자원과 연결될 수 있는 흐름을 보여준다.',
      'Oracle NetSuite는 6월 22일자로 개정된 릴리즈노트에서 기업 업무 시스템 안의 AI 항목들을 정리하고 있다.',
    ],
    groups: [
      {
        name: 'Zoom Workplace',
        intro: 'AI가 Zoom 안의 기본 기능으로 정리되고, 회의 중 맥락 보조와 보안 정책 안으로 들어가는 흐름이다.',
        updates: [
          {
            id: 'zoom-workplace-ai-structure',
            title: 'Zoom Workplace — AI가 Zoom 안의 기본 기능으로 정리되다',
            officialDate: '2026.06.22',
            sourceType: 'Official Release Notes',
            updateType: 'Feature Update / Product Integration',
            badges: ['Feature Update', 'Product Integration', 'Official Source', 'Official Screen Not Confirmed'],
            summary: 'Zoom Workplace 7.1.0 예정 릴리즈에서 AI 관련 명칭과 기능 구조가 정리되었다.',
            whatChanged: '이전에는 AI Companion이라는 별도 이름으로 AI 기능을 부각했다. 이번 업데이트에서는 Meeting Summaries, Chat Compose, Scheduling Assistance, Smart Recording 같은 기능이 Zoom Workplace 안의 AI 기능으로 유지되고, 설정 페이지 이름도 AI로 정리된다.',
            whyItMatters: 'AI가 별도 부가기능처럼 붙어 있는 단계에서 일상 업무 도구 안의 기본 기능으로 흡수되는 흐름을 보여준다.',
            dechiveView: '이건 단순한 이름 변경이 아니다. 앞으로 많은 서비스에서 “AI 기능”이라는 이름조차 점점 사라지고, 문서 작성, 회의 요약, 일정 보조, 기록 정리 안에 자연스럽게 들어갈 가능성이 크다.',
            readerTakeaway: 'AI는 더 이상 따로 켜는 기능이 아니라, 우리가 매일 쓰는 업무 도구 안으로 조용히 들어가고 있다.',
            screenMaterialStatus: '오늘 릴리즈노트 자체에 새 UI 이미지가 명확히 공개된 것은 아니다. Zoom Workplace 제품 화면 또는 AI 설정 화면이 가장 적절하지만, 대표 이미지는 직접 제작하는 것이 안전하다.',
            cautionNote: '“AI Companion이 사라진다”라고 쓰면 안 된다. 명칭이 정리되고 기존 기능이 Zoom Workplace 안의 AI 기능으로 유지된다는 의미로 작성한다.',
          },
          {
            id: 'zoom-late-join-catch-up',
            title: 'Zoom Workplace — 회의에 늦게 들어온 사람에게 AI 요약을 제안하다',
            officialDate: '2026.06.22',
            sourceType: 'Official Release Notes',
            updateType: 'Feature Update',
            badges: ['Feature Update', 'Official Source', 'Explanation Image Recommended'],
            summary: '회의에 늦게 들어온 참가자에게 AI가 지금까지 놓친 내용을 요약해볼지 제안하는 catch-up prompt가 추가된다.',
            whatChanged: 'AI 회의 기능이 회의 종료 후 요약에만 머무르지 않고, 회의 도중 참가자의 맥락 복구를 돕는 방향으로 확장된다.',
            whyItMatters: '회의 중간에 들어온 사람은 앞의 내용을 놓친다. AI가 이 공백을 줄이면 회의 참여 경험이 달라질 수 있다.',
            dechiveView: '회의 AI는 사후 기록 도구에서 실시간 맥락 보조 도구로 이동하고 있다.',
            readerTakeaway: '늦게 들어온 회의에서도 AI가 지금까지의 맥락을 이어주는 시대가 오고 있다.',
            screenMaterialStatus: '실제 공식 스크린샷이 확인되지 않으면, Zoom 회의 화면 안에 “놓친 내용 요약” 팝업이 떠 있는 설명 이미지를 조용한 보조 이미지로 사용하는 것이 적절하다.',
            cautionNote: '회의 내용을 자동으로 무조건 요약한다는 뜻이 아니다. Meeting Questions 설정과 계정 정책에 따라 제공되는 기능으로 설명해야 한다.',
          },
          {
            id: 'zoom-restricted-user-ai-stop',
            title: 'Zoom Workplace — 제한 사용자가 들어오면 AI 기능이 자동으로 멈추다',
            officialDate: '2026.06.22',
            sourceType: 'Official Release Notes',
            updateType: 'Security / Governance Update',
            badges: ['Security / Governance', 'Official Source', 'Explanation Image Recommended'],
            summary: '관리자가 지정한 restricted user가 회의에 들어오면 Meeting Summary, Meeting Questions, My Notes 같은 AI 기능이 자동으로 중지된다.',
            whatChanged: 'AI 회의 기능이 모든 상황에서 무조건 켜지는 것이 아니라, 조직의 보안 정책과 사용자 권한에 따라 자동으로 중지될 수 있게 된다.',
            whyItMatters: '회의에는 외부 참여자, 민감한 정보, 조직별 보안 정책이 섞인다. AI가 회의를 요약하고 질문에 답할 수 있다면, 반대로 요약하면 안 되는 상황도 구분해야 한다.',
            dechiveView: 'AI 도구의 성숙도는 “무엇을 할 수 있는가”만이 아니라 “언제 멈춰야 하는가”에서도 드러난다.',
            readerTakeaway: 'AI가 회의를 요약할 수 있는 것만큼, 요약하면 안 되는 상황을 구분하는 것도 중요해졌다.',
            screenMaterialStatus: '관리자 설정 화면은 공식 공개 이미지 확보가 어려울 수 있다. “AI 기능이 잠금 처리된 회의 화면” 형태의 설명 이미지가 적합하다.',
            cautionNote: '보안 기능을 과장하지 않는다. “모든 민감 정보가 자동으로 보호된다”가 아니라 “제한 사용자 입장 시 특정 AI 기능을 중지할 수 있다”로 설명한다.',
          },
          {
            id: 'zoom-ai-virtual-backgrounds',
            title: 'Zoom Workplace — AI 생성 가상 배경 기능 개선',
            officialDate: '2026.06.22',
            sourceType: 'Official Release Notes',
            updateType: 'Feature Update / Creative AI',
            badges: ['Feature Update', 'Creative AI', 'Official Source', 'Explanation Image Recommended'],
            summary: 'AI-generated virtual backgrounds 기능을 더 쉽게 찾고 사용할 수 있게 개선했다.',
            whatChanged: 'AI 이미지 생성이 별도 생성 도구에서 회의 앱 안의 가상 배경 설정 기능으로 들어온다.',
            whyItMatters: '생성형 AI가 전문 제작 도구에만 머무르지 않고, 회의 배경을 고르는 일상 기능으로 내려오고 있다.',
            dechiveView: 'AI 이미지 생성은 이제 “콘텐츠 제작자만 쓰는 기능”이 아니라 일반 업무 환경에서 자연스럽게 쓰이는 기능이 되고 있다.',
            readerTakeaway: 'AI 이미지 생성은 이제 회의 배경을 고르는 일상적인 버튼이 되고 있다.',
            screenMaterialStatus: 'Zoom 가상 배경 설정 화면 또는 Dechive 스타일의 배경 패널 재현 이미지가 적합하다. 공식 릴리즈노트에 새 화면 캡처가 없다면 직접 만든 설명 이미지 권장.',
            cautionNote: '이미지 생성 기능 자체가 완전히 새로 나온 것처럼 표현하지 말고, 접근성과 사용 흐름이 개선된 것으로 설명한다.',
          },
          {
            id: 'zoom-productivity-suite-files',
            title: 'Zoom Workplace — 화면 공유에서 AI Productivity Suite 문서를 바로 찾다',
            officialDate: '2026.06.22',
            sourceType: 'Official Release Notes',
            updateType: 'Productivity Integration',
            badges: ['Product Integration', 'Workflow Update', 'Official Source', 'Explanation Image Recommended'],
            summary: 'Zoom 회의에서 화면 공유를 시작할 때 Files 탭에서 최근 사용한 Zoom AI Productivity Suite 문서를 바로 볼 수 있다.',
            whatChanged: '회의 화면 공유 흐름 안에서 AI 생산성 문서를 더 쉽게 찾고 공유할 수 있게 된다.',
            whyItMatters: '회의와 문서는 따로 떨어진 작업이 아니다. 회의 중 공유 흐름 안에 문서가 연결되면 회의에서 나온 내용이 실제 작업물로 이어지기 쉬워진다.',
            dechiveView: 'AI Productivity Suite는 회의 밖의 문서 도구가 아니라, 회의 안에서 바로 꺼내 쓰는 업무 흐름으로 들어오고 있다.',
            readerTakeaway: 'AI 문서는 회의가 끝난 뒤 따로 여는 파일이 아니라, 회의 중 바로 꺼내 쓰는 작업물이 되고 있다.',
            screenMaterialStatus: '화면 공유 창과 Files 탭을 보여주는 설명 이미지가 적합하다. 공식 화면이 없으면 직접 재현 이미지로 보조한다.',
            cautionNote: '이 기능은 Zoom AI Productivity Suite 문서와 관련된 흐름이다. 일반적인 모든 외부 파일 공유 기능으로 넓혀 쓰지 않는다.',
          },
        ],
      },
      {
        name: 'ZoomMate',
        intro: '전화, 폼, JSON, 클라우드 문서 저장소가 AI 워크플로우의 시작점과 결과물로 연결된다.',
        updates: [
          {
            id: 'zoommate-agentic-workflow-errors',
            title: 'ZoomMate — Agentic Workflow의 오류 상태를 더 명확하게 보여주다',
            officialDate: '2026.06.22',
            sourceType: 'Official Release Notes',
            updateType: 'Agentic Workflow Update',
            badges: ['Agentic Workflow', 'Workflow Update', 'Official Source', 'Explanation Image Recommended'],
            summary: 'Agentic Workflows에서 실패하거나 중단된 workflow run의 상태와 오류 메시지를 개선했다.',
            whatChanged: 'AI 워크플로우가 멈췄을 때 단순 실패로만 표시하지 않고, 왜 멈췄는지 더 구체적으로 구분한다.',
            whyItMatters: '자동화가 실제 업무에 들어가면 실패 이유를 알아야 다시 실행할지, 수정할지, 승인을 기다릴지 판단할 수 있다.',
            dechiveView: 'AI 자동화는 성공적으로 실행되는 것만큼 실패했을 때 설명 가능한 상태를 보여주는 것이 중요하다.',
            readerTakeaway: 'AI 자동화는 실행보다, 실패했을 때 왜 멈췄는지 설명하는 능력이 중요해지고 있다.',
            screenMaterialStatus: '워크플로우 상태 화면 또는 실패/승인 대기 상태를 보여주는 설명 이미지가 적합하다.',
            cautionNote: '이 항목은 일반 사용자가 바로 체감하는 기능보다 관리자/워크플로우 사용자에게 중요한 개선으로 분류한다.',
          },
          {
            id: 'zoommate-phone-triggers',
            title: 'ZoomMate — Zoom Phone 이벤트로 AI 워크플로우를 시작하다',
            officialDate: '2026.06.22',
            sourceType: 'Official Release Notes',
            updateType: 'Agentic Workflow / Phone Automation',
            badges: ['Agentic Workflow', 'Workflow Update', 'Official Source', 'Explanation Image Recommended'],
            summary: '부재중 전화, SMS 도착, 새 음성 메시지 같은 Zoom Phone 이벤트가 워크플로우를 시작할 수 있다.',
            whatChanged: '전화나 문자 같은 실제 업무 이벤트가 AI 워크플로우의 시작점이 된다.',
            whyItMatters: 'AI 자동화는 사용자가 직접 명령해야만 작동하는 것이 아니라, 업무에서 발생한 사건을 감지하고 다음 작업으로 이어질 수 있다.',
            dechiveView: 'AI는 더 이상 채팅창에서 기다리는 도구만이 아니다. 부재중 전화, 문자, 음성 메시지 같은 업무 신호를 받아 다음 행동을 시작하는 방향으로 가고 있다.',
            readerTakeaway: 'AI 워크플로우는 이제 사용자가 요청해야만 움직이는 것이 아니라, 부재중 전화나 문자 같은 업무 이벤트에서 시작된다.',
            screenMaterialStatus: '전화 이벤트 → 조건 분기 → 후속 작업 흐름을 보여주는 다이어그램형 설명 이미지가 적합하다.',
            cautionNote: '이 기능은 Zoom Phone과 ZoomMate workflow builder 맥락에서 설명한다. 모든 Zoom 사용자에게 동일하게 적용된다고 쓰지 않는다.',
          },
          {
            id: 'zoommate-meeting-summary-drive',
            title: 'ZoomMate — 회의 요약을 OneDrive와 Google Drive에 자동 저장하다',
            officialDate: '2026.06.22',
            sourceType: 'Official Release Notes',
            updateType: 'Workflow Automation / Document Automation',
            badges: ['Workflow Update', 'Product Integration', 'Official Source', 'Explanation Image Recommended'],
            summary: 'AI 생성 회의 요약을 OneDrive 또는 Google Drive에 새 문서로 자동 저장하는 workflow를 만들 수 있다.',
            whatChanged: '회의 요약이 화면에만 표시되는 정보가 아니라, 클라우드 문서 저장소에 자동으로 남는 기록물이 된다.',
            whyItMatters: '회의 → 요약 → 문서화 → 공유/보관의 흐름이 자동화되면 회의 기록이 조직의 지식 자산으로 쌓일 수 있다.',
            dechiveView: 'AI 요약은 이제 읽고 끝나는 요약이 아니라, 자동으로 저장되고 재사용되는 업무 기록이 되고 있다.',
            readerTakeaway: 'AI 회의 요약은 이제 자동으로 폴더에 쌓이는 업무 기록이 되고 있다.',
            screenMaterialStatus: '회의 요약이 Google Drive/OneDrive 폴더로 저장되는 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '이 기능은 workflow 설정이 필요하다. 모든 회의 요약이 자동으로 저장된다고 표현하지 않는다.',
          },
          {
            id: 'zoommate-form-json-reuse',
            title: 'ZoomMate — 폼 제출과 JSON으로 워크플로우를 더 쉽게 공유·재사용하다',
            officialDate: '2026.06.22',
            sourceType: 'Official Release Notes',
            updateType: 'Workflow Builder Update',
            badges: ['Workflow Update', 'Agentic Workflow', 'Official Source', 'Explanation Image Recommended'],
            summary: 'workflow form trigger에 파일 첨부 필드가 추가되고, 기존 workflow를 JSON 파일로 내보내고 가져올 수 있다.',
            whatChanged: 'AI 워크플로우가 개인 설정에 머무르지 않고, 팀에서 공유하고 재사용할 수 있는 구조로 확장된다.',
            whyItMatters: 'AI 자동화가 조직에서 쓰이려면 한 사람이 만든 흐름을 다른 사람도 이해하고 재사용할 수 있어야 한다.',
            dechiveView: 'AI 워크플로우는 개인의 실험에서 팀의 운영 자산으로 이동하고 있다.',
            readerTakeaway: 'AI 자동화는 이제 한 번 만들고 끝나는 개인 설정이 아니라, 팀이 공유하고 재사용하는 업무 자산이 되고 있다.',
            screenMaterialStatus: '워크플로우 빌더 화면 또는 Export JSON / Import JSON 흐름을 설명하는 이미지가 적합하다.',
            cautionNote: '일반 독자에게 어려울 수 있으므로, “팀이 자동화 흐름을 저장하고 옮길 수 있게 됐다”는 식으로 쉽게 설명한다.',
          },
        ],
      },
      {
        name: 'Google Cloud',
        intro: 'MCP가 AI 애플리케이션과 클라우드 저장소 자원을 연결하는 인프라 흐름으로 확장된다.',
        updates: [
          {
            id: 'google-cloud-netapp-mcp-ga',
            title: 'Google Cloud NetApp Volumes — remote MCP server가 GA로 제공되다',
            officialDate: '2026.06.22',
            sourceType: 'Official Release Notes',
            updateType: 'MCP / Platform Integration / General Availability',
            badges: ['MCP', 'Platform Integration', 'Official Source', 'Explanation Image Recommended'],
            summary: 'Google Cloud NetApp Volumes remote Model Context Protocol server가 GA로 제공된다.',
            whatChanged: 'MCP가 AI 애플리케이션과 클라우드 저장소 자원을 연결하는 통로로 확장된다.',
            whyItMatters: 'AI가 단순히 텍스트를 읽고 답하는 수준을 넘어, 인프라 자원과 연결되는 실행 경로를 갖게 되는 흐름이다.',
            dechiveView: 'MCP는 단순히 AI에게 검색 도구를 붙이는 기술이 아니다. 클라우드 저장소 같은 실제 인프라를 AI 애플리케이션과 연결하는 방식으로 확장되고 있다.',
            readerTakeaway: 'AI는 이제 문서만 읽는 것이 아니라, 클라우드 저장소 같은 실제 인프라와 연결되는 방향으로 가고 있다.',
            screenMaterialStatus: '공식 제품 화면보다는 MCP → LLM → Cloud Storage Resources 흐름을 보여주는 설명 다이어그램이 적합하다.',
            cautionNote: '일반 독자에게 어려운 항목이므로 기술 섹션으로 분리한다. “AI가 모든 클라우드 자원을 마음대로 관리한다”처럼 쓰지 않는다.',
          },
        ],
      },
      {
        name: 'Oracle NetSuite',
        intro: '오늘 신규 기능 출시라기보다, 6월 22일자로 개정된 릴리즈노트의 AI 항목 정리로 보는 것이 정확하다.',
        updates: [
          {
            id: 'oracle-netsuite-2026-1-ai-notes',
            title: 'Oracle NetSuite — 2026.1 릴리즈노트가 6월 22일자로 개정되며 AI 항목들이 정리되다',
            officialDate: 'Revision Date 2026.06.22',
            sourceType: 'Official Documentation',
            updateType: 'Documentation Update / Enterprise AI',
            badges: ['Documentation Update', 'Enterprise AI', 'Official Source', 'Explanation Image Recommended'],
            summary: 'Oracle NetSuite 2026.1 릴리즈노트가 2026년 6월 22일자로 개정되며 AI 관련 항목들이 정리되어 있다.',
            whatChanged: 'NetSuite 릴리즈노트에서 기업 업무 시스템 안에 들어가는 다양한 AI 항목들이 정리되어 있다.',
            whyItMatters: '기업용 AI는 하나의 챗봇이 아니라, 설명 작성, 리포트 요약, 개발 보조, 에이전트 스킬, 권한 설정 등 여러 층으로 들어간다.',
            dechiveView: '기업 시스템에서 AI는 “묻고 답하는 기능”보다 업무 과정 곳곳에 붙는 기능 묶음으로 확장되고 있다.',
            readerTakeaway: '기업용 AI는 하나의 챗봇이 아니라, 업무 시스템 곳곳에 들어가는 기능 묶음으로 확장되고 있다.',
            screenMaterialStatus: 'NetSuite 공식 화면 캡처를 쓰기는 어렵다. 기업 업무 시스템 안에 AI 기능들이 층층이 들어가는 설명 이미지가 적합하다.',
            cautionNote: '이건 “6월 22일에 모든 AI 기능이 새로 출시됐다”가 아니다. 6월 22일 개정된 릴리즈노트에 AI 관련 항목이 정리되어 있는 것이다. 반드시 Documentation Update로 표기한다.',
          },
        ],
      },
    ],
    verificationNote: '오늘 확인한 업데이트는 대부분 Zoom Workplace와 ZoomMate에 집중되어 있다. Google Cloud MCP는 기술/인프라 성격이 강하고, Oracle NetSuite는 오늘 신규 기능 출시라기보다 6월 22일자로 개정된 공식 릴리즈노트의 AI 항목 정리로 보는 것이 정확하다. 오늘 페이지에서는 기능 출시와 문서 개정을 구분한다. 공식 화면이 확인되지 않은 항목은 실제 화면처럼 단정하지 않고, 설명 이미지가 더 적절하다고 표시한다. OpenAI, Claude Code, Gemini API 등은 오늘 날짜의 새 공식 릴리즈가 확인되지 않으면 억지로 포함하지 않는다.',
    closingLine: 'AI는 답을 만드는 도구를 넘어 업무를 실행하는 도구가 되고 있다. Dechive는 그 실행이 어디까지 안전하고 검증 가능한지 기록한다.',
    updates: [
      {
        id: 'zoom-workplace-ai-structure',
        slug: 'zoom-workplace-ai-structure',
        title: 'Zoom Workplace — AI가 Zoom 안의 기본 기능으로 정리되다',
        summary: 'Zoom Workplace 7.1.0 예정 릴리즈에서 AI 관련 명칭과 기능 구조가 정리되었다.',
        badges: ['Feature Update', 'Product Integration', 'Official Source'],
        detailHref: '/ai-updates/2026-06-22',
        source: {
          label: 'Zoom Workplace Release Notes',
          url: 'https://support.zoom.com/',
          description: 'Zoom Workplace 7.1.0 예정 릴리즈의 AI 기능 명칭과 설정 구조를 확인하는 항목입니다.',
        },
        whatChanged: 'AI Companion이라는 별도 이름보다 Zoom Workplace 안의 AI 기능으로 정리된다.',
        useCriteria: 'AI 기능이 별도 제품인지, 업무 도구의 기본 기능인지 구분해 읽어야 합니다.',
        verificationNotes: ['공식 릴리즈노트 기준으로 기록합니다.'],
        image: {
          status: 'none',
          caption: '공식 화면이 명확하지 않아 설명 이미지가 더 적절합니다.',
        },
      },
      {
        id: 'zoommate-phone-triggers',
        slug: 'zoommate-phone-triggers',
        title: 'ZoomMate — Zoom Phone 이벤트로 AI 워크플로우를 시작하다',
        summary: '부재중 전화, SMS, 음성 메시지 같은 업무 이벤트가 워크플로우의 시작점이 된다.',
        badges: ['Agentic Workflow', 'Workflow Update', 'Official Source'],
        detailHref: '/ai-updates/2026-06-22',
        source: {
          label: 'ZoomMate Release Notes',
          url: 'https://support.zoom.com/',
          description: 'ZoomMate workflow builder의 Zoom Phone trigger 흐름을 확인하는 항목입니다.',
        },
        whatChanged: '전화나 문자 같은 실제 업무 이벤트가 AI 워크플로우의 시작점이 된다.',
        useCriteria: '모든 Zoom 사용자가 아니라 Zoom Phone과 ZoomMate workflow builder 맥락에서 읽어야 합니다.',
        verificationNotes: ['공식 릴리즈노트 기준으로 기록합니다.'],
        image: {
          status: 'none',
          caption: '전화 이벤트에서 워크플로우가 시작되는 다이어그램형 설명 이미지가 적절합니다.',
        },
      },
      {
        id: 'google-cloud-netapp-mcp-ga',
        slug: 'google-cloud-netapp-mcp-ga',
        title: 'Google Cloud NetApp Volumes — remote MCP server가 GA로 제공되다',
        summary: 'MCP가 AI 애플리케이션과 클라우드 저장소 자원을 연결하는 통로로 확장된다.',
        badges: ['MCP', 'Platform Integration', 'Official Source'],
        detailHref: '/ai-updates/2026-06-22',
        source: {
          label: 'Google Cloud Release Notes',
          url: 'https://cloud.google.com/release-notes',
          description: 'Google Cloud NetApp Volumes remote MCP server의 GA 제공을 확인하는 항목입니다.',
        },
        whatChanged: 'AI 애플리케이션과 클라우드 저장소 자원을 연결하는 실행 경로가 공식화된다.',
        useCriteria: '일반 사용자용 기능보다 기술/인프라 업데이트로 분리해 읽어야 합니다.',
        verificationNotes: ['공식 릴리즈노트 기준으로 기록합니다.'],
        image: {
          status: 'none',
          caption: 'MCP → LLM → Cloud Storage Resources 흐름을 보여주는 설명 다이어그램이 적합합니다.',
        },
      },
    ],
  },
  {
    date: '2026-06-20',
    updates: [
      {
        id: 'zoom-virtual-agent',
        slug: 'zoom-virtual-agent',
        title: 'Zoom Virtual Agent',
        summary: 'AI 상담원을 여러 지점과 부서에 맞게 다르게 운영할 수 있게 됨.',
        badges: ['Official Source', 'Image Available', 'Explainer'],
        detailHref: '/ai-updates/2026-06-20#zoom-virtual-agent',
        source: {
          label: 'Zoom Official Source',
          url: 'https://www.zoom.com/',
          description: 'Zoom의 제품 업데이트 문서에서 Virtual Agent 운영 범위와 설정 변화를 확인하는 항목입니다.',
        },
        whatChanged: 'Virtual Agent를 하나의 공통 상담 흐름으로만 두지 않고, 지점이나 부서처럼 다른 운영 단위에 맞춰 다르게 구성할 수 있는 방향의 업데이트입니다.',
        useCriteria: 'AI 상담원을 도입할 때 답변 성능만 볼 것이 아니라, 어떤 조직 기준과 책임 범위 안에서 답하게 할지 먼저 나눠야 합니다.',
        verificationNotes: [
          '공식 출처 기반 업데이트로 기록합니다.',
          '화면 자료가 있는 항목으로 분류합니다.',
          '구체적인 적용 범위와 권한 조건은 실제 제품 화면에서 추가 확인이 필요합니다.',
        ],
        image: {
          status: 'available',
          caption: '공식 화면 자료가 있는 업데이트입니다. 실제 이미지 파일은 추후 연결합니다.',
        },
      },
      {
        id: 'canvas-igniteai',
        slug: 'canvas-igniteai',
        title: 'Canvas IgniteAI',
        summary: 'AI 번역 결과에 사용자가 피드백을 줄 수 있게 됨.',
        badges: ['Official Source', 'Limited Image', 'Explainer'],
        detailHref: '/ai-updates/2026-06-20#canvas-igniteai',
        source: {
          label: 'Canvas Official Source',
          url: 'https://www.instructure.com/canvas',
          description: 'Canvas의 IgniteAI 관련 공식 안내에서 AI 번역과 사용자 피드백 흐름을 확인하는 항목입니다.',
        },
        whatChanged: 'AI 번역 결과를 일방적으로 제공하는 데서 끝나지 않고, 사용자가 결과에 대한 피드백을 남길 수 있는 구조가 추가됩니다.',
        useCriteria: '교육 콘텐츠나 안내문 번역에 AI를 사용할 때, 번역 결과를 확정값으로 보지 않고 사용자 피드백을 품질 관리 기준에 포함해야 합니다.',
        verificationNotes: [
          '공식 출처 기반 업데이트로 기록합니다.',
          '화면 자료는 제한적으로 확인된 항목으로 분류합니다.',
          '피드백이 실제 번역 품질 개선에 어떻게 반영되는지는 추가 확인이 필요합니다.',
        ],
        image: {
          status: 'limited',
          caption: '공식 화면 자료가 제한적인 업데이트입니다. 확인 가능한 이미지가 생기면 연결합니다.',
        },
      },
    ],
  },
  {
    date: '2026-06-19',
    updates: [
      {
        id: 'claude-code',
        slug: 'claude-code',
        title: 'Claude Code',
        summary: '사용자가 명확히 허락하지 않은 위험한 자동 실행을 더 강하게 차단함.',
        badges: ['Official Changelog', 'No Product Image', 'Explainer'],
        detailHref: '/ai-updates/2026-06-19#claude-code',
        source: {
          label: 'Claude Code Changelog',
          url: 'https://docs.anthropic.com/',
          description: 'Claude Code 변경 기록에서 위험한 자동 실행과 사용자 승인 조건을 확인하는 항목입니다.',
        },
        whatChanged: '사용자가 명확히 허락하지 않은 위험한 실행을 더 엄격하게 막는 방향으로 동작 기준이 조정됩니다.',
        useCriteria: 'AI 코딩 도구를 쓸 때 자동 실행의 편의보다, 어떤 명령을 사람이 승인해야 하는지에 대한 경계 설정이 더 중요해집니다.',
        verificationNotes: [
          '공식 변경 기록 기반 업데이트로 기록합니다.',
          '제품 화면 이미지는 없는 항목으로 분류합니다.',
          '팀 환경에서는 허용 명령과 금지 명령의 기준을 별도로 문서화해야 합니다.',
        ],
        image: {
          status: 'none',
          caption: '공식 제품 화면 자료가 확인되지 않은 업데이트입니다.',
        },
      },
    ],
  },
];

export function getAiUpdateDayByDate(date: string) {
  return aiUpdateDays.find((day) => day.date === date) ?? null;
}

export function getAiUpdateDayStaticParams() {
  return aiUpdateDays.map((day) => ({ date: day.date }));
}
