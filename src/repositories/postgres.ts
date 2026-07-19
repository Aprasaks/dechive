import type { Pool, PoolClient } from 'pg';
import type { AIUpdateRepository, ContentRepository, ImportRepository, KnowledgeRepository, LegacyIdentity, TransactionContext } from './contracts';

export class PostgresRepositories implements ContentRepository, KnowledgeRepository, AIUpdateRepository, ImportRepository {
  constructor(private readonly pool: Pool) {}
  private query(tx?: TransactionContext) { return tx ?? this.pool; }

  async transaction<T>(run: (tx: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try { await client.query('BEGIN'); const result = await run(client); await client.query('COMMIT'); return result; }
    catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }
  async withBatchLock<T>(batchKey: string, run: () => Promise<T>): Promise<T> {
    const client=await this.pool.connect();
    try { const locked=Boolean((await client.query(`SELECT pg_try_advisory_lock(hashtext($1)) AS locked`,[batchKey])).rows[0]?.locked); if(!locked) throw new Error('import_batch_already_running'); return await run(); }
    finally { await client.query(`SELECT pg_advisory_unlock(hashtext($1))`,[batchKey]).catch(()=>undefined); client.release(); }
  }

  async findByLegacyIdentity(identity: LegacyIdentity, tx?: TransactionContext) {
    const result = await this.query(tx).query(`SELECT localization_id AS "localizationId", digest_id AS "digestId", source_checksum AS "sourceChecksum" FROM legacy_identities WHERE source_type=$1 AND stable_key=$2`, [identity.sourceType, identity.stableKey]);
    return result.rows[0] ?? null;
  }
  async findByRoute(route: string, tx?: TransactionContext) {
    const result = await this.query(tx).query(`SELECT cr.route, cr.route_type AS "routeType", cr.is_canonical AS "isCanonical", cl.*, c.kind FROM content_routes cr LEFT JOIN content_localizations cl ON cl.id=cr.localization_id LEFT JOIN contents c ON c.id=cl.content_id WHERE cr.route=$1 AND cr.active_until IS NULL`, [route]);
    return result.rows[0] ?? null;
  }
  async getCanonicalRoute(localizationId: string, tx?: TransactionContext) { return (await this.query(tx).query(`SELECT route, route_type AS "routeType" FROM content_routes WHERE localization_id=$1 AND is_canonical AND active_until IS NULL`, [localizationId])).rows[0] ?? null; }
  async findKnowledgeBySlug(locale: string, slug: string, tx?: TransactionContext) {
    const result = await this.query(tx).query(`SELECT cl.*, kd.format, kd.depth, kd.core_question AS "coreQuestion", kd.difficulty FROM content_localizations cl JOIN contents c ON c.id=cl.content_id AND c.kind='knowledge' JOIN knowledge_details kd ON kd.localization_id=cl.id WHERE cl.locale=$1 AND cl.slug=$2`, [locale, slug]);
    return result.rows[0] ?? null;
  }
  async listVersions(localizationId: string, tx?: TransactionContext) { return (await this.query(tx).query(`SELECT * FROM content_versions WHERE localization_id=$1 ORDER BY version_number`, [localizationId])).rows; }
  async getCurrentDraft(localizationId: string, tx?: TransactionContext) { return (await this.query(tx).query(`SELECT cv.* FROM content_localizations cl JOIN content_versions cv ON cv.id=cl.current_draft_version_id WHERE cl.id=$1`, [localizationId])).rows[0] ?? null; }
  async getCurrentPublished(localizationId: string, tx?: TransactionContext) { return (await this.query(tx).query(`SELECT cv.* FROM content_localizations cl JOIN content_versions cv ON cv.id=cl.current_published_version_id WHERE cl.id=$1`, [localizationId])).rows[0] ?? null; }
  async getTranslationSiblings(localizationId: string, tx?: TransactionContext) {
    return (await this.query(tx).query(`SELECT sibling.id, sibling.locale, sibling.slug, sibling.title FROM content_localizations base JOIN contents bc ON bc.id=base.content_id JOIN contents sc ON sc.translation_group_id=bc.translation_group_id JOIN content_localizations sibling ON sibling.content_id=sc.id WHERE base.id=$1 ORDER BY sibling.locale`, [localizationId])).rows;
  }
  async getVersionSources(versionId: string, tx?: TransactionContext) { return (await this.query(tx).query(`SELECT s.*, cs.role, cs.locator, cs.note FROM content_sources cs JOIN sources s ON s.id=cs.source_id WHERE cs.content_version_id=$1 ORDER BY cs.order_index`, [versionId])).rows; }
  async getVersionMedia(versionId: string, tx?: TransactionContext) { return (await this.query(tx).query(`SELECT ma.id, ma.status, ma.source_url AS "sourceUrl", mu.usage_type AS "usageType", mu.alt, mu.caption, mu.metadata FROM media_usages mu JOIN media_assets ma ON ma.id=mu.media_id WHERE mu.content_version_id=$1 ORDER BY mu.order_index`, [versionId])).rows; }
  async getRelatedContent(contentId: string, tx?: TransactionContext) { return (await this.query(tx).query(`SELECT * FROM content_relations WHERE source_content_id=$1 OR target_content_id=$1 ORDER BY order_index NULLS LAST`, [contentId])).rows; }
  async getDetails(localizationId: string, tx?: TransactionContext) { return (await this.query(tx).query(`SELECT * FROM knowledge_details WHERE localization_id=$1`, [localizationId])).rows[0] ?? null; }
  async listDigestItems(digestId: string, tx?: TransactionContext) {
    return (await this.query(tx).query(`SELECT udi.order_index AS "order", cl.id AS "localizationId", cl.slug, cl.title, au.vendor, au.product, au.change_summary AS "changeSummary", s.url AS "sourceUrl" FROM update_digest_items udi JOIN content_localizations cl ON cl.id=udi.update_localization_id JOIN ai_updates au ON au.localization_id=cl.id LEFT JOIN content_versions cv ON cv.id=cl.current_draft_version_id LEFT JOIN content_sources cs ON cs.content_version_id=cv.id LEFT JOIN sources s ON s.id=cs.source_id WHERE udi.digest_id=$1 ORDER BY udi.order_index`, [digestId])).rows;
  }
  async startBatch(batchKey: string, importerVersion: string, tx: TransactionContext) { return (await tx.query<{ id: string }>(`INSERT INTO import_batches(batch_key,importer_version) VALUES ($1,$2) ON CONFLICT(batch_key) DO UPDATE SET started_at=now(), finished_at=NULL, status='running', summary='{}', last_heartbeat_at=now(), recovery_count=import_batches.recovery_count + CASE WHEN import_batches.status='running' THEN 1 ELSE 0 END RETURNING id`, [batchKey, importerVersion])).rows[0]!.id; }
  async finishBatch(batchId: string, status: string, summary: Record<string, unknown>, tx: TransactionContext) { await tx.query(`UPDATE import_batches SET status=$2, finished_at=now(), summary=$3 WHERE id=$1`, [batchId, status, summary]); }
}
