'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  archiveKnowledgeAction,
  deleteKnowledgeDraftAction,
  withdrawKnowledgeAction,
} from '@/app/admin/knowledge/actions';
import type { KnowledgeListItem } from '@/services/knowledge-drafts';
import { KnowledgeShareButton } from './KnowledgeShareButton';
import styles from './KnowledgeEditor.module.css';

const messages: Record<string, string> = {
  knowledge_delete_published_forbidden: '이미 발행된 글은 일반 삭제할 수 없습니다.',
  knowledge_delete_legacy_blocked: '기존 이전 데이터와 연결되어 삭제할 수 없습니다.',
  knowledge_delete_relation_blocked: '다른 콘텐츠와 연결되어 삭제할 수 없습니다.',
  knowledge_not_published: '현재 발행된 글이 없습니다.',
};

export function KnowledgeListActions({ item }: { item: KnowledgeListItem }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const action = async (run: () => Promise<{ ok: boolean; error?: string }>, success: string) => {
    setBusy(true);
    setMessage('처리 중');
    const result = await run();
    if (!result.ok) {
      setMessage(messages[result.error ?? ''] ?? '처리하지 못했습니다.');
      setBusy(false);
      return false;
    }
    setMessage(success);
    setBusy(false);
    router.refresh();
    return true;
  };
  const deleteDraft = async () => {
    const deleted = await action(() => deleteKnowledgeDraftAction(item.id), '삭제했습니다.');
    if (deleted) {
      setDeleteOpen(false);
      router.push('/admin/knowledge');
    }
  };
  const isPublished = item.workflowStatus === 'published' && Boolean(item.publishedVersionNumber);
  return (
    <div className={styles.rowActions}>
      <Link className={styles.textLink} href={`/admin/knowledge/${item.id}/edit`}>편집</Link>
      <Link className={styles.textLink} href={`/admin/knowledge/${item.id}/preview`}>미리보기</Link>
      {isPublished ? (
        <>
          <KnowledgeShareButton url={`https://dechive.dev/knowledge/${encodeURIComponent(item.slug)}`} />
          <button type="button" className={styles.textButton} disabled={busy} onClick={() => { if (window.confirm('이 Knowledge의 발행을 취소할까요? 공개 페이지에서 내려갑니다.')) void action(() => withdrawKnowledgeAction(item.id), '발행을 취소했습니다.'); }}>발행 취소</button>
          <button type="button" className={styles.textButton} disabled={busy} onClick={() => { if (window.confirm('이 Knowledge를 보관할까요? 공개 페이지에서 내려갑니다.')) void action(() => archiveKnowledgeAction(item.id), '보관했습니다.'); }}>보관</button>
        </>
      ) : item.workflowStatus === 'draft' ? (
        <button type="button" className={styles.textButton} disabled={busy} onClick={() => setDeleteOpen(true)}>삭제</button>
      ) : null}
      {message ? <small role="status">{message}</small> : null}
      {deleteOpen ? (
        <div className={styles.modalBackdrop} role="presentation">
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={`delete-title-${item.id}`}>
            <h2 id={`delete-title-${item.id}`}>작성 중인 글 삭제</h2>
            <p>다음 글을 삭제합니다.</p>
            <strong>{item.title}</strong>
            <div className={styles.actions}>
              <button type="button" className={styles.button} onClick={() => setDeleteOpen(false)} disabled={busy}>취소</button>
              <button type="button" className={`${styles.button} ${styles.danger}`} onClick={() => void deleteDraft()} disabled={busy}>{busy ? '삭제 중…' : '삭제'}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
