/**
 * 임베딩 생성 스크립트: 한글 포스트(.ko.md) → Supabase Vector DB
 *
 * 실행: npm run embeddings
 * - content/posts 의 모든 .md 파일을 ## 헤딩 기준으로 청킹
 * - Cohere embed-multilingual-v3 로 임베딩 생성
 * - Supabase document_chunks 테이블에 upsert
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CohereClient } from 'cohere-ai';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

import type { Chunk } from '@/types/embeddings';
export type { Chunk };

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
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 없습니다.');
    process.exit(1);
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  console.log(`📚 ${files.length}개 파일 처리 중...\n`);

  const allChunks: Omit<Chunk, 'embedding'>[] = [];

  // 시리즈 메타 정보 수집 (시리즈 인덱스 청크 생성용)
  const seriesMap: Record<string, { lang: string; titles: string[]; category: string }> = {};

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

    // 시리즈 수집
    if (data.series && data.title) {
      const key = `${data.series}-${data.lang ?? 'ko'}`;
      if (!seriesMap[key]) {
        seriesMap[key] = { lang: data.lang ?? 'ko', titles: [], category: data.category ?? '' };
      }
      seriesMap[key].titles.push(data.title);
    }
  }

  // 시리즈 인덱스 청크 생성
  for (const [key, { lang, titles, category }] of Object.entries(seriesMap)) {
    const seriesName = key.replace(new RegExp(`-${lang}$`), '');
    allChunks.push({
      id: `series-index-${key}`,
      slug: `series-${seriesName.toLowerCase().replace(/\s+/g, '-')}`,
      lang,
      title: `${seriesName} 시리즈 목록`,
      category,
      tags: [],
      section: '시리즈 전체 목록',
      content: `${seriesName}는 총 ${titles.length}편으로 구성된다.\n${titles.map((t, i) => `${i + 1}편: ${t}`).join('\n')}`,
    });
  }

  console.log(`🔢 총 ${allChunks.length}개 청크 임베딩 생성 중...\n`);

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

  const rows = allChunks.map((chunk, i) => ({
    ...chunk,
    embedding: embeddings[i],
  }));

  // Supabase에 upsert (기존 id는 덮어씀)
  const UPSERT_SIZE = 50;
  for (let i = 0; i < rows.length; i += UPSERT_SIZE) {
    const batch = rows.slice(i, i + UPSERT_SIZE);
    const { error } = await supabase
      .from('document_chunks')
      .upsert(batch, { onConflict: 'id' });

    if (error) throw new Error(`Supabase upsert 실패: ${error.message}`);
  }

  console.log(`\n🎉 Supabase 저장 완료! (${rows.length}개 청크)`);
}

main().catch(console.error);
