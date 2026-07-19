import { readFile } from 'node:fs/promises';
import path from 'node:path';

const ENV_PATH = path.resolve('.env.staging.local');

function parseLine(line: string) {
  const separator = line.indexOf('=');
  if (separator < 1) return null;
  const key = line.slice(0, separator).trim();
  let value = line.slice(separator + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return { key, value };
}

export async function loadStagingEnvironment() {
  const raw = await readFile(ENV_PATH, 'utf8');
  const values = new Map<string, string>();
  for (const line of raw.split(/\r?\n/)) {
    const parsed = parseLine(line);
    if (parsed) values.set(parsed.key, parsed.value);
  }
  const pooled = values.get('STAGING_DATABASE_URL') ?? '';
  const direct = values.get('STAGING_DATABASE_DIRECT_URL') ?? '';
  return { pooled, direct, path: ENV_PATH };
}

export function safeError(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : 'unknown_error';
  return `database_operation_failed:${code.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

export function inspectConnectionPair(pooledValue: string, directValue: string) {
  if (!pooledValue || !directValue) throw new Error('blocked_missing_credentials');
  if (pooledValue === directValue) throw new Error('blocked_connection_roles_not_separated');
  let pooled: URL;
  let direct: URL;
  try {
    pooled = new URL(pooledValue);
    direct = new URL(directValue);
  } catch {
    throw new Error('blocked_invalid_connection_url');
  }
  const protocolsValid = ['postgres:', 'postgresql:'].includes(pooled.protocol)
    && ['postgres:', 'postgresql:'].includes(direct.protocol);
  if (!protocolsValid) throw new Error('blocked_invalid_connection_protocol');
  const pooledMarker = pooled.hostname.includes('-pooler');
  const directMarker = !direct.hostname.includes('-pooler');
  const sameEndpoint = pooled.hostname.replace('-pooler', '') === direct.hostname;
  const sameDatabase = pooled.pathname === direct.pathname;
  const sameRole = decodeURIComponent(pooled.username) === decodeURIComponent(direct.username);
  const sslRequired = pooled.searchParams.get('sslmode') === 'require' && direct.searchParams.get('sslmode') === 'require';
  return { pooledMarker, directMarker, sameEndpoint, sameDatabase, sameRole, sslRequired };
}
