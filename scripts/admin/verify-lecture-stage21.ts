import assert from 'node:assert/strict';

import { ensureOwnerActor } from '../../src/features/admin/owner-auth';
import { knowledgeAdminFixture } from '../../src/features/admin/knowledge-fixture';
import {
  createKnowledgeDraft,
  createLectureDraft,
  createLocalAdminDatabase,
  getLectureDraft,
  updateLectureDraft,
} from '../../src/services/knowledge-drafts';

const reference = (title: string) => ({
  type: 'direct_verification' as const,
  title,
  authorOrOrganization: '',
  url: '',
  accessedAt: '',
  note: 'verified',
});

type VersionMetadata = {
  lecture?: {
    coreMessage?: string;
    references?: Array<{ title?: string }>;
  };
};

async function main() {
  const { pool } = createLocalAdminDatabase();

  try {
    const migration = await pool.query<{ name: string }>(
      `SELECT name FROM schema_migrations WHERE name = '0005_lecture_draft_metadata.sql'`,
    );
    assert.equal(migration.rowCount, 1);

    const columns = await pool.query<{ column_name: string; data_type: string; is_nullable: string }>(
      `SELECT column_name, data_type, is_nullable
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'lecture_details'
         AND column_name IN ('audience', 'estimated_duration_minutes')`,
    );
    assert.deepEqual(
      columns.rows.sort((a, b) => a.column_name.localeCompare(b.column_name)),
      [
        { column_name: 'audience', data_type: 'text', is_nullable: 'YES' },
        { column_name: 'estimated_duration_minutes', data_type: 'integer', is_nullable: 'YES' },
      ],
    );
    const durationConstraint = await pool.query<{ definition: string }>(
      `SELECT pg_get_constraintdef(oid) AS definition
       FROM pg_constraint
       WHERE conname = 'lecture_duration_positive'`,
    );
    assert.match(durationConstraint.rows[0]?.definition ?? '', /estimated_duration_minutes.*>= 1/i);

    const actorId = await ensureOwnerActor(pool, 'stage21@local.invalid');
    const knowledge = await createKnowledgeDraft(
      pool,
      {
        title: 'Stage 21 Knowledge',
        slug: 'stage21-knowledge',
        locale: 'ko',
        summary: 'Stage 21 verification knowledge.',
        tags: [],
        references: [reference('Knowledge reference')],
        document: knowledgeAdminFixture,
      },
      { actorId },
    );
    const knowledgeVersionCount = await pool.query<{ count: number }>(
      `SELECT count(*)::int AS count FROM content_versions WHERE localization_id = $1`,
      [knowledge.localizationId],
    );
    assert.equal(knowledgeVersionCount.rows[0]?.count, 1);

    const base = {
      title: 'Stage 21 Lecture',
      slug: 'stage21-lecture',
      locale: 'ko' as const,
      summary: 'Stage 21 verification lecture.',
      primarySourceKnowledgeId: knowledge.localizationId,
      learningObjectives: ['검증 흐름을 설명한다.'],
      difficulty: 'beginner' as const,
      recommendedOrder: null,
      checkpoints: [],
      document: knowledgeAdminFixture,
    };

    const version1 = await createLectureDraft(
      pool,
      {
        ...base,
        audience: '초보 Ai 사용자',
        estimatedDurationMinutes: 60,
        coreMessage: '질문의 수보다 검증 기준이 중요하다.',
        references: [reference('Reference A')],
      },
      { actorId },
    );
    const version2 = await updateLectureDraft(
      pool,
      version1.localizationId,
      {
        ...base,
        audience: '실무에서 Ai를 사용하는 사람',
        estimatedDurationMinutes: 90,
        coreMessage: '좋은 후속 질문은 검증 대상을 분명히 한다.',
        references: [reference('Reference B')],
      },
      { actorId },
    );

    const versions = await pool.query<{ version_number: number; metadata: VersionMetadata }>(
      `SELECT version_number, migration_metadata AS metadata
       FROM content_versions
       WHERE localization_id = $1
       ORDER BY version_number`,
      [version1.localizationId],
    );
    assert.equal(versions.rows.length, 2);
    assert.equal(versions.rows[0]?.metadata.lecture?.coreMessage, '질문의 수보다 검증 기준이 중요하다.');
    assert.equal(versions.rows[0]?.metadata.lecture?.references?.[0]?.title, 'Reference A');
    assert.equal(versions.rows[1]?.metadata.lecture?.coreMessage, '좋은 후속 질문은 검증 대상을 분명히 한다.');
    assert.equal(versions.rows[1]?.metadata.lecture?.references?.[0]?.title, 'Reference B');

    const pointer = await pool.query<{ current: boolean }>(
      `SELECT current_draft_version_id = $1 AS current
       FROM content_localizations
       WHERE id = $2`,
      [version2.versionId, version1.localizationId],
    );
    assert.equal(pointer.rows[0]?.current, true);

    const latestDetails = await pool.query<{
      audience: string | null;
      estimated_duration_minutes: number | null;
      primary_source_knowledge_id: string;
    }>(
      `SELECT audience, estimated_duration_minutes, primary_source_knowledge_id
       FROM lecture_details
       WHERE localization_id = $1`,
      [version1.localizationId],
    );
    assert.deepEqual(latestDetails.rows[0], {
      audience: '실무에서 Ai를 사용하는 사람',
      estimated_duration_minutes: 90,
      primary_source_knowledge_id: knowledge.contentId,
    });

    await pool.query(`UPDATE lecture_details SET estimated_duration_minutes = NULL WHERE localization_id = $1`, [version1.localizationId]);
    assert.equal((await pool.query<{ value: number | null }>(`SELECT estimated_duration_minutes AS value FROM lecture_details WHERE localization_id = $1`, [version1.localizationId])).rows[0]?.value, null);
    await pool.query(`UPDATE lecture_details SET estimated_duration_minutes = 1 WHERE localization_id = $1`, [version1.localizationId]);
    assert.equal((await pool.query<{ value: number | null }>(`SELECT estimated_duration_minutes AS value FROM lecture_details WHERE localization_id = $1`, [version1.localizationId])).rows[0]?.value, 1);
    await assert.rejects(() => pool.query(`UPDATE lecture_details SET estimated_duration_minutes = 0 WHERE localization_id = $1`, [version1.localizationId]));
    await assert.rejects(() => pool.query(`UPDATE lecture_details SET estimated_duration_minutes = -1 WHERE localization_id = $1`, [version1.localizationId]));
    await pool.query(`UPDATE lecture_details SET estimated_duration_minutes = 90 WHERE localization_id = $1`, [version1.localizationId]);

    const draft = await getLectureDraft(pool, version1.localizationId);
    assert.equal(draft?.versionNumber, 2);
    assert.equal(draft?.audience, '실무에서 Ai를 사용하는 사람');
    assert.equal(draft?.estimatedDurationMinutes, 90);
    assert.equal(draft?.primarySourceKnowledgeId, knowledge.localizationId);

    const revisionEvent = await pool.query<{ count: number }>(
      `SELECT count(*)::int AS count
       FROM revision_events
       WHERE content_version_id = $1 AND actor_id = $2`,
      [version2.versionId, actorId],
    );
    assert.equal(revisionEvent.rows[0]?.count, 1);
    const actor = await pool.query<{ created_by: string | null }>(
      `SELECT created_by FROM content_versions WHERE id = $1`,
      [version2.versionId],
    );
    assert.equal(actor.rows[0]?.created_by, actorId);
    const knowledgeVersionsAfterLectureSaves = await pool.query<{ count: number }>(
      `SELECT count(*)::int AS count FROM content_versions WHERE localization_id = $1`,
      [knowledge.localizationId],
    );
    assert.equal(knowledgeVersionsAfterLectureSaves.rows[0]?.count, 1);

    const legacy = await createLectureDraft(
      pool,
      {
        ...base,
        title: 'Legacy fallback lecture',
        slug: 'stage21-legacy-fallback',
      },
      { actorId },
    );
    await pool.query(`UPDATE lecture_details SET audience = NULL, estimated_duration_minutes = NULL WHERE localization_id = $1`, [legacy.localizationId]);
    await pool.query(`UPDATE content_versions SET migration_metadata = '{}'::jsonb WHERE id = $1`, [legacy.versionId]);
    const fallback = await getLectureDraft(pool, legacy.localizationId);
    assert.equal(fallback?.audience, '');
    assert.equal(fallback?.estimatedDurationMinutes, null);
    assert.equal(fallback?.coreMessage, '');
    assert.deepEqual(fallback?.references, []);
    assert.deepEqual(fallback?.document, knowledgeAdminFixture);
    assert.equal(fallback?.primarySourceKnowledgeId, knowledge.localizationId);

    console.log(
      JSON.stringify({
        status: 'stage21_verified',
        migration: '0005_lecture_draft_metadata.sql',
        versions: [1, 2],
        pointer: 2,
        duration: { null: true, one: true, zeroRejected: true, negativeRejected: true },
        fallback: true,
        events: true,
        knowledgeUnchanged: true,
      }),
    );
  } finally {
    await pool.end();
  }
}

void main();
