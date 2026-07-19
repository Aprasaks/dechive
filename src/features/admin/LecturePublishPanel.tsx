'use client';

import { useState } from 'react';
import { publishLectureDraftAction } from '@/app/admin/lectures/actions';
import styles from './KnowledgeEditor.module.css';

type Props = {
  localizationId: string;
  draftVersionNumber: number;
  publishedVersionNumber: number | null;
  ready: boolean;
  blockingErrors: string[];
  warnings: string[];
  publicSlug: string;
};

export function LecturePublishPanel({
  localizationId,
  draftVersionNumber,
  publishedVersionNumber,
  ready,
  blockingErrors,
  warnings,
  publicSlug,
}: Props) {
  const [state, setState] = useState<'idle' | 'publishing' | 'failed'>('idle');
  const [message, setMessage] = useState('');
  const isCurrentPublished = publishedVersionNumber === draftVersionNumber;

  async function publish() {
    if (!ready || state === 'publishing') return;
    setState('publishing');
    setMessage('발행 중');
    const result = await publishLectureDraftAction(localizationId);
    if (!result.ok) {
      setState('failed');
      setMessage(`발행 실패: ${result.error}`);
      return;
    }
    window.location.reload();
  }

  return (
    <section className={styles.publishPanel} aria-label="강의 발행 준비 상태">
      <h2>발행</h2>
      <p>
        현재 Draft: version {draftVersionNumber} · 현재 Published:{' '}
        {publishedVersionNumber === null ? '없음' : `version ${publishedVersionNumber}`}
      </p>
      {isCurrentPublished ? <p className={styles.notice}>현재 Draft version은 이미 발행되어 있습니다.</p> : null}
      {blockingErrors.length ? (
        <div className={styles.errorList}><strong>발행 차단</strong><ul>{blockingErrors.map((error) => <li key={error}>{error}</li>)}</ul></div>
      ) : <p className={styles.success}>발행 가능</p>}
      {warnings.length ? (
        <div className={styles.warningList}><strong>경고</strong><ul>{warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>
      ) : null}
      {publishedVersionNumber !== null ? <p><a className={styles.textLink} href={`/lecture/${publicSlug}`} target="_blank" rel="noopener noreferrer">공개 강의 보기 <span aria-hidden="true">↗</span></a></p> : null}
      <p aria-live="polite" className={state === 'failed' ? styles.error : styles.status}>{message}</p>
      <button type="button" className={`${styles.button} ${styles.primary}`} disabled={!ready || state === 'publishing' || isCurrentPublished} onClick={publish}>
        {state === 'publishing' ? '발행 중…' : 'Publish'}
      </button>
    </section>
  );
}
