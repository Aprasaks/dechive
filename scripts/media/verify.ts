import assert from 'node:assert/strict';
import { generateHTML } from '@tiptap/html/server';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { inspectImage, MAX_MEDIA_BYTES } from '../../src/services/media-validation';
import { createStorageAdapter, LocalStorageAdapter, putWithRollback } from '../../src/services/media-storage';
import { editorExtensions } from '../../src/features/editor-lab/editor-extensions';

const png1x1 = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360000000020001e221bc330000000049454e44ae426082', 'hex');
const jpeg1x1 = Buffer.from([0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
const webp1x1 = Buffer.alloc(30);
webp1x1.write('RIFF', 0, 'ascii');
webp1x1.writeUInt32LE(22, 4);
webp1x1.write('WEBP', 8, 'ascii');
webp1x1.write('VP8X', 12, 'ascii');
webp1x1.writeUInt32LE(10, 16);

async function main() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dechive-media-'));
  try {
    const inspected = inspectImage(png1x1, 'image/png');
    assert.equal(inspected.mimeType, 'image/png');
    assert.deepEqual([inspected.width, inspected.height], [1, 1]);
    assert.equal(inspected.extension, 'png');
    assert.deepEqual([inspectImage(jpeg1x1, 'image/jpeg').width, inspectImage(jpeg1x1, 'image/jpeg').height], [1, 1]);
    assert.deepEqual([inspectImage(webp1x1, 'image/webp').width, inspectImage(webp1x1, 'image/webp').height], [1, 1]);
    const rendered = generateHTML({ type: 'doc', content: [{ type: 'figure', attrs: { mediaId: 'fixture', src: '/api/media/fixture.png', media: { displayUrl: '/api/media/fixture.png', width: 1, height: 1 }, alt: 'fixture', caption: '' }, content: [] }] }, editorExtensions);
    assert.match(rendered, /loading="lazy"/);
    assert.match(rendered, /decoding="async"/);
    assert.match(rendered, /width="1"/);
    assert.match(rendered, /height="1"/);
    assert.throws(() => inspectImage(png1x1, 'image/jpeg'), /media_mime_mismatch/);
    assert.throws(() => inspectImage(Buffer.from('GIF89a'), 'image/gif'), /media_type_invalid/);
    assert.throws(() => inspectImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'), 'image/svg+xml'), /media_type_invalid/);
    assert.throws(() => inspectImage(Buffer.alloc(MAX_MEDIA_BYTES + 1), 'image/png'), /media_file_size_invalid/);
    const adapter = new LocalStorageAdapter(root, '/api/media');
    await assert.rejects(() => adapter.get('../private.png'), /media_storage_key_invalid/);
    await adapter.put('knowledge/2026/07/test.png', png1x1, 'image/png');
    assert.equal(adapter.publicUrl('knowledge/2026/07/test.png'), '/api/media/knowledge/2026/07/test.png');
    const stored = await adapter.get('knowledge/2026/07/test.png');
    assert(stored);
    assert.deepEqual(await readFile(path.join(root, 'knowledge/2026/07/test.png')), png1x1);
    assert.equal(stored.contentType, 'image/png');
    await adapter.delete('knowledge/2026/07/test.png');
    assert.equal(await adapter.get('knowledge/2026/07/test.png'), null);
    await assert.rejects(
      () => putWithRollback(adapter, 'knowledge/2026/07/rollback.png', png1x1, 'image/png', async () => { throw new Error('simulated_db_failure'); }),
      /simulated_db_failure/,
    );
    assert.equal(await adapter.get('knowledge/2026/07/rollback.png'), null);
    const previousNodeEnv = process.env.NODE_ENV;
    const previousProvider = process.env.MEDIA_STORAGE_PROVIDER;
    const environment = process.env as unknown as Record<string, string | undefined>;
    const previousR2 = {
      endpoint: process.env.MEDIA_R2_ENDPOINT,
      bucket: process.env.MEDIA_R2_BUCKET,
      accessKeyId: process.env.MEDIA_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.MEDIA_R2_SECRET_ACCESS_KEY,
    };
    environment.NODE_ENV = 'production';
    environment.MEDIA_STORAGE_PROVIDER = 'r2';
    delete environment.MEDIA_R2_ENDPOINT;
    delete environment.MEDIA_R2_BUCKET;
    delete environment.MEDIA_R2_ACCESS_KEY_ID;
    delete environment.MEDIA_R2_SECRET_ACCESS_KEY;
    assert.throws(() => createStorageAdapter(), /media_storage_config_missing/);
    if (previousNodeEnv === undefined) delete environment.NODE_ENV; else environment.NODE_ENV = previousNodeEnv;
    if (previousProvider === undefined) delete environment.MEDIA_STORAGE_PROVIDER; else environment.MEDIA_STORAGE_PROVIDER = previousProvider;
    for (const [name, value] of Object.entries({ MEDIA_R2_ENDPOINT: previousR2.endpoint, MEDIA_R2_BUCKET: previousR2.bucket, MEDIA_R2_ACCESS_KEY_ID: previousR2.accessKeyId, MEDIA_R2_SECRET_ACCESS_KEY: previousR2.secretAccessKey })) {
      if (value === undefined) delete environment[name]; else environment[name] = value;
    }
    console.log(JSON.stringify({ status: 'media_local_adapter_verified', imageValidation: true, pathTraversalBlocked: true }));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

void main();
