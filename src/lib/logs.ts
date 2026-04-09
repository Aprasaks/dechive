import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Log, PostStatus } from '@/types/archive';

const LOGS_DIR = path.join(process.cwd(), 'content', 'logs');

function parseLog(filename: string): Log | null {
  const filePath = path.join(LOGS_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  if (data.status !== 'published') return null;

  return {
    slug: data.slug ?? filename.replace(/\.md$/, ''),
    title: data.title ?? '',
    date: data.date instanceof Date
      ? data.date.toISOString().split('T')[0]
      : String(data.date ?? ''),
    tags: Array.isArray(data.tags) ? data.tags : [],
    summary: data.summary ?? '',
    description: data.description ?? data.summary ?? '',
    status: (data.status as PostStatus) ?? 'draft',
    content,
  };
}

export function getAllLogs(): Log[] {
  if (!fs.existsSync(LOGS_DIR)) return [];

  const files = fs.readdirSync(LOGS_DIR).filter((f) => f.endsWith('.md'));

  return files
    .map(parseLog)
    .filter((l): l is Log => l !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getLogBySlug(slug: string): Log | null {
  if (!fs.existsSync(LOGS_DIR)) return null;

  const files = fs.readdirSync(LOGS_DIR).filter((f) => f.endsWith('.md'));
  const file = files.find((f) => {
    const filePath = path.join(LOGS_DIR, f);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    return (data.slug ?? f.replace(/\.md$/, '')) === slug;
  });

  if (!file) return null;
  return parseLog(file);
}
