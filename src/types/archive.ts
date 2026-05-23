export interface Category {
  id: string;
  label: string;
  count: number;
}

export type PostStatus = 'draft' | 'published';
export type PostLang = 'ko' | 'en';
export type PostType = 'archive' | 'deepdive';

export interface Post {
  slug: string;
  title: string;
  date: string;           // ISO 8601 (e.g. "2026-04-05"), 정렬용
  category: string;
  tags: string[];
  description: string;    // SEO / AdSense용 (150자 내외)
  seoTitle?: string;      // 검색용 <title> (없으면 title 사용)
  coverImage?: string;    // Deep Dive 커버 이미지 경로
  concepts: string[];
  type: PostType;
  status: PostStatus;
  lang: PostLang;
  readingTime: number;    // 파싱 시 자동 계산 (분 단위)
  content: string;        // 마크다운 본문
}
