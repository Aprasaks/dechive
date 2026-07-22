import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { createDatabase } from '../../src/db/client';

type KindSummary = {
  kind: string;
  localizations: number;
  publishedPointers: number;
};

async function main() {
  const { pool } = createDatabase();
  try {
    const table = (await pool.query<{ exists: boolean }>(
      `SELECT to_regclass('public.content_localizations') IS NOT NULL AS exists`,
    )).rows[0]?.exists ?? false;
    if (!table) {
      console.log(JSON.stringify({ status: 'blocked', reason: 'content_localizations_missing' }));
      process.exitCode = 2;
      return;
    }

    const [kinds, pointers, column, constraint, migrationTable] = await Promise.all([
      pool.query<KindSummary>(
        `SELECT c.kind::text AS kind,
                count(*)::int AS localizations,
                count(*) FILTER (WHERE cl.current_published_version_id IS NOT NULL)::int AS "publishedPointers"
           FROM content_localizations cl
           JOIN contents c ON c.id = cl.content_id
          GROUP BY c.kind
          ORDER BY c.kind`,
      ),
      pool.query<{
        pointerVersionMissing: number;
        pointerVersionNotPublished: number;
      }>(
        `SELECT
           count(*) FILTER (
             WHERE cl.current_published_version_id IS NOT NULL
               AND cv.id IS NULL
           )::int AS "pointerVersionMissing",
           count(*) FILTER (
             WHERE cl.current_published_version_id IS NOT NULL
               AND cv.id IS NOT NULL
               AND cv.status IS DISTINCT FROM 'published'
           )::int AS "pointerVersionNotPublished"
         FROM content_localizations cl
         LEFT JOIN content_versions cv
           ON cv.id = cl.current_published_version_id`,
      ),
      pool.query<{ exists: boolean }>(
        `SELECT EXISTS (
           SELECT 1
             FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'content_localizations'
              AND column_name = 'workflow_status'
         ) AS exists`,
      ),
      pool.query<{
        exists: boolean;
        validated: boolean | null;
        definition: string | null;
      }>(
        `SELECT
           EXISTS (
             SELECT 1
               FROM pg_constraint pc
              WHERE pc.conrelid = 'public.content_localizations'::regclass
                AND pc.conname = 'knowledge_workflow_status_valid'
           ) AS exists,
           (
             SELECT pc.convalidated
               FROM pg_constraint pc
              WHERE pc.conrelid = 'public.content_localizations'::regclass
                AND pc.conname = 'knowledge_workflow_status_valid'
              LIMIT 1
           ) AS validated,
           (
             SELECT pg_get_constraintdef(pc.oid)
               FROM pg_constraint pc
              WHERE pc.conrelid = 'public.content_localizations'::regclass
                AND pc.conname = 'knowledge_workflow_status_valid'
              LIMIT 1
           ) AS definition`,
      ),
      pool.query<{ exists: boolean }>(
        `SELECT to_regclass('public.schema_migrations') IS NOT NULL AS exists`,
      ),
    ]);

    const migrationFiles = (await readdir(path.resolve('drizzle')))
      .filter((name) => name.endsWith('.sql'))
      .sort();
    const appliedRows = migrationTable.rows[0]?.exists
      ? (await pool.query<{ name: string; appliedAt: string }>(
          `SELECT name, applied_at AS "appliedAt"
             FROM schema_migrations
            ORDER BY applied_at ASC, name ASC`,
        )).rows
      : [];
    const applied = appliedRows.map((row) => row.name);
    const pending = migrationFiles.filter((name) => !applied.includes(name));
    const pointer = pointers.rows[0] ?? {
      pointerVersionMissing: 0,
      pointerVersionNotPublished: 0,
    };
    const workflowColumnExists = column.rows[0]?.exists ?? false;
    const workflowConstraint = constraint.rows[0] ?? {
      exists: false,
      validated: null,
      definition: null,
    };
    const constraintDefinitionLooksExpected =
      workflowConstraint.definition !== null &&
      ['draft', 'published', 'withdrawn', 'archived'].every((value) =>
        workflowConstraint.definition!.toLowerCase().includes(value),
      );
    const blocked =
      !workflowColumnExists ||
      !workflowConstraint.exists ||
      !constraintDefinitionLooksExpected ||
      pointer.pointerVersionMissing > 0 ||
      pointer.pointerVersionNotPublished > 0;

    console.log(JSON.stringify({
      status: blocked ? 'attention_required' : 'ready',
      localizationCountsByKind: kinds.rows,
      publishedPointerCountsByKind: kinds.rows.map((row) => ({
        kind: row.kind,
        publishedPointers: row.publishedPointers,
      })),
      invalidPublishedPointers: pointer,
      workflowStatus: {
        columnExists: workflowColumnExists,
        constraintExists: workflowConstraint.exists,
        constraintValidated: workflowConstraint.validated,
        constraintDefinitionLooksExpected,
        constraintDefinition: workflowConstraint.definition,
      },
      migrations: {
        lastApplied: appliedRows.at(-1)?.name ?? null,
        pending,
      },
    }));
    if (blocked) process.exitCode = 2;
  } finally {
    await pool.end();
  }
}

void main();
