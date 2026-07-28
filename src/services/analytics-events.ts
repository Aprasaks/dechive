import type { Pool } from 'pg';
import type { AnalyticsIngestRequest } from '@/lib/analytics/eventSchema';

export class AnalyticsRateLimitError extends Error {
  constructor() {
    super('analytics_rate_limited');
    this.name = 'AnalyticsRateLimitError';
  }
}

export async function ingestAnalyticsEvents(pool: Pool, input: AnalyticsIngestRequest) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const recent = await client.query<{ count: string }>(
      `SELECT count(*)::text AS count FROM analytics_events WHERE session_id = $1 AND occurred_at > now() - interval '1 minute'`,
      [input.session.sessionId],
    );
    if (Number(recent.rows[0]?.count ?? 0) + input.events.length > 120) throw new AnalyticsRateLimitError();

    const lastActivityAt = new Date(Math.max(
      input.session.lastActivityAt.getTime(),
      ...input.events.map((event) => event.occurredAt.getTime()),
    ));
    await client.query(
      `INSERT INTO analytics_sessions (
        session_id, anonymous_id, started_at, last_activity_at, landing_route, exit_route,
        referrer_source, referrer_url, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        device_type, country_code, consent_state, schema_version
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      ON CONFLICT (session_id) DO UPDATE SET
        last_activity_at = GREATEST(analytics_sessions.last_activity_at, EXCLUDED.last_activity_at),
        exit_route = COALESCE(EXCLUDED.exit_route, analytics_sessions.exit_route),
        consent_state = EXCLUDED.consent_state,
        schema_version = GREATEST(analytics_sessions.schema_version, EXCLUDED.schema_version)`,
      [
        input.session.sessionId, input.session.anonymousId, input.session.startedAt, lastActivityAt, input.session.landingRoute, input.session.exitRoute,
        input.session.referrerSource, input.session.referrerUrl, input.session.utmSource, input.session.utmMedium, input.session.utmCampaign,
        input.session.utmContent, input.session.utmTerm, input.session.deviceType, input.session.countryCode, input.session.consentState, input.session.schemaVersion,
      ],
    );

    let accepted = 0;
    for (const event of input.events) {
      const result = await client.query(
        `INSERT INTO analytics_events (
          event_id, event_name, occurred_at, session_id, anonymous_id, page_view_id, content_type, content_id,
          route, landing_route, referrer_source, referrer_url, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
          metadata, consent_state, schema_version
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
        ON CONFLICT (event_id) DO NOTHING`,
        [
          event.eventId, event.eventName, event.occurredAt, event.sessionId, event.anonymousId, event.pageViewId, event.contentType, event.contentId,
          event.route, event.landingRoute, event.referrerSource, event.referrerUrl, event.utmSource, event.utmMedium, event.utmCampaign,
          event.utmContent, event.utmTerm, event.metadata, event.consentState, event.schemaVersion,
        ],
      );
      accepted += result.rowCount ?? 0;
    }
    await client.query('COMMIT');
    return { accepted, duplicates: input.events.length - accepted };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
