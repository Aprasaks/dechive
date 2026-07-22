import { NextResponse } from 'next/server';
import { createStorageAdapter } from '@/services/media-storage';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  try {
    const storage = createStorageAdapter();
    if (storage.provider !== 'local') return NextResponse.json({ error: 'media_route_not_used_for_r2' }, { status: 404 });
    const { key } = await params;
    const object = await storage.get(key.join('/'));
    if (!object) return new NextResponse(null, { status: 404 });
    return new NextResponse(new Uint8Array(object.body), {
      headers: {
        'Content-Type': object.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
