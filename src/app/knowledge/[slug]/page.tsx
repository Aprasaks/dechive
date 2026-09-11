import type { Metadata } from 'next';
import { KnowledgeDetailPage } from '@/components/content/KnowledgeDetailPage';
import { getPublishedKnowledgeDetail } from '@/lib/content/public';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getPublishedKnowledgeDetail(slug);

  if (!detail) {
    return { title: '지식을 찾을 수 없습니다' };
  }

  return {
    title: detail.title,
    description: detail.summary || undefined,
  };
}

export default async function KnowledgeDetailRoute({ params }: PageProps) {
  const { slug } = await params;
  return <KnowledgeDetailPage slug={slug} />;
}
