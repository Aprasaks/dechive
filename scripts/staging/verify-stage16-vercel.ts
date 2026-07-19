import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, type Page } from '@playwright/test';
import { Pool } from 'pg';
import { loadStagingEnvironment, safeError } from './env';
function parse(raw: string) {
  const map = new Map<string, string>();
  for (const line of raw.split(/\r?\n/)) {
    const at = line.indexOf('=');
    if (at < 1 || line.trimStart().startsWith('#')) continue;
    let value = line.slice(at + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    )
      value = value.slice(1, -1);
    map.set(line.slice(0, at).trim(), value);
  }
  return map;
}
async function bypass(path: string) {
  const row = (await readFile(path, 'utf8'))
    .split(/\r?\n/)
    .find((line) => line.includes('\t_vercel_jwt\t'))
    ?.replace(/^#HttpOnly_/, '');
  const value = row?.split('\t')[6];
  if (!value) throw new Error('bypass_missing');
  return value;
}
async function login(page: Page, email: string, password: string) {
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: '들어가기' }).click();
  await page.waitForURL(/\/admin$/);
}
async function main() {
  const base = process.env.STAGING_BASE_URL,
    file = process.env.VERCEL_BYPASS_COOKIE_FILE;
  if (!base || !file) throw new Error('stage16_environment_missing');
  const local = parse(await readFile('.env.local', 'utf8')),
    email = (
      process.env.STAGING_ADMIN_EMAIL ?? 'heavenis0113@gmail.com'
    ).toLowerCase(),
    password = local.get('ADMIN_PASSWORD') ?? '';
  assert(password);
  const { direct } = await loadStagingEnvironment();
  const pool = new Pool({
    connectionString: direct,
    max: 1,
    connectionTimeoutMillis: 10_000,
  });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: base });
  const host = new URL(base).hostname;
  await context.addCookies([
    {
      name: '_vercel_jwt',
      value: await bypass(file),
      domain: host,
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
  const page = await context.newPage();
  let revoked: string | undefined;
  try {
    await login(page, email, password);
    const slug = `stage-16-contract-${Date.now()}`;
    await page.goto('/admin/knowledge/new');
    await page.getByLabel('제목').first().fill('Stage 16 HTTPS Knowledge');
    await page.getByLabel('Slug').fill(slug);
    await page.getByLabel('요약').fill('여섯 기본 필드 HTTPS 검증');
    await page.getByLabel('태그').fill(' 검증, TypeScript, 검증, ');
    await page.getByRole('button', { name: '참고문헌 추가' }).click();
    let reference = page.locator('[class*="reference"]').first();
    await reference.getByLabel('제목').fill('공식 문서');
    await reference.getByLabel('URL').fill('https://www.postgresql.org/docs/');
    await page.getByRole('button', { name: 'Draft 저장' }).click();
    await page.waitForURL(/\/admin\/knowledge\/[0-9a-f-]+\/edit/);
    const id = page.url().split('/').at(-2)!;
    const editor = page.getByLabel('지식 본문 편집기');
    await editor.click();
    await editor.press('ControlOrMeta+End');
    await editor.press('Enter');
    await editor.type('Stage 16 HTTPS version 2 body');
    await page.getByLabel('제목').first().fill('Stage 16 HTTPS Knowledge 수정');
    await page.getByLabel('태그').fill(' TypeScript, 지식, TypeScript ');
    reference = page.locator('[class*="reference"]').first();
    await reference.getByLabel('유형').selectOption('direct_verification');
    await reference.getByLabel('URL').fill('');
    await reference.getByLabel('제목').fill('직접 재현');
    await reference
      .getByLabel('메모')
      .fill('Vercel Preview와 Neon staging에서 직접 재현');
    await page.getByRole('button', { name: 'Draft 저장' }).click();
    await page.getByText('저장 완료 · version 2').waitFor();
    await page.goto(`/admin/knowledge/${id}/preview`);
    await page.getByText('Stage 16 HTTPS version 2 body').waitFor();
    await page.getByText('직접 재현', { exact: true }).waitFor();
    const rows = (
      await pool.query<{
        version_number: number;
        metadata: {
          knowledge: {
            tags: string[];
            references: Array<{ type: string; title: string }>;
          };
        };
        actor_id: string;
      }>(
        `SELECT version_number,migration_metadata AS metadata,created_by::text AS actor_id FROM content_versions WHERE localization_id=$1 ORDER BY version_number`,
        [id],
      )
    ).rows;
    assert.deepEqual(
      rows.map((row) => row.version_number),
      [1, 2],
    );
    assert.deepEqual(rows[0]?.metadata.knowledge.tags, ['검증', 'TypeScript']);
    assert.deepEqual(rows[1]?.metadata.knowledge.tags, ['TypeScript', '지식']);
    assert.equal(rows[0]?.metadata.knowledge.references[0]?.type, 'external');
    assert.equal(
      rows[1]?.metadata.knowledge.references[0]?.type,
      'direct_verification',
    );
    const state = (
      await pool.query(
        `SELECT current_published_version_id,route_scope FROM content_localizations WHERE id=$1`,
        [id],
      )
    ).rows[0];
    assert.equal(state.current_published_version_id, null);
    assert.equal(state.route_scope, 'knowledge');
    assert.equal(
      (
        await pool.query(
          `SELECT count(*)::int AS count FROM content_localizations cl JOIN contents c ON c.id=cl.content_id AND c.kind='knowledge' JOIN content_versions cv ON cv.id=cl.current_published_version_id WHERE cl.slug=$1`,
          [slug],
        )
      ).rows[0].count,
      0,
    );
    const oldKnowledge = (
      await pool.query<{ id: string }>(
        `SELECT id FROM content_localizations WHERE slug='stage-15-knowledge-1784431875407'`,
      )
    ).rows[0];
    const oldLecture = (
      await pool.query<{ id: string; relation_ok: boolean }>(
        `SELECT lecture.id,ld.primary_source_knowledge_id=source.content_id AS relation_ok FROM content_localizations lecture JOIN lecture_details ld ON ld.localization_id=lecture.id JOIN content_localizations source ON source.slug='stage-15-knowledge-1784431875407' WHERE lecture.slug='stage-15-knowledge-1784431875407-lecture'`,
      )
    ).rows[0];
    assert(oldKnowledge && oldLecture?.relation_ok);
    await page.goto(`/admin/knowledge/${oldKnowledge.id}/preview`);
    await page.getByText('Stage 15 knowledge version 2').waitFor();
    await page.goto(`/admin/lectures/${oldLecture.id}/preview`);
    await page.getByText('Stage 15 lecture version 2').waitFor();
    await page.goto(`/admin/knowledge/${id}/edit`);
    await context.clearCookies({ name: 'dechive_admin_session' });
    await page.getByRole('button', { name: 'Draft 저장' }).click();
    await page.waitForTimeout(500);
    assert.equal(
      Number(
        (
          await pool.query(
            `SELECT count(*) FROM content_versions WHERE localization_id=$1`,
            [id],
          )
        ).rows[0].count,
      ),
      2,
    );
    await context.addCookies([
      {
        name: '_vercel_jwt',
        value: await bypass(file),
        domain: host,
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'Lax',
      },
    ]);
    await login(page, email, password);
    revoked = rows[1]!.actor_id;
    await pool.query(
      `DELETE FROM actor_role_memberships WHERE actor_id=$1 AND role='owner'`,
      [revoked],
    );
    await page.goto('/admin');
    assert.equal(new URL(page.url()).pathname, '/admin/login');
    await pool.query(
      `INSERT INTO actor_role_memberships(actor_id,role,granted_by) VALUES ($1,'owner',$1) ON CONFLICT DO NOTHING`,
      [revoked],
    );
    revoked = undefined;
    console.log(
      JSON.stringify({
        status: 'stage16_https_contract_verified',
        slug,
        fields: ['title', 'slug', 'summary', 'body', 'tags', 'references'],
        versions: [1, 2],
        tagsNormalized: true,
        referencesImmutable: true,
        publishedPointer: null,
        unpublishedPublicLookupBlocked: true,
        stage15PreviewPreserved: true,
        lectureRelationPreserved: true,
        sessionlessSaveBlocked: true,
        revokedMembershipBlocked: true,
        credentialsLogged: false,
      }),
    );
  } finally {
    if (revoked)
      await pool
        .query(
          `INSERT INTO actor_role_memberships(actor_id,role,granted_by) VALUES ($1,'owner',$1) ON CONFLICT DO NOTHING`,
          [revoked],
        )
        .catch(() => undefined);
    await context.close().catch(() => undefined);
    await browser.close().catch(() => undefined);
    await pool.end().catch(() => undefined);
  }
}
void main().catch((error) => {
  const detail =
    error instanceof Error ? `${error.name}:${error.message}` : 'unknown';
  const redacted = detail
    .replace(/postgres(?:ql)?:\/\/[^\s]+/gi, '[database-url-redacted]')
    .replace(/password=[^\s;]+/gi, 'password=[redacted]')
    .slice(0, 500);
  console.error(
    `Stage 16 HTTPS: ${safeError(error)}; ${redacted}; credentials redacted`,
  );
  process.exitCode = 2;
});
