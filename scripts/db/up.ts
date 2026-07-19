import { spawnSync } from 'node:child_process';

const composeArgs = ['compose', '-f', 'docker-compose.db.yml'];
const readinessTimeoutMs = 60_000;
const readinessIntervalMs = 1_000;

function runDocker(args: string[], stdio: 'inherit' | 'ignore') {
  return spawnSync('docker', args, { stdio }).status === 0;
}

function wait(milliseconds: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

function fail(message: string): never {
  console.error(`\n로컬 PostgreSQL을 준비하지 못했습니다: ${message}`);
  console.error('상태 확인: npm run db:status');
  console.error('로그 확인: npm run db:logs');
  process.exit(1);
}

if (!runDocker([...composeArgs, 'up', '-d', 'postgres'], 'inherit')) {
  fail('Docker가 실행 중인지와 docker-compose.db.yml을 확인해 주세요.');
}

const deadline = Date.now() + readinessTimeoutMs;
while (Date.now() < deadline) {
  if (
    runDocker(
      [...composeArgs, 'exec', '-T', 'postgres', 'pg_isready', '-U', 'dechive', '-d', 'dechive_test'],
      'ignore',
    )
  ) {
    console.log('로컬 PostgreSQL이 연결을 받을 준비가 되었습니다.');
    process.exit(0);
  }
  wait(readinessIntervalMs);
}

fail('60초 안에 readiness 확인을 통과하지 못했습니다.');
