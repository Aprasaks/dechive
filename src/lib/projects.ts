import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Project } from '@/types/archive';

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

function parseProject(filename: string): Project | null {
  const filePath = path.join(PROJECTS_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  if (data.status === 'draft') return null;

  return {
    slug: data.slug ?? filename.replace(/\.md$/, ''),
    title: data.title ?? '',
    description: data.description ?? data.summary ?? '',
    summary: data.summary ?? '',
    techStack: Array.isArray(data.techStack) ? data.techStack : [],
    status: data.status ?? 'in-progress',
    url: data.url ?? null,
    github: data.github ?? null,
    thumbnail: data.thumbnail ?? null,
    date: data.date instanceof Date
      ? data.date.toISOString().split('T')[0]
      : String(data.date ?? ''),
    content,
  };
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];

  const files = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.md'));

  return files
    .map(parseProject)
    .filter((p): p is Project => p !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}
