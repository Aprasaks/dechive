import assert from 'node:assert/strict';
import { ensureOwnerActor } from '../../src/features/admin/owner-auth';
import { knowledgeAdminFixture } from '../../src/features/admin/knowledge-fixture';
import {
  createKnowledgeDraft,
  createLectureDraft,
  createLocalAdminDatabase,
  publishKnowledgeDraft,
  publishLectureDraft,
  updateLectureDraft,
  validateLecturePublishReadiness,
} from '../../src/services/knowledge-drafts';
import {
  getPublishedLecture,
  listPublishedLectures,
} from '../../src/services/published-lectures';

const reference = (title: string) => ({
  type: 'direct_verification' as const,
  title,
  authorOrOrganization: 'Dechive',
  url: '',
  accessedAt: '2026-07-19',
  note: '로컬 검증',
});

const base = {
  locale: 'ko' as const,
  title: 'Stage 22 강의 version 1',
  slug: 'stage-22-lecture',
  summary: '강의 발행 pointer를 확인하는 공개 자료입니다.',
  learningObjectives: ['발행된 강의와 Draft를 구분한다.'],
  difficulty: 'beginner' as const,
  recommendedOrder: null,
  checkpoints: ['공개 페이지를 확인한다.'],
  audience: '초보 Ai 사용자',
  estimatedDurationMinutes: 60,
  coreMessage: '질문의 수보다 검증 기준이 중요하다.',
  references: [reference('Reference A')],
  document: knowledgeAdminFixture,
};

async function main() {
  const { pool } = createLocalAdminDatabase();
  try {
    const actorId = await ensureOwnerActor(pool, 'stage22@local.invalid');
    const readiness = validateLecturePublishReadiness({
      ...base,
      title: ' ',
      slug: ' ',
      summary: ' ',
      document: { ...knowledgeAdminFixture, content: [] },
      primarySourceKnowledgeId: '',
      learningObjectives: [],
      coreMessage: ' ',
      references: [{ ...reference('invalid'), type: 'external', url: '' }],
    });
    for (const expected of [
      'title_required',
      'slug_invalid',
      'summary_required',
      'body_required',
      'primary_source_knowledge_required',
      'learning_objectives_required',
      'core_message_required',
      'external_reference_url_required',
    ]) assert(readiness.blockingErrors.includes(expected));

    const knowledge = await createKnowledgeDraft(
      pool,
      {
        locale: 'ko',
        title: 'Stage 22 기반 지식',
        slug: 'stage-22-knowledge',
        summary: '강의의 기반 지식입니다.',
        tags: ['검증'],
        references: [reference('Knowledge reference')],
        document: knowledgeAdminFixture,
      },
      { actorId },
    );
    const created = await createLectureDraft(
      pool,
      { ...base, primarySourceKnowledgeId: knowledge.localizationId },
      { actorId },
    );
    assert.equal(await getPublishedLecture(pool, base.slug), null);
    assert.deepEqual(await listPublishedLectures(pool), []);

    await publishLectureDraft(pool, created.localizationId, { actorId });
    const publicV1WithoutPrimary = await getPublishedLecture(pool, base.slug);
    assert.equal(publicV1WithoutPrimary?.versionNumber, 1);
    assert.equal(publicV1WithoutPrimary?.coreMessage, base.coreMessage);
    assert.equal(publicV1WithoutPrimary?.primaryKnowledge, null);

    await publishKnowledgeDraft(pool, knowledge.localizationId, { actorId });
    const publicV1 = await getPublishedLecture(pool, base.slug);
    assert.equal(publicV1?.primaryKnowledge?.slug, 'stage-22-knowledge');
    assert.equal(publicV1?.references[0]?.title, 'Reference A');

    const version2 = await updateLectureDraft(
      pool,
      created.localizationId,
      {
        ...base,
        title: 'Stage 22 강의 version 2',
        summary: 'Draft version 2만의 공개 전 설명입니다.',
        primarySourceKnowledgeId: knowledge.localizationId,
        audience: '실무에서 Ai를 사용하는 사람',
        estimatedDurationMinutes: 90,
        coreMessage: '좋은 후속 질문은 검증 대상을 분명히 한다.',
        references: [reference('Reference B')],
      },
      { actorId },
    );
    const stillV1 = await getPublishedLecture(pool, base.slug);
    assert.equal(stillV1?.versionNumber, 1);
    assert.equal(stillV1?.title, base.title);
    assert.equal(stillV1?.references[0]?.title, 'Reference A');
    await assert.rejects(
      () => updateLectureDraft(pool, created.localizationId, { ...base, slug: 'published-lecture-slug-change', primarySourceKnowledgeId: knowledge.localizationId }, { actorId }),
      /published_slug_locked/,
    );
    await assert.rejects(
      () => publishLectureDraft(pool, created.localizationId, { actorId, failAfterPointer: true }),
      /injected_publish_transaction_failure/,
    );
    assert.equal((await getPublishedLecture(pool, base.slug))?.versionNumber, 1);

    await publishLectureDraft(pool, created.localizationId, { actorId });
    const publicV2 = await getPublishedLecture(pool, base.slug);
    assert.equal(publicV2?.versionNumber, 2);
    assert.equal(publicV2?.title, 'Stage 22 강의 version 2');
    assert.equal(publicV2?.coreMessage, '좋은 후속 질문은 검증 대상을 분명히 한다.');
    assert.equal(publicV2?.references[0]?.title, 'Reference B');
    assert.equal(publicV2?.audience, '실무에서 Ai를 사용하는 사람');
    assert.equal(publicV2?.estimatedDurationMinutes, 90);
    assert.equal((await pool.query(`SELECT current_published_version_id=current_draft_version_id AS same FROM content_localizations WHERE id=$1`, [created.localizationId])).rows[0].same, true);
    assert.equal((await pool.query(`SELECT count(*)::int AS count FROM revision_events WHERE content_version_id=$1 AND event_type='published' AND actor_id=$2`, [version2.versionId, actorId])).rows[0].count, 1);

    const draftOnly = await createLectureDraft(
      pool,
      { ...base, title: 'Draft only lecture', slug: 'stage-22-draft-only', primarySourceKnowledgeId: knowledge.localizationId },
      { actorId },
    );
    assert.equal(await getPublishedLecture(pool, 'stage-22-draft-only'), null);
    assert.equal((await listPublishedLectures(pool)).some((item) => item.slug === draftOnly.route.split('/').at(-1)), false);
    await assert.rejects(
      () => createLectureDraft(pool, { ...base, title: 'Invalid primary source', slug: 'stage-22-invalid-source', primarySourceKnowledgeId: created.localizationId }, { actorId }),
      /knowledge_reference_invalid/,
    );

    await pool.query(`DELETE FROM actor_role_memberships WHERE actor_id=$1 AND role='owner'`, [actorId]);
    await assert.rejects(() => publishLectureDraft(pool, created.localizationId, { actorId }), /admin_access_denied/);
    await pool.query(`INSERT INTO actor_role_memberships(actor_id,role,granted_by) VALUES ($1,'owner',$1)`, [actorId]);
    console.log(JSON.stringify({ status: 'stage_22_publish_verified', readiness: true, pointer: [1, 2], rollback: true, publicIsolation: true, primaryKnowledgeVisibility: true, membershipGuard: true }));
  } finally {
    await pool.end();
  }
}

void main();
