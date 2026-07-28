import type { Pool } from 'pg';
export type AnalyticsDateRange = {
  preset: string;
  periodLabel: string;
  startDate: string;
  endDate: string;
};

type CountRow = { count: string };
type NamedCountRow = { name: string; count: string };

export type AnalyticsReport = {
  range: AnalyticsDateRange;
  overview: {
    sessions: number;
    anonymousVisitors: number;
    contentOpens: number;
    completions: number;
    learningStarts: number;
    learningCompletions: number;
    zeroResultSearches: number;
    errors: number;
    insights: string[];
  };
  acquisition: {
    sources: Array<{ source: string; sessions: number; visitors: number }>;
    landingRoutes: Array<{ route: string; sessions: number; visitors: number }>;
    aiReferrals: Array<{ source: string; sessions: number; visitors: number }>;
  };
  learning: {
    funnel: Array<{ eventName: string; label: string; sessions: number; visitors: number }>;
    transitions: Array<{ from: string; to: string; sessions: number }>;
  };
  content: Array<{
    contentType: string;
    contentId: string;
    route: string;
    opens: number;
    visitors: number;
    progress90: number;
    completions: number;
    internalClicks: number;
    activeSeconds: number;
  }>;
  search: {
    totalSearches: number;
    zeroResultSearches: number;
    queries: Array<{ query: string; searches: number; zeroResults: number; resultClicks: number }>;
  };
  health: {
    events: number;
    activeSessions: number;
    errors: Array<{ eventName: string; route: string; count: number; lastSeen: string }>;
    collectionStatus: 'receiving' | 'empty';
  };
};

function number(value: string | number | null | undefined): number {
  return Number(value ?? 0);
}

function percent(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

function dateOnly(value: string, offsetDays = 0): string {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function resolveDateBounds(range: AnalyticsDateRange): { start: string; end: string } {
  if (/^\d{4}-\d{2}-\d{2}$/.test(range.startDate) && /^\d{4}-\d{2}-\d{2}$/.test(range.endDate)) {
    return { start: range.startDate, end: dateOnly(range.endDate, 1) };
  }
  const today = new Date().toISOString().slice(0, 10);
  if (range.preset === 'yesterday') return { start: dateOnly(today, -1), end: today };
  if (range.preset === '7days') return { start: dateOnly(today, -6), end: dateOnly(today, 1) };
  if (range.preset === '30days') return { start: dateOnly(today, -29), end: dateOnly(today, 1) };
  return { start: today, end: dateOnly(today, 1) };
}

function sourceLabel(value: string | null): string {
  return value || '직접 방문 또는 미확인';
}

const AI_SOURCES = new Set(['chatgpt', 'claude', 'perplexity', 'copilot_or_bing', 'google_ai_or_search', 'gemini']);

export async function getAnalyticsReport(pool: Pool, range: AnalyticsDateRange): Promise<AnalyticsReport> {
  const bounds = resolveDateBounds(range);
  const params = [bounds.start, bounds.end];
  const eventWhere = `occurred_at >= $1::date AND occurred_at < $2::date`;
  const sessionWhere = `started_at >= $1::date AND started_at < $2::date`;

  const [overviewRows, sourceRows, landingRows, aiRows, funnelRows, transitionRows, contentRows, searchRows, healthRows, sessionCountRows, visitorCountRows] = await Promise.all([
    pool.query<NamedCountRow>(`SELECT event_name AS name, count(*)::text AS count FROM analytics_events WHERE ${eventWhere} GROUP BY event_name`, params),
    pool.query<{ source: string | null; sessions: string; visitors: string }>(`SELECT referrer_source AS source, count(*)::text AS sessions, count(DISTINCT anonymous_id)::text AS visitors FROM analytics_sessions WHERE ${sessionWhere} GROUP BY referrer_source ORDER BY count(*) DESC LIMIT 30`, params),
    pool.query<{ route: string; sessions: string; visitors: string }>(`SELECT landing_route AS route, count(*)::text AS sessions, count(DISTINCT anonymous_id)::text AS visitors FROM analytics_sessions WHERE ${sessionWhere} GROUP BY landing_route ORDER BY count(*) DESC LIMIT 30`, params),
    pool.query<{ source: string | null; sessions: string; visitors: string }>(`SELECT referrer_source AS source, count(*)::text AS sessions, count(DISTINCT anonymous_id)::text AS visitors FROM analytics_sessions WHERE ${sessionWhere} AND referrer_source = ANY($3::text[]) GROUP BY referrer_source ORDER BY count(*) DESC`, [bounds.start, bounds.end, [...AI_SOURCES]]),
    pool.query<{ event_name: string; label: string; sessions: string; visitors: string }>(`SELECT event_name, CASE event_name WHEN 'content_open' THEN '콘텐츠 열기' WHEN 'content_complete' THEN '콘텐츠 완독' WHEN 'lecture_start' THEN 'Lecture 시작' WHEN 'lecture_complete' THEN 'Lecture 완료' WHEN 'practice_start' THEN 'Practice 시작' WHEN 'practice_complete' THEN 'Practice 완료' WHEN 'book_preview_open' THEN '책 미리보기' WHEN 'book_purchase_click' THEN '책 구매 클릭' ELSE event_name END AS label, count(DISTINCT session_id)::text AS sessions, count(DISTINCT anonymous_id)::text AS visitors FROM analytics_events WHERE ${eventWhere} AND event_name IN ('content_open','content_complete','lecture_start','lecture_complete','practice_start','practice_complete','book_preview_open','book_purchase_click') GROUP BY event_name ORDER BY array_position(ARRAY['content_open','content_complete','lecture_start','lecture_complete','practice_start','practice_complete','book_preview_open','book_purchase_click']::text[], event_name)`, params),
    pool.query<{ from_event: string; to_event: string; sessions: string }>(`WITH ordered AS (SELECT session_id, event_name, occurred_at, lead(event_name) OVER (PARTITION BY session_id ORDER BY occurred_at) AS next_event FROM analytics_events WHERE ${eventWhere}) SELECT event_name AS from_event, next_event AS to_event, count(DISTINCT session_id)::text AS sessions FROM ordered WHERE next_event IS NOT NULL AND event_name IN ('content_complete','lecture_complete','practice_complete') GROUP BY event_name,next_event ORDER BY count(DISTINCT session_id) DESC LIMIT 30`, params),
    pool.query<{ content_type: string | null; content_id: string | null; route: string; opens: string; visitors: string; progress90: string; completions: string; internal_clicks: string; active_seconds: string | null }>(`SELECT e.content_type, e.content_id, e.route, count(*) FILTER (WHERE e.event_name = 'content_open')::text AS opens, count(DISTINCT e.anonymous_id) FILTER (WHERE e.event_name = 'content_open')::text AS visitors, count(*) FILTER (WHERE e.event_name = 'content_progress' AND e.metadata->>'progress' ~ '^[0-9]+$' AND (e.metadata->>'progress')::int >= 90)::text AS "progress90", count(*) FILTER (WHERE e.event_name = 'content_complete')::text AS completions, (SELECT count(*)::text FROM analytics_events internal WHERE internal.occurred_at >= $1::date AND internal.occurred_at < $2::date AND internal.event_name = 'internal_link_click' AND internal.route = e.route) AS internal_clicks, coalesce(avg(CASE WHEN e.metadata->>'activeSeconds' ~ '^[0-9]+(\\.[0-9]+)?$' THEN (e.metadata->>'activeSeconds')::numeric END) FILTER (WHERE e.event_name = 'content_progress'), 0)::text AS active_seconds FROM analytics_events e WHERE ${eventWhere} AND e.content_type IS NOT NULL GROUP BY e.content_type, e.content_id, e.route ORDER BY count(*) FILTER (WHERE e.event_name = 'content_open') DESC LIMIT 100`, params),
    pool.query<{ query: string; searches: string; zero_results: string; result_clicks: string }>(`SELECT coalesce(metadata->>'query','(검색어 없음)') AS query, count(*) FILTER (WHERE event_name = 'search_submit')::text AS searches, count(*) FILTER (WHERE event_name = 'search_zero_result')::text AS zero_results, count(*) FILTER (WHERE event_name = 'search_result_click')::text AS result_clicks FROM analytics_events WHERE ${eventWhere} AND event_name IN ('search_submit','search_zero_result','search_result_click') GROUP BY coalesce(metadata->>'query','(검색어 없음)') ORDER BY count(*) DESC LIMIT 100`, params),
    pool.query<{ event_name: string; route: string; count: string; last_seen: string }>(`SELECT event_name, route, count(*)::text AS count, max(occurred_at)::text AS last_seen FROM analytics_events WHERE ${eventWhere} AND event_name IN ('error_404','error_500','client_error','api_error') GROUP BY event_name, route ORDER BY count(*) DESC LIMIT 50`, params),
    pool.query<CountRow>(`SELECT count(*)::text AS count FROM analytics_sessions WHERE ${sessionWhere}`, params),
    pool.query<CountRow>(`SELECT count(DISTINCT anonymous_id)::text AS count FROM analytics_sessions WHERE ${sessionWhere}`, params),
  ]);

  const counts = new Map(overviewRows.rows.map((row) => [row.name, number(row.count)]));
  const sessions = number(sessionCountRows.rows[0]?.count);
  const anonymousVisitors = number(visitorCountRows.rows[0]?.count);
  const completions = counts.get('content_complete') ?? 0;
  const learningStarts = (counts.get('lecture_start') ?? 0) + (counts.get('practice_start') ?? 0);
  const learningCompletions = (counts.get('lecture_complete') ?? 0) + (counts.get('practice_complete') ?? 0);
  const errors = (counts.get('error_404') ?? 0) + (counts.get('error_500') ?? 0) + (counts.get('client_error') ?? 0) + (counts.get('api_error') ?? 0);
  const insights = [
    sessions ? `익명 세션 ${sessions.toLocaleString('ko-KR')}회 중 콘텐츠 열기는 ${counts.get('content_open')?.toLocaleString('ko-KR') ?? 0}회입니다.` : '선택한 기간에 수집된 세션이 없습니다.',
    counts.get('search_zero_result') ? `검색 결과가 없는 검색이 ${counts.get('search_zero_result')?.toLocaleString('ko-KR')}회 있어 새 지식 후보를 확인해야 합니다.` : '검색 결과가 없는 검색은 아직 관측되지 않았습니다.',
    learningStarts ? `학습 시작 대비 완료 이벤트 비율은 ${percent(learningCompletions, learningStarts)}%입니다.` : '아직 Lecture·Practice 학습 시작 데이터가 없습니다.',
  ];

  return {
    range,
    overview: { sessions, anonymousVisitors, contentOpens: counts.get('content_open') ?? 0, completions, learningStarts, learningCompletions, zeroResultSearches: counts.get('search_zero_result') ?? 0, errors, insights },
    acquisition: {
      sources: sourceRows.rows.map((row) => ({ source: sourceLabel(row.source), sessions: number(row.sessions), visitors: number(row.visitors) })),
      landingRoutes: landingRows.rows.map((row) => ({ route: row.route, sessions: number(row.sessions), visitors: number(row.visitors) })),
      aiReferrals: aiRows.rows.map((row) => ({ source: sourceLabel(row.source), sessions: number(row.sessions), visitors: number(row.visitors) })),
    },
    learning: {
      funnel: funnelRows.rows.map((row) => ({ eventName: row.event_name, label: row.label, sessions: number(row.sessions), visitors: number(row.visitors) })),
      transitions: transitionRows.rows.map((row) => ({ from: row.from_event, to: row.to_event, sessions: number(row.sessions) })),
    },
    content: contentRows.rows.map((row) => ({ contentType: row.content_type ?? 'unknown', contentId: row.content_id ?? '', route: row.route, opens: number(row.opens), visitors: number(row.visitors), progress90: number(row.progress90), completions: number(row.completions), internalClicks: number(row.internal_clicks), activeSeconds: Math.round(number(row.active_seconds)) })),
    search: { totalSearches: counts.get('search_submit') ?? 0, zeroResultSearches: counts.get('search_zero_result') ?? 0, queries: searchRows.rows.map((row) => ({ query: row.query, searches: number(row.searches), zeroResults: number(row.zero_results), resultClicks: number(row.result_clicks) })) },
    health: { events: counts.size ? [...counts.values()].reduce((total, value) => total + value, 0) : 0, activeSessions: sessions, errors: healthRows.rows.map((row) => ({ eventName: row.event_name, route: row.route, count: number(row.count), lastSeen: row.last_seen })), collectionStatus: counts.size ? 'receiving' : 'empty' },
  };
}
