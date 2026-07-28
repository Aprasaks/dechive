import type { AnalyticsEventName, AnalyticsMetadata } from './eventSchema';

type PostHogEvent = {
  eventName: AnalyticsEventName;
  anonymousId: string;
  route: string;
  contentType: string | null;
  contentId: string | null;
  metadata: AnalyticsMetadata;
};

export function sendToPostHog(event: PostHogEvent): void {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey || typeof window === 'undefined') return;
  const host = (process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com').replace(/\/$/, '');
  const body = JSON.stringify({
    api_key: apiKey,
    event: event.eventName,
    distinct_id: event.anonymousId,
    properties: { ...event.metadata, $current_url: window.location.href, route: event.route, content_type: event.contentType, content_id: event.contentId },
  });
  void fetch(`${host}/i/v0/e/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => undefined);
}
