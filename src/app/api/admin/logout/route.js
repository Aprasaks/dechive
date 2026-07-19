import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, isSameOriginRequest } from '@/lib/adminAuth';

export const preferredRegion = 'sin1';

export async function POST(request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: '로그아웃할 수 없습니다.' }, { status: 403 });
  const response = NextResponse.json({ ok: true });

  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
