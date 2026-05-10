/**
 * 임베딩 생성 스크립트: 포스트(.md) → Supabase Vector DB
 *
 * 실행: npm run embeddings
 * - 기본값: content/posts 의 모든 .md 파일을 ## 헤딩 기준으로 청킹
 * - 증분 모드: --changed-file-list 로 전달된 추가/수정/삭제 .md 만 처리
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

type ChunkInput = Omit<Chunk, 'embedding'>;

interface ParsedPost {
  chunks: ChunkInput[];
  subject?: string;
  lang: string;
  title: string;
  category: string;
}

interface ChangedMarkdownFile {
  status: 'changed' | 'deleted';
  path: string;
}

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

function getArgValue(name: string) {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function getSlugAndLangFromPath(filePath: string) {
  const filename = path.basename(filePath, '.md');
  const match = /^(.*)\.(ko|en)$/.exec(filename);

  if (!match) {
    return { slug: filename, lang: 'ko' };
  }

  return { slug: match[1], lang: match[2] };
}

function parseChangedMarkdownFiles(fileListPath: string): ChangedMarkdownFile[] | null {
  const raw = fs.readFileSync(fileListPath, 'utf-8').trim();
  if (!raw) return [];
  if (raw.split('\n').some((line) => line.trim() === '__FULL__')) return null;

  const changedFiles: ChangedMarkdownFile[] = [];

  for (const line of raw.split('\n')) {
    const [status, ...paths] = line.split('\t');
    if (!status) continue;

    const isRenameOrCopy = status.startsWith('R') || status.startsWith('C');
    const oldPath = paths[0];
    const newPath = isRenameOrCopy ? paths[1] : paths[0];

    if (status === 'D' && oldPath?.endsWith('.md')) {
      changedFiles.push({ status: 'deleted', path: oldPath });
      continue;
    }

    if (isRenameOrCopy && oldPath?.endsWith('.md')) {
      changedFiles.push({ status: 'deleted', path: oldPath });
    }

    if (newPath?.endsWith('.md')) {
      changedFiles.push({ status: 'changed', path: newPath });
    }
  }

  return changedFiles.filter((file) => file.path.startsWith('posts/'));
}

function parsePostFile(file: string): ParsedPost | null {
  const filePath = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const { slug: fallbackSlug, lang: fallbackLang } = getSlugAndLangFromPath(file);
  const lang = data.lang ?? fallbackLang;
  const slug = data.slug ?? fallbackSlug;
  const title = data.title ?? '';
  const category = data.category ?? '';

  if (data.status !== 'published') {
    return { chunks: [], subject: data.subject, lang, title, category };
  }

  const sections = chunkMarkdown(content);
  const chunks = sections.map((section, i) => ({
    id: `${slug}-${lang}-${i}`,
    slug,
    lang,
    title,
    category,
    tags: Array.isArray(data.tags) ? data.tags : [],
    section: section.section,
    content: section.text,
  }));

  return {
    chunks,
    subject: data.subject,
    lang,
    title,
    category,
  };
}

function getPublishedPostFiles() {
  return fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith('.md'));
}

function buildSubjectIndexChunks() {
  const subjectMap: Record<string, { lang: string; titles: string[]; category: string }> = {};

  for (const file of getPublishedPostFiles()) {
    const post = parsePostFile(file);
    if (!post?.subject || !post.title || post.chunks.length === 0) continue;

    const key = `${post.subject}-${post.lang}`;
    if (!subjectMap[key]) {
      subjectMap[key] = { lang: post.lang, titles: [], category: post.category };
    }
    subjectMap[key].titles.push(post.title);
  }

  return Object.entries(subjectMap).map(([key, { lang, titles, category }]) => {
    const subjectName = key.replace(new RegExp(`-${lang}$`), '');
    return {
      id: `subject-index-${key}`,
      slug: `subject-${subjectName.toLowerCase().replace(/\s+/g, '-')}`,
      lang,
      title: `${subjectName} 주제 목록`,
      category,
      tags: [],
      section: '주제 전체 목록',
      content: `${subjectName} 주제에는 총 ${titles.length}편의 기록이 있다.\n${titles.map((title, i) => `${i + 1}편: ${title}`).join('\n')}`,
    };
  });
}

async function deletePostChunks(slug: string, lang: string) {
  const { error } = await supabase
    .from('document_chunks')
    .delete()
    .eq('slug', slug)
    .eq('lang', lang);

  if (error) throw new Error(`Supabase chunk 삭제 실패(${slug}/${lang}): ${error.message}`);
}

async function deleteSubjectIndexChunks() {
  const { error } = await supabase
    .from('document_chunks')
    .delete()
    .like('id', 'subject-index-%');

  if (error) throw new Error(`Supabase subject index 삭제 실패: ${error.message}`);
}

async function embedChunks(chunks: ChunkInput[]) {
  if (chunks.length === 0) return [];

  console.log(`🔢 총 ${chunks.length}개 청크 임베딩 생성 중...\n`);

  const BATCH_SIZE = 96;
  const BATCH_DELAY_MS = 65000; // Cohere trial rate limit 대응: 배치 간 65초 대기 (분당 1콜)
  const embeddings: number[][] = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    if (i > 0) await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));

    const batch = chunks.slice(i, i + BATCH_SIZE);
    const response = await cohere.embed({
      texts: batch.map((chunk) => `${chunk.title} ${chunk.section}\n${chunk.content}`),
      model: 'embed-multilingual-v3.0',
      inputType: 'search_document',
      embeddingTypes: ['float'],
    });

    const floats = (response.embeddings as { float?: number[][] }).float;
    if (!floats) throw new Error('임베딩 응답이 없습니다.');
    embeddings.push(...floats);
    console.log(`✅ ${Math.min(i + BATCH_SIZE, chunks.length)}/${chunks.length} 완료`);
  }

  return chunks.map((chunk, i) => ({
    ...chunk,
    embedding: embeddings[i],
  }));
}

async function upsertChunks(chunks: ChunkInput[]) {
  const rows = await embedChunks(chunks);
  if (rows.length === 0) return;

  const UPSERT_SIZE = 50;
  for (let i = 0; i < rows.length; i += UPSERT_SIZE) {
    const batch = rows.slice(i, i + UPSERT_SIZE);
    const { error } = await supabase
      .from('document_chunks')
      .upsert(batch, { onConflict: 'id' });

    if (error) throw new Error(`Supabase upsert 실패: ${error.message}`);
  }
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

  const changedFileList = getArgValue('--changed-file-list');
  const changedFiles = changedFileList ? parseChangedMarkdownFiles(changedFileList) : null;
  const isIncremental = changedFiles !== null;

  if (isIncremental && changedFiles.length === 0) {
    console.log('📭 변경된 Markdown 파일이 없어 임베딩을 건너뜁니다.');
    return;
  }

  const files = isIncremental
    ? changedFiles.filter((file) => file.status === 'changed').map((file) => file.path.replace(/^posts\//, ''))
    : getPublishedPostFiles();
  console.log(`📚 ${isIncremental ? '증분' : '전체'} 모드: ${files.length}개 파일 처리 중...\n`);

  const allChunks: ChunkInput[] = [];

  if (isIncremental) {
    for (const changedFile of changedFiles) {
      const { slug, lang } = getSlugAndLangFromPath(changedFile.path);
      await deletePostChunks(slug, lang);
    }
  }

  for (const file of files) {
    const post = parsePostFile(file);
    if (!post) continue;
    allChunks.push(...post.chunks);
  }

  if (isIncremental) {
    await deleteSubjectIndexChunks();
  }
  allChunks.push(...buildSubjectIndexChunks());

  await upsertChunks(allChunks);

  console.log(`\n🎉 Supabase 저장 완료! (${allChunks.length}개 청크)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
