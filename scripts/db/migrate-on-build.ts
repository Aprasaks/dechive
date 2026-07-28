import { spawnSync } from 'node:child_process';

if (process.env.RUN_DB_MIGRATIONS !== 'true') {
  console.log('database migrations skipped');
} else {
  const result = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/db/migrate.ts'], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`database_migration_failed:${result.status ?? 'unknown'}`);
}
