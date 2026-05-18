/**
 * Root wrapper for the content repository translation script.
 *
 * Real translation policy lives in content/.github/scripts/translate.mjs.
 * 실행: npm run translate
 * 재번역: npm run translate -- --force
 */

import { spawnSync } from 'child_process';
import path from 'path';

const rootDir = process.cwd();
const contentDir = path.join(rootDir, 'content');
const scriptPath = path.join(contentDir, '.github', 'scripts', 'translate.mjs');
const args = process.argv.slice(2);
const force = args.includes('--force');

const env = {
  ...process.env,
  ...(force ? { FORCE_RETRANSLATE: 'true' } : {}),
};

const result = spawnSync(process.execPath, [scriptPath, ...args], {
  cwd: contentDir,
  env,
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
