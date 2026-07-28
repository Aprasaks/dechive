'use client';

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getKnowledgeCategoryLabel,
  KNOWLEDGE_CATEGORIES,
  type KnowledgeCategory,
} from './categories';
import { formatKnowledgeDate } from './date-format';
import { mergeKnowledgeItems, normalizeKnowledgeSearchQuery } from './search';
import type { PublishedKnowledgeFeedItem } from '@/services/published-knowledge';
import styles from '@/app/knowledge/knowledge.module.css';
import { useAnalytics } from '@/components/analytics/AnalyticsProvider';

type Props = {
  initialItems: PublishedKnowledgeFeedItem[];
  initialNextCursor: string | null;
  initialQuery: string;
  initialCategory: KnowledgeCategory;
  publishedCount: number;
};

type LoadStatus = 'idle' | 'loading' | 'error' | 'complete';

function resultUrl(query: string, category: KnowledgeCategory, cursor?: string | null): string {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (category !== 'all') params.set('category', category);
  if (cursor) params.set('cursor', cursor);
  const queryString = params.toString();
  return `/api/knowledge${queryString ? `?${queryString}` : ''}`;
}

export default function KnowledgeListClient({ initialItems, initialNextCursor, initialQuery, initialCategory, publishedCount }: Props) {
  const [items, setItems] = useState(initialItems);
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [status, setStatus] = useState<LoadStatus>(initialNextCursor ? 'idle' : 'complete');
  const [errorMessage, setErrorMessage] = useState('');
  const { consent, track } = useAnalytics();
  const requestRef = useRef<AbortController | null>(null);
  const requestInFlight = useRef(false);
  const generationRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const initialSearchTrackedRef = useRef(false);

  useEffect(() => {
    if (!initialQuery || consent !== 'granted' || initialSearchTrackedRef.current) return;
    initialSearchTrackedRef.current = true;
    track('search_submit', { route: '/knowledge', metadata: { query: initialQuery, resultCount: initialItems.length, searchScope: 'knowledge' } });
    if (!initialItems.length) track('search_zero_result', { route: '/knowledge', metadata: { query: initialQuery, resultCount: 0, searchScope: 'knowledge' } });
  }, [consent, initialItems.length, initialQuery, track]);

  const loadPage = useCallback(async (requestedQuery: string, cursor: string | null, replace: boolean) => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    const generation = generationRef.current;
    const controller = new AbortController();
    requestRef.current = controller;
    setStatus('loading');
    setErrorMessage('');
    try {
      const response = await fetch(resultUrl(requestedQuery, initialCategory, cursor), {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      const payload: unknown = await response.json();
      if (!response.ok) throw new Error('knowledge_list_request_failed');
      if (generation !== generationRef.current) return;
      if (!payload || typeof payload !== 'object') throw new Error('knowledge_list_response_invalid');
      const data = payload as { items?: PublishedKnowledgeFeedItem[]; nextCursor?: string | null };
      if (!Array.isArray(data.items) || typeof data.nextCursor !== 'string' && data.nextCursor !== null) {
        throw new Error('knowledge_list_response_invalid');
      }
      setItems((current) => mergeKnowledgeItems(current, data.items ?? [], replace));
      setNextCursor(data.nextCursor ?? null);
      setStatus(data.nextCursor ? 'idle' : 'complete');
      if (requestedQuery && cursor === null) {
        track('search_submit', { route: '/knowledge', metadata: { query: requestedQuery, resultCount: data.items.length, searchScope: 'knowledge' } });
        if (data.items.length === 0) track('search_zero_result', { route: '/knowledge', metadata: { query: requestedQuery, resultCount: 0, searchScope: 'knowledge' } });
      }
    } catch (error) {
      if (controller.signal.aborted || generation !== generationRef.current) return;
      setStatus('error');
      track('api_error', { route: '/knowledge', metadata: { code: 'knowledge_list_request_failed' } });
      setErrorMessage(error instanceof Error && error.message === 'knowledge_list_response_invalid'
        ? '지식 목록 응답을 확인하지 못했습니다.'
        : '지식 목록을 불러오지 못했습니다.');
    } finally {
      if (generation === generationRef.current) {
        requestInFlight.current = false;
        requestRef.current = null;
      }
    }
  }, [initialCategory, track]);

  useEffect(() => {
    const normalized = normalizeKnowledgeSearchQuery(queryInput);
    if (normalized === query) return;
    const timer = window.setTimeout(() => {
      generationRef.current += 1;
      requestRef.current?.abort();
      requestInFlight.current = false;
      setQuery(normalized);
      setItems([]);
      setNextCursor(null);
      setStatus('loading');
      const url = new URL(window.location.href);
      if (normalized) url.searchParams.set('q', normalized);
      else url.searchParams.delete('q');
      if (initialCategory !== 'all') url.searchParams.set('category', initialCategory);
      else url.searchParams.delete('category');
      url.searchParams.delete('cursor');
      window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
      void loadPage(normalized, null, true);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [initialCategory, loadPage, query, queryInput]);

  useEffect(() => {
    const onPopState = () => {
      const nextQuery = normalizeKnowledgeSearchQuery(new URL(window.location.href).searchParams.get('q'));
      if (nextQuery === queryInput) return;
      setQueryInput(nextQuery);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [queryInput]);

  const loadMore = useCallback(() => {
    if (!nextCursor || status === 'loading' || status === 'complete' || status === 'error') return;
    void loadPage(query, nextCursor, false);
  }, [loadPage, nextCursor, query, status]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadMore();
    }, { rootMargin: '480px 0px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const retry = () => {
    void loadPage(query, nextCursor, nextCursor === null);
  };
  const emptyMessage = query
    ? `‘${query}’에 해당하는 지식을 찾지 못했습니다.`
    : '아직 정리된 지식이 없습니다.';
  const categoryHref = (category: KnowledgeCategory) => {
    const params = new URLSearchParams();
    if (queryInput) params.set('q', queryInput);
    if (category !== 'all') params.set('category', category);
    const search = params.toString();
    return `/knowledge${search ? `?${search}` : ''}`;
  };

  return (
    <section className={styles.listSection} aria-label="Knowledge 목록">
      <form className={styles.searchForm} action="/knowledge" method="get" role="search">
        <label className="sr-only" htmlFor="knowledge-search">Knowledge 검색</label>
        <span className={styles.searchIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 4.5 4.5" />
          </svg>
        </span>
        <input
          id="knowledge-search"
          name="q"
          type="search"
          value={queryInput}
          onChange={(event) => setQueryInput(event.target.value)}
          placeholder="제목과 요약, 태그에서 찾을 수 있어요."
          autoComplete="off"
        />
        {initialCategory !== 'all' ? <input type="hidden" name="category" value={initialCategory} /> : null}
        {queryInput ? (
          <button
            className={styles.clearSearch}
            type="button"
            aria-label="검색어 지우기"
            onClick={() => setQueryInput('')}
          >
            <span aria-hidden="true">×</span>
          </button>
        ) : null}
      </form>

      <div className={styles.listToolbar}>
        <nav className={styles.categories} aria-label="Knowledge 분류">
          {KNOWLEDGE_CATEGORIES.map((category) => (
            <Link
              key={category.value}
              className={styles.categoryTab}
              data-active={initialCategory === category.value ? 'true' : undefined}
              href={categoryHref(category.value)}
              aria-current={initialCategory === category.value ? 'page' : undefined}
            >
              {category.label}
            </Link>
          ))}
        </nav>
        <p className={styles.resultCount}>
          총 {publishedCount}개의 개념 · 계속 확장 중
        </p>
      </div>

      {items.length ? (
        <ol className={styles.list}>
          {items.map((item, index) => (
            <li key={item.id} className={styles.item}>
              <Link className={styles.itemLink} href={`/knowledge/${item.slug}`} onClick={() => track('search_result_click', { route: '/knowledge', contentType: 'knowledge', contentId: item.id, metadata: { query, targetRoute: `/knowledge/${item.slug}`, position: index + 1 } })}>
                <span className={styles.itemIndex} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.itemMedia}>
                  {item.hero ? (
                    <img
                      src={item.hero.publicUrl}
                      alt={item.hero.alt}
                      width={item.hero.width ?? 240}
                      height={item.hero.height ?? 145}
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 48rem) 100vw, 240px"
                    />
                  ) : (
                    <span className={styles.mediaFallback} aria-hidden="true" />
                  )}
                </span>
                <span className={styles.itemContent}>
                  <span className={styles.itemCategory}>{getKnowledgeCategoryLabel(item.category)}</span>
                  <span className={styles.itemTitle}>{item.title}</span>
                  <span className={styles.itemSummary}>{item.summary}</span>
                  <span className={styles.meta}>
                    <time dateTime={item.updatedAt}>{formatKnowledgeDate(item.updatedAt)} 업데이트</time>
                  </span>
                  {item.tags.length ? (
                    <span className={styles.tags} aria-label="태그">
                      {item.tags.map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}
                    </span>
                  ) : null}
                </span>
                <span className={styles.arrow} aria-hidden="true">›</span>
              </Link>
            </li>
          ))}
        </ol>
      ) : status !== 'loading' && status !== 'error' ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : null}

      <div ref={sentinelRef} className={styles.listStatus} aria-live="polite">
        {status === 'loading' ? <p>불러오는 중…</p> : null}
        {status === 'error' ? (
          <div className={styles.loadError}>
            <p>{errorMessage}</p>
            <button type="button" onClick={retry}>다시 불러오기</button>
          </div>
        ) : null}
        {status === 'complete' && items.length ? <p>모든 지식을 불러왔어요.</p> : null}
      </div>
    </section>
  );
}
