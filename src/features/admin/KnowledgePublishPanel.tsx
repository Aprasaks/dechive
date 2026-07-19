'use client';
import { useState } from 'react';
import { publishKnowledgeDraftAction } from '@/app/admin/knowledge/actions';
import styles from './KnowledgeEditor.module.css';

type Props = {
  localizationId: string;
  draftVersionNumber: number;
  publishedVersionNumber: number | null;
  ready: boolean;
  blockingErrors: string[];
  warnings: string[];
};

export function KnowledgePublishPanel({
  localizationId,
  draftVersionNumber,
  publishedVersionNumber,
  ready,
  blockingErrors,
  warnings,
}: Props) {
  const [state, setState] = useState<
    'idle' | 'publishing' | 'published' | 'failed'
  >('idle');
  const [message, setMessage] = useState('');
  const isCurrentPublished = publishedVersionNumber === draftVersionNumber;
  async function publish() {
    if (!ready || state === 'publishing') return;
    setState('publishing');
    setMessage('발행 중');
    const result = await publishKnowledgeDraftAction(localizationId);
    if (!result.ok) {
      setState('failed');
      setMessage(`발행 실패: ${result.error}`);
      return;
    }
    setState('published');
    setMessage(
      result.alreadyPublished
        ? '이미 현재 version이 발행되어 있습니다.'
        : '발행 완료',
    );
    window.location.reload();
  }
  return (
    <section className={styles.publishPanel} aria-label="발행 준비 상태">
      <h2>발행</h2>
      <p>
        현재 Draft: version {draftVersionNumber} · 현재 Published:{' '}
        {publishedVersionNumber === null
          ? '없음'
          : `version ${publishedVersionNumber}`}
      </p>
      {isCurrentPublished ? (
        <p className={styles.notice}>
          현재 Draft version은 이미 발행되어 있습니다.
        </p>
      ) : null}
      {blockingErrors.length ? (
        <div className={styles.errorList}>
          <strong>발행 차단</strong>
          <ul>
            {blockingErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className={styles.success}>발행 가능</p>
      )}
      {warnings.length ? (
        <div className={styles.warningList}>
          <strong>경고</strong>
          <ul>
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <p
        aria-live="polite"
        className={state === 'failed' ? styles.error : styles.status}
      >
        {message}
      </p>
      <button
        type="button"
        className={`${styles.button} ${styles.primary}`}
        disabled={!ready || state === 'publishing' || isCurrentPublished}
        onClick={publish}
      >
        {state === 'publishing' ? '발행 중…' : 'Publish'}
      </button>
    </section>
  );
}
