import type { Metadata } from 'next';
import { ContentIndexPage } from '@/components/content/ContentIndexPage';

export const metadata: Metadata = { title: 'Lecture' };
export const dynamic = 'force-dynamic';

export default function LecturePage() {
  return <ContentIndexPage type="lecture" />;
}
