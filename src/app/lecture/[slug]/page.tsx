import type { Metadata } from 'next';
import { LectureDetailPage } from '@/components/content/EditorialDetailPages';
import { getPublishedLectureDetail } from '@/lib/content/public';

export const dynamic = 'force-dynamic';
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getPublishedLectureDetail(slug);
  return detail
    ? { title: detail.title, description: detail.summary || undefined }
    : { title: '강의를 찾을 수 없습니다' };
}

export default async function LectureDetailRoute({ params }: PageProps) {
  const { slug } = await params;
  return <LectureDetailPage slug={slug} />;
}
