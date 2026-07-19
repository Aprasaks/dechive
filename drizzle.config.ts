import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgresql://dechive:dechive_local_only@127.0.0.1:55432/dechive_test',
  },
  strict: true,
  verbose: true,
});
