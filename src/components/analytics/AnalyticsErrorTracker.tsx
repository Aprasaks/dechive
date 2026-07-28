'use client';

import { useEffect, useRef } from 'react';
import { useAnalytics } from './AnalyticsProvider';
import type { AnalyticsEventName } from '@/lib/analytics/eventSchema';

export default function AnalyticsErrorTracker({
  eventName,
  metadata,
}: {
  eventName: Extract<AnalyticsEventName, 'error_404' | 'error_500' | 'client_error' | 'api_error'>;
  metadata?: Record<string, unknown>;
}) {
  const { consent, track } = useAnalytics();
  const sentRef = useRef(false);

  useEffect(() => {
    if (consent !== 'granted' || sentRef.current) return;
    sentRef.current = true;
    track(eventName, { metadata });
  }, [consent, eventName, metadata, track]);

  return null;
}
