import type { Metadata } from 'next';
import { BookDetailPage } from '@/components/content/EditorialDetailPages';
import { getPublishedBookDetail } from '@/lib/content/public';

export const dynamic = 'force-dynamic';
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getPublishedBookDetail(slug);
  return detail
    ? { title: detail.title, description: detail.summary || undefined }
    : { title: '책을 찾을 수 없습니다' };
}

export default async function BookDetailRoute({ params }: PageProps) {
  const { slug } = await params;
  return <BookDetailPage slug={slug} />;
}
