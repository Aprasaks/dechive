import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const allowed = new Set(['STAGING_DATABASE_URL', 'STAGING_DATABASE_DIRECT_URL']);
const name = process.argv[2];
if (!allowed.has(name)) throw new Error('Unsupported staging variable name.');

const label = name === 'STAGING_DATABASE_URL'
  ? 'Neon staging pooled connection string'
  : 'Neon staging direct connection string';
const appleScript = `display dialog "${label}을 입력하세요. 값은 화면과 로그에 다시 표시되지 않습니다." default answer "" with hidden answer buttons {"취소", "저장"} default button "저장" cancel button "취소"\ntext returned of result`;
const value = execFileSync('osascript', ['-e', appleScript], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
if (!value.startsWith('postgresql://') && !value.startsWith('postgres://')) throw new Error('Connection string 형식이 아닙니다. 저장하지 않았습니다.');
if (/\r|\n/.test(value)) throw new Error('Invalid multiline value.');

const target = path.resolve('.env.staging.local');
const entries = new Map();
if (existsSync(target)) {
  for (const line of readFileSync(target, 'utf8').split(/\r?\n/)) {
    const separator = line.indexOf('=');
    if (separator > 0) entries.set(line.slice(0, separator), line.slice(separator + 1));
  }
}
entries.set(name, value);
const body = [...entries].map(([key, entry]) => `${key}=${entry}`).join('\n') + '\n';
writeFileSync(target, body, { encoding: 'utf8', mode: 0o600 });
chmodSync(target, 0o600);
process.stdout.write(`saved ${name} to ignored staging env\n`);
