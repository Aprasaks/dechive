'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { readAnalyticsConsent, writeAnalyticsConsent, type AnalyticsConsent } from '@/lib/analytics/consent';
import type { AnalyticsContentType, AnalyticsEventName, AnalyticsMetadata } from '@/lib/analytics/eventSchema';
import { sendToPostHog } from '@/lib/analytics/posthog';

type ClientSession = {
  sessionId: string;
  anonymousId: string;
  startedAt: string;
  lastActivityAt: string;
  landingRoute: string;
  exitRoute: string | null;
  referrerSource: string | null;
  referrerUrl: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  deviceType: string | null;
  countryCode: string | null;
  consentState: Exclude<AnalyticsConsent, 'unknown'> | 'unknown';
  schemaVersion: number;
};

export type TrackOptions = {
  route?: string;
  pageViewId?: string | null;
  contentType?: AnalyticsContentType | null;
  contentId?: string | null;
  metadata?: AnalyticsMetadata;
};

type AnalyticsContextValue = {
  consent: AnalyticsConsent;
  pageViewId: string | null;
  setConsent: (value: Exclude<AnalyticsConsent, 'unknown'>) => void;
  track: (eventName: AnalyticsEventName, options?: TrackOptions) => void;
};

const AnalyticsContext = createContext<AnalyticsContextValue>({
  consent: 'unknown',
  pageViewId: null,
  setConsent: () => undefined,
  track: () => undefined,
});

const SESSION_KEY = 'dechive_analytics_session';
const ANONYMOUS_KEY = 'dechive_analytics_anonymous_id';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

function id(): string {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
}

function text(value: string | null | undefined, max = 200): string | null {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, max) : null;
}

function referrerSource(value: string): string | null {
  if (!value) return null;
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    if (hostname.includes('chatgpt') || hostname.includes('openai')) return 'chatgpt';
    if (hostname.includes('claude') || hostname.includes('anthropic')) return 'claude';
    if (hostname.includes('gemini') || hostname.includes('google')) return 'google_ai_or_search';
    if (hostname.includes('perplexity')) return 'perplexity';
    if (hostname.includes('copilot') || hostname.includes('bing')) return 'copilot_or_bing';
    if (hostname.includes('reddit')) return 'reddit';
    if (hostname.includes('threads')) return 'threads';
    if (hostname === 'x.com' || hostname === 'twitter.com') return 'x';
    if (hostname.includes('facebook')) return 'facebook';
    if (hostname.includes('linkedin')) return 'linkedin';
    if (hostname.includes('discord')) return 'discord';
    return hostname;
  } catch {
    return null;
  }
}

function deviceType(): string {
  if (window.matchMedia('(max-width: 767px)').matches) return 'mobile';
  if (window.matchMedia('(max-width: 1023px)').matches) return 'tablet';
  return 'desktop';
}

function attribution(): Pick<ClientSession, 'referrerSource' | 'referrerUrl' | 'utmSource' | 'utmMedium' | 'utmCampaign' | 'utmContent' | 'utmTerm'> {
  const url = new URL(window.location.href);
  return {
    referrerSource: referrerSource(document.referrer),
    referrerUrl: text(document.referrer, 2_000),
    utmSource: text(url.searchParams.get('utm_source')),
    utmMedium: text(url.searchParams.get('utm_medium')),
    utmCampaign: text(url.searchParams.get('utm_campaign')),
    utmContent: text(url.searchParams.get('utm_content')),
    utmTerm: text(url.searchParams.get('utm_term')),
  };
}

function readSession(pathname: string, consent: AnalyticsConsent): ClientSession {
  const now = new Date().toISOString();
  const anonymousId = window.localStorage.getItem(ANONYMOUS_KEY) || id();
  window.localStorage.setItem(ANONYMOUS_KEY, anonymousId);
  const raw = window.sessionStorage.getItem(SESSION_KEY);
  if (raw) {
    try {
      const existing = JSON.parse(raw) as ClientSession;
      const lastActivity = new Date(existing.lastActivityAt).getTime();
      if (existing.sessionId && existing.anonymousId === anonymousId && Date.now() - lastActivity < SESSION_TIMEOUT_MS) {
        const updated = { ...existing, lastActivityAt: now, exitRoute: pathname, consentState: consent === 'granted' ? 'granted' : existing.consentState };
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
        return updated;
      }
    } catch {
      window.sessionStorage.removeItem(SESSION_KEY);
    }
  }
  const next: ClientSession = {
    sessionId: id(),
    anonymousId,
    startedAt: now,
    lastActivityAt: now,
    landingRoute: pathname,
    exitRoute: null,
    ...attribution(),
    deviceType: deviceType(),
    countryCode: null,
    consentState: consent === 'granted' ? 'granted' : consent,
    schemaVersion: 1,
  };
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  return next;
}

export function useAnalytics(): AnalyticsContextValue {
  return useContext(AnalyticsContext);
}

function ConsentBanner({ consent, setConsent }: Pick<AnalyticsContextValue, 'consent' | 'setConsent'>) {
  const pathname = usePathname();
  if (consent !== 'unknown' || pathname.startsWith('/admin') || pathname.startsWith('/dev')) return null;
  return (
    <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl border border-border bg-background p-4 shadow-lg" aria-label="분석 동의">
      <p className="text-sm font-semibold text-foreground">Dechive 이용 흐름을 익명으로 분석할까요?</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">어떤 지식에서 멈추고 다음 학습으로 이동하는지 개선하기 위해 익명 세션과 학습 이벤트를 사용합니다. 언제든지 거부할 수 있습니다.</p>
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button type="button" className="border border-border px-3 py-2 text-xs text-muted-foreground" onClick={() => setConsent('denied')}>허용하지 않음</button>
        <button type="button" className="bg-accent px-3 py-2 text-xs font-semibold text-white" onClick={() => setConsent('granted')}>익명 분석 허용</button>
      </div>
    </aside>
  );
}

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [consent, setConsentState] = useState<AnalyticsConsent>('unknown');
  const [pageViewId, setPageViewId] = useState<string | null>(null);
  const pageViewIdRef = useRef<string | null>(null);
  const sessionRef = useRef<ClientSession | null>(null);

  useEffect(() => setConsentState(readAnalyticsConsent()), []);

  const setConsent = useCallback((value: Exclude<AnalyticsConsent, 'unknown'>) => {
    writeAnalyticsConsent(value);
    setConsentState(value);
  }, []);

  useEffect(() => {
    const nextPageViewId = id();
    pageViewIdRef.current = nextPageViewId;
    setPageViewId(nextPageViewId);
    if (consent !== 'unknown') sessionRef.current = readSession(pathname, consent);
  }, [consent, pathname]);

  const track = useCallback((eventName: AnalyticsEventName, options: TrackOptions = {}) => {
    if (consent !== 'granted' || typeof window === 'undefined') return;
    const existingSession = sessionRef.current;
    const session = !existingSession || Date.now() - new Date(existingSession.lastActivityAt).getTime() >= SESSION_TIMEOUT_MS
      ? readSession(pathname, consent)
      : existingSession;
    sessionRef.current = session;
    const lastActivityAt = new Date().toISOString();
    const event = {
      eventId: id(),
      eventName,
      occurredAt: new Date().toISOString(),
      sessionId: session.sessionId,
      anonymousId: session.anonymousId,
      pageViewId: options.pageViewId === undefined ? pageViewIdRef.current : options.pageViewId,
      contentType: options.contentType ?? null,
      contentId: options.contentId ?? null,
      route: options.route ?? window.location.pathname,
      metadata: options.metadata ?? {},
      consentState: 'granted',
      schemaVersion: 1,
    };
    sessionRef.current = { ...session, lastActivityAt, exitRoute: event.route, consentState: 'granted' };
    const body = JSON.stringify({ session: sessionRef.current, events: [event] });
    sendToPostHog({ eventName, anonymousId: session.anonymousId, route: event.route, contentType: event.contentType, contentId: event.contentId, metadata: event.metadata });
    const blob = new Blob([body], { type: 'application/json' });
    if (navigator.sendBeacon?.('/api/analytics/events', blob)) return;
    void fetch('/api/analytics/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => undefined);
  }, [consent, pathname]);

  useEffect(() => {
    if (consent !== 'granted' || pathname.startsWith('/admin') || pathname.startsWith('/dev')) return;
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(target instanceof HTMLAnchorElement)) return;
      const href = target.getAttribute('href') ?? '';
      if (target.hasAttribute('download')) {
        track('file_download', { metadata: { href: href.slice(0, 500), filename: text(target.getAttribute('download'), 200) } });
        return;
      }
      if (!href.startsWith('/') || href.startsWith('//')) return;
      track('internal_link_click', { metadata: { targetRoute: href.slice(0, 500), label: text(target.textContent, 120) } });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [consent, pathname, track]);

  const value = useMemo(() => ({ consent, pageViewId, setConsent, track }), [consent, pageViewId, setConsent, track]);
  return <AnalyticsContext.Provider value={value}><ConsentBanner consent={consent} setConsent={setConsent} />{children}</AnalyticsContext.Provider>;
}
