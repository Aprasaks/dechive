'use client';

import { useEffect, useRef } from 'react';
import { useAnalytics } from './AnalyticsProvider';
import type { AnalyticsContentType, AnalyticsEventName } from '@/lib/analytics/eventSchema';

type Props = {
  contentType: AnalyticsContentType;
  contentId: string;
  route: string;
  startEvent?: Extract<AnalyticsEventName, 'lecture_start' | 'practice_start'>;
  completeEvent?: Extract<AnalyticsEventName, 'lecture_complete' | 'practice_complete'>;
  progress?: boolean;
};

export default function AnalyticsContentTracker({ contentType, contentId, route, startEvent, completeEvent, progress = true }: Props) {
  const { consent, track } = useAnalytics();
  const openedRef = useRef(false);
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const thresholdsRef = useRef(new Set<number>());
  const activeSecondsRef = useRef(0);
  const visibleSinceRef = useRef<number | null>(null);

  useEffect(() => {
    if (consent !== 'granted' || openedRef.current) return;
    openedRef.current = true;
    track('content_open', { contentType, contentId, route });
    if (startEvent && !startedRef.current) {
      startedRef.current = true;
      track(startEvent, { contentType, contentId, route });
    }
  }, [consent, contentId, contentType, route, startEvent, track]);

  useEffect(() => {
    if (!progress || consent !== 'granted') return;
    const target = document.querySelector<HTMLElement>('[data-dechive-document]');
    if (!target) return;
    visibleSinceRef.current = document.hidden ? null : Date.now();
    const updateActiveTime = () => {
      if (visibleSinceRef.current !== null) {
        activeSecondsRef.current += (Date.now() - visibleSinceRef.current) / 1000;
        visibleSinceRef.current = document.hidden ? null : Date.now();
      }
    };
    const maybeComplete = () => {
      if (!thresholdsRef.current.has(90) || activeSecondsRef.current < 30 || completedRef.current) return;
      completedRef.current = true;
      track('content_progress', { contentType, contentId, route, metadata: { progress: 100, activeSeconds: Math.round(activeSecondsRef.current) } });
      track('content_complete', { contentType, contentId, route, metadata: { progress: 90, activeSeconds: Math.round(activeSecondsRef.current) } });
      if (completeEvent) track(completeEvent, { contentType, contentId, route, metadata: { activeSeconds: Math.round(activeSecondsRef.current) } });
    };
    const onVisibility = () => updateActiveTime();
    const onScroll = () => {
      const rect = target.getBoundingClientRect();
      const height = Math.max(rect.height, 1);
      const percentage = Math.max(0, Math.min(100, ((window.innerHeight - rect.top) / height) * 100));
      const threshold = [25, 50, 75, 90].find((value) => percentage >= value && !thresholdsRef.current.has(value));
      if (threshold === undefined) return;
      thresholdsRef.current.add(threshold);
      track('content_progress', { contentType, contentId, route, metadata: { progress: threshold, activeSeconds: Math.round(activeSecondsRef.current) } });
      maybeComplete();
    };
    const timer = window.setInterval(() => {
      updateActiveTime();
      maybeComplete();
    }, 5_000);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      updateActiveTime();
      maybeComplete();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('scroll', onScroll);
    };
  }, [completeEvent, consent, contentId, contentType, progress, route, track]);

  return null;
}
