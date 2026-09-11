import type { Metadata } from 'next';
import { PracticeDetailPage } from '@/components/content/EditorialDetailPages';
import { getPublishedPracticeDetail } from '@/lib/content/public';

export const dynamic = 'force-dynamic';
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getPublishedPracticeDetail(slug);
  return detail
    ? { title: detail.title, description: detail.summary || undefined }
    : { title: '실습을 찾을 수 없습니다' };
}

export default async function PracticeDetailRoute({ params }: PageProps) {
  const { slug } = await params;
  return <PracticeDetailPage slug={slug} />;
}
