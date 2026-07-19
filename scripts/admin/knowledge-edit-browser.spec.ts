import { expect, test } from '@playwright/test';

const baseURL = process.env.CMS_BASE_URL ?? 'http://localhost:3000';
const changedSentence = 'Stage 12A에서 수정 저장과 immutable version을 다시 확인했습니다.';

test('existing knowledge draft creates immutable version 2 and updates preview', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${baseURL}/admin/knowledge`);
  const matchingRows = page.getByRole('row').filter({ hasText: 'AI 답변을 검증하는 첫 번째 기록' });
  let row = matchingRows.first();
  for (let index = 0; index < await matchingRows.count(); index += 1) {
    const candidate = matchingRows.nth(index);
    if ((await candidate.locator('td').nth(4).textContent())?.trim() === '1') {
      row = candidate;
      break;
    }
  }
  const currentVersion = (await row.locator('td').nth(4).textContent())?.trim();
  expect(['1', '2']).toContain(currentVersion);
  await row.getByRole('link', { name: '편집' }).click();
  if (currentVersion === '1') {
    await expect(page.getByText('Knowledge · article · Version 1')).toBeVisible();
    const editor = page.locator('[aria-label="지식 본문 편집기"]');
    await editor.locator('p').first().click();
    await page.keyboard.press('End');
    await page.keyboard.type(` ${changedSentence}`);
    await expect(page.getByText('미저장 변경 있음')).toBeVisible();
    await page.getByRole('button', { name: 'Draft 저장' }).click();
    await expect(page.getByText('저장 완료 · version 2')).toBeVisible();
  } else {
    await expect(page.getByText('Knowledge · article · Version 2')).toBeVisible();
  }
  await page.getByRole('link', { name: '미리보기' }).first().click();
  await expect(page.getByText(changedSentence, { exact: false })).toBeVisible();
  expect(errors).toEqual([]);
});
