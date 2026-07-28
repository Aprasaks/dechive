import { redirect } from 'next/navigation';
import { getAuthorizedOwnerActor } from '@/features/admin/owner-auth';
import { createAdminDatabase } from '@/services/knowledge-drafts';
import { resolveAnalyticsDateRange } from '@/lib/analyticsDateRange';
import { getAnalyticsReport } from '@/services/analytics-report';
import { getAnalyticsIntegrationStatus } from '@/lib/analytics/integrations';
import DateRangeControls from './DateRangeControls';
import LogoutButton from './LogoutButton';
import TrackingOptOut from './TrackingOptOut';

export const metadata = { title: 'Dechive Observatory', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const TABS = [
  ['overview', 'Overview', '오늘의 변화'],
  ['acquisition', 'Acquisition', '유입과 랜딩'],
  ['learning', 'Learning Journey', '학습 흐름'],
  ['content', 'Content', '콘텐츠 성과'],
  ['search', 'Search & SEO', '검색과 SEO'],
  ['health', 'Health', '수집과 오류'],
];

function formatNumber(value) { return new Intl.NumberFormat('ko-KR').format(value ?? 0); }
function formatSeconds(value) { return value ? `${Math.round(value / 60)}분 ${value % 60}초` : '—'; }
function tabUrl(tab, range) {
  const params = new URLSearchParams({ tab });
  if (range.preset === 'custom') { params.set('startDate', range.startDate); params.set('endDate', range.endDate); }
  else params.set('preset', range.preset);
  return `/admin/analytics?${params.toString()}`;
}

function EmptyState({ children }) {
  return <p className="border border-border bg-muted/25 px-4 py-6 text-sm text-muted-foreground">{children}</p>;
}

function Section({ title, eyebrow, children }) {
  return <section className="border border-border bg-background p-5 sm:p-6"><p className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">{eyebrow}</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{title}</h2><div className="mt-5">{children}</div></section>;
}

function Stat({ label, value, note }) {
  return <div className="border border-border bg-background p-4"><p className="text-xs font-semibold text-muted-foreground">{label}</p><p className="mt-3 text-3xl font-semibold text-foreground">{formatNumber(value)}</p>{note ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p> : null}</div>;
}

function Overview({ report }) {
  return <>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Stat label="익명 방문 브라우저" value={report.overview.anonymousVisitors} note="사용자를 식별하지 않고 브라우저 단위로 집계" /><Stat label="세션" value={report.overview.sessions} note="30분 비활동 기준 세션" /><Stat label="콘텐츠 열기" value={report.overview.contentOpens} /><Stat label="완료 이벤트" value={report.overview.completions} note="Knowledge·Lecture·Practice 완료" /></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><Section title="오늘의 변화" eyebrow="Operating Signals"><ul className="space-y-3 text-sm leading-6 text-muted-foreground">{report.overview.insights.map((insight) => <li key={insight} className="border-l-2 border-accent/40 pl-3">{insight}</li>)}</ul></Section><Section title="다음 확인할 숫자" eyebrow="Decision Queue"><div className="grid gap-3 sm:grid-cols-2"><Stat label="학습 시작" value={report.overview.learningStarts} /><Stat label="학습 완료" value={report.overview.learningCompletions} /><Stat label="검색 0건" value={report.overview.zeroResultSearches} /><Stat label="오류 이벤트" value={report.overview.errors} /></div></Section></div>
  </>;
}

function Acquisition({ report }) {
  return <div className="grid gap-6 lg:grid-cols-2"><Section title="어디서 들어왔나" eyebrow="Referrers">{report.acquisition.sources.length ? <div className="divide-y divide-border">{report.acquisition.sources.map((item) => <div key={item.source} className="flex items-center justify-between gap-4 py-3 text-sm"><span className="truncate text-foreground">{item.source}</span><span className="shrink-0 text-muted-foreground">{formatNumber(item.sessions)}세션 · {formatNumber(item.visitors)}명</span></div>)}</div> : <EmptyState>수집된 유입 데이터가 없습니다.</EmptyState>}</Section><Section title="어떤 페이지로 들어왔나" eyebrow="Landing Routes">{report.acquisition.landingRoutes.length ? <div className="divide-y divide-border">{report.acquisition.landingRoutes.map((item) => <div key={item.route} className="flex items-center justify-between gap-4 py-3 text-sm"><span className="truncate text-foreground">{item.route}</span><span className="shrink-0 text-muted-foreground">{formatNumber(item.sessions)}세션</span></div>)}</div> : <EmptyState>랜딩 페이지 데이터가 없습니다.</EmptyState>}<div className="mt-6 border-t border-border pt-5"><p className="text-xs font-semibold text-accent">AI Referral</p>{report.acquisition.aiReferrals.length ? <div className="mt-2 divide-y divide-border">{report.acquisition.aiReferrals.map((item) => <div key={item.source} className="flex justify-between py-2 text-sm"><span>{item.source}</span><span className="text-muted-foreground">{formatNumber(item.sessions)}세션</span></div>)}</div> : <p className="mt-2 text-sm text-muted-foreground">확인된 AI 리퍼러가 아직 없습니다. AI 내부 프롬프트는 수집하지 않습니다.</p>}</div></Section></div>;
}

function Learning({ report }) {
  return <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><Section title="학습 퍼널" eyebrow="Learning Funnel">{report.learning.funnel.length ? <div className="space-y-3">{report.learning.funnel.map((item) => <div key={item.eventName} className="flex items-center justify-between border-b border-border pb-3 text-sm"><span>{item.label}</span><span className="text-muted-foreground">{formatNumber(item.sessions)}세션 · {formatNumber(item.visitors)}명</span></div>)}</div> : <EmptyState>Lecture·Practice 이벤트가 아직 없습니다.</EmptyState>}</Section><Section title="다음 이동" eyebrow="Journey Transitions">{report.learning.transitions.length ? <div className="divide-y divide-border">{report.learning.transitions.map((item, index) => <div key={`${item.from}-${item.to}-${index}`} className="flex items-center justify-between gap-3 py-3 text-sm"><span className="text-foreground">{item.from} <span className="px-1 text-accent">→</span> {item.to}</span><span className="shrink-0 text-muted-foreground">{formatNumber(item.sessions)}세션</span></div>)}</div> : <EmptyState>연속 학습 이동 데이터가 아직 없습니다.</EmptyState>}</Section></div>;
}

function Content({ report }) {
  return <Section title="읽히고 이어진 콘텐츠" eyebrow="Content Performance">{report.content.length ? <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-border text-xs text-muted-foreground"><tr><th className="pb-3 pr-4">경로</th><th className="pb-3 pr-4">열기</th><th className="pb-3 pr-4">90%</th><th className="pb-3 pr-4">완료</th><th className="pb-3 pr-4">활성 시간</th><th className="pb-3">내부 클릭</th></tr></thead><tbody className="divide-y divide-border">{report.content.map((item) => <tr key={`${item.contentType}-${item.contentId}-${item.route}`}><td className="max-w-[360px] truncate py-3 pr-4 text-foreground">{item.route}</td><td className="py-3 pr-4">{formatNumber(item.opens)}</td><td className="py-3 pr-4">{formatNumber(item.progress90)}</td><td className="py-3 pr-4">{formatNumber(item.completions)}</td><td className="py-3 pr-4">{formatSeconds(item.activeSeconds)}</td><td className="py-3">{formatNumber(item.internalClicks)}</td></tr>)}</tbody></table></div> : <EmptyState>콘텐츠 이벤트가 아직 없습니다.</EmptyState>}</Section>;
}

function Search({ report, integrations }) {
  return <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"><Section title="검색 상태" eyebrow="Search Intent"><div className="grid gap-3 sm:grid-cols-2"><Stat label="검색 제출" value={report.search.totalSearches} /><Stat label="결과 0건" value={report.search.zeroResultSearches} /></div><p className="mt-5 text-sm leading-6 text-muted-foreground">사이트 검색어는 운영 개선을 위해 집계합니다. Google·Naver의 개별 검색어와 외부 AI 프롬프트는 브라우저에서 직접 받을 수 없습니다.</p></Section><Section title="무엇을 찾지 못했나" eyebrow="Queries">{report.search.queries.length ? <div className="overflow-x-auto"><table className="w-full min-w-[500px] text-left text-sm"><thead className="border-b border-border text-xs text-muted-foreground"><tr><th className="pb-3">검색어</th><th className="pb-3">검색</th><th className="pb-3">0건</th><th className="pb-3">결과 클릭</th></tr></thead><tbody className="divide-y divide-border">{report.search.queries.map((item) => <tr key={item.query}><td className="max-w-[260px] truncate py-3">{item.query}</td><td className="py-3">{formatNumber(item.searches)}</td><td className="py-3">{formatNumber(item.zeroResults)}</td><td className="py-3">{formatNumber(item.resultClicks)}</td></tr>)}</tbody></table></div> : <EmptyState>검색 이벤트가 아직 없습니다.</EmptyState>}<div className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">Search Console: {integrations.searchConsole ? '연결됨' : '연결 설정 필요'}</div></Section></div>;
}

function Health({ report, integrations }) {
  return <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><Section title="수집 시스템" eyebrow="Collection Health"><div className="flex items-center gap-2 text-sm"><span className={`h-2.5 w-2.5 rounded-full ${report.health.collectionStatus === 'receiving' ? 'bg-emerald-600' : 'bg-amber-500'}`} aria-hidden="true" />{report.health.collectionStatus === 'receiving' ? '이벤트를 받고 있습니다.' : '선택한 기간에 이벤트가 없습니다.'}</div><p className="mt-4 text-sm text-muted-foreground">이벤트 {formatNumber(report.health.events)}개 · 세션 {formatNumber(report.health.activeSessions)}개</p><div className="mt-5 divide-y divide-border">{Object.entries(integrations).map(([name, connected]) => <div key={name} className="flex justify-between py-2 text-sm"><span>{name}</span><span className={connected ? 'text-emerald-700' : 'text-muted-foreground'}>{connected ? '연결됨' : '미연결'}</span></div>)}</div></Section><Section title="오류가 난 곳" eyebrow="Errors">{report.health.errors.length ? <div className="divide-y divide-border">{report.health.errors.map((item) => <div key={`${item.eventName}-${item.route}`} className="py-3 text-sm"><div className="flex justify-between gap-3"><span className="text-foreground">{item.eventName}</span><span className="text-muted-foreground">{formatNumber(item.count)}회</span></div><p className="mt-1 truncate text-xs text-muted-foreground">{item.route}</p><p className="mt-1 text-xs text-muted-foreground">마지막: {new Date(item.lastSeen).toLocaleString('ko-KR')}</p></div>)}</div> : <EmptyState>선택한 기간의 오류 이벤트가 없습니다.</EmptyState>}</Section></div>;
}

export default async function AdminAnalyticsPage({ searchParams }) {
  const { pool } = createAdminDatabase();
  try {
    if (!(await getAuthorizedOwnerActor(pool))) redirect('/admin/login');
    const params = await searchParams;
    const range = resolveAnalyticsDateRange(params);
    const tab = TABS.some(([key]) => key === params.tab) ? params.tab : 'overview';
    let report;
    let error = '';
    try { report = await getAnalyticsReport(pool, range); } catch { error = '자체 분석 데이터를 불러오지 못했습니다. 데이터베이스와 analytics_events 테이블을 확인해 주세요.'; report = { range, overview: { sessions: 0, anonymousVisitors: 0, contentOpens: 0, completions: 0, learningStarts: 0, learningCompletions: 0, zeroResultSearches: 0, errors: 0, insights: ['아직 분석 이벤트가 없습니다.'] }, acquisition: { sources: [], landingRoutes: [], aiReferrals: [] }, learning: { funnel: [], transitions: [] }, content: [], search: { totalSearches: 0, zeroResultSearches: 0, queries: [] }, health: { events: 0, activeSessions: 0, errors: [], collectionStatus: 'empty' } }; }
    const integrations = getAnalyticsIntegrationStatus();
    return <main className="min-h-dvh bg-muted/30 text-foreground"><div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12"><header className="flex flex-col gap-6 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-semibold tracking-[0.25em] text-accent uppercase">Dechive Observatory</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">관측</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">Dechive에서 유입, 탐색, 학습, 오류가 어떻게 발생하는지 관측합니다. 원본 데이터는 Dechive의 자체 이벤트 저장소를 기준으로 봅니다.</p><p className="mt-3 text-sm text-accent">조회 기간: {report.range.periodLabel}</p></div><div className="flex flex-col gap-3 lg:items-end"><div className="flex gap-2"><LogoutButton /><TrackingOptOut /></div><DateRangeControls activePreset={range.preset} startDate={range.startDate} endDate={range.endDate} /></div></header><nav className="mt-6 flex gap-2 overflow-x-auto border-b border-border pb-px" aria-label="관측 메뉴">{TABS.map(([key, label, description]) => <a key={key} href={tabUrl(key, range)} className={`shrink-0 border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${tab === key ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'}`} aria-current={tab === key ? 'page' : undefined}>{label}<span className="ml-2 hidden text-xs font-normal text-muted-foreground md:inline">{description}</span></a>)}</nav>{error ? <p className="mt-6 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</p> : null}<div className="mt-6">{tab === 'overview' ? <Overview report={report} /> : null}{tab === 'acquisition' ? <Acquisition report={report} /> : null}{tab === 'learning' ? <Learning report={report} /> : null}{tab === 'content' ? <Content report={report} /> : null}{tab === 'search' ? <Search report={report} integrations={integrations} /> : null}{tab === 'health' ? <Health report={report} integrations={integrations} /> : null}</div></div></main>;
  } finally { await pool.end(); }
}
