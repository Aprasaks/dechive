import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { Pool } from 'pg';
import { inspectConnectionPair, loadStagingEnvironment, safeError } from './env';

async function apply(url: string) {
  const pool = new Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 10_000 });
  const appliedNow: string[] = [];
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      name text PRIMARY KEY,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`);
    const names = (await readdir(path.resolve('drizzle'))).filter((name) => /^000[0-6].*\.sql$/.test(name)).sort();
    if (names.length !== 7) throw new Error('blocked_expected_migration_set_missing');
    for (const name of names) {
      const raw = await readFile(path.resolve('drizzle', name), 'utf8');
      const checksum = createHash('sha256').update(raw).digest('hex');
      const existing = await pool.query<{ checksum: string }>('SELECT checksum FROM schema_migrations WHERE name=$1', [name]);
      if (existing.rows[0]) {
        if (existing.rows[0].checksum !== checksum) throw new Error('blocked_applied_migration_changed');
        continue;
      }
      await pool.query('BEGIN');
      try {
        await pool.query(raw.replaceAll('--> statement-breakpoint', ''));
        await pool.query('INSERT INTO schema_migrations(name,checksum) VALUES ($1,$2)', [name, checksum]);
        await pool.query('COMMIT');
        appliedNow.push(name);
      } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
      }
    }
    const status = await pool.query<{ count: string; checksum: string }>(`SELECT count(*)::text AS count,
      md5(string_agg(name || ':' || checksum, ',' ORDER BY name)) AS checksum
      FROM schema_migrations WHERE name ~ '^000[0-6]'`);
    const objects = await pool.query<{ tables: string; indexes: string; triggers: string; constraints: string }>(`SELECT
      (SELECT count(*)::text FROM information_schema.tables WHERE table_schema='public') AS tables,
      (SELECT count(*)::text FROM pg_indexes WHERE schemaname='public') AS indexes,
      (SELECT count(*)::text FROM information_schema.triggers WHERE trigger_schema='public') AS triggers,
      (SELECT count(*)::text FROM information_schema.table_constraints WHERE constraint_schema='public') AS constraints`);
    return { appliedNow, migrationCount: Number(status.rows[0]?.count), checksumVerified: Boolean(status.rows[0]?.checksum), objects: objects.rows[0] };
  } finally {
    await pool.end().catch(() => undefined);
  }
}

async function main() {
  const outputDirectory = path.resolve('fixtures/staging-import/output');
  await mkdir(outputDirectory, { recursive: true });
  try {
    const environment = await loadStagingEnvironment();
    const pair = inspectConnectionPair(environment.pooled, environment.direct);
    if (!pair.directMarker || !pair.pooledMarker || !pair.sameEndpoint || !pair.sslRequired) throw new Error('blocked_target_not_proven_safe');
    const first = await apply(environment.direct);
    const second = await apply(environment.direct);
    const report = { target: 'user-confirmed Neon staging', directConnectionUsed: true, first, second, secondRunNoOp: second.appliedNow.length === 0, credentialsLogged: false };
    await writeFile(path.join(outputDirectory, 'neon-migration-report.json'), `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
    console.log(`Neon staging migrations: applied ${first.appliedNow.length}; second run no-op ${report.secondRunNoOp}`);
    if (first.migrationCount !== 7 || !report.secondRunNoOp) process.exitCode = 2;
  } catch (error) {
    console.error(`Neon staging migrations: ${error instanceof Error && error.message.startsWith('blocked_') ? error.message : safeError(error)}; credentials redacted`);
    process.exitCode = 2;
  }
}

void main();
