/**
 * 번역 스크립트: 한글 포스트(.ko.md) → 영문 포스트(.en.md) 자동 생성
 *
 * 실행: npm run translate
 * 재번역: npm run translate -- --force
 * - Claude Haiku 모델 사용 (번역에 충분한 성능, 저비용)
 * - ANTHROPIC_API_KEY 환경변수 필요 (.env.local)
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Anthropic from '@anthropic-ai/sdk';
import { config } from 'dotenv';

config({ path: '.env.local' });

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const FORCE = process.argv.includes('--force');

interface Frontmatter {
  title: string;
  date: string | Date;
  category: string;
  tags: string[];
  slug: string;
  description: string;
  seoTitle?: string;
  thumbnail: string;
  status: string;
  lang: string;
  subject?: string;
}

function formatDate(date: unknown): string {
  if (date instanceof Date) return date.toISOString().split('T')[0];
  return String(date);
}

function buildFrontmatter(fm: Frontmatter): string {
  const lines: string[] = ['---'];
  lines.push(`title: ${JSON.stringify(fm.title)}`);
  lines.push(`date: ${formatDate(fm.date)}`);
  lines.push(`category: ${fm.category}`);
  lines.push(`tags:`);
  (fm.tags ?? []).forEach((t) => lines.push(`  - ${t}`));
  lines.push(`slug: ${fm.slug}`);
  lines.push(`description: ${JSON.stringify(fm.description)}`);
  if (fm.seoTitle) lines.push(`seoTitle: ${JSON.stringify(fm.seoTitle)}`);
  if (fm.thumbnail) lines.push(`thumbnail: ${fm.thumbnail}`);
  lines.push(`status: ${fm.status}`);
  lines.push(`lang: ${fm.lang}`);
  if (fm.subject) lines.push(`subject: ${JSON.stringify(fm.subject)}`);
  lines.push('---');
  return lines.join('\n');
}

async function translateText(text: string, context: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `Translate the following Korean ${context} into natural, fluent English.

Write for a native English reader.
Keep the tone calm, clear, thoughtful, and slightly literary.
Use concise, direct language, but do not flatten the original rhythm.
Prefer active voice over passive voice.
Vary sentence structure naturally.

Preserve the original meaning, nuance, and quiet tone.
Do not make the writing sound promotional, overly casual, academic, or mechanical.
Do not add explanations, examples, headings, or emphasis that are not in the original.
Keep technical terms accurate and consistent.
Keep Markdown structure, frontmatter keys, code blocks, and placeholders unchanged.

Output ONLY the translated text. No commentary, notes, character counts, or explanations.

${text}`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== 'text') throw new Error('Unexpected response type');
  return block.text.trim();
}

async function translatePost(koFilename: string): Promise<void> {
  const enFilename = koFilename.replace('.ko.md', '.en.md');
  const koPath = path.join(POSTS_DIR, koFilename);
  const enPath = path.join(POSTS_DIR, enFilename);

  if (!FORCE && fs.existsSync(enPath)) {
    console.log(`⏭️  스킵 (이미 존재): ${enFilename}`);
    return;
  }

  console.log(`🔄 번역 중: ${koFilename}`);

  const raw = fs.readFileSync(koPath, 'utf-8');
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;

  const [title, description, seoTitle, translatedContent] = await Promise.all([
    translateText(fm.title, 'title (single line, no markdown)'),
    translateText(fm.description, 'SEO meta description (single line, 120-160 chars)'),
    fm.seoTitle
      ? translateText(fm.seoTitle, 'SEO page title for search engines (single line, no markdown)')
      : Promise.resolve(undefined),
    translateText(content, 'blog post content'),
  ]);

  const enFrontmatter: Frontmatter = {
    ...fm,
    title,
    description,
    ...(seoTitle && { seoTitle }),
    lang: 'en',
  };

  const enFile = buildFrontmatter(enFrontmatter) + '\n\n' + translatedContent;
  fs.writeFileSync(enPath, enFile, 'utf-8');
  console.log(`✅ 완료: ${enFilename}`);
}

async function main(): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY가 .env.local에 없습니다.');
    process.exit(1);
  }

  if (!fs.existsSync(POSTS_DIR)) {
    console.error('❌ content/posts 폴더가 없습니다.');
    process.exit(1);
  }

  const koFiles = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.ko.md'));

  if (koFiles.length === 0) {
    console.log('번역할 한글 포스트가 없습니다.');
    return;
  }

  console.log(`📚 총 ${koFiles.length}개 파일 확인 중... ${FORCE ? '(--force 재번역)' : ''}\n`);

  for (const file of koFiles) {
    await translatePost(file);
  }

  console.log('\n🎉 번역 완료!');
}

main().catch(console.error);
