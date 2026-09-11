import type { Metadata } from 'next';
import { ContentIndexPage } from '@/components/content/ContentIndexPage';

export const metadata: Metadata = { title: 'AI Update' };
export const dynamic = 'force-dynamic';

export default function AiUpdatesPage() {
  return <ContentIndexPage type="ai_update" />;
}
