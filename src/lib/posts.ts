import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Post, PostLang, PostStatus } from '@/types/archive';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

// 평균 읽기 속도: 한글 350자/분, 영문 200단어/분
function calcReadingTime(content: string, lang: PostLang): number {
  if (lang === 'ko') {
    const chars = content.replace(/\s/g, '').length;
    return Math.ceil(chars / 350);
  }
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

function parsePost(filename: string): Post | null {
  const filePath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  // published 상태인 글만 노출
  if (data.status !== 'published') return null;

  const lang: PostLang = data.lang ?? 'ko';

  return {
    slug: data.slug ?? filename.replace(/\.(ko|en)\.md$/, ''),
    title: data.title ?? '',
    date: data.date instanceof Date
      ? data.date.toISOString().split('T')[0]
      : String(data.date ?? ''),
    category: data.category ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    summary: data.summary ?? '',
    description: data.description ?? '',
    thumbnail: data.thumbnail ?? '',
    status: (data.status as PostStatus) ?? 'draft',
    lang,
    series: data.series ?? '',
    readingTime: calcReadingTime(content, lang),
    content,
  };
}

export function getAllPosts(lang: PostLang = 'ko'): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) =>
    f.endsWith(`.${lang}.md`),
  );

  return files
    .map(parsePost)
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1)); // 최신순
}

export function getPostBySlug(slug: string, lang: PostLang = 'ko'): Post | null {
  const filename = `${slug}.${lang}.md`;
  const filePath = path.join(POSTS_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  return parsePost(filename);
}

export function getCategories(lang: PostLang = 'ko') {
  const posts = getAllPosts(lang);
  const countMap = new Map<string, number>();

  for (const post of posts) {
    countMap.set(post.category, (countMap.get(post.category) ?? 0) + 1);
  }

  const categories = [{ id: 'all', label: 'All', count: posts.length }];
  countMap.forEach((count, id) => {
    categories.push({ id, label: id, count });
  });

  return categories;
}
