const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const DATE_PRESETS = [
  { key: 'today', label: '오늘', startDate: 'today', endDate: 'today' },
  { key: 'yesterday', label: '어제', startDate: 'yesterday', endDate: 'yesterday' },
  { key: '7days', label: '최근 7일', startDate: '7daysAgo', endDate: 'today' },
  { key: '30days', label: '최근 30일', startDate: '30daysAgo', endDate: 'today' },
];

function isDate(value) {
  return DATE_PATTERN.test(value ?? '');
}

export function resolveAnalyticsDateRange(params = {}) {
  const startDate = String(params.startDate ?? '');
  const endDate = String(params.endDate ?? '');

  if (isDate(startDate) && isDate(endDate)) {
    return {
      preset: 'custom',
      periodLabel: startDate === endDate ? startDate : `${startDate} - ${endDate}`,
      startDate,
      endDate,
    };
  }

  const preset = DATE_PRESETS.find((item) => item.key === params.preset) ?? DATE_PRESETS[0];

  return {
    preset: preset.key,
    periodLabel: preset.label,
    startDate: preset.startDate,
    endDate: preset.endDate,
  };
}
