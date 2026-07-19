import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminCookieOptions,
  isSameOriginRequest,
  verifyAdminCredentials,
} from '@/lib/adminAuth';
import { createAdminDatabase } from '@/services/knowledge-drafts';
import { ensureOwnerActor } from '@/features/admin/owner-auth';

export const preferredRegion = 'sin1';

export async function POST(request) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: '로그인할 수 없습니다.' }, { status: 403 });
  let payload = {};

  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const email = String(payload.email ?? '');
  const password = String(payload.password ?? '');

  if (!(await verifyAdminCredentials(email, password))) {
    return NextResponse.json(
      { error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
      { status: 401 },
    );
  }

  const { pool } = createAdminDatabase();
  try {
    const actorId = await ensureOwnerActor(pool, email);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(actorId), getAdminCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: '로그인할 수 없습니다.' }, { status: 503 });
  } finally { await pool.end(); }
}
