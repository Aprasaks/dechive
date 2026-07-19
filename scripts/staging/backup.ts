import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Pool } from 'pg';
import { inspectConnectionPair, loadStagingEnvironment, safeError } from './env';

const sha = (value: string | Uint8Array) => createHash('sha256').update(value).digest('hex');

async function main() {
  const outputDirectory = path.resolve('fixtures/staging-import/output');
  await mkdir(outputDirectory, { recursive: true });
  let pool: Pool | undefined;
  try {
    const environment = await loadStagingEnvironment();
    const pair = inspectConnectionPair(environment.pooled, environment.direct);
    if (!pair.pooledMarker || !pair.directMarker || !pair.sameEndpoint || !pair.sslRequired) throw new Error('blocked_target_not_proven_safe');
    pool = new Pool({ connectionString: environment.pooled, max: 2, connectionTimeoutMillis: 10_000 });
    const migrations = (await pool.query(`SELECT name,checksum FROM schema_migrations ORDER BY name`)).rows;
    const identities = (await pool.query(`SELECT li.source_type AS "sourceType",li.source_path AS "sourcePath",
      li.stable_key AS "stableKey",li.source_checksum AS "sourceChecksum",li.imported_checksum AS "importedChecksum",
      li.importer_version AS "importerVersion",cl.locale,cl.slug,cl.title,cl.summary,cr.route,
      cv.version_number AS "versionNumber",cv.schema_version AS "schemaVersion",cv.status,
      cv.canonical_document AS "canonicalDocument",cv.document_checksum AS "documentChecksum",
      cv.validation_status AS "validationStatus",cv.validation_warnings AS "validationWarnings",
      kd.format,kd.depth
      FROM legacy_identities li
      LEFT JOIN content_localizations cl ON cl.id=li.localization_id
      LEFT JOIN content_versions cv ON cv.id=cl.current_draft_version_id
      LEFT JOIN content_routes cr ON cr.localization_id=cl.id AND cr.is_canonical
      LEFT JOIN knowledge_details kd ON kd.localization_id=cl.id
      WHERE li.localization_id IS NOT NULL ORDER BY li.stable_key`)).rows;
    const digests = (await pool.query(`SELECT li.stable_key AS "stableKey",li.source_checksum AS "sourceChecksum",
      d.digest_date AS date,d.locale,d.title,d.editorial_summary AS "editorialSummary",cr.route,
      (SELECT jsonb_agg(jsonb_build_object('order',udi.order_index,'slug',cl.slug,'title',cl.title,
        'legacyAnchor',cv.migration_metadata->>'legacyAnchor') ORDER BY udi.order_index)
       FROM update_digest_items udi JOIN content_localizations cl ON cl.id=udi.update_localization_id
       JOIN content_versions cv ON cv.id=cl.current_draft_version_id WHERE udi.digest_id=d.id) AS items
      FROM legacy_identities li JOIN update_digests d ON d.id=li.digest_id
      LEFT JOIN content_routes cr ON cr.digest_id=d.id AND cr.is_canonical ORDER BY li.stable_key`)).rows;
    const issues = (await pool.query(`SELECT legacy_key AS "stableKey",issue_date AS date,locale,title,summary,
      editorial_note AS "editorialNote",provenance,generation_mode AS "generationMode",legacy_route AS route,
      (SELECT jsonb_agg(jsonb_build_object('order',order_index,'route',legacy_content_route,'label',editorial_label)
       ORDER BY order_index) FROM editorial_issue_items WHERE issue_id=editorial_issues.id) AS items
      FROM editorial_issues ORDER BY legacy_key`)).rows;
    const sources = (await pool.query(`SELECT s.source_type AS "sourceType",s.title,s.canonical_url AS "canonicalUrl",
      s.review_status AS "reviewStatus",li.stable_key AS "contentStableKey",cs.role,cs.locator,cs.source_checked_at AS "checkedAt"
      FROM content_sources cs JOIN sources s ON s.id=cs.source_id
      JOIN content_versions cv ON cv.id=cs.content_version_id JOIN content_localizations cl ON cl.id=cv.localization_id
      LEFT JOIN legacy_identities li ON li.localization_id=cl.id ORDER BY li.stable_key,s.canonical_url`)).rows;
    const media = (await pool.query(`SELECT li.stable_key AS "contentStableKey",ma.status,ma.source_url AS "legacyPath",
      ma.checksum,mu.usage_type AS "usageType",mu.alt,mu.caption,mu.order_index AS "order",mu.metadata
      FROM media_usages mu JOIN media_assets ma ON ma.id=mu.media_id
      JOIN content_versions cv ON cv.id=mu.content_version_id JOIN content_localizations cl ON cl.id=cv.localization_id
      LEFT JOIN legacy_identities li ON li.localization_id=cl.id ORDER BY li.stable_key,mu.order_index`)).rows;
    const routes = (await pool.query(`SELECT cr.route,cr.route_type AS "routeType",cr.is_canonical AS "isCanonical",
      li.stable_key AS "contentStableKey",dli.stable_key AS "digestStableKey"
      FROM content_routes cr LEFT JOIN legacy_identities li ON li.localization_id=cr.localization_id
      LEFT JOIN legacy_identities dli ON dli.digest_id=cr.digest_id ORDER BY cr.route`)).rows;
    const portable = {
      format: 'dechive-portable-export', formatVersion: 1, sourceEnvironment: 'Neon staging',
      migrations, identities, digests, issues, sources, media, routes,
    };
    const serialized = `${JSON.stringify(portable, null, 2)}\n`;
    const dataChecksum = sha(serialized);
    let logicalBackupChecksum: string | null = null;
    try {
      logicalBackupChecksum = sha(await readFile(path.join(outputDirectory, 'neon-staging.dump')));
    } catch {
      // The portable export remains valid when pg_dump has not run yet.
    }
    const manifest = {
      formatVersion: 1,
      algorithms: { content: 'sha256' },
      counts: { identities: identities.length, digests: digests.length, issues: issues.length, sources: sources.length, media: media.length, routes: routes.length },
      portableExportChecksum: dataChecksum,
      logicalBackupChecksum,
      migrationCount: migrations.length,
      secretsIncluded: false,
    };
    await writeFile(path.join(outputDirectory, 'neon-portable-export.json'), serialized, { mode: 0o600 });
    await writeFile(path.join(outputDirectory, 'neon-backup-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });
    console.log(`Neon portable export: ${identities.length} identities; checksum manifest created; secrets excluded`);
  } catch (error) {
    console.error(`Neon backup export: ${error instanceof Error && error.message.startsWith('blocked_') ? error.message : safeError(error)}; credentials redacted`);
    process.exitCode = 2;
  } finally {
    await pool?.end().catch(() => undefined);
  }
}

void main();
