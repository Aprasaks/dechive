import type { MetadataRoute } from 'next';
import { aiUpdateDays } from '@/data/aiUpdates';
import { getArchivePosts, getDeepDivePosts } from '@/lib/posts';

const BASE_URL = 'https://dechive.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const koPosts = [...getArchivePosts('ko'), ...getDeepDivePosts('ko')];
  const enPosts = [...getArchivePosts('en'), ...getDeepDivePosts('en')];
  const posts = [...koPosts, ...enPosts];

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: post.type === 'deepdive'
      ? `${BASE_URL}${post.lang === 'en' ? '/en' : ''}/deep-dive/${post.slug}`
      : `${BASE_URL}${post.lang === 'en' ? '/en' : ''}/archive/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  const aiUpdateUrls: MetadataRoute.Sitemap = aiUpdateDays.flatMap((day) =>
    day.updates.map((update) => ({
      url: `${BASE_URL}/ai-updates/${day.date}/${update.slug}`,
      lastModified: new Date(`${day.date}T00:00:00+09:00`),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  );

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/archive`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/en/archive`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/deep-dive`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/en/deep-dive`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/book`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/book/parents-ai-guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/ai-updates`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/guestbook`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...postUrls,
    ...aiUpdateUrls,
  ];
}
