import type { Metadata } from 'next';
import GuestBookClient from '@/components/guestbook/GuestBookClient';

export const metadata: Metadata = {
  title: 'Guestbook | Dechive',
  description: 'Dechive를 지나간 사람들이 남긴 짧은 흔적들.',
};

export default function GuestBookPage() {
  return <GuestBookClient />;
}
