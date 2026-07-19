import { createHash } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';

export type PublishedArtifact = {
  type: 'rendered_html' | 'normalized_markdown' | 'plain_text';
  body: string;
  generatorVersion: string;
  metadata?: Record<string, unknown>;
};

export class PublishError extends Error {}

export const checksum = (body: string) => createHash('sha256').update(body).digest('hex');

async function lockAndValidate(client: PoolClient, versionId: string) {
  const result = await client.query<{
    status: string; validation_status: string; localization_id: string;
  }>(`SELECT status, validation_status, localization_id FROM content_versions WHERE id = $1 FOR UPDATE`, [versionId]);
  const version = result.rows[0];
  if (!version) throw new PublishError('version_not_found');
  if (!['draft', 'review', 'scheduled'].includes(version.status)) throw new PublishError('version_not_publishable');
  if (!['valid', 'valid_with_warnings'].includes(version.validation_status)) throw new PublishError('document_validation_blocked');

  const media = await client.query<{ count: string }>(`SELECT count(*) FROM media_usages mu JOIN media_assets ma ON ma.id = mu.media_id WHERE mu.content_version_id = $1 AND ma.status <> 'approved'`, [versionId]);
  if (Number(media.rows[0]?.count ?? 0) > 0) throw new PublishError('unapproved_media');
  const sources = await client.query<{ count: string }>(`SELECT count(*) FROM content_sources cs JOIN sources s ON s.id = cs.source_id WHERE cs.content_version_id = $1 AND s.review_status NOT IN ('approved','verified')`, [versionId]);
  if (Number(sources.rows[0]?.count ?? 0) > 0) throw new PublishError('unapproved_source');
  const routes = await client.query<{ count: string }>(`SELECT count(*) FROM content_routes WHERE localization_id = $1 AND is_canonical AND active_until IS NULL`, [version.localization_id]);
  if (Number(routes.rows[0]?.count ?? 0) !== 1) throw new PublishError('canonical_route_required');
  return version;
}

export async function publishVersion(pool: Pool, input: { versionId: string; actorId: string; artifacts: PublishedArtifact[]; simulateFailure?: boolean }) {
  const expected = new Set(['rendered_html', 'normalized_markdown', 'plain_text']);
  if (input.artifacts.length !== 3 || input.artifacts.some((a) => !expected.delete(a.type)) || expected.size) {
    throw new PublishError('three_unique_artifacts_required');
  }
  if (input.artifacts.some((artifact) => artifact.body.length === 0)) throw new PublishError('empty_artifact');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const version = await lockAndValidate(client, input.versionId);
    for (const artifact of input.artifacts) {
      await client.query(`INSERT INTO content_version_artifacts (content_version_id, artifact_type, body, generator_version, checksum, metadata) VALUES ($1,$2,$3,$4,$5,$6)`, [input.versionId, artifact.type, artifact.body, artifact.generatorVersion, checksum(artifact.body), artifact.metadata ?? {}]);
    }
    if (input.simulateFailure) throw new PublishError('simulated_transaction_failure');
    await client.query(`UPDATE content_versions SET status = 'published', published_at = now() WHERE id = $1`, [input.versionId]);
    await client.query(`UPDATE content_localizations SET current_published_version_id = $1, current_draft_version_id = CASE WHEN current_draft_version_id = $1 THEN NULL ELSE current_draft_version_id END, updated_at = now() WHERE id = $2`, [input.versionId, version.localization_id]);
    await client.query(`INSERT INTO revision_events (content_version_id, event_type, actor_id, metadata) VALUES ($1, 'published', $2, $3)`, [input.versionId, input.actorId, { artifactTypes: input.artifacts.map((a) => a.type) }]);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
