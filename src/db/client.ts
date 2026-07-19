import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const LOCAL_TEST_DATABASE_URL = 'postgresql://dechive:dechive_local_only@127.0.0.1:55432/dechive_test';

export function createDatabase(url = process.env.DATABASE_URL ?? LOCAL_TEST_DATABASE_URL) {
  const pool = new Pool({ connectionString: url, max: 5 });
  return { pool, db: drizzle(pool, { schema }) };
}
