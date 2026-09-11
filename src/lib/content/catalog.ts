import type { ContentType } from '@/lib/supabase/database.types';

export type ContentSection = {
  type: ContentType;
  label: string;
  href: string;
  index: string;
  description: string;
};

export const CONTENT_SECTIONS: readonly ContentSection[] = [
  {
    type: 'knowledge',
    label: 'Knowledge',
    href: '/knowledge',
    index: '01',
    description: 'AI를 이해하고 다루기 위한 독립된 개념 지식',
  },
  {
    type: 'lecture',
    label: 'Lecture',
    href: '/lecture',
    index: '02',
    description: '필요한 지식을 학습 순서로 묶은 영상과 강의자료',
  },
  {
    type: 'practice',
    label: 'Practice',
    href: '/practice',
    index: '03',
    description: '완성한 결과물과 처음부터 끝까지의 제작 과정',
  },
  {
    type: 'ai_update',
    label: 'AI Update',
    href: '/ai-updates',
    index: '04',
    description: '날짜별로 반드시 확인해야 할 AI의 변화',
  },
  {
    type: 'book',
    label: 'Books',
    href: '/books',
    index: '05',
    description: '글과 프롬프트를 정리한 출판물과 외부 판매처',
  },
] as const;

export function getContentSection(type: ContentType) {
  const section = CONTENT_SECTIONS.find((item) => item.type === type);

  if (!section) {
    throw new Error(`Unknown content type: ${type}`);
  }

  return section;
}
