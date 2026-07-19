import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { Pool } from 'pg';
import { inspectConnectionPair, loadStagingEnvironment, safeError } from './env';

type Identity = {
  databaseName: string;
  roleName: string;
  versionNumber: number;
  recoveryState: boolean;
};

async function inspect(url: string): Promise<Identity> {
  const pool = new Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 10_000 });
  try {
    const result = await pool.query<{
      database_name: string;
      role_name: string;
      version_number: string;
      recovery_state: boolean;
    }>(`SELECT current_database() AS database_name,
      current_user AS role_name,
      current_setting('server_version_num') AS version_number,
      pg_is_in_recovery() AS recovery_state`);
    const row = result.rows[0];
    if (!row) throw new Error('identity_query_empty');
    return {
      databaseName: row.database_name,
      roleName: row.role_name,
      versionNumber: Number(row.version_number),
      recoveryState: row.recovery_state,
    };
  } finally {
    await pool.end().catch(() => undefined);
  }
}

async function main() {
  const outputDirectory = path.resolve('fixtures/staging-import/output');
  await mkdir(outputDirectory, { recursive: true });
  const reportPath = path.join(outputDirectory, 'neon-preflight.json');
  try {
    const environment = await loadStagingEnvironment();
    const pair = inspectConnectionPair(environment.pooled, environment.direct);
    const [pooledIdentity, directIdentity] = await Promise.all([
      inspect(environment.pooled),
      inspect(environment.direct),
    ]);
    const identityMatches = pooledIdentity.databaseName === directIdentity.databaseName
      && pooledIdentity.roleName === directIdentity.roleName
      && pooledIdentity.versionNumber === directIdentity.versionNumber;
    const postgres17 = Math.floor(directIdentity.versionNumber / 10_000) === 17;
    const safetyEvidence = {
      userDeclaredProject: 'dechive-content',
      userDeclaredBranch: 'staging',
      userDeclaredParent: 'production',
      userDeclaredRegion: 'AWS Singapore ap-southeast-1',
      endpointPairMatches: pair.sameEndpoint,
      databaseAndRoleMatch: identityMatches,
      productionEnvironmentVariablesUsed: false,
      databaseNameContainsProductionMarker: /(^|[-_])prod(uction)?($|[-_])/i.test(directIdentity.databaseName),
      roleNameContainsProductionMarker: /(^|[-_])prod(uction)?($|[-_])/i.test(directIdentity.roleName),
    };
    const safeForStaging = pair.pooledMarker
      && pair.directMarker
      && pair.sameEndpoint
      && pair.sameDatabase
      && pair.sameRole
      && pair.sslRequired
      && identityMatches
      && postgres17
      && !safetyEvidence.databaseNameContainsProductionMarker
      && !safetyEvidence.roleNameContainsProductionMarker;
    const report = {
      status: safeForStaging ? 'safe_for_staging' : 'blocked_target_not_proven_safe',
      credentials: { pooled: 'configured', direct: 'configured', valuesLogged: false },
      connectionRoles: pair,
      connection: {
        pooledReachable: true,
        directReachable: true,
        databaseIdentityMatches: pooledIdentity.databaseName === directIdentity.databaseName,
        roleIdentityMatches: pooledIdentity.roleName === directIdentity.roleName,
        postgresMajor: Math.floor(directIdentity.versionNumber / 10_000),
        recoveryState: directIdentity.recoveryState,
      },
      safetyEvidence,
      safeForStaging,
    };
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
    console.log(`Neon preflight: ${report.status}; credentials redacted`);
    if (!safeForStaging) process.exitCode = 2;
  } catch (error) {
    const reason = error instanceof Error && error.message.startsWith('blocked_') ? error.message : safeError(error);
    await writeFile(reportPath, `${JSON.stringify({ status: reason, credentialsLogged: false }, null, 2)}\n`, { mode: 0o600 });
    console.error(`Neon preflight: ${reason}; credentials redacted`);
    process.exitCode = 2;
  }
}

void main();
