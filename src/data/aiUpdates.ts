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
  | 'Explanation Image Recommended';

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
  sourceType: string;
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
