import { createHash } from 'node:crypto';

export const MAX_MEDIA_BYTES = 10 * 1024 * 1024;
export const MAX_MEDIA_REQUEST_BYTES = MAX_MEDIA_BYTES + 1024 * 1024;
export const MAX_MEDIA_DIMENSION = 10_000;

export type SupportedMedia = {
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  extension: 'jpg' | 'png' | 'webp';
  width: number;
  height: number;
  checksum: string;
};

function dimension(width: number, height: number): { width: number; height: number } {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > MAX_MEDIA_DIMENSION || height > MAX_MEDIA_DIMENSION) {
    throw new Error('media_dimensions_invalid');
  }
  return { width, height };
}

function parsePng(buffer: Buffer): { width: number; height: number } | null {
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') return null;
  return dimension(buffer.readUInt32BE(16), buffer.readUInt32BE(20));
}

function parseJpeg(buffer: Buffer): { width: number; height: number } | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset++];
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker >= 0xd0 && marker <= 0xd7) continue;
    if (offset + 2 > buffer.length) break;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) break;
    const isFrame = (marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf);
    if (isFrame && length >= 7) return dimension(buffer.readUInt16BE(offset + 5), buffer.readUInt16BE(offset + 3));
    offset += length;
  }
  throw new Error('media_dimensions_invalid');
}

function parseWebp(buffer: Buffer): { width: number; height: number } | null {
  if (buffer.length < 30 || buffer.subarray(0, 4).toString('ascii') !== 'RIFF' || buffer.subarray(8, 12).toString('ascii') !== 'WEBP') return null;
  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const type = buffer.subarray(offset, offset + 4).toString('ascii');
    const size = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;
    if (data + size > buffer.length) break;
    if (type === 'VP8X' && size >= 10) {
      const width = 1 + buffer[data + 4]! + (buffer[data + 5]! << 8) + (buffer[data + 6]! << 16);
      const height = 1 + buffer[data + 7]! + (buffer[data + 8]! << 8) + (buffer[data + 9]! << 16);
      return dimension(width, height);
    }
    if (type === 'VP8 ' && size >= 10 && buffer[data + 3] === 0x9d && buffer[data + 4] === 0x01 && buffer[data + 5] === 0x2a) {
      return dimension(buffer.readUInt16LE(data + 6) & 0x3fff, buffer.readUInt16LE(data + 8) & 0x3fff);
    }
    if (type === 'VP8L' && size >= 5 && buffer[data] === 0x2f) {
      const bits = buffer[data + 1]! | (buffer[data + 2]! << 8) | (buffer[data + 3]! << 16) | (buffer[data + 4]! << 24);
      return dimension((bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1);
    }
    offset = data + size + (size % 2);
  }
  throw new Error('media_dimensions_invalid');
}

export function inspectImage(body: Buffer, declaredMimeType: string): SupportedMedia {
  if (body.length === 0 || body.length > MAX_MEDIA_BYTES) throw new Error('media_file_size_invalid');
  const parsed = parsePng(body) ?? parseJpeg(body) ?? parseWebp(body);
  if (!parsed) throw new Error('media_type_invalid');
  const detected = body.subarray(0, 8).toString('hex') === '89504e470d0a1a0a' ? 'image/png' : body.subarray(0, 2).toString('hex') === 'ffd8' ? 'image/jpeg' : 'image/webp';
  if (declaredMimeType && declaredMimeType !== detected) throw new Error('media_mime_mismatch');
  const mimeType = detected as SupportedMedia['mimeType'];
  return {
    mimeType,
    extension: mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/png' ? 'png' : 'webp',
    ...parsed,
    checksum: createHash('sha256').update(body).digest('hex'),
  };
}

export function normalizeMediaText(value: string, maxLength: number): string {
  const normalized = value.trim();
  if (normalized.length > maxLength) throw new Error('media_text_too_long');
  return normalized;
}
