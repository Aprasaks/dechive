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
  | 'AI Video'
  | 'Generative Video'
  | 'China AI'
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
  | 'Legal Framework'
  | 'Human Oversight'
  | 'Corporate Responsibility'
  | 'Admin Control'
  | 'Product Policy'
  | 'Model Safety'
  | 'Jailbreak Framework'
  | 'Cyber Safeguards'
  | 'Model Selection'
  | 'Auto Routing'
  | 'Reliability Update'
  | 'Model Behavior Update'
  | 'Remote Workspace'
  | 'Codex'
  | 'Memory'
  | 'Personalization'
  | 'Research'
  | 'Global Affairs'
  | 'AI Jobs Transition'
  | 'Labor Market'
  | 'Workforce Shift'
  | 'AI Hiring'
  | 'Planning Map'
  | 'Agentic Work'
  | 'AI Adoption'
  | 'Auto Mode'
  | 'Observability'
  | 'Agent Observability'
  | 'Session Streaming'
  | 'REST API'
  | 'Jira'
  | 'Agent Sessions'
  | 'Code Review'
  | 'Efficiency Update'
  | 'Enterprise Governance'
  | 'Plugin Control'
  | 'Financial AI'
  | 'Effective Change'
  | 'Deprecation'
  | 'Model Lifecycle'
  | 'Model Deprecation'
  | 'Enterprise CMS'
  | 'Beta'
  | 'Feature Release'
  | 'AI Education'
  | 'Funding'
  | 'Model Preview'
  | 'Frontier Model'
  | 'Limited Preview'
  | 'Fast Mode'
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
  | 'Official Screen Not Required'
  | 'Permission Control'
  | 'Least Privilege'
  | 'Data Store'
  | 'Action Filtering'
  | 'Model Launch'
  | 'Agentic Model'
  | 'AI Workbench'
  | 'Science'
  | 'Research Tool'
  | 'Model Access'
  | 'Policy'
  | 'Model Availability'
  | 'IDE Integration'
  | 'Developer Workflow'
  | 'AI Coding Tool'
  | 'Compliance'
  | 'Enterprise Security'
  | 'US-China AI'
  | 'AI Implementation'
  | 'AI Engineering'
  | 'Usage Metrics'
  | 'Cost Attribution'
  | 'Automation Security'
  | 'GitHub Actions'
  | 'Benchmark'
  | 'Scientific Reasoning'
  | 'Engineering'
  | 'Infrastructure Debugging'
  | 'Cost Governance'
  | 'AI Credits'
  | 'Usage Control'
  | 'Managed Services'
  | 'Data Center'
  | 'Energy Demand'
  | 'Physical Infrastructure'
  | 'Model Garden'
  | 'Agent Platform'
  | 'Pull Request Governance'
  | 'Supply Chain Security'
  | 'License Compliance'
  | 'Not Main AI Update'
  | 'Media Generation'
  | 'Creative Workflow'
  | 'Risk Watch'
  | 'Reported Context'
  | 'Reliable News'
  | 'Market Watch'
  | 'Capital Flow'
  | 'Responsibility'
  | 'Global Update';

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

export const AI_UPDATES_MONTH = '2026.07';

export const aiUpdateDays: AiUpdateDay[] = [
  {
    date: '2026-07-03',
    checkedDateKST: '2026.07.04',
    title: 'AI가 자본, 노동, 법, 인프라의 문제로 번진 날',
    subtitle: '오늘의 흐름은 공식 모델 출시보다 보도 기반 변화가 중심이다. Kling AI 투자 유치, 인도 IT 산업의 AI 채용 증가, 아르헨티나의 AI 운영 기업 법제 논의, Alibaba의 Claude Code 사용 금지 보도는 AI가 제품 업데이트를 넘어 자본, 노동, 책임, 기업 통제의 문제로 이동하고 있음을 보여준다.',
    quickSummary: [
      '자본/영상: Reuters는 Kuaishou의 Kling AI가 Alibaba, Tencent, Baidu 등이 참여한 대규모 투자를 받았다고 보도했다. AI 영상 생성은 제품 기능을 넘어 자본시장과 산업 인프라의 문제로 이동하고 있다.',
      '노동/법/책임: 인도 IT 산업의 AI 채용 증가와 아르헨티나의 AI 운영 기업 법제 논의는 AI가 일자리 전체보다 역할 구조, 인간 감독, 법적 책임의 위치를 바꾸고 있음을 보여준다.',
      '기업 보안/인프라: Alibaba의 Claude Code 사용 금지 보도, HCLTech의 AI-driven operating model 계약, Deutz의 AI 데이터센터 전력 수요 전망은 AI가 기업 통제, 운영 모델, 물리 인프라까지 확장되고 있음을 보여준다.',
    ],
    groups: [
      {
        name: 'AI Video / Capital Flow',
        intro: 'AI 영상 생성은 단순한 생성 기능이 아니라 대형 플랫폼, 투자자, 유통 구조가 얽힌 산업 인프라로 평가받기 시작했다.',
        updates: [
          {
            id: 'kuaishou-kling-ai-fundraise',
            title: 'Kuaishou Kling AI 투자 유치 — AI 영상 생성은 자본시장과 산업 인프라로 이동한다',
            officialDate: '2026.07.03 보도일',
            checkedDateKST: '2026.07.04',
            sourceType: 'Reliable News / Reuters / Reported Market Watch',
            officialSource: {
              label: "Reuters — Alibaba, Tencent back Kuaishou's Kling AI in $2.8 billion fundraise",
              url: 'https://www.reuters.com/world/china/alibaba-tencent-back-kuaishous-kling-ai-28-billion-fundraise-2026-07-03/',
            },
            updateType: 'AI Video / Generative Video / Capital Flow / China AI',
            badges: ['Reported Context', 'Reliable News', 'Market Watch', 'Capital Flow', 'AI Video', 'Generative Video', 'China AI', 'Explanation Image Recommended'],
            summary: 'Reuters는 Kuaishou의 AI 비디오 부문 Kling AI가 Alibaba, Tencent, Baidu 등이 참여한 투자로 190억 위안 이상을 유치했다고 보도했다. 보도에 따르면 Kling AI의 사전 기업가치는 150억 달러로 평가됐고, Kuaishou의 지분은 100%에서 약 68%로 낮아진다.',
            whatChanged: 'AI 영상 생성 서비스가 단순 제품 기능을 넘어 대형 플랫폼 기업과 자본시장이 참여하는 독립적 산업 단위로 평가받기 시작했다.',
            whyItMatters: 'AI 영상 생성은 콘텐츠 제작 도구를 넘어 컴퓨팅, 데이터, 플랫폼 유통, 투자 구조가 결합된 산업 인프라가 되고 있다.',
            dechiveView: 'Dechive는 AI 영상 생성 품질만 보지 않는다. 누가 그 인프라에 투자하고, 누가 소유권을 가져가며, 어떤 플랫폼이 영상 생성 생태계를 장악하는지까지 봐야 한다. AI 생성 기술의 힘은 모델 성능뿐 아니라 자본과 유통 구조에서 나온다.',
            readerTakeaway: 'AI 영상 생성은 이제 재미있는 생성 도구가 아니라 대규모 자본이 들어가는 산업 인프라가 되고 있다.',
            screenMaterialStatus: 'Reuters 보도 기반 항목이므로 공식 제품 화면은 필수 아님. 설명 이미지가 필요하다면 “AI video model → platform company → investment → content infrastructure” 흐름이 적합하다.',
            cautionNote: 'Kling AI가 AI 영상 시장을 장악했다고 단정하지 않는다. Reuters 보도에 따른 투자 유치와 기업가치 평가로 제한한다.',
          },
        ],
      },
      {
        name: 'AI Labor Market / Workforce Shift',
        intro: 'AI 노동시장 변화는 일자리 전체가 한 방향으로 움직인다는 단순한 이야기보다, 어떤 역할과 역량이 재배치되는지를 봐야 한다.',
        updates: [
          {
            id: 'india-it-ai-hiring-workforce-shift',
            title: '인도 IT 산업 AI 채용 증가 — AI는 일자리 전체보다 역할 구조를 바꾼다',
            officialDate: '2026.07.03 보도일',
            checkedDateKST: '2026.07.04',
            sourceType: 'Reliable News / Reuters / Reported Labor Market',
            officialSource: {
              label: 'Reuters — AI hiring outpaces overall IT recruitment in India, report shows',
              url: 'https://www.reuters.com/world/india/ai-hiring-outpaces-overall-it-recruitment-india-report-shows-2026-07-03/',
            },
            updateType: 'AI Labor Market / Workforce Shift / AI Hiring',
            badges: ['Reported Context', 'Reliable News', 'Labor Market', 'Workforce Shift', 'AI Hiring', 'Explanation Image Recommended'],
            summary: 'Reuters는 인도 IT 산업에서 전체 IT 채용은 줄었지만 AI 관련 채용은 전년 대비 증가했다고 보도했다. 보도에 따르면 6월 기준 인도 IT 산업의 AI 관련 채용은 전년 대비 16% 증가했고, 전체 IT 채용은 3% 감소했다. 전체 14개 산업 기준으로는 AI·머신러닝 채용이 25% 증가했다.',
            whatChanged: 'AI가 기존 IT 채용 전체를 단순히 늘리는 것이 아니라, 채용 수요를 AI 역량 중심으로 재배치하는 흐름이 확인됐다.',
            whyItMatters: 'AI 시대의 노동시장 변화는 “일자리가 사라진다”만으로 설명할 수 없다. 어떤 역할은 줄고, 어떤 역량은 더 요구되며, 기업은 더 적은 인력으로 더 많은 성과를 내려 한다.',
            dechiveView: 'Dechive는 AI 일자리 논쟁을 공포나 낙관으로 단순화하지 않는다. 검증해야 할 것은 전체 채용 숫자만이 아니라, 어떤 직무가 줄고 어떤 역량이 늘며, AI가 조직의 인력 구조를 어떻게 바꾸는가다.',
            readerTakeaway: 'AI는 일자리를 한 방향으로만 줄이는 것이 아니라, 어떤 역량이 필요한지를 다시 정렬하고 있다.',
            screenMaterialStatus: 'Reuters 보도 기반 항목이므로 공식 제품 화면 없음. 설명 이미지가 필요하다면 “overall IT hiring ↓ / AI hiring ↑ / role shift” 구조가 적합하다.',
            cautionNote: 'AI가 인도 IT 일자리를 모두 대체한다고 쓰지 않는다. 보도된 채용 변화와 역할 재편 흐름으로 제한한다.',
          },
        ],
      },
      {
        name: 'AI Governance / Legal Framework',
        intro: 'AI가 기업 운영 의사결정에 들어갈수록, 법은 자동화보다 인간 감독과 책임의 위치를 다시 묻는다.',
        updates: [
          {
            id: 'argentina-ai-run-companies-human-oversight',
            title: '아르헨티나 AI 운영 기업 법제 논의 — 자동화가 깊어질수록 인간 책임은 사라지지 않는다',
            officialDate: '2026.07.03 보도일',
            checkedDateKST: '2026.07.04',
            sourceType: 'Reliable News / Reuters / Analysis',
            officialSource: {
              label: "Reuters — Argentina's plan for AI-run companies can't avoid humans",
              url: 'https://www.reuters.com/world/americas/argentinas-plan-ai-run-companies-cant-avoid-humans-2026-07-03/',
            },
            updateType: 'AI Governance / Legal Framework / Human Oversight / Corporate Responsibility',
            badges: ['Reported Context', 'Reliable News', 'Governance', 'Legal Framework', 'Human Oversight', 'Corporate Responsibility', 'Explanation Image Recommended'],
            summary: 'Reuters는 아르헨티나의 AI 운영 기업 법제 논의를 다뤘다. 겉으로는 AI-run company처럼 보일 수 있지만, 실제 법안은 인간 관리자의 감독과 회사 책임을 남기는 구조로 설명된다.',
            whatChanged: 'AI가 기업 운영 의사결정에 들어가는 법적 구조가 논의되기 시작했지만, 인간 감독과 법적 책임은 여전히 핵심 조건으로 남아 있다.',
            whyItMatters: 'AI 자동화가 깊어질수록 “누가 결정했는가”보다 “누가 감독하고 책임지는가”가 더 중요해진다. 법제도는 AI를 독립된 책임 주체로 쉽게 넘기지 않는다.',
            dechiveView: 'AI가 회사를 운영한다는 말은 자극적이지만, Dechive가 봐야 할 것은 자동화의 매력이 아니라 책임의 위치다. AI가 의사결정에 들어갈수록 인간 감독, 법적 책임, 피해 구제 구조를 더 명확히 검증해야 한다.',
            readerTakeaway: 'AI가 기업 운영에 들어가도 책임은 사라지지 않는다. 인간 감독은 여전히 핵심 조건이다.',
            screenMaterialStatus: 'Reuters 분석 보도 기반 항목이므로 공식 제품 화면 없음. 설명 이미지가 필요하다면 “AI operation → human administrator → legal responsibility → accountability” 흐름이 적합하다.',
            cautionNote: '아르헨티나가 완전한 AI-run company를 허용했다고 단정하지 않는다. Reuters 보도에 따른 법제 논의와 인간 감독 조건으로 제한한다.',
          },
        ],
      },
      {
        name: 'AI Coding Tool / Compliance',
        intro: 'AI 코딩 도구는 생산성 도구이면서 동시에 기업 보안, 접근 제한, 지정학 리스크의 대상이 되고 있다.',
        updates: [
          {
            id: 'alibaba-claude-code-ban-compliance',
            title: 'Alibaba의 Claude Code 사용 금지 보도 — AI 코딩 도구는 보안과 지정학의 문제가 된다',
            officialDate: '2026.07.03 보도일',
            checkedDateKST: '2026.07.04',
            sourceType: 'Reliable News / Reuters / Reported Context',
            officialSource: {
              label: "Reuters — Alibaba to ban employees from using Anthropic's coding tool, source says",
              url: 'https://www.reuters.com/world/china/alibaba-ban-claude-code-workplace-over-alleged-backdoor-risks-source-says-2026-07-03/',
            },
            updateType: 'AI Coding Tool / Compliance / Enterprise Security / US-China AI',
            badges: ['Reported Context', 'Reliable News', 'AI Coding Tool', 'Compliance', 'Enterprise Security', 'US-China AI', 'Explanation Image Recommended'],
            summary: 'Reuters는 Alibaba가 직원들에게 Anthropic의 Claude Code 사용을 금지하기로 했다고 보도했다. 보도는 소식통을 인용했으며, Claude Code의 중국 관련 사용자 식별 기능과 Anthropic·Alibaba 간의 모델 capability distillation 갈등이 배경으로 언급됐다.',
            whatChanged: 'AI 코딩 도구가 단순 생산성 도구가 아니라 기업 보안, 접근 제한, 사용자 식별, 국가 간 AI 경쟁과 연결된 도구로 다뤄지고 있다.',
            whyItMatters: '개발자가 쓰는 AI 도구에는 코드와 업무 맥락, 실행 환경 정보가 들어갈 수 있다. 기업은 생산성뿐 아니라 데이터 흐름, 도구의 감지 기능, 공급자와의 정책 갈등도 고려해야 한다.',
            dechiveView: 'AI 코딩 도구를 쓸 때 중요한 것은 “코드를 얼마나 잘 써주느냐”만이 아니다. 어떤 환경 정보를 읽는지, 어떤 사용자를 제한하는지, 기업 내부 보안 정책과 충돌하는지까지 검증해야 한다. AI 도구는 생산성 도구이면서 동시에 정책과 보안의 대상이다.',
            readerTakeaway: 'AI 코딩 도구는 생산성만이 아니라 보안, 접근권, 지정학 리스크까지 함께 봐야 한다.',
            screenMaterialStatus: 'Reuters 보도 기반 항목이므로 공식 제품 화면 없음. 설명 이미지가 필요하다면 “developer tool → environment detection → enterprise policy → geopolitical risk” 흐름이 적합하다.',
            cautionNote: 'Alibaba와 Anthropic의 입장을 공식 발표처럼 단정하지 않는다. Reuters가 소식통을 인용해 보도한 항목임을 명확히 한다.',
          },
        ],
      },
      {
        name: 'Enterprise AI Services',
        intro: '기업 AI는 개별 기능 도입을 넘어 운영 모델 전환과 관리형 서비스 계약으로 확장되고 있다.',
        updates: [
          {
            id: 'hcltech-ai-driven-operating-model-deal',
            title: 'HCLTech AI-driven operating model 계약 — 기업 AI는 운영 모델 전환 계약으로 확장된다',
            officialDate: '2026.07.03 보도일',
            checkedDateKST: '2026.07.04',
            sourceType: 'Reliable News / Reuters / Reported Business',
            officialSource: {
              label: "Reuters — India's HCLTech wins $1.14 billion deal with European firm",
              url: 'https://www.reuters.com/business/indias-hcltech-wins-114-billion-deal-with-european-firm-2026-07-03/',
            },
            updateType: 'Enterprise AI Services / AI Operating Model / Managed Services',
            badges: ['Reported Context', 'Reliable News', 'Enterprise AI', 'AI Operating Model', 'Managed Services', 'Explanation Image Recommended'],
            summary: 'Reuters는 HCLTech가 유럽 기업과 11.4억 달러 규모 계약을 체결했다고 보도했다. 보도에 따르면 이 계약은 글로벌 디지털 워크플레이스와 엔터프라이즈 네트워크를 AI-driven operating model로 전환하고 관리하는 내용을 포함한다.',
            whatChanged: '기업 AI가 단순 소프트웨어 기능 도입을 넘어 운영 모델 전환과 관리형 서비스 계약으로 확장되는 흐름이 확인됐다.',
            whyItMatters: '대기업의 AI 도입은 내부 업무 프로세스, 네트워크 운영, 디지털 워크플레이스, 관리형 서비스와 결합될 수 있다.',
            dechiveView: '이 항목은 메인보다 보조 흐름에 가깝다. 그러나 기업 AI가 “모델을 쓰는 일”이 아니라 운영 모델 전체를 바꾸는 계약으로 이동하고 있다는 점은 기록할 가치가 있다.',
            readerTakeaway: '기업 AI는 기능 도입을 넘어 운영 모델 전환과 장기 서비스 계약으로 확장되고 있다.',
            screenMaterialStatus: '보도 기반 항목이므로 공식 제품 화면 없음. 설명 이미지가 필요하다면 “enterprise workplace → network operations → AI-driven operating model → managed service” 흐름이 적합하다.',
            cautionNote: 'HCLTech 계약이 모든 기업 AI 도입의 표준이라고 쓰지 않는다. 특정 기업 계약 사례로 제한하고 보조 항목으로 다룬다.',
          },
        ],
      },
      {
        name: 'AI Infrastructure / Data Center Energy',
        intro: 'AI 수요는 모델과 소프트웨어를 넘어 데이터센터 전력, 백업 시스템, 물리 인프라 투자로 이어지고 있다.',
        updates: [
          {
            id: 'deutz-ai-data-center-energy-demand',
            title: 'Deutz AI 데이터센터 전력 수요 — AI는 물리 인프라 수요까지 밀어 올린다',
            officialDate: '2026.07.03 보도일',
            checkedDateKST: '2026.07.04',
            sourceType: 'Reliable News / Reuters / Reported Infrastructure',
            officialSource: {
              label: "Reuters — Germany's Deutz expects to triple energy unit revenue on AI-driven demand",
              url: 'https://www.reuters.com/business/energy/germanys-deutz-expects-triple-energy-unit-revenue-ai-driven-demand-2026-07-03/',
            },
            updateType: 'AI Infrastructure / Data Center Energy / Physical Infrastructure',
            badges: ['Reported Context', 'Reliable News', 'Infrastructure', 'Data Center', 'Energy Demand', 'Physical Infrastructure', 'Explanation Image Recommended'],
            summary: 'Reuters는 독일 Deutz가 AI와 데이터센터 수요 증가로 백업 전력 시스템 투자가 늘면서 에너지 사업 매출을 5년 안에 10억 유로 이상으로 키우려 한다고 보도했다.',
            whatChanged: 'AI 수요가 모델과 소프트웨어를 넘어 데이터센터 전력, 백업 시스템, 안정적 전력 공급 수요로 이어지는 흐름이 확인됐다.',
            whyItMatters: 'AI 서비스는 24시간 안정적인 컴퓨팅과 전력을 필요로 한다. 모델 성능 뒤에는 데이터센터, 전력, 냉각, 백업 시스템 같은 물리 인프라가 있다.',
            dechiveView: 'AI 검증은 더 이상 모델 성능만의 문제가 아니다. AI를 돌리는 전력과 인프라가 얼마나 안정적이고 지속 가능한지도 함께 봐야 한다. AI의 비용은 구독료가 아니라 전력과 데이터센터 구조에도 숨어 있다.',
            readerTakeaway: 'AI는 화면 속 모델만이 아니라 데이터센터와 전력 인프라 수요까지 바꾸고 있다.',
            screenMaterialStatus: '보도 기반 항목이므로 공식 제품 화면 없음. 설명 이미지가 필요하다면 “AI demand → data center → backup power → energy business” 흐름이 적합하다.',
            cautionNote: 'Deutz가 AI 기업이라고 쓰지 않는다. AI와 데이터센터 수요로 인한 전력 인프라 파급 효과로 다룬다.',
          },
        ],
      },
      {
        name: 'Low Priority / Excluded',
        intro: 'AI 카테고리에 걸릴 수 있어도 이번 페이지의 reportDate와 핵심 흐름에 맞지 않거나 직접성이 낮은 항목은 제외한다.',
        updates: [
          {
            id: 'india-tata-data-leak-excluded',
            title: 'India Tata data leak — AI Updates 메인에서 제외',
            officialDate: '2026.07.03 검토 항목',
            checkedDateKST: '2026.07.04',
            sourceType: 'Verification Note / Excluded',
            updateType: 'Data Leak / Supply Chain / Not Main AI Update',
            badges: ['Needs Date Verification', 'Not Main AI Update', 'Security / Governance'],
            summary: '핵심은 데이터 유출, 공급망, 제조 기밀 이슈에 가깝다. AI Updates 메인 흐름과 직접성이 낮으면 제외한다.',
            whatChanged: '이번 날짜의 AI 자본, 노동, 법, 기업 보안, 인프라 흐름과 직접 연결되지 않는 항목으로 분류했다.',
            whyItMatters: 'AI Updates는 넓은 기술 뉴스 전체가 아니라 AI 변화가 만드는 검증 기준을 기록하는 페이지다.',
            dechiveView: '보안 이슈라도 AI 운영, 모델, 도구, 거버넌스와 직접 연결되지 않으면 메인 항목으로 올리지 않는다.',
            readerTakeaway: 'AI Updates에는 AI 검증 기준과 직접 연결되는 항목만 메인으로 남긴다.',
            screenMaterialStatus: '공식 화면 없음. 별도 설명 이미지 불필요.',
            cautionNote: 'AI와 직접 연결되지 않은 보안/공급망 이슈를 AI 업데이트처럼 확대하지 않는다.',
          },
          {
            id: 'china-low-cost-ai-model-analysis-excluded',
            title: 'Reuters 중국 저비용 AI 모델 분석 — 이번 2026.07.03 메인에서 제외',
            officialDate: '2026.07.02 보도일',
            checkedDateKST: '2026.07.04',
            sourceType: 'Reliable News / Date Mismatch / Excluded',
            updateType: 'Reported Context / Date Mismatch',
            badges: ['Reliable News', 'Date Discrepancy', 'Not Main AI Update'],
            summary: '2026.07.02 보도이므로 2026.07.02 페이지 또는 별도 analysis context에 더 적합하다. 이번 2026.07.03 페이지 메인으로 반복하지 않는다.',
            whatChanged: '날짜 기준과 중복 방지 원칙에 따라 이번 페이지 메인 항목에서 제외했다.',
            whyItMatters: '날짜별 아카이브는 같은 흐름을 반복하기보다 기준일에 맞는 새 항목을 기록해야 한다.',
            dechiveView: 'Dechive는 흥미로운 보도라도 reportDate와 페이지 기준이 맞지 않으면 메인으로 끌어오지 않는다.',
            readerTakeaway: '날짜 기준은 업데이트 검증의 일부다.',
            screenMaterialStatus: '공식 화면 없음. 별도 설명 이미지 불필요.',
            cautionNote: '이전 날짜 항목을 2026.07.03 메인 흐름처럼 반복하지 않는다.',
          },
          {
            id: 'general-business-market-reactions-excluded',
            title: '일반 기업 계약/주가 반응 — 직접 연결되지 않으면 Low Priority',
            officialDate: '2026.07.03 검토 항목',
            checkedDateKST: '2026.07.04',
            sourceType: 'Verification Note / Low Priority',
            updateType: 'Business News / Low Priority',
            badges: ['Market Watch', 'Not Main AI Update'],
            summary: 'AI 운영 모델, AI 인프라, 노동시장 변화와 직접 연결되지 않으면 Low Priority로 둔다.',
            whatChanged: '이번 페이지의 핵심 흐름과 직접 연결되는 항목만 메인으로 남겼다.',
            whyItMatters: 'AI라는 단어가 포함된 일반 기업 뉴스와 AI 검증 아카이브의 핵심 기록은 구분해야 한다.',
            dechiveView: 'Dechive는 주가 반응보다 AI가 어떤 검증 문제를 만드는지를 우선 기록한다.',
            readerTakeaway: 'AI Updates의 기준은 화제성이 아니라 검증 가능성과 구조적 의미다.',
            screenMaterialStatus: '공식 화면 없음. 별도 설명 이미지 불필요.',
            cautionNote: 'AI와 직접 연결되지 않은 일반 기업 뉴스를 메인 AI 업데이트로 과장하지 않는다.',
          },
        ],
      },
    ],
    verificationNote: '이번 페이지는 2026.07.04 KST에 확인한 reportDate 2026.07.03 AI 변화 기록이다. 오늘은 공식 모델 출시보다 보도 기반 흐름이 중심이다. Kling AI 투자 유치, 인도 IT 산업의 AI 채용 증가, 아르헨티나의 AI 운영 기업 법제 논의, Alibaba의 Claude Code 사용 금지 보도는 AI가 자본시장, 노동시장, 법제도, 기업 보안의 문제로 이동하고 있음을 보여준다.\n\n이번 페이지에서는 보도 기반 항목을 공식 업데이트처럼 쓰지 않는다. Reuters 보도 항목은 Reported Context, Market Watch, Governance Watch, Labor Market, Infrastructure Watch로 분리한다.\n\n특히 아르헨티나 AI 운영 기업 항목은 “AI가 회사를 완전히 운영한다”가 아니라, 인간 감독과 법적 책임이 여전히 남아 있다는 점을 중심으로 다룬다. Alibaba Claude Code 항목은 공식 발표가 아니라 Reuters가 소식통을 인용한 보도이므로 단정하지 않는다. Deutz 항목은 AI 기업 업데이트가 아니라 AI 데이터센터 수요가 물리 인프라와 전력 시장에 미치는 파급 효과로 다룬다.',
    closingLine: 'AI는 더 이상 모델 업데이트만으로 설명되지 않는다. 자본은 생성 인프라로 이동하고, 노동시장은 AI 역량 중심으로 재편되며, 법은 인간 감독과 책임의 위치를 다시 묻기 시작했다. Dechive는 그 변화가 얼마나 빠른지보다, 그 변화가 무엇을 검증하게 만드는지 기록한다.',
    updates: [
      {
        id: 'kuaishou-kling-ai-fundraise-summary',
        slug: 'kuaishou-kling-ai-fundraise',
        title: 'Kuaishou Kling AI 투자 유치',
        summary: 'Reuters는 Kling AI가 대형 플랫폼 기업이 참여한 투자로 자본시장과 AI 영상 인프라의 중심에 놓였다고 보도했다.',
        badges: ['Reported Context', 'Reliable News', 'Market Watch', 'Capital Flow', 'AI Video'],
        detailHref: '/ai-updates/2026-07-03#kuaishou-kling-ai-fundraise',
        source: {
          label: "Reuters — Alibaba, Tencent back Kuaishou's Kling AI in $2.8 billion fundraise",
          url: 'https://www.reuters.com/world/china/alibaba-tencent-back-kuaishous-kling-ai-28-billion-fundraise-2026-07-03/',
          description: 'Kling AI 투자 유치와 기업가치 평가 보도',
        },
        whatChanged: 'AI 영상 생성이 독립적 산업 단위와 투자 대상으로 평가받는 흐름이 확인됐다.',
        useCriteria: 'AI 영상 생성을 자본시장, 플랫폼 유통, 산업 인프라 관점으로 설명할 때 사용한다.',
        verificationNotes: ['reportDate 2026.07.03 기준 Reuters 보도', '시장 장악이나 산업 완성으로 단정하지 않는다.'],
        image: {
          status: 'none',
          caption: 'Reuters 보도 기반 항목. 공식 제품 화면은 필수 아님.',
        },
      },
      {
        id: 'india-it-ai-hiring-summary',
        slug: 'india-it-ai-hiring-workforce-shift',
        title: '인도 IT 산업 AI 채용 증가',
        summary: '전체 IT 채용은 줄어도 AI 관련 채용은 늘었다는 보도는 노동시장이 AI 역량 중심으로 재편되는 흐름을 보여준다.',
        badges: ['Reported Context', 'Reliable News', 'Labor Market', 'Workforce Shift', 'AI Hiring'],
        detailHref: '/ai-updates/2026-07-03#india-it-ai-hiring-workforce-shift',
        source: {
          label: 'Reuters — AI hiring outpaces overall IT recruitment in India, report shows',
          url: 'https://www.reuters.com/world/india/ai-hiring-outpaces-overall-it-recruitment-india-report-shows-2026-07-03/',
          description: '인도 IT 산업 채용 구조 변화 보도',
        },
        whatChanged: 'AI 관련 채용 증가와 전체 IT 채용 감소가 동시에 보도됐다.',
        useCriteria: 'AI 노동시장 변화를 일자리 총량보다 역할과 역량 재배치로 설명할 때 사용한다.',
        verificationNotes: ['reportDate 2026.07.03 기준 Reuters 보도', 'AI가 모든 IT 일자리를 대체한다는 표현은 피한다.'],
        image: {
          status: 'none',
          caption: 'Reuters 보도 기반 항목. 설명 이미지가 필요하면 역할 구조 변화를 보여주는 도식이 적합하다.',
        },
      },
      {
        id: 'ai-governance-security-infrastructure-summary',
        slug: 'ai-governance-security-infrastructure',
        title: 'AI governance / security / infrastructure watch',
        summary: '아르헨티나 법제 논의, Alibaba Claude Code 사용 금지 보도, HCLTech 운영 모델 계약, Deutz 전력 수요 전망은 AI가 책임, 기업 통제, 운영 모델, 물리 인프라로 확장되는 흐름이다.',
        badges: ['Reported Context', 'Governance', 'Enterprise Security', 'AI Operating Model', 'Infrastructure'],
        detailHref: '/ai-updates/2026-07-03#argentina-ai-run-companies-human-oversight',
        source: {
          label: 'Reuters — 2026.07.03 governance, compliance, infrastructure reports',
          url: 'https://www.reuters.com/',
          description: '2026.07.03 Reuters 보도 기반 governance / compliance / infrastructure 흐름 묶음',
        },
        whatChanged: 'AI가 모델 업데이트를 넘어 법적 책임, 기업 보안, 운영 모델, 전력 인프라와 연결되는 흐름이 확인됐다.',
        useCriteria: 'AI를 제품 기능이 아니라 책임 구조와 물리 인프라의 문제로 설명할 때 사용한다.',
        verificationNotes: ['각 상세 항목의 Reuters canonical URL을 기준으로 확인한다.', '공식 발표가 아닌 보도 기반 항목임을 명확히 한다.'],
        image: {
          status: 'none',
          caption: '보도 기반 묶음. 공식 제품 화면보다 설명 도식이 적합하다.',
        },
      },
    ],
  },
  {
    date: '2026-07-02',
    checkedDateKST: '2026.07.03',
    title: 'AI가 안전 프레임워크, 기업 구현, 개발자 도구 운영 통제 안으로 들어간 날',
    subtitle: '오늘의 공식 업데이트는 Fable 5의 사이버 safeguard와 jailbreak 평가 기준, Microsoft Frontier Company의 기업 AI 구현 전략, GitHub Copilot의 에이전트 세션 관측·모델 생명주기·사용량 측정·비용 통제 흐름이 중심이다. 보도 기반 항목에서는 OpenAI의 정부 지분 논의와 Meta의 AI agent 개발 속도 이슈를 별도로 분리해 본다.',
    quickSummary: [
      '안전/정책: Anthropic은 Fable 5의 사이버 safeguard와 jailbreak severity framework를 공개하며, 강력한 모델을 신뢰하려면 성능뿐 아니라 차단 기준과 우회 시도 평가 기준을 함께 봐야 함을 보여줬다.',
      '기업 구현: Microsoft Frontier Company는 AI 도입이 도구 구독이 아니라 기업 데이터, 업무 흐름, 보안, 거버넌스, ROI 관리까지 포함하는 구현 문제로 이동했음을 보여준다.',
      '개발자 운영: GitHub Copilot 업데이트들은 agent session streaming, model deprecation, usage metrics, Actions 인증, AI credit pool을 통해 AI 개발 도구가 관측·생명주기·비용 통제 안으로 들어가는 흐름을 보여준다.',
      '보도 기반 흐름: OpenAI 정부 지분 논의와 Meta agent 개발 속도 이슈는 공식 업데이트가 아니라 Reuters 보도 기반의 governance / market watch로 분리해 기록한다.',
    ],
    groups: [
      {
        name: 'Anthropic Safety / Model Policy',
        intro: 'Fable 5 항목은 모델 성능 업데이트가 아니라, 강력한 모델을 배포할 때 safeguard와 jailbreak 평가 기준을 어떻게 설명하는지에 초점을 둔다.',
        updates: [
          {
            id: 'anthropic-fable-5-safeguards-jailbreak-framework',
            title: 'Anthropic Fable 5 safeguards — 강력한 모델은 jailbreak 기준까지 설명해야 한다',
            officialDate: '2026.07.02',
            checkedDateKST: '2026.07.03',
            sourceType: 'Official Blog / Safety Update',
            officialSource: {
              label: "Anthropic 공식 블로그 — More details on Fable 5's cyber safeguards and our jailbreak framework",
              url: 'https://www.anthropic.com/news/fable-safeguards-jailbreak-framework',
            },
            updateType: 'Model Safety / Cyber Safeguards / Jailbreak Framework',
            badges: ['Model Safety', 'Jailbreak Framework', 'Cyber Safeguards', 'Policy', 'Official Source', 'Explanation Image Recommended'],
            summary: 'Anthropic은 Fable 5의 사이버 보안 safeguard와 jailbreak severity framework를 공개했다. Fable 5가 글로벌 사용자에게 다시 제공되는 상황에서, Anthropic은 사이버 보안 요청을 어떻게 다루는지와 jailbreak 시도의 심각도를 어떻게 평가할 수 있는지 설명했다.',
            whatChanged: 'Fable 5의 제공 여부만이 아니라, 강력한 모델을 배포할 때 어떤 safeguard가 붙고 어떤 jailbreak를 얼마나 위험하게 볼 것인지에 대한 기준이 공개됐다.',
            whyItMatters: '고성능 모델은 더 넓은 작업을 도울 수 있지만, 동시에 위험한 요청을 더 강하게 수행할 수도 있다. 따라서 모델 성능만이 아니라 safeguard, 차단 기준, 우회 시도 평가 기준이 신뢰의 일부가 된다.',
            dechiveView: '이 항목의 핵심은 “Fable 5가 다시 제공된다”가 아니다. 강력한 AI 모델을 믿으려면 모델이 무엇을 할 수 있는지뿐 아니라, 무엇을 막고 어떤 우회 시도를 위험으로 분류하는지도 함께 봐야 한다. Dechive는 모델 성능보다 검증 가능한 안전 기준을 더 중요하게 기록해야 한다.',
            readerTakeaway: '강력한 모델일수록 성능표보다 safeguard와 jailbreak 평가 기준을 함께 봐야 한다.',
            screenMaterialStatus: '공식 블로그 화면 참고 가능. 별도 제품 화면이 없으면 “모델 요청 → safeguard 판단 → jailbreak severity 평가 → 허용/차단” 흐름의 설명 이미지가 적합하다.',
            cautionNote: 'Fable 5가 완전히 안전하다고 쓰지 않는다. Anthropic이 공개한 safeguard와 jailbreak framework를 설명한 것으로 제한한다.',
          },
        ],
      },
      {
        name: 'Microsoft Enterprise AI Implementation',
        intro: 'Microsoft Frontier Company는 기업 AI가 모델 선택보다 구현, 보안, 거버넌스, 성과 관리의 문제로 이동하고 있음을 보여준다.',
        updates: [
          {
            id: 'microsoft-frontier-company-ai-engineering',
            title: 'Microsoft Frontier Company — 기업 AI는 구현과 운영의 문제가 되다',
            officialDate: '2026.07.02',
            checkedDateKST: '2026.07.03',
            sourceType: 'Official Blog / Enterprise AI',
            officialSource: {
              label: 'Microsoft 공식 블로그 — Microsoft Frontier Company: AI engineering that amplifies and protects your intelligence',
              url: 'https://blogs.microsoft.com/blog/2026/07/02/microsoft-frontier-company-ai-engineering-that-amplifies-and-protects-your-intelligence/',
            },
            updateType: 'Enterprise AI / AI Implementation / AI Engineering / Governance',
            badges: ['Enterprise AI', 'AI Implementation', 'AI Engineering', 'Governance', 'Official Source', 'Explanation Image Recommended'],
            summary: 'Microsoft는 Microsoft Frontier Company를 발표했다. 이 조직은 기업 고객이 AI를 실제 비즈니스 환경 안에 구현하고, 관리하고, 보호하고, 성과로 연결할 수 있도록 돕는 AI engineering 중심 조직으로 설명된다.',
            whatChanged: 'Microsoft는 AI 도입을 단순 제품 판매가 아니라 기업의 업무 흐름, 데이터, 보안, 거버넌스, ROI 관리까지 포함하는 구현 문제로 다루기 시작했다.',
            whyItMatters: '기업 AI는 “어떤 모델을 쓰느냐”만으로 성공하지 않는다. 실제 데이터와 업무 흐름에 연결하고, 보안과 비용과 성과 기준을 함께 관리해야 한다.',
            dechiveView: '이 업데이트는 AI가 SaaS 기능이 아니라 기업 운영 시스템으로 들어가고 있음을 보여준다. Dechive는 AI 도입을 볼 때 모델 성능보다 적용 조건, 관리 구조, 관측 가능성, 책임 소재를 함께 검증해야 한다.',
            readerTakeaway: '기업 AI 도입은 이제 도구 구독이 아니라 구현·운영·보안·성과 관리의 문제다.',
            screenMaterialStatus: 'Microsoft 공식 블로그 화면 참고 가능. 별도 화면이 부족하면 “기업 데이터 → AI engineering → 업무 프로세스 → 관리/보안/ROI” 흐름의 설명 이미지가 적합하다.',
            cautionNote: 'Microsoft Frontier Company가 모든 기업의 AI 전환을 자동으로 해결한다고 쓰지 않는다. Microsoft가 제시한 기업 AI 구현 조직과 방향으로 제한한다.',
          },
        ],
      },
      {
        name: 'GitHub Copilot Agent Observability',
        intro: 'Copilot agent session streaming은 AI agent 검증이 결과물 확인에서 실행 과정 관측으로 확장되고 있음을 보여준다.',
        updates: [
          {
            id: 'github-copilot-agent-session-streaming-public-preview',
            title: 'GitHub Copilot agent session streaming — AI agent 활동을 관측 가능한 데이터로 만들다',
            officialDate: '2026.07.02',
            checkedDateKST: '2026.07.03',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Copilot agent session streaming is now in public preview',
              url: 'https://github.blog/changelog/2026-07-02-copilot-agent-session-streaming-is-now-in-public-preview/',
            },
            updateType: 'Copilot / Agent Observability / Session Streaming / REST API',
            badges: ['Copilot', 'Agent Observability', 'Session Streaming', 'REST API', 'Public Preview', 'Official Changelog'],
            summary: 'GitHub은 Copilot agent session streaming public preview를 발표했다. Enterprise Cloud 고객은 여러 Copilot 클라이언트에서 발생하는 Copilot agent session data에 접근할 수 있고, cloud agent, Copilot CLI, VS Code, Visual Studio, JetBrains, Eclipse 같은 표면의 agent 활동을 관측할 수 있다.',
            whatChanged: 'Copilot agent의 활동이 단순 결과물만 남기는 것이 아니라, session data 형태로 접근 가능한 관측 대상이 됐다.',
            whyItMatters: 'AI agent가 실제 개발 작업에 들어오면, 기업은 결과뿐 아니라 agent가 어떤 흐름으로 작업했는지, 어디서 실행됐는지, 어떤 표면에서 사용됐는지 확인할 필요가 있다.',
            dechiveView: 'AI agent는 “시켜보니 됐다”로 끝나면 안 된다. 기업 환경에서는 agent의 실행 기록과 사용 경로를 관측할 수 있어야 한다. 이 업데이트는 AI agent 검증이 결과 검증에서 실행 과정 검증으로 확장되고 있음을 보여준다.',
            readerTakeaway: 'AI agent를 업무에 쓰려면 결과뿐 아니라 session data와 실행 과정을 볼 수 있어야 한다.',
            screenMaterialStatus: 'GitHub changelog의 공식 화면이나 REST API 예시가 있으면 공식 화면 참고 가능. 없다면 “Copilot client → agent session → streaming endpoint → enterprise monitoring” 흐름의 설명 이미지가 적합하다.',
            cautionNote: 'Public preview 기능이다. 모든 고객에게 일반 제공되는 기능처럼 쓰지 않는다.',
          },
        ],
      },
      {
        name: 'GitHub Copilot Model Lifecycle',
        intro: '모델 출시만큼 모델 종료와 대체 일정도 AI 개발 도구 운영의 일부가 되고 있다.',
        updates: [
          {
            id: 'github-copilot-gemini-model-deprecation',
            title: 'GitHub Copilot model deprecation — AI 개발 도구도 모델 생명주기를 관리해야 한다',
            officialDate: '2026.07.02',
            checkedDateKST: '2026.07.03',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Upcoming deprecation of Gemini 2.5 Pro and Gemini 3 Flash',
              url: 'https://github.blog/changelog/2026-07-02-upcoming-deprecation-of-gemini-2-5-pro-and-gemini-3-flash/',
            },
            updateType: 'Copilot / Model Lifecycle / Model Deprecation / Developer Tool',
            badges: ['Copilot', 'Model Lifecycle', 'Model Deprecation', 'Developer Tool', 'Official Changelog'],
            summary: 'GitHub은 Copilot 경험 전반에서 Gemini 2.5 Pro와 Gemini 3 Flash를 2026년 7월 31일 deprecate할 예정이라고 공지했다. 대체 모델로 Gemini 3.1 Pro와 Gemini 3.5 Flash를 제안했다.',
            whatChanged: 'Copilot 안에서 사용할 수 있는 모델 선택지가 고정된 것이 아니라, 특정 모델이 제거되고 새로운 대체 모델로 이동하는 생명주기 관리 대상이 됐다.',
            whyItMatters: 'AI 개발 도구를 업무에 쓰는 조직은 “현재 어떤 모델을 쓰는가”뿐 아니라 “그 모델이 언제 사라지고 무엇으로 대체되는가”를 추적해야 한다.',
            dechiveView: 'AI 도구의 안정성은 기능 유지뿐 아니라 모델 생명주기 관리에도 달려 있다. 모델이 바뀌면 답변 성향, 비용, 속도, 정확도, 개발자 경험이 바뀔 수 있다. Dechive는 모델 deprecation도 중요한 업데이트로 기록해야 한다.',
            readerTakeaway: 'AI 개발 도구에서는 모델 출시만큼 모델 종료와 대체 일정도 중요하다.',
            screenMaterialStatus: 'GitHub changelog 표 화면 참고 가능. 없으면 “current model → deprecation date → suggested alternative” 흐름의 설명 이미지가 적합하다.',
            cautionNote: 'Gemini 모델 자체가 사라진다고 쓰지 않는다. GitHub Copilot 경험 안에서의 deprecation 공지로 제한한다.',
          },
        ],
      },
      {
        name: 'GitHub Copilot Usage Metrics',
        intro: 'Copilot usage metrics 개선은 기업 AI 운영에서 사용량 측정과 비용 귀속의 정확도가 검증 기준이 되고 있음을 보여준다.',
        updates: [
          {
            id: 'github-copilot-usage-metrics-accuracy-coverage',
            title: 'GitHub Copilot usage metrics — AI 사용량 측정의 빈틈을 줄이다',
            officialDate: '2026.07.02',
            checkedDateKST: '2026.07.03',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Improved accuracy and coverage in Copilot usage metrics reports',
              url: 'https://github.blog/changelog/2026-07-02-improved-accuracy-and-coverage-in-copilot-usage-metrics-reports/',
            },
            updateType: 'Copilot / Usage Metrics / Cost Attribution / Enterprise Reporting',
            badges: ['Copilot', 'Usage Metrics', 'Cost Attribution', 'Enterprise Analytics', 'Official Changelog'],
            summary: 'GitHub은 Copilot usage metrics reports의 정확도와 범위를 개선했다고 발표했다. Copilot CLI의 suggested lines of code가 보고에 포함되고, server-side telemetry만 보이던 사용자의 IDE 식별이 개선됐으며, AI credit consumption attribution이 더 완전하게 반영된다.',
            whatChanged: 'Copilot 사용량 보고에서 CLI 활동, 서버 측 사용 흔적, AI credit attribution 관련 빈틈이 줄었다.',
            whyItMatters: '기업은 AI 도구를 도입한 뒤 누가 얼마나 쓰고 어떤 비용이 발생했는지 알아야 한다. 사용량 측정이 부정확하면 AI 도입 효과와 비용 판단도 흔들린다.',
            dechiveView: 'AI 도입 검증은 “개발자가 좋아한다”에서 끝나지 않는다. 실제 사용량, 코드 제안량, 비용 귀속, IDE별 사용 표면을 측정할 수 있어야 한다. 이 업데이트는 AI 사용을 감으로 운영하지 않고 데이터로 관리하려는 흐름이다.',
            readerTakeaway: '기업 AI 운영에서는 사용량 측정과 비용 귀속의 정확도가 도입 성과 검증의 일부가 된다.',
            screenMaterialStatus: 'GitHub usage metrics API 또는 보고 예시 화면이 있으면 공식 화면 참고 가능. 없으면 “Copilot usage → metrics API → AI credits → enterprise report” 흐름의 설명 이미지가 적합하다.',
            cautionNote: '이 기능을 일반 사용자용 대시보드 개선처럼 쓰지 않는다. enterprise administrators / organization owners를 위한 usage metrics 개선으로 제한한다.',
          },
        ],
      },
      {
        name: 'GitHub Copilot Automation Security',
        intro: 'Copilot CLI의 Actions 인증 변화는 AI 자동화가 어떤 권한과 토큰으로 실행되는지까지 검증해야 한다는 점을 보여준다.',
        updates: [
          {
            id: 'github-copilot-cli-actions-github-token',
            title: 'Copilot CLI in GitHub Actions — AI 자동화에서 long-lived PAT 부담을 줄이다',
            officialDate: '2026.07.02',
            checkedDateKST: '2026.07.03',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Copilot CLI no longer needs a personal access token in GitHub Actions',
              url: 'https://github.blog/changelog/2026-07-02-copilot-cli-no-longer-needs-a-personal-access-token-in-github-actions/',
            },
            updateType: 'Copilot CLI / GitHub Actions / Automation Security / Developer Workflow',
            badges: ['Copilot', 'Automation Security', 'GitHub Actions', 'Developer Workflow', 'Official Changelog'],
            summary: 'GitHub은 Copilot CLI가 GitHub Actions에서 personal access token 없이 built-in GITHUB_TOKEN으로 실행될 수 있다고 발표했다. 조직 소유 repository에서 Copilot CLI 사용을 조직 billing으로 처리할 수 있으며, long-lived PAT 관리 부담을 줄이는 변화다.',
            whatChanged: 'GitHub Actions에서 Copilot CLI를 실행할 때 별도의 개인 access token을 만들고 저장할 필요가 줄었다.',
            whyItMatters: 'AI CLI가 CI/CD나 자동화 환경에 들어가면 인증 토큰 관리가 보안 리스크가 된다. built-in GITHUB_TOKEN을 사용할 수 있으면 운영 부담과 장기 토큰 노출 위험을 줄일 수 있다.',
            dechiveView: 'AI 자동화는 “명령을 실행할 수 있다”보다 “어떤 권한으로 안전하게 실행되는가”가 중요하다. Copilot CLI가 Actions 안으로 들어갈수록, 인증 방식과 billing 조건까지 검증해야 한다.',
            readerTakeaway: 'AI CLI 자동화에서는 기능보다 권한, 토큰, billing 정책이 먼저 검증되어야 한다.',
            screenMaterialStatus: 'GitHub Actions 또는 changelog 화면 참고 가능. 공식 화면이 부족하면 “GitHub Actions → GITHUB_TOKEN → Copilot CLI → organization billing” 흐름의 설명 이미지가 적합하다.',
            cautionNote: '모든 repository에서 자동으로 되는 것처럼 쓰지 않는다. 조직 정책, 권한, Copilot CLI 버전 조건을 공식 문서 기준으로 확인해야 한다.',
          },
        ],
      },
      {
        name: 'GitHub Enterprise Cost Governance',
        intro: 'AI credit pool cap은 기업 AI가 실제 운영 예산과 비용 배분 기준 안으로 들어가고 있음을 보여준다.',
        updates: [
          {
            id: 'github-cost-center-ai-credit-pools',
            title: 'GitHub cost center AI credit pools — 기업 AI 비용을 더 세밀하게 제한하다',
            officialDate: '2026.07.02',
            checkedDateKST: '2026.07.03',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Cost centers now support AI credit pools',
              url: 'https://github.blog/changelog/2026-07-02-cost-centers-now-support-included-usage-caps/',
            },
            updateType: 'Enterprise AI / Cost Governance / AI Credits / Usage Control',
            badges: ['Enterprise AI', 'Cost Governance', 'AI Credits', 'Usage Control', 'Official Changelog'],
            summary: 'GitHub은 cost center가 enterprise의 monthly included AI credits 중 사용할 수 있는 양을 cap할 수 있게 했다고 발표했다. 이 기능은 REST API로 제공되며, UI 관리는 추후 제공될 예정이다.',
            whatChanged: '기업은 cost center 단위로 AI credit pool 사용량을 제한할 수 있게 됐다. 특정 cost center가 전체 shared pool을 과도하게 사용하는 문제를 줄이려는 기능이다.',
            whyItMatters: 'AI 사용량이 늘어나면 기업은 예산 초과뿐 아니라 내부 비용 배분 문제를 관리해야 한다. AI credit pool cap은 AI가 실제 운영 예산 안에 들어가고 있음을 보여준다.',
            dechiveView: 'AI 비용 통제는 단순한 billing 문제가 아니다. 기업이 AI를 조직 전체에 배포하려면 어느 팀이 얼마만큼 사용할 수 있는지, 공유된 credit pool을 누가 소모하는지 추적해야 한다. Dechive는 AI 도입을 기능이 아니라 운영 비용 구조까지 포함해 검증해야 한다.',
            readerTakeaway: '기업 AI 운영은 누가 AI를 쓰는가를 넘어, 누가 공유 credit을 얼마나 쓰는가까지 관리하는 단계로 들어갔다.',
            screenMaterialStatus: 'GitHub billing/cost center 관련 공식 화면이 있으면 참고 가능. 없으면 “enterprise included AI credits → cost center pool cap → REST API → future UI” 흐름의 설명 이미지가 적합하다.',
            cautionNote: '현재 REST API 제공이며 cost center settings UI는 추후 제공 예정이라는 점을 구분한다.',
          },
        ],
      },
      {
        name: 'Reported Governance / Market Watch',
        intro: 'Reuters 보도 기반 항목은 공식 업데이트와 섞지 않고, governance / market watch로 분리해 기록한다.',
        updates: [
          {
            id: 'reuters-openai-government-stake-discussion',
            title: 'OpenAI government stake discussion — frontier AI 기업은 국가 거버넌스 문제로 이동한다',
            officialDate: '2026.07.02 보도일',
            checkedDateKST: '2026.07.03',
            sourceType: 'Reliable News / Reuters / Reported Context',
            officialSource: {
              label: 'Reuters — OpenAI proposes handing Trump administration a 5% stake, FT reports',
              url: 'https://www.reuters.com/business/openai-proposes-handing-trump-administration-5-stake-ft-reports-2026-07-02/',
            },
            updateType: 'Reported Governance / AI Company Ownership / Public Interest',
            badges: ['Reported Context', 'Reliable News', 'Governance', 'Risk Watch'],
            summary: 'Reuters는 Financial Times 보도를 인용해 OpenAI가 미국 정부에 5% 지분을 제공하는 방안을 논의했다고 보도했다. 이는 공식 발표가 아니라 보도 기반 항목이다.',
            whatChanged: 'frontier AI 기업의 가치와 수익이 공공 이익, 정부 개입, 국가 정책과 어떻게 연결될 수 있는지에 대한 논의가 다시 부각됐다.',
            whyItMatters: 'AI 기업은 단순한 기술 기업이 아니라 국가 전략, 경제적 분배, 공공 이익의 대상으로 다뤄지기 시작했다.',
            dechiveView: '이 항목은 공식 업데이트가 아니라 governance watch로 다뤄야 한다. Dechive 관점에서 중요한 것은 OpenAI가 실제로 무엇을 결정했는가보다, frontier AI 기업의 소유권과 공공 이익 문제가 본격적인 검증 대상으로 올라왔다는 점이다.',
            readerTakeaway: 'AI 기업의 미래는 모델 성능뿐 아니라 소유권, 공공 이익, 정부와의 관계까지 포함해 검증해야 한다.',
            screenMaterialStatus: '뉴스 보도 기반이므로 공식 제품 화면 없음. 설명 이미지가 필요하다면 “frontier AI company → government stake discussion → public interest / governance” 흐름이 적합하다.',
            cautionNote: 'OpenAI의 공식 발표처럼 쓰지 않는다. Reuters가 FT 보도를 인용해 보도한 항목임을 명확히 한다.',
          },
          {
            id: 'reuters-meta-ai-agent-development-speed',
            title: 'Meta AI agent development slower than expected — agent hype와 실제 구현 속도의 간극',
            officialDate: '2026.07.02 보도일',
            checkedDateKST: '2026.07.03',
            sourceType: 'Reliable News / Reuters / Reported Context',
            officialSource: {
              label: 'Reuters — Zuckerberg says AI agent development going slower than expected',
              url: 'https://www.reuters.com/business/zuckerberg-says-ai-agent-development-going-slower-than-expected-2026-07-02/',
            },
            updateType: 'Reported Context / Agent Reality Check / Enterprise Execution',
            badges: ['Reported Context', 'Reliable News', 'Agentic Work', 'AI Operating Model', 'Risk Watch'],
            summary: 'Reuters는 Meta 내부 타운홀에서 Zuckerberg가 AI agent 개발 속도가 예상보다 느리다고 말했다고 보도했다. Meta는 AI 인프라와 조직 개편에 큰 투자를 하고 있지만, agent 개발 속도는 기대만큼 빠르게 진전되지 않았다는 맥락이다.',
            whatChanged: 'AI agent가 빠르게 모든 업무를 대체할 것이라는 기대와 달리, 대형 기술 기업 내부에서도 실제 개발과 조직 적용 속도는 더디다는 신호가 나왔다.',
            whyItMatters: 'AI agent는 데모와 실제 운영 사이의 간극이 큰 영역이다. 기업이 대규모 투자를 하더라도 agent를 안정적으로 구현하고 조직에 적용하는 일은 단순하지 않다.',
            dechiveView: 'Dechive는 agent hype를 그대로 받아들이지 않는다. 중요한 것은 “AI agent가 가능하다”가 아니라, 실제 조직 안에서 얼마나 안정적으로 구현되고 검증 가능한 결과를 내는가다.',
            readerTakeaway: 'AI agent의 약속은 빠르지만, 실제 구현은 여전히 느리고 복잡할 수 있다.',
            screenMaterialStatus: '뉴스 보도 기반이므로 공식 제품 화면 없음. 설명 이미지가 필요하다면 “agent promise → infrastructure investment → organizational friction → slower execution” 흐름이 적합하다.',
            cautionNote: 'Meta가 AI agent 개발에 실패했다고 단정하지 않는다. Reuters 보도에 따르면 개발 속도가 예상보다 느리다는 내부 발언이 있었다고 표현한다.',
          },
        ],
      },
      {
        name: 'Low Priority / Excluded',
        intro: 'officialDate가 2026.07.02로 확인되더라도 이번 페이지 핵심 흐름과 직접성이 낮거나 날짜 확인이 필요한 항목은 보조로 분리한다.',
        updates: [
          {
            id: 'google-cloud-gemini-enterprise-agent-platform-security-findings',
            title: 'Google Cloud Gemini Enterprise Agent Platform security findings — 보조 확인 항목',
            officialDate: '2026.07.02인지 공식 release notes에서 반드시 재확인',
            checkedDateKST: '2026.07.03',
            sourceType: 'Official Release Notes / Verification Needed',
            officialSource: {
              label: 'Google Cloud Release Notes',
              url: 'https://docs.cloud.google.com/release-notes',
            },
            updateType: 'Enterprise AI / Agent Platform / Security Findings / Posture Management',
            badges: ['Enterprise AI', 'Agent Platform', 'Security / Governance', 'Needs Date Verification', 'Not Main AI Update'],
            summary: 'Google Cloud release notes에서 Gemini Enterprise Agent Platform의 AI security findings와 posture management summaries 관련 GA 항목이 확인될 수 있다. 단, officialDate가 2026.07.02인지 반드시 직접 확인한 뒤 사용한다.',
            whatChanged: 'Agent Platform 안에서 AI security findings와 posture management summaries를 볼 수 있는 보안 관측 기능이 강화되는 흐름이다.',
            whyItMatters: '기업 AI agent platform은 모델 실행뿐 아니라 보안 상태와 위험 발견을 함께 관리해야 한다.',
            dechiveView: '이 항목은 보조 항목으로 다룬다. 기업 AI 플랫폼은 모델 선택보다 보안 관측과 posture 관리까지 포함하는 운영 인프라가 되고 있다.',
            readerTakeaway: '기업 AI agent platform은 보안 관측과 posture management를 함께 요구한다.',
            screenMaterialStatus: 'Google Cloud release notes 화면 참고 가능. 별도 이미지는 필수 아님.',
            cautionNote: 'officialDate가 2026.07.02로 확인되지 않으면 메인에서 제외하고 Low Priority / Verification Needed로 이동한다.',
          },
        ],
      },
    ],
    verificationNote: '이번 페이지는 2026.07.03 KST에 확인한 officialDate 2026.07.02 공식 업데이트 기록이다. 오늘 메인 업데이트는 Anthropic Fable 5 cyber safeguards와 jailbreak framework, Microsoft Frontier Company, GitHub Copilot agent session streaming, GitHub Copilot model deprecation, GitHub Copilot usage metrics 개선, Copilot CLI의 GitHub Actions GITHUB_TOKEN 지원, GitHub cost center AI credit pool이다.\n\n이번 페이지에서는 공식 업데이트와 보도 기반 항목을 섞지 않는다. Anthropic과 Microsoft, GitHub 항목은 공식 블로그 또는 공식 changelog 기준으로 다루고, OpenAI 정부 지분 논의와 Meta AI agent 개발 속도 이슈는 Reuters 보도 기반 Reported Governance / Market Watch로 분리한다.\n\n특히 Fable 5 safeguard 항목은 모델 성능 업데이트가 아니라 안전 기준과 jailbreak 평가 기준으로 다룬다. Microsoft Frontier Company는 기업 AI 구현과 운영의 문제로 분류한다. GitHub Copilot agent session streaming은 agent 관측성, model deprecation은 모델 생명주기, usage metrics는 사용량 측정, Copilot CLI in Actions는 자동화 보안, cost center AI credit pools는 비용 거버넌스로 구분한다.',
    closingLine: 'AI는 더 강력해지는 동시에 더 많이 통제되고, 더 많이 관측되고, 더 많이 비용 기준 안으로 들어가고 있다. Dechive는 그 변화가 무엇을 가능하게 하는지보다, 그 변화를 어떤 기준으로 검증해야 하는지 기록한다.',
    updates: [
      {
        id: 'anthropic-fable-5-safeguards-jailbreak-framework-summary',
        slug: 'anthropic-fable-5-safeguards-jailbreak-framework',
        title: 'Anthropic Fable 5 safeguards',
        summary: '강력한 모델의 신뢰는 성능뿐 아니라 safeguard와 jailbreak 평가 기준으로 검증해야 한다.',
        badges: ['Model Safety', 'Jailbreak Framework', 'Official Source'],
        detailHref: '/ai-updates/2026-07-02#anthropic-fable-5-safeguards-jailbreak-framework',
        source: {
          label: "Anthropic 공식 블로그 — More details on Fable 5's cyber safeguards and our jailbreak framework",
          url: 'https://www.anthropic.com/news/fable-safeguards-jailbreak-framework',
          description: 'Fable 5 cyber safeguards와 jailbreak severity framework 공식 설명',
        },
        whatChanged: 'Fable 5의 safeguard와 jailbreak severity framework가 공식 블로그 기준으로 정리됐다.',
        useCriteria: '모델 안전 정책, jailbreak 평가 기준, 사이버 safeguard를 설명할 때 사용한다.',
        verificationNotes: ['officialDate 2026.07.02 기준', 'Fable 5가 완전히 안전하다는 단정 표현은 피한다.'],
        image: {
          status: 'limited',
          caption: '공식 블로그 화면 참고 가능. 별도 제품 화면은 필수 아님.',
        },
      },
      {
        id: 'microsoft-frontier-company-ai-engineering-summary',
        slug: 'microsoft-frontier-company-ai-engineering',
        title: 'Microsoft Frontier Company',
        summary: '기업 AI 도입은 도구 구독이 아니라 구현, 운영, 보안, 거버넌스, 성과 관리의 문제가 되고 있다.',
        badges: ['Enterprise AI', 'AI Implementation', 'Governance', 'Official Source'],
        detailHref: '/ai-updates/2026-07-02#microsoft-frontier-company-ai-engineering',
        source: {
          label: 'Microsoft 공식 블로그 — Microsoft Frontier Company',
          url: 'https://blogs.microsoft.com/blog/2026/07/02/microsoft-frontier-company-ai-engineering-that-amplifies-and-protects-your-intelligence/',
          description: '기업 AI 구현과 보호를 다루는 Microsoft 공식 발표',
        },
        whatChanged: 'Microsoft가 기업 고객의 AI 구현과 운영을 돕는 AI engineering 중심 조직을 발표했다.',
        useCriteria: '기업 AI 도입을 모델 성능이 아니라 구현 조건과 운영 구조로 설명할 때 사용한다.',
        verificationNotes: ['officialDate 2026.07.02 기준', '모든 기업 전환을 자동 해결한다는 표현은 피한다.'],
        image: {
          status: 'limited',
          caption: '공식 블로그 화면 참고 가능. 구현 흐름 설명 이미지가 적합하다.',
        },
      },
      {
        id: 'github-copilot-operations-control-summary',
        slug: 'github-copilot-operations-control',
        title: 'GitHub Copilot 운영 통제 묶음',
        summary: 'Copilot은 agent 관측성, 모델 생명주기, 사용량 측정, Actions 인증, AI credit cap을 통해 개발자 도구 운영 통제 안으로 들어가고 있다.',
        badges: ['Copilot', 'Agent Observability', 'Model Lifecycle', 'Usage Metrics', 'Cost Governance', 'Official Changelog'],
        detailHref: '/ai-updates/2026-07-02#github-copilot-agent-session-streaming-public-preview',
        source: {
          label: 'GitHub Changelog — 2026.07.02 Copilot updates',
          url: 'https://github.blog/changelog/',
          description: '2026.07.02 GitHub Copilot 관련 공식 changelog 묶음',
        },
        whatChanged: 'GitHub은 Copilot agent session streaming, Gemini 모델 deprecation, usage metrics 개선, Copilot CLI Actions 인증, cost center AI credit pool cap을 각각 공지했다.',
        useCriteria: 'AI 개발 도구가 결과 생성에서 관측, 생명주기, 비용 통제의 대상으로 이동하는 흐름을 설명할 때 사용한다.',
        verificationNotes: ['각 항목은 상세 그룹의 개별 GitHub Changelog canonical URL을 기준으로 확인한다.', 'Public preview, deprecation, REST API 제공 범위를 구분한다.'],
        image: {
          status: 'limited',
          caption: '공식 changelog 화면 또는 운영 흐름 설명 이미지가 적합하다.',
        },
      },
    ],
  },
  {
    date: '2026-07-01',
    checkedDateKST: '2026.07.02',
    title: 'AI는 더 똑똑해지는 것이 아니라, 더 깊이 작업 안으로 들어오고 있다',
    subtitle: '7월 1일 글로벌 AI 업데이트의 핵심은 모델 성능 경쟁이 아니다. Anthropic은 고성능 모델 접근과 보안 기준을 다시 조정했고, Google은 이미지와 영상을 하나의 제작 흐름으로 묶었으며, OpenAI를 둘러싼 소송은 AI가 사람의 판단과 감정에 얼마나 깊이 들어왔는지를 다시 묻고 있다.',
    quickSummary: [
      '접근/작업대: Fable 5 재배포와 Claude Sonnet 5, Claude Science 흐름은 고성능 AI가 접근 조건, 보안 기준, 개발자·연구자 작업 환경 안으로 들어가는 변화를 보여준다.',
      '제작 흐름: Gemini Omni Flash는 텍스트, 이미지, 영상이 하나의 제작 흐름으로 이어지는 방향을 보여준다. 제작은 빨라지지만 메시지 검증은 여전히 사람의 일이다.',
      '책임/위험: ChatGPT 관련 소송 이슈는 AI가 사용자의 판단과 감정에 깊이 관여할 때 안전장치와 검증 감각이 왜 필요한지 다시 묻는다.',
    ],
    groups: [
      {
        name: 'Anthropic Access / Policy',
        intro: 'Fable 5 재배포는 단순한 모델 재출시가 아니라, 고성능 AI가 접근 권한과 보안 기준 안에서 운영되는 흐름으로 읽는다.',
        updates: [
          {
            id: 'anthropic-fable-5-global-redeployment',
            title: 'Anthropic Fable 5 재배포 — 누가 어떤 조건에서 강한 모델을 쓸 수 있는가',
            officialDate: '2026.07.01',
            checkedDateKST: '2026.07.02',
            sourceType: 'Official Blog / Global Availability Follow-up',
            officialSource: {
              label: 'Anthropic — Redeploying Fable 5',
              url: 'https://www.anthropic.com/news/redeploying-fable-5',
            },
            updateType: 'Model Access / Safety / Policy / Effective Change',
            badges: ['Model Access', 'Safety', 'Policy', 'Effective Change', 'Official Source', 'Global Update'],
            summary: 'Claude Fable 5는 7월 1일부터 글로벌 사용자에게 다시 제공되는 흐름으로 이어졌다. 이 항목은 단순한 모델 재출시가 아니라, 고성능 AI가 성능뿐 아니라 접근 권한, 수출 통제, 보안 평가, jailbreak 방어 기준과 함께 다뤄지고 있음을 보여준다.',
            whatChanged: '6월 30일 발표된 Fable 5 재배포가 7월 1일 글로벌 사용자 제공 흐름으로 이어졌다. Mythos 5의 제한적 접근 복구와 구분해 기록해야 한다.',
            whyItMatters: '좋은 모델이 나왔는지만으로는 충분하지 않다. 강한 모델일수록 누가, 어느 지역에서, 어떤 조건과 안전 기준 아래 사용할 수 있는지가 제품 경험의 일부가 된다.',
            dechiveView: '좋은 모델이 나왔는지가 아니라, 누가 어떤 조건에서 그 모델을 쓸 수 있는지가 중요해지고 있다.',
            readerTakeaway: '고성능 AI의 배포는 성능 경쟁이면서 동시에 접근 권한과 안전 기준의 문제다.',
            screenMaterialStatus: '공식 블로그 화면 외 별도 제품 이미지는 필수 아님. 설명 이미지가 필요하면 “수출 통제 → 접근 중단 → 보안 기준 조정 → 글로벌 재배포” 흐름이 적합하다.',
            cautionNote: 'Fable 5 재배포를 완전한 무조건 공개처럼 쓰지 않는다. 접근 조건, 정책 변화, 안전 기준과 함께 읽어야 한다.',
          },
        ],
      },
      {
        name: 'Claude Workbench Flow',
        intro: 'Claude Sonnet 5와 Claude Science는 AI가 채팅창을 넘어 개발자, 연구자, 기업의 실제 작업 환경 안으로 들어가는 흐름이다.',
        updates: [
          {
            id: 'claude-sonnet-5-science-workflow',
            title: 'Claude Sonnet 5 / Claude Science — AI는 답변창 밖의 작업 환경으로 이동한다',
            officialDate: '2026.07.01 기준 흐름',
            checkedDateKST: '2026.07.02',
            sourceType: 'Official Blog / Product Flow',
            officialSource: {
              label: 'Anthropic News',
              url: 'https://www.anthropic.com/news',
            },
            updateType: 'Agentic Model / AI Workbench / Developer Workflow / Research Tool',
            badges: ['Agentic Model', 'AI Workbench', 'Developer Workflow', 'Research Tool', 'Official Source'],
            summary: 'Claude Sonnet 5와 Claude Science는 AI가 채팅창에 머무는 것이 아니라 개발자, 연구자, 기업의 작업 환경 안으로 들어가는 흐름으로 묶어 볼 수 있다. Sonnet 5는 agentic model 흐름을 넓히고, Claude Science는 과학 연구 작업대를 베타로 제공한다.',
            whatChanged: 'AI가 답변만 제공하는 인터페이스에서 벗어나 코드 환경, 연구 도구, 데이터 처리, 산출물 생성, 검증 가능한 작업 기록으로 확장되고 있다.',
            whyItMatters: 'AI가 실제 작업 환경 안으로 들어오면 생산성만 볼 수 없다. 도구 권한, 실행 기록, 산출물 검증, 연구 재현성 같은 기준이 함께 중요해진다.',
            dechiveView: 'AI는 더 이상 답변창에만 머물지 않는다. 개발자의 코드 환경, 연구자의 실험 환경, 기업의 업무 환경 안으로 들어가고 있다.',
            readerTakeaway: 'AI를 쓴다는 말은 점점 “답변을 받는다”가 아니라 “작업 환경 안에 AI를 배치한다”는 뜻에 가까워지고 있다.',
            screenMaterialStatus: 'Claude Sonnet 5와 Claude Science 공식 블로그의 화면/설명 자료를 참고할 수 있다. 통합 설명 이미지가 필요하면 “코드 환경 / 연구 환경 / 기업 업무 환경 → AI 작업대 → 산출물 검증” 구조가 적합하다.',
            cautionNote: 'Claude Science가 과학 연구를 자동으로 완성한다고 쓰지 않는다. Sonnet 5도 모든 작업을 안전하게 자동 처리한다고 단정하지 않는다.',
          },
        ],
      },
      {
        name: 'Google Creative Workflow',
        intro: 'Gemini Omni Flash는 이미지와 영상을 별도 결과물이 아니라 하나의 제작 흐름으로 연결하는 방향으로 본다.',
        updates: [
          {
            id: 'google-gemini-omni-flash-creative-flow',
            title: 'Google Gemini Omni Flash — 이미지는 더 빨리 만들어지고, 영상은 더 쉽게 움직인다',
            officialDate: '2026.07.01 글로벌 흐름 기준',
            checkedDateKST: '2026.07.02',
            sourceType: 'Product / Media Generation Watch',
            officialSource: {
              label: 'Google AI',
              url: 'https://ai.google/',
            },
            updateType: 'Creative AI / Media Generation / Creative Workflow',
            badges: ['Creative AI', 'Media Generation', 'Creative Workflow', 'Explanation Image Recommended'],
            summary: 'Gemini Omni Flash 흐름은 텍스트와 이미지를 짧은 영상 제작 흐름으로 연결하는 방향으로 볼 수 있다. Threads 이미지, Shorts, 인트로 영상, 고정 이미지 영상화처럼 정적인 시각 자료가 움직이는 제작물로 이어지는 흐름과 연결된다.',
            whatChanged: 'AI 제작 흐름이 “이미지 생성”과 “영상 생성”을 따로 보는 단계에서, 텍스트·이미지·영상 입력을 이어 붙이는 멀티모달 제작 흐름으로 이동하고 있다.',
            whyItMatters: '제작 속도가 빨라질수록 결과물의 메시지, 맥락, 출처, 합성 여부를 확인하는 일이 더 중요해진다. 빠르게 움직이는 영상이 좋은 설명을 보장하지는 않는다.',
            dechiveView: '이미지는 더 빨리 만들어지고, 영상은 더 쉽게 움직인다. 하지만 메시지가 선명한지는 여전히 사람이 검증해야 한다.',
            readerTakeaway: 'AI 영상 제작의 핵심은 “만들 수 있다”가 아니라 “무엇을 전달했고, 무엇을 오해하게 만들 수 있는가”다.',
            screenMaterialStatus: '공식 화면을 크게 나열하기보다 “텍스트/이미지 입력 → 짧은 영상 → Shorts/인트로/소셜 게시물 → 메시지 검증” 흐름의 설명 이미지가 적합하다.',
            cautionNote: '이 항목은 7월 2일 당일 검증되지 않은 새 뉴스로 확장하지 않는다. 7월 1일 글로벌 흐름 기준의 제작 워크플로우 변화로 제한해 기록한다.',
          },
        ],
      },
      {
        name: 'OpenAI Risk / Responsibility',
        intro: 'OpenAI 관련 소송 보도는 자극적인 사건 요약이 아니라, AI가 판단과 감정에 깊이 관여할 때 생기는 검증과 안전의 문제로 다룬다.',
        updates: [
          {
            id: 'openai-chatgpt-risk-responsibility-watch',
            title: 'OpenAI 관련 책임/위험 이슈 — AI가 공감하는 것처럼 말할수록 더 쉽게 믿게 된다',
            officialDate: '2026.07.01 보도 기준',
            checkedDateKST: '2026.07.02',
            sourceType: 'Risk Watch / Litigation Coverage',
            officialSource: {
              label: 'OpenAI Safety',
              url: 'https://openai.com/safety/',
            },
            updateType: 'Risk Watch / Safety / Responsibility',
            badges: ['Risk Watch', 'Safety', 'Responsibility', 'Explanation Image Recommended'],
            summary: '7월 1일 보도된 ChatGPT 관련 소송 이슈는 자극적인 사건으로 소비하기보다, AI가 사용자의 판단과 감정에 깊이 관여할 때 어떤 검증과 안전 기준이 필요한지 묻는 기록으로 다룬다.',
            whatChanged: 'AI 챗봇이 정보 검색 도구를 넘어 조언, 감정적 지지, 판단 보조 역할로 사용될 때 기업 책임과 사용자 안전의 경계가 다시 논의되고 있다.',
            whyItMatters: 'AI가 공감하는 것처럼 말하면 사용자는 답변을 더 쉽게 믿을 수 있다. 특히 취약한 상황에서는 그럴듯한 언어가 판단을 보조하는 수준을 넘어 영향을 줄 수 있다.',
            dechiveView: 'AI가 공감하는 것처럼 말할수록, 사용자는 더 쉽게 그것을 믿는다. 그래서 안전장치보다 먼저 필요한 것은 검증 감각이다.',
            readerTakeaway: 'AI의 친절한 말투는 검증된 판단이 아니다. 감정과 판단이 걸린 문제일수록 멈춤 조건과 외부 확인이 필요하다.',
            screenMaterialStatus: '사건 이미지를 쓰지 않는다. 설명 이미지가 필요하다면 “AI 응답 → 사용자 신뢰 → 판단 영향 → 멈춤/외부 검증” 흐름이 적합하다.',
            cautionNote: '소송 보도를 선정적으로 다루지 않는다. 사실관계는 보도와 공식 입장 범위 안에서만 기록하고, Dechive에서는 검증 감각과 안전 기준의 문제로 정리한다.',
          },
        ],
      },
    ],
    verificationNote: '이번 페이지는 2026.07.02 KST에 확인한 2026.07.01 글로벌 AI 업데이트 흐름 기록이다. 화면상 오늘 날짜는 2026.07.02이지만, 본문 기준은 글로벌 시차를 고려한 2026.07.01 업데이트다. 7월 2일 당일에 나온 뉴스나 아직 충분히 검증되지 않은 내용은 메인으로 넣지 않는다. 이번 페이지에서는 Anthropic Fable 5 재배포, Claude Sonnet 5 / Claude Science 작업 환경 흐름, Google Gemini Omni Flash 제작 흐름, OpenAI 관련 책임/위험 이슈를 서로 섞지 않는다. 특히 소송 이슈는 자극적 사건 요약이 아니라 AI가 판단과 감정에 깊이 들어올 때 필요한 검증 감각과 안전 기준의 문제로 다룬다.',
    closingLine: 'AI가 더 많은 일을 대신할수록, 사람에게 남는 일은 사라지지 않는다. 무엇을 맡길지, 무엇을 믿을지, 어디서 멈춰 검증할지를 정하는 일이 더 중요해진다.',
    updates: [
      {
        id: 'anthropic-fable-5-global-redeployment',
        slug: 'anthropic-fable-5-global-redeployment',
        title: 'Anthropic Access / Workbench',
        summary: 'Fable 5 재배포와 Claude 작업대 흐름은 고성능 AI가 접근 조건, 보안 기준, 개발·연구 환경 안으로 들어가는 변화를 보여준다.',
        badges: ['Model Access', 'Safety', 'AI Workbench', 'Official Source'],
        detailHref: '/ai-updates/2026-07-01#anthropic-fable-5-global-redeployment',
        source: {
          label: 'Anthropic Official Source',
          url: 'https://www.anthropic.com/news/redeploying-fable-5',
          description: 'Fable 5 재배포와 Claude 작업 환경 흐름을 확인하는 공식 출처입니다.',
        },
        whatChanged: 'AI가 답변창 밖의 접근 정책, 개발 환경, 연구 작업대 안으로 이동하고 있다.',
        useCriteria: '강한 모델은 성능뿐 아니라 접근 권한, 보안 평가, 실행 기록, 검증 기준과 함께 봐야 한다.',
        verificationNotes: ['officialDate 2026.07.01 글로벌 흐름 기준', 'checkedDateKST 2026.07.02', 'Anthropic 접근 정책과 작업대 흐름으로 분류'],
        image: {
          status: 'limited',
          caption: '공식 블로그 화면과 설명 이미지가 적합하다.',
        },
      },
      {
        id: 'google-gemini-omni-flash-creative-flow',
        slug: 'google-gemini-omni-flash-creative-flow',
        title: 'Gemini Omni Flash',
        summary: '텍스트와 이미지를 짧은 영상 제작 흐름으로 연결하며, 빠른 제작 이후 메시지 검증의 중요성을 남긴다.',
        badges: ['Creative AI', 'Media Generation', 'Creative Workflow'],
        detailHref: '/ai-updates/2026-07-01#google-gemini-omni-flash-creative-flow',
        source: {
          label: 'Google AI',
          url: 'https://ai.google/',
          description: 'Gemini 기반 창작 흐름을 확인하는 Google 공식 진입점입니다.',
        },
        whatChanged: '이미지와 영상 제작이 별도 결과물이 아니라 하나의 멀티모달 제작 흐름으로 연결되고 있다.',
        useCriteria: '이미지와 영상이 빨라질수록 메시지, 맥락, 합성 여부를 사람이 확인해야 한다.',
        verificationNotes: ['officialDate 2026.07.01 글로벌 흐름 기준', 'checkedDateKST 2026.07.02', 'Creative Workflow로 분류'],
        image: {
          status: 'none',
          caption: '텍스트/이미지 입력에서 짧은 영상으로 이어지는 설명 이미지가 적합하다.',
        },
      },
      {
        id: 'openai-chatgpt-risk-responsibility-watch',
        slug: 'openai-chatgpt-risk-responsibility-watch',
        title: 'OpenAI Risk / Responsibility',
        summary: 'ChatGPT 관련 소송 이슈는 AI가 판단과 감정에 깊이 관여할 때 필요한 안전 기준과 검증 감각의 문제로 기록한다.',
        badges: ['Risk Watch', 'Safety', 'Responsibility'],
        detailHref: '/ai-updates/2026-07-01#openai-chatgpt-risk-responsibility-watch',
        source: {
          label: 'OpenAI Safety',
          url: 'https://openai.com/safety/',
          description: 'OpenAI의 안전 기준을 확인하는 공식 진입점입니다.',
        },
        whatChanged: 'AI 챗봇의 정서적·판단 보조 사용이 기업 책임과 사용자 안전 논의로 이어지고 있다.',
        useCriteria: 'AI가 공감하는 말투로 답할수록 사용자는 더 쉽게 믿을 수 있으므로 멈춤 조건과 외부 검증이 필요하다.',
        verificationNotes: ['officialDate 2026.07.01 보도 기준', 'checkedDateKST 2026.07.02', 'Risk Watch로 분류'],
        image: {
          status: 'none',
          caption: '사건 이미지는 쓰지 않고 검증 흐름 설명 이미지가 적합하다.',
        },
      },
    ],
  },
  {
    date: '2026-06-30',
    checkedDateKST: '2026.07.01',
    title: 'AI가 에이전트 모델, 과학 작업대, 기업 비용 통제 안으로 들어간 날',
    subtitle: '오늘의 공식 업데이트는 Claude Sonnet 5와 Claude Science처럼 에이전트형 AI가 일상 모델과 연구 작업대 안으로 들어가고, GeneBench-Pro와 OpenAI 인프라 기록처럼 AI의 판단과 신뢰성을 더 정교하게 검증하려는 흐름이 중심이다.',
    quickSummary: [
      '모델/에이전트: Anthropic은 Claude Sonnet 5를 공개했고, GitHub Copilot은 Claude Sonnet 5를 여러 개발 표면의 모델 선택지로 일반 제공했다.',
      '연구/검증: Claude Science는 과학 연구 작업대 베타로, GeneBench-Pro는 과학적 판단 벤치마크로, Core dump epidemiology는 인프라 신뢰성 기록으로 분리해 본다.',
      '기업 운영: Fable 5 재배포, GitHub AI credit budget, Google Cloud Gemini Enterprise, Anthropic Status는 접근 정책, 비용 통제, 플랫폼 운영, 안정성 기록으로 구분한다.',
    ],
    groups: [
      {
        name: 'Anthropic Model Launch',
        intro: 'Claude Sonnet 5는 에이전트 능력이 더 일상적인 Sonnet급 모델 영역으로 내려오는 흐름으로 기록한다.',
        updates: [
          {
            id: 'anthropic-claude-sonnet-5',
            title: 'Anthropic Claude Sonnet 5 — 에이전트 능력이 일상 모델로 내려오다',
            officialDate: '2026.06.30',
            checkedDateKST: '2026.07.01',
            sourceType: 'Official Blog / Model Release',
            officialSource: {
              label: 'Anthropic — Introducing Claude Sonnet 5',
              url: 'https://www.anthropic.com/news/claude-sonnet-5',
            },
            updateType: 'Model Launch / Agentic Model / Developer Tool',
            badges: ['Model Launch', 'Agentic Model', 'Developer Tool', 'Official Source', 'Official Screen Available'],
            summary: 'Anthropic은 Claude Sonnet 5를 공개했다. Sonnet 5는 브라우저와 터미널 같은 도구를 사용하고, 계획을 세우고, 더 자율적으로 작업하는 agentic Sonnet model로 설명된다. Free와 Pro에서는 기본 모델이 되고, Max, Team, Enterprise에서도 사용 가능하며, Claude Code와 Claude Platform에서도 제공된다. 개발자는 API에서 `claude-sonnet-5`를 사용할 수 있다.',
            whatChanged: 'Anthropic의 Sonnet 라인업이 더 강한 에이전트형 작업 능력을 갖춘 모델로 업데이트됐다. 브라우저, 터미널, 계획 수립, 자율 작업 흐름이 핵심이다.',
            whyItMatters: '에이전트 능력이 Opus 같은 고가/상위 모델에만 머무르지 않고 Sonnet급 일상 모델로 내려오면 더 많은 사용자가 자율 작업, 도구 사용, 장기 작업 흐름을 경험하게 된다.',
            dechiveView: '이 업데이트의 핵심은 “새 모델이 나왔다”가 아니다. 강한 에이전트 능력이 더 일상적인 모델 영역으로 내려오고 있다는 점이다. AI가 더 자율적으로 움직일수록 사용자는 모델 성능뿐 아니라 도구 권한, 실행 로그, 멈춤 조건, 검증 기준을 함께 봐야 한다.',
            readerTakeaway: 'Claude Sonnet 5는 에이전트형 AI 능력이 더 많은 사용자와 개발자 환경으로 확장되는 흐름을 보여준다.',
            screenMaterialStatus: 'Anthropic 공식 블로그에 Claude Sonnet 5 대표 이미지, 벤치마크 표, cost-performance chart가 있어 공식 화면 참고 가능으로 표시한다. 별도 설명 이미지가 필요하면 “사용자 요청 → 계획 수립 → 브라우저/터미널 도구 사용 → 결과 검증” 흐름이 적합하다.',
            cautionNote: 'Claude Sonnet 5가 모든 작업을 완전히 자율적으로 안전하게 처리한다고 쓰지 않는다. agentic model로 설명하되, 도구 사용과 자율 작업에는 검증 기준이 필요하다고 함께 기록한다.',
          },
        ],
      },
      {
        name: 'Anthropic Science Workbench',
        intro: 'Claude Science는 과학 연구를 자동 완성하는 도구가 아니라, 검증 가능한 산출물과 연구 환경 통합을 지원하는 베타 작업대로 분류한다.',
        updates: [
          {
            id: 'anthropic-claude-science-workbench',
            title: 'Anthropic Claude Science — 과학 연구에 검증 가능한 AI 작업대를 만들다',
            officialDate: '2026.06.30',
            checkedDateKST: '2026.07.01',
            sourceType: 'Official Blog / Product Beta',
            officialSource: {
              label: 'Anthropic — Claude Science, an AI workbench for scientists',
              url: 'https://www.anthropic.com/news/claude-science-ai-workbench',
            },
            updateType: 'AI Workbench / Science / Research Tool / Beta',
            badges: ['AI Workbench', 'Science', 'Research Tool', 'Beta', 'Official Source', 'Official Screen Available'],
            summary: 'Anthropic은 Claude Science를 공개했다. Claude Science는 과학자를 위한 AI 워크벤치로, 연구자가 자주 쓰는 도구와 패키지를 통합하고, 검증 가능한 산출물을 만들고, 로컬 macOS/Linux 또는 SSH/HPC 환경에서 사용할 수 있게 하는 앱이다. 현재 Pro, Max, Team, Enterprise 플랜에서 베타로 제공된다.',
            whatChanged: 'Claude가 단순 연구 보조 챗봇을 넘어, 과학 연구 환경 안에서 데이터 처리, 도구 실행, 산출물 생성, 검증 가능한 작업 기록을 지원하는 워크벤치 형태로 확장됐다.',
            whyItMatters: '과학 연구에서 중요한 것은 답변보다 재현 가능성과 검증 가능성이다. AI가 논문을 요약하거나 코드를 제안하는 것에서 끝나지 않고, 연구자가 실제로 사용하는 도구와 환경 안에서 작업을 수행하고 기록을 남길 수 있어야 한다.',
            dechiveView: 'Claude Science는 Dechive에 매우 잘 맞는 업데이트다. AI가 연구를 대신하는 것이 아니라, 연구 과정의 산출물과 기록을 검증 가능한 형태로 남길 수 있는지가 핵심이다. AI 연구 도구의 가치는 “그럴듯한 설명”이 아니라, 연구자가 다시 확인할 수 있는 artifact에 있다.',
            readerTakeaway: '과학 연구용 AI는 논문 요약을 넘어, 검증 가능한 작업 기록과 산출물을 남기는 연구 작업대로 이동하고 있다.',
            screenMaterialStatus: 'Anthropic 공식 블로그에 Claude Science 대표 이미지와 제품 시작 링크가 있어 공식 화면 참고 가능으로 표시한다. 별도 설명 이미지가 필요하면 “문헌 분석 → 데이터 처리 → 도구 실행 → 산출물 → 검증 가능한 기록” 흐름이 적합하다.',
            cautionNote: 'Claude Science가 과학 연구를 자동으로 완성한다고 쓰지 않는다. 베타 제품이며, 연구자를 위한 AI 워크벤치로 분류한다.',
          },
        ],
      },
      {
        name: 'Anthropic Model Access / Policy',
        intro: 'Fable 5 재배포는 기능 출시가 아니라 모델 접근 권한, 안전, 정책 변화가 실제 배포를 바꾸는 사례로 읽는다.',
        updates: [
          {
            id: 'anthropic-fable-5-redeployment',
            title: 'Anthropic Fable 5 재배포 — 강한 모델은 성능만으로 배포되지 않는다',
            officialDate: '2026.06.30',
            checkedDateKST: '2026.07.01',
            sourceType: 'Official Blog / Policy Update',
            officialSource: {
              label: 'Anthropic — Redeploying Fable 5',
              url: 'https://www.anthropic.com/news/redeploying-fable-5',
            },
            updateType: 'Model Access / Safety / Policy / Effective Change',
            badges: ['Model Access', 'Safety', 'Policy', 'Effective Change', 'Official Source', 'Official Screen Not Required'],
            summary: 'Anthropic은 Fable 5 재배포 계획을 발표했다. 6월 12일 미국 정부의 수출 통제 지시 때문에 Fable 5와 Mythos 5 접근이 중단됐지만, 6월 30일 기준 해당 수출 통제가 해제되었고 Fable 5는 7월 1일부터 글로벌 사용자에게 다시 제공될 예정이라고 밝혔다. Mythos 5는 미국 정부 승인에 따라 일부 미국 조직에 접근이 복구됐다.',
            whatChanged: 'Fable 5의 접근 제한이 해제되고 글로벌 사용자에게 다시 제공될 예정이라는 변화가 발표됐다. Mythos 5는 제한적으로 일부 미국 조직에 접근이 복구됐다.',
            whyItMatters: '강력한 AI 모델은 성능만으로 배포되지 않는다. 정부 규제, 수출 통제, 안전장치, 신뢰 프로그램, 지역별 접근 권한이 모델 제공 여부에 직접 영향을 준다.',
            dechiveView: '이 항목은 기능 출시보다 모델 접근 정책 변화로 봐야 한다. AI 업데이트는 모델 성능뿐 아니라 누가 접근할 수 있고, 어떤 조건에서 다시 배포되는지도 기록해야 한다.',
            readerTakeaway: '강력한 모델의 배포는 기술 문제가 아니라 정책, 안전, 접근 권한의 문제이기도 하다.',
            screenMaterialStatus: '공식 블로그 화면 외 별도 이미지는 필수 아님. 필요하다면 “수출 통제 → 접근 중단 → 통제 해제 → 재배포” 흐름의 설명 이미지가 적합하다.',
            cautionNote: 'Fable 5가 이미 모든 사용자에게 제공되었다고 단정하지 않는다. 7월 1일부터 글로벌 사용자에게 다시 제공될 예정이라는 표현과 Mythos 5의 제한적 접근 복구를 구분한다.',
          },
        ],
      },
      {
        name: 'GitHub Copilot',
        intro: 'GitHub Copilot 항목은 모델 제공과 IDE 에이전트 통합을 나눠 기록한다.',
        updates: [
          {
            id: 'github-copilot-claude-sonnet-5-ga',
            title: 'GitHub Copilot — Claude Sonnet 5를 모델 선택지로 넣다',
            officialDate: '2026.06.30',
            checkedDateKST: '2026.07.01',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Claude Sonnet 5 is generally available for GitHub Copilot',
              url: 'https://github.blog/changelog/2026-06-30-claude-sonnet-5-is-generally-available-for-github-copilot/',
            },
            updateType: 'Copilot / Model Availability / Developer Tool',
            badges: ['Copilot', 'Model Availability', 'Developer Tool', 'Official Changelog', 'Official Source', 'Official Screen Not Confirmed'],
            summary: 'GitHub은 Claude Sonnet 5를 GitHub Copilot에서 일반 제공한다고 발표했다. Copilot Pro, Pro+, Max, Business, Enterprise 사용자가 사용할 수 있고, VS Code, Visual Studio, Copilot CLI, Copilot cloud agent, GitHub Copilot App, github.com, GitHub Mobile, JetBrains, Xcode, Eclipse 등 여러 표면에서 모델 선택이 가능하다. Business와 Enterprise 관리자는 model policy에서 활성화해야 한다.',
            whatChanged: 'Claude Sonnet 5가 GitHub Copilot의 모델 선택지로 추가됐다. Anthropic 모델이 GitHub Copilot의 다양한 개발 환경 안으로 들어왔다.',
            whyItMatters: 'AI 코딩 도구는 이제 하나의 기본 모델을 쓰는 제품이 아니라, 여러 공급자의 모델을 작업별로 고르는 플랫폼으로 바뀌고 있다. 개발자는 IDE, CLI, 모바일, 클라우드 에이전트 등 여러 표면에서 모델을 선택하게 된다.',
            dechiveView: 'Claude Sonnet 5가 Anthropic 자체 제품뿐 아니라 GitHub Copilot 안으로 바로 들어왔다는 점이 중요하다. 모델 경쟁은 모델 회사 안에서만 벌어지지 않는다. 개발 도구 플랫폼이 어떤 모델을 어떤 표면에 제공하느냐가 실제 사용 경험을 결정한다.',
            readerTakeaway: 'GitHub Copilot은 여러 모델을 작업별로 선택하는 개발자용 AI 플랫폼으로 확장되고 있다.',
            screenMaterialStatus: 'GitHub 공식 changelog의 본문을 기준으로 기록한다. 공식 화면이 명확하지 않으면 “Copilot surfaces → model picker → Claude Sonnet 5” 흐름의 설명 이미지가 적합하다.',
            cautionNote: 'Business와 Enterprise는 관리자가 model policy에서 활성화해야 한다는 점을 명확히 한다. 모든 사용자가 자동으로 사용하는 기능처럼 쓰지 않는다.',
          },
          {
            id: 'github-copilot-agent-jetbrains-ai-assistant',
            title: 'GitHub Copilot Agent in JetBrains — IDE 안의 에이전트 선택지가 되다',
            officialDate: '2026.06.30',
            checkedDateKST: '2026.07.01',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Copilot Agent is now available in JetBrains AI Assistant',
              url: 'https://github.blog/changelog/2026-06-30-copilot-agent-is-now-available-in-jetbrains-ai-assistant/',
            },
            updateType: 'IDE Integration / Agentic Coding / Developer Workflow',
            badges: ['IDE Integration', 'Agentic Coding', 'Developer Workflow', 'Copilot', 'Official Changelog', 'Official Source', 'Official Screen Not Confirmed'],
            summary: 'GitHub과 JetBrains는 Copilot Agent가 JetBrains AI Assistant 안에서 사용할 수 있게 됐다고 발표했다. JetBrains AI Assistant의 agent picker에서 GitHub Copilot을 선택할 수 있고, Copilot 모델을 고르거나 reasoning depth를 조절할 수 있으며, 여러 단계의 실제 코딩 작업을 Copilot Agent에 맡길 수 있다. GitHub은 이 통합이 Agent Client Protocol 기반 흐름에서 한 단계 더 나아간 것이라고 설명한다.',
            whatChanged: 'Copilot Agent가 JetBrains AI Assistant 안의 에이전트 선택지로 들어갔다. 사용자는 IDE 안에서 에이전트와 모델, reasoning depth를 선택하며 코딩 작업을 맡길 수 있다.',
            whyItMatters: '개발자는 점점 IDE 안에서 여러 AI 에이전트 중 하나를 선택하게 된다. AI 코딩 도구는 별도 창이나 플러그인을 넘어, IDE의 기본 작업 흐름 안에 배치되고 있다.',
            dechiveView: '이 업데이트는 개발 환경의 AI 통합이 더 깊어지고 있음을 보여준다. 앞으로 중요한 것은 “AI가 코드를 써주느냐”보다, 개발자가 어떤 IDE 안에서 어떤 에이전트를 어떤 추론 깊이로 호출할 수 있는지가 될 수 있다.',
            readerTakeaway: 'AI 코딩 에이전트는 별도 도구가 아니라, IDE 안에서 선택하고 작업을 맡기는 구성 요소가 되고 있다.',
            screenMaterialStatus: 'GitHub 또는 JetBrains 공식 화면이 있으면 공식 화면 참고 가능으로 표시한다. 공식 화면이 명확하지 않으면 “JetBrains IDE → AI Assistant → Agent picker → Copilot Agent → 코드 작업” 흐름의 설명 이미지가 적합하다.',
            cautionNote: '이 기능을 모든 JetBrains 사용자에게 자동 제공되는 것처럼 쓰지 않는다. 필요한 플랜, 접근 조건, 지원 환경은 공식 문서 기준으로 확인해 작성한다.',
          },
        ],
      },
      {
        name: 'OpenAI Research',
        intro: 'GeneBench-Pro는 제품 출시가 아니라 과학적 판단을 평가하는 연구용 벤치마크다.',
        updates: [
          {
            id: 'openai-genebench-pro',
            title: 'OpenAI GeneBench-Pro — AI는 과학적 판단까지 검증받기 시작했다',
            officialDate: '2026.06.30',
            checkedDateKST: '2026.07.01',
            sourceType: 'Official Research / Benchmark',
            officialSource: {
              label: 'OpenAI — Introducing GeneBench-Pro',
              url: 'https://openai.com/index/introducing-genebench-pro/',
            },
            updateType: 'Research / Benchmark / Scientific Reasoning',
            badges: ['Research', 'Benchmark', 'Scientific Reasoning', 'Official Source', 'Official Screen Available'],
            summary: 'OpenAI는 GeneBench-Pro를 공개했다. GeneBench-Pro는 계산생물학에서 AI 에이전트가 모호한 데이터, 분석 경로 선택, 실험적 판단, 반복적 분석 같은 고차원 판단을 얼마나 잘 수행하는지 측정하는 연구용 벤치마크다. 129개 문제, 10개 도메인, 21개 하위 도메인을 포함하며, 단순 지식 테스트가 아니라 실제 연구 판단을 평가하는 벤치마크로 설명된다.',
            whatChanged: 'OpenAI가 과학 분야에서 AI 에이전트의 단순 정답 능력보다 연구 판단 능력을 평가하는 벤치마크를 공개했다.',
            whyItMatters: '과학 연구에서 중요한 것은 지식 암기가 아니다. 데이터가 질문을 지지하는지, 어떤 분석 경로가 맞는지, 언제 결과를 믿을 수 있는지 판단해야 한다. AI가 과학 연구에 들어가려면 이런 판단 능력도 평가되어야 한다.',
            dechiveView: 'GeneBench-Pro는 Dechive 관점에서 매우 중요하다. AI 검증은 “정답을 맞혔나”에서 끝나지 않는다. 과학에서는 근거, 분석 경로, 불확실성, 반복 검토가 중요하다. 이 벤치마크는 AI가 과학적 판단까지 검증받기 시작했다는 신호다.',
            readerTakeaway: 'AI는 단순 지식 테스트를 넘어, 과학적 판단과 분석 경로 선택까지 평가받기 시작했다.',
            screenMaterialStatus: 'OpenAI 공식 글에 GeneBench-Pro 대표 이미지와 벤치마크 설명 자료가 있어 공식 이미지 참고 가능으로 표시한다. 별도 설명 이미지가 필요하면 “데이터 → 분석 경로 선택 → 판단 → 검증” 흐름이 적합하다.',
            cautionNote: 'GeneBench-Pro를 일반 제품 출시처럼 쓰지 않는다. 연구용 벤치마크로 분류한다. AI가 과학 연구를 완전히 해결한다는 식의 표현은 피한다.',
          },
        ],
      },
      {
        name: 'OpenAI Engineering',
        intro: 'Core dump epidemiology는 AI 기능 출시가 아니라 AI 서비스를 지탱하는 데이터 인프라 신뢰성 기록이다.',
        updates: [
          {
            id: 'openai-core-dump-epidemiology',
            title: 'OpenAI Core dump epidemiology — AI 인프라 버그를 역학처럼 추적하다',
            officialDate: '2026.06.30',
            checkedDateKST: '2026.07.01',
            sourceType: 'Official Engineering Blog',
            officialSource: {
              label: 'OpenAI — Core dump epidemiology: fixing an 18-year-old bug',
              url: 'https://openai.com/index/core-dump-epidemiology-data-infrastructure-bug/',
            },
            updateType: 'Engineering / Reliability / Infrastructure Debugging',
            badges: ['Engineering', 'Reliability', 'Infrastructure Debugging', 'Official Source', 'Official Screen Available'],
            summary: 'OpenAI는 데이터 인프라에서 발생한 난해한 크래시를 해결한 엔지니어링 글을 공개했다. Rockset 기반 ChatGPT 데이터 인프라에서 발생한 문제를 분석했고, 처음에는 하나의 이상한 버그처럼 보였지만 실제로는 Azure 호스트의 조용한 하드웨어 오류와 GNU libunwind의 오래된 race condition이라는 두 문제가 겹친 것이었다고 설명한다. 핵심은 개별 사례를 깊게 보는 방식이 아니라, 전체 크래시 집단을 분석하는 역학적 진단으로 문제를 찾았다는 점이다.',
            whatChanged: 'OpenAI가 AI 서비스 인프라의 난해한 장애를 어떻게 분석했는지 공개했다. 단일 버그 분석보다 집단적 패턴 분석을 통해 원인을 찾은 엔지니어링 사례다.',
            whyItMatters: 'AI 서비스는 모델만으로 작동하지 않는다. 데이터 인프라, 검색 시스템, 하드웨어, 라이브러리, 크래시 분석 체계가 모두 안정적으로 움직여야 한다. 인프라가 불안정하면 AI 답변 경험도 흔들릴 수 있다.',
            dechiveView: 'Dechive에서는 이 항목을 AI 제품 업데이트가 아니라 신뢰성 기록으로 다뤄야 한다. AI 답변의 품질은 모델 성능뿐 아니라 그 답변을 지탱하는 인프라의 안정성과 분석 능력에 달려 있다.',
            readerTakeaway: 'AI 서비스 신뢰성은 모델만이 아니라, 데이터 인프라와 장애 분석 방식까지 포함한다.',
            screenMaterialStatus: 'OpenAI 공식 글에 Rockset art card와 관련 설명 이미지가 있어 공식 이미지 참고 가능으로 표시한다. 별도 설명 이미지가 필요하면 “crash reports → pattern analysis → root cause → infrastructure fix” 흐름이 적합하다.',
            cautionNote: '이 항목은 제품 기능 출시가 아니다. Engineering / Reliability 항목으로 분류한다.',
          },
        ],
      },
      {
        name: 'GitHub Enterprise Governance',
        intro: 'AI 사용량이 늘수록 기업은 기능 활성화뿐 아니라 비용센터별 사용량과 예산 통제를 함께 운영해야 한다.',
        updates: [
          {
            id: 'github-ai-credit-budgets-cost-centers',
            title: 'GitHub AI Credit Budgets — AI 사용량을 비용센터별로 통제하기 시작하다',
            officialDate: '2026.06.30',
            checkedDateKST: '2026.07.01',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Per-user AI credit budgets available for cost centers',
              url: 'https://github.blog/changelog/2026-06-30-per-user-ai-credit-budgets-available-for-cost-centers/',
            },
            updateType: 'Enterprise AI / Cost Governance / Usage Control',
            badges: ['Enterprise AI', 'Cost Governance', 'Usage Control', 'Official Changelog', 'Official Source', 'Explanation Image Recommended'],
            summary: 'GitHub은 기업 관리자를 위해 cost center 단위 per-user AI credit budget을 추가했다. 조직은 팀이나 비용센터마다 사용자 1인당 AI credit 예산을 다르게 줄 수 있고, 구성원이 이동하면 예산 적용도 따라간다. 이 기능은 현재 REST API로 만들 수 있으며, Billing UI 지원은 추후 제공될 예정이다.',
            whatChanged: '기업이 GitHub AI credit 사용량을 cost center 단위로 관리할 수 있게 됐다. 팀이나 비용센터마다 사용자 1인당 예산을 다르게 설정할 수 있다.',
            whyItMatters: 'AI 도입이 확대되면 비용 관리가 중요해진다. 기업은 누가 AI를 쓸 수 있는지뿐 아니라, 어느 팀이 얼마나 쓸 수 있는지, 비용을 어떻게 배분할지 관리해야 한다.',
            dechiveView: 'AI 운영은 기능 문제가 아니라 비용과 거버넌스 문제로도 확장되고 있다. AI 사용량을 비용센터별로 관리하는 기능은 기업이 AI를 실제 운영 예산 안에 넣기 시작했다는 신호다.',
            readerTakeaway: '기업 AI 운영은 이제 누가 쓸 수 있는가를 넘어, 누가 얼마나 쓸 수 있는가를 관리하는 단계로 가고 있다.',
            screenMaterialStatus: 'GitHub Billing 또는 REST API 예시 화면이 있으면 참고 가능으로 표시한다. 공식 화면이 명확하지 않으면 “cost center → per-user AI credit budget → usage control” 흐름의 설명 이미지가 적합하다.',
            cautionNote: '현재 REST API로 제공되고 Billing UI는 추후 제공 예정이라는 점을 구분한다. 모든 UI에서 바로 설정 가능한 기능처럼 쓰지 않는다.',
          },
        ],
      },
      {
        name: 'Google Cloud',
        intro: 'Google Cloud Gemini Enterprise 항목은 오늘의 메인 흐름을 보조하는 기업 AI 운영 기록으로 분리한다.',
        updates: [
          {
            id: 'google-cloud-gemini-enterprise-agent-platform-2026-06-30',
            title: 'Google Cloud Gemini Enterprise / Agent Platform — 기업 AI는 데이터 저장소, 지역, 모델 선택까지 운영한다',
            officialDate: '2026.06.30',
            checkedDateKST: '2026.07.01',
            sourceType: 'Official Release Notes',
            officialSource: {
              label: 'Google Cloud Release Notes — June 30, 2026',
              url: 'https://docs.cloud.google.com/release-notes',
            },
            updateType: 'Enterprise AI / Data Store / Model Garden / Agent Platform',
            badges: ['Enterprise AI', 'Data Store', 'Model Garden', 'Agent Platform', 'Official Source', 'Explanation Image Recommended'],
            summary: 'Google Cloud 릴리즈노트에는 2026년 6월 30일자로 Gemini Enterprise와 Agent Platform 관련 업데이트가 확인된다. Microsoft SharePoint federated data store 필터가 GA가 됐고, India/Singapore region 지원이 GA with allowlist로 제공되며, Gemini Enterprise Agent Platform의 Model Garden에서 Claude Sonnet 5가 제공된다.',
            whatChanged: 'Gemini Enterprise와 Agent Platform이 기업 데이터 저장소 필터링, 지역 지원, Model Garden 안의 모델 선택 범위를 확장했다.',
            whyItMatters: '기업 AI는 모델 성능만으로 운영되지 않는다. 어떤 데이터 저장소를 연결하고, 어떤 지역에서 처리하고, 어떤 모델을 플랫폼 안에서 사용할 수 있는지가 운영 조건이 된다.',
            dechiveView: '이 항목은 보조 항목으로 다루는 것이 적절하다. 핵심은 기업 AI가 점점 데이터 연결, 지역, 모델 선택, 플랫폼 운영의 문제로 들어가고 있다는 점이다.',
            readerTakeaway: '기업 AI는 모델만 고르는 것이 아니라, 데이터 저장소와 지역, 플랫폼 안의 모델 선택까지 함께 운영해야 한다.',
            screenMaterialStatus: 'Google Cloud 공식 release notes 화면 외 별도 이미지는 필수 아님. 설명 이미지가 필요하다면 “Gemini Enterprise → SharePoint data store filter / regional support / Model Garden” 구조를 보여주는 다이어그램이 적합하다.',
            cautionNote: 'Google Cloud 항목은 메인보다 보조로 다룬다. 6월 29일 Jira Data Center / SharePoint·OneDrive action-filtering 항목과 중복하지 않도록 주의한다.',
          },
        ],
      },
      {
        name: 'Status Watch',
        intro: '상태 페이지 항목은 기능 업데이트가 아니라 신뢰성과 오류율을 추적하는 기록으로 분리한다.',
        updates: [
          {
            id: 'anthropic-status-opus-4-8-elevated-error-rates',
            title: 'Anthropic Status — Opus 4.8 elevated error rates',
            officialDate: '2026.06.30',
            checkedDateKST: '2026.07.01',
            sourceType: 'Official Status Page',
            officialSource: {
              label: 'Anthropic Status — Elevated error rates on Opus 4.8',
              url: 'https://status.claude.com/',
            },
            updateType: 'Status Watch / Reliability / Incident',
            badges: ['Status Watch', 'Reliability', 'Incident', 'Official Source', 'Official Screen Available'],
            summary: 'Anthropic Status에는 2026년 6월 30일 Opus 4.8 elevated error rates 이슈가 기록되었다. 같은 날 resolved 상태로 표시되며, 기능 업데이트가 아니라 서비스 안정성 기록으로 분리해야 한다.',
            whatChanged: 'Opus 4.8에서 elevated error rates 이슈가 발생했고, 공식 상태 페이지에 기록되었다.',
            whyItMatters: 'AI 서비스를 실제 업무에 쓰는 사람에게는 모델 성능만큼 서비스 안정성도 중요하다. 오류율 증가와 복구 상태는 AI 도구 신뢰성을 판단하는 기준이 된다.',
            dechiveView: 'Dechive에서는 상태 이슈를 기능 업데이트와 분리해야 한다. AI가 잘하는지뿐 아니라 안정적으로 작동했는지도 검증해야 한다.',
            readerTakeaway: 'AI 서비스는 모델 성능뿐 아니라 오류율과 안정성도 함께 봐야 한다.',
            screenMaterialStatus: 'Anthropic Status Page 화면을 참고할 수 있다. 별도 설명 이미지는 필수 아님.',
            cautionNote: '기능 업데이트처럼 쓰지 않는다. 장애 범위나 영향은 공식 Status Page에 적힌 범위 이상으로 확대해서 쓰지 않는다.',
          },
        ],
      },
      {
        name: 'Low Priority / Excluded',
        intro: '2026년 6월 30일 공식 항목이더라도 AI Updates 메인 흐름과 직접 맞지 않으면 보조 또는 제외로 분리한다.',
        updates: [
          {
            id: 'github-code-coverage-merge-protection-low-priority',
            title: 'GitHub Code Coverage Merge Protection',
            officialDate: '2026.06.30',
            checkedDateKST: '2026.07.01',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog',
              url: 'https://github.blog/changelog/',
            },
            updateType: 'Code Quality / Pull Request Governance / Not Main AI Update',
            badges: ['Code Quality', 'Pull Request Governance', 'Not Main AI Update', 'Official Changelog'],
            summary: 'GitHub code coverage merge protection은 6월 30일 공식 changelog 항목이지만, AI Updates 메인으로는 약하다. 코드 품질과 PR 병합 규칙 맥락에서 보조 항목으로 짧게 언급할 수 있다.',
            whatChanged: '코드 커버리지 기준을 PR 병합 보호 흐름에 연결하는 GitHub 업데이트가 확인됐다.',
            whyItMatters: '코드 품질과 병합 기준에는 의미가 있지만, 오늘 페이지의 에이전트 모델, 연구 작업대, 과학 벤치마크, AI 비용 통제 흐름과는 직접성이 낮다.',
            dechiveView: 'Dechive AI Updates에서는 AI 기능 업데이트처럼 크게 다루지 않고 Low Priority로 분리한다.',
            readerTakeaway: 'AI Updates 메인 항목은 아니며, 코드 품질/PR 거버넌스 보조 기록으로 충분하다.',
            screenMaterialStatus: '공식 changelog 화면 외 별도 이미지는 필수 아님.',
            cautionNote: 'AI 기능 업데이트처럼 크게 다루지 않는다.',
          },
          {
            id: 'github-open-source-license-compliance-low-priority',
            title: 'GitHub Open Source License Compliance',
            officialDate: '2026.06.30',
            checkedDateKST: '2026.07.01',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog',
              url: 'https://github.blog/changelog/',
            },
            updateType: 'Supply Chain Security / License Compliance / Public Preview / Not Main AI Update',
            badges: ['Supply Chain Security', 'License Compliance', 'Public Preview', 'Not Main AI Update', 'Official Changelog'],
            summary: 'GitHub open source license compliance public preview는 ruleset 기반으로 비준수 의존성을 병합 전에 막는 기능이다. AI Updates 메인이라기보다는 코드 품질/공급망 보안 보조 항목으로 분리한다.',
            whatChanged: '오픈소스 라이선스 준수 여부를 ruleset 기반으로 확인하고 병합 전에 통제하는 공개 프리뷰 항목이 확인됐다.',
            whyItMatters: '공급망 보안과 라이선스 준수 측면에서는 중요하지만, 오늘의 AI 변화 흐름 자체를 설명하는 메인 항목은 아니다.',
            dechiveView: 'AI 업데이트로 과장하지 않고, 공급망 보안/라이선스 준수 보조 기록으로 남긴다.',
            readerTakeaway: 'AI Updates 메인보다는 개발 거버넌스 보조 항목으로 읽는 것이 맞다.',
            screenMaterialStatus: '공식 changelog 화면 외 별도 이미지는 필수 아님.',
            cautionNote: 'AI 기능 업데이트로 과장하지 않는다.',
          },
        ],
      },
    ],
    verificationNote: '이번 페이지는 2026.07.01 KST에 확인한 officialDate 2026.06.30 공식 업데이트 기록이다. 오늘 메인 업데이트는 Anthropic Claude Sonnet 5, Claude Science, Fable 5 재배포, GitHub Copilot의 Claude Sonnet 5 일반 제공, Copilot Agent의 JetBrains AI Assistant 통합, OpenAI GeneBench-Pro, OpenAI Core dump epidemiology, GitHub AI credit budget이다. 이번 페이지에서는 모델 출시, 과학 연구 작업대, 모델 접근 정책, 개발자 도구 통합, 연구 벤치마크, 인프라 신뢰성 기록, 기업 비용 통제, 상태 이슈를 서로 섞지 않는다. 특히 Claude Science는 과학 연구를 자동으로 완성하는 도구가 아니라, 검증 가능한 산출물과 연구 환경 통합을 지원하는 베타 워크벤치로 다룬다. GeneBench-Pro는 제품 출시가 아니라 연구용 벤치마크다. OpenAI Core dump epidemiology는 AI 기능 업데이트가 아니라 인프라 신뢰성 기록이다. GitHub AI credit budget은 기업 비용 거버넌스 업데이트다. Anthropic Status는 기능 업데이트가 아니라 안정성 기록이다.',
    closingLine: 'AI는 더 똑똑해지는 동시에 더 많이 검증되고, 더 세밀하게 관리되고 있다. 에이전트 모델은 일상 도구로 내려오고, 과학 연구는 검증 가능한 작업대로 옮겨가며, 기업은 AI 사용량과 비용을 통제하기 시작한다. Dechive는 그 변화가 무엇을 가능하게 하고, 무엇을 검증해야 하는지 기록한다.',
    updates: [
      {
        id: 'anthropic-claude-sonnet-5',
        slug: 'anthropic-claude-sonnet-5',
        title: 'Claude Sonnet 5',
        summary: '에이전트 능력이 Sonnet급 일상 모델로 내려오며 브라우저, 터미널, 계획 수립, 자율 작업 흐름을 더 넓은 사용자와 개발자 환경으로 확장한다.',
        badges: ['Model Launch', 'Agentic Model', 'Developer Tool', 'Official Source'],
        detailHref: '/ai-updates/2026-06-30#anthropic-claude-sonnet-5',
        source: {
          label: 'Official Blog',
          url: 'https://www.anthropic.com/news/claude-sonnet-5',
          description: 'Anthropic Claude Sonnet 5 release',
        },
        whatChanged: 'Claude Sonnet 5가 Free/Pro 기본 모델과 Claude Code, Claude Platform, API 모델로 제공된다.',
        useCriteria: '에이전트 능력이 일상 모델로 내려올수록 도구 권한, 실행 로그, 멈춤 조건, 검증 기준이 함께 필요하다.',
        verificationNotes: ['officialDate 2026.06.30', 'checkedDateKST 2026.07.01', 'Model Launch / Agentic Model로 분류'],
        image: {
          status: 'available',
          caption: 'Anthropic 공식 블로그의 Claude Sonnet 5 이미지와 벤치마크 표 참고 가능.',
        },
      },
      {
        id: 'openai-genebench-pro',
        slug: 'openai-genebench-pro',
        title: 'OpenAI GeneBench-Pro',
        summary: '계산생물학에서 AI 에이전트의 모호한 데이터 해석, 분석 경로 선택, 실험적 판단을 평가하는 연구용 벤치마크다.',
        badges: ['Research', 'Benchmark', 'Scientific Reasoning', 'Official Source'],
        detailHref: '/ai-updates/2026-06-30#openai-genebench-pro',
        source: {
          label: 'Official Research',
          url: 'https://openai.com/index/introducing-genebench-pro/',
          description: 'OpenAI GeneBench-Pro benchmark',
        },
        whatChanged: 'OpenAI가 단순 정답보다 과학적 판단 능력을 평가하는 벤치마크를 공개했다.',
        useCriteria: '과학 연구에서 AI 검증은 근거, 분석 경로, 불확실성, 반복 검토까지 포함해야 한다.',
        verificationNotes: ['officialDate 2026.06.30', 'checkedDateKST 2026.07.01', 'Research / Benchmark로 분류'],
        image: {
          status: 'available',
          caption: 'OpenAI 공식 글의 GeneBench-Pro 대표 이미지와 벤치마크 설명 자료 참고 가능.',
        },
      },
      {
        id: 'github-ai-credit-budgets-cost-centers',
        slug: 'github-ai-credit-budgets-cost-centers',
        title: 'GitHub AI Credit Budgets',
        summary: '기업 관리자가 cost center 단위로 사용자별 AI credit budget을 설정하며 AI 사용량과 비용을 운영 예산 안에서 통제하기 시작한다.',
        badges: ['Enterprise AI', 'Cost Governance', 'Usage Control', 'Official Changelog'],
        detailHref: '/ai-updates/2026-06-30#github-ai-credit-budgets-cost-centers',
        source: {
          label: 'Official Changelog',
          url: 'https://github.blog/changelog/2026-06-30-per-user-ai-credit-budgets-available-for-cost-centers/',
          description: 'GitHub AI credit budgets for cost centers',
        },
        whatChanged: 'GitHub AI credit 사용량을 cost center 단위 per-user budget으로 관리할 수 있게 됐다.',
        useCriteria: 'AI 운영은 기능 활성화뿐 아니라 비용 배분, 사용량 제한, 거버넌스 관리로 확장된다.',
        verificationNotes: ['officialDate 2026.06.30', 'checkedDateKST 2026.07.01', 'Enterprise AI / Cost Governance로 분류'],
        image: {
          status: 'none',
          caption: '공식 화면이 명확하지 않으면 cost center와 AI credit budget 흐름의 설명 이미지가 적합하다.',
        },
      },
    ],
  },
  {
    date: '2026-06-29',
    checkedDateKST: '2026.06.30',
    title: 'AI가 노동시장 분석, 코딩 속도, 권한 통제 안으로 들어간 날',
    subtitle: '오늘의 공식 업데이트는 새 챗봇 출시보다, AI가 노동시장 전환 분석, Copilot 모델 선택, Codex 최소 권한, Gemini Enterprise 데이터 연결, 서비스 안정성 기록 안으로 들어가는 변화가 중심이다.',
    quickSummary: [
      '연구/분석: OpenAI는 유럽 노동시장에서 AI가 어떤 직업군에 어떤 변화 압력을 만들 수 있는지 분석한 EU AI Workforce Opportunity 리포트를 공개했다.',
      '개발자/권한: GitHub Copilot은 Claude Opus 4.8 fast mode preview를 열었고, Codex Permission Profiles beta는 작업별 최소 권한 경계를 다룬다.',
      '기업/상태 기록: Gemini Enterprise는 data store와 action filtering 범위를 확장했고, Anthropic Status는 Opus 4.5 elevated errors를 기능 업데이트가 아닌 안정성 기록으로 남겼다.',
    ],
    groups: [
      {
        name: 'OpenAI Workforce Research',
        intro: 'OpenAI 노동시장 리포트는 제품 업데이트가 아니라 Research / Global Affairs / AI Jobs Transition 항목으로 분리한다.',
        updates: [
          {
            id: 'openai-europe-ai-workforce-opportunity',
            title: 'OpenAI — 유럽 노동시장에서 AI 전환 지도를 그리다',
            officialDate: '2026.06.29',
            checkedDateKST: '2026.06.30',
            sourceType: 'Official Blog / Research / Global Affairs',
            officialSource: {
              label: 'OpenAI — Mapping Europe’s AI Workforce Opportunity',
              url: 'https://openai.com/index/mapping-europes-ai-workforce-opportunity/',
            },
            updateType: 'Research / Global Affairs / AI Jobs Transition / Planning Map',
            badges: ['Research', 'Global Affairs', 'AI Jobs Transition', 'Planning Map', 'Official Source', 'Explanation Image Recommended'],
            summary: 'OpenAI는 유럽 노동시장에서 AI가 어떤 직업군에 어떤 변화 압력을 만들 수 있는지 분석한 리포트를 공개했다. 이 리포트는 기존 미국 중심 AI Jobs Transition Framework를 EU 노동시장으로 확장한 자료이며, ESCO 직업 분류와 Eurostat 고용 데이터를 활용한다. OpenAI는 이 분석을 고용 예측이 아니라, AI로 인해 어떤 직업군이 성장·자동화·재조직·저변화 압력을 받을 수 있는지 보는 준비용 지도라고 설명한다.',
            whatChanged: 'OpenAI가 AI의 노동시장 영향을 단순 예측이 아니라 직업군별 변화 압력과 제도적 맥락을 분석하는 프레임워크로 확장했다.',
            whyItMatters: 'AI가 일자리에 미치는 영향은 “사라진다/늘어난다”로 단순히 나눌 수 없다. 국가별 직업 구조, 교육·자격 제도, 공공서비스, 돌봄, 법률, 의료 같은 제도적 맥락에 따라 AI가 미치는 변화는 달라진다.',
            dechiveView: 'Dechive에서는 이 항목을 “AI가 일자리를 빼앗는다” 같은 단순한 이야기로 쓰면 안 된다. 핵심은 AI 노동시장 논의를 더 세밀한 직업군, 제도, 준비 지도로 옮기는 것이다. AI 변화는 기술만의 문제가 아니라 사회가 어떻게 준비하느냐의 문제다.',
            readerTakeaway: 'AI 노동시장 변화는 단순한 예측이 아니라, 어떤 직업군이 어떤 압력을 받을지 미리 보는 준비 지도에 가깝다.',
            screenMaterialStatus: 'OpenAI 공식 글의 직업군 전환 프레임워크 이미지나 차트가 있으면 공식 이미지 참고 가능으로 표시한다. 공식 이미지가 없다면 “직업군 → 변화 압력 → 정책/교육/기업 준비” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '이 항목을 제품 업데이트처럼 쓰지 않는다. 고용 예측이나 확정된 미래처럼 단정하지 않는다. OpenAI가 제시한 것은 planning map 성격의 연구/분석 자료로 분류한다.',
          },
        ],
      },
      {
        name: 'GitHub Copilot Model Preview',
        intro: 'Copilot 모델 선택은 일반 공개 기능이 아니라 preview와 관리자 정책 조건을 함께 확인한다.',
        updates: [
          {
            id: 'github-copilot-claude-opus-4-8-fast-mode',
            title: 'GitHub Copilot — Claude Opus 4.8 fast mode를 프리뷰로 열다',
            officialDate: '2026.06.29',
            checkedDateKST: '2026.06.30',
            sourceType: 'Official Changelog',
            officialSource: {
              label: 'GitHub Changelog — Claude Opus 4.8 fast mode',
              url: 'https://github.blog/changelog/2026-06-29-claude-opus-4-8-fast-mode-is-now-in-preview-for-github-copilot/',
            },
            updateType: 'Model Preview / Developer Tool / Copilot / Fast Mode / Agentic Workflow',
            badges: ['Model Preview', 'Developer Tool', 'Copilot', 'Fast Mode', 'Agentic Workflow', 'Official Source', 'Official Screen Available'],
            summary: 'GitHub Copilot에 Claude Opus 4.8 fast mode가 프리뷰로 롤아웃되고 있다. GitHub은 fast mode가 Claude Opus 4.8의 intelligence를 유지하면서 출력 토큰 속도를 크게 높여, interactive coding과 agentic workflows에 적합하다고 설명한다. 사용 가능 대상은 Copilot Pro+, Max, Business, Enterprise이며, 여러 Copilot 표면에서 선택할 수 있다. Business와 Enterprise 관리자는 fast mode policy를 켜야 하며, 기본값은 off다.',
            whatChanged: 'GitHub Copilot이 Claude Opus 4.8 fast mode를 프리뷰로 제공하며, 같은 모델 계열에서 더 빠른 상호작용형 코딩 경험을 제공하려는 방향을 보여준다.',
            whyItMatters: 'AI 코딩 도구에서는 지능만큼 응답 속도도 중요하다. agentic workflow나 interactive coding에서는 사용자가 기다리는 시간이 길어지면 작업 흐름이 끊긴다. 따라서 빠른 출력 속도는 실제 개발 경험에 영향을 준다.',
            dechiveView: 'AI 코딩 도구의 경쟁은 “가장 똑똑한 모델”만으로 끝나지 않는다. 같은 수준의 intelligence를 유지하면서 얼마나 빠르게 상호작용할 수 있는지가 중요해지고 있다. 하지만 fast mode는 비용, 권한, 관리자 정책까지 함께 봐야 한다.',
            readerTakeaway: 'AI 코딩 모델은 더 똑똑해지는 것뿐 아니라, 더 빠르게 상호작용할 수 있는 방향으로도 조정되고 있다.',
            screenMaterialStatus: 'GitHub 공식 changelog에 Copilot model picker 이미지가 있으므로 공식 화면 참고 가능으로 표시한다.',
            cautionNote: '이 기능은 preview다. 모든 Copilot 사용자에게 자동 적용되는 일반 기능처럼 쓰지 않는다. Business/Enterprise는 관리자가 policy를 켜야 하며, 비용 구조도 일반 모델과 다를 수 있음을 명확히 한다.',
          },
        ],
      },
      {
        name: 'OpenAI Codex Permission Control',
        intro: 'Codex Permission Profiles beta는 AI 코딩 도구가 작업별 최소 권한 경계를 갖추는 흐름으로 기록한다.',
        updates: [
          {
            id: 'codex-permission-profiles-beta',
            title: 'Codex Permission Profiles — AI 코딩 도구에 최소 권한을 입히다',
            officialDate: '2026.06.29',
            checkedDateKST: '2026.06.30',
            sourceType: 'OpenAI Developer Community / Official Developer Documentation',
            officialSource: {
              label: 'OpenAI Developers Documentation — Codex CLI',
              url: 'https://developers.openai.com/codex/cli',
            },
            updateType: 'Beta / Codex / Permission Control / Security / Least Privilege',
            badges: ['Beta', 'Codex', 'Permission Control', 'Security', 'Least Privilege', 'Official Source', 'Explanation Image Recommended'],
            summary: 'OpenAI Developer Community에 Codex Permission Profiles beta release가 올라왔다. Permission profile은 Codex가 로컬 명령을 실행할 때 작업별 권한 경계를 적용할 수 있게 하는 구조다. profile은 파일시스템 규칙과 네트워크 규칙을 묶은 이름 있는 정책이며, read-only profile은 프로젝트를 읽기만 하게 하고, write-capable profile은 특정 workspace root에만 쓰기를 허용할 수 있다. built-in profile로 `:read-only`, `:workspace`, `:danger-full-access`가 제공되며, 관리자는 사용자가 선택 가능한 profile을 제한할 수 있다.',
            whatChanged: 'Codex가 기존의 거친 sandbox mode보다 더 세밀한 permission profile 방식으로 작업별 권한을 제어할 수 있게 됐다.',
            whyItMatters: 'AI 코딩 도구가 로컬 명령을 실행하고 파일을 읽고 쓸 수 있게 되면, 권한 경계가 매우 중요해진다. 모든 작업에 전체 권한을 주는 방식은 위험하다. 작업마다 읽기, 쓰기, 차단, 네트워크 접근 범위를 다르게 설정할 수 있어야 한다.',
            dechiveView: '이건 Dechive에 매우 잘 맞는 업데이트다. AI에게 일을 맡긴다는 말은 곧 권한을 설계한다는 뜻이다. AI가 무엇을 할 수 있는지보다, 어디까지 읽고 어디까지 쓸 수 있으며 어떤 경로를 차단할 수 있는지가 더 중요해지고 있다.',
            readerTakeaway: 'AI 코딩 도구는 강해질수록 전체 권한이 아니라 최소 권한 원칙을 적용해야 한다.',
            screenMaterialStatus: '공식 문서의 permission profile 예시나 설정 화면이 있으면 참고 가능으로 표시한다. 공식 화면이 없다면 “Codex task → permission profile → read/write/deny/network rule” 흐름을 보여주는 설명 이미지가 적합하다.',
            cautionNote: '이 항목은 beta다. 일반 안정 기능처럼 단정하지 않는다. OpenAI Developer Community 항목이므로, 공식 개발자 문서의 permission profiles 내용과 함께 확인해서 작성한다.',
          },
        ],
      },
      {
        name: 'Google Cloud Gemini Enterprise',
        intro: 'Gemini Enterprise는 데이터 연결과 실행 범위 통제를 GA와 Public Preview 상태로 나누어 기록한다.',
        updates: [
          {
            id: 'google-cloud-gemini-enterprise-action-filtering',
            title: 'Google Cloud Gemini Enterprise — Jira Data Center와 SharePoint/OneDrive action filtering',
            officialDate: '2026.06.29',
            checkedDateKST: '2026.06.30',
            sourceType: 'Official Release Notes',
            officialSource: {
              label: 'Google Cloud Release Notes — Gemini Enterprise',
              url: 'https://docs.cloud.google.com/gemini/enterprise/docs/release-notes',
            },
            updateType: 'Enterprise AI / Data Store / Action Filtering / Public Preview / Product Integration',
            badges: ['Enterprise AI', 'Data Store', 'Action Filtering', 'Public Preview', 'Product Integration', 'Official Source', 'Official Screen Not Required'],
            summary: 'Google Cloud 릴리즈노트에 Gemini Enterprise 관련 업데이트가 올라왔다. Jira Data Center federated data store가 일반 제공으로 제공되며, Microsoft SharePoint와 OneDrive data store에는 action-filtering support가 Public Preview로 추가됐다. SharePoint와 OneDrive data store에 설정된 필터는 search query뿐 아니라 action execution에도 적용되며, 지정된 SharePoint sites나 OneDrive paths 밖의 mutation 또는 retrieval은 실패하거나 결과를 반환하지 않는다.',
            whatChanged: 'Gemini Enterprise가 Jira Data Center를 federated data store로 사용할 수 있게 되었고, SharePoint/OneDrive에서는 검색뿐 아니라 실행 행동까지 필터 범위 안에서 제한할 수 있게 됐다.',
            whyItMatters: '기업 AI에서 중요한 것은 데이터를 연결하는 것만이 아니다. AI가 어떤 데이터에 접근할 수 있고, 어떤 데이터에 대해 action을 실행할 수 있는지를 제한해야 한다. 특히 SharePoint와 OneDrive처럼 민감한 업무 문서가 들어 있는 저장소에서는 retrieval과 mutation 범위를 정확히 통제해야 한다.',
            dechiveView: 'AI 에이전트 시대의 핵심은 연결이 아니라 경계다. Gemini Enterprise 업데이트는 기업 AI가 데이터 저장소와 연결될 때, 검색과 실행 모두에 범위를 걸어야 한다는 흐름을 보여준다. Dechive에서는 이 항목을 “AI가 더 많은 데이터를 연결한다”보다 “AI가 연결된 데이터 안에서도 어디까지 행동할 수 있는지 제한한다”로 해석한다.',
            readerTakeaway: '기업 AI는 데이터를 연결하는 것만으로 충분하지 않다. 검색과 실행이 허용되는 범위를 함께 통제해야 한다.',
            screenMaterialStatus: '공식 Google Cloud 문서 화면 외 별도 이미지는 필수 아님. 설명 이미지가 필요하다면 “Gemini Enterprise → Jira Data Center / SharePoint / OneDrive → search filter / action filter” 구조를 보여주는 다이어그램이 적합하다.',
            cautionNote: 'SharePoint/OneDrive action-filtering support는 Public Preview다. Jira Data Center federated data store GA와 Preview 항목을 구분한다. Security Command Center AI Protection의 6월 5일 항목과 혼동하지 않는다.',
          },
        ],
      },
      {
        name: 'Anthropic Status Watch',
        intro: 'Anthropic Status는 기능 업데이트가 아니라 서비스 안정성 확인 항목으로 분리한다.',
        updates: [
          {
            id: 'anthropic-opus-4-5-elevated-errors',
            title: 'Anthropic Status — Opus 4.5 elevated errors 기록',
            officialDate: '2026.06.29',
            checkedDateKST: '2026.06.30',
            sourceType: 'Official Status Page',
            officialSource: {
              label: 'Anthropic Status',
              url: 'https://status.anthropic.com/',
            },
            updateType: 'Status Watch / Reliability / Incident',
            badges: ['Status Watch', 'Reliability', 'Incident', 'Official Source', 'Official Screen Available'],
            summary: 'Anthropic Status에는 2026년 6월 29일 Opus 4.5 elevated errors 이슈가 기록되었다. 이슈는 같은 날 해결된 것으로 표시되며, 기능 업데이트가 아니라 서비스 안정성 기록으로 분리해야 한다.',
            whatChanged: 'Opus 4.5에서 elevated errors 이슈가 발생했고, 공식 상태 페이지에 기록되었다.',
            whyItMatters: 'AI 서비스를 실제 업무에 쓰는 사람에게는 모델 성능만큼 서비스 안정성도 중요하다. 오류율 증가, 장애, 복구 상태는 AI 도구 신뢰성을 판단하는 기준이 된다.',
            dechiveView: 'Dechive에서는 상태 이슈를 기능 업데이트와 분리해야 한다. AI가 잘하는지뿐 아니라 안정적으로 작동했는지도 검증해야 한다. Status Watch는 AI 업데이트의 부록이 아니라 실제 운영 신뢰성을 확인하는 기록이다.',
            readerTakeaway: 'AI 서비스는 모델 성능뿐 아니라 오류율과 안정성도 함께 봐야 한다.',
            screenMaterialStatus: 'Anthropic Status Page 화면을 참고할 수 있다. 별도 설명 이미지는 필수 아님.',
            cautionNote: '기능 업데이트처럼 쓰지 않는다. 장애 범위나 영향은 공식 Status Page에 적힌 범위 이상으로 확대해서 쓰지 않는다.',
          },
        ],
      },
      {
        name: 'Excluded / Not Main',
        intro: '이전 날짜에서 이미 다룬 항목이나 AI 중심성이 낮은 항목은 2026.06.29 메인 업데이트로 중복 작성하지 않는다.',
        updates: [
          {
            id: 'excluded-not-main-2026-06-29',
            title: 'Excluded / Not Main — 이전 날짜 항목은 다시 메인으로 쓰지 않는다',
            officialDate: '2026.06.29 기준 검토',
            checkedDateKST: '2026.06.30',
            sourceType: 'Editorial Verification Boundary',
            updateType: 'Excluded / Not Main',
            badges: ['Official Screen Not Required'],
            summary: 'OpenAI × HP Frontier Partnership, GPT-5.6 Sol 제한 프리뷰, GPT-4.5 ChatGPT 종료, ChatGPT model picker 단순화, Claude Code 2.1.195, GitHub Copilot MAI-Code-1-Flash, GitHub Desktop 3.6, Copilot usage metrics, OpenAI Codex Remote GA, ChatGPT Business Memory 개선, GitHub Copilot for Jira GA, Gemini API Computer Use Public Preview, Mistral OCR 4, Claude Tag 등은 이번 날짜의 메인 항목으로 다시 쓰지 않는다.',
            whatChanged: '이번 페이지의 범위는 officialDate 2026.06.29에 새로 기록할 수 있는 공식 업데이트로 제한한다.',
            whyItMatters: '날짜가 다른 업데이트를 다시 메인으로 끌어오면 AI Updates가 속보 나열처럼 흐려진다. Dechive의 기준은 공식 발표일과 KST 확인일을 분리해 기록하는 것이다.',
            dechiveView: 'Dechive는 흥미로운 항목보다 날짜와 출처가 맞는 항목을 우선한다. 제외 항목을 명시하는 것은 누락이 아니라 기록의 경계를 분명히 하는 작업이다.',
            readerTakeaway: '이번 페이지는 2026.06.29 공식 날짜에 해당하는 새 기록만 중심으로 읽어야 한다.',
            screenMaterialStatus: '별도 이미지 필요 없음. 제외 기준을 보여주는 텍스트 기록으로 충분하다.',
            cautionNote: '이 항목은 메인 업데이트가 아니다. 이전 날짜 항목을 재포장하지 않기 위한 범위 기록으로만 사용한다.',
          },
        ],
      },
    ],
    verificationNote: '이번 페이지는 2026.06.30 KST에 확인한 officialDate 2026.06.29 공식 업데이트 기록이다. 오늘 메인 업데이트는 OpenAI의 유럽 AI 노동시장 전환 리포트, GitHub Copilot의 Claude Opus 4.8 fast mode 프리뷰, Codex Permission Profiles beta, Google Cloud Gemini Enterprise 데이터 연결/행동 필터링 업데이트, Anthropic Opus 4.5 Status Watch다. 이번 페이지에서는 연구/분석 자료, 모델 프리뷰, 권한 통제 베타, 엔터프라이즈 데이터 연결, 서비스 상태 이슈를 서로 섞지 않는다. 특히 OpenAI 노동시장 리포트는 제품 출시가 아니라 Research / Global Affairs 항목이다. GitHub Copilot Claude Opus 4.8 fast mode는 preview이며, Business/Enterprise에서는 관리자 policy가 필요하다. Codex Permission Profiles는 beta이고, OpenAI Developer Community와 공식 개발자 문서 기준으로 확인해야 한다. Google Cloud Gemini Enterprise 항목은 GA와 SharePoint/OneDrive action-filtering Preview를 구분해야 한다. Anthropic Status는 기능 업데이트가 아니라 안정성 기록이다.',
    closingLine: 'AI는 더 많은 일을 맡기 전에 더 정확한 권한과 지표가 필요해지고 있다. 노동시장 전환을 지도화하고, 코딩 모델의 속도를 고르고, Codex의 파일 접근을 제한하고, 기업 데이터 안에서 실행 범위를 걸어야 한다. Dechive는 그 변화가 무엇을 가능하게 하고, 무엇을 검증해야 하는지 기록한다.',
    updates: [
      {
        id: 'openai-europe-ai-workforce-opportunity',
        slug: 'openai-europe-ai-workforce-opportunity',
        title: 'OpenAI EU AI Workforce Opportunity',
        summary: '유럽 노동시장에서 AI가 직업군별로 어떤 변화 압력을 만들 수 있는지 보는 준비용 지도로 분류한다.',
        badges: ['Research', 'Global Affairs', 'AI Jobs Transition', 'Planning Map', 'Official Source'],
        detailHref: '/ai-updates/2026-06-29#openai-europe-ai-workforce-opportunity',
        source: {
          label: 'OpenAI — Mapping Europe’s AI Workforce Opportunity',
          url: 'https://openai.com/index/mapping-europes-ai-workforce-opportunity/',
          description: 'OpenAI 공식 블로그의 유럽 AI 노동시장 전환 리포트를 기준으로 확인합니다.',
        },
        whatChanged: 'OpenAI가 AI의 노동시장 영향을 직업군별 변화 압력과 제도적 맥락을 분석하는 프레임워크로 확장했습니다.',
        useCriteria: '고용 예측이나 확정된 미래가 아니라 직업군, 제도, 교육, 기업 준비를 위한 planning map으로 읽어야 합니다.',
        verificationNotes: [
          'officialDate 2026.06.29',
          'checkedDateKST 2026.06.30',
          '제품 업데이트가 아니라 Research / Global Affairs / AI Jobs Transition으로 분류',
        ],
        image: {
          status: 'none',
          caption: '공식 차트가 있으면 참고 가능하며, 없으면 “직업군 → 변화 압력 → 준비” 설명 이미지가 적합합니다.',
        },
      },
      {
        id: 'github-copilot-claude-opus-4-8-fast-mode',
        slug: 'github-copilot-claude-opus-4-8-fast-mode',
        title: 'GitHub Copilot Claude Opus 4.8 fast mode',
        summary: 'Claude Opus 4.8 fast mode가 Copilot에서 preview로 롤아웃되며, interactive coding과 agentic workflow의 응답 속도를 강조한다.',
        badges: ['Model Preview', 'Developer Tool', 'Copilot', 'Fast Mode', 'Agentic Workflow', 'Official Source'],
        detailHref: '/ai-updates/2026-06-29#github-copilot-claude-opus-4-8-fast-mode',
        source: {
          label: 'GitHub Changelog',
          url: 'https://github.blog/changelog/2026-06-29-claude-opus-4-8-fast-mode-is-now-in-preview-for-github-copilot/',
          description: 'GitHub 공식 changelog의 Claude Opus 4.8 fast mode preview 안내를 기준으로 확인합니다.',
        },
        whatChanged: 'GitHub Copilot이 Claude Opus 4.8 fast mode를 preview로 제공하기 시작했습니다.',
        useCriteria: 'AI 코딩 모델은 지능뿐 아니라 응답 속도, 비용, 관리자 정책까지 함께 봐야 합니다.',
        verificationNotes: [
          'officialDate 2026.06.29',
          'checkedDateKST 2026.06.30',
          'Business/Enterprise fast mode policy 기본값 off',
        ],
        image: {
          status: 'available',
          caption: 'GitHub 공식 changelog의 Copilot model picker 이미지가 있으므로 공식 화면 참고 가능으로 표시합니다.',
        },
      },
      {
        id: 'codex-permission-profiles-beta',
        slug: 'codex-permission-profiles-beta',
        title: 'Codex Permission Profiles beta',
        summary: 'Codex가 작업별 read/write/deny/network 경계를 permission profile로 제어하는 beta 흐름을 기록한다.',
        badges: ['Beta', 'Codex', 'Permission Control', 'Security', 'Least Privilege', 'Official Source'],
        detailHref: '/ai-updates/2026-06-29#codex-permission-profiles-beta',
        source: {
          label: 'OpenAI Developers Documentation — Codex CLI',
          url: 'https://developers.openai.com/codex/cli',
          description: 'OpenAI Developer Community와 공식 개발자 문서의 Permission Profiles 내용을 함께 확인합니다.',
        },
        whatChanged: 'Codex가 작업별 권한 경계를 더 세밀하게 설정할 수 있는 permission profile beta를 제공했습니다.',
        useCriteria: 'AI 코딩 도구가 로컬 파일과 명령을 다룰수록 전체 권한이 아니라 최소 권한 원칙을 적용해야 합니다.',
        verificationNotes: [
          'officialDate 2026.06.29',
          'checkedDateKST 2026.06.30',
          'Beta / Permission Control / Security로 분류',
        ],
        image: {
          status: 'none',
          caption: '공식 설정 예시가 있으면 참고 가능하며, 없으면 permission profile 흐름 설명 이미지가 적합합니다.',
        },
      },
      {
        id: 'google-cloud-gemini-enterprise-action-filtering',
        slug: 'google-cloud-gemini-enterprise-action-filtering',
        title: 'Gemini Enterprise Jira Data Center / action filtering',
        summary: 'Jira Data Center federated data store GA와 SharePoint/OneDrive action-filtering Public Preview를 구분해 기록한다.',
        badges: ['Enterprise AI', 'Data Store', 'Action Filtering', 'Public Preview', 'Product Integration', 'Official Source'],
        detailHref: '/ai-updates/2026-06-29#google-cloud-gemini-enterprise-action-filtering',
        source: {
          label: 'Google Cloud Release Notes',
          url: 'https://docs.cloud.google.com/gemini/enterprise/docs/release-notes',
          description: 'Google Cloud Gemini Enterprise 공식 release notes의 2026년 6월 29일 항목을 기준으로 확인합니다.',
        },
        whatChanged: 'Gemini Enterprise가 Jira Data Center federated data store GA와 SharePoint/OneDrive action-filtering Public Preview를 기록했습니다.',
        useCriteria: '기업 AI는 데이터 연결뿐 아니라 retrieval과 mutation이 허용되는 범위를 함께 통제해야 하며, GA와 Preview 상태를 구분해야 합니다.',
        verificationNotes: [
          'officialDate 2026.06.29',
          'checkedDateKST 2026.06.30',
          'Jira Data Center federated data store는 GA',
          'SharePoint/OneDrive action-filtering support는 Public Preview',
        ],
        image: {
          status: 'none',
          caption: '공식 문서 화면 외 별도 이미지는 필수 아니며, 필요하면 search filter / action filter 구조 다이어그램이 적합합니다.',
        },
      },
      {
        id: 'anthropic-opus-4-5-elevated-errors',
        slug: 'anthropic-opus-4-5-elevated-errors',
        title: 'Anthropic Opus 4.5 elevated errors',
        summary: 'Anthropic Status의 Opus 4.5 elevated errors 이슈는 기능 업데이트가 아니라 서비스 안정성 기록이다.',
        badges: ['Status Watch', 'Reliability', 'Incident', 'Official Source'],
        detailHref: '/ai-updates/2026-06-29#anthropic-opus-4-5-elevated-errors',
        source: {
          label: 'Anthropic Status',
          url: 'https://status.anthropic.com/',
          description: 'Anthropic 공식 상태 페이지에 기록된 Opus 4.5 elevated errors 이슈를 기준으로 확인합니다.',
        },
        whatChanged: 'Opus 4.5에서 elevated errors 이슈가 발생했고 공식 상태 페이지에 기록되었습니다.',
        useCriteria: 'AI 서비스를 실제 업무에 쓸 때는 모델 성능뿐 아니라 오류율 증가, 장애, 복구 상태도 신뢰성 판단 기준으로 봐야 합니다.',
        verificationNotes: [
          'officialDate 2026.06.29',
          'checkedDateKST 2026.06.30',
          '기능 업데이트가 아니라 Status Watch / Reliability / Incident로 분류',
        ],
        image: {
          status: 'none',
          caption: 'Anthropic Status Page 화면을 참고할 수 있습니다. 별도 설명 이미지는 필수 아닙니다.',
        },
      },
    ],
  },
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
