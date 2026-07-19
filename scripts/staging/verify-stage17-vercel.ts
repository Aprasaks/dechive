import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, type Page } from '@playwright/test';
import { Pool } from 'pg';
import { loadStagingEnvironment, safeError } from './env';

function env(raw: string) {
  return new Map(
    raw.split(/\r?\n/).flatMap((line) => {
      const index = line.indexOf('=');
      return index > 0 && !line.trimStart().startsWith('#')
        ? [
            [
              line.slice(0, index).trim(),
              line
                .slice(index + 1)
                .trim()
                .replace(/^['"]|['"]$/g, ''),
            ],
          ]
        : [];
    }),
  );
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
async function createKnowledge(
  page: Page,
  title: string,
  slug: string,
  withReference = true,
) {
  await page.goto('/admin/knowledge/new');
  await page.getByLabel('제목').first().fill(title);
  await page.getByLabel('Slug').fill(slug);
  await page.getByLabel('요약').fill(`${title} summary`);
  if (withReference) {
    await page.getByRole('button', { name: '참고문헌 추가' }).click();
    const reference = page.locator('[class*="reference"]').first();
    await reference.getByLabel('제목').fill('Stage 17 direct verification');
    await reference.getByLabel('유형').selectOption('direct_verification');
    await reference
      .getByLabel('메모')
      .fill('Vercel Preview and Neon staging verification');
  }
  await page.getByRole('button', { name: 'Draft 저장' }).click();
  await page.waitForURL(/\/admin\/knowledge\/[0-9a-f-]+\/edit/);
  return page.url().split('/').at(-2)!;
}

async function main() {
  const base = process.env.STAGING_BASE_URL,
    cookieFile = process.env.VERCEL_BYPASS_COOKIE_FILE;
  if (!base || !cookieFile) throw new Error('stage17_environment_missing');
  const local = env(await readFile('.env.local', 'utf8'));
  const password = local.get('ADMIN_PASSWORD') ?? '';
  const email = (
    process.env.STAGING_ADMIN_EMAIL ?? 'heavenis0113@gmail.com'
  ).toLowerCase();
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
      value: await bypass(cookieFile),
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
    const slug = `stage-17-publish-${Date.now()}`;
    const id = await createKnowledge(page, 'Stage 17 public version 1', slug);
    assert.equal((await page.goto(`/knowledge/${slug}`))?.status(), 404);
    await page.goto(`/admin/knowledge/${id}/edit`);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(2_000);
    const afterFirst = (
      await pool.query<{ draft: number; published: number; actor_id: string }>(
        `SELECT draft.version_number AS draft,published.version_number AS published,published.created_by::text AS actor_id FROM content_localizations cl JOIN content_versions draft ON draft.id=cl.current_draft_version_id JOIN content_versions published ON published.id=cl.current_published_version_id WHERE cl.id=$1`,
        [id],
      )
    ).rows[0];
    assert.equal(afterFirst.draft, 1);
    assert.equal(afterFirst.published, 1);
    await page.goto('/knowledge');
    await page.locator(`a[href="/knowledge/${slug}"]`).waitFor();
    await page.goto(`/knowledge/${slug}`);
    await page.getByRole('heading', { name: 'Stage 17 public version 1', exact: true }).waitFor();

    await page.goto(`/admin/knowledge/${id}/edit`);
    await page.getByLabel('제목').first().fill('Stage 17 public version 2');
    const editor = page.getByLabel('지식 본문 편집기');
    await editor.click();
    await editor.press('ControlOrMeta+End');
    await editor.press('Enter');
    await editor.type('Stage 17 public body version 2');
    await page.getByRole('button', { name: 'Draft 저장' }).click();
    await page.getByText('저장 완료 · version 2').waitFor();
    assert.equal(await page.getByLabel('Slug').isDisabled(), true);
    const separated = (
      await pool.query<{ draft: number; published: number }>(
        `SELECT draft.version_number AS draft,published.version_number AS published FROM content_localizations cl JOIN content_versions draft ON draft.id=cl.current_draft_version_id JOIN content_versions published ON published.id=cl.current_published_version_id WHERE cl.id=$1`,
        [id],
      )
    ).rows[0];
    assert.deepEqual([separated.draft, separated.published], [2, 1]);
    await page.goto(`/knowledge/${slug}`);
    await page.getByRole('heading', { name: 'Stage 17 public version 1', exact: true }).waitFor();
    assert.equal(await page.getByRole('heading', { name: 'Stage 17 public version 2', exact: true }).count(), 0);
    await page.goto(`/admin/knowledge/${id}/preview`);
    await page.getByRole('heading', { name: 'Stage 17 public version 2', exact: true }).waitFor();

    await page.goto(`/admin/knowledge/${id}/edit`);
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(2_000);
    await page.goto(`/knowledge/${slug}`);
    await page.getByRole('heading', { name: 'Stage 17 public version 2', exact: true }).waitFor();
    await page.getByText('Stage 17 public body version 2').waitFor();
    const versions = (
      await pool.query<{ version_number: number; title: string }>(
        `SELECT version_number,migration_metadata->'knowledge'->>'title' AS title FROM content_versions WHERE localization_id=$1 ORDER BY version_number`,
        [id],
      )
    ).rows;
    assert.deepEqual(
      versions.map((row) => row.version_number),
      [1, 2],
    );
    assert.equal(versions[0]?.title, 'Stage 17 public version 1');
    assert.equal(versions[1]?.title, 'Stage 17 public version 2');
    assert.equal(
      (
        await pool.query(
          `SELECT count(*)::int AS count FROM revision_events re JOIN content_versions cv ON cv.id=re.content_version_id WHERE cv.localization_id=$1 AND re.event_type='published'`,
          [id],
        )
      ).rows[0].count,
      2,
    );

    const blockedSlug = `stage-17-unpublished-${Date.now()}`;
    const blockedId = await createKnowledge(
      page,
      'Stage 17 unpublished',
      blockedSlug,
      false,
    );
    assert.equal(
      await page.getByRole('button', { name: 'Publish' }).isDisabled(),
      true,
    );
    assert.equal((await page.goto(`/knowledge/${blockedSlug}`))?.status(), 404);
    await page.goto('/knowledge');
    assert.equal(await page.getByText('Stage 17 unpublished').count(), 0);

    await page.goto(`/admin/knowledge/${blockedId}/edit`);
    await page.evaluate(() => fetch('/api/admin/logout', { method: 'POST' }));
    await page.goto(`/admin/knowledge/${blockedId}/edit`);
    assert.equal(new URL(page.url()).pathname, '/admin/login');
    await login(page, email, password);
    revoked = afterFirst.actor_id;
    await pool.query(
      `DELETE FROM actor_role_memberships WHERE actor_id=$1 AND role='owner'`,
      [revoked],
    );
    await page.goto(`/admin/knowledge/${id}/edit`);
    assert.equal(new URL(page.url()).pathname, '/admin/login');
    await pool.query(
      `INSERT INTO actor_role_memberships(actor_id,role,granted_by) VALUES ($1,'owner',$1) ON CONFLICT DO NOTHING`,
      [revoked],
    );
    revoked = undefined;
    const stage15 = (
      await pool.query<{ relation_ok: boolean }>(
        `SELECT ld.primary_source_knowledge_id=source.content_id AS relation_ok FROM content_localizations lecture JOIN lecture_details ld ON ld.localization_id=lecture.id JOIN content_localizations source ON source.slug='stage-15-knowledge-1784431875407' WHERE lecture.slug='stage-15-knowledge-1784431875407-lecture'`,
      )
    ).rows[0];
    assert(stage15?.relation_ok);
    console.log(
      JSON.stringify({
        status: 'stage17_https_verified',
        slug,
        versions: [1, 2],
        firstPublish: true,
        draftPublishedSeparated: true,
        republish: true,
        publishedSlugLocked: true,
        public404: true,
        unpublishedIsolated: true,
        logoutBlocked: true,
        membershipBlocked: true,
        lectureRelationPreserved: true,
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
  const detail = error instanceof Error ? `${error.name}:${error.message}` : 'unknown';
  console.error(`Stage 17 HTTPS: ${safeError(error)}; ${detail.slice(0, 500)}; credentials redacted`);
  process.exitCode = 2;
});
