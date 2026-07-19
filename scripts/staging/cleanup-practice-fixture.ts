import { Pool } from 'pg';
import { inspectConnectionPair, loadStagingEnvironment, safeError } from './env';

const fixturePrefix = 'qa-fixture-';

async function main() {
  let pool: Pool | undefined;
  try {
    const environment = await loadStagingEnvironment();
    const pair = inspectConnectionPair(environment.pooled, environment.direct);
    if (!pair.directMarker || !pair.pooledMarker || !pair.sameEndpoint || !pair.sslRequired)
      throw new Error('blocked_target_not_proven_safe');
    pool = new Pool({ connectionString: environment.direct, max: 1 });
    const identity = await pool.query<{ database_name: string }>(`SELECT current_database() AS database_name`);
    if (/prod(uction)?/i.test(identity.rows[0]?.database_name ?? ''))
      throw new Error('blocked_production_target');
    const fixtures = await pool.query<{ content_id: string }>(`SELECT content_id FROM content_localizations WHERE slug LIKE $1`, [`${fixturePrefix}%`]);
    const ids = fixtures.rows.map((row) => row.content_id);
    if (!ids.length) { console.log('practice_preview_fixture_cleanup_noop'); return; }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(`UPDATE content_localizations SET current_draft_version_id=NULL, current_published_version_id=NULL WHERE content_id=ANY($1::uuid[])`, [ids]);
      await client.query(`DELETE FROM revision_events WHERE content_version_id IN (SELECT id FROM content_versions WHERE localization_id IN (SELECT id FROM content_localizations WHERE content_id=ANY($1::uuid[])))`, [ids]);
      await client.query(`DELETE FROM content_relations WHERE source_content_id=ANY($1::uuid[]) OR target_content_id=ANY($1::uuid[])`, [ids]);
      await client.query(`DELETE FROM content_version_artifacts WHERE content_version_id IN (SELECT id FROM content_versions WHERE localization_id IN (SELECT id FROM content_localizations WHERE content_id=ANY($1::uuid[])))`, [ids]);
      await client.query(`DELETE FROM content_versions WHERE localization_id IN (SELECT id FROM content_localizations WHERE content_id=ANY($1::uuid[]))`, [ids]);
      await client.query(`DELETE FROM content_routes WHERE localization_id IN (SELECT id FROM content_localizations WHERE content_id=ANY($1::uuid[]))`, [ids]);
      await client.query(`DELETE FROM practices WHERE localization_id IN (SELECT id FROM content_localizations WHERE content_id=ANY($1::uuid[]))`, [ids]);
      await client.query(`DELETE FROM contents WHERE id=ANY($1::uuid[])`, [ids]);
      await client.query('COMMIT');
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
    const remaining = await pool.query(`SELECT count(*)::int AS count FROM content_localizations WHERE slug LIKE $1`, [`${fixturePrefix}%`]);
    if (Number(remaining.rows[0]?.count ?? 0) !== 0) throw new Error('fixture_cleanup_incomplete');
    console.log('practice_preview_fixture_cleanup_complete');
  } catch (error) {
    console.error(error instanceof Error && error.message.startsWith('blocked_') ? error.message : safeError(error));
    process.exitCode = 2;
  } finally { await pool?.end(); }
}

void main();
