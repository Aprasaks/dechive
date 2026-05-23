import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  getAdminCookieOptions,
  getAdminSessionToken,
  verifyAdminCredentials,
} from '@/lib/adminAuth';

export async function POST(request) {
  let payload = {};

  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const id = String(payload.id ?? '');
  const password = String(payload.password ?? '');

  if (!verifyAdminCredentials(id, password)) {
    return NextResponse.json(
      { error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, getAdminSessionToken(), getAdminCookieOptions());

  return response;
}
