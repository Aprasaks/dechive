import { NextRequest, NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import type { Chunk } from '@/types/embeddings';

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const EMBEDDINGS_FILE = path.join(process.cwd(), 'data', 'embeddings.json');

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

export async function POST(req: NextRequest) {
  try {
    const { query, lang = 'ko' } = await req.json() as { query: string; lang?: string };

    if (!query?.trim()) {
      return NextResponse.json({ error: '질문을 입력해주세요.' }, { status: 400 });
    }

    // 임베딩 파일 로드
    if (!fs.existsSync(EMBEDDINGS_FILE)) {
      return NextResponse.json({ error: '임베딩 데이터가 없습니다.' }, { status: 500 });
    }
    const chunks: Chunk[] = JSON.parse(fs.readFileSync(EMBEDDINGS_FILE, 'utf-8'));
    const filtered = chunks.filter((c) => c.lang === lang);

    // 질문 임베딩
    const res = await cohere.embed({
      texts: [query],
      model: 'embed-multilingual-v3.0',
      inputType: 'search_query',
      embeddingTypes: ['float'],
    });
    const queryEmbedding = (res.embeddings as { float?: number[][] }).float?.[0];
    if (!queryEmbedding) throw new Error('질문 임베딩 실패');

    // 코사인 유사도로 top-3 청크 추출
    const scored = filtered
      .map((chunk) => ({ chunk, score: cosineSimilarity(queryEmbedding, chunk.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const topScore = scored[0]?.score ?? 0;

    // 유사도가 낮으면 관련 포스트 없음 (인사말 등 일반 대화 제외)
    const greetings = ['안녕', '하이', 'hi', 'hello', '반가', 'ㅎㅎ', 'ㅋㅋ'];
    const isGreeting = greetings.some((g) => query.toLowerCase().includes(g));

    if (topScore < 0.5 && !isGreeting) {
      return NextResponse.json({ answer: null, relatedSlugs: [], notFound: true });
    }
    if (isGreeting) {
      return NextResponse.json({ answer: '안녕하세요! 블로그 내용에 대해 궁금한 게 있으면 질문해주세요 😊', relatedSlugs: [], notFound: false });
    }

    const context = scored
      .map((s) => `[${s.chunk.title} - ${s.chunk.section}]\n${s.chunk.content}`)
      .join('\n\n---\n\n');

    const relatedSlugs = [...new Set(scored.map((s) => s.chunk.slug))];

    // 출처 요청 여부 감지
    const sourceKeywords = ['어디', '출처', '포스트', '어떤 글', '몇 편'];
    const wantsSource = sourceKeywords.some((k) => query.includes(k));

    // Claude 답변 생성
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `너는 Dechive 블로그 지식 검색 도우미야.
아래 내용만 참고해서 질문에 답하고, 반드시 JSON으로만 응답해.

JSON 형식:
{"answer": "답변", "showSource": true/false}

규칙:
- answer: 1~2문장, 마크다운 금지, 자연스러운 구어체
- showSource: 사용자가 출처/포스트/링크/어디서 읽는지 등을 묻고 있으면 true, 아니면 false

[참고 내용]
${context}

[질문]
${query}`,
        },
      ],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '{}';
    // 코드블록 제거 후 파싱
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    let answer = '';
    let showSource = false;
    try {
      const parsed = JSON.parse(cleaned) as { answer?: string; showSource?: boolean };
      answer = parsed.answer ?? '';
      showSource = parsed.showSource ?? false;
    } catch {
      answer = cleaned;
    }

    return NextResponse.json({ answer, relatedSlugs: showSource ? relatedSlugs : [], allSlugs: relatedSlugs, notFound: false });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
