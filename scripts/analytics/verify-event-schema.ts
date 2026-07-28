import assert from 'node:assert/strict';
import { AnalyticsValidationError, parseAnalyticsIngestRequest } from '../../src/lib/analytics/eventSchema';

const session = {
  sessionId: '11111111-1111-4111-8111-111111111111',
  anonymousId: '22222222-2222-4222-8222-222222222222',
  startedAt: new Date(Date.now() - 60_000).toISOString(),
  lastActivityAt: new Date().toISOString(),
  landingRoute: '/knowledge/mcp',
  referrerSource: 'chatgpt',
  consentState: 'not_required',
};

const parsed = parseAnalyticsIngestRequest({
  session,
  events: [{
    eventId: '33333333-3333-4333-8333-333333333333',
    eventName: 'content_progress',
    occurredAt: new Date().toISOString(),
    pageViewId: '44444444-4444-4444-8444-444444444444',
    contentType: 'knowledge',
    contentId: 'knowledge-localization-id',
    route: '/knowledge/mcp',
    metadata: { progress: 75, readingTimeSeconds: 184 },
  }],
});
assert.equal(parsed.events[0]?.eventName, 'content_progress');
assert.equal(parsed.events[0]?.metadata.progress, 75);
assert.equal(parsed.session.referrerUrl, null);

function assertInvalid(input: unknown, code: string) {
  assert.throws(() => parseAnalyticsIngestRequest(input), (error: unknown) => error instanceof AnalyticsValidationError && error.code === code);
}

assertInvalid({ session, events: [{ eventId: 'bad', eventName: 'unknown', occurredAt: new Date().toISOString(), route: '/knowledge/mcp' }] }, 'event_name_invalid');
assertInvalid({ session, events: [{ eventId: '33333333-3333-4333-8333-333333333333', eventName: 'content_progress', occurredAt: new Date().toISOString(), route: '/knowledge/mcp', metadata: { progress: 10 } }] }, 'progress_invalid');
assertInvalid({ session, events: [{ eventId: '33333333-3333-4333-8333-333333333333', eventName: 'content_open', occurredAt: new Date().toISOString(), route: 'https://dechive.dev/knowledge/mcp' }] }, 'route_invalid');
assertInvalid({ session, events: [{ eventId: '33333333-3333-4333-8333-333333333333', eventName: 'content_open', occurredAt: new Date().toISOString(), route: '/knowledge/mcp', metadata: { value: 'x'.repeat(16_385) } }] }, 'metadata_too_large');

console.log('Analytics event schema verification passed.');
