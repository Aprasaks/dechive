import type { Post, PostLang } from '@/types/archive';

const BASE_URL = 'https://dechive.dev';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getPostUrl(post: Post): string {
  return post.lang === 'en'
    ? `${BASE_URL}/en/archive/${post.slug}`
    : `${BASE_URL}/archive/${post.slug}`;
}

function getFeedMeta(lang: PostLang) {
  if (lang === 'en') {
    return {
      title: 'Dechive English',
      description: 'A quiet library where thoughts stay.',
      link: `${BASE_URL}/en/feed.xml`,
      language: 'en',
    };
  }

  return {
    title: 'Dechive',
    description: '생각과 지식을 짧은 책처럼 기록하고 다시 탐색하기 위한 개인 도서관입니다.',
    link: `${BASE_URL}/feed.xml`,
    language: 'ko',
  };
}

export function generateRssFeed(posts: Post[], lang: PostLang): string {
  const meta = getFeedMeta(lang);
  const latestDate = posts[0]?.date ? new Date(posts[0].date) : new Date();

  const items = posts
    .map((post) => {
      const url = getPostUrl(post);
      const pubDate = post.date ? new Date(post.date).toUTCString() : new Date().toUTCString();

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${url}</guid>
      <category>${escapeXml(post.category)}</category>
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(meta.title)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(meta.description)}</description>
    <language>${meta.language}</language>
    <lastBuildDate>${latestDate.toUTCString()}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${meta.link}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;
}
