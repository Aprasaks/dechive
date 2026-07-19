import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import assert from 'node:assert/strict';
import { createAdminSessionToken, getAdminCookieOptions, readAdminSession } from '../../src/lib/adminAuth';

async function waitUntilReady(server: ReturnType<typeof spawn>, baseURL: string) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error('CMS test server exited before readiness');
    try { const response = await fetch(`${baseURL}/admin/login`); if (response.ok) return; } catch { /* retry */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error('CMS test server readiness timeout');
}

async function main() {
  const port = 4318;
  const baseURL = `http://localhost:${port}`;
  const email = 'stage-12b-owner@local.invalid';
  const password = randomBytes(24).toString('base64url');
  const passwordHash = await bcrypt.hash(password, 10);
  const sessionSecret = randomBytes(48).toString('base64url');
  const previousSecret = process.env.ADMIN_SESSION_SECRET;
  const previousNodeEnvironment = process.env.NODE_ENV;
  process.env.ADMIN_SESSION_SECRET = sessionSecret;
  const firstToken = createAdminSessionToken('00000000-0000-4000-8000-000000000001');
  const secondToken = createAdminSessionToken('00000000-0000-4000-8000-000000000001');
  assert.notEqual(firstToken, secondToken, 'each login must rotate the session token');
  assert.equal(readAdminSession(`${firstToken}tampered`), null);
  Reflect.set(process.env, 'NODE_ENV', 'production');
  assert.deepEqual(getAdminCookieOptions(), { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 43_200 });
  if (previousSecret === undefined) delete process.env.ADMIN_SESSION_SECRET; else process.env.ADMIN_SESSION_SECRET = previousSecret;
  if (previousNodeEnvironment === undefined) Reflect.deleteProperty(process.env, 'NODE_ENV'); else Reflect.set(process.env, 'NODE_ENV', previousNodeEnvironment);
  const environment = { ...process.env, ADMIN_EMAIL: email, ADMIN_PASSWORD_HASH: passwordHash, ADMIN_PASSWORD: '', ADMIN_SESSION_SECRET: sessionSecret, CMS_BASE_URL: baseURL, CMS_OWNER_EMAIL: email, CMS_OWNER_PASSWORD: password };
  const server = spawn('npm', ['run', 'dev', '--', '--port', String(port)], { detached: true, env: environment, stdio: ['ignore', 'pipe', 'pipe'] });
  let serverOutput = '';
  server.stdout.on('data', (chunk) => { serverOutput += String(chunk); });
  server.stderr.on('data', (chunk) => { serverOutput += String(chunk); });
  try {
    await waitUntilReady(server, baseURL);
    const test = spawn('npx', ['playwright', 'test', 'scripts/admin/auth-browser.spec.ts', '--reporter=line', '--workers=1'], { env: environment, stdio: 'inherit' });
    const exitCode = await new Promise<number>((resolve) => test.on('exit', (code) => resolve(code ?? 1)));
    if (exitCode !== 0) process.exitCode = exitCode;
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Admin auth verification failed');
    if (serverOutput) console.error(serverOutput.replaceAll(password, '[redacted]').replaceAll(sessionSecret, '[redacted]').replaceAll(passwordHash, '[redacted]'));
    process.exitCode = 1;
  } finally {
    if (server.pid) {
      try { process.kill(-server.pid, 'SIGTERM'); } catch { /* already stopped */ }
    }
  }
}

void main();
