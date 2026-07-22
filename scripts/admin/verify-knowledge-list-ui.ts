import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import bcrypt from 'bcryptjs';

const port = 4320;
const baseURL = `http://localhost:${port}`;
function localEnv() {
  try {
    return Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/).flatMap((line) => {
      const separator = line.indexOf('=');
      if (separator < 1 || line.trimStart().startsWith('#')) return [];
      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
      return [[key, value]];
    }));
  } catch {
    return {};
  }
}

async function main() {
  const configured = { ...localEnv(), ...process.env };
  const email = configured.CMS_OWNER_EMAIL ?? configured.ADMIN_EMAIL ?? 'knowledge-list-ui-owner@local.invalid';
  const password = configured.CMS_OWNER_PASSWORD ?? configured.ADMIN_PASSWORD ?? randomBytes(24).toString('base64url');
  const passwordHash = configured.ADMIN_PASSWORD_HASH ?? await bcrypt.hash(password, 10);
  const sessionSecret = configured.ADMIN_SESSION_SECRET ?? randomBytes(48).toString('base64url');
  const environment = {
    ...process.env,
    ADMIN_EMAIL: email,
    ADMIN_PASSWORD_HASH: passwordHash,
    ADMIN_PASSWORD: configured.ADMIN_PASSWORD_HASH ? '' : password,
    ADMIN_SESSION_SECRET: sessionSecret,
    CMS_BASE_URL: baseURL,
    CMS_OWNER_EMAIL: email,
    CMS_OWNER_PASSWORD: password,
  };
  const server = spawn('npm', ['run', 'dev', '--', '--port', String(port)], {
    env: environment,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });
  let output = '';
  server.stdout.on('data', (chunk) => { output += String(chunk); });
  server.stderr.on('data', (chunk) => { output += String(chunk); });

  try {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error('CMS test server exited before readiness');
    try {
      const response = await fetch(`${baseURL}/admin/login`);
      if (response.ok) break;
    } catch {
      // The Next.js dev server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (attempt === 59) throw new Error('CMS test server readiness timeout');
  }

  const test = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test', 'scripts/admin/knowledge-list-ui.spec.ts', '--reporter=line', '--workers=1'], {
    env: environment,
    stdio: 'inherit',
  });
  const exitCode = await new Promise<number>((resolve) => test.on('exit', (code) => resolve(code ?? 1)));
  if (exitCode !== 0) process.exitCode = exitCode;
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Knowledge list UI verification failed');
  if (output) console.error(output);
  process.exitCode = 1;
} finally {
  if (server.pid) {
    try { process.kill(-server.pid, 'SIGTERM'); } catch { /* already stopped */ }
  }
  }
}

void main();
