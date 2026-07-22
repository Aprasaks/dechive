import type { JSONContent } from '@tiptap/core';
import type { Pool, PoolClient } from 'pg';
import type { DechiveDocument } from '@/features/editor-lab/document';
import { createStorageAdapter, publicMediaUrl } from './media-storage';

type Db = Pick<Pool | PoolClient, 'query'>;

export type KnowledgeHero = {
  mediaId: string;
  alt: string;
  caption: string;
};

export type MediaAssetView = {
  id: string;
  publicUrl: string;
  originalFilename: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  aiGenerated: boolean;
};

type MediaRow = {
  id: string;
  storage_provider: string | null;
  storage_key: string | null;
  original_filename: string;
  mime_type: string;
  source_url: string | null;
  width: number | null;
  height: number | null;
  ai_generated: string;
};

function mediaView(row: MediaRow): MediaAssetView {
  const publicUrl = row.storage_provider && row.storage_key
    ? publicMediaUrl(row.storage_provider, row.storage_key)
    : row.source_url;
  if (!publicUrl) throw new Error('media_storage_reference_missing');
  return {
    id: row.id,
    publicUrl,
    originalFilename: row.original_filename,
    mimeType: row.mime_type,
    width: row.width,
    height: row.height,
    aiGenerated: row.ai_generated === 'true',
  };
}

function stringAttr(node: JSONContent, key: string): string {
  const value = node.attrs?.[key];
  return typeof value === 'string' ? value : '';
}

function walk(node: JSONContent, visit: (node: JSONContent) => void): void {
  visit(node);
  node.content?.forEach((child) => walk(child, visit));
}

export function collectBodyMedia(document: DechiveDocument): Array<{ mediaId: string; alt: string; caption: string; order: number }> {
  const usages: Array<{ mediaId: string; alt: string; caption: string; order: number }> = [];
  walk(document, (node) => {
    if (node.type !== 'figure') return;
    const mediaId = stringAttr(node, 'mediaId');
    if (!mediaId) return;
    const alt = stringAttr(node, 'alt').trim();
    if (!alt) throw new Error('media_alt_required');
    usages.push({ mediaId, alt, caption: stringAttr(node, 'caption').trim(), order: usages.length });
  });
  return usages;
}

export async function saveKnowledgeMediaUsages(
  tx: PoolClient,
  versionId: string,
  document: DechiveDocument,
  hero: KnowledgeHero | null,
): Promise<void> {
  const body = collectBodyMedia(document);
  const allIds = [...new Set([...body.map((item) => item.mediaId), ...(hero ? [hero.mediaId] : [])])];
  if (hero && !hero.alt.trim()) throw new Error('media_alt_required');
  if (!allIds.length) return;
  const assets = await tx.query<MediaRow>(
    `SELECT id,storage_provider,storage_key,source_url,original_filename,mime_type,width,height,ai_generated FROM media_assets WHERE id=ANY($1::uuid[]) FOR UPDATE`,
    [allIds],
  );
  if (assets.rowCount !== allIds.length) throw new Error('media_asset_not_found');
  for (const row of assets.rows) mediaView(row);
  await tx.query(`DELETE FROM media_usages WHERE content_version_id=$1`, [versionId]);
  if (hero) {
    await tx.query(
      `INSERT INTO media_usages(media_id,content_version_id,usage_type,alt,caption,order_index,metadata) VALUES ($1,$2,'hero',$3,$4,0,$5)`,
      [hero.mediaId, versionId, hero.alt.trim(), hero.caption.trim() || null, JSON.stringify({})],
    );
  }
  for (const item of body) {
    await tx.query(
      `INSERT INTO media_usages(media_id,content_version_id,usage_type,alt,caption,order_index,metadata) VALUES ($1,$2,'body',$3,$4,$5,$6)`,
      [item.mediaId, versionId, item.alt, item.caption || null, item.order, JSON.stringify({})],
    );
  }
  await tx.query(`UPDATE media_assets SET status='approved' WHERE id=ANY($1::uuid[]) AND status='pending'`, [allIds]);
}

async function mediaRowsForVersion(db: Db, versionId: string): Promise<MediaRow[]> {
  return (await db.query<MediaRow>(
    `SELECT DISTINCT ma.id,ma.storage_provider,ma.storage_key,ma.source_url,ma.original_filename,ma.mime_type,ma.width,ma.height,ma.ai_generated
     FROM media_usages mu JOIN media_assets ma ON ma.id=mu.media_id
     WHERE mu.content_version_id=$1
       AND ((ma.storage_provider IS NOT NULL AND ma.storage_key IS NOT NULL) OR ma.source_url IS NOT NULL)`,
    [versionId],
  )).rows;
}

export async function resolveKnowledgeDocument(db: Db, versionId: string, document: DechiveDocument): Promise<DechiveDocument> {
  const rows = await mediaRowsForVersion(db, versionId);
  const urls = new Map(rows.map((row) => [row.id, mediaView(row)]));
  const visit = (node: JSONContent): JSONContent => {
    const content = node.content?.map(visit);
    if (node.type !== 'figure') return { ...node, ...(content ? { content } : {}) };
    const mediaId = stringAttr(node, 'mediaId');
    const media = mediaId ? urls.get(mediaId) : undefined;
    if (!media) return { ...node, ...(content ? { content } : {}) };
    return {
      ...node,
      attrs: {
        ...node.attrs,
        src: media.publicUrl,
        media: { id: media.id, displayUrl: media.publicUrl, width: media.width, height: media.height },
      },
      ...(content ? { content } : {}),
    };
  };
  return visit(document) as DechiveDocument;
}

export async function getKnowledgeHero(db: Db, versionId: string): Promise<(KnowledgeHero & { publicUrl: string; width: number | null; height: number | null; aiGenerated: boolean }) | null> {
  const row = (await db.query<MediaRow & { alt: string; caption: string | null }>(
    `SELECT ma.id,ma.storage_provider,ma.storage_key,ma.source_url,ma.original_filename,ma.mime_type,ma.width,ma.height,ma.ai_generated,mu.alt,mu.caption
     FROM media_usages mu JOIN media_assets ma ON ma.id=mu.media_id
     WHERE mu.content_version_id=$1 AND mu.usage_type='hero'
       AND ((ma.storage_provider IS NOT NULL AND ma.storage_key IS NOT NULL) OR ma.source_url IS NOT NULL)
     ORDER BY mu.order_index LIMIT 1`,
    [versionId],
  )).rows[0];
  if (!row) return null;
  const media = mediaView(row);
  return { mediaId: media.id, alt: row.alt, caption: row.caption ?? '', publicUrl: media.publicUrl, width: media.width, height: media.height, aiGenerated: media.aiGenerated };
}

export async function getMediaAsset(db: Db, id: string): Promise<MediaAssetView | null> {
  const row = (await db.query<MediaRow>(
    `SELECT id,storage_provider,storage_key,source_url,original_filename,mime_type,width,height,ai_generated FROM media_assets WHERE id=$1`,
    [id],
  )).rows[0];
  return row ? mediaView(row) : null;
}

export async function cleanupOrphanedMedia(pool: Pool, olderThan: Date): Promise<number> {
  const storage = createStorageAdapter();
  let deleted = 0;
  while (true) {
    const tx = await pool.connect();
    try {
      await tx.query('BEGIN');
      const row = (await tx.query<{
        id: string;
        storage_provider: string;
        storage_key: string;
      }>(
        `SELECT ma.id,ma.storage_provider,ma.storage_key
         FROM media_assets ma
         WHERE ma.status='pending'
           AND ma.created_at < $1
           AND ma.storage_provider IS NOT NULL
           AND ma.storage_key IS NOT NULL
           AND NOT EXISTS (SELECT 1 FROM media_usages mu WHERE mu.media_id=ma.id)
         ORDER BY ma.created_at
         FOR UPDATE SKIP LOCKED
         LIMIT 1`,
        [olderThan],
      )).rows[0];
      if (!row) {
        await tx.query('COMMIT');
        break;
      }
      if (row.storage_provider !== storage.provider) throw new Error('media_storage_provider_mismatch');
      await storage.delete(row.storage_key);
      await tx.query(
        `DELETE FROM media_assets ma
         WHERE ma.id=$1 AND ma.status='pending'
           AND NOT EXISTS (SELECT 1 FROM media_usages mu WHERE mu.media_id=ma.id)`,
        [row.id],
      );
      await tx.query('COMMIT');
      deleted += 1;
    } catch (error) {
      await tx.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally {
      tx.release();
    }
  }
  return deleted;
}
