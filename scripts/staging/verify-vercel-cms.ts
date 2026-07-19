import { readFile } from 'node:fs/promises';
import { chromium, type BrowserContext, type Page } from '@playwright/test';
import { Pool } from 'pg';
import { loadStagingEnvironment, safeError } from './env';

const sessionCookie = 'dechive_admin_session';

function parseEnvironment(raw: string) {
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

async function readBypassCookie(path: string) {
  const lines = (await readFile(path, 'utf8')).split(/\r?\n/);
  const row = lines.find((line) => line.includes('\t_vercel_jwt\t'))?.replace(/^#HttpOnly_/, '');
  const fields = row?.split('\t');
  if (!fields || fields.length < 7 || !fields[6]) throw new Error('vercel_bypass_cookie_missing');
  return fields[6];
}

function assert(condition: unknown, code: string): asserts condition {
  if (!condition) throw new Error(code);
}

async function login(page: Page, email: string, password: string) {
  await page.goto('/admin/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  const responsePromise = page.waitForResponse((response) => response.url().endsWith('/api/admin/login'));
  await page.getByRole('button', { name: '들어가기' }).click();
  const response = await responsePromise;
  assert(response.status() === 200, 'owner_login_failed');
  await page.waitForURL(/\/admin$/);
  return response;
}

async function main() {
  const baseUrl = process.env.STAGING_BASE_URL;
  const bypassPath = process.env.VERCEL_BYPASS_COOKIE_FILE;
  const persistenceSlug = process.env.STAGING_VERIFY_EXISTING_SLUG;
  if (!baseUrl || !bypassPath) throw new Error('staging_browser_environment_missing');
  const url = new URL(baseUrl);
  assert(url.protocol === 'https:', 'staging_url_must_be_https');
  const local = parseEnvironment(await readFile('.env.local', 'utf8'));
  const email = (process.env.STAGING_ADMIN_EMAIL ?? 'heavenis0113@gmail.com').trim().toLowerCase();
  const password = local.get('ADMIN_PASSWORD') ?? '';
  assert(password.length > 0, 'local_admin_password_missing');
  const bypass = await readBypassCookie(bypassPath);
  const { pooled } = await loadStagingEnvironment();
  const pool = new Pool({ connectionString: pooled, max: 1, connectionTimeoutMillis: 10_000 });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: baseUrl });
  await context.addCookies([{ name: '_vercel_jwt', value: bypass, domain: url.hostname, path: '/', secure: true, httpOnly: true, sameSite: 'Lax' }]);
  const page = await context.newPage();
  let revokedActorId: string | undefined;
  try {
    if (persistenceSlug) {
      const loginStarted = performance.now();
      await login(page, email, password);
      const coldLoginMs = Math.round(performance.now() - loginStarted);
      const started = performance.now();
      const row = (await pool.query<{ id: string }>('SELECT id FROM content_localizations WHERE slug=$1', [persistenceSlug])).rows[0];
      assert(row, 'redeploy_draft_missing');
      await page.goto(`/admin/knowledge/${row.id}/preview`);
      assert((await page.locator('body').innerText()).includes('Stage 13 HTTPS 수정 문장'), 'redeploy_preview_content_missing');
      console.log(JSON.stringify({ status: 'redeploy_persistence_verified', slug: persistenceSlug, coldLoginMs, previewMs: Math.round(performance.now() - started), dataPersisted: true, credentialsLogged: false }));
      return;
    }

    await page.goto('/admin');
    assert(new URL(page.url()).pathname === '/admin/login', 'unauthenticated_admin_not_blocked');
    await page.goto('/admin/login?next=https://example.invalid');
    assert(new URL(page.url()).hostname === url.hostname, 'open_redirect_detected');

    const crossLogin = await context.request.post('/api/admin/login', { headers: { Origin: 'https://example.invalid' }, data: { email, password } });
    const crossLogout = await context.request.post('/api/admin/logout', { headers: { Origin: 'https://example.invalid' } });
    assert(crossLogin.status() === 403 && crossLogout.status() === 403, 'cross_origin_auth_not_blocked');

    await page.goto('/admin/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(`${password}-incorrect`);
    const badStarted = performance.now();
    await page.getByRole('button', { name: '들어가기' }).click();
    await page.getByText('아이디 또는 비밀번호가 올바르지 않습니다.').waitFor();
    const invalidLoginMs = Math.round(performance.now() - badStarted);
    const badBody = await page.locator('body').innerText();
    assert(!/postgres|neon|database_url|password_hash|connection string/i.test(badBody), 'credential_detail_exposed_in_error');

    const coldLoginStarted = performance.now();
    const loginResponse = await login(page, email, password);
    const coldLoginMs = Math.round(performance.now() - coldLoginStarted);
    const setCookie = (await loginResponse.headersArray()).filter((header) => header.name.toLowerCase() === 'set-cookie').map((header) => header.value).join(';');
    assert(/HttpOnly/i.test(setCookie) && /Secure/i.test(setCookie) && /SameSite=Lax/i.test(setCookie) && /Max-Age=43200/i.test(setCookie), 'session_cookie_attributes_invalid');
    const firstSession = (await context.cookies()).find((cookie) => cookie.name === sessionCookie);
    assert(firstSession?.httpOnly && firstSession.secure && firstSession.sameSite === 'Lax', 'browser_cookie_attributes_invalid');
    assert(!(await page.evaluate((name) => document.cookie.includes(name), sessionCookie)), 'session_cookie_visible_to_javascript');

    const warmStarted = performance.now();
    await page.goto('/admin');
    const warmAdminMs = Math.round(performance.now() - warmStarted);
    const listStarted = performance.now();
    await page.goto('/admin/knowledge');
    const draftListMs = Math.round(performance.now() - listStarted);

    const slug = `stage-13-vercel-https-${Date.now()}`;
    await page.goto('/admin/knowledge/new');
    await page.getByLabel('제목').fill('Stage 13 Vercel HTTPS 검증 Draft');
    await page.getByLabel('Slug').fill(slug);
    await page.getByLabel('요약').fill('Vercel Preview와 Neon staging의 HTTPS 저장 검증용 Draft입니다.');
    const createStarted = performance.now();
    await page.getByRole('button', { name: 'Draft 저장' }).click();
    await page.waitForURL(/\/admin\/knowledge\/[0-9a-f-]+\/edit$/);
    const createMs = Math.round(performance.now() - createStarted);
    const localizationId = page.url().match(/\/knowledge\/([^/]+)\/edit$/)?.[1];
    assert(localizationId, 'created_localization_id_missing');

    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.press('ControlOrMeta+End');
    await editor.press('Enter');
    await editor.type('Stage 13 HTTPS 수정 문장');
    const saveStarted = performance.now();
    await page.getByRole('button', { name: 'Draft 저장' }).click();
    await page.getByText('저장 완료 · version 2').waitFor();
    const saveMs = Math.round(performance.now() - saveStarted);
    const previewStarted = performance.now();
    await page.goto(`/admin/knowledge/${localizationId}/preview`);
    await page.getByText('Stage 13 HTTPS 수정 문장').waitFor();
    const previewMs = Math.round(performance.now() - previewStarted);

    const state = (await pool.query<{ version_count: number; versions: number[]; draft_version: number; published_id: string | null; actor_id: string; audit_count: number }>(`WITH version_state AS (
      SELECT cl.id,
        count(cv.id)::int AS version_count,
        array_agg(cv.version_number ORDER BY cv.version_number)::int[] AS versions,
        max(cv.version_number) FILTER (WHERE cv.id=cl.current_draft_version_id)::int AS draft_version,
        cl.current_published_version_id AS published_id,
        max(cv.created_by::text) FILTER (WHERE cv.version_number=2) AS actor_id
      FROM content_localizations cl JOIN content_versions cv ON cv.localization_id=cl.id
      WHERE cl.id=$1 GROUP BY cl.id
    ) SELECT vs.*,
      (SELECT count(*)::int FROM revision_events re JOIN content_versions rv ON rv.id=re.content_version_id WHERE rv.localization_id=vs.id AND re.actor_id::text=vs.actor_id) AS audit_count
      FROM version_state vs`, [localizationId])).rows[0];
    assert(state?.version_count === 2 && state.versions.join(',') === '1,2' && state.draft_version === 2 && state.published_id === null && state.audit_count === 2, 'draft_version_state_invalid');

    const directGuardStarted = performance.now();
    await context.clearCookies({ name: sessionCookie });
    await page.goto(`/admin/knowledge/${localizationId}/edit`);
    assert(new URL(page.url()).pathname === '/admin/login', 'logged_out_page_guard_failed');
    const afterLogout = await pool.query<{ count: number }>('SELECT count(*)::int AS count FROM content_versions WHERE localization_id=$1', [localizationId]);
    assert(afterLogout.rows[0]?.count === 2, 'unauthenticated_action_created_version');

    await login(page, email, password);
    const secondSession = (await context.cookies()).find((cookie) => cookie.name === sessionCookie)?.value;
    assert(secondSession && secondSession !== firstSession.value, 'session_nonce_reused');

    revokedActorId = state.actor_id;
    await pool.query(`DELETE FROM actor_role_memberships WHERE actor_id=$1 AND role='owner'`, [revokedActorId]);
    await page.goto('/admin');
    assert(new URL(page.url()).pathname === '/admin/login', 'revoked_membership_still_authorized');
    await pool.query(`INSERT INTO actor_role_memberships(actor_id,role,granted_by) VALUES ($1,'owner',$1) ON CONFLICT DO NOTHING`, [revokedActorId]);
    revokedActorId = undefined;

    const assetUrls = await page.evaluate(() => Array.from(document.scripts).map((script) => script.src).filter(Boolean));
    const forbiddenValues = [password, pooled];
    let clientLeaks = 0;
    for (const assetUrl of assetUrls) {
      const response = await context.request.get(assetUrl);
      const body = await response.text();
      if (/ADMIN_SESSION_SECRET|ADMIN_PASSWORD_HASH|DATABASE_URL|postgres(?:ql)?:\/\//i.test(body) || forbiddenValues.some((value) => value && body.includes(value))) clientLeaks += 1;
      const sourceMap = await context.request.get(`${assetUrl}.map`);
      if (sourceMap.ok()) {
        const mapBody = await sourceMap.text();
        if (/ADMIN_SESSION_SECRET|ADMIN_PASSWORD_HASH|DATABASE_URL|postgres(?:ql)?:\/\//i.test(mapBody) || forbiddenValues.some((value) => value && mapBody.includes(value))) clientLeaks += 1;
      }
    }
    assert(clientLeaks === 0, 'client_credential_leak_detected');

    console.log(JSON.stringify({
      status: 'staging_https_cms_verified', slug, localizationId,
      auth: { unauthenticatedBlocked: true, invalidLoginBlocked: true, ownerLogin: true, crossOriginBlocked: true, openRedirectAbsent: true, logoutBlockedAccess: true, revokedMembershipBlocked: true },
      cookie: { httpOnly: true, secure: true, sameSite: 'Lax', maxAgeSeconds: 43200, uniqueNonce: true, javascriptInaccessible: true },
      cms: { version1Preserved: true, version2Created: true, currentDraftVersion: 2, currentPublishedPointer: null, previewUpdated: true, ownerAuditEvents: 2 },
      security: { directActionAfterLogoutCreatedVersions: 0, clientCredentialLeaks: 0, errorCredentialLeaks: 0 },
      observationsMs: { invalidLogin: invalidLoginMs, coldLogin: coldLoginMs, warmAdmin: warmAdminMs, draftList: draftListMs, draftCreate: createMs, draftSave: saveMs, preview: previewMs, guardRoundTrip: Math.round(performance.now() - directGuardStarted) },
      credentialsLogged: false,
    }));
  } finally {
    if (revokedActorId) await pool.query(`INSERT INTO actor_role_memberships(actor_id,role,granted_by) VALUES ($1,'owner',$1) ON CONFLICT DO NOTHING`, [revokedActorId]).catch(() => undefined);
    await context.close().catch(() => undefined);
    await browser.close().catch(() => undefined);
    await pool.end().catch(() => undefined);
  }
}

void main().catch((error) => {
  console.error(`Staging HTTPS CMS verification: ${safeError(error)}; credentials redacted`);
  process.exitCode = 2;
});
