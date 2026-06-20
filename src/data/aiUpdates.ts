export type AiUpdateBadge =
  | 'Official Source'
  | 'Official Changelog'
  | 'Image Available'
  | 'Limited Image'
  | 'No Product Image'
  | 'Explainer';

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
  updates: AiUpdateItem[];
}

export const AI_UPDATES_MONTH = '2026.06';

export const aiUpdateDays: AiUpdateDay[] = [
  {
    date: '2026-06-20',
    updates: [
      {
        id: 'zoom-virtual-agent',
        slug: 'zoom-virtual-agent',
        title: 'Zoom Virtual Agent',
        summary: 'AI 상담원을 여러 지점과 부서에 맞게 다르게 운영할 수 있게 됨.',
        badges: ['Official Source', 'Image Available', 'Explainer'],
        detailHref: '/ai-updates/2026-06-20/zoom-virtual-agent',
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
        detailHref: '/ai-updates/2026-06-20/canvas-igniteai',
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
        detailHref: '/ai-updates/2026-06-19/claude-code',
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

export function getAiUpdateBySlug(date: string, slug: string) {
  return aiUpdateDays
    .find((day) => day.date === date)
    ?.updates.find((update) => update.slug === slug) ?? null;
}

export function getAiUpdateStaticParams() {
  return aiUpdateDays.flatMap((day) =>
    day.updates.map((update) => ({
      date: day.date,
      slug: update.slug,
    })),
  );
}
