import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Pool } from 'pg';
import { inspectConnectionPair, loadStagingEnvironment, safeError } from './env';

const RESTORE_URL = 'postgresql://dechive:dechive_local_only@127.0.0.1:55432/dechive_neon_restore';
const tables = [
  'schema_migrations','contents','content_localizations','content_versions','knowledge_details','ai_updates',
  'update_digests','update_digest_items','content_routes','sources','content_sources','media_assets','media_usages',
  'legacy_identities','import_batches','import_items','editorial_issues','editorial_issue_items',
];

async function snapshot(pool: Pool) {
  const counts: Record<string, number> = {};
  for (const table of tables) counts[table] = Number((await pool.query(`SELECT count(*) FROM ${table}`)).rows[0]?.count ?? 0);
  const rows = (await pool.query(`SELECT
    (SELECT string_agg(document_checksum,',' ORDER BY id) FROM content_versions) AS versions,
    (SELECT string_agg(route,',' ORDER BY route) FROM content_routes) AS routes,
    (SELECT string_agg(source_checksum,',' ORDER BY stable_key) FROM legacy_identities) AS identities,
    (SELECT string_agg(name || ':' || checksum,',' ORDER BY name) FROM schema_migrations) AS migrations`)).rows[0];
  const checksum = createHash('sha256').update(JSON.stringify(rows)).digest('hex');
  const immutableTrigger = Number((await pool.query(`SELECT count(*) FROM pg_trigger WHERE tgname='content_versions_immutable' AND NOT tgisinternal`)).rows[0]?.count ?? 0);
  return { counts, checksum, immutableTrigger };
}

async function main() {
  const outputDirectory = path.resolve('fixtures/staging-import/output');
  await mkdir(outputDirectory, { recursive: true });
  let cloud: Pool | undefined;
  let restored: Pool | undefined;
  try {
    const environment = await loadStagingEnvironment();
    const pair = inspectConnectionPair(environment.pooled, environment.direct);
    if (!pair.pooledMarker || !pair.directMarker || !pair.sameEndpoint || !pair.sslRequired) throw new Error('blocked_target_not_proven_safe');
    cloud = new Pool({ connectionString: environment.pooled, max: 1, connectionTimeoutMillis: 10_000 });
    restored = new Pool({ connectionString: RESTORE_URL, max: 1, connectionTimeoutMillis: 5_000 });
    const before = await snapshot(cloud);
    const after = await snapshot(restored);
    assert.deepEqual(after.counts, before.counts);
    assert.equal(after.checksum, before.checksum);
    assert.equal(after.immutableTrigger, before.immutableTrigger);
    const report = {
      source: 'Neon staging logical backup', target: 'isolated local PostgreSQL restore database',
      neonTemporaryRestoreBranch: 'blocked_not_provisioned',
      countsEqual: true, checksumEqual: true, immutableTriggerEqual: true,
      counts: before.counts, credentialsLogged: false,
    };
    await writeFile(path.join(outputDirectory, 'neon-restore-report.json'), `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
    console.log(`Neon backup restore: ${tables.length} table counts and integrity checksum exact`);
  } catch (error) {
    console.error(`Neon restore verification: ${error instanceof Error && error.message.startsWith('blocked_') ? error.message : safeError(error)}; credentials redacted`);
    process.exitCode = 2;
  } finally {
    await cloud?.end().catch(() => undefined);
    await restored?.end().catch(() => undefined);
  }
}

void main();
