export interface Category {
  id: string;
  label: string;
  count: number;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  date: string; // ISO 8601 (e.g. "2026-03-15")
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  relatedPostIds?: string[]; // RAG 연동 시 채워질 필드
}
