/**
 * 임베딩 생성 스크립트
 * 실행: npm run embeddings
 * - content/posts 의 모든 .md 파일을 ## 헤딩 기준으로 청킹
 * - Cohere embed-multilingual-v3 로 임베딩 생성
 * - data/embeddings.json 에 저장
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CohereClient } from 'cohere-ai';
import { config } from 'dotenv';

config({ path: '.env.local' });

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'embeddings.json');
const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

import type { Chunk } from '@/types/embeddings';
export type { Chunk };

// ## 헤딩 기준으로 섹션 분리
function chunkMarkdown(content: string): { section: string; text: string }[] {
  const lines = content.split('\n');
  const chunks: { section: string; text: string }[] = [];
  let currentSection = 'Introduction';
  let currentLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentLines.length > 0) {
        const text = currentLines.join('\n').trim();
        if (text.length > 50) chunks.push({ section: currentSection, text });
      }
      currentSection = line.replace('## ', '').trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    const text = currentLines.join('\n').trim();
    if (text.length > 50) chunks.push({ section: currentSection, text });
  }

  return chunks;
}

async function main() {
  if (!process.env.COHERE_API_KEY) {
    console.error('❌ COHERE_API_KEY가 .env.local에 없습니다.');
    process.exit(1);
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  console.log(`📚 ${files.length}개 파일 처리 중...\n`);

  const allChunks: Omit<Chunk, 'embedding'>[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data, content } = matter(raw);
    if (data.status !== 'published') continue;

    const sections = chunkMarkdown(content);
    for (let i = 0; i < sections.length; i++) {
      allChunks.push({
        id: `${data.slug}-${data.lang ?? 'ko'}-${i}`,
        slug: data.slug ?? file.replace(/\.(ko|en)\.md$/, ''),
        lang: data.lang ?? 'ko',
        title: data.title ?? '',
        category: data.category ?? '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        section: sections[i].section,
        content: sections[i].text,
      });
    }
  }

  console.log(`🔢 총 ${allChunks.length}개 청크 임베딩 생성 중...\n`);

  // Cohere는 한번에 최대 96개 처리 가능
  const BATCH_SIZE = 96;
  const embeddings: number[][] = [];

  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);
    const response = await cohere.embed({
      texts: batch.map((c) => `${c.title} ${c.section}\n${c.content}`),
      model: 'embed-multilingual-v3.0',
      inputType: 'search_document',
      embeddingTypes: ['float'],
    });

    const floats = (response.embeddings as { float?: number[][] }).float;
    if (!floats) throw new Error('임베딩 응답이 없습니다.');
    embeddings.push(...floats);
    console.log(`✅ ${Math.min(i + BATCH_SIZE, allChunks.length)}/${allChunks.length} 완료`);
  }

  const result: Chunk[] = allChunks.map((chunk, i) => ({
    ...chunk,
    embedding: embeddings[i],
  }));

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`\n🎉 data/embeddings.json 저장 완료! (${result.length}개 청크)`);
}

main().catch(console.error);
