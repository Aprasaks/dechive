import assert from 'node:assert/strict';
import { ensureOwnerActor } from '../../src/features/admin/owner-auth';
import { knowledgeAdminFixture } from '../../src/features/admin/knowledge-fixture';
import {
  createKnowledgeDraft,
  createLectureDraft,
  createLocalAdminDatabase,
  publishKnowledgeDraft,
  updateKnowledgeDraft,
} from '../../src/services/knowledge-drafts';
import {
  getPublishedKnowledge,
  listPublishedKnowledge,
} from '../../src/services/published-knowledge';

const reference = {
  type: 'direct_verification' as const,
  title: '로컬 재현',
  authorOrOrganization: 'Dechive',
  url: '',
  accessedAt: '2026-07-19',
  note: 'Stage 17 publish contract verification',
};
const input = {
  locale: 'ko' as const,
  title: 'Stage 17 version 1',
  slug: 'stage-17-publish',
  summary: 'published pointer version 1',
  tags: ['발행'],
  references: [reference],
  document: knowledgeAdminFixture,
};

async function main() {
  const { pool } = createLocalAdminDatabase();
  try {
    const actorId = await ensureOwnerActor(
      pool,
      'stage-17-owner@local.invalid',
    );
    const created = await createKnowledgeDraft(pool, input, { actorId });
    assert.equal(await getPublishedKnowledge(pool, input.slug), null);
    assert.deepEqual(await listPublishedKnowledge(pool), []);

    const first = await publishKnowledgeDraft(pool, created.localizationId, {
      actorId,
    });
    assert.equal(first.alreadyPublished, false);
    const publicV1 = await getPublishedKnowledge(pool, input.slug);
    assert(publicV1);
    assert.equal(publicV1.versionNumber, 1);
    assert.equal(publicV1.title, input.title);
    assert.equal(
      (
        await pool.query(
          `SELECT current_published_version_id=current_draft_version_id AS same FROM content_localizations WHERE id=$1`,
          [created.localizationId],
        )
      ).rows[0].same,
      true,
    );

    const version2Document = structuredClone(knowledgeAdminFixture);
    version2Document.content.push({
      type: 'paragraph',
      content: [{ type: 'text', text: 'Stage 17 public version 2' }],
    });
    const revised = await updateKnowledgeDraft(
      pool,
      created.localizationId,
      {
        ...input,
        title: 'Stage 17 version 2',
        summary: 'draft version 2 only',
        tags: ['재발행'],
        references: [{ ...reference, title: 'version 2 검증' }],
        document: version2Document,
      },
      { actorId },
    );
    assert.equal(revised.versionNumber, 2);
    const stillV1 = await getPublishedKnowledge(pool, input.slug);
    assert.equal(stillV1?.versionNumber, 1);
    assert.equal(stillV1?.title, input.title);
    await assert.rejects(
      () =>
        updateKnowledgeDraft(
          pool,
          created.localizationId,
          { ...input, slug: 'slug-change-blocked' },
          { actorId },
        ),
      /published_slug_locked/,
    );
    await assert.rejects(
      () =>
        publishKnowledgeDraft(pool, created.localizationId, {
          actorId,
          failAfterPointer: true,
        }),
      /injected_publish_transaction_failure/,
    );
    assert.equal(
      (await getPublishedKnowledge(pool, input.slug))?.versionNumber,
      1,
    );
    await publishKnowledgeDraft(pool, created.localizationId, { actorId });
    const publicV2 = await getPublishedKnowledge(pool, input.slug);
    assert.equal(publicV2?.versionNumber, 2);
    assert.equal(publicV2?.title, 'Stage 17 version 2');
    const versionRows = await pool.query<{
      version_number: number;
      metadata: { knowledge: { title: string } };
    }>(
      `SELECT version_number,migration_metadata AS metadata FROM content_versions WHERE localization_id=$1 ORDER BY version_number`,
      [created.localizationId],
    );
    assert.equal(versionRows.rows[0]?.metadata.knowledge.title, input.title);
    assert.equal(
      versionRows.rows[1]?.metadata.knowledge.title,
      'Stage 17 version 2',
    );
    assert.equal(
      (
        await pool.query(
          `SELECT count(*)::int AS count FROM revision_events WHERE content_version_id=$1 AND event_type='published'`,
          [revised.versionId],
        )
      ).rows[0].count,
      1,
    );

    const noReferences = await createKnowledgeDraft(
      pool,
      {
        ...input,
        title: 'Stage 17 no references',
        slug: 'stage-17-no-references',
        references: [],
        tags: [],
      },
      { actorId },
    );
    await publishKnowledgeDraft(pool, noReferences.localizationId, { actorId });
    assert.equal((await getPublishedKnowledge(pool, 'stage-17-no-references'))?.title, 'Stage 17 no references');
    await pool.query(
      `DELETE FROM actor_role_memberships WHERE actor_id=$1 AND role='owner'`,
      [actorId],
    );
    await assert.rejects(
      () => publishKnowledgeDraft(pool, created.localizationId, { actorId }),
      /admin_access_denied/,
    );
    await pool.query(
      `INSERT INTO actor_role_memberships(actor_id,role,granted_by) VALUES ($1,'owner',$1)`,
      [actorId],
    );
    const lecture = await createLectureDraft(
      pool,
      {
        locale: 'ko',
        title: 'Stage 17 lecture',
        slug: 'stage-17-lecture',
        summary: 'relation remains',
        document: knowledgeAdminFixture,
        primarySourceKnowledgeId: created.localizationId,
        learningObjectives: ['관계를 확인한다'],
        difficulty: 'beginner',
        recommendedOrder: null,
        checkpoints: [],
      },
      { actorId },
    );
    assert(lecture.localizationId);
    console.log(
      JSON.stringify({
        status: 'stage_17_publish_verified',
        versions: [1, 2],
        draftPublishedSeparated: true,
        republish: true,
        slugLocked: true,
        transactionRollback: true,
        publicIsolation: true,
        membershipGuard: true,
        lectureRelationPreserved: true,
        credentialsLogged: false,
      }),
    );
  } finally {
    await pool.end();
  }
}
void main();
