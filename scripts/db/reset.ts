import { createDatabase, LOCAL_TEST_DATABASE_URL } from '../../src/db/client';

async function main() {
  const url = process.env.DATABASE_URL ?? LOCAL_TEST_DATABASE_URL;
  const parsed = new URL(url);
  if (!['127.0.0.1', 'localhost'].includes(parsed.hostname) || parsed.pathname !== '/dechive_test') {
    throw new Error('Refusing reset: only the local dechive_test database is allowed');
  }
  const { pool } = createDatabase(url);
  try {
    await pool.query('DROP SCHEMA public CASCADE');
    await pool.query('CREATE SCHEMA public');
    console.log('reset local dechive_test public schema');
  } finally {
    await pool.end();
  }
}
void main();
