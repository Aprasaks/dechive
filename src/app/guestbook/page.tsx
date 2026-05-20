import type { Metadata } from 'next';
import GuestBookClient from '@/components/guestbook/GuestBookClient';

export const metadata: Metadata = {
  title: '검증 질문 남기기',
  description: 'Dechive에서 검증해볼 질문, AI 답변, 깊게 다뤄볼 주제를 남기는 공간입니다.',
};

export default function GuestBookPage() {
  return <GuestBookClient />;
}
