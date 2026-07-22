'use client';

import { useState } from 'react';
import styles from './KnowledgeEditor.module.css';

export function KnowledgeShareButton({ url, className }: { url: string; className?: string }) {
  const [message, setMessage] = useState('');
  const copyUrl = async () => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return;
    }
    const input = document.createElement('textarea');
    input.value = url;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand('copy');
    input.remove();
    if (!copied) throw new Error('clipboard_unavailable');
  };
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url });
        setMessage('공유 완료');
        return;
      }
      await copyUrl();
      setMessage('링크를 복사했습니다.');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setMessage('링크를 복사하지 못했습니다.');
    }
  };
  return (
    <span className={className}>
      <button type="button" className={styles.button} onClick={share} aria-label="공개 Knowledge 링크 공유">
        공유
      </button>
      {message ? <small role="status">{message}</small> : null}
    </span>
  );
}
