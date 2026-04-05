'use client';

import { useState } from 'react';
import type { Post, Category } from '@/types/archive';
import PostGrid from '@/components/archive/PostGrid';
import ChatBot from '@/components/archive/ChatBot';

// 더미 데이터 — lib/posts.ts 연동 후 교체 예정
const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', count: 6 },
  { id: 'Dev', label: 'Dev', count: 3 },
  { id: 'AI', label: 'AI', count: 2 },
  { id: 'Essay', label: 'Essay', count: 1 },
];

const POSTS: Post[] = [
  {
    slug: 'next-app-router',
    title: 'Next.js App Router 완전 정복',
    date: '2026-03-20',
    category: 'Dev',
    tags: ['Next.js', 'React', 'App Router'],
    summary: 'App Router의 서버 컴포넌트, 레이아웃 중첩, 데이터 패칭 패턴을 깊이 파헤친다.',
    description: '',
    thumbnail: '',
    status: 'published',
    lang: 'ko',
    series: '',
    readingTime: 12,
    content: '',
  },
  {
    slug: 'tailwind-v4',
    title: 'Tailwind CSS V4 마이그레이션 가이드',
    date: '2026-03-10',
    category: 'Dev',
    tags: ['Tailwind', 'CSS', 'Frontend'],
    summary: 'V3에서 V4로 넘어오면서 바뀐 설정 방식과 새 유틸리티를 정리한다.',
    description: '',
    thumbnail: '',
    status: 'published',
    lang: 'ko',
    series: '',
    readingTime: 8,
    content: '',
  },
  {
    slug: 'typescript-strict',
    title: 'TypeScript strict 모드로 타입 안전성 극대화하기',
    date: '2026-02-28',
    category: 'Dev',
    tags: ['TypeScript', 'Type Safety'],
    summary: 'any 없이 살아남는 법. 실전 프로젝트에서 발견한 strict 패턴 모음.',
    description: '',
    thumbnail: '',
    status: 'published',
    lang: 'ko',
    series: '',
    readingTime: 10,
    content: '',
  },
  {
    slug: 'rag-architecture',
    title: 'RAG 시스템 설계: Pinecone + GPT-4o',
    date: '2026-03-15',
    category: 'AI',
    tags: ['RAG', 'Pinecone', 'LLM'],
    summary: '검색 증강 생성 아키텍처를 직접 구축하며 얻은 인사이트와 트레이드오프.',
    description: '',
    thumbnail: '',
    status: 'published',
    lang: 'ko',
    series: '',
    readingTime: 15,
    content: '',
  },
  {
    slug: 'prompt-engineering',
    title: '프롬프트 엔지니어링 실전 패턴 10선',
    date: '2026-02-14',
    category: 'AI',
    tags: ['Prompt', 'GPT', 'Claude'],
    summary: '실무에서 반복적으로 쓰이는 프롬프트 패턴과 그 원리를 설명한다.',
    description: '',
    thumbnail: '',
    status: 'published',
    lang: 'ko',
    series: '',
    readingTime: 9,
    content: '',
  },
  {
    slug: 'why-i-build',
    title: '왜 나는 계속 무언가를 만드는가',
    date: '2026-01-30',
    category: 'Essay',
    tags: ['회고', '동기', '삶'],
    summary: '개발자로서의 동기, 번아웃, 그리고 다시 키보드 앞에 앉게 만드는 것들.',
    description: '',
    thumbnail: '',
    status: 'published',
    lang: 'ko',
    series: '',
    readingTime: 7,
    content: '',
  },
];

export default function ArchivePage() {
  const [highlightedSlugs, setHighlightedSlugs] = useState<string[]>([]);

  return (
    <main className="h-[calc(100vh-64px)] overflow-hidden">
      <div className="grid h-full grid-cols-10 gap-4 px-6 py-6">
        <div className="col-span-6 overflow-y-auto pr-2">
          <PostGrid
            posts={POSTS}
            categories={CATEGORIES}
            highlightedSlugs={highlightedSlugs}
          />
        </div>

        <div className="col-span-4">
          <ChatBot onHighlight={setHighlightedSlugs} />
        </div>
      </div>
    </main>
  );
}
