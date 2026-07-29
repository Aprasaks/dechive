import assert from 'node:assert/strict';
import {
  getSearchConsoleDateRange,
  normalizeSiteUrl,
  getSearchConsoleReport,
} from '../../src/lib/searchConsoleClient';

assert.equal(normalizeSiteUrl('https://dechive.dev'), 'https://dechive.dev/');
assert.equal(normalizeSiteUrl('sc-domain:dechive.dev'), 'sc-domain:dechive.dev');

const now = new Date('2026-07-29T12:00:00.000Z');
const sevenDays = getSearchConsoleDateRange({
  preset: '7days',
  startDate: '7daysAgo',
  endDate: 'today',
  periodLabel: '최근 7일',
}, now);
assert.equal(sevenDays.startDate, '2026-07-22');
assert.equal(sevenDays.endDate, '2026-07-28');
assert.equal(sevenDays.usable, true);
assert.match(sevenDays.dataNote, /어제까지/);

const today = getSearchConsoleDateRange({
  preset: 'today',
  startDate: 'today',
  endDate: 'today',
  periodLabel: '오늘',
}, now);
assert.equal(today.usable, false);

async function main() {
  const report = await getSearchConsoleReport({
    preset: '30days',
    startDate: '30daysAgo',
    endDate: 'today',
    periodLabel: '최근 30일',
  });
  assert.ok(['not_configured', 'connected', 'permission_denied', 'unavailable', 'data_delayed'].includes(report.status));

  console.log('Search Console client verification passed.');
}

main();
