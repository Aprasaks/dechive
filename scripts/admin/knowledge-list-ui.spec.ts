import { expect, test } from '@playwright/test';

const baseURL = process.env.CMS_BASE_URL ?? 'http://localhost:4320';
const ownerEmail = process.env.CMS_OWNER_EMAIL ?? '';
const ownerPassword = process.env.CMS_OWNER_PASSWORD ?? '';

test('Knowledge 목록 새 지식 작성 버튼은 데스크톱·모바일에서 접근 가능하다', async ({ page }) => {
  await page.goto(`${baseURL}/admin/login`);
  await page.getByLabel('Email').fill(ownerEmail);
  await page.getByLabel('Password').fill(ownerPassword);
  await page.getByRole('button', { name: '들어가기' }).click();
  await page.waitForURL(`${baseURL}/admin`);

  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`${baseURL}/admin/knowledge`);
    const createLink = page.getByRole('link', { name: '새 지식 작성' });
    await expect(createLink).toBeVisible();
    await expect(createLink).toHaveText('+ 새 지식 작성');
    await expect(createLink).toHaveAttribute('aria-label', '새 지식 작성');
    await expect(page.getByRole('columnheader', { name: '버전' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Version' })).toHaveCount(0);

    const styles = await createLink.evaluate((element) => {
      const computed = getComputedStyle(element);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        display: computed.display,
      };
    });
    expect(['flex', 'inline-flex']).toContain(styles.display);
    expect(styles.color).not.toBe(styles.backgroundColor);

    await page.getByRole('link', { name: 'DECHIVE ADMIN' }).focus();
    await page.keyboard.press('Tab');
    await expect(createLink).toBeFocused();
    const focusStyle = await createLink.evaluate((element) => getComputedStyle(element).outlineStyle);
    expect(focusStyle).not.toBe('none');
  }
});
