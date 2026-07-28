export const ANALYTICS_SCHEMA_VERSION = 1 as const;

export const ANALYTICS_EVENT_NAMES = [
  'content_open', 'content_progress', 'content_complete', 'internal_link_click', 'share_complete', 'file_download',
  'lecture_start', 'lecture_complete', 'practice_start', 'practice_complete',
  'search_submit', 'search_result_click', 'search_zero_result',
  'book_preview_open', 'book_purchase_click', 'purchase_start', 'purchase_complete',
  'error_404', 'error_500', 'client_error', 'api_error',
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];
export type AnalyticsConsentState = 'granted' | 'denied' | 'not_required' | 'unknown';
export type AnalyticsContentType = 'knowledge' | 'lecture' | 'practice' | 'book' | 'ai_update' | 'course' | 'lesson' | 'page';
export type AnalyticsMetadata = Record<string, unknown>;

export type AnalyticsSession = {
  sessionId: string;
  anonymousId: string;
  startedAt: Date;
  lastActivityAt: Date;
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
  consentState: AnalyticsConsentState;
  schemaVersion: number;
};

export type AnalyticsEvent = {
  eventId: string;
  eventName: AnalyticsEventName;
  occurredAt: Date;
  sessionId: string;
  anonymousId: string;
  pageViewId: string | null;
  contentType: AnalyticsContentType | null;
  contentId: string | null;
  route: string;
  landingRoute: string | null;
  referrerSource: string | null;
  referrerUrl: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  metadata: AnalyticsMetadata;
  consentState: AnalyticsConsentState;
  schemaVersion: number;
};

export type AnalyticsIngestRequest = {
  session: AnalyticsSession;
  events: AnalyticsEvent[];
};

export class AnalyticsValidationError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.name = 'AnalyticsValidationError';
    this.code = code;
  }
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const dangerousKeys = new Set(['__proto__', 'prototype', 'constructor']);
const contentTypes = new Set<AnalyticsContentType>(['knowledge', 'lecture', 'practice', 'book', 'ai_update', 'course', 'lesson', 'page']);
const eventNames = new Set<string>(ANALYTICS_EVENT_NAMES);
const consentStates = new Set<AnalyticsConsentState>(['granted', 'denied', 'not_required', 'unknown']);
const maxAgeMs = 30 * 24 * 60 * 60 * 1000;

function record(value: unknown, code: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new AnalyticsValidationError(code);
  return value as Record<string, unknown>;
}

function stringValue(value: unknown, code: string, maxLength: number, required = true): string | null {
  if (value === undefined || value === null || value === '') {
    if (required) throw new AnalyticsValidationError(code);
    return null;
  }
  if (typeof value !== 'string') throw new AnalyticsValidationError(code);
  const normalized = value.trim();
  if (required && !normalized) throw new AnalyticsValidationError(code);
  if (normalized.length > maxLength) throw new AnalyticsValidationError(`${code}_too_long`);
  return normalized || null;
}

function uuidValue(value: unknown, code: string): string {
  const normalized = stringValue(value, code, 36);
  if (!normalized || !uuidPattern.test(normalized)) throw new AnalyticsValidationError(code);
  return normalized.toLowerCase();
}

function routeValue(value: unknown, code: string, required = true): string | null {
  const route = stringValue(value, code, 500, required);
  if (route !== null && (!route.startsWith('/') || route.startsWith('//'))) throw new AnalyticsValidationError(code);
  return route;
}

function timestampValue(value: unknown, code: string): Date {
  const raw = stringValue(value, code, 40);
  const date = new Date(raw ?? '');
  const now = Date.now();
  if (Number.isNaN(date.getTime()) || date.getTime() > now + 5 * 60 * 1000 || date.getTime() < now - maxAgeMs) {
    throw new AnalyticsValidationError(code);
  }
  return date;
}

function nullableUrl(value: unknown, code: string): string | null {
  const raw = stringValue(value, code, 2_000, false);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocol');
    url.username = '';
    url.password = '';
    url.search = '';
    url.hash = '';
    return url.toString().slice(0, 2_000);
  } catch {
    throw new AnalyticsValidationError(code);
  }
}

function nullableString(value: unknown, code: string, maxLength: number): string | null {
  return stringValue(value, code, maxLength, false);
}

function consentValue(value: unknown, code: string): AnalyticsConsentState {
  const consent = stringValue(value, code, 20);
  if (!consent || !consentStates.has(consent as AnalyticsConsentState)) throw new AnalyticsValidationError(code);
  return consent as AnalyticsConsentState;
}

function metadataValue(value: unknown): AnalyticsMetadata {
  const metadata = record(value ?? {}, 'metadata_invalid');
  const serialized = JSON.stringify(metadata);
  if (serialized.length > 16_384) throw new AnalyticsValidationError('metadata_too_large');
  const visit = (node: unknown, depth = 0): void => {
    if (depth > 8 || !node || typeof node !== 'object') return;
    for (const [key, child] of Object.entries(node)) {
      if (dangerousKeys.has(key)) throw new AnalyticsValidationError('metadata_invalid');
      visit(child, depth + 1);
    }
  };
  visit(metadata);
  return metadata;
}

function sessionValue(value: unknown): AnalyticsSession {
  const input = record(value, 'session_invalid');
  const schemaVersion = input.schemaVersion === undefined ? ANALYTICS_SCHEMA_VERSION : input.schemaVersion;
  if (schemaVersion !== ANALYTICS_SCHEMA_VERSION) throw new AnalyticsValidationError('schema_version_invalid');
  return {
    sessionId: uuidValue(input.sessionId, 'session_id_invalid'),
    anonymousId: uuidValue(input.anonymousId, 'anonymous_id_invalid'),
    startedAt: timestampValue(input.startedAt, 'started_at_invalid'),
    lastActivityAt: timestampValue(input.lastActivityAt, 'last_activity_at_invalid'),
    landingRoute: routeValue(input.landingRoute, 'landing_route_invalid')!,
    exitRoute: routeValue(input.exitRoute, 'exit_route_invalid', false),
    referrerSource: nullableString(input.referrerSource, 'referrer_source_invalid', 120),
    referrerUrl: nullableUrl(input.referrerUrl, 'referrer_url_invalid'),
    utmSource: nullableString(input.utmSource, 'utm_source_invalid', 200),
    utmMedium: nullableString(input.utmMedium, 'utm_medium_invalid', 200),
    utmCampaign: nullableString(input.utmCampaign, 'utm_campaign_invalid', 200),
    utmContent: nullableString(input.utmContent, 'utm_content_invalid', 200),
    utmTerm: nullableString(input.utmTerm, 'utm_term_invalid', 200),
    deviceType: nullableString(input.deviceType, 'device_type_invalid', 40),
    countryCode: nullableString(input.countryCode, 'country_code_invalid', 8),
    consentState: consentValue(input.consentState, 'consent_state_invalid'),
    schemaVersion,
  };
}

function eventValue(value: unknown, session: AnalyticsSession): AnalyticsEvent {
  const input = record(value, 'event_invalid');
  const schemaVersion = input.schemaVersion === undefined ? ANALYTICS_SCHEMA_VERSION : input.schemaVersion;
  const eventName = stringValue(input.eventName, 'event_name_invalid', 80);
  if (schemaVersion !== ANALYTICS_SCHEMA_VERSION || !eventName || !eventNames.has(eventName)) throw new AnalyticsValidationError('event_name_invalid');
  const metadata = metadataValue(input.metadata);
  if (eventName === 'content_progress' && ![25, 50, 75, 90, 100].includes(metadata.progress as number)) throw new AnalyticsValidationError('progress_invalid');
  return {
    eventId: uuidValue(input.eventId, 'event_id_invalid'),
    eventName: eventName as AnalyticsEventName,
    occurredAt: timestampValue(input.occurredAt, 'occurred_at_invalid'),
    sessionId: uuidValue(input.sessionId ?? session.sessionId, 'session_id_invalid'),
    anonymousId: uuidValue(input.anonymousId ?? session.anonymousId, 'anonymous_id_invalid'),
    pageViewId: input.pageViewId === undefined || input.pageViewId === null ? null : uuidValue(input.pageViewId, 'page_view_id_invalid'),
    contentType: input.contentType === undefined || input.contentType === null ? null : (() => {
      const contentType = stringValue(input.contentType, 'content_type_invalid', 40);
      if (!contentType || !contentTypes.has(contentType as AnalyticsContentType)) throw new AnalyticsValidationError('content_type_invalid');
      return contentType as AnalyticsContentType;
    })(),
    contentId: nullableString(input.contentId, 'content_id_invalid', 128),
    route: routeValue(input.route, 'route_invalid')!,
    landingRoute: routeValue(input.landingRoute ?? session.landingRoute, 'landing_route_invalid'),
    referrerSource: nullableString(input.referrerSource ?? session.referrerSource, 'referrer_source_invalid', 120),
    referrerUrl: nullableUrl(input.referrerUrl ?? session.referrerUrl, 'referrer_url_invalid'),
    utmSource: nullableString(input.utmSource ?? session.utmSource, 'utm_source_invalid', 200),
    utmMedium: nullableString(input.utmMedium ?? session.utmMedium, 'utm_medium_invalid', 200),
    utmCampaign: nullableString(input.utmCampaign ?? session.utmCampaign, 'utm_campaign_invalid', 200),
    utmContent: nullableString(input.utmContent ?? session.utmContent, 'utm_content_invalid', 200),
    utmTerm: nullableString(input.utmTerm ?? session.utmTerm, 'utm_term_invalid', 200),
    metadata,
    consentState: input.consentState === undefined ? session.consentState : consentValue(input.consentState, 'consent_state_invalid'),
    schemaVersion,
  };
}

export function parseAnalyticsIngestRequest(value: unknown): AnalyticsIngestRequest {
  const input = record(value, 'request_invalid');
  const session = sessionValue(input.session);
  if (!Array.isArray(input.events) || input.events.length < 1 || input.events.length > 50) throw new AnalyticsValidationError('events_invalid');
  const events = input.events.map((event) => eventValue(event, session));
  for (const event of events) {
    if (event.sessionId !== session.sessionId) throw new AnalyticsValidationError('session_mismatch');
    if (event.anonymousId !== session.anonymousId) throw new AnalyticsValidationError('anonymous_id_mismatch');
  }
  return { session, events };
}
