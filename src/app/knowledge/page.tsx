import type { Metadata } from 'next';
import { ContentIndexPage } from '@/components/content/ContentIndexPage';

export const metadata: Metadata = { title: 'Knowledge' };
export const dynamic = 'force-dynamic';

export default function KnowledgePage() {
  return <ContentIndexPage type="knowledge" />;
}
