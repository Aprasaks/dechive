import crypto from 'node:crypto';

export const ADMIN_SESSION_COOKIE = 'dechive_admin_session';

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left ?? '');
  const rightBuffer = Buffer.from(right ?? '');

  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function getAdminSessionToken() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const adminId = process.env.ADMIN_ID;

  if (!secret || !adminId) return '';

  return crypto
    .createHmac('sha256', secret)
    .update(`dechive-admin:${adminId}`)
    .digest('hex');
}

export function verifyAdminCredentials(id, password) {
  const expectedId = process.env.ADMIN_ID;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedId || !expectedPassword || !process.env.ADMIN_SESSION_SECRET) {
    return false;
  }

  return safeEqual(id, expectedId) && safeEqual(password, expectedPassword);
}

export function isValidAdminSession(value) {
  const token = getAdminSessionToken();
  return Boolean(value && token && safeEqual(value, token));
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  };
}
