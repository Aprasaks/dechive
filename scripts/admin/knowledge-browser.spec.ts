import { expect, test } from '@playwright/test';

const baseURL = 'http://localhost:4316';

test('local knowledge editor create, restore and preview', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/admin/knowledge/new`);
  await expect(page.getByRole('heading', { name: '새 지식 작성' })).toBeVisible();
  await expect(page.getByRole('toolbar', { name: '본문 편집 도구' })).toBeVisible();
  for (const name of ['굵게','기울임','취소선','H2','H3','H4','글머리','번호','인용','코드','링크','표','이미지','출처','체크포인트','실행 취소','다시 실행']) {
    await expect(page.getByRole('button', { name })).toBeVisible();
  }
  await page.getByLabel('Slug').fill('stage-11-browser-fixture');
  await page.getByRole('button', { name: 'Draft 저장' }).click();
  await page.waitForURL(/\/admin\/knowledge\/[0-9a-f-]+\/edit/);
  await expect(page.getByText(/Version 1/)).toBeVisible();
  await expect(page.getByText('변경 없음')).toBeVisible();
  await page.getByRole('link', { name: '미리보기' }).first().click();
  await expect(page.getByText('현재 Draft pointer를 렌더링한 로컬 미리보기입니다.')).toBeVisible();
  await expect(page.locator('[data-dechive-document] figure img')).toHaveAttribute('alt', 'Dechive 지식 테스트 대표 이미지');
  await expect(page.locator('[data-dechive-document] [data-source-reference]')).toBeVisible();
  await expect(page.locator('[data-dechive-document] [data-callout]')).toBeVisible();
  for (const width of [768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator('main')).toBeVisible();
    const bodyWidth = await page.locator('body').evaluate((element) => element.scrollWidth <= element.clientWidth + 1);
    expect(bodyWidth).toBe(true);
  }
  await page.goto(`${baseURL}/admin`);
  await expect(page.getByRole('heading', { name: 'Dechive 관리자' })).toBeVisible();
  await expect(page.getByText('1', { exact: true }).first()).toBeVisible();
  await page.getByRole('link', { name: '콘텐츠 목록' }).click();
  await expect(page.getByRole('heading', { name: '지식' })).toBeVisible();
  await expect(page.getByText('AI 답변을 검증하는 첫 번째 기록')).toBeVisible();
  expect(errors).toEqual([]);
});
