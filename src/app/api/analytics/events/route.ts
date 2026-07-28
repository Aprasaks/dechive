import { NextResponse } from 'next/server';
import { createDatabase } from '@/db/client';
import { AnalyticsRateLimitError, ingestAnalyticsEvents } from '@/services/analytics-events';
import { AnalyticsValidationError, parseAnalyticsIngestRequest } from '@/lib/analytics/eventSchema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'sin1';

const MAX_BODY_BYTES = 64 * 1024;
const botPattern = /bot|crawler|spider|slurp|bingpreview|headless|facebookexternalhit|semrush|ahrefs/i;

function response(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return response({ ok: false, error: 'origin_invalid' }, 403);
  if (botPattern.test(request.headers.get('user-agent') ?? '')) return response({ ok: true, accepted: 0, ignored: 'bot' }, 202);

  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return response({ ok: false, error: 'request_too_large' }, 413);

  let input: ReturnType<typeof parseAnalyticsIngestRequest>;
  try {
    input = parseAnalyticsIngestRequest(JSON.parse(raw) as unknown);
  } catch (error) {
    if (error instanceof AnalyticsValidationError) return response({ ok: false, error: error.code }, 400);
    return response({ ok: false, error: 'request_invalid' }, 400);
  }
  if (input.session.consentState === 'denied' || input.events.some((event) => event.consentState === 'denied')) {
    return response({ ok: true, accepted: 0, ignored: 'consent_denied' }, 202);
  }

  const { pool } = createDatabase();
  try {
    const result = await ingestAnalyticsEvents(pool, input);
    return response({ ok: true, ...result });
  } catch (error) {
    if (error instanceof AnalyticsRateLimitError) return response({ ok: false, error: error.message }, 429);
    return response({ ok: false, error: 'analytics_ingest_failed' }, 500);
  } finally {
    await pool.end();
  }
}
