import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type MediaStorageProvider = 'local' | 'r2';

export type StoredObject = {
  body: Buffer;
  contentType: string;
};

export interface StorageAdapter {
  readonly provider: MediaStorageProvider;
  publicUrl(key: string): string;
  put(key: string, body: Buffer, contentType: string): Promise<void>;
  get(key: string): Promise<StoredObject | null>;
  delete(key: string): Promise<void>;
}

export async function putWithRollback<T>(
  storage: StorageAdapter,
  key: string,
  body: Buffer,
  contentType: string,
  persist: () => Promise<T>,
): Promise<T> {
  await storage.put(key, body, contentType);
  try {
    return await persist();
  } catch (error) {
    await storage.delete(key).catch(() => undefined);
    throw error;
  }
}

function cleanKey(key: string): string {
  const normalized = key.replaceAll('\\', '/').replace(/^\/+/, '');
  if (!normalized || normalized.split('/').some((part) => !part || part === '.' || part === '..')) {
    throw new Error('media_storage_key_invalid');
  }
  return normalized;
}

function encodeKey(key: string): string {
  return cleanKey(key).split('/').map(encodeURIComponent).join('/');
}

function contentTypeForKey(key: string): string {
  const extension = path.extname(key).toLowerCase();
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
  if (extension === '.png') return 'image/png';
  return 'image/webp';
}

export class LocalStorageAdapter implements StorageAdapter {
  readonly provider = 'local' as const;
  private readonly root: string;
  private readonly publicPath: string;

  constructor(root = process.env.MEDIA_LOCAL_ROOT || './.data/media', publicPath = process.env.MEDIA_LOCAL_PUBLIC_PATH || '/api/media') {
    this.root = path.resolve(root);
    this.publicPath = `/${publicPath.replace(/^\/+|\/+$/g, '')}`;
  }

  publicUrl(key: string): string {
    return `${this.publicPath}/${encodeKey(key)}`;
  }

  async put(key: string, body: Buffer, _contentType: string): Promise<void> {
    void _contentType;
    const safeKey = cleanKey(key);
    const target = path.resolve(this.root, safeKey);
    if (!target.startsWith(`${this.root}${path.sep}`)) throw new Error('media_storage_key_invalid');
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, body, { flag: 'wx' });
  }

  async get(key: string): Promise<StoredObject | null> {
    const safeKey = cleanKey(key);
    const target = path.resolve(this.root, safeKey);
    if (!target.startsWith(`${this.root}${path.sep}`)) throw new Error('media_storage_key_invalid');
    try {
      return { body: await readFile(target), contentType: contentTypeForKey(safeKey) };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    const safeKey = cleanKey(key);
    const target = path.resolve(this.root, safeKey);
    if (!target.startsWith(`${this.root}${path.sep}`)) throw new Error('media_storage_key_invalid');
    await rm(target, { force: true });
  }
}

type R2Config = {
  endpoint: string;
  bucket: string;
  region: string;
  publicBaseUrl: string;
  accessKeyId: string;
  secretAccessKey: string;
};

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`media_storage_config_missing:${name}`);
  return value;
}

function requiredPublicBaseUrl(): string {
  const value = requiredEnv('MEDIA_PUBLIC_BASE_URL');
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('media_storage_public_url_invalid');
  }
  if (url.protocol !== 'https:' || !url.hostname) throw new Error('media_storage_public_url_invalid');
  return value;
}

export class R2StorageAdapter implements StorageAdapter {
  readonly provider = 'r2' as const;
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor(config: R2Config) {
    this.bucket = config.bucket;
    this.publicBaseUrl = config.publicBaseUrl.replace(/\/+$/, '');
    this.client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      forcePathStyle: true,
      credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    });
  }

  publicUrl(key: string): string {
    return `${this.publicBaseUrl}/${encodeKey(key)}`;
  }

  async put(key: string, body: Buffer, contentType: string): Promise<void> {
    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: cleanKey(key),
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }));
  }

  async get(key: string): Promise<StoredObject | null> {
    try {
      const result = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: cleanKey(key) }));
      if (!result.Body) return null;
      return { body: Buffer.from(await result.Body.transformToByteArray()), contentType: result.ContentType ?? contentTypeForKey(key) };
    } catch (error) {
      if (error instanceof Error && error.name === 'NoSuchKey') return null;
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: cleanKey(key) }));
  }
}

export function createStorageAdapter(): StorageAdapter {
  const provider = (process.env.MEDIA_STORAGE_PROVIDER || (process.env.NODE_ENV === 'production' ? '' : 'local')) as MediaStorageProvider | '';
  if (provider === 'local') {
    if (process.env.NODE_ENV === 'production') throw new Error('media_storage_local_forbidden_in_production');
    return new LocalStorageAdapter();
  }
  if (provider === 'r2') {
    return new R2StorageAdapter({
      endpoint: requiredEnv('MEDIA_R2_ENDPOINT'),
      bucket: requiredEnv('MEDIA_R2_BUCKET'),
      accessKeyId: requiredEnv('MEDIA_R2_ACCESS_KEY_ID'),
      secretAccessKey: requiredEnv('MEDIA_R2_SECRET_ACCESS_KEY'),
      region: process.env.MEDIA_R2_REGION?.trim() || 'auto',
      publicBaseUrl: requiredPublicBaseUrl(),
    });
  }
  throw new Error('media_storage_provider_missing_or_invalid');
}

export function storageProviderFromValue(value: string | null | undefined): MediaStorageProvider {
  if (value === 'local' || value === 'r2') return value;
  throw new Error('media_storage_provider_invalid');
}

export function publicMediaUrl(provider: string | null, key: string): string {
  if (provider === 'local') return new LocalStorageAdapter().publicUrl(key);
  if (provider === 'r2') return new R2StorageAdapter({
    endpoint: requiredEnv('MEDIA_R2_ENDPOINT'),
    bucket: requiredEnv('MEDIA_R2_BUCKET'),
    accessKeyId: requiredEnv('MEDIA_R2_ACCESS_KEY_ID'),
    secretAccessKey: requiredEnv('MEDIA_R2_SECRET_ACCESS_KEY'),
    region: process.env.MEDIA_R2_REGION?.trim() || 'auto',
    publicBaseUrl: requiredPublicBaseUrl(),
  }).publicUrl(key);
  throw new Error('media_storage_provider_invalid');
}
