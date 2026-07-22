import { createAdminDatabase } from '../../src/services/knowledge-drafts';
import { cleanupOrphanedMedia } from '../../src/services/media-assets';

const retentionDays = Number(process.env.MEDIA_ORPHAN_RETENTION_DAYS ?? '7');
if (!Number.isInteger(retentionDays) || retentionDays < 1) throw new Error('MEDIA_ORPHAN_RETENTION_DAYS must be a positive integer');

const { pool } = createAdminDatabase();
try {
  const olderThan = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  const deleted = await cleanupOrphanedMedia(pool, olderThan);
  console.log(JSON.stringify({ status: 'media_orphans_cleaned', retentionDays, deleted }));
} finally {
  await pool.end();
}
