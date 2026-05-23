/**
 * Validate markdown frontmatter before build.
 *
 * This catches broken YAML in content/posts/*.md before Next.js starts
 * collecting page data.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const COMMON_REQUIRED_FIELDS = ['title', 'seoTitle', 'date', 'type', 'category', 'tags', 'slug', 'description', 'status', 'lang'] as const;
const VALID_TYPES = new Set(['archive', 'deepdive']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function validatePost(file: string): string[] {
  const fullPath = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  const errors: string[] = [];

  let data: Record<string, unknown>;

  try {
    const parsed = matter(raw);
    data = isRecord(parsed.data) ? parsed.data : {};
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return [`frontmatter parse failed: ${message}`];
  }

  for (const field of COMMON_REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`missing required field: ${field}`);
    }
  }

  if (typeof data.type !== 'string' || !VALID_TYPES.has(data.type)) {
    errors.push(`type must be one of: ${Array.from(VALID_TYPES).join(', ')}`);
  }

  if (file.endsWith('.en.md') && data.lang !== 'en') {
    errors.push(`expected lang: en, got ${String(data.lang)}`);
  }

  if (file.endsWith('.ko.md') && data.lang !== 'ko') {
    errors.push(`expected lang: ko, got ${String(data.lang)}`);
  }

  if (!Array.isArray(data.tags)) {
    errors.push('tags must be a list');
  }

  if (data.type === 'archive') {
    for (const field of ['subject', 'thumbnail', 'coverImage', 'updated', 'concepts']) {
      if (data[field] !== undefined) errors.push(`archive must not use field: ${field}`);
    }
  }

  if (data.type === 'deepdive') {
    for (const field of ['subject', 'thumbnail', 'updated']) {
      if (data[field] !== undefined) errors.push(`deepdive must not use field: ${field}`);
    }

    if (typeof data.coverImage !== 'string' || data.coverImage.trim() === '') {
      errors.push('deepdive requires coverImage');
    }

    if (!Array.isArray(data.concepts) || data.concepts.length === 0) {
      errors.push('deepdive requires concepts list');
    }
  }

  return errors;
}

function main(): void {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`content posts directory not found: ${POSTS_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort();

  const failures: Array<{ file: string; errors: string[] }> = [];

  for (const file of files) {
    const errors = validatePost(file);
    if (errors.length > 0) failures.push({ file, errors });
  }

  if (failures.length > 0) {
    console.error('Content frontmatter check failed.');
    for (const failure of failures) {
      console.error(`\n${failure.file}`);
      for (const error of failure.errors) {
        console.error(`- ${error}`);
      }
    }
    process.exit(1);
  }

  console.log(`Content frontmatter check passed (${files.length} markdown files).`);
}

main();
