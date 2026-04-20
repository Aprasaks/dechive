import { NextRequest, NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';
import { GoogleGenerativeAI, SchemaType, type FunctionCall } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { sendErrorAlert } from '@/lib/discord';

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? '');
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);


function getHaegoriSystem(lang: string): string {
  if (lang === 'en') {
    return `You are Haegori, the sole librarian of the Infinite Archive (Dechive).
Your job is to help visitors find knowledge stored in this archive.

Search rules (MUST follow):
- For ANY question about technology, knowledge, or topics — ALWAYS call search_blog FIRST before answering.
- Only skip searching for pure greetings or small talk (e.g. "hello", "thanks").
- If search returns results, base your answer on them and cite naturally.
- If search returns nothing, say "It's not in the archive yet" and answer from general knowledge.

Tone rules:
- Short, clear, helpful
- No markdown formatting
- No emojis
- Natural and warm, not stiff

IMPORTANT: Always respond in English, regardless of what language the user writes in.`;
  }

  return `너는 해고리야. Dechive 무한서고의 사서.
방문자의 질문에 답하고 서고 안 기록을 찾아주는 게 역할이야.

검색 규칙 (반드시 지켜):
- 기술, 지식, 주제에 관한 질문이면 반드시 search_blog를 먼저 호출해. 직접 답하지 마.
- 인사, 잡담처럼 순수 대화성 메시지만 검색 없이 응답해도 돼.
- 검색 결과가 있으면 그 내용을 바탕으로 답변하고 자연스럽게 출처 언급.
- 검색 결과가 없으면 "서고엔 아직 없는 내용이에요" 하고 일반 지식으로 보충.

말투 규칙:
- 짧고 명확하게, 친절하게
- 마크다운 금지
- 이모지 사용 금지
- 자연스러운 구어체 존댓말

중요: 사용자가 어떤 언어로 쓰더라도 반드시 한국어로만 답변해.`;
}

interface SearchResult {
  slug: string;
  title: string;
  section: string;
  content: string;
}

interface RelatedPost {
  slug: string;
  title: string;
}

async function searchBlog(query: string, lang: string): Promise<{ context: string; relatedPosts: RelatedPost[]; found: boolean }> {
  const res = await cohere.embed({
    texts: [query],
    model: 'embed-multilingual-v3.0',
    inputType: 'search_query',
    embeddingTypes: ['float'],
  });

  const queryEmbedding = (res.embeddings as { float?: number[][] }).float?.[0];
  if (!queryEmbedding) return { context: '', relatedPosts: [], found: false };

  const { data, error } = await supabase.rpc('match_chunks', {
    query_embedding: queryEmbedding,
    match_lang: lang,
    match_count: 5,
    match_threshold: 0.45,
  });

  if (error || !data || data.length === 0) return { context: '', relatedPosts: [], found: false };

  const context = (data as SearchResult[])
    .map((r) => `[${r.title} - ${r.section}]\n${r.content}`)
    .join('\n\n---\n\n');

  const seen = new Set<string>();
  const relatedPosts: RelatedPost[] = [];
  for (const r of data as SearchResult[]) {
    if (!seen.has(r.slug) && !r.slug.startsWith('series-')) {
      seen.add(r.slug);
      relatedPosts.push({ slug: r.slug, title: r.title });
    }
  }

  return { context, relatedPosts, found: true };
}

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { query, lang = 'ko', history = [] } = await req.json() as {
      query: string;
      lang?: string;
      history?: HistoryMessage[];
    };

    if (!query?.trim()) {
      return NextResponse.json({ error: '질문을 입력해주세요.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
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
      const { context, relatedPosts, found } = await searchBlog(searchQuery, lang);

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
      return NextResponse.json({
        answer,
        relatedPosts,
        notFound: false,
      });
    }

    // 일반 대화 (function call 없음)
    const answer = parts.find((p) => p.text)?.text ?? '...';
    return NextResponse.json({ answer, relatedPosts: [], notFound: false });

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[api/chat] error:', message);
    await sendErrorAlert('챗봇 API 오류', message).catch(() => {});
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
