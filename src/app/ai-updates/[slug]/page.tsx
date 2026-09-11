import type { Metadata } from 'next';
import { AiUpdateDetailPage } from '@/components/content/EditorialDetailPages';
import { getPublishedAiUpdateDetail } from '@/lib/content/public';

export const dynamic = 'force-dynamic';
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getPublishedAiUpdateDetail(slug);
  return detail
    ? { title: detail.title, description: detail.changeSummary || detail.summary || undefined }
    : { title: '업데이트를 찾을 수 없습니다' };
}

export default async function AiUpdateDetailRoute({ params }: PageProps) {
  const { slug } = await params;
  return <AiUpdateDetailPage slug={slug} />;
}
