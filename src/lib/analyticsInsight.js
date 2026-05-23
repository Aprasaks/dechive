function metricValue(items, name, key = 'eventName') {
  return items.find((item) => item[key] === name)?.eventCount ?? 0;
}

function isReferral(source) {
  return source.toLowerCase().includes('/ referral');
}

function isDirect(source) {
  const normalized = source.toLowerCase();
  return normalized === 'direct / none' || normalized === '(direct) / (none)';
}

export function createAnalyticsInsight({ summary, sources, events, periodLabel = '선택한 기간' }) {
  if ((summary?.activeUsers ?? 0) === 0) {
    return `${periodLabel}에는 아직 확인된 방문자가 없습니다.`;
  }

  if (sources.some((source) => isReferral(source.sourceMedium))) {
    return `${periodLabel}에는 외부 플랫폼에서 들어온 방문이 확인됩니다.`;
  }

  const scrollCount = metricValue(events, 'scroll');
  if (scrollCount > 0) {
    return '일부 방문자는 페이지를 아래까지 읽었습니다.';
  }

  if ((summary?.screenPageViews ?? 0) > 0 && scrollCount === 0) {
    return '페이지 조회는 있었지만 깊게 읽힌 신호는 아직 약합니다.';
  }

  const topSource = sources[0];
  if (topSource && isDirect(topSource.sourceMedium)) {
    return `${periodLabel}에는 직접 접속 비중이 높습니다.`;
  }

  return `${periodLabel}의 방문 흔적은 아직 뚜렷한 패턴 없이 고르게 분산되어 있습니다.`;
}
