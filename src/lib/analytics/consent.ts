export const ANALYTICS_CONSENT_KEY = 'dechive_analytics_consent';
export type AnalyticsConsent = 'granted' | 'denied' | 'unknown';

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') return 'unknown';
  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return value === 'granted' || value === 'denied' ? value : 'unknown';
}

export function writeAnalyticsConsent(value: Exclude<AnalyticsConsent, 'unknown'>): void {
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
}
