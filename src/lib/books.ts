import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BookNote {
  slug: string;
  title: string;
  author: string;
  publisher: string;
  date: string;
  readDate: string;
  coverImage: string;
  tags: string[];
  status: 'draft' | 'published';
  lang: 'ko' | 'en';
  summary: string;
  content: string;
}

const BOOKS_DIR = path.join(process.cwd(), 'src', 'content', 'books');

function toDateString(value: unknown) {
  if (value instanceof Date) return value.toISOString().split('T')[0];
  return String(value ?? '');
}

function parseBook(filename: string): BookNote | null {
  const filePath = path.join(BOOKS_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  if (data.status !== 'published') return null;

  return {
    slug: data.slug ?? filename.replace(/\.(ko|en)\.md$/, ''),
    title: data.title ?? '',
    author: data.author ?? '',
    publisher: data.publisher ?? '',
    date: toDateString(data.date),
    readDate: toDateString(data.readDate),
    coverImage: data.coverImage ?? '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    status: data.status ?? 'draft',
    lang: data.lang ?? 'ko',
    summary: data.summary ?? '',
    content,
  };
}

export function getAllBookNotes(lang: 'ko' | 'en' = 'ko') {
  if (!fs.existsSync(BOOKS_DIR)) return [];

  return fs
    .readdirSync(BOOKS_DIR)
    .filter((filename) => filename.endsWith(`.${lang}.md`))
    .map(parseBook)
    .filter((book): book is BookNote => book !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getBookNoteBySlug(slug: string, lang: 'ko' | 'en' = 'ko') {
  const filename = `${slug}.${lang}.md`;
  const filePath = path.join(BOOKS_DIR, filename);

  if (!fs.existsSync(filePath)) return null;

  return parseBook(filename);
}
