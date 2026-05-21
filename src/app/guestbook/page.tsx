import type { Metadata } from 'next';
import GuestBookClient from '@/components/guestbook/GuestBookClient';

export const metadata: Metadata = {
  title: '흔적 남기기',
  description: 'Dechive에 질문, 피드백, 짧은 감상, 다뤄볼 주제를 남기는 방명록입니다.',
};

export default function GuestBookPage() {
  return <GuestBookClient />;
}
