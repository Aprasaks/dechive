import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { requireOwnerAction } from '@/features/admin/owner-auth';
import { createAdminDatabase } from '@/services/knowledge-drafts';
import { inspectImage, MAX_MEDIA_REQUEST_BYTES } from '@/services/media-validation';
import { createStorageAdapter, putWithRollback } from '@/services/media-storage';

export const runtime = 'nodejs';

function errorCode(error: unknown): string {
  if (error instanceof Error) return error.message.split(':')[0] || 'media_upload_failed';
  return 'media_upload_failed';
}

export async function POST(request: Request) {
  let pool: ReturnType<typeof createAdminDatabase>['pool'] | undefined;
  try {
    const actorId = await requireOwnerAction();
    const contentLength = request.headers.get('content-length');
    if (contentLength && Number(contentLength) > MAX_MEDIA_REQUEST_BYTES) throw new Error('media_request_size_invalid');
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) throw new Error('media_file_required');
    const body = Buffer.from(await file.arrayBuffer());
    const inspected = inspectImage(body, file.type);
    const storageProvider = process.env.MEDIA_STORAGE_PROVIDER || (process.env.NODE_ENV === 'production' ? '' : 'local');
    if (!storageProvider) throw new Error('media_storage_provider_missing_or_invalid');
    const storage = createStorageAdapter();
    const now = new Date();
    const key = `knowledge/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${randomUUID()}.${inspected.extension}`;
    ({ pool } = createAdminDatabase());
    try {
      const row = await putWithRollback(storage, key, body, inspected.mimeType, async () => {
        const inserted = (await pool!.query<{ id: string }>(
          `INSERT INTO media_assets(status,storage_provider,storage_key,original_filename,mime_type,size_bytes,width,height,checksum,ai_generated,created_by)
           VALUES ('pending',$1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
          [storage.provider, key, file.name.slice(0, 255), inspected.mimeType, body.length, inspected.width, inspected.height, inspected.checksum, form.get('aiGenerated') === 'false' ? 'false' : 'true', actorId],
        )).rows[0];
        if (!inserted) throw new Error('media_asset_insert_failed');
        return inserted;
      });
      return NextResponse.json({ ok: true, asset: { id: row.id, publicUrl: storage.publicUrl(key), mimeType: inspected.mimeType, width: inspected.width, height: inspected.height, aiGenerated: form.get('aiGenerated') !== 'false' } });
    } finally {
      await pool!.end();
    }
  } catch (error) {
    const code = errorCode(error);
    const status = code === 'admin_access_denied' ? 403 : code === 'media_request_size_invalid' || code === 'media_file_size_invalid' ? 413 : code.startsWith('media_storage_') ? 500 : 400;
    return NextResponse.json({ ok: false, error: code }, { status });
  }
}
