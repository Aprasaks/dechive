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
  | 'Copilot Reliability'
  | 'Public Preview'
  | 'Tool Update'
  | 'Computer Use'
  | 'Infrastructure'
  | 'AI Chip'
  | 'Inference'
  | 'Company Update'
  | 'Connectors'
  | 'Governance'
  | 'Admin Control'
  | 'Product Policy'
  | 'Model Selection'
  | 'Auto Routing'
  | 'Reliability Update'
  | 'Model Behavior Update'
  | 'Remote Workspace'
  | 'Codex'
  | 'Memory'
  | 'Personalization'
  | 'Research'
  | 'Agentic Work'
  | 'AI Adoption'
  | 'Auto Mode'
  | 'Observability'
  | 'Jira'
  | 'Agent Sessions'
  | 'Code Review'
  | 'Efficiency Update'
  | 'Enterprise Governance'
  | 'Plugin Control'
  | 'Financial AI'
  | 'Effective Change'
  | 'Deprecation'
  | 'Enterprise CMS'
  | 'Beta'
  | 'Feature Release'
  | 'AI Education'
  | 'Funding'
  | 'Model Preview'
  | 'Frontier Model'
  | 'Limited Preview'
  | 'Safety'
  | 'Model Retirement'
  | 'Model Picker'
  | 'UX Update'
  | 'Reliability'
  | 'CLI Fix'
  | 'Voice Input'
  | 'Coding Model'
  | 'Copilot'
  | 'Git Workflow'
  | 'GitHub Desktop'
  | 'Worktrees'
  | 'Merge Conflict'
  | 'Enterprise Analytics'
  | 'AI Adoption Metrics'
  | 'Backfill'
  | 'Agent Governance'
  | 'Needs Date Verification'
  | 'Dictation'
  | 'No Major Product Launch'
  | 'Frontier Partnership'
  | 'AI Operating Model'
  | 'Deployment'
  | 'Evaluation'
  | 'No Incident'
  | 'Date Discrepancy'
  | 'Incident'
  | 'Official Screen Not Required';

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
  checkedDateKST?: string;
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
    date: '2026-06-28',
    checkedDateKST: '2026.06.29',
    title: 'AI가 파일럿을 넘어 기업 운영 모델로 들어간 날',
    subtitle: '2026년 6월 28일 officialDate 기준으로 대형 새 모델 출시는 확인되지 않았다. 대신 OpenAI와 HP의 Frontier 전략 파트너십 사례를 통해 AI가 파일럿을 넘어 조직의 권한, 맥락, 배포, 평가 체계 안으로 들어가는 흐름을 기록한다.',
    quickSummary: [
      '2026년 6월 28일 officialDate 기준으로 Dechive 메인으로 다룰 만한 대형 새 모델 출시나 일반 사용자용 새 기능 출시는 확인되지 않았다.',
      'OpenAI는 HP Inc.의 Frontier 전략 파트너십 사례를 공개했다. 이 항목은 제품 출시가 아니라 기업 AI 적용 사례로 분류한다.',
      'Anthropic Status 기준으로 2026년 6월 28일에는 별도 신규 incident가 보고되지 않았으므로 Status Watch로 짧게 기록한다.',
    ],
    groups: [
      {
        name: 'No Major Product Launch',
        intro: '새 모델이나 일반 사용자용 새 기능을 억지로 만들지 않고, 대형 제품 출시가 확인되지 않은 날이라는 사실 자체를 검증 로그로 남긴다.',
        updates: [
          {
            id: 'no-major-product-launch-2026-06-28',
            title: 'No Major Product Launch — 대형 새 모델 출시는 확인되지 않은 날',
            officialDate: '2026.06.28',
            checkedDateKST: '2026.06.29',
            sourceType: 'Official Source Check',
            updateType: 'No Major Product Launch / Verification Log',
            badges: ['No Major Product Launch', 'Official Source', 'Official Screen Not Required'],
            summary: '2026년 6월 28일 officialDate 기준으로 Dechive 메인으로 다룰 만한 대형 새 모델 출시나 새 기능 출시는 확인되지 않았다. 다만 OpenAI × HP Frontier 전략 파트너십 사례는 기업 AI 도입 흐름을 보여주는 공식 사례로 기록할 가치가 있다.',
            whatChanged: '새 모델이나 일반 사용자용 기능 출시보다, 기업 AI 도입 사례와 상태 기록이 중심인 날이다.',
            whyItMatters: 'AI Updates를 매일 기록할 때 중요한 것은 억지로 새 기능을 찾는 것이 아니다. 새 기능이 없는 날에는 없는 것으로 기록하고, 대신 실제 AI 도입 흐름을 보여주는 공식 사례가 있다면 그 성격을 정확히 구분해 남겨야 한다.',
            dechiveView: 'Dechive는 속보보다 검증을 우선한다. 대형 업데이트가 없는 날에도 “확인했지만 대형 새 기능 출시는 없었다”고 남기는 것이 신뢰를 만든다.',
            readerTakeaway: 'AI 업데이트는 매일 새로운 기능을 억지로 찾는 일이 아니라, 실제 변화가 있었는지 확인하는 일이다.',
            screenMaterialStatus: '별도 이미지 필요 없음. 상태 카드 정도만 사용 가능하다.',
            cautionNote: '이 항목을 빈 페이지처럼 만들지 말고, 아래의 OpenAI × HP 사례와 Anthropic Status Watch로 이어지는 검증 로그의 도입부로 사용한다.',
          },
        ],
      },
      {
        name: 'OpenAI / HP Frontier Partnership',
        intro: 'OpenAI × HP 사례는 새 제품 출시가 아니라, 파일럿을 기업 운영 모델로 확장하려는 Frontier 전략 파트너십 기록으로 분리한다.',
        updates: [
          {
            id: 'openai-hp-frontier-partnership',
            title: 'OpenAI × HP Frontier Partnership — AI는 파일럿을 넘어 기업 운영 모델로 들어간다',
            officialDate: '2026.06.28',
            checkedDateKST: '2026.06.29',
            sourceType: 'Official Company Blog / Official Case Study',
            officialSource: {
              label: 'OpenAI — HP Inc. launches Frontier strategic partnership with OpenAI',
              url: 'https://openai.com/index/hp-frontier-partnership/',
            },
            updateType: 'Company Update / Enterprise AI / Case Study / Frontier Partnership / AI Operating Model',
            badges: [
              'Company Update',
              'Enterprise AI',
              'Case Study',
              'Frontier Partnership',
              'AI Operating Model',
              'Governance',
              'Deployment',
              'Evaluation',
              'Official Source',
              'Official Screen Available',
              'Explanation Image Recommended',
            ],
            summary: 'OpenAI는 HP Inc.가 OpenAI Frontier 전략 파트너십을 확장하며 파일럿 단계에서 기업 전반 배포로 이동하고 있다고 소개했다. HP는 OpenAI Frontier를 통해 고객과 파트너 경험, 고객 텔레메트리 인사이트, 직원 생산성, 소프트웨어 개발 등 여러 영역에 AI를 확장하려 한다. OpenAI는 HP의 파일럿 사례로 엔지니어링, 보안, 내부 운영 등에서 AI가 실제 작업 흐름을 단축하고 지원한 사례를 소개했다.',
            whatChanged: '이 항목은 새 제품 출시가 아니라 기업 AI 도입 사례다. 핵심 변화는 AI가 일부 팀의 실험에서 조직 전체 운영 모델로 확장되는 흐름이다. HP는 OpenAI Frontier를 통해 AI를 고객 경험, 개발, 보안, 내부 생산성 등 여러 업무 영역으로 확장하려 한다.',
            whyItMatters: '기업에서 AI를 도입하는 것은 단순히 직원들에게 챗봇을 열어주는 일이 아니다. 어떤 데이터와 맥락을 AI가 사용할 수 있는지, 어떤 권한으로 실행되는지, 어느 팀에 어떻게 배포되는지, 결과를 어떻게 평가할지 정해야 한다. OpenAI × HP 사례는 AI 도입이 파일럿에서 운영 모델로 이동하는 흐름을 보여준다.',
            dechiveView: 'Dechive 관점에서 중요한 것은 “HP가 AI를 쓴다”가 아니다. 중요한 것은 AI 도입이 이제 파일럿의 성공 사례를 넘어, 조직 전체의 권한·맥락·배포·평가 체계로 들어가고 있다는 점이다. AI는 더 이상 몇 명이 실험해보는 도구가 아니라, 기업 운영 방식 안에 배치되는 시스템이 되고 있다.',
            readerTakeaway: 'AI 도입의 다음 단계는 사용량이 아니라 운영 모델이다. 기업은 AI를 어디에 배치하고, 어떤 맥락을 허용하고, 어떤 결과를 검증할지 정해야 한다.',
            screenMaterialStatus: 'OpenAI 공식 블로그의 HP Frontier 관련 이미지가 있으므로 공식 이미지 참고 가능으로 표시한다. 제품 화면이 중심인 항목은 아니므로, 보조 자료가 필요하다면 “파일럿 → 권한/맥락/배포/평가 → 기업 운영 모델” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '이 항목을 “OpenAI가 새 기능을 출시했다”처럼 쓰지 않는다. 제품 업데이트가 아니라 기업 AI 적용 사례 / Frontier Partnership으로 분류한다. HP 사례의 성과를 과장하지 말고, 공식 문서에 나온 범위 안에서만 작성한다.',
          },
        ],
      },
      {
        name: 'Anthropic Status',
        intro: 'Anthropic Status는 기능 업데이트가 아니라 서비스 안정성 확인 항목으로 짧게 분리한다.',
        updates: [
          {
            id: 'anthropic-status-no-incident-2026-06-28',
            title: 'Anthropic Status — 6월 28일 신규 incident 없음',
            officialDate: '2026.06.28',
            checkedDateKST: '2026.06.29',
            sourceType: 'Official Status Page',
            officialSource: {
              label: 'Anthropic Status',
              url: 'https://status.anthropic.com/',
            },
            updateType: 'Status Watch / Reliability / No Incident',
            badges: ['Status Watch', 'Reliability', 'No Incident', 'Official Source'],
            summary: 'Anthropic Status 기준으로 2026년 6월 28일에는 별도 incident가 보고되지 않았다. 전날인 6월 27일에는 Opus 4.8 elevated errors 이슈가 있었지만, 6월 28일 자체는 신규 incident가 없는 날로 기록한다.',
            whatChanged: '기능 업데이트가 아니라 서비스 상태 기록이다.',
            whyItMatters: 'AI 서비스를 실제 업무에 쓰는 사람에게는 모델 성능만큼 서비스 안정성도 중요하다. incident가 없는 날도 Status Watch로 짧게 기록할 수 있다.',
            dechiveView: 'Dechive에서는 이 항목을 메인 업데이트가 아니라 Status Watch로 분리하는 것이 적절하다. AI는 잘하는 것뿐 아니라 안정적으로 작동하는지도 검증해야 한다.',
            readerTakeaway: 'AI 서비스의 안정성도 업데이트 기록에서 함께 확인할 필요가 있다.',
            screenMaterialStatus: 'Anthropic Status Page 화면을 참고할 수 있다. 별도 설명 이미지는 필수 아님.',
            cautionNote: '기능 업데이트처럼 쓰지 않는다. Status Watch로만 짧게 다룬다. 전날 incident를 6월 28일 신규 incident처럼 쓰지 않는다.',
          },
        ],
      },
    ],
    verificationNote: '이번 페이지는 2026.06.29 KST에 확인한 officialDate 2026.06.28 공식 업데이트 기록이다. 2026년 6월 28일 기준으로 대형 새 모델 출시나 일반 사용자용 새 기능 출시는 확인되지 않았다. 오늘의 메인 기록은 OpenAI × HP Frontier 전략 파트너십 사례다. 이 항목은 제품 업데이트가 아니라 기업 AI 적용 사례로 분류한다. 핵심은 AI가 파일럿을 넘어 기업의 권한, 맥락, 배포, 평가 체계 안으로 들어가는 흐름이다. Anthropic Status 기준으로 6월 28일 신규 incident는 보고되지 않았으므로 Status Watch로 짧게 기록한다. 이번 페이지에서는 새 기능 출시, 기업 사례, 상태 기록을 서로 섞지 않는다. 업데이트가 적은 날에도 공식 문서 기준으로 무엇이 있었고 무엇이 없었는지 남기는 것이 Dechive AI Updates의 검증 기준이다.',
    closingLine: 'AI 도입은 더 이상 “몇 명이 써봤는가”의 문제가 아니다. 어떤 맥락을 허용하고, 어떤 권한으로 실행하며, 결과를 어떻게 평가할 것인가의 문제다. Dechive는 그 변화가 기업 운영 안에서 어떻게 자리 잡는지 기록한다.',
    updates: [
      {
        id: 'no-major-product-launch-2026-06-28',
        slug: 'no-major-product-launch-2026-06-28',
        title: 'No Major Product Launch',
        summary: '2026년 6월 28일 officialDate 기준으로 대형 새 모델 출시나 일반 사용자용 새 기능 출시는 확인되지 않았다.',
        badges: ['No Major Product Launch', 'Official Source', 'Official Screen Not Required'],
        detailHref: '/ai-updates/2026-06-28#no-major-product-launch-2026-06-28',
        source: {
          label: 'Official Source Check',
          url: 'https://dechive.dev/ai-updates/2026-06-28',
          description: '공식 문서 확인 결과를 기반으로 대형 제품 출시가 없었던 날을 검증 로그로 기록합니다.',
        },
        whatChanged: '새 모델이나 일반 사용자용 기능 출시보다, 기업 AI 도입 사례와 상태 기록이 중심인 날입니다.',
        useCriteria: '새 기능이 없는 날에도 없는 것으로 기록하고, 공식 사례와 상태 기록을 제품 업데이트와 분리해 봐야 합니다.',
        verificationNotes: [
          'officialDate 2026.06.28',
          'checkedDateKST 2026.06.29',
          '대형 새 기능 출시 없음으로 분류',
        ],
        image: {
          status: 'none',
          caption: '별도 이미지 필요 없음. 상태 카드 정도만 사용 가능합니다.',
        },
      },
      {
        id: 'openai-hp-frontier-partnership',
        slug: 'openai-hp-frontier-partnership',
        title: 'OpenAI × HP Frontier Partnership',
        summary: 'OpenAI × HP 사례는 제품 출시가 아니라, AI가 파일럿을 넘어 기업 운영 모델로 들어가는 흐름을 보여주는 공식 사례다.',
        badges: ['Company Update', 'Enterprise AI', 'Case Study', 'Frontier Partnership', 'AI Operating Model', 'Official Source'],
        detailHref: '/ai-updates/2026-06-28#openai-hp-frontier-partnership',
        source: {
          label: 'OpenAI — HP Frontier Partnership',
          url: 'https://openai.com/index/hp-frontier-partnership/',
          description: 'OpenAI 공식 블로그의 HP Inc. Frontier 전략 파트너십 사례를 기준으로 확인합니다.',
        },
        whatChanged: 'HP가 OpenAI Frontier를 통해 고객 경험, 개발, 보안, 내부 생산성 등 여러 업무 영역으로 AI 적용을 확장하려는 흐름입니다.',
        useCriteria: '기업 AI 도입은 사용량보다 권한, 맥락, 배포, 평가 체계를 어떻게 운영 모델로 묶는지 기준으로 봐야 합니다.',
        verificationNotes: [
          'officialDate 2026.06.28',
          'checkedDateKST 2026.06.29',
          '제품 출시가 아니라 Company / Enterprise AI / Case Study / Frontier Partnership으로 분류',
        ],
        image: {
          status: 'available',
          caption: 'OpenAI 공식 블로그의 HP Frontier 관련 이미지가 있으므로 공식 이미지 참고 가능으로 표시합니다.',
        },
      },
      {
        id: 'anthropic-status-no-incident-2026-06-28',
        slug: 'anthropic-status-no-incident-2026-06-28',
        title: 'Anthropic Status — No incident',
        summary: 'Anthropic Status 기준으로 2026년 6월 28일 신규 incident는 보고되지 않았다.',
        badges: ['Status Watch', 'Reliability', 'No Incident', 'Official Source'],
        detailHref: '/ai-updates/2026-06-28#anthropic-status-no-incident-2026-06-28',
        source: {
          label: 'Anthropic Status',
          url: 'https://status.anthropic.com/',
          description: 'Anthropic 공식 상태 페이지의 2026년 6월 28일 incident 기록을 기준으로 확인합니다.',
        },
        whatChanged: '기능 업데이트가 아니라 2026년 6월 28일 신규 incident 없음으로 기록하는 서비스 상태 항목입니다.',
        useCriteria: 'AI 서비스를 업무에 쓸 때는 새 기능뿐 아니라 장애와 무장애 상태도 안정성 기록으로 확인해야 합니다.',
        verificationNotes: [
          'officialDate 2026.06.28',
          'checkedDateKST 2026.06.29',
          '전날 incident를 6월 28일 신규 incident처럼 기록하지 않음',
        ],
        image: {
          status: 'none',
          caption: 'Anthropic Status Page 화면을 참고할 수 있습니다. 별도 설명 이미지는 필수 아닙니다.',
        },
      },
    ],
  },
  {
    date: '2026-06-27',
    title: 'AI 업데이트는 새 기능뿐 아니라 사라지는 모델과 장애 기록도 봐야 한다',
    subtitle: '2026년 6월 27일 officialDate 기준으로 대형 새 기능 출시는 확인되지 않았다. 대신 GPT-4.5의 ChatGPT 종료 시행과 Anthropic Opus 4.8 상태 이슈를 기록한다.',
    quickSummary: [
      '2026년 6월 27일 officialDate 기준으로 Dechive 메인으로 다룰 만한 대형 새 모델 출시나 새 기능 출시는 확인되지 않았다.',
      'OpenAI GPT-4.5는 ChatGPT에서 더 이상 사용할 수 없게 되는 종료 시행 항목으로 기록한다.',
      'Anthropic Status에는 Opus 4.8 elevated errors 이슈가 기록되었으므로, 기능 업데이트가 아니라 Status Watch로 분리한다.',
    ],
    groups: [
      {
        name: 'No Major Product Launch',
        intro: '새 기능을 억지로 만들지 않고, 대형 제품 출시가 확인되지 않은 날이라는 사실 자체를 검증 로그로 남긴다.',
        updates: [
          {
            id: 'no-major-product-launch',
            title: 'No Major Product Launch — 대형 새 기능 출시는 확인되지 않은 날',
            officialDate: '2026.06.27',
            checkedDateKST: '2026.06.28',
            sourceType: 'Official Source Check',
            updateType: 'No Major Product Launch / Verification Log',
            badges: ['No Major Product Launch', 'Official Source', 'Official Screen Not Required'],
            summary: '2026년 6월 27일 officialDate 기준으로 Dechive 메인으로 다룰 만한 대형 새 모델 출시나 새 기능 출시는 확인되지 않았다. 다만 모델 종료 시행과 서비스 상태 이슈는 기록할 가치가 있다.',
            whatChanged: '새로운 메인 기능 출시보다는 기존 모델 종료와 서비스 안정성 기록이 중심인 날이다.',
            whyItMatters: 'AI 업데이트를 매일 기록할 때 중요한 것은 억지로 새 기능을 찾는 것이 아니다. 새 기능이 없는 날에는 없는 것으로 기록하고, 대신 실제 사용자에게 영향을 줄 수 있는 종료 시행과 상태 이슈를 분리해 남겨야 한다.',
            dechiveView: 'Dechive는 속보보다 검증을 우선한다. 업데이트가 없는 날에도 “확인했지만 대형 새 기능 출시는 없었다”고 남기는 것이 신뢰를 만든다.',
            readerTakeaway: 'AI 업데이트는 매일 새로운 기능을 억지로 찾는 일이 아니라, 실제 변화가 있었는지 확인하는 일이다.',
            screenMaterialStatus: '별도 이미지 필요 없음. 상태 카드 정도만 사용 가능하다.',
            cautionNote: '이 항목을 빈 페이지처럼 만들지 말고, GPT-4.5 종료와 Anthropic Status Watch로 이어지는 검증 로그의 도입부로 사용한다.',
          },
        ],
      },
      {
        name: 'OpenAI',
        intro: 'GPT-4.5의 ChatGPT 종료 시행을 새 기능이 아니라 모델 종료와 날짜 표기 차이로 기록한다.',
        updates: [
          {
            id: 'openai-gpt-4-5-retirement-date-discrepancy',
            title: 'OpenAI GPT-4.5 Retirement — 사라지는 모델도 업데이트다',
            officialDate: '2026.06.27 / ChatGPT Release Notes 2026.06.26',
            checkedDateKST: '2026.06.28',
            sourceType: 'Official Model Release Notes / Official ChatGPT Release Notes',
            officialSource: {
              label: 'OpenAI Model Release Notes',
              url: 'https://help.openai.com/en/articles/9624314-model-release-notes',
            },
            updateType: 'Effective Change / Model Retirement / Date Discrepancy',
            badges: ['Effective Change', 'Model Retirement', 'Date Discrepancy', 'Official Source'],
            summary: 'OpenAI의 공식 문서 기준으로 GPT-4.5는 ChatGPT에서 더 이상 사용할 수 없게 되는 종료 시행 항목으로 기록한다. 다만 공식 문서 안에서 날짜 표기가 다르게 보일 수 있다. Model Release Notes에서는 2026년 6월 27일 종료로 보이고, ChatGPT Release Notes에서는 2026년 6월 26일 기준 종료로 안내될 수 있다.',
            whatChanged: 'GPT-4.5가 ChatGPT와 Custom GPT에서 더 이상 사용되지 않는 방향으로 종료된다. 기존 GPT-4.5 대화는 GPT-5.5로 이어질 수 있다. 이 페이지에서는 ChatGPT에 한정된 변경으로 표기하고, API까지 종료된 것처럼 단정하지 않는다.',
            whyItMatters: 'AI 사용자는 새 모델만 보는 것이 아니라, 자신이 쓰던 모델이 언제 사라지는지도 확인해야 한다. 특정 모델의 답변 스타일, 추론 방식, 작업 흐름에 의존하던 사용자에게 모델 종료는 실제 사용 경험의 변화다.',
            dechiveView: 'Dechive 관점에서 이 항목은 매우 중요하다. 공식 문서끼리 날짜가 다르게 보일 때, 그 차이를 덮지 않고 기록해야 한다. AI 검증 아카이브는 “무엇이 새로 나왔나”뿐 아니라 “무엇이 사라졌고, 공식 문서가 어떻게 말하고 있는가”를 함께 봐야 한다.',
            readerTakeaway: 'AI 업데이트는 새 기능만이 아니라, 기존 모델이 사라지는 변화도 포함한다.',
            screenMaterialStatus: '별도 제품 이미지는 필수 아님. OpenAI 공식 릴리즈노트 화면 또는 GPT-4.5에서 GPT-5.5로 이어지는 전환 흐름을 보여주는 설명 이미지 정도가 적합하다.',
            cautionNote: '공식 날짜 차이를 숨기지 않는다. Date Discrepancy 배지를 붙이고, Verification Note에서 OpenAI 공식 문서 기준 종료 날짜 표기가 6월 26일과 6월 27일로 다르게 보일 수 있음을 명확히 기록한다. API까지 종료된 것처럼 단정하지 않는다.',
          },
        ],
      },
      {
        name: 'Anthropic Status',
        intro: 'Opus 4.8 elevated errors는 기능 출시가 아니라 서비스 안정성 확인 항목으로 분리한다.',
        updates: [
          {
            id: 'anthropic-opus-4-8-elevated-errors',
            title: 'Anthropic Status — Opus 4.8 elevated errors',
            officialDate: '2026.06.27',
            checkedDateKST: '2026.06.28',
            sourceType: 'Official Status Page',
            officialSource: {
              label: 'Anthropic Status',
              url: 'https://status.anthropic.com/',
            },
            updateType: 'Status Watch / Reliability / Incident',
            badges: ['Status Watch', 'Reliability', 'Incident', 'Official Source'],
            summary: 'Anthropic Status에 2026년 6월 27일 Opus 4.8 elevated errors 이슈가 기록되었다. 이 항목은 새 기능 출시가 아니라 서비스 안정성 기록이다. 해결 또는 모니터링 상태는 공식 Status Page 기준으로 확인해 작성한다.',
            whatChanged: 'Opus 4.8에서 elevated errors 이슈가 발생했고, 공식 상태 페이지에 기록되었다.',
            whyItMatters: 'AI 서비스를 실제 업무에 쓰는 사람에게는 모델 성능만큼 서비스 안정성도 중요하다. 오류율 증가, 장애, 복구 상태는 사용자가 AI 도구를 신뢰할 수 있는지 판단하는 기준이 된다.',
            dechiveView: 'Dechive에서는 상태 이슈를 기능 업데이트와 분리해야 한다. AI가 잘하는지뿐 아니라 안정적으로 작동했는지도 검증해야 한다. Status Watch는 AI 업데이트의 부록이 아니라, 실제 운영 신뢰성을 확인하는 기록이다.',
            readerTakeaway: 'AI 서비스는 모델 성능뿐 아니라 오류율과 안정성도 함께 봐야 한다.',
            screenMaterialStatus: 'Anthropic Status Page 화면을 참고할 수 있다. 별도 설명 이미지는 필수 아님.',
            cautionNote: '기능 업데이트처럼 쓰지 않는다. Status Watch로 분류한다. 장애 범위나 영향은 공식 Status Page에 적힌 범위 이상으로 확대해서 쓰지 않는다.',
          },
        ],
      },
    ],
    verificationNote: '이번 페이지는 2026.06.28 KST에 확인한 officialDate 2026.06.27 공식 업데이트 기록이다. 2026년 6월 27일 기준으로 대형 새 모델 출시나 새 기능 출시는 확인되지 않았다. 다만 GPT-4.5의 ChatGPT 종료 시행과 Anthropic Opus 4.8 elevated errors 이슈는 기록할 가치가 있다. GPT-4.5 종료 항목은 OpenAI 공식 문서 안에서 날짜 표기가 6월 26일과 6월 27일로 다르게 보일 수 있으므로, 날짜 차이를 숨기지 않고 Date Discrepancy로 기록한다. 이번 페이지에서는 새 기능 출시, 모델 종료, 상태 이슈를 서로 섞지 않는다. 새 기능이 없는 날에도 종료 시행과 안정성 이슈를 기록하는 것이 Dechive AI Updates의 검증 기준이다.',
    closingLine: 'AI 업데이트는 새 기능만 기록하는 일이 아니다. 어떤 모델이 사라졌는지, 어떤 서비스가 불안정했는지, 공식 문서가 날짜를 어떻게 말하고 있는지까지 확인해야 한다. Dechive는 그 빈틈까지 기록한다.',
    updates: [
      {
        id: 'no-major-product-launch',
        slug: 'no-major-product-launch',
        title: 'No Major Product Launch',
        summary: '2026년 6월 27일 officialDate 기준으로 대형 새 모델 출시나 새 기능 출시는 확인되지 않았다.',
        badges: ['No Major Product Launch', 'Official Source', 'Official Screen Not Required'],
        detailHref: '/ai-updates/2026-06-27#no-major-product-launch',
        source: {
          label: 'Official Source Check',
          url: 'https://dechive.dev/ai-updates/2026-06-27',
          description: '공식 문서 확인 결과를 기반으로 대형 제품 출시가 없었던 날을 검증 로그로 기록합니다.',
        },
        whatChanged: '새로운 메인 기능 출시보다는 기존 모델 종료와 서비스 안정성 기록이 중심인 날입니다.',
        useCriteria: '새 기능이 없는 날에도 없는 것으로 기록하고, 실제 사용자에게 영향을 주는 종료 시행과 상태 이슈를 분리해 봐야 합니다.',
        verificationNotes: [
          'officialDate 2026.06.27',
          'checkedDateKST 2026.06.28',
          '대형 새 기능 출시 없음으로 분류',
        ],
        image: {
          status: 'none',
          caption: '별도 이미지 필요 없음. 상태 카드 정도만 사용 가능합니다.',
        },
      },
      {
        id: 'openai-gpt-4-5-retirement-date-discrepancy',
        slug: 'openai-gpt-4-5-retirement-date-discrepancy',
        title: 'OpenAI GPT-4.5 Retirement',
        summary: 'GPT-4.5는 ChatGPT에서 더 이상 사용할 수 없게 되는 종료 시행 항목이며, 공식 문서 안의 날짜 차이를 함께 기록한다.',
        badges: ['Effective Change', 'Model Retirement', 'Date Discrepancy', 'Official Source'],
        detailHref: '/ai-updates/2026-06-27#openai-gpt-4-5-retirement-date-discrepancy',
        source: {
          label: 'OpenAI Model Release Notes',
          url: 'https://help.openai.com/en/articles/9624314-model-release-notes',
          description: 'OpenAI Model Release Notes와 ChatGPT Release Notes의 GPT-4.5 종료 안내를 비교해 기록합니다.',
        },
        whatChanged: 'GPT-4.5가 ChatGPT와 Custom GPT에서 더 이상 사용되지 않는 방향으로 종료됩니다. 기존 GPT-4.5 대화는 GPT-5.5로 이어질 수 있습니다.',
        useCriteria: '모델 종료는 사용자가 의존하던 답변 스타일, 추론 방식, 작업 흐름을 바꿀 수 있으므로 새 모델 출시만큼 확인해야 합니다.',
        verificationNotes: [
          'Model Release Notes 기준 2026.06.27',
          'ChatGPT Release Notes 기준 2026.06.26으로 보일 수 있음',
          'API 종료로 단정하지 않음',
        ],
        image: {
          status: 'none',
          caption: 'OpenAI 공식 릴리즈노트 화면 또는 GPT-4.5에서 GPT-5.5로 이어지는 전환 흐름의 설명 이미지가 적합합니다.',
        },
      },
      {
        id: 'anthropic-opus-4-8-elevated-errors',
        slug: 'anthropic-opus-4-8-elevated-errors',
        title: 'Anthropic Opus 4.8 elevated errors',
        summary: 'Anthropic Status에 Opus 4.8 elevated errors 이슈가 기록되었으며, 기능 업데이트가 아니라 안정성 기록으로 분리한다.',
        badges: ['Status Watch', 'Reliability', 'Incident', 'Official Source'],
        detailHref: '/ai-updates/2026-06-27#anthropic-opus-4-8-elevated-errors',
        source: {
          label: 'Anthropic Status',
          url: 'https://status.anthropic.com/',
          description: 'Anthropic 공식 상태 페이지에 기록된 Opus 4.8 elevated errors 이슈를 기준으로 확인합니다.',
        },
        whatChanged: 'Opus 4.8에서 elevated errors 이슈가 발생했고, 공식 상태 페이지에 기록되었습니다.',
        useCriteria: 'AI 서비스를 실제 업무에 쓸 때는 모델 성능뿐 아니라 오류율 증가, 장애, 복구 상태도 신뢰성 판단 기준으로 봐야 합니다.',
        verificationNotes: [
          'officialDate 2026.06.27',
          'checkedDateKST 2026.06.28',
          '기능 업데이트가 아니라 Status Watch로 분류',
        ],
        image: {
          status: 'none',
          caption: 'Anthropic Status Page 화면을 참고할 수 있습니다. 별도 설명 이미지는 필수 아닙니다.',
        },
      },
    ],
  },
  {
    date: '2026-06-26',
    title: '강한 모델은 조심스럽게 공개되고, AI 도구는 실제 작업 흐름 안으로 들어간다',
    subtitle: '오늘의 공식 업데이트는 GPT-5.6 Sol 제한 프리뷰처럼 더 강한 모델을 단계적으로 공개하는 흐름과, ChatGPT·Claude Code·GitHub Copilot이 음성 입력, 개발 환경, Git 작업, 기업 지표 안으로 더 깊게 들어가는 변화가 중심이다.',
    quickSummary: [
      '모델 업데이트는 GPT-5.6 Sol 제한 프리뷰다. 강한 모델일수록 성능뿐 아니라 공개 방식, 접근 제한, 안전장치를 함께 봐야 한다.',
      '모델 종료와 제품 경험 업데이트는 GPT-4.5 ChatGPT 종료, ChatGPT dictation 개선으로 구분한다. 새 모델만이 아니라 사라지는 모델과 입력 방식도 사용자 경험을 바꾼다.',
      '개발자·기업 업데이트는 Claude Code 2.1.195, GitHub Copilot MAI-Code-1-Flash, GitHub Desktop 3.6, Copilot usage metrics PR merge totals가 중심이다.',
    ],
    groups: [
      {
        name: 'OpenAI',
        intro: 'GPT-5.6 Sol 제한 프리뷰와 GPT-4.5 ChatGPT 종료를 모델 공개와 모델 종료로 나누어 기록한다.',
        updates: [
          {
            id: 'openai-gpt-5-6-sol-limited-preview',
            title: 'OpenAI GPT-5.6 Sol — 더 강한 모델은 더 조심스럽게 공개된다',
            officialDate: '2026.06.26',
            checkedDateKST: '2026.06.27',
            sourceType: 'Official Blog / Official Release',
            officialSource: {
              label: 'OpenAI — Previewing GPT-5.6 Sol',
              url: 'https://openai.com/index/previewing-gpt-5-6-sol/',
            },
            updateType: 'Model Preview / Frontier Model / Limited Preview / Safety',
            badges: ['Model Preview', 'Frontier Model', 'Limited Preview', 'Safety', 'Official Source', 'Explanation Image Recommended'],
            summary: 'OpenAI는 GPT-5.6 시리즈의 제한 프리뷰를 공개했다. Sol은 flagship 모델, Terra는 일상 작업용 균형 모델, Luna는 빠르고 저렴한 모델로 소개된다. Sol은 코딩, 생물학, 사이버보안 쪽 장기 작업 능력을 강화한 모델로 설명된다.',
            whatChanged: 'OpenAI가 GPT-5.6 Sol을 바로 일반 공개하지 않고, 제한된 파트너 대상 프리뷰와 강한 안전장치를 함께 둔 방식으로 공개했다.',
            whyItMatters: '모델 성능이 강해질수록 공개 방식도 중요해진다. 특히 코딩, 생물학, 사이버보안처럼 고위험 가능성이 있는 영역에서 성능이 올라가면, 접근 권한, 사용 제한, 안전 평가, 단계적 배포가 함께 논의되어야 한다.',
            dechiveView: '이 업데이트의 핵심은 “새 모델이 더 강하다”가 아니다. 더 강한 모델을 어떻게 공개할 것인가가 핵심이다. Dechive 관점에서는 모델 성능보다 공개 방식, 안전장치, 제한 프리뷰, 방어적 사용 가능성, 악용 방지 구조를 함께 기록해야 한다.',
            readerTakeaway: '강한 AI 모델은 더 빠르게 공개되는 것이 아니라, 더 많은 안전장치와 단계적 접근 방식 속에서 공개되고 있다.',
            screenMaterialStatus: 'OpenAI 공식 블로그의 GPT-5.6 Sol 관련 공식 이미지가 있으면 참고 가능하다. 화면 자료가 부족하면 “모델 성능 향상 → 제한 프리뷰 → 안전장치 → 단계적 공개” 흐름의 설명 이미지가 적합하다.',
            cautionNote: 'GPT-5.6 Sol이 모든 사용자에게 일반 제공된 것처럼 쓰지 않는다. 제한 프리뷰이며 trusted partners 중심으로 시작했다는 점을 명확히 한다. 사이버보안 능력을 과장하거나 공격적 사용을 부추기는 표현은 피한다.',
          },
          {
            id: 'openai-gpt-4-5-chatgpt-retirement',
            title: 'OpenAI GPT-4.5 Retirement — AI 업데이트는 사라지는 모델도 봐야 한다',
            officialDate: '2026.06.26',
            checkedDateKST: '2026.06.27',
            sourceType: 'Official Release Notes',
            officialSource: {
              label: 'OpenAI ChatGPT Release Notes',
              url: 'https://help.openai.com/en/articles/6825453-chatgpt-release-notes',
            },
            updateType: 'Model Retirement / Effective Change',
            badges: ['Model Retirement', 'Effective Change', 'Official Source'],
            summary: 'OpenAI는 2026년 6월 26일부터 GPT-4.5를 ChatGPT에서 더 이상 사용할 수 없다고 안내했다. 이 변경은 custom GPT에도 적용되며, 기존 GPT-4.5 대화는 GPT-5.5로 계속 이어갈 수 있다.',
            whatChanged: 'GPT-4.5가 ChatGPT와 custom GPT에서 더 이상 사용되지 않게 됐다. 기존 대화는 GPT-5.5로 이어진다.',
            whyItMatters: 'AI 업데이트는 새 모델 출시만을 의미하지 않는다. 사용자가 쓰던 모델이 사라지는 것도 실제 사용 경험에 영향을 준다. 특정 모델의 답변 스타일이나 성능에 맞춰 작업 흐름을 만든 사람에게는 모델 종료가 중요한 변화다.',
            dechiveView: 'Dechive에서는 모델 출시만큼 모델 종료도 기록해야 한다. 검증 가능한 AI 사용은 “무엇이 새로 생겼는가”뿐 아니라 “무엇이 사라졌는가”도 확인하는 일이다.',
            readerTakeaway: 'AI 업데이트는 새 기능만이 아니라, 기존 모델이 사라지는 변화도 포함한다.',
            screenMaterialStatus: 'OpenAI release notes 화면 외 별도 이미지는 필수 아님. 필요하다면 “GPT-4.5 → GPT-5.5로 기존 대화 이어짐” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: 'API까지 GPT-4.5가 종료된 것처럼 쓰지 않는다. 이 변경은 ChatGPT에만 적용되고 API에는 영향이 없다고 명확히 쓴다.',
          },
        ],
      },
      {
        name: 'ChatGPT',
        intro: '6월 26일 공식 release notes 기준으로 ChatGPT의 음성 입력 개선을 제품 경험 변화로 기록한다.',
        updates: [
          {
            id: 'chatgpt-improved-dictation',
            title: 'ChatGPT Dictation — 여러 언어와 조용한 환경의 음성 입력을 더 잘 알아듣다',
            officialDate: '2026.06.26',
            checkedDateKST: '2026.06.27',
            sourceType: 'Official Release Notes',
            officialSource: {
              label: 'OpenAI ChatGPT Release Notes',
              url: 'https://help.openai.com/en/articles/6825453-chatgpt-release-notes',
            },
            updateType: 'Product Update / Dictation / Voice Input / UX Update',
            badges: ['Product Update', 'Dictation', 'Voice Input', 'UX Update', 'Official Source', 'Official Screen Not Confirmed'],
            summary: 'OpenAI는 ChatGPT 전 플랜에 새로운 speech-to-text 모델을 적용해 dictation 정확도를 개선한다고 안내했다. 다국어 화자, 언어 전환, 소음이 있는 장소, 조용하거나 속삭이는 음성, 문자와 숫자 조합 전사에서 개선을 설명한다.',
            whatChanged: 'ChatGPT의 음성 입력은 사용 방식이 크게 바뀌는 UI 업데이트가 아니라, 뒤에서 음성을 텍스트로 바꾸는 모델이 개선되는 형태로 업데이트됐다.',
            whyItMatters: 'AI 사용은 키보드 입력만으로 이루어지지 않는다. 음성 입력이 정확해지면 이동 중 메모, 긴 설명, 다국어 대화, 업무 환경의 빠른 입력에서 AI를 쓰는 방식이 달라질 수 있다.',
            dechiveView: '이 업데이트는 화려한 새 기능보다 입력 품질 개선에 가깝다. 하지만 AI가 실제 도구가 되려면 답변 품질뿐 아니라 사용자가 어떤 방식으로 맥락을 넣을 수 있는지도 중요하다.',
            readerTakeaway: 'ChatGPT는 답변 모델뿐 아니라 사용자가 말로 입력하는 경로도 더 안정적으로 다듬고 있다.',
            screenMaterialStatus: '공식 release notes 화면 외 별도 제품 이미지는 필수 아님. 설명 이미지가 필요하다면 “음성 입력 → speech-to-text → ChatGPT 대화” 흐름이 적합하다.',
            cautionNote: '이 항목을 새로운 음성 대화 UI 출시처럼 쓰지 않는다. 공식 문서 기준으로는 dictation의 behind-the-scenes 정확도 개선이다.',
          },
        ],
      },
      {
        name: 'Claude Code',
        intro: '자동 작업 환경의 안정성 수정은 큰 기능보다 실제 사용 흐름의 안전성과 신뢰성을 기준으로 본다.',
        updates: [
          {
            id: 'claude-code-2-1-195-reliability',
            title: 'Claude Code 2.1.195 — 자동 작업 환경의 입력 안정성과 plugin 통제를 고치다',
            officialDate: '2026.06.26',
            checkedDateKST: '2026.06.27',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'Claude Code changelog',
              url: 'https://code.claude.com/docs/en/changelog',
            },
            updateType: 'Developer Tool / Reliability / CLI Fix / Voice Input / Plugin Control',
            badges: ['Developer Tool', 'Reliability', 'CLI Fix', 'Voice Input', 'Plugin Control', 'Official Changelog'],
            summary: 'Claude Code 2.1.195에는 mouse click 비활성화 환경변수, hook matcher 수정, macOS voice dictation 문제 수정, external plugins 설치 동의 처리 개선, background jobs와 background agent 관련 안정성 수정 등이 포함됐다.',
            whatChanged: 'Claude Code가 자동 작업 환경에서 발생할 수 있는 입력, hook matching, voice dictation, plugin consent, background agent 안정성 문제를 다수 수정했다.',
            whyItMatters: 'AI 코딩 도구가 실제 작업 환경에 깊게 들어갈수록 작은 입력 오류나 plugin 통제 문제, background agent 불안정성이 실제 작업 흐름을 망칠 수 있다. 이런 안정성 수정은 화려하지 않지만 실제 사용자에게 중요하다.',
            dechiveView: 'Claude Code 2.1.195는 “새로운 큰 기능”보다 “AI 코딩 도구가 실제 작업 환경에서 덜 위험하고 덜 불안정하게 작동하도록 다듬는 업데이트”에 가깝다. Dechive에서는 이를 Reliability Update로 분류하는 것이 맞다.',
            readerTakeaway: 'AI 코딩 도구는 강력한 기능만큼, 입력 안정성·plugin 통제·background 작업 안정성도 중요해지고 있다.',
            screenMaterialStatus: 'Claude Code changelog 화면 외 별도 제품 이미지는 필수 아님. 설명 이미지가 필요하다면 “입력 / hook / plugin / background agent / voice dictation 안정성”을 묶은 구조 이미지가 적합하다.',
            cautionNote: '2.1.193과 혼동하지 않는다. 2.1.193은 2026.06.25 항목이고, 이번 페이지에는 2026.06.26의 2.1.195를 사용한다.',
          },
        ],
      },
      {
        name: 'GitHub Copilot',
        intro: 'Copilot이 Microsoft 자체 코딩 모델과 기업용 모델 정책 안으로 확장되는 흐름을 기록한다.',
        updates: [
          {
            id: 'github-copilot-mai-code-1-flash',
            title: 'GitHub Copilot MAI-Code-1-Flash — Microsoft 자체 코딩 모델이 Copilot Business와 Enterprise에 들어오다',
            officialDate: '2026.06.26',
            checkedDateKST: '2026.06.27',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — MAI-Code-1-Flash',
              url: 'https://github.blog/changelog/2026-06-26-mai-code-1-flash-for-copilot-business-and-copilot-enterprise/',
            },
            updateType: 'Coding Model / Copilot / Enterprise AI',
            badges: ['Coding Model', 'Copilot', 'Enterprise AI', 'Official Source', 'Official Screen Not Confirmed'],
            summary: 'GitHub은 Microsoft AI의 자체 코딩 모델 MAI-Code-1-Flash가 GitHub Copilot Business와 Copilot Enterprise에서 일반 제공된다고 발표했다.',
            whatChanged: 'GitHub Copilot이 Microsoft 자체 코딩 모델을 Business와 Enterprise 고객에게 제공한다. Copilot 안의 모델 선택지가 더 다양해지는 흐름이다.',
            whyItMatters: 'AI 코딩 도구는 하나의 모델에 의존하는 제품에서, 여러 모델을 작업에 맞게 선택하거나 라우팅하는 플랫폼으로 바뀌고 있다. 기업은 속도, 비용, 지연시간, 작업 유형에 따라 모델을 선택해야 한다.',
            dechiveView: 'Copilot은 더 이상 “OpenAI 모델을 붙인 코드 보조 도구”로만 보기 어렵다. Microsoft 자체 코딩 모델이 들어오면서, Copilot은 모델 포트폴리오형 개발 도구로 이동하고 있다.',
            readerTakeaway: 'GitHub Copilot은 Microsoft 자체 코딩 모델까지 포함하는 모델 포트폴리오형 코딩 도구로 확장되고 있다.',
            screenMaterialStatus: 'GitHub 공식 changelog에 Copilot model picker 이미지가 있으면 공식 화면 참고 가능으로 표시한다. 공식 화면이 없으면 “Copilot → model picker → MAI-Code-1-Flash” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '관리자가 정책을 활성화해야 사용할 수 있다는 점을 명확히 한다. 모든 사용자가 즉시 자동으로 쓰는 기능처럼 쓰지 않는다.',
          },
        ],
      },
      {
        name: 'GitHub Desktop',
        intro: 'AI가 코드 작성뿐 아니라 커밋 작성, 충돌 해결, worktree 기반 작업 흐름까지 들어가는 변화다.',
        updates: [
          {
            id: 'github-desktop-3-6-copilot-worktrees',
            title: 'GitHub Desktop 3.6 — Copilot이 커밋과 충돌 해결 흐름 안으로 들어가다',
            officialDate: '2026.06.26',
            checkedDateKST: '2026.06.27',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — GitHub Desktop 3.6',
              url: 'https://github.blog/changelog/2026-06-26-github-desktop-3-6-worktrees-and-deeper-copilot-integration/',
            },
            updateType: 'Developer Tool / Git Workflow / GitHub Desktop / Copilot Integration / Worktrees',
            badges: ['Developer Tool', 'Git Workflow', 'GitHub Desktop', 'Copilot', 'Worktrees', 'Merge Conflict', 'Official Source', 'Official Screen Available'],
            summary: 'GitHub Desktop 3.6은 Git worktrees 지원을 추가하고, GitHub Copilot을 commit authoring과 merge conflict resolution 흐름에 더 깊게 통합했다.',
            whatChanged: 'GitHub Desktop 안에서 Copilot이 커밋 작성, merge conflict 해결, worktree 기반 병렬 작업 흐름과 연결됐다.',
            whyItMatters: '개발자는 코드를 쓰는 것뿐 아니라 커밋 메시지를 만들고, 충돌을 해결하고, 여러 브랜치를 오가며 작업한다. AI가 이 Git 흐름 안으로 들어오면 개발자의 실제 작업 과정이 바뀐다.',
            dechiveView: 'AI 코딩 도구의 핵심은 더 이상 “코드를 대신 써주는가”만이 아니다. 커밋, 충돌 해결, 작업 트리 관리처럼 개발자의 현실적인 Git 순간을 얼마나 잘 돕는지가 중요해지고 있다.',
            readerTakeaway: 'AI는 코드 작성뿐 아니라 커밋 작성, 충돌 해결, worktree 관리 같은 Git 작업 흐름 안으로 들어가고 있다.',
            screenMaterialStatus: 'GitHub Desktop 공식 changelog에 worktree 메뉴, commit authoring, model picker 이미지가 있으므로 공식 화면 참고 가능으로 표시한다.',
            cautionNote: 'Copilot-powered 기능은 GitHub Copilot 접근 권한이 필요하다는 점을 명확히 한다. GitHub Desktop 자체는 무료지만 Copilot 기능은 별도 권한이 필요하다.',
          },
        ],
      },
      {
        name: 'Enterprise Metrics',
        intro: '기업용 AI 도입은 사용량 지표에서 결과 지표로 이동하고 있다.',
        updates: [
          {
            id: 'github-copilot-usage-metrics-pr-merge-totals',
            title: 'GitHub Copilot Usage Metrics — AI 도입 단계를 PR merge 지표로 추적하다',
            officialDate: '2026.06.26',
            checkedDateKST: '2026.06.27',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Copilot usage metrics',
              url: 'https://github.blog/changelog/2026-06-26-track-total-merges-by-adoption-phase-in-enterprise-and-organization-reports/',
            },
            updateType: 'Enterprise Analytics / AI Adoption Metrics / Copilot Usage Metrics',
            badges: ['Enterprise Analytics', 'AI Adoption Metrics', 'Copilot', 'Official Source', 'Explanation Image Recommended'],
            summary: 'GitHub은 Copilot usage metrics API의 AI adoption phase cohorts에 total_pull_requests_merged 지표를 추가했다.',
            whatChanged: '기업과 조직은 AI 도입 단계별로 PR merge 총량을 볼 수 있게 됐다. AI adoption phase별 업무 결과를 더 직접적으로 추적할 수 있다.',
            whyItMatters: '기업에서 AI 도구 도입은 “몇 명이 쓰는가”만으로 평가하기 어렵다. 실제로 PR merge 같은 결과 지표가 어떻게 달라지는지 봐야 한다.',
            dechiveView: 'AI 도입은 사용량 지표에서 결과 지표로 이동하고 있다. 앞으로 기업은 “Copilot을 켰는가”보다 “AI를 쓰는 팀이 실제로 어떤 결과를 내는가”를 더 보게 될 것이다.',
            readerTakeaway: '기업은 AI 도입을 단순 사용량이 아니라 PR merge 같은 실제 개발 흐름 지표로 측정하기 시작하고 있다.',
            screenMaterialStatus: 'GitHub reports 또는 usage metrics API 설명 이미지는 공식 화면이 제한적일 수 있다. 공식 화면이 없다면 “AI adoption phase → PR merge totals → enterprise report” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '이 지표는 enterprise administrators와 organization owners가 Copilot usage metrics REST API 접근 권한이 있을 때 확인할 수 있다. 일반 사용자용 기능처럼 쓰지 않는다.',
          },
        ],
      },
      {
        name: 'Backfill / Needs Verification',
        intro: '날짜가 2026.06.26이 아니거나 날짜 확인이 필요한 항목은 메인 업데이트와 분리해 보류한다.',
        updates: [
          {
            id: 'google-cloud-gemini-enterprise-agent-backfill',
            title: 'Backfill Candidate — Google Cloud Gemini Enterprise Agent / MCP Governance',
            officialDate: '2026.06.25',
            checkedDateKST: '2026.06.27',
            sourceType: 'Official Release Notes',
            officialSource: {
              label: 'Google Cloud release notes',
              url: 'https://cloud.google.com/release-notes',
            },
            updateType: 'Backfill / Enterprise AI / Agent Governance / MCP',
            badges: ['Backfill', 'Enterprise AI', 'Agent Governance', 'MCP', 'Official Source'],
            summary: 'Gemini Enterprise release notes의 2026.06.25 항목에 Agent Registry를 통한 agents와 custom MCP servers 관리, Agent Gateway egress policies 관련 내용이 있는지 확인한다.',
            whatChanged: '이 항목은 officialDate 2026.06.26이 아니므로 이번 페이지 메인에 넣지 않는다. 2026.06.25 페이지에서 빠졌다면 backfill 후보로 분리한다.',
            whyItMatters: 'AI agent와 MCP server 관리, egress policy는 기업용 AI 거버넌스에서 중요한 주제지만 날짜 기준을 지켜야 기록의 신뢰성이 유지된다.',
            dechiveView: 'Dechive에서는 흥미로운 항목도 공식 날짜가 맞지 않으면 메인에 섞지 않는다. 날짜 기준을 지키는 것이 업데이트 기록의 첫 번째 검증이다.',
            readerTakeaway: '좋은 항목이어도 공식 날짜가 다르면 해당 날짜의 메인 업데이트로 다루지 않는다.',
            screenMaterialStatus: '공식 release notes 화면 확인이 우선이다. 별도 설명 이미지는 backfill 확정 후 검토한다.',
            cautionNote: '이번 2026.06.26 페이지 메인에 넣지 않는다. 날짜가 2026.06.25라면 Backfill / officialDate 2026.06.25로 분리한다.',
          },
          {
            id: 'adobe-journey-optimizer-ai-assistant-date-verification',
            title: 'Needs Date Verification — Adobe Journey Optimizer AI Assistant',
            officialDate: 'Needs Verification',
            checkedDateKST: '2026.06.27',
            sourceType: 'Official Release Notes',
            officialSource: {
              label: 'Adobe Journey Optimizer release notes',
              url: 'https://experienceleague.adobe.com/',
            },
            updateType: 'Needs Date Verification / Enterprise AI',
            badges: ['Needs Date Verification', 'Enterprise AI', 'Official Screen Not Confirmed'],
            summary: 'Adobe Journey Optimizer release notes 안의 AI Assistant 관련 항목은 날짜를 반드시 확인한다. 2026.06.26 신규 기능인지, 기존/coming soon 설명인지 분리되지 않으면 이번 페이지 메인에 넣지 않는다.',
            whatChanged: '날짜가 명확하지 않으므로 변경 사항으로 확정하지 않는다.',
            whyItMatters: 'release notes 안의 기능 설명은 오늘 새로 나온 기능, 이전 릴리즈, coming soon 항목이 섞일 수 있다. 날짜 확인 없이 메인 업데이트로 넣으면 기록이 흐려진다.',
            dechiveView: 'Dechive에서는 “AI 관련 항목이 있다”보다 “오늘 공식 날짜로 확인됐는가”가 먼저다.',
            readerTakeaway: '날짜가 불명확한 AI Assistant 항목은 보류하고, 공식 날짜가 확인된 뒤 기록한다.',
            screenMaterialStatus: '날짜 확인 전에는 별도 이미지 필요 없음.',
            cautionNote: '날짜가 명확하지 않으면 Needs Date Verification으로 보류한다.',
          },
        ],
      },
    ],
    verificationNote: '이번 페이지는 2026.06.27 KST에 확인한 officialDate 2026.06.26 공식 업데이트를 정리한다. 한국 기준 발행일과 해외 공식 발표일을 구분한다. 오늘 메인 업데이트는 OpenAI GPT-5.6 Sol 제한 프리뷰, GPT-4.5 ChatGPT 종료, ChatGPT dictation 개선, Claude Code 2.1.195, GitHub Copilot MAI-Code-1-Flash, GitHub Desktop 3.6, GitHub Copilot usage metrics 업데이트다. 이번 페이지에서는 모델 프리뷰, 모델 종료, 제품 경험 변경, 개발자 도구 안정성 수정, 코딩 모델 제공, Git 워크플로우 개선, 기업용 AI 도입 지표를 서로 구분한다. 특히 GPT-5.6 Sol은 제한 프리뷰이며 일반 전체 출시가 아니다. GPT-4.5 종료는 ChatGPT에만 적용되고 API에는 영향이 없다. ChatGPT model picker 단순화는 공식 release notes 기준 2026.06.10 항목이므로 이번 2026.06.26 메인 업데이트에서 제외했다. Claude Code는 6월 26일 항목인 2.1.195를 사용하며, 6월 25일 항목인 2.1.193과 혼동하지 않는다.',
    closingLine: 'AI는 더 강해지고 있지만, 동시에 더 조심스럽게 공개되고 있다. 그리고 AI 도구는 음성 입력, 커밋 작성, 충돌 해결, 기업 성과 지표처럼 실제 작업 흐름 안으로 들어간다. Dechive는 그 변화가 무엇을 가능하게 하고, 무엇을 검증해야 하는지 기록한다.',
    updates: [
      {
        id: 'gpt-5-6-sol-preview',
        slug: 'gpt-5-6-sol-preview',
        title: 'GPT-5.6 Sol',
        summary: '강한 모델을 제한 프리뷰와 안전장치 속에서 단계적으로 공개한다.',
        badges: ['Model Preview', 'Frontier Model', 'Limited Preview', 'Safety', 'Official Source'],
        detailHref: '/ai-updates/2026-06-26#openai-gpt-5-6-sol-limited-preview',
        source: {
          label: 'OpenAI official blog',
          url: 'https://openai.com/index/previewing-gpt-5-6-sol/',
          description: 'GPT-5.6 Sol 제한 프리뷰와 단계적 공개 방식을 설명하는 공식 블로그다.',
        },
        whatChanged: 'GPT-5.6 Sol이 trusted partners 중심 제한 프리뷰로 공개됐다.',
        useCriteria: '모델 성능보다 접근 제한, 안전장치, 단계적 공개 여부를 함께 확인한다.',
        verificationNotes: ['officialDate 2026.06.26', 'checkedDateKST 2026.06.27', '제한 프리뷰로 분류'],
        image: {
          status: 'none',
          caption: '공식 발표 이미지가 없으면 모델 성능 향상 → 제한 프리뷰 → 안전장치 흐름의 설명 이미지가 적합하다.',
        },
      },
      {
        id: 'chatgpt-dictation',
        slug: 'chatgpt-dictation',
        title: 'ChatGPT Dictation',
        summary: '새 speech-to-text 모델로 다국어와 소음 환경의 음성 입력 정확도가 개선된다.',
        badges: ['Product Update', 'Dictation', 'Voice Input', 'Official Source'],
        detailHref: '/ai-updates/2026-06-26#chatgpt-improved-dictation',
        source: {
          label: 'OpenAI ChatGPT Release Notes',
          url: 'https://help.openai.com/en/articles/6825453-chatgpt-release-notes',
          description: 'ChatGPT dictation 개선과 GPT-4.5 종료를 포함한 공식 릴리즈노트다.',
        },
        whatChanged: 'ChatGPT의 음성 입력 정확도가 뒤에서 개선되는 형태로 업데이트됐다.',
        useCriteria: '새 UI 출시가 아니라 dictation 정확도 개선이라는 점을 구분한다.',
        verificationNotes: ['officialDate 2026.06.26', 'checkedDateKST 2026.06.27', '제품 경험 업데이트로 분류'],
        image: {
          status: 'none',
          caption: '음성 입력 → speech-to-text → ChatGPT 대화 흐름의 설명 이미지가 적합하다.',
        },
      },
      {
        id: 'github-desktop-3-6',
        slug: 'github-desktop-3-6',
        title: 'GitHub Desktop 3.6',
        summary: 'Copilot이 커밋 작성, merge conflict 해결, worktree 흐름 안으로 들어간다.',
        badges: ['GitHub Desktop', 'Git Workflow', 'Copilot', 'Worktrees', 'Official Source'],
        detailHref: '/ai-updates/2026-06-26#github-desktop-3-6-copilot-worktrees',
        source: {
          label: 'GitHub Changelog',
          url: 'https://github.blog/changelog/2026-06-26-github-desktop-3-6-worktrees-and-deeper-copilot-integration/',
          description: 'GitHub Desktop 3.6의 worktrees와 Copilot 통합을 설명하는 공식 changelog다.',
        },
        whatChanged: 'GitHub Desktop에서 Copilot이 commit authoring과 merge conflict resolution에 더 깊게 통합됐다.',
        useCriteria: 'GitHub Desktop 자체와 Copilot 권한이 필요한 기능을 구분한다.',
        verificationNotes: ['officialDate 2026.06.26', 'checkedDateKST 2026.06.27', 'Git 워크플로우 업데이트로 분류'],
        image: {
          status: 'available',
          caption: 'GitHub Desktop 공식 changelog의 worktree, commit authoring, model picker 화면을 참고할 수 있다.',
        },
      },
    ],
  },
  {
    date: '2026-06-25',
    title: 'AI가 원격 작업, 업무 기억, 코드 리뷰, 조직 도구 안으로 들어간 날',
    subtitle: '오늘의 공식 업데이트는 새 모델 발표보다, AI가 원격 개발 환경, 업무 기억, 에이전트형 작업, 코드 리뷰, Jira·금융·기업 도구 안으로 들어가는 변화가 중심이다.',
    quickSummary: [
      '2026년 6월 25일 공식 업데이트는 Codex Remote GA, ChatGPT Business Memory, Claude Code 2.1.193, GitHub Copilot for Jira GA가 중심이다.',
      '개발자·거버넌스 업데이트는 Copilot Code Review 효율 개선과 strictKnownMarketplaces 공개 프리뷰로 구분한다.',
      'xAI 금융 플랫폼 통합, Gemini preview 모델 종료 시행, Adobe AEM agents, Anthropic Status, Google.org AI Education은 보조 기록으로 분리한다.',
    ],
    groups: [
      {
        name: 'OpenAI',
        intro: 'Codex Remote, ChatGPT Business Memory, agentic work 분석 자료를 기능 출시·엔터프라이즈 기억·연구성 자료로 나누어 읽는다.',
        updates: [
          {
            id: 'openai-codex-remote-ga',
            title: 'OpenAI Codex Remote — AI 코딩이 모바일과 원격 워크스페이스로 확장되다',
            officialDate: '2026.06.25',
            checkedDateKST: '2026.06.26',
            sourceType: 'Official Release Notes',
            officialSource: {
              label: 'OpenAI ChatGPT Release Notes',
              url: 'https://help.openai.com/en/articles/6825453-chatgpt-release-notes',
            },
            updateType: 'Product Update / Codex / Remote Workspace',
            badges: ['Product Update', 'Codex', 'Remote Workspace', 'Official Source', 'Explanation Image Recommended'],
            summary: 'OpenAI는 Codex Remote를 모든 ChatGPT 플랜에서 일반 제공한다고 발표했다. 사용자는 ChatGPT 모바일 앱에서 Mac 또는 Windows host에 연결된 작업을 시작하거나 이어가고, 진행 상황 확인과 action approval도 할 수 있다. DigitalOcean Droplet Workspace plugin도 추가됐다.',
            whatChanged: 'Codex 작업이 로컬 컴퓨터 안에만 머무르지 않고, 모바일 앱과 원격 host, 클라우드 워크스페이스까지 연결되는 방향으로 확장됐다.',
            whyItMatters: 'AI 코딩 도구가 실제 개발 환경을 다룰수록, 사용자는 언제 어디서 작업을 시작하고 승인할 수 있는지가 중요해진다.',
            dechiveView: 'AI는 더 이상 내 컴퓨터 안의 편집기에서만 움직이는 도구가 아니다. 모바일, 로컬 host, 클라우드 워크스페이스가 하나의 작업 흐름으로 연결되고 있다. 원격 작업이 강해질수록 승인, 권한, 연결 방식의 검증이 중요해진다.',
            readerTakeaway: 'Codex는 이제 모바일과 원격 워크스페이스를 통해 개발 작업을 이어갈 수 있는 방향으로 확장되고 있다.',
            screenMaterialStatus: 'ChatGPT 모바일 앱에서 Codex Remote 작업을 확인하거나 QR pairing을 하는 공식 화면이 있으면 가장 적합하다. 공식 화면이 없다면 “모바일 앱 → 로컬 host → DigitalOcean Droplet Workspace” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '이 항목을 “모든 개발 작업이 자동으로 클라우드에서 처리된다”로 과장하지 않는다. Codex Remote와 DigitalOcean plugin의 원격 작업 연결 기능으로 정확히 설명한다.',
          },
          {
            id: 'chatgpt-business-memory-context',
            title: 'ChatGPT Business Memory — 업무 맥락을 기억하되 사용자가 검증할 수 있게 하다',
            officialDate: '2026.06.25',
            checkedDateKST: '2026.06.26',
            sourceType: 'Official Business Release Notes',
            officialSource: {
              label: 'OpenAI ChatGPT Business Release Notes',
              url: 'https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes',
            },
            updateType: 'Enterprise AI / Memory / Personalization / Governance',
            badges: ['Enterprise AI', 'Memory', 'Personalization', 'Governance', 'Official Source'],
            summary: 'ChatGPT Business에서 memory 기능이 개선됐다. 저장된 정보뿐 아니라 과거 대화의 관련 맥락도 활용하고, 사용자는 memory summary, sources, 수정·삭제·끄기 흐름을 확인할 수 있다.',
            whatChanged: 'ChatGPT Business가 사용자의 업무 맥락을 더 넓게 활용하는 방향으로 바뀌었다. 동시에 사용자가 무엇을 기억했는지 확인하고 수정할 수 있는 관리 흐름이 함께 제공된다.',
            whyItMatters: '기업용 AI에서 memory는 편리함만의 문제가 아니다. 어떤 정보를 기억했는지, 어떤 대화를 참조했는지, 그 기억을 사용자가 수정하거나 끌 수 있는지가 신뢰와 거버넌스의 핵심이 된다.',
            dechiveView: 'AI가 업무 맥락을 기억할수록 더 개인화된 답변을 받을 수 있다. 하지만 Dechive 관점에서는 “AI가 기억한다”보다 “무엇을 기억했고, 그것을 사용자가 확인하고 고칠 수 있는가”가 더 중요하다.',
            readerTakeaway: 'ChatGPT Business는 업무 맥락을 더 잘 기억하되, 사용자가 그 기억을 확인하고 관리할 수 있게 하는 방향으로 가고 있다.',
            screenMaterialStatus: 'Memory summary, source 표시, memory 관리 화면이 공식적으로 있으면 참고 가능하다. 공식 화면이 없다면 “업무 대화 → memory → source 확인 → 수정/삭제/끄기” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '개인용 ChatGPT 전체에 동일하게 적용되는 기능처럼 쓰지 않는다. ChatGPT Business memory 개선으로 구분한다. Codex memory에는 영향이 없다는 점도 필요하면 명시한다.',
          },
          {
            id: 'openai-agentic-work-research',
            title: 'OpenAI — 에이전트가 지식 노동의 단위를 바꾸고 있다는 연구/분석 자료',
            officialDate: '2026.06.25',
            checkedDateKST: '2026.06.26',
            sourceType: 'Official Research / Official Blog',
            officialSource: {
              label: 'OpenAI — How agents are transforming work',
              url: 'https://openai.com/index/how-agents-are-transforming-work/',
            },
            updateType: 'Research / Agentic Work / AI Adoption',
            badges: ['Research', 'Agentic Work', 'AI Adoption', 'Official Source', 'Explanation Image Recommended'],
            summary: 'OpenAI는 agentic AI가 지식 노동의 단위를 바꾸고 있다는 연구성 글을 공개했다. 핵심은 AI 사용이 짧은 질의응답에서 긴 작업 위임으로 이동하고 있다는 점이다.',
            whatChanged: '신규 기능 출시라기보다, OpenAI가 agentic AI의 업무 적용 흐름과 경제적 의미를 정리한 분석 자료를 공개했다.',
            whyItMatters: 'AI가 단순 답변 도구에서 업무 위임 도구로 이동하면, 사용자는 질문하는 사람에서 작업을 정의하고, 위임하고, 결과를 검증하는 사람으로 이동한다.',
            dechiveView: 'AI가 “답변”에서 “업무 수행”으로 이동할수록 사람이 해야 할 일은 줄어드는 것이 아니라 바뀐다. 작업 정의, 경계 설정, 결과 검증이 더 중요해진다.',
            readerTakeaway: 'AI 에이전트는 지식 노동을 짧은 답변에서 긴 작업 위임으로 바꾸고 있다.',
            screenMaterialStatus: 'OpenAI 공식 글의 그래프나 이미지가 있으면 참고 가능하다. 없으면 “질문 → 작업 위임 → 도구 호출 → 결과 검증” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '이 항목은 기능 출시가 아니라 연구/분석 자료다. Product Update처럼 작성하지 않는다.',
          },
        ],
      },
      {
        name: 'Claude Code',
        intro: '자동 실행이 늘어나는 코딩 도구에서 거부 이유, 로그, MCP 인증, shell 처리 안정성을 어떻게 남기는지 본다.',
        updates: [
          {
            id: 'claude-code-2-1-193-auto-mode-observability',
            title: 'Claude Code 2.1.193 — 자동 실행의 거부 이유와 관측성을 더 명확히 하다',
            officialDate: '2026.06.25',
            checkedDateKST: '2026.06.26',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'Claude Code changelog',
              url: 'https://code.claude.com/docs/en/changelog',
            },
            updateType: 'Developer Tool / Auto Mode / Security / Observability / MCP',
            badges: ['Developer Tool', 'Auto Mode', 'Security', 'Observability', 'MCP', 'Official Changelog'],
            summary: 'Claude Code 2.1.193에는 autoMode.classifyAllShell 설정, auto-mode 거부 이유 기록, OpenTelemetry log event, bash mode 파일 경로 자동완성, MCP 인증 필요 안내, idle background shell command memory-pressure reaping 등이 포함된다.',
            whatChanged: 'Claude Code가 자동 실행을 더 세밀하게 분류하고, 거부 이유와 로그를 더 명확히 남기며, MCP 인증과 shell command 처리 경험을 개선했다.',
            whyItMatters: 'AI 코딩 도구가 자동으로 명령을 실행할수록, 어떤 명령이 왜 허용되거나 거부됐는지 기록하는 것이 중요하다.',
            dechiveView: '이 업데이트는 기능보다 운영 안전성에 가깝다. AI가 자동 실행을 많이 할수록 “실행 능력”만큼 중요한 것은 “설명 가능한 거부”다.',
            readerTakeaway: 'Claude Code는 자동 실행을 강화하면서도, 왜 거부됐는지와 무엇이 기록되는지를 더 명확히 남기는 방향으로 가고 있다.',
            screenMaterialStatus: 'CLI changelog 항목이므로 실제 제품 화면보다는 “명령 입력 → auto-mode classifier → 허용/거부 → 로그 기록” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '비전공자에게는 명령어 세부보다 “AI가 자동 실행을 할 때 거부 이유와 로그가 더 중요해졌다”는 흐름으로 설명한다.',
          },
        ],
      },
      {
        name: 'GitHub',
        intro: 'Copilot이 Jira, 코드 리뷰, 플러그인 거버넌스까지 확장되는 흐름을 제품 통합·효율 개선·기업 통제로 구분한다.',
        updates: [
          {
            id: 'github-copilot-for-jira-ga',
            title: 'GitHub Copilot for Jira — AI가 이슈 관리 도구 안으로 들어가다',
            officialDate: '2026.06.25',
            checkedDateKST: '2026.06.26',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Copilot for Jira GA',
              url: 'https://github.blog/changelog/2026-06-25-github-copilot-for-jira-is-now-generally-available/',
            },
            updateType: 'Product Integration / Jira / Agent Sessions',
            badges: ['Product Integration', 'Jira', 'Agent Sessions', 'Official Source', 'Official Screen Not Confirmed'],
            summary: 'GitHub Copilot for Jira가 정식 출시됐다. Public preview 이후 model selection, Confluence context via MCP, custom agents, custom fields, space-level guidance, Jira 안의 review request notification 등이 추가됐다.',
            whatChanged: 'GitHub Copilot이 GitHub 안의 코드 보조 도구를 넘어 Jira의 이슈 관리와 팀 업무 흐름 안으로 들어갔다.',
            whyItMatters: '개발 작업은 코드만으로 이루어지지 않는다. 이슈, 문서, 리뷰 요청, 팀 맥락이 함께 연결되어야 한다.',
            dechiveView: 'AI 코딩 도구의 범위가 코드 작성에서 업무 관리로 넓어지고 있다. 앞으로 AI 개발 도구는 Jira 이슈, Confluence 문서, 리뷰 요청, 팀 규칙까지 함께 보게 될 가능성이 크다.',
            readerTakeaway: 'AI 코딩 도구는 이제 코드 편집기뿐 아니라 Jira 같은 이슈 관리 도구 안으로 들어가고 있다.',
            screenMaterialStatus: 'Jira 안에서 Copilot agent session이나 review request notification이 보이는 공식 화면이 있으면 적합하다. 공식 화면이 없으면 “Jira Issue → Confluence Context → Copilot Agent Session → GitHub PR” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '이 기능은 GitHub Copilot for Jira GA 항목으로 설명한다. 모든 Jira 사용자에게 자동 적용되는 일반 AI 기능처럼 쓰지 않는다.',
          },
          {
            id: 'github-copilot-code-review-efficiency',
            title: 'GitHub Copilot Code Review — 관련 코드를 더 빠르게 찾고 비용을 줄이다',
            officialDate: '2026.06.25',
            checkedDateKST: '2026.06.26',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Copilot code review updates',
              url: 'https://github.blog/changelog/2026-06-25-copilot-code-review-analysis-depth-and-efficiency-updates/',
            },
            updateType: 'Code Review / Developer Tool / Efficiency Update',
            badges: ['Code Review', 'Developer Tool', 'Efficiency Update', 'Official Source'],
            summary: 'GitHub Copilot code review가 Copilot CLI와 SDK의 built-in file exploration tools를 사용하도록 개선됐다. grep, rg, glob, view 같은 도구를 사용해 관련 코드를 더 빠르게 찾고, Medium analysis depth preview도 추가됐다.',
            whatChanged: 'Copilot Code Review가 코드 리뷰 과정에서 관련 파일을 탐색하는 방식을 개선하고, 분석 깊이와 비용 효율을 조정할 수 있는 방향으로 확장됐다.',
            whyItMatters: 'AI 코드 리뷰는 단순히 diff만 읽어서는 충분하지 않다. 관련 파일을 찾고, 프로젝트 맥락을 이해하고, 필요한 깊이만큼 분석해야 한다.',
            dechiveView: 'AI 코드 리뷰는 “AI가 리뷰 코멘트를 달아준다”에서 끝나지 않는다. 어떤 파일을 찾아보고, 얼마나 깊게 분석하고, 비용을 얼마나 쓰는지가 실제 품질을 좌우한다.',
            readerTakeaway: 'AI 코드 리뷰는 관련 코드를 더 잘 찾고, 분석 깊이와 비용을 조절하는 방향으로 발전하고 있다.',
            screenMaterialStatus: 'Copilot Code Review 화면이나 analysis depth 관련 공식 화면이 있으면 적합하다. 공식 화면이 없다면 “PR diff → file exploration tools → analysis depth → review comment” 흐름의 설명 이미지가 적합하다.',
            cautionNote: 'Medium analysis depth는 preview로 구분한다. “모든 리뷰 비용이 항상 20% 절감된다”처럼 일반화하지 않는다.',
          },
          {
            id: 'github-strict-known-marketplaces-preview',
            title: 'GitHub Enterprise Governance — Copilot 플러그인 설치 경로를 기업이 통제하다',
            officialDate: '2026.06.25',
            checkedDateKST: '2026.06.26',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — strictKnownMarketplaces',
              url: 'https://github.blog/changelog/2026-06-25-enterprise-managed-settings-now-support-strictknownmarketplaces-in-vs-code-and-the-cli/',
            },
            updateType: 'Enterprise Governance / Plugin Control / Security / Public Preview',
            badges: ['Enterprise Governance', 'Plugin Control', 'Security', 'Public Preview', 'Official Source'],
            summary: 'GitHub은 Copilot CLI와 VS Code에서 사용자가 설치할 수 있는 plugin marketplace를 기업이 통제할 수 있는 strictKnownMarketplaces 설정을 공개 프리뷰로 추가했다.',
            whatChanged: '기업은 Copilot 환경에서 사용자가 어떤 plugin marketplace를 사용할 수 있는지 제한할 수 있게 됐다.',
            whyItMatters: 'AI 도구가 plugin과 외부 도구를 연결할수록, 신뢰할 수 없는 확장 기능이 보안 위험이 될 수 있다.',
            dechiveView: 'AI 거버넌스는 모델 선택이나 데이터 정책만의 문제가 아니다. AI가 연결하는 plugin, marketplace, 외부 도구 경로까지 관리해야 한다.',
            readerTakeaway: 'AI 도구가 plugin을 연결할수록, 기업은 어떤 plugin을 허용할지 통제해야 한다.',
            screenMaterialStatus: 'VS Code 또는 Copilot CLI의 plugin marketplace 설정 화면이 있으면 적합하다. 없으면 “기업 정책 → 허용된 marketplace → Copilot plugin 설치” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '이 기능은 Public Preview다. 정식 일반 출시처럼 단정하지 않는다.',
          },
        ],
      },
      {
        name: 'xAI',
        intro: '금융 플랫폼 통합은 투자 조언이 아니라 제품 통합과 사용 맥락 변화로 제한해 기록한다.',
        updates: [
          {
            id: 'xai-grok-interactive-brokers',
            title: 'xAI Grok / Interactive Brokers — AI가 금융 플랫폼 안으로 들어가다',
            officialDate: '2026.06.25',
            checkedDateKST: '2026.06.26',
            sourceType: 'Official Company Blog',
            officialSource: {
              label: 'xAI News — Grok and Interactive Brokers',
              url: 'https://x.ai/news/grok-interactive-brokers',
            },
            updateType: 'Financial AI / Platform Integration',
            badges: ['Financial AI', 'Platform Integration', 'Official Source', 'Official Screen Not Confirmed'],
            summary: 'xAI는 Interactive Brokers와 Grok 통합을 발표했다. Grok은 투자 플랫폼 경험 안에서 portfolio analysis, scenario modeling, research, order instructions 같은 영역에 활용될 수 있다고 소개된다.',
            whatChanged: 'Grok이 금융 플랫폼의 사용자 경험 안으로 들어가는 통합 사례가 공개됐다.',
            whyItMatters: 'AI가 금융 플랫폼 안으로 들어가면 사용자는 투자 정보 탐색, 시나리오 비교, 포트폴리오 분석 같은 작업을 대화형 인터페이스로 할 수 있다. 하지만 금융 영역은 오해나 과신 위험이 크다.',
            dechiveView: '이 항목을 투자 추천처럼 다루면 안 된다. 핵심은 Grok이 금융 플랫폼 안으로 들어간다는 제품 통합 흐름이다.',
            readerTakeaway: 'AI는 금융 플랫폼 안으로 들어가고 있지만, 투자 판단을 대신하는 도구로 이해하면 위험하다.',
            screenMaterialStatus: 'Interactive Brokers 안에서 Grok이 보이는 공식 화면이 있으면 참고 가능하다. 없으면 “금융 플랫폼 → Grok → 포트폴리오 분석/시나리오/리서치” 흐름의 설명 이미지가 적합하다.',
            cautionNote: '투자 조언처럼 작성하지 않는다. “매수/매도 판단을 돕는다”거나 “수익을 높인다”는 식의 표현은 피한다. 제품 통합 사례로만 다룬다.',
          },
        ],
      },
      {
        name: 'Google / Gemini',
        intro: '새 기능 발표가 아니라, 기존 preview 모델 종료 일정이 실제 시행되는 Effective Change로 기록한다.',
        updates: [
          {
            id: 'gemini-image-preview-models-shutdown',
            title: 'Gemini Image Preview Models — 이미지 preview 모델 종료 시행',
            officialDate: '2026.06.25',
            checkedDateKST: '2026.06.26',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'Google AI Developers — Gemini API changelog',
              url: 'https://ai.google.dev/gemini-api/docs/changelog',
            },
            updateType: 'Effective Change / Deprecation',
            badges: ['Effective Change', 'Deprecation', 'Official Source'],
            summary: 'Gemini API changelog에는 gemini-3.1-flash-image-preview와 gemini-3-pro-image-preview가 2026년 6월 25일에 shut down된다는 기존 공지가 있다.',
            whatChanged: '기존 preview 이미지 모델 종료 일정이 2026년 6월 25일에 실제 시행된다.',
            whyItMatters: 'AI 모델과 preview API는 영구적으로 유지되지 않을 수 있다. 서비스를 만드는 사람은 모델 종료 일정과 대체 모델을 확인해야 한다.',
            dechiveView: '이 항목은 신기능이 아니라 Effective Change로 기록해야 한다. AI 업데이트는 새 기능만이 아니라, preview 모델 종료처럼 실제 사용에 영향을 주는 변화도 포함한다.',
            readerTakeaway: 'AI API를 쓰는 사람은 새 모델뿐 아니라 종료되는 preview 모델도 확인해야 한다.',
            screenMaterialStatus: '공식 changelog 화면 외 별도 이미지 필요 없음.',
            cautionNote: '오늘 새로 발표된 업데이트처럼 쓰지 않는다. 기존 공지의 시행일로 분류한다.',
          },
        ],
      },
      {
        name: 'Adobe',
        intro: '기업 콘텐츠 관리 시스템 안의 agentic capabilities 실험을 보조 기록으로 다룬다.',
        updates: [
          {
            id: 'adobe-aem-cloud-service-agents',
            title: 'Adobe AEM as a Cloud Service 2026.6.0 — 기업 콘텐츠 관리 안의 에이전트 실험',
            officialDate: '2026.06.25',
            checkedDateKST: '2026.06.26',
            sourceType: 'Official Release Notes',
            officialSource: {
              label: 'Adobe Experience Manager as a Cloud Service Release Notes',
              url: 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/release-notes/release-notes/release-notes-current',
            },
            updateType: 'Enterprise CMS / Agents in AEM / Beta / Feature Release',
            badges: ['Enterprise AI', 'Enterprise CMS', 'Agentic Workflow', 'Beta', 'Feature Release', 'Official Source'],
            summary: 'Adobe Experience Manager as a Cloud Service 2026.6.0 feature release 날짜가 2026년 6월 25일로 올라와 있다. 문서에는 Agents in AEM 베타 프로그램이 언급된다.',
            whatChanged: 'Adobe AEM 환경에서도 기업 콘텐츠 관리, 거버넌스, 최적화, 탐색, 개발 과정에 에이전트 기능을 실험하는 흐름이 확인된다.',
            whyItMatters: '기업 콘텐츠 관리 시스템은 많은 승인, 관리, 검색, 최적화 작업을 포함한다. 에이전트가 이 영역에 들어오면 콘텐츠 운영 방식이 바뀔 수 있다.',
            dechiveView: '이 항목은 메인 AI 기능 출시라기보다, 기업 CMS 안에서 에이전트 기능이 실험되고 있다는 보조 기록으로 적합하다.',
            readerTakeaway: 'AI 에이전트는 개발 도구뿐 아니라 기업 콘텐츠 관리 시스템 안에서도 실험되고 있다.',
            screenMaterialStatus: 'Adobe AEM release notes나 Agents in AEM 관련 공식 화면이 있으면 참고 가능하다. 없으면 별도 이미지는 필수 아님.',
            cautionNote: 'Content Hub의 AI Search를 2026.06.25 신규 기능처럼 쓰지 않는다. AI Search는 별도 이전 릴리즈 항목으로 구분해야 한다.',
          },
        ],
      },
      {
        name: 'Status Watch',
        intro: '서비스 상태 기록은 기능 업데이트와 분리해서 안정성 확인 항목으로만 짧게 남긴다.',
        updates: [
          {
            id: 'anthropic-status-2026-06-25',
            title: 'Anthropic Status — 6월 25일 신규 incident 없음',
            officialDate: '2026.06.25',
            checkedDateKST: '2026.06.26',
            sourceType: 'Official Status Page',
            officialSource: {
              label: 'Anthropic Status',
              url: 'https://status.anthropic.com/',
            },
            updateType: 'Status Watch / Reliability',
            badges: ['Status Watch', 'Official Source', 'Official Screen Available'],
            summary: 'Anthropic Status 기준으로 2026년 6월 25일에는 별도 incident가 보고되지 않았다.',
            whatChanged: '기능 업데이트가 아니라 서비스 상태 기록이다.',
            whyItMatters: 'AI 서비스는 모델 성능뿐 아니라 실제 운영 안정성도 중요하다. incident가 없는 날도 Status Watch로 짧게 기록할 수 있다.',
            dechiveView: '이 항목은 메인 업데이트가 아니라 Status Watch로 분리하는 것이 적절하다. AI는 잘하는 것뿐 아니라 안정적으로 작동하는지도 검증해야 한다.',
            readerTakeaway: 'AI 서비스의 안정성도 업데이트 기록에서 함께 확인할 필요가 있다.',
            screenMaterialStatus: 'Status page 화면을 참고할 수 있다.',
            cautionNote: '기능 업데이트처럼 쓰지 않는다. Status Watch로만 짧게 다룬다.',
          },
        ],
      },
      {
        name: 'Education / AI',
        intro: '교육과 AI 지원 발표는 제품 업데이트가 아니라 접근성·리터러시 흐름의 보조 기록으로 둔다.',
        updates: [
          {
            id: 'google-org-education-ai-funding',
            title: 'Google.org — 교육과 AI 관련 지원 발표',
            officialDate: '2026.06.25',
            checkedDateKST: '2026.06.26',
            sourceType: 'Official Blog',
            officialSource: {
              label: 'Google Blog — Google.org education AI funding',
              url: 'https://blog.google/company-news/outreach-and-initiatives/google-org/education-ai-funding/',
            },
            updateType: 'AI Education / Funding / Official Blog',
            badges: ['AI Education', 'Funding', 'Official Source'],
            summary: 'Google.org는 교육과 AI 관련 장기 파트너 지원 내용을 공개했다. AI를 교육 현장에 적용하고, 학습자와 교육기관을 지원하기 위한 사회공헌/지원 성격의 발표다.',
            whatChanged: '신규 AI 제품 출시라기보다는, 교육과 AI를 연결하는 지원 프로그램 발표에 가깝다.',
            whyItMatters: 'AI가 교육 현장에 확산될수록, 기술 접근성, 교육 격차, 교사와 학생의 활용 역량이 중요한 문제가 된다.',
            dechiveView: '이 항목은 AI 제품 업데이트 메인으로 보기에는 약하다. 다만 AI 리터러시와 교육 흐름을 함께 기록한다면 보조 항목으로 짧게 남길 수 있다.',
            readerTakeaway: 'AI는 제품 업데이트뿐 아니라 교육과 접근성 영역에서도 중요한 주제가 되고 있다.',
            screenMaterialStatus: '공식 블로그 이미지가 있으면 참고 가능하다. 별도 설명 이미지는 필수 아님.',
            cautionNote: '제품 업데이트처럼 쓰지 않는다. AI Education / Funding 항목으로 분류한다.',
          },
        ],
      },
    ],
    verificationNote: '이번 페이지는 2026.06.26 KST에 확인한 officialDate 2026.06.25 공식 업데이트를 정리한다. 한국 시간 기준으로는 하루 늦게 해외 공식 업데이트를 정리하는 운영 방식이 더 정확하므로, Dechive 발행일과 공식 발표일을 구분한다. 오늘 메인 업데이트는 OpenAI Codex Remote GA, ChatGPT Business Memory 개선, OpenAI의 agentic work 분석 자료, Claude Code 2.1.193, GitHub Copilot for Jira GA, Copilot Code Review 개선, GitHub strictKnownMarketplaces 공개 프리뷰다. xAI Grok / Interactive Brokers는 금융 플랫폼 통합 사례로 조심스럽게 다루고, Gemini image preview models shutdown은 새 기능이 아니라 Effective Change로 기록한다. Adobe AEM Agents는 기업 CMS 안의 에이전트 실험으로 보조 기록하며, Anthropic Status와 Google.org 교육 AI 지원은 메인 업데이트가 아니라 상태/보조 기록으로 분리한다. 기능 출시, 연구/분석 자료, 공개 프리뷰, 시행 변경, 상태 기록을 서로 섞지 않는다.',
    closingLine: 'AI는 이제 답변창 밖에서 작동한다. 원격 개발 환경을 열고, 업무 맥락을 기억하고, 코드 리뷰와 Jira 작업을 돕고, 금융·기업 도구 안으로 들어간다. Dechive는 그 변화가 실제로 무엇을 바꾸는지 기록한다.',
    updates: [
      {
        id: 'codex-remote-ga',
        slug: 'codex-remote-ga',
        title: 'OpenAI Codex Remote',
        summary: '모바일과 원격 워크스페이스로 AI 코딩 작업을 이어갈 수 있게 됐다.',
        badges: ['Product Update', 'Codex', 'Remote Workspace', 'Official Source'],
        detailHref: '/ai-updates/2026-06-25#openai-codex-remote-ga',
        source: {
          label: 'OpenAI ChatGPT Release Notes',
          url: 'https://help.openai.com/en/articles/6825453-chatgpt-release-notes',
          description: 'Codex Remote 일반 제공과 DigitalOcean Droplet Workspace plugin 관련 공식 릴리즈노트다.',
        },
        whatChanged: 'Codex가 모바일 앱, 로컬 host, 원격 워크스페이스를 하나의 작업 흐름으로 연결한다.',
        useCriteria: '원격 개발 작업을 켜고 승인할 때 인증, 권한, host 연결 방식을 함께 확인해야 한다.',
        verificationNotes: ['officialDate 2026.06.25', 'checkedDateKST 2026.06.26', '제품 업데이트로 분류'],
        image: {
          status: 'none',
          caption: '공식 화면이 없으면 모바일 앱 → 로컬 host → remote workspace 흐름의 설명 이미지가 적합하다.',
        },
      },
      {
        id: 'chatgpt-business-memory',
        slug: 'chatgpt-business-memory',
        title: 'ChatGPT Business Memory',
        summary: '업무 맥락을 더 넓게 기억하되, 사용자가 기억과 출처를 확인하고 관리할 수 있게 됐다.',
        badges: ['Enterprise AI', 'Memory', 'Governance', 'Official Source'],
        detailHref: '/ai-updates/2026-06-25#chatgpt-business-memory-context',
        source: {
          label: 'OpenAI ChatGPT Business Release Notes',
          url: 'https://help.openai.com/en/articles/11391654-chatgpt-business-release-notes',
          description: 'ChatGPT Business memory 개선과 사용자 관리 흐름을 설명하는 공식 릴리즈노트다.',
        },
        whatChanged: '저장된 기억과 과거 대화 맥락을 활용하되 memory summary, sources, 수정·삭제·끄기 흐름을 제공한다.',
        useCriteria: '업무 기억은 편의 기능이면서 동시에 검증 가능한 관리 대상이어야 한다.',
        verificationNotes: ['officialDate 2026.06.25', 'checkedDateKST 2026.06.26', 'ChatGPT Business 항목으로 제한'],
        image: {
          status: 'none',
          caption: '업무 대화 → memory → source 확인 → 수정/삭제/끄기 흐름의 설명 이미지가 적합하다.',
        },
      },
      {
        id: 'github-copilot-for-jira-ga',
        slug: 'github-copilot-for-jira-ga',
        title: 'GitHub Copilot for Jira',
        summary: 'Copilot이 Jira 이슈 관리와 팀 업무 흐름 안으로 들어간다.',
        badges: ['Product Integration', 'Jira', 'Agent Sessions', 'Official Source'],
        detailHref: '/ai-updates/2026-06-25#github-copilot-for-jira-ga',
        source: {
          label: 'GitHub Changelog',
          url: 'https://github.blog/changelog/2026-06-25-github-copilot-for-jira-is-now-generally-available/',
          description: 'GitHub Copilot for Jira GA 공식 changelog다.',
        },
        whatChanged: 'Copilot이 GitHub 내부 코드 보조를 넘어 Jira, Confluence context, agent session 흐름과 연결된다.',
        useCriteria: 'AI가 이슈 관리 도구 안으로 들어갈수록 팀 규칙, 문서 맥락, 리뷰 요청이 함께 검증되어야 한다.',
        verificationNotes: ['officialDate 2026.06.25', 'checkedDateKST 2026.06.26', '제품 통합 항목으로 분류'],
        image: {
          status: 'none',
          caption: 'Jira Issue → Confluence Context → Copilot Agent Session → GitHub PR 흐름의 설명 이미지가 적합하다.',
        },
      },
    ],
  },
  {
    date: '2026-06-24',
    title: 'AI가 대화 품질, 컴퓨터 조작, 인프라, 외부 도구 연결로 확장된 날',
    subtitle: '오늘의 업데이트는 새 챗봇 출시가 아니라, AI가 더 나은 의사결정 대화를 제공하고, 컴퓨터 환경을 조작하는 도구로 확장되며, LLM 추론 인프라와 외부 도구 연결의 통제 장치까지 강화되는 변화가 중심이다.',
    quickSummary: [
      '2026.06.25 KST 기준으로 새롭게 확인한 officialDate 2026.06.24 항목은 ChatGPT 대화 품질, Gemini Computer Use 공개 프리뷰, OpenAI/Broadcom 추론 칩, Mistral connector 통제, GitHub Copilot 모델 선택, Claude Code 안정성 개선이다.',
      '기존에 작성한 officialDate 2026.06.23 항목은 중복 작성하지 않고, 새로 확인된 공식 날짜 항목과 이전 확인 항목을 섹션으로 구분한다.',
      '이번 보강은 기능 업데이트, 공개 프리뷰, 인프라 발표, 엔터프라이즈 거버넌스, 제품 정책 변경, 안정성 개선을 같은 무게로 섞지 않고 분리해 읽는다.',
    ],
    groups: [
      {
        name: '새로 확인된 공식 업데이트 — 2026.06.24',
        intro: '2026.06.25 KST 기준으로 새롭게 확인한 officialDate 2026.06.24 항목이다. 기존 6월 23일 공식 날짜 항목과 섞지 않고 별도로 읽는다.',
        updates: [
          {
            id: 'openai-chatgpt-gpt-5-5-instant-quality',
            title: 'OpenAI ChatGPT — GPT-5.5 Instant 대화 품질 업데이트',
            officialDate: '2026.06.24',
            checkedDateKST: '2026.06.25',
            sourceType: 'Official Release Notes',
            officialSource: {
              label: 'OpenAI ChatGPT Release Notes',
              url: 'https://help.openai.com/en/articles/6825453-chatgpt-release-notes',
            },
            updateType: 'Product Update / Model Behavior Update',
            badges: ['Product Update', 'Model Behavior Update', 'Official Source', 'Explanation Image Recommended'],
            summary: 'OpenAI는 GPT-5.5 Instant 업데이트를 공개했다. 이 업데이트는 ChatGPT에서 많이 사용되는 GPT-5.5 Instant의 대화 품질을 개선하는 내용이다.',
            whatChanged: 'GPT-5.5 Instant가 사용자의 숨은 목적을 더 잘 파악하고, 여러 제약 조건이 있는 요청을 더 잘 따라가며, 사용자가 조건을 추가하거나 반박할 때 기존 답을 반복하지 않고 더 잘 적응하도록 조정됐다.',
            whyItMatters: 'AI 사용자는 단순한 지식 답변보다 “무엇을 선택해야 하는가”, “어떤 조건을 고려해야 하는가”, “내 상황에서는 무엇이 더 나은가”를 자주 묻는다. 이런 상황에서 모델이 조건과 반박을 더 잘 따라가는 것은 실제 사용 경험에 직접적인 영향을 준다.',
            dechiveView: '이 업데이트는 화려한 새 기능은 아니지만 중요하다. AI가 더 빨리 답하는 것보다, 사용자의 조건과 의도를 더 잘 따라가는 것이 실제 활용에서는 더 중요할 수 있다.',
            readerTakeaway: 'ChatGPT는 단순히 빠르게 답하는 모델이 아니라, 사용자의 조건과 반박을 더 잘 따라가며 선택을 도와주는 방향으로 조정되고 있다.',
            screenMaterialStatus: '공식 릴리즈노트에는 별도 제품 화면이 없을 수 있다. 실제 화면보다는 “복잡한 조건을 가진 사용자 요청 → GPT-5.5 Instant가 조건을 정리해 답변”하는 설명 이미지가 적합하다.',
            cautionNote: '이 항목을 “새 모델 출시”로 쓰지 않는다. GPT-5.5 Instant의 동작/대화 품질 업데이트로 표기한다.',
          },
          {
            id: 'google-gemini-api-computer-use-preview',
            title: 'Google Gemini API — Computer Use 도구 공개 프리뷰',
            officialDate: '2026.06.24',
            checkedDateKST: '2026.06.25',
            sourceType: 'Official Changelog / Official Documentation',
            officialSource: {
              label: 'Google AI Developers — Gemini API changelog',
              url: 'https://ai.google.dev/gemini-api/docs/changelog',
            },
            updateType: 'Tool Update / Computer Use / Agentic AI / Public Preview',
            badges: ['Tool Update', 'Computer Use', 'Agentic Workflow', 'Public Preview', 'Official Source'],
            summary: 'Google은 Gemini API에서 Computer Use 도구의 공개 프리뷰 지원을 시작했다. Gemini 3.5 Flash에서 사용할 수 있으며, 브라우저·모바일·데스크톱 환경과 안전 정책을 포함한다.',
            whatChanged: 'Gemini API가 텍스트 응답 중심에서 벗어나, 컴퓨터 환경을 조작하는 도구 사용 흐름으로 확장된다. AI가 브라우저나 앱 환경에서 작업을 수행할 수 있는 기반이 열린 것이다.',
            whyItMatters: 'Computer Use는 AI 에이전트에서 중요한 단계다. AI가 단순히 “방법을 설명”하는 것과 실제 화면·브라우저·앱 환경을 사용해 작업을 수행하는 것은 다르다.',
            dechiveView: 'AI가 컴퓨터를 사용할 수 있게 될수록 “무엇을 할 수 있는가”보다 “어디까지 허용할 것인가”, “위험한 지시를 어떻게 막을 것인가”, “사용자가 검증할 수 있는가”가 중요해진다.',
            readerTakeaway: 'Gemini API는 AI가 답변하는 단계를 넘어, 컴퓨터 환경을 사용하는 에이전트 도구로 확장되고 있다.',
            screenMaterialStatus: '공식 문서 화면 또는 Computer Use 흐름을 보여주는 설명 다이어그램이 적합하다. 실제 제품 화면이 명확하지 않다면 “AI → 브라우저/앱 환경 → 안전 정책/프롬프트 인젝션 감지” 구조를 시각화한다.',
            cautionNote: '이 기능은 Public Preview다. 정식 일반 출시처럼 쓰지 않는다. 또한 “AI가 마음대로 컴퓨터를 조작한다”처럼 과장하지 않는다.',
          },
          {
            id: 'openai-broadcom-jalapeno-inference-chip',
            title: 'OpenAI + Broadcom — Jalapeño LLM 추론 칩 공개',
            officialDate: '2026.06.24',
            checkedDateKST: '2026.06.25',
            sourceType: 'Official Company Blog',
            officialSource: {
              label: 'OpenAI official blog',
              url: 'https://openai.com/',
            },
            updateType: 'Infrastructure / AI Chip / Inference / Company Update',
            badges: ['Infrastructure', 'AI Chip', 'Inference', 'Company Update', 'Official Source'],
            summary: 'OpenAI와 Broadcom은 LLM 추론에 최적화된 AI 칩 Jalapeño를 공개했다. OpenAI는 이 칩을 현재와 미래의 LLM 추론을 위해 설계한 가속기로 설명한다.',
            whatChanged: 'OpenAI가 모델 자체뿐 아니라, 모델을 더 빠르고 효율적으로 운영하기 위한 추론 인프라까지 직접 설계하는 방향을 보여준다.',
            whyItMatters: 'AI 경쟁은 모델 성능만으로 끝나지 않는다. 실제 사용자에게 AI를 제공하려면 추론 비용, 전력 효율, 응답 속도, 데이터센터 배치, 확장성이 중요하다.',
            dechiveView: '이 업데이트는 일반 사용자가 바로 체감하는 기능은 아니다. 하지만 앞으로 AI 경쟁은 “누가 더 좋은 모델을 만들었나”뿐 아니라 “누가 그 모델을 더 빠르고 저렴하고 안정적으로 운영할 수 있나”로 이동한다.',
            readerTakeaway: 'AI 경쟁은 모델 성능을 넘어, 그 모델을 운영할 수 있는 추론 인프라 경쟁으로 확장되고 있다.',
            screenMaterialStatus: 'OpenAI 공식 블로그에 Jalapeño 칩 이미지가 있다면 공식 이미지 참고 가능으로 표시한다. 없거나 사용이 어렵다면 “모델 → 추론 칩 → 데이터센터 → ChatGPT/Codex/API” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '이 항목은 사용자 기능 업데이트가 아니라 인프라/회사 발표다. “ChatGPT가 오늘 빨라졌다”처럼 직접 체감 효과를 단정하지 않는다.',
          },
          {
            id: 'mistral-connectors-control-governance',
            title: 'Mistral — Connectors 통제·보안·디버깅 기능 강화',
            officialDate: '2026.06.24',
            checkedDateKST: '2026.06.25',
            sourceType: 'Official Blog',
            officialSource: {
              label: 'Mistral AI official blog',
              url: 'https://mistral.ai/news/',
            },
            updateType: 'Enterprise AI / Connectors / Governance / MCP / Admin Control',
            badges: ['Enterprise AI', 'Connectors', 'Governance', 'MCP', 'Admin Control', 'Official Source'],
            summary: 'Mistral은 Connectors를 더 안전하게 운영하기 위한 기능을 발표했다. 조직·워크스페이스 접근 제어, 도구 on/off, connector scope API key, multi-account connectors, Connectors Debugger 등이 포함된다.',
            whatChanged: 'AI가 외부 기업 도구와 연결될 때, 누가 어떤 connector를 사용할 수 있는지, 어떤 도구를 켜고 끌 수 있는지, 어떤 계정으로 실행되는지, 연결 실패 원인을 어떻게 추적할 수 있는지가 더 명확해졌다.',
            whyItMatters: '기업에서 AI 에이전트를 쓰려면 CRM, 저장소, 메일, 지식베이스 같은 실제 데이터와 연결해야 한다. 하지만 연결만 되면 위험하다. 권한, 계정, 도구 범위, 실패 원인 분석이 있어야 운영 환경에서 쓸 수 있다.',
            dechiveView: '이 항목은 “AI가 더 많은 도구와 연결된다”보다 “AI가 외부 도구와 연결될 때 필요한 통제 장치가 강화된다”는 점이 중요하다.',
            readerTakeaway: 'AI가 외부 도구와 연결될수록 중요한 것은 연결 자체가 아니라, 누가 무엇을 어디까지 실행할 수 있는지 통제하는 능력이다.',
            screenMaterialStatus: '공식 블로그의 connector 관리 화면이나 debugger 화면이 있다면 공식 화면 참고 가능으로 표시한다. 공식 화면이 없으면 “AI agent → Connector → 권한/계정/도구 범위/디버깅” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '이 항목은 일반 소비자용 업데이트가 아니라 엔터프라이즈 AI 운영/거버넌스 업데이트다. “AI가 모든 외부 도구를 자유롭게 쓴다”가 아니라 “외부 도구 연결을 더 안전하게 관리한다”로 설명한다.',
          },
          {
            id: 'github-copilot-free-student-auto-model-selection',
            title: 'GitHub Copilot — Free/Student 플랜 모델 선택을 Auto로 통일',
            officialDate: '2026.06.24',
            checkedDateKST: '2026.06.25',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog',
              url: 'https://github.blog/changelog/',
            },
            updateType: 'Product Policy / Model Selection / Auto Routing',
            badges: ['Product Policy', 'Model Selection', 'Auto Routing', 'Official Source', 'Official Screen Not Confirmed'],
            summary: 'GitHub은 Copilot Free와 Student 플랜에서 Copilot auto model selection을 기본이자 유일한 모델 선택 경험으로 사용한다고 발표했다.',
            whatChanged: '무료·학생 플랜에서는 사용자가 직접 모델을 고르는 방식보다, Copilot이 작업에 맞는 모델을 자동 선택하는 방식으로 단순화된다.',
            whyItMatters: 'AI 도구가 복잡해질수록 일반 사용자는 어떤 모델을 골라야 하는지 알기 어렵다. Auto model selection은 모델 선택을 사용자에게 맡기기보다, 도구가 작업에 맞게 라우팅하는 방향을 보여준다.',
            dechiveView: 'AI 서비스는 점점 “사용자가 모델을 고르는 제품”에서 “작업에 맞게 모델을 자동 배치하는 제품”으로 바뀌고 있다. 다만 이것은 사용자의 선택권이 줄어드는 방향이기도 하다.',
            readerTakeaway: 'AI 도구는 점점 사용자가 모델을 직접 고르는 방식에서, 작업에 맞게 자동으로 모델을 선택하는 방식으로 이동하고 있다.',
            screenMaterialStatus: 'GitHub Copilot의 모델 선택 UI 또는 Auto model selection 설명 화면이 공식적으로 있으면 참고 가능하다. 없으면 “사용자 작업 → Auto model selection → 모델 라우팅” 설명 이미지가 적합하다.',
            cautionNote: '이 항목은 Free와 Student 플랜 대상이다. 모든 Copilot 플랜의 모델 선택이 동일하게 바뀌었다고 쓰지 않는다.',
          },
          {
            id: 'claude-code-2-1-190-reliability',
            title: 'Claude Code 2.1.190 — 버그 수정과 안정성 개선',
            officialDate: '2026.06.24',
            checkedDateKST: '2026.06.25',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'Claude Code changelog',
              url: 'https://code.claude.com/docs/en/changelog',
            },
            updateType: 'Developer Tool / Reliability Update',
            badges: ['Developer Tool', 'Reliability Update', 'Official Changelog', 'Official Source'],
            summary: 'Claude Code 2.1.190은 Bug fixes and reliability improvements로 짧게 정리된 안정성 업데이트다.',
            whatChanged: '구체적인 상세 항목은 공개 changelog에 길게 설명되어 있지 않다. 따라서 메인 업데이트가 아니라 안정성 보조 기록으로 다룬다.',
            whyItMatters: 'AI 코딩 도구는 새 기능뿐 아니라 안정성 개선도 중요하다. 다만 상세 내용이 공개되지 않은 경우에는 과장하지 않고 짧게 기록하는 것이 맞다.',
            dechiveView: '이 항목은 메인 카드로 크게 다루기보다 Reliability Watch 또는 Small Update로 짧게 기록하는 것이 적절하다.',
            readerTakeaway: 'Claude Code는 6월 24일 안정성 개선 업데이트를 냈지만, 공개 changelog 기준으로는 세부 기능 변화가 크지 않다.',
            screenMaterialStatus: '공식 changelog 화면 외 별도 이미지 필요 없음.',
            cautionNote: '상세 내용이 공개되지 않았으므로 추측해서 설명하지 않는다.',
          },
        ],
      },
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
    verificationNote: '오늘 확인한 업데이트는 Anthropic, Mistral, Claude Code, GitHub, Microsoft, Google 문서, OpenAI 사례, Anthropic Status로 나뉜다. 메인 업데이트는 Claude Tag, Mistral OCR 4, Claude Code 2.1.187, GitHub Copilot CLI와 BYOK다. 다만 모든 항목을 같은 무게로 다루지 않는다. Claude Tag와 Mistral OCR 4는 일반 독자에게도 설명 가능한 메인 업데이트다. Claude Code와 GitHub Copilot CLI/BYOK는 개발자용 핵심 업데이트다. Gemini 3.1 Flash-Lite는 신규 출시가 아니라 Documentation Update다. OpenAI Omio는 Case Study다. Anthropic Status는 기능 업데이트가 아니라 Status Watch다. 공식 화면이 확인되지 않은 항목은 실제 화면처럼 단정하지 않고, 설명 이미지가 더 적절하다고 표시한다. 2026.06.25 KST 기준으로 새롭게 확인한 officialDate 2026.06.24 항목을 추가했다. 기존에 작성한 officialDate 2026.06.23 항목은 중복 작성하지 않았고, 이번 보강에서는 ChatGPT GPT-5.5 Instant 업데이트, Gemini API Computer Use 공개 프리뷰, OpenAI/Broadcom Jalapeño 추론 칩, Mistral Connectors 통제 기능, GitHub Copilot Free/Student 모델 선택 변경, Claude Code 2.1.190 안정성 업데이트만 다룬다. 이번 추가 항목은 기능 업데이트, 공개 프리뷰, 인프라 발표, 엔터프라이즈 거버넌스, 제품 정책 변경, 안정성 개선을 구분해서 기록한다. 특히 Gemini Computer Use는 Public Preview이며, Claude Code 2.1.190은 세부 내용이 공개되지 않은 안정성 업데이트이므로 과장하지 않는다.',
    closingLine: 'AI는 더 이상 별도의 채팅창에 머물지 않는다. 대화 품질을 조정하고, 컴퓨터 환경을 사용하고, 추론 인프라를 설계하며, 외부 도구 연결을 통제하는 방향으로 확장되고 있다. Dechive는 그 변화가 실제로 무엇을 바꾸는지 기록한다.',
    updates: [
      {
        id: 'openai-chatgpt-gpt-5-5-instant-quality',
        slug: 'openai-chatgpt-gpt-5-5-instant-quality',
        title: 'ChatGPT GPT-5.5 Instant',
        summary: 'GPT-5.5 Instant가 조건, 반박, 선택 상황을 더 잘 따라가도록 대화 품질이 조정됐다.',
        badges: ['Product Update', 'Model Behavior Update', 'Official Source'],
        detailHref: '/ai-updates/2026-06-24#openai-chatgpt-gpt-5-5-instant-quality',
        source: {
          label: 'OpenAI ChatGPT Release Notes',
          url: 'https://help.openai.com/en/articles/6825453-chatgpt-release-notes',
          description: 'ChatGPT GPT-5.5 Instant 대화 품질 업데이트를 확인하는 항목입니다.',
        },
        whatChanged: 'GPT-5.5 Instant가 복잡한 조건과 사용자 반박에 더 잘 적응하도록 조정됐다.',
        useCriteria: '새 모델 출시가 아니라 모델 동작/대화 품질 업데이트로 읽어야 합니다.',
        verificationNotes: ['officialDate 2026.06.24, checkedDateKST 2026.06.25 기준으로 기록합니다.'],
        image: {
          status: 'none',
          caption: '복잡한 조건을 정리해 답변하는 설명 이미지가 적합합니다.',
        },
      },
      {
        id: 'google-gemini-api-computer-use-preview',
        slug: 'google-gemini-api-computer-use-preview',
        title: 'Gemini Computer Use',
        summary: 'Gemini API가 브라우저·모바일·데스크톱 환경을 사용하는 Computer Use 공개 프리뷰로 확장됐다.',
        badges: ['Tool Update', 'Computer Use', 'Public Preview', 'Official Source'],
        detailHref: '/ai-updates/2026-06-24#google-gemini-api-computer-use-preview',
        source: {
          label: 'Google AI Developers changelog',
          url: 'https://ai.google.dev/gemini-api/docs/changelog',
          description: 'Gemini API Computer Use 공개 프리뷰를 확인하는 항목입니다.',
        },
        whatChanged: 'Gemini API가 텍스트 답변을 넘어 컴퓨터 환경을 사용하는 도구 흐름으로 확장됐다.',
        useCriteria: 'Public Preview이므로 정식 일반 출시처럼 단정하지 않아야 합니다.',
        verificationNotes: ['officialDate 2026.06.24, checkedDateKST 2026.06.25 기준으로 기록합니다.'],
        image: {
          status: 'none',
          caption: 'AI와 브라우저/앱 환경, 안전 정책을 연결한 설명 다이어그램이 적합합니다.',
        },
      },
      {
        id: 'openai-broadcom-jalapeno-inference-chip',
        slug: 'openai-broadcom-jalapeno-inference-chip',
        title: 'OpenAI Jalapeño',
        summary: 'OpenAI와 Broadcom의 Jalapeño는 모델 기능이 아니라 LLM 추론 인프라 경쟁을 보여주는 발표다.',
        badges: ['Infrastructure', 'AI Chip', 'Inference', 'Official Source'],
        detailHref: '/ai-updates/2026-06-24#openai-broadcom-jalapeno-inference-chip',
        source: {
          label: 'OpenAI official blog',
          url: 'https://openai.com/',
          description: 'OpenAI와 Broadcom의 Jalapeño 추론 칩 발표를 확인하는 항목입니다.',
        },
        whatChanged: 'OpenAI가 모델을 운영하기 위한 추론 인프라 설계 방향을 공개했다.',
        useCriteria: '사용자 기능 업데이트가 아니라 인프라/회사 발표로 읽어야 합니다.',
        verificationNotes: ['officialDate 2026.06.24, checkedDateKST 2026.06.25 기준으로 기록합니다.'],
        image: {
          status: 'none',
          caption: '모델, 추론 칩, 데이터센터, 서비스 운영 흐름을 보여주는 설명 이미지가 적합합니다.',
        },
      },
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
