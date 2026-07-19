import { expect, test } from '@playwright/test';

const url = 'http://localhost:3000/dev/editor-lab';

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
]) {
  test(`${viewport.name} layout and editor runtime`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize(viewport);
    await page.goto(url);
    await expect(page.getByRole('heading', { name: 'Editor Runtime Lab' })).toBeVisible();
    await page.waitForTimeout(500);
    if (await page.locator('.ProseMirror').count() === 0) throw new Error(`Editor did not mount. Browser errors: ${errors.join(' | ')}`);
    await expect(page.locator('.ProseMirror')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.getByRole('toolbar', { name: '문서 편집 도구' })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('Korean composition, autosave, restore and editing commands', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://localhost:3000' });
  await page.goto(url);
  const editor = page.locator('.ProseMirror');
  await editor.click();
  await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.press('Enter');
  await editor.dispatchEvent('compositionstart', { data: '' });
  await page.keyboard.insertText('빠른 한국어 연속 입력 테스트');
  await expect(page.getByText(/저장:\s*composing/)).toBeVisible();
  await page.waitForTimeout(850);
  await expect(page.getByText(/저장:\s*composing/)).toBeVisible();
  await editor.dispatchEvent('compositionend', { data: '테스트' });
  await expect(editor).toContainText('빠른 한국어 연속 입력 테스트');
  await expect(page.getByText(/저장:\s*saved/)).toBeVisible({ timeout: 2500 });
  await page.getByRole('button', { name: '제목 2' }).click();
  await page.keyboard.insertText(' 새 제목');
  await page.getByRole('button', { name: '목록', exact: true }).click();
  await page.keyboard.insertText('목록 항목');
  await page.getByRole('button', { name: '실행 취소' }).click();
  await page.getByRole('button', { name: '다시 실행' }).click();
  await page.evaluate(() => navigator.clipboard.writeText('붙여넣기 검증'));
  await editor.click();
  await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.press('Enter');
  await page.keyboard.press('ControlOrMeta+V');
  await expect(editor).toContainText('붙여넣기 검증');
  await page.getByLabel('저장 실패 simulation').check();
  await page.keyboard.insertText(' 실패');
  await expect(page.getByText(/저장:\s*failed/)).toBeVisible({ timeout: 2500 });
  await page.getByLabel('저장 실패 simulation').uncheck();
  await page.keyboard.insertText(' 복구');
  await expect(page.getByText(/저장:\s*saved/)).toBeVisible({ timeout: 2500 });
  await page.reload();
  await page.getByRole('button', { name: 'localStorage 복원' }).click();
  await expect(editor).toContainText('빠른 한국어 연속 입력 테스트');
});

test('table, code, fixture load, snapshot and unknown blocking', async ({ page }) => {
  await page.goto(url);
  await page.getByRole('button', { name: '표와 이미지 Archive' }).click();
  const firstCell = page.locator('.ProseMirror td').first();
  await firstCell.click();
  await page.keyboard.insertText('표 셀 입력');
  await expect(firstCell).toContainText('표 셀 입력');
  await page.getByRole('button', { name: '코드 블록 45개 Archive' }).click();
  await expect(page.locator('.ProseMirror pre')).toHaveCount(45);
  await page.getByRole('button', { name: 'Heading 104개 Deep Dive KO' }).click();
  await expect(page.locator('.ProseMirror h1, .ProseMirror h2, .ProseMirror h3, .ProseMirror h4, .ProseMirror h5, .ProseMirror h6')).toHaveCount(104);
  await page.getByRole('button', { name: 'Publish Snapshot' }).click();
  await expect(page.getByRole('heading', { name: 'Publish Snapshot' })).toBeVisible();
  await page.getByRole('button', { name: 'Unknown 삽입' }).click();
  await expect(page.getByText(/해결 전 Publish Snapshot이 차단/)).toBeVisible();
  await page.getByRole('button', { name: 'Publish Snapshot' }).click();
  await expect(page.getByRole('heading', { name: 'Publish Snapshot' })).toHaveCount(0);
  await expect(page.locator('[data-unknown-node]')).toContainText('레거시 구조도 원문이 보존됨');
});

test('development performance observations', async ({ page }) => {
  const navigationStart = Date.now();
  await page.goto(url);
  await page.locator('.ProseMirror').waitFor();
  const editorReadyMs = Date.now() - navigationStart;
  const fixtureLoads: Record<string, number> = {};
  for (const label of ['Heading 104개 Deep Dive KO', '코드 블록 45개 Archive', '이미지 5개 Deep Dive', '100k자 수준 Deep Dive EN']) {
    const started = Date.now();
    await page.getByRole('button', { name: label }).click();
    await page.locator('.ProseMirror').waitFor();
    await page.waitForTimeout(50);
    fixtureLoads[label] = Date.now() - started;
  }
  const editor = page.locator('.ProseMirror');
  await editor.click();
  const keyStart = await page.evaluate(() => performance.now());
  await page.keyboard.insertText('성능');
  const keyResponseMs = await page.evaluate(async (start) => { await new Promise(requestAnimationFrame); return performance.now() - start; }, keyStart);
  await page.getByRole('button', { name: 'Publish Snapshot' }).click();
  await expect(page.getByRole('heading', { name: 'Publish Snapshot' })).toBeVisible();
  const serializationLabel = await page.locator('dd').filter({ hasText: /ms$/ }).last().textContent();
  const memory = await page.evaluate(() => {
    const measured = performance as Performance & { memory?: { usedJSHeapSize: number } };
    return measured.memory?.usedJSHeapSize ?? null;
  });
  console.log(`EDITOR_RUNTIME_BROWSER_METRICS ${JSON.stringify({ editorReadyMs, fixtureLoads, keyResponseMs, serializationLabel, usedJSHeapSize: memory })}`);
});

test('malicious HTML paste is sanitized and security fixtures load', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(url);
  const editor = page.locator('.ProseMirror');
  await editor.click();
  await page.evaluate(() => {
    const target = document.querySelector('.ProseMirror');
    const transfer = new DataTransfer();
    transfer.setData('text/html', '<p onclick="window.__xss=1">붙여넣은 <strong>본문</strong></p><script>window.__xss=2</script><a href="javascript:alert(1)">위험 링크</a><img src="https://tracker.example/pixel.gif" onerror="window.__xss=3">');
    transfer.setData('text/plain', '붙여넣은 본문 위험 링크');
    target?.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: transfer }));
  });
  await expect(editor).toContainText('붙여넣은 본문');
  expect(await page.evaluate(() => (window as Window & { __xss?: number }).__xss ?? 0)).toBe(0);
  expect(await editor.locator('script, iframe, svg, style, [onerror], [onclick], a[href^="javascript:"], img[src^="http"]').count()).toBe(0);
  await page.getByRole('button', { name: 'Publish Snapshot' }).click();
  await expect(page.getByRole('heading', { name: 'Publish Snapshot' })).toBeVisible();
  await page.getByRole('button', { name: 'Schema v2 migration fixture' }).click();
  await expect(editor.locator('figure')).toHaveCount(1);
  await page.getByRole('button', { name: 'GFM + HTML fallback table fixture' }).click();
  await expect(editor.locator('table')).toHaveCount(2);
  expect(errors).toEqual([]);
});
