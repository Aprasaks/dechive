'use client';
import { useState } from 'react';
import { archiveKnowledgeAction, publishKnowledgeDraftAction, withdrawKnowledgeAction } from '@/app/admin/knowledge/actions';
import { formatKnowledgeDateTime } from '@/features/knowledge/date-format';
import { KnowledgeShareButton } from './KnowledgeShareButton';
import styles from './KnowledgeEditor.module.css';

type Props = {
  localizationId: string;
  draftVersionNumber: number;
  publishedVersionNumber: number | null;
  ready: boolean;
  blockingErrors: string[];
  warnings: string[];
  workflowStatus: 'draft' | 'published' | 'withdrawn' | 'archived';
  slug: string;
  createdAt: string;
  publishedAt: string | null;
  lastPublishedAt: string | null;
};

export function KnowledgePublishPanel({
  localizationId,
  draftVersionNumber,
  publishedVersionNumber,
  ready,
  blockingErrors,
  warnings,
  workflowStatus,
  slug,
  createdAt,
  publishedAt,
  lastPublishedAt,
}: Props) {
  const [state, setState] = useState<
    'idle' | 'publishing' | 'published' | 'failed'
  >('idle');
  const [message, setMessage] = useState('');
  const isCurrentPublished = workflowStatus === 'published' && publishedVersionNumber === draftVersionNumber;
  const labels: Record<string, string> = {
    title_required: '제목을 입력해 주세요.',
    summary_required: '요약을 입력해 주세요.',
    slug_invalid: 'slug를 영문 소문자·숫자·하이픈으로 입력해 주세요.',
    locale_invalid: '언어 설정을 확인해 주세요.',
    body_required: '본문을 입력해 주세요.',
    tags_too_many: '태그는 최대 12개까지 입력할 수 있어요.',
    tag_too_long: '태그는 40자 이내로 입력해 주세요.',
    hero_media_alt_required: '대표 이미지의 대체 텍스트를 입력해 주세요.',
    media_alt_missing: '이미지의 대체 텍스트를 입력해 주세요.',
    media_alt_required: '이미지의 대체 텍스트를 입력해 주세요.',
    media_reference: '이미지 파일 연결을 확인해 주세요.',
    media_publish_validation_failed: '이미지의 승인 상태와 대체 텍스트를 확인해 주세요.',
    document_invalid: '본문 형식을 확인해 주세요.',
    'root.type': '본문 문서 형식을 확인해 주세요.',
    'root.content': '본문 내용을 확인해 주세요.',
    'schema.version': '본문 문서 버전을 확인해 주세요.',
    'object.prototype_key': '본문에 허용되지 않는 데이터가 포함되어 있어요.',
    'node.unknown': '본문에 지원하지 않는 블록이 있어요.',
    'node.unknown_quarantined': '본문에 발행할 수 없는 블록이 있어요.',
    'attribute.unknown': '본문 블록의 설정을 확인해 주세요.',
    'attribute.oversized': '본문 속성이 너무 커요.',
    'attribute.markup': '본문 속성에 허용되지 않는 마크업이 있어요.',
    'mark.unknown': '본문에 지원하지 않는 서식이 있어요.',
    'url.protocol': '본문 링크 주소를 확인해 주세요.',
    'heading.level': '제목 단계가 올바르지 않아요.',
    'heading.anchor_required': '제목 링크 정보를 확인해 주세요.',
    'heading.anchor_duplicate': '중복된 제목 링크가 있어요.',
    'media.reference': '이미지 주소 또는 이미지 연결을 확인해 주세요.',
    'source.id': '본문 출처 연결을 확인해 주세요.',
    'table.child': '표의 구조를 확인해 주세요.',
    'table.row_child': '표 행의 셀을 확인해 주세요.',
    'table.cell_empty': '표의 빈 셀을 확인해 주세요.',
    'document.depth': '본문 구조가 너무 깊게 중첩되어 있어요.',
    'document.node_count': '본문 블록 수가 너무 많아요.',
    'text.node_too_large': '한 문단이 너무 길어요. 문단을 나누어 주세요.',
    tags_missing: '태그를 한 개 이상 입력해 주세요.',
  };
  const readable = (value: string) => labels[value] ?? '입력 내용을 확인해 주세요.';
  async function publish() {
    if (!ready || state === 'publishing') return;
    setState('publishing');
    setMessage('발행 중');
    const result = await publishKnowledgeDraftAction(localizationId);
    if (!result.ok) {
      setState('failed');
      setMessage('발행 실패: 입력 내용을 확인해 주세요.');
      return;
    }
    setState('published');
    setMessage(
      result.alreadyPublished
        ? '이미 현재 버전이 발행되어 있습니다.'
        : '발행 완료',
    );
    window.location.reload();
  }
  return (
    <section className={styles.publishPanel} aria-label="발행 준비 상태">
      <h2>발행</h2>
      <p>
        현재 작성본: 버전 {draftVersionNumber} · 현재 공개 버전:{' '}
        {publishedVersionNumber === null
          ? '없음'
          : `버전 ${publishedVersionNumber}`}
      </p>
      <dl className={styles.dateList}>
        <div><dt>작성일</dt><dd>{formatKnowledgeDateTime(createdAt)}</dd></div>
        <div><dt>발행일</dt><dd>{publishedAt ? formatKnowledgeDateTime(publishedAt) : '아직 발행되지 않음'}</dd></div>
        <div><dt>최종 수정일</dt><dd>{lastPublishedAt ? formatKnowledgeDateTime(lastPublishedAt) : '아직 발행되지 않음'}</dd></div>
      </dl>
      {isCurrentPublished ? (
        <p className={styles.notice}>
          현재 작성본은 이미 발행되어 있습니다.
        </p>
      ) : null}
      {blockingErrors.length ? (
        <div className={styles.errorList}>
          <strong>발행 차단</strong>
          <ul>
            {blockingErrors.map((error) => (
            <li key={error}>{readable(error)}</li>
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
        {state === 'publishing' ? '발행 중…' : '발행'}
      </button>
      {isCurrentPublished ? (
        <div className={styles.actions}>
          <KnowledgeShareButton url={`https://dechive.dev/knowledge/${encodeURIComponent(slug)}`} />
          <button type="button" className={styles.button} onClick={async () => { if (!window.confirm('발행을 취소할까요? 공개 페이지에서 내려갑니다.')) return; setMessage('처리 중'); const result = await withdrawKnowledgeAction(localizationId); setMessage(result.ok ? '발행을 취소했습니다.' : '발행 취소에 실패했습니다.'); if (result.ok) window.location.reload(); }}>발행 취소</button>
          <button type="button" className={styles.button} onClick={async () => { if (!window.confirm('이 글을 보관할까요? 공개 페이지에서 내려갑니다.')) return; setMessage('처리 중'); const result = await archiveKnowledgeAction(localizationId); setMessage(result.ok ? '보관했습니다.' : '보관에 실패했습니다.'); if (result.ok) window.location.reload(); }}>보관</button>
        </div>
      ) : null}
    </section>
  );
}
