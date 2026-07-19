import { mkdir, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import path from 'node:path';
import { Pool } from 'pg';
import { inspectConnectionPair, loadStagingEnvironment, safeError } from './env';

type Sample = { name: string; values: number[] };
const round = (value: number) => Math.round(value * 100) / 100;
const summarize = (sample: Sample) => {
  const sorted = [...sample.values].sort((a, b) => a - b);
  const percentile = (fraction: number) => sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)] ?? 0;
  return { name: sample.name, samples: sorted.length, medianMs: round(percentile(0.5)), p95Ms: round(percentile(0.95)), minMs: round(sorted[0] ?? 0), maxMs: round(sorted.at(-1) ?? 0) };
};

async function time(run: () => Promise<unknown>) {
  const start = performance.now();
  await run();
  return performance.now() - start;
}

async function cold(url: string, count: number) {
  const values: number[] = [];
  for (let index = 0; index < count; index++) {
    values.push(await time(async () => {
      const pool = new Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 10_000 });
      try { await pool.query('SELECT 1'); } finally { await pool.end(); }
    }));
  }
  return values;
}

async function main() {
  const outputDirectory = path.resolve('fixtures/staging-import/output');
  await mkdir(outputDirectory, { recursive: true });
  let pool: Pool | undefined;
  try {
    const environment = await loadStagingEnvironment();
    const pair = inspectConnectionPair(environment.pooled, environment.direct);
    if (!pair.pooledMarker || !pair.directMarker || !pair.sameEndpoint || !pair.sslRequired) throw new Error('blocked_target_not_proven_safe');
    const samples: Sample[] = [
      { name: 'direct_connection_cold_select_1', values: await cold(environment.direct, 5) },
      { name: 'pooled_connection_cold_select_1', values: await cold(environment.pooled, 5) },
    ];
    pool = new Pool({ connectionString: environment.pooled, max: 2, connectionTimeoutMillis: 10_000 });
    await pool.query('SELECT 1');
    const queries: Array<{ name: string; sql: string }> = [
      { name: 'pooled_warm_select_1', sql: 'SELECT 1' },
      { name: 'route_lookup', sql: `SELECT localization_id FROM content_routes WHERE route='/archive/what-null-leaves-behind' AND active_until IS NULL` },
      { name: 'knowledge_detail', sql: `SELECT kd.* FROM knowledge_details kd JOIN content_localizations cl ON cl.id=kd.localization_id WHERE cl.locale='ko' AND cl.slug='what-null-leaves-behind'` },
      { name: 'digest_query', sql: `SELECT udi.order_index,cl.slug FROM update_digest_items udi JOIN update_digests d ON d.id=udi.digest_id JOIN content_localizations cl ON cl.id=udi.update_localization_id WHERE d.digest_date='2026-07-02' ORDER BY udi.order_index` },
    ];
    for (const query of queries) {
      const values: number[] = [];
      for (let index = 0; index < 20; index++) values.push(await time(() => pool!.query(query.sql)));
      samples.push({ name: query.name, values });
    }
    const transactionValues: number[] = [];
    for (let index = 0; index < 20; index++) {
      transactionValues.push(await time(async () => {
        const client = await pool!.connect();
        try { await client.query('BEGIN'); await client.query('SELECT 1'); await client.query('ROLLBACK'); } finally { client.release(); }
      }));
    }
    samples.push({ name: 'short_readonly_transaction', values: transactionValues });
    const report = {
      environment: 'local macOS process to Neon Singapore staging',
      region: 'AWS Singapore ap-southeast-1 (user-confirmed)',
      vercelSin1: 'blocked_not_configured',
      measurements: samples.map(summarize),
      controlledPublishTransaction: 'not_run_to_avoid_staging_published_write',
      credentialsLogged: false,
      disclaimer: 'Development measurement; not an SLA.',
    };
    await writeFile(path.join(outputDirectory, 'neon-latency-report.json'), `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
    console.log(`Neon latency: ${report.measurements.length} local-to-Singapore measurements recorded; sin1 blocked`);
  } catch (error) {
    console.error(`Neon latency: ${error instanceof Error && error.message.startsWith('blocked_') ? error.message : safeError(error)}; credentials redacted`);
    process.exitCode = 2;
  } finally {
    await pool?.end().catch(() => undefined);
  }
}

void main();
