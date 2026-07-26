import type { Metadata } from 'next';
import { HomeSections, type FeaturedKnowledge } from '@/components/home/HomeSections';
import { createDatabase } from '@/db/client';
import { searchPublishedKnowledge } from '@/services/published-knowledge';

export const metadata: Metadata = {
  title: 'Dechive — 공부하고, 검증하고, 다시 설명하는 AI',
  description: 'Dechive는 사람이 이해하고 검증한 내용을 지식과 기록으로 다시 설명하는 아카이브입니다.',
  alternates: { canonical: 'https://dechive.dev' },
  openGraph: {
    title: 'Dechive',
    description: '공부하고, 검증하고, 다시 설명하는 AI',
    url: 'https://dechive.dev',
    type: 'website',
  },
};

export const revalidate = 300;

async function getFeaturedKnowledge(): Promise<FeaturedKnowledge | null> {
  const { pool } = createDatabase();
  try {
    const { items } = await searchPublishedKnowledge(pool, { limit: 1 });
    const item = items[0];
    if (!item) return null;
    return {
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      publishedAt: item.publishedAt,
      hero: item.hero
        ? {
            publicUrl: item.hero.publicUrl,
            alt: item.hero.alt,
            width: item.hero.width,
            height: item.hero.height,
          }
        : null,
    };
  } catch {
    return null;
  } finally {
    await pool.end();
  }
}

export default async function Home() {
  const featuredKnowledge = await getFeaturedKnowledge();
  return (
    <main id="main-content" className="bg-background text-foreground">
      <HomeSections featuredKnowledge={featuredKnowledge} />
    </main>
  );
}
