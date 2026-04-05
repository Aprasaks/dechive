/**
 * 번역 스크립트: 한글 포스트(.ko.md) → 영문 포스트(.en.md) 자동 생성
 *
 * 실행: npm run translate
 * - 이미 .en.md가 존재하는 파일은 스킵 (API 비용 절감)
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

interface Frontmatter {
  title: string;
  date: string;
  category: string;
  tags: string[];
  slug: string;
  summary: string;
  description: string;
  thumbnail: string;
  status: string;
  lang: string;
  series: string;
}

async function translateText(text: string, context: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: `Translate the following Korean ${context} to English.
- Preserve all markdown formatting exactly (headings, bold, code blocks, lists, etc.)
- Keep technical terms, code snippets, and proper nouns as-is
- Return only the translated text, no explanation

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

  // 이미 번역된 파일 스킵
  if (fs.existsSync(enPath)) {
    console.log(`⏭️  스킵 (이미 존재): ${enFilename}`);
    return;
  }

  console.log(`🔄 번역 중: ${koFilename}`);

  const raw = fs.readFileSync(koPath, 'utf-8');
  const { data, content } = matter(raw);
  const fm = data as Frontmatter;

  // 병렬로 번역 (title, summary, description, content)
  const [title, summary, description, translatedContent] = await Promise.all([
    translateText(fm.title, 'title'),
    translateText(fm.summary, 'short summary'),
    translateText(fm.description, 'SEO description'),
    translateText(content, 'blog post content'),
  ]);

  const enFrontmatter: Frontmatter = {
    ...fm,
    title,
    summary,
    description,
    lang: 'en',
  };

  const enFile = matter.stringify(translatedContent, enFrontmatter);
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

  console.log(`📚 총 ${koFiles.length}개 파일 확인 중...\n`);

  for (const file of koFiles) {
    await translatePost(file);
  }

  console.log('\n🎉 번역 완료!');
}

main().catch(console.error);
