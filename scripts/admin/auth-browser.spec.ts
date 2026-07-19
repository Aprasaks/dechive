import { expect, test } from '@playwright/test';
import { createDatabase } from '../../src/db/client';

const baseURL = process.env.CMS_BASE_URL ?? 'http://localhost:4318';
const ownerEmail = process.env.CMS_OWNER_EMAIL ?? '';
const ownerPassword = process.env.CMS_OWNER_PASSWORD ?? '';

test('single owner authentication protects CMS routes and actions', async ({ page, context }) => {
  const slug = `stage-12b-auth-${Date.now()}`;
  await page.goto(baseURL);
  await expect(page).toHaveURL(`${baseURL}/`);
  const analyticsResponse = await page.request.get(`${baseURL}/api/admin/analytics`);
  expect(analyticsResponse.status()).toBe(401);
  await page.goto(`${baseURL}/admin/analytics`);
  await expect(page).toHaveURL(`${baseURL}/admin/login`);
  await page.goto(`${baseURL}/admin`);
  await expect(page).toHaveURL(`${baseURL}/admin/login`);

  await page.getByLabel('Email').fill(ownerEmail);
  await page.getByLabel('Password').fill('incorrect-password');
  await page.getByRole('button', { name: '들어가기' }).click();
  await expect(page.getByText('아이디 또는 비밀번호가 올바르지 않습니다.')).toBeVisible();

  await page.getByLabel('Password').fill(ownerPassword);
  await page.getByRole('button', { name: '들어가기' }).click();
  await expect(page).toHaveURL(`${baseURL}/admin`);
  await expect(page.getByRole('heading', { name: 'Dechive 관리자' })).toBeVisible();

  const sessionCookie = (await context.cookies()).find((cookie) => cookie.name === 'dechive_admin_session');
  expect(sessionCookie).toMatchObject({ httpOnly: true, sameSite: 'Lax', secure: false });
  expect(sessionCookie?.value).toBeTruthy();

  await page.goto(`${baseURL}/admin/knowledge/new`);
  await page.getByLabel('Slug').fill(slug);
  await page.getByRole('button', { name: 'Draft 저장' }).click();
  await page.waitForURL(/\/admin\/knowledge\/[0-9a-f-]+\/edit/);
  const localizationId = page.url().split('/').at(-2)!;
  await expect(page.getByText(/Version 1/)).toBeVisible();

  await page.getByLabel('요약').fill('Stage 12B owner 수정 저장 검증');
  await page.getByRole('button', { name: 'Draft 저장' }).click();
  await expect(page.getByText('저장 완료 · version 2')).toBeVisible();
  await page.getByRole('link', { name: '미리보기' }).first().click();
  await expect(page.getByText('Stage 12B owner 수정 저장 검증')).toBeVisible();

  const lectureSlug = `stage-14-lecture-${Date.now()}`;
  await page.goto(`${baseURL}/admin/lectures/new`);
  await page.getByLabel('Slug').fill(lectureSlug);
  await page.getByRole('combobox', { name: /기반 지식/ }).selectOption(localizationId);
  await page.getByRole('button', { name: 'Draft 저장' }).click();
  await page.waitForURL(/\/admin\/lectures\/[0-9a-f-]+\/edit/);
  const lectureLocalizationId = page.url().split('/').at(-2)!;
  await expect(page.getByText(/Version 1/)).toBeVisible();
  const lectureEditor = page.getByLabel('강의 본문 편집기');
  await lectureEditor.locator('p').first().click();
  await page.keyboard.press('End');
  await page.keyboard.type(' Stage 14 강의 본문 version 2');
  await page.getByRole('button', { name: 'Draft 저장' }).click();
  await expect(page.getByText('저장 완료 · version 2')).toBeVisible();
  await page.getByRole('link', { name: '미리보기' }).first().click();
  await expect(page.getByText('Stage 14 강의 본문 version 2', { exact: false })).toBeVisible();
  await expect(page.getByText('기반 지식: 새 지식 문서')).toBeVisible();

  const { pool } = createDatabase();
  try {
    const before = await pool.query(`SELECT count(*)::int AS count FROM content_versions WHERE localization_id=$1`, [localizationId]);
    expect(before.rows[0].count).toBe(2);
    const pointers = await pool.query(`SELECT current_published_version_id FROM content_localizations WHERE id=$1`, [localizationId]);
    expect(pointers.rows[0].current_published_version_id).toBeNull();
    const lectureState = await pool.query(`SELECT c.kind::text AS kind,ld.primary_source_knowledge_id,cl.current_published_version_id,array_agg(cv.version_number ORDER BY cv.version_number)::int[] AS versions FROM content_localizations cl JOIN contents c ON c.id=cl.content_id JOIN lecture_details ld ON ld.localization_id=cl.id JOIN content_versions cv ON cv.localization_id=cl.id WHERE cl.id=$1 GROUP BY c.kind,ld.primary_source_knowledge_id,cl.current_published_version_id`, [lectureLocalizationId]);
    expect(lectureState.rows[0]).toMatchObject({ kind: 'lecture', current_published_version_id: null, versions: [1, 2] });

    await page.goto(`${baseURL}/admin/knowledge/${localizationId}/edit`);
    await page.getByLabel('요약').fill('로그아웃 뒤 저장되면 안 되는 내용');
    await page.evaluate(async () => { await fetch('/api/admin/logout', { method: 'POST' }); });
    await page.getByRole('button', { name: 'Draft 저장' }).click();
    await page.waitForTimeout(500);
    const after = await pool.query(`SELECT count(*)::int AS count FROM content_versions WHERE localization_id=$1`, [localizationId]);
    expect(after.rows[0].count).toBe(2);
  } finally { await pool.end(); }

  await page.goto(`${baseURL}/admin/knowledge/${localizationId}/preview`);
  await expect(page).toHaveURL(`${baseURL}/admin/login`);
});
