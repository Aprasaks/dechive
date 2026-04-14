import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { getAllLogs } from '@/lib/logs';

const BASE_URL = 'https://dechive.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const koPosts = getAllPosts('ko');
  const enPosts = getAllPosts('en');
  const posts = [...koPosts, ...enPosts];
  const logs = getAllLogs();

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: post.lang === 'en'
      ? `${BASE_URL}/archive/${post.slug}?lang=en`
      : `${BASE_URL}/archive/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const logUrls: MetadataRoute.Sitemap = logs.map((log) => ({
    url: `${BASE_URL}/logs/${log.slug}`,
    lastModified: log.date ? new Date(log.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/archive`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/logs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ...postUrls,
    ...logUrls,
  ];
}
