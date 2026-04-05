'use client';

import { useState } from 'react';
import type { Post, Category } from '@/types/archive';
import PostGrid from '@/components/archive/PostGrid';
import ChatBot from '@/components/archive/ChatBot';

// 더미 데이터 — 실제 데이터 소스(DB/MDX)로 교체 예정
const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', count: 6 },
  { id: 'Dev', label: 'Dev', count: 3 },
  { id: 'AI', label: 'AI', count: 2 },
  { id: 'Essay', label: 'Essay', count: 1 },
];

const POSTS: Post[] = [
  {
    id: '1',
    slug: 'next-app-router',
    title: 'Next.js App Router 완전 정복',
    summary: 'App Router의 서버 컴포넌트, 레이아웃 중첩, 데이터 패칭 패턴을 깊이 파헤친다.',
    category: 'Dev',
    tags: ['Next.js', 'React', 'App Router'],
    date: '2026-03-20',
  },
  {
    id: '2',
    slug: 'tailwind-v4',
    title: 'Tailwind CSS V4 마이그레이션 가이드',
    summary: 'V3에서 V4로 넘어오면서 바뀐 설정 방식과 새 유틸리티를 정리한다.',
    category: 'Dev',
    tags: ['Tailwind', 'CSS', 'Frontend'],
    date: '2026-03-10',
  },
  {
    id: '3',
    slug: 'typescript-strict',
    title: 'TypeScript strict 모드로 타입 안전성 극대화하기',
    summary: 'any 없이 살아남는 법. 실전 프로젝트에서 발견한 strict 패턴 모음.',
    category: 'Dev',
    tags: ['TypeScript', 'Type Safety'],
    date: '2026-02-28',
  },
  {
    id: '4',
    slug: 'rag-architecture',
    title: 'RAG 시스템 설계: Pinecone + GPT-4o',
    summary: '검색 증강 생성 아키텍처를 직접 구축하며 얻은 인사이트와 트레이드오프.',
    category: 'AI',
    tags: ['RAG', 'Pinecone', 'LLM'],
    date: '2026-03-15',
  },
  {
    id: '5',
    slug: 'prompt-engineering',
    title: '프롬프트 엔지니어링 실전 패턴 10선',
    summary: '실무에서 반복적으로 쓰이는 프롬프트 패턴과 그 원리를 설명한다.',
    category: 'AI',
    tags: ['Prompt', 'GPT', 'Claude'],
    date: '2026-02-14',
  },
  {
    id: '6',
    slug: 'why-i-build',
    title: '왜 나는 계속 무언가를 만드는가',
    summary: '개발자로서의 동기, 번아웃, 그리고 다시 키보드 앞에 앉게 만드는 것들.',
    category: 'Essay',
    tags: ['회고', '동기', '삶'],
    date: '2026-01-30',
  },
];

export default function ArchivePage() {
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);

  return (
    <main className="h-[calc(100vh-64px)] overflow-hidden">
      <div className="grid h-full grid-cols-10 gap-4 px-6 py-6">
        {/* 왼쪽: 포스트 목록 (독립 스크롤) */}
        <div className="col-span-6 overflow-y-auto pr-2">
          <PostGrid
            posts={POSTS}
            categories={CATEGORIES}
            highlightedIds={highlightedIds}
          />
        </div>

        {/* 오른쪽: 챗봇 (고정) */}
        <div className="col-span-4">
          <ChatBot onHighlight={setHighlightedIds} />
        </div>
      </div>
    </main>
  );
}
