'use client';

import { useState, useEffect } from 'react';
import type { Post, Category, PostLang, Series } from '@/types/archive';
import PostGrid from './PostGrid';
import ChatBot from './ChatBot';

interface ArchiveClientProps {
  koPosts: Post[];
  enPosts: Post[];
  koCategories: Category[];
  enCategories: Category[];
  koSeries: Series[];
  enSeries: Series[];
}

export default function ArchiveClient({
  koPosts,
  enPosts,
  koCategories,
  enCategories,
  koSeries,
  enSeries,
}: ArchiveClientProps) {
  const [highlightedSlugs, setHighlightedSlugs] = useState<string[]>([]);
  const [lang, setLang] = useState<PostLang>('ko');
  const [mobileChat, setMobileChat] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const posts = lang === 'ko' ? koPosts : enPosts;
  const categories = lang === 'ko' ? koCategories : enCategories;
  const series = lang === 'ko' ? koSeries : enSeries;

  const panelClass = 'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden';
  const layoutHeight = 'calc(100dvh - 4rem - 3rem)';

  return (
    <>
      {/* ─── 데스크탑 / 태블릿 ─── */}
      <div
        className="hidden md:flex gap-3 px-6 py-6"
        style={{ height: layoutHeight }}
      >
        <div className={`flex-1 min-w-0 flex flex-col ${panelClass}`}>
          <PostGrid
            posts={posts}
            categories={categories}
            series={series}
            highlightedSlugs={highlightedSlugs}
            lang={lang}
            onLangChange={setLang}
            initialCount={9}
          />
        </div>
        <div className={`shrink-0 w-96 ${panelClass}`}>
          <ChatBot onHighlight={setHighlightedSlugs} lang={lang} />
        </div>
      </div>

      {/* ─── 모바일 ─── */}
      <div
        className="md:hidden flex flex-col px-3 py-3"
        style={{ height: layoutHeight }}
      >
        <div className={`flex-1 min-h-0 flex flex-col ${panelClass}`}>
          <PostGrid
            posts={posts}
            categories={categories}
            series={series}
            highlightedSlugs={highlightedSlugs}
            lang={lang}
            onLangChange={setLang}
            initialCount={8}
          />
        </div>
      </div>

      {/* ─── 모바일: 바텀시트 트리거 ─── */}
      {!mobileChat && (
        <button
          onClick={() => setMobileChat(true)}
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full bg-zinc-900 border border-white/20 px-5 py-3 text-sm font-medium text-zinc-100 shadow-xl hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <img src="/images/emoticon-small.png" alt="해고리" className="w-6 h-6 object-contain" />
          <span>사서에게 도움요청하기</span>
        </button>
      )}

      {/* ─── 모바일: 바텀시트 ─── */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          mobileChat ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        {/* 오버레이 */}
        <div
          onClick={() => setMobileChat(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            mobileChat ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* 시트 */}
        <div
          className={`absolute bottom-0 inset-x-0 transition-transform duration-300 ${
            mobileChat ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className={`h-[75svh] mx-3 mb-3 ${panelClass}`}>
            <ChatBot onHighlight={setHighlightedSlugs} lang={lang} />
          </div>
        </div>
      </div>
    </>
  );
}
