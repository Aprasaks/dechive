import assert from 'node:assert/strict';
import { createDatabase } from '../../src/db/client';
import { checksum, publishVersion } from '../../src/db/publish';

const { pool } = createDatabase();
const document = { schemaVersion: 2, type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '검증' }] }] };
const documentChecksum = checksum(JSON.stringify(document));
const artifacts = [
  { type: 'rendered_html' as const, body: '<p>검증</p>', generatorVersion: 'test-1' },
  { type: 'normalized_markdown' as const, body: '검증\n', generatorVersion: 'test-1', metadata: { markdownExportMode: 'gfm', exportWarnings: [], fallbackNodeCount: 0, exporterVersion: 'test-1' } },
  { type: 'plain_text' as const, body: '검증', generatorVersion: 'test-1' },
];

async function expectReject(run: () => Promise<unknown>, pattern?: RegExp) {
  await assert.rejects(run, pattern);
}

async function main() {
try {
  const actor = (await pool.query<{ id: string }>(`INSERT INTO actors(role,display_name) VALUES ('owner','DB Test') RETURNING id`)).rows[0]!.id;
  const group = (await pool.query<{ id: string }>(`INSERT INTO translation_groups(original_locale) VALUES ('ko') RETURNING id`)).rows[0]!.id;
  const content = (await pool.query<{ id: string }>(`INSERT INTO contents(kind,translation_group_id,created_by) VALUES ('knowledge',$1,$2) RETURNING id`, [group, actor])).rows[0]!.id;
  const ko = (await pool.query<{ id: string }>(`INSERT INTO content_localizations(content_id,locale,source_locale,title,summary,slug,route_scope) VALUES ($1,'ko','ko','테스트','','same-slug','archive') RETURNING id`, [content])).rows[0]!.id;
  const en = (await pool.query<{ id: string }>(`INSERT INTO content_localizations(content_id,locale,source_locale,title,summary,slug,route_scope) VALUES ($1,'en','ko','Test','','same-slug','archive') RETURNING id`, [content])).rows[0]!.id;
  assert.notEqual(ko, en, 'translations are independent identities');
  await expectReject(() => pool.query(`INSERT INTO content_localizations(content_id,locale,title,slug,route_scope) VALUES ($1,'ko','duplicate','same-slug','archive')`, [content]), /duplicate key/);
  await pool.query(`INSERT INTO content_routes(localization_id,route,route_type,is_canonical) VALUES ($1,'/archive/same-slug','canonical',true)`, [ko]);
  await expectReject(() => pool.query(`INSERT INTO content_routes(localization_id,route,route_type,is_canonical) VALUES ($1,'/archive/same-slug','alias',false)`, [en]), /duplicate key/);

  const draft = (await pool.query<{ id: string }>(`INSERT INTO content_versions(localization_id,version_number,schema_version,canonical_document,status,created_by,document_checksum,validation_status) VALUES ($1,1,2,$2,'draft',$3,$4,'valid') RETURNING id`, [ko, document, actor, documentChecksum])).rows[0]!.id;
  await pool.query(`UPDATE content_localizations SET current_draft_version_id=$1 WHERE id=$2`, [draft, ko]);
  await publishVersion(pool, { versionId: draft, actorId: actor, artifacts });
  assert.equal((await pool.query(`SELECT count(*)::int AS count FROM content_version_artifacts WHERE content_version_id=$1`, [draft])).rows[0].count, 3);
  assert.equal((await pool.query(`SELECT current_published_version_id FROM content_localizations WHERE id=$1`, [ko])).rows[0].current_published_version_id, draft);

  const scheduled = (await pool.query<{ id: string }>(`INSERT INTO content_versions(localization_id,version_number,schema_version,canonical_document,status,created_by,document_checksum,validation_status,scheduled_at) VALUES ($1,4,2,$2,'scheduled',$3,$4,'valid',now() + interval '1 day') RETURNING id`, [ko, document, actor, documentChecksum])).rows[0]!.id;
  assert.equal((await pool.query(`SELECT scheduled_at IS NOT NULL AS scheduled FROM content_versions WHERE id=$1`, [scheduled])).rows[0].scheduled, true);

  const media = (await pool.query<{ id: string }>(`INSERT INTO media_assets(status,original_filename,mime_type,checksum,created_by) VALUES ('pending','fixture.png','image/png','fixture',$1) RETURNING id`, [actor])).rows[0]!.id;
  await pool.query(`INSERT INTO media_usages(media_id,content_version_id,usage_type,alt) VALUES ($1,$2,'body','fixture')`, [media, scheduled]);
  await expectReject(() => publishVersion(pool, { versionId: scheduled, actorId: actor, artifacts }), /unapproved_media/);
  await pool.query(`UPDATE media_assets SET status='approved' WHERE id=$1`, [media]);
  const source = (await pool.query<{ id: string }>(`INSERT INTO sources(source_type,title,url,review_status) VALUES ('official','Fixture','https://example.com','pending') RETURNING id`)).rows[0]!.id;
  await pool.query(`INSERT INTO content_sources(content_version_id,source_id,role,locator,source_checked_at) VALUES ($1,$2,'evidence','section-1',now())`, [scheduled, source]);
  assert.equal((await pool.query(`SELECT locator FROM content_sources WHERE content_version_id=$1`, [scheduled])).rows[0].locator, 'section-1');
  await expectReject(() => publishVersion(pool, { versionId: scheduled, actorId: actor, artifacts }), /unapproved_source/);
  await expectReject(() => pool.query(`UPDATE content_versions SET revision_summary='mutated' WHERE id=$1`, [draft]), /immutable/);
  await expectReject(() => pool.query(`UPDATE content_version_artifacts SET body='mutated' WHERE content_version_id=$1`, [draft]), /immutable/);

  const blocked = (await pool.query<{ id: string }>(`INSERT INTO content_versions(localization_id,version_number,schema_version,canonical_document,status,created_by,document_checksum,validation_status) VALUES ($1,2,2,$2,'needs_review',$3,$4,'needs_review') RETURNING id`, [ko, document, actor, documentChecksum])).rows[0]!.id;
  await expectReject(() => publishVersion(pool, { versionId: blocked, actorId: actor, artifacts }), /version_not_publishable|document_validation_blocked/);

  const rollbackDraft = (await pool.query<{ id: string }>(`INSERT INTO content_versions(localization_id,version_number,schema_version,canonical_document,status,created_by,document_checksum,validation_status,supersedes_version_id,revision_summary) SELECT localization_id,3,schema_version,canonical_document,'draft',$2,document_checksum,'valid',id,'rollback copy' FROM content_versions WHERE id=$1 RETURNING id`, [draft, actor])).rows[0]!.id;
  await expectReject(() => publishVersion(pool, { versionId: rollbackDraft, actorId: actor, artifacts, simulateFailure: true }), /simulated_transaction_failure/);
  assert.equal((await pool.query(`SELECT status FROM content_versions WHERE id=$1`, [rollbackDraft])).rows[0].status, 'draft');
  assert.equal((await pool.query(`SELECT count(*)::int AS count FROM content_version_artifacts WHERE content_version_id=$1`, [rollbackDraft])).rows[0].count, 0);
  assert.equal((await pool.query(`SELECT current_published_version_id FROM content_localizations WHERE id=$1`, [ko])).rows[0].current_published_version_id, draft);

  const other = (await pool.query<{ id: string }>(`INSERT INTO contents(kind,created_by) VALUES ('knowledge',$1) RETURNING id`, [actor])).rows[0]!.id;
  await expectReject(() => pool.query(`INSERT INTO content_relations(source_content_id,target_content_id,relation_type) VALUES ($1,$1,'related')`, [content]), /relation_no_self/);
  await pool.query(`INSERT INTO content_relations(source_content_id,target_content_id,relation_type) VALUES ($1,$2,'related')`, [content, other]);
  await expectReject(() => pool.query(`INSERT INTO content_relations(source_content_id,target_content_id,relation_type) VALUES ($1,$2,'related')`, [other, content]), /duplicate key/);
  assert.equal(checksum('stable'), checksum('stable'));
  console.log('database integration: 22 assertions passed');
} finally {
  await pool.end();
}
}
void main();
