'use client';

import { useAnalytics } from './AnalyticsProvider';

export default function AnalyticsConsentSettings() {
  const { consent, setConsent } = useAnalytics();
  return <div className="mt-5 border border-border bg-muted/25 p-4"><p className="text-sm font-semibold text-foreground">익명 분석 설정</p><p className="mt-2 text-sm leading-6 text-muted-foreground">현재 상태: {consent === 'granted' ? '허용' : consent === 'denied' ? '거부' : '아직 선택하지 않음'}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" className="border border-border px-3 py-2 text-xs text-foreground" onClick={() => setConsent('denied')}>분석 거부</button><button type="button" className="bg-accent px-3 py-2 text-xs font-semibold text-white" onClick={() => setConsent('granted')}>익명 분석 허용</button></div></div>;
}
