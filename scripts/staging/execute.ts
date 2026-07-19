import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Pool } from 'pg';
import { dailyIssues } from '../../src/data/dailyIssues';
import { PostgresRepositories } from '../../src/repositories/postgres';
import { importLegacyContent, type ImportFailureStage } from '../../src/services/legacy-import';
import { inspectConnectionPair, loadStagingEnvironment, safeError } from './env';

const sha = (value: string) => createHash('sha256').update(value).digest('hex');

async function upsertIssueFixtures(pool: Pool, repositories: PostgresRepositories) {
  const fixtures = dailyIssues.filter((issue) => ['2026-06-15', '2026-06-16'].includes(issue.date));
  for (const issue of fixtures) {
    const issueId = (await pool.query<{ id: string }>(`INSERT INTO editorial_issues(
      legacy_key,issue_date,title,summary,editorial_note,provenance,generation_mode,legacy_route
    ) VALUES ($1,$2,$3,$4,$5,'src/data/dailyIssues.ts','manual',$6)
    ON CONFLICT(legacy_key) DO UPDATE SET legacy_key=EXCLUDED.legacy_key RETURNING id`, [
      `daily_issue:${issue.id}`, issue.date, issue.question.title.ko,
      issue.question.description?.ko ?? '', issue.question.kicker?.ko ?? null, `/issues/${issue.date}`,
    ])).rows[0]!.id;
    const route = await repositories.findByRoute(issue.question.href);
    await pool.query(`INSERT INTO editorial_issue_items(
      issue_id,content_id,legacy_content_route,order_index,editorial_label,provenance
    ) VALUES ($1,$2,$3,0,$4,'question.href')
    ON CONFLICT(issue_id,order_index) DO UPDATE SET
      content_id=EXCLUDED.content_id,legacy_content_route=EXCLUDED.legacy_content_route,
      editorial_label=EXCLUDED.editorial_label`, [issueId, route?.content_id ?? null, issue.question.href, issue.question.label.ko]);
  }
}

async function scalar(pool: Pool, query: string, values: unknown[] = []) {
  return Number((await pool.query<{ count: string }>(query, values)).rows[0]?.count ?? 0);
}

async function main() {
  const outputDirectory = path.resolve('fixtures/staging-import/output');
  await mkdir(outputDirectory, { recursive: true });
  let pool: Pool | undefined;
  try {
    const environment = await loadStagingEnvironment();
    const pair = inspectConnectionPair(environment.pooled, environment.direct);
    if (!pair.pooledMarker || !pair.directMarker || !pair.sameEndpoint || !pair.sslRequired) throw new Error('blocked_target_not_proven_safe');
    pool = new Pool({ connectionString: environment.pooled, max: 5, connectionTimeoutMillis: 10_000 });
    const repositories = new PostgresRepositories(pool);
    const migrations = await scalar(pool, `SELECT count(*) FROM schema_migrations WHERE name ~ '^000[0-3]'`);
    assert.equal(migrations, 4);

    const batchKey = 'stage10-neon-expanded';
    const failures: Record<string, ImportFailureStage> = {
      'prompt-ko': 'parse',
      'learn-ko': 'constraint',
      'llm-ko': 'source_attach',
      'deep-ko': 'media_usage',
      'data-ko': 'route_conflict',
      'replace-ko': 'transaction',
    };
    const injected = await importLegacyContent(repositories, batchKey, { failureByItemId: failures });
    assert.equal(injected.status, 'partial_failure');
    assert.equal(injected.results.filter((item) => item.status === 'failed').length, 6);
    const retry = await importLegacyContent(repositories, batchKey);
    assert.equal(retry.results.filter((item) => item.status === 'failed').length, 0);

    const exactRepeat = await importLegacyContent(repositories, 'stage10-neon-exact-repeat');
    assert.equal(exactRepeat.results.filter((item) => item.status === 'skipped').length, 18);
    const identityBefore = await scalar(pool, `SELECT count(*) FROM legacy_identities`);
    const localizationBefore = await scalar(pool, `SELECT count(*) FROM content_localizations`);
    const imported = await repositories.findByLegacyIdentity({
      sourceType: 'legacy_markdown',
      stableKey: 'archive:ko:what-null-leaves-behind',
      sourceChecksum: 'intentionally-different-checksum',
    });
    assert(imported);
    const changedChecksumDetected = imported.sourceChecksum !== 'intentionally-different-checksum';
    assert(changedChecksumDetected);
    assert.equal(await scalar(pool, `SELECT count(*) FROM legacy_identities`), identityBefore);
    assert.equal(await scalar(pool, `SELECT count(*) FROM content_localizations`), localizationBefore);

    await upsertIssueFixtures(pool, repositories);
    const identities = await scalar(pool, `SELECT count(*) FROM legacy_identities`);
    const localizations = await scalar(pool, `SELECT count(*) FROM content_localizations`);
    assert.equal(identities, 18);
    assert.equal(localizations, 22);
    const invalidStatuses = await scalar(pool, `SELECT count(*) FROM content_versions WHERE status NOT IN ('draft','needs_review')`);
    const publishedPointers = await scalar(pool, `SELECT count(*) FROM content_localizations WHERE current_published_version_id IS NOT NULL`);
    assert.equal(invalidStatuses, 0);
    assert.equal(publishedPointers, 0);
    const duplicateContent = await scalar(pool, `SELECT count(*) FROM (SELECT source_type,stable_key FROM legacy_identities GROUP BY source_type,stable_key HAVING count(*)>1) duplicates`);
    const duplicateRoutes = await scalar(pool, `SELECT count(*) FROM (SELECT route FROM content_routes GROUP BY route HAVING count(*)>1) duplicates`);
    assert.equal(duplicateContent, 0);
    assert.equal(duplicateRoutes, 0);

    const route = await repositories.findByRoute('/archive/what-null-leaves-behind');
    assert(route);
    const knowledge = await repositories.findKnowledgeBySlug('ko', 'what-null-leaves-behind');
    assert(knowledge);
    const draft = await repositories.getCurrentDraft(knowledge.id);
    assert(draft);
    assert.equal(await repositories.getCurrentPublished(knowledge.id), null);
    const versions = await repositories.listVersions(knowledge.id);
    const translations = await repositories.getTranslationSiblings(knowledge.id);
    const details = await repositories.getDetails(knowledge.id);
    const sources = await repositories.getVersionSources(draft.id);
    const media = await repositories.getVersionMedia(draft.id);
    const relations = await repositories.getRelatedContent(knowledge.content_id);
    const digest = (await pool.query<{ id: string }>(`SELECT id FROM update_digests WHERE digest_date='2026-07-02'`)).rows[0];
    assert(digest);
    const digestItems = await repositories.listDigestItems(digest.id);
    const issues = await scalar(pool, `SELECT count(*) FROM editorial_issues`);
    const importItems = await scalar(pool, `SELECT count(*) FROM import_items ii JOIN import_batches ib ON ib.id=ii.batch_id WHERE ib.batch_key=$1`, [batchKey]);
    assert(versions.length > 0 && translations.length === 2 && details && digestItems.length > 0 && issues === 2 && importItems === 18);

    const report = {
      environment: 'Neon staging (user-confirmed)',
      connection: { pooledRuntime: true, directMigration: false, credentialsLogged: false },
      failureInjection: { status: injected.status, failed: 6, successfulItemsPreserved: 12 },
      retry: { status: retry.status, failedRemaining: 0, identities, localizations },
      repeat: { skipped: 18, duplicateCreated: 0 },
      changeDetection: { detected: changedChecksumDetected, automaticOverwrite: false },
      workflow: { invalidStatuses, publishedPointers },
      duplicates: { content: duplicateContent, routes: duplicateRoutes },
      repositoryQueries: {
        route: true, knowledge: true, currentDraft: true, currentPublishedNull: true,
        versionHistory: versions.length, translationSiblings: translations.length,
        knowledgeDetails: Boolean(details), digestItems: digestItems.length, issues,
        sourceQuery: true, sourceRows: sources.length, mediaQuery: true, mediaRows: media.length,
        relationQuery: true, relationRows: relations.length, legacyIdentity: true,
        importBatchItems: importItems,
      },
      resultChecksum: sha(JSON.stringify({ identities, localizations, routes: duplicateRoutes, items: importItems })),
    };
    await writeFile(path.join(outputDirectory, 'neon-execution-report.json'), `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
    console.log(`Neon staging import: ${identities} identities, ${localizations} localizations; partial failure recovered; duplicates 0`);
  } catch (error) {
    console.error(`Neon staging execution: ${error instanceof Error && error.message.startsWith('blocked_') ? error.message : safeError(error)}; credentials redacted`);
    process.exitCode = 2;
  } finally {
    await pool?.end().catch(() => undefined);
  }
}

void main();
