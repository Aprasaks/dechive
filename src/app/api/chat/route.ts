import { NextRequest, NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';
import { GoogleGenerativeAI, SchemaType, type FunctionCall } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import type { Chunk } from '@/types/embeddings';

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? '');

async function logToDiscord(ip: string, userMessage: string, assistantAnswer: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [
        {
          title: '💬 해고리 채팅 로그',
          color: 0x7c3aed,
          fields: [
            { name: '🌐 IP', value: ip, inline: true },
            { name: '👤 방문자', value: userMessage, inline: false },
            { name: '📚 해고리', value: assistantAnswer, inline: false },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  }).catch(() => {}); // 로깅 실패가 챗봇을 막으면 안 됨
}

const EMBEDDINGS_FILE = path.join(process.cwd(), 'data', 'embeddings.json');

function getHaegoriSystem(lang: string): string {
  if (lang === 'en') {
    return `You are Haegori, the sole librarian of the Infinite Archive.
A skeleton mascot — somewhere between living and dead — who knows everything in this archive.
Chat naturally with visitors and help them find records.

Tone rules:
- Short, dry, but subtly warm
- No stiff formality — casual and natural
- No markdown, occasional emojis allowed
- When archive records are found, naturally mention "Found it in the archive"
- If not in the archive, honestly say "It's not in the archive, but—" and answer from general knowledge

IMPORTANT: Always respond in English, regardless of what language the user writes in.`;
  }

  return `너는 해고리야. 무한서고의 유일한 사서.
살아있는 건지 죽은 건지 모를 해골 마스코트지만, 이 서고의 모든 것을 알고 있어.
방문자들과 자연스럽게 대화하고, 서고 안 기록도 찾아줘.

말투 규칙:
- 짧고 건조하지만 은근히 다정한 구어체
- 딱딱한 존댓말 NO, 자연스러운 반말/존댓말 섞기
- 마크다운 금지, 이모지 가끔 허용
- 서고 기록 찾았을 땐 "서고에서 찾았어요" 류로 자연스럽게 언급
- 서고에 없는 내용은 솔직하게 "서고엔 없는 내용이지만" 하고 일반 지식으로 답변

중요: 사용자가 어떤 언어로 쓰더라도 반드시 한국어로만 답변해.`;
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

async function searchBlog(query: string, lang: string): Promise<{ context: string; slugs: string[]; found: boolean }> {
  if (!fs.existsSync(EMBEDDINGS_FILE)) {
    return { context: '', slugs: [], found: false };
  }

  const chunks: Chunk[] = JSON.parse(fs.readFileSync(EMBEDDINGS_FILE, 'utf-8'));
  const filtered = chunks.filter((c) => c.lang === lang);

  const res = await cohere.embed({
    texts: [query],
    model: 'embed-multilingual-v3.0',
    inputType: 'search_query',
    embeddingTypes: ['float'],
  });

  const queryEmbedding = (res.embeddings as { float?: number[][] }).float?.[0];
  if (!queryEmbedding) return { context: '', slugs: [], found: false };

  const scored = filtered
    .map((chunk) => ({ chunk, score: cosineSimilarity(queryEmbedding, chunk.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const topScore = scored[0]?.score ?? 0;
  if (topScore < 0.5) return { context: '', slugs: [], found: false };

  const context = scored
    .map((s) => `[${s.chunk.title} - ${s.chunk.section}]\n${s.chunk.content}`)
    .join('\n\n---\n\n');

  const slugs = [...new Set(scored.map((s) => s.chunk.slug))];
  return { context, slugs, found: true };
}

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? req.headers.get('x-real-ip')
      ?? 'unknown';

    const { query, lang = 'ko', history = [] } = await req.json() as {
      query: string;
      lang?: string;
      history?: HistoryMessage[];
    };

    if (!query?.trim()) {
      return NextResponse.json({ error: '질문을 입력해주세요.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite-preview',
      systemInstruction: getHaegoriSystem(lang),
      tools: [
        {
          functionDeclarations: [
            {
              name: 'search_blog',
              description: '블로그 서고에서 관련 포스트를 검색합니다. 사용자가 블로그 글 내용, 특정 기술/주제에 대해 묻거나 포스트를 찾을 때 사용하세요.',
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  query: {
                    type: SchemaType.STRING,
                    description: '검색할 키워드나 질문',
                  },
                },
                required: ['query'],
              },
            },
          ],
        },
      ],
    });

    // Gemini는 히스토리 첫 항목이 반드시 user여야 함
    const trimmed = [...history];
    while (trimmed.length > 0 && trimmed[0].role !== 'user') trimmed.shift();

    const chatHistory = trimmed.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user' as const,
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history: chatHistory });

    // 1차 응답 (function call 판단)
    const firstResponse = await chat.sendMessage(query);
    const firstCandidate = firstResponse.response.candidates?.[0];
    const parts = firstCandidate?.content?.parts ?? [];

    const functionCallPart = parts.find((p) => p.functionCall) as { functionCall: FunctionCall } | undefined;

    if (functionCallPart) {
      // 서고 검색 실행
      const searchQuery = (functionCallPart.functionCall.args as { query: string }).query;
      const { context, slugs, found } = await searchBlog(searchQuery, lang);

      const functionResult = found
        ? context
        : '서고에 관련 기록이 없습니다.';

      // 검색 결과로 최종 답변
      const secondResponse = await chat.sendMessage([
        {
          functionResponse: {
            name: 'search_blog',
            response: { result: functionResult },
          },
        },
      ]);

      const answer = secondResponse.response.text();
      void logToDiscord(ip, query, answer);
      return NextResponse.json({
        answer,
        relatedSlugs: slugs,
        notFound: false,
      });
    }

    // 일반 대화 (function call 없음)
    const answer = parts.find((p) => p.text)?.text ?? '...';
    void logToDiscord(ip, query, answer);
    return NextResponse.json({ answer, relatedSlugs: [], notFound: false });

  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
