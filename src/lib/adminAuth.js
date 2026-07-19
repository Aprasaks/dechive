import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

export const ADMIN_SESSION_COOKIE = 'dechive_admin_session';
const sessionLifetimeSeconds = 60 * 60 * 12;
const dummyPasswordHash = '$2b$10$7EqJtq98hPqEX7fNZaFWoO5qv1p7uW4W9V4F5v7Y8P0qK0x7LqK.e';

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left ?? '');
  const rightBuffer = Buffer.from(right ?? '');
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? '';
}

function sign(payload) {
  return crypto.createHmac('sha256', sessionSecret()).update(payload).digest('base64url');
}

export async function verifyAdminCredentials(email, password) {
  const expectedEmail = (process.env.ADMIN_EMAIL ?? (process.env.NODE_ENV === 'production' ? '' : process.env.ADMIN_ID) ?? '').trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const legacyPassword = process.env.NODE_ENV === 'production' ? undefined : process.env.ADMIN_PASSWORD;
  const emailMatches = safeEqual(email.trim().toLowerCase(), expectedEmail);
  const passwordMatches = passwordHash
    ? await bcrypt.compare(password, passwordHash)
    : legacyPassword
      ? safeEqual(password, legacyPassword)
      : await bcrypt.compare(password, dummyPasswordHash);
  return Boolean(expectedEmail && sessionSecret() && emailMatches && passwordMatches);
}

export function createAdminSessionToken(actorId) {
  if (!sessionSecret() || !actorId) return '';
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({ v: 1, actorId, iat: now, exp: now + sessionLifetimeSeconds, nonce: crypto.randomBytes(24).toString('base64url') })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readAdminSession(value) {
  if (!value || !sessionSecret()) return null;
  const [payload, signature, extra] = value.split('.');
  if (!payload || !signature || extra || !safeEqual(signature, sign(payload))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (parsed.v !== 1 || typeof parsed.actorId !== 'string' || typeof parsed.iat !== 'number' || typeof parsed.exp !== 'number' || parsed.iat > now + 60 || parsed.exp <= now) return null;
    return { actorId: parsed.actorId, expiresAt: parsed.exp };
  } catch {
    return null;
  }
}

export function isValidAdminSession(value) {
  return readAdminSession(value) !== null;
}

export function getAdminCookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: sessionLifetimeSeconds };
}

export function isSameOriginRequest(request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}
