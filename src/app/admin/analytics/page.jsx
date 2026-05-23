import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/adminAuth';
import { resolveAnalyticsDateRange } from '@/lib/analyticsDateRange';
import { getAnalytics } from '@/lib/ga4Client';
import DateRangeControls from './DateRangeControls';
import LogoutButton from './LogoutButton';

export const metadata = {
  title: 'Dechive Analytics',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const SUMMARY_ITEMS = [
  {
    key: 'activeUsers',
    label: '방문자',
    metric: 'activeUsers',
    description: '중복 페이지 조회를 뺀 고유 방문자에 가까운 값입니다.',
    read: '몇 명이 왔나',
  },
  {
    key: 'screenPageViews',
    label: '열린 페이지',
    metric: 'screenPageViews',
    description: '페이지가 열린 총 횟수입니다. 같은 사람이 여러 글을 보면 계속 늘어납니다.',
    read: '얼마나 읽혔나',
  },
  {
    key: 'sessions',
    label: '방문 횟수',
    metric: 'sessions',
    description: '한 번 들어와 둘러본 흐름을 한 묶음으로 본 값입니다.',
    read: '몇 번 찾아왔나',
  },
  {
    key: 'eventCount',
    label: '행동 신호',
    metric: 'eventCount',
    description: '페이지 보기, 세션 시작, 스크롤, 클릭 같은 GA4 이벤트의 합계입니다.',
    read: '무엇을 했나',
  },
];

function formatNumber(value) {
  return new Intl.NumberFormat('ko-KR').format(value ?? 0);
}

function EmptyState({ children }) {
  return (
    <p className="border border-white/10 bg-black/20 px-4 py-6 text-sm text-zinc-500">
      {children}
    </p>
  );
}

function Section({ title, eyebrow, children }) {
  return (
    <section className="border border-white/10 bg-black/25 p-5 sm:p-6">
      {eyebrow ? (
        <p className="text-[11px] font-semibold tracking-[0.22em] text-amber-200/45 uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 font-[family-name:var(--font-header-serif)] text-xl font-medium tracking-[0.04em] text-zinc-100">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function maxDailyValue(daily) {
  return Math.max(...daily.map((item) => item.screenPageViews), 1);
}

export default async function AdminAnalyticsPage({ searchParams }) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!isValidAdminSession(session)) {
    redirect('/admin/login');
  }

  const params = await searchParams;
  const dateRange = resolveAnalyticsDateRange(params);

  let analytics;
  let error = '';

  try {
    analytics = await getAnalytics(dateRange);
  } catch {
    error = 'GA4 데이터를 불러오지 못했습니다. 환경변수와 서비스 계정 권한을 확인해 주세요.';
    analytics = {
      range: dateRange,
      summary: { activeUsers: 0, sessions: 0, screenPageViews: 0, eventCount: 0 },
      sources: [],
      pages: [],
      events: [],
      daily: [],
      insight: `${dateRange.periodLabel}에는 아직 해석할 방문 데이터가 없습니다.`,
    };
  }

  const largestDailyViews = maxDailyValue(analytics.daily);

  return (
    <main className="min-h-dvh bg-stone-950 text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1fr_420px] lg:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.34em] text-amber-200/55 uppercase">
              Private Observatory
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-header-serif)] text-4xl font-medium tracking-[0.04em] text-zinc-100 sm:text-5xl">
              Dechive Analytics
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-500">
              GA4를 직접 열지 않고 선택한 기간의 방문 흔적을 확인합니다. 숫자는 판단의
              시작점이고, 해석은 Dechive가 읽힌 방향을 보기 위한 보조 신호입니다.
            </p>
            <p className="mt-4 text-sm text-amber-100/70">
              현재 조회 기간: {analytics.range.periodLabel}
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-end">
              <LogoutButton />
            </div>
            <DateRangeControls
              activePreset={dateRange.preset}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
          </div>
        </header>

        {error ? (
          <div className="mt-8 border border-amber-500/20 bg-amber-950/10 px-5 py-4 text-sm text-amber-100/85">
            {error}
          </div>
        ) : null}

        <section className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {SUMMARY_ITEMS.map((item) => (
            <div key={item.key} className="border border-white/10 bg-black/30 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-zinc-500 uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[11px] tracking-[0.14em] text-amber-200/45 uppercase">
                    {item.metric}
                  </p>
                </div>
                <span className="border border-white/10 px-2 py-1 text-[11px] text-zinc-500">
                  {item.read}
                </span>
              </div>
              <p className="mt-5 text-4xl font-semibold text-zinc-100">
                {formatNumber(analytics.summary[item.key])}
              </p>
              <p className="mt-4 min-h-12 text-xs leading-5 text-zinc-500">{item.description}</p>
            </div>
          ))}
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Section title="기간별 흐름" eyebrow="Daily Trace">
            {analytics.daily.length > 0 ? (
              <div className="space-y-3">
                {analytics.daily.map((day) => (
                  <div key={day.date} className="grid gap-2 sm:grid-cols-[110px_1fr_220px] sm:items-center">
                    <p className="text-sm text-zinc-400">{day.date}</p>
                    <div className="h-2 bg-white/5">
                      <div
                        className="h-full bg-amber-400/55"
                        style={{
                          width: `${Math.max((day.screenPageViews / largestDailyViews) * 100, 3)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 sm:text-right">
                      방문자 {formatNumber(day.activeUsers)} · 페이지 {formatNumber(day.screenPageViews)} · 세션{' '}
                      {formatNumber(day.sessions)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState>선택한 기간의 날짜별 흐름이 아직 없습니다.</EmptyState>
            )}
          </Section>

          <Section title="짧은 해석" eyebrow="Reading">
            <p className="border-l border-amber-400/35 bg-amber-950/10 px-5 py-4 text-sm leading-7 text-amber-50/85">
              {analytics.insight}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <p className="border border-white/10 bg-black/20 p-4 text-xs leading-6 text-zinc-500">
                방문자가 있는데 스크롤이 없다면 페이지는 열렸지만 깊게 읽힌 신호는 약하게
                봅니다.
              </p>
              <p className="border border-white/10 bg-black/20 p-4 text-xs leading-6 text-zinc-500">
                referral 유입은 외부 플랫폼에서 Dechive로 넘어온 흔적입니다.
              </p>
            </div>
          </Section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Section title="어디서 들어왔는지" eyebrow="Source / Medium">
            {analytics.sources.length > 0 ? (
              <div className="divide-y divide-white/10">
                {analytics.sources.map((source) => (
                  <div
                    key={source.sourceMedium}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 text-sm"
                  >
                    <span className="truncate text-zinc-200">{source.sourceMedium}</span>
                    <span className="text-zinc-500">{formatNumber(source.activeUsers)}명</span>
                    <span className="text-amber-100/70">{formatNumber(source.sessions)}회</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState>선택한 기간에 확인된 유입 경로가 없습니다.</EmptyState>
            )}
          </Section>

          <Section title="어느 페이지를 읽었는지" eyebrow="Top Pages">
            {analytics.pages.length > 0 ? (
              <div className="divide-y divide-white/10">
                {analytics.pages.map((page) => (
                  <div key={`${page.pagePath}-${page.pageTitle}`} className="py-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="max-w-full truncate text-sm text-zinc-200">{page.pageTitle}</p>
                      <p className="text-sm text-amber-100/70">{formatNumber(page.views)}회 열림</p>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                      <span className="max-w-full truncate">{page.pagePath}</span>
                      <span>방문자 {formatNumber(page.activeUsers)}명</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState>선택한 기간에 읽힌 페이지가 아직 없습니다.</EmptyState>
            )}
          </Section>
        </div>

        <Section title="무슨 이벤트가 있었는지" eyebrow="Events">
          {analytics.events.length > 0 ? (
            <div className="divide-y divide-white/10">
              {analytics.events.map((event) => (
                <div
                  key={event.eventName}
                  className="grid gap-2 py-3 text-sm md:grid-cols-[200px_1fr_auto] md:items-center"
                >
                  <code className="text-xs text-amber-100/75">{event.eventName}</code>
                  <span className="text-zinc-400">{event.eventLabel}</span>
                  <span className="text-zinc-200">{formatNumber(event.eventCount)}회</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState>선택한 기간에 발생한 이벤트가 아직 없습니다.</EmptyState>
          )}
        </Section>
      </div>
    </main>
  );
}
