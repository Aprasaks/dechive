import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import bcrypt from 'bcryptjs';
import { loadStagingEnvironment } from './env';

function parse(raw: string) {
  const values = new Map<string, string>();
  for (const line of raw.split(/\r?\n/)) {
    const separator = line.indexOf('=');
    if (separator < 1 || line.trimStart().startsWith('#')) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    values.set(key, value.replaceAll('\\n', '\n'));
  }
  return values;
}

function setPreviewVariable(name: string, value: string) {
  const branch = process.env.VERCEL_PREVIEW_BRANCH ?? 'stage-13-staging';
  const result = spawnSync('vercel', ['env', 'add', name, 'preview', branch, '--force', '--value', value, '--yes', '--sensitive'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status !== 0) {
    const detail = `${result.stdout}${result.stderr}`.replaceAll(value, '[redacted]').replace(/postgres(?:ql)?:\/\/[^\s]+/gi, '[redacted]').trim();
    throw new Error(`vercel_preview_env_failed:${name}:${detail || 'unknown'}`);
  }
}

async function main() {
  const local = parse(await readFile('.env.local', 'utf8'));
  const { pooled } = await loadStagingEnvironment();
  const email = (process.env.STAGING_ADMIN_EMAIL ?? local.get('ADMIN_EMAIL') ?? local.get('ADMIN_ID') ?? '').trim().toLowerCase();
  const password = local.get('ADMIN_PASSWORD') ?? '';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('blocked_admin_email_not_configured');
  if (!password || !pooled) throw new Error('blocked_preview_credentials_missing');
  const values = new Map([
    ['DATABASE_URL', pooled],
    ['ADMIN_EMAIL', email],
    ['ADMIN_PASSWORD_HASH', await bcrypt.hash(password, 12)],
    ['ADMIN_SESSION_SECRET', randomBytes(48).toString('base64url')],
  ]);
  for (const [name, value] of values) setPreviewVariable(name, value);
  console.log(`Vercel Preview environment configured: ${[...values.keys()].join(', ')}; values logged: false; production modified: false`);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'configure_vercel_preview_failed');
  process.exitCode = 2;
});
