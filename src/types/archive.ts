export interface Category {
  id: string;
  label: string;
  count: number;
}

export interface Subject {
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
  description: string;    // SEO / AdSense용 (150자 내외)
  thumbnail?: string;     // 파일명 (e.g. "next-app-router.webp"), 없으면 기본 이미지 사용
  status: PostStatus;
  lang: PostLang;
  subject?: string;       // Archive 주제 묶음 이름 (없으면 빈 문자열)
  readingTime: number;    // 파싱 시 자동 계산 (분 단위)
  content: string;        // 마크다운 본문
}

export interface RelatedPost {
  slug: string;
  title: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  relatedPosts?: RelatedPost[];
}
