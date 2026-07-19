import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
import { loadStagingEnvironment, safeError } from './env';

const expectedMigrations = ['0000_initial.sql', '0001_legacy_import.sql', '0002_staging_operations.sql', '0003_import_batch_recovery.sql', '0004_knowledge_and_lectures.sql'];

async function main() {
  let pool: Pool | undefined;
  try {
    const { pooled } = await loadStagingEnvironment();
    pool = new Pool({ connectionString: pooled, max: 1, connectionTimeoutMillis: 10_000 });
    const expectedChecksums = new Map<string, string>();
    for (const name of expectedMigrations) {
      expectedChecksums.set(name, createHash('sha256').update(await readFile(`drizzle/${name}`, 'utf8')).digest('hex'));
    }
    const identity = (await pool.query<{ database_name: string; role_name: string; version_number: string }>(`SELECT current_database() AS database_name,current_user AS role_name,current_setting('server_version_num') AS version_number`)).rows[0]!;
    const migrations = await pool.query<{ name: string; checksum: string }>(`SELECT name,checksum FROM schema_migrations ORDER BY name`);
    const migrationSetMatches = migrations.rows.length === expectedMigrations.length && migrations.rows.every((row, index) => row.name === expectedMigrations[index] && row.checksum === expectedChecksums.get(row.name));
    const counts = (await pool.query<{ identities: number; localizations: number; published_pointers: number; local_owner_identities: number }>(`SELECT
      (SELECT count(*)::int FROM legacy_identities) AS identities,
      (SELECT count(*)::int FROM content_localizations) AS localizations,
      (SELECT count(*)::int FROM content_localizations WHERE current_published_version_id IS NOT NULL) AS published_pointers,
      (SELECT count(*)::int FROM external_identities WHERE provider='local_owner') AS local_owner_identities`)).rows[0]!;
    const privileges = (await pool.query<{ can_create_owner: boolean }>(`SELECT bool_and(has_table_privilege(current_user,table_name,'INSERT')) AS can_create_owner FROM (VALUES ('actors'),('external_identities'),('actor_role_memberships')) AS required(table_name)`)).rows[0]!;
    const noProductionMarker = !/(^|[-_])prod(uction)?($|[-_])/i.test(identity.database_name) && !/(^|[-_])prod(uction)?($|[-_])/i.test(identity.role_name);
    const safe = Math.floor(Number(identity.version_number) / 10_000) === 17 && migrationSetMatches && counts.identities === 18 && counts.localizations >= 22 && counts.published_pointers === 0 && counts.local_owner_identities <= 1 && privileges.can_create_owner && noProductionMarker;
    console.log(JSON.stringify({ status: safe ? 'safe_for_staging_cms' : 'blocked_staging_cms_preflight', postgresMajor: Math.floor(Number(identity.version_number) / 10_000), migrations: migrations.rows.map((row) => row.name), migrationChecksumsMatch: migrationSetMatches, legacyIdentities: counts.identities, localizations: counts.localizations, publishedPointers: counts.published_pointers, localOwnerIdentities: counts.local_owner_identities, runtimeCanCreateOwner: privileges.can_create_owner, productionMarkerAbsent: noProductionMarker, credentialsLogged: false }));
    if (!safe) process.exitCode = 2;
  } catch (error) {
    console.error(`CMS staging preflight: ${safeError(error)}; credentials redacted`);
    process.exitCode = 2;
  } finally { await pool?.end().catch(() => undefined); }
}

void main();
