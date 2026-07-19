import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createDatabase } from '../../src/db/client';

async function main() {
 const { pool } = createDatabase();
 try {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())`);
  const directory = path.resolve('drizzle');
  for (const name of (await readdir(directory)).filter((entry) => entry.endsWith('.sql')).sort()) {
    const raw = await readFile(path.join(directory, name), 'utf8');
    const checksum = createHash('sha256').update(raw).digest('hex');
    const applied = await pool.query<{ checksum: string }>('SELECT checksum FROM schema_migrations WHERE name = $1', [name]);
    if (applied.rows[0]) {
      if (applied.rows[0].checksum !== checksum) throw new Error(`Applied migration changed: ${name}`);
      continue;
    }
    const sql = raw.replaceAll('--> statement-breakpoint', '');
    await pool.query('BEGIN');
    try {
      await pool.query(sql);
      await pool.query('INSERT INTO schema_migrations (name, checksum) VALUES ($1,$2)', [name, checksum]);
      await pool.query('COMMIT');
      console.log(`applied ${name}`);
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  }
 } finally {
   await pool.end();
 }
}
void main();
