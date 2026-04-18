export interface Category {
  id: string;
  label: string;
  count: number;
}

export interface Series {
  id: string;
  label: string;
  count: number;
}

export type PostStatus = 'draft' | 'published';
export type PostLang = 'ko' | 'en';

export interface Post {
  slug: string;
  title: string;
  date: string;           // ISO 8601 (e.g. "2026-04-05"), 정렬용
  category: string;
  tags: string[];
  summary: string;        // 카드 표시용 짧은 요약
  description: string;    // SEO / AdSense용 (150자 내외)
  thumbnail?: string;     // 파일명 (e.g. "next-app-router.webp"), 없으면 기본 이미지 사용
  status: PostStatus;
  lang: PostLang;
  series?: string;        // 연재글 묶음 이름 (없으면 빈 문자열)
  readingTime: number;    // 파싱 시 자동 계산 (분 단위)
  content: string;        // 마크다운 본문
}

export interface Log {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  description: string;
  status: PostStatus;
  content: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  summary: string;
  techStack: string[];
  status: 'in-progress' | 'completed' | 'archived';
  url?: string;
  github?: string;
  thumbnail?: string;
  date: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  relatedPostIds?: string[]; // RAG 연동 시 채워질 필드
}
