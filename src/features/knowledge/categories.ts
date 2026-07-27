export const KNOWLEDGE_CATEGORIES = [
  { value: 'all', label: '전체', tags: [] },
  {
    value: 'foundations',
    label: '기초 원리',
    tags: ['인공지능', 'ai', '머신러닝', '딥러닝', '신경망', '알고리즘', '확률', '통계', '예측'],
  },
  {
    value: 'use-and-verify',
    label: '사용과 검증',
    tags: ['프롬프트', '컨텍스트', '평가', '검증', '입력 설계', '대화 설계'],
  },
  {
    value: 'systems',
    label: '시스템 구축',
    tags: ['rag', '에이전트', '시스템', '파이프라인', '데이터', '검색'],
  },
  {
    value: 'responsibility',
    label: '책임과 운영',
    tags: ['안전', '보안', '윤리', '거버넌스', '운영', '책임'],
  },
] as const;

export type KnowledgeCategory = (typeof KNOWLEDGE_CATEGORIES)[number]['value'];

const categoryValues = new Set<string>(KNOWLEDGE_CATEGORIES.map((category) => category.value));

export function normalizeKnowledgeCategory(value: string | null | undefined): KnowledgeCategory {
  return value && categoryValues.has(value) ? (value as KnowledgeCategory) : 'all';
}

export function getKnowledgeCategoryLabel(category: KnowledgeCategory): string {
  return KNOWLEDGE_CATEGORIES.find((item) => item.value === category)?.label ?? '전체';
}

export function classifyKnowledgeTags(tags: string[]): KnowledgeCategory {
  const normalized = new Set(tags.map((tag) => tag.trim().toLowerCase()));
  const match = KNOWLEDGE_CATEGORIES.slice(1).find((category) =>
    category.tags.some((tag) => normalized.has(tag.toLowerCase())),
  );
  return match?.value ?? 'all';
}
