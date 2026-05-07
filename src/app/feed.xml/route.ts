import { getAllPosts } from '@/lib/posts';
import { generateRssFeed } from '@/lib/rss';

export const dynamic = 'force-static';

export function GET() {
  const feed = generateRssFeed(getAllPosts('ko'), 'ko');

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
