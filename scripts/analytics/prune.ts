import { createDatabase } from '../../src/db/client';

const minimumDays = 30;
const maximumDays = 730;

function retentionDays(): number {
  const value = Number(process.env.ANALYTICS_RETENTION_DAYS ?? 365);
  if (!Number.isInteger(value) || value < minimumDays || value > maximumDays) {
    throw new Error(`analytics_retention_days_invalid:${minimumDays}-${maximumDays}`);
  }
  return value;
}

async function main() {
  if (process.env.ANALYTICS_PRUNE_CONFIRM !== 'YES') {
    throw new Error('analytics_prune_requires_ANALYTICS_PRUNE_CONFIRM');
  }
  const days = retentionDays();
  const { pool } = createDatabase();
  try {
    await pool.query('BEGIN');
    const events = await pool.query<{ count: string }>(
      `WITH deleted AS (
         DELETE FROM analytics_events
         WHERE occurred_at < now() - ($1::text || ' days')::interval
         RETURNING session_id
       ) SELECT count(*)::text AS count FROM deleted`,
      [days],
    );
    const sessions = await pool.query<{ count: string }>(
      `WITH deleted AS (
         DELETE FROM analytics_sessions
         WHERE last_activity_at < now() - ($1::text || ' days')::interval
           AND NOT EXISTS (SELECT 1 FROM analytics_events WHERE analytics_events.session_id = analytics_sessions.session_id)
         RETURNING session_id
       ) SELECT count(*)::text AS count FROM deleted`,
      [days],
    );
    await pool.query('COMMIT');
    console.log(JSON.stringify({ retentionDays: days, deletedEvents: Number(events.rows[0]?.count ?? 0), deletedSessions: Number(sessions.rows[0]?.count ?? 0), credentialsLogged: false }));
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  } finally {
    await pool.end();
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'analytics_prune_failed');
  process.exitCode = 1;
});
