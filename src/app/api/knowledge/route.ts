import { NextResponse } from 'next/server';
import { normalizeKnowledgeSearchQuery } from '@/features/knowledge/search';
import {
  createPublishedKnowledgeDatabase,
  searchPublishedKnowledge,
} from '@/services/published-knowledge';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = normalizeKnowledgeSearchQuery(url.searchParams.get('q'));
  const cursor = url.searchParams.get('cursor');
  const { pool } = createPublishedKnowledgeDatabase();
  try {
    const result = await searchPublishedKnowledge(pool, { query, cursor });
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'invalid_knowledge_cursor') {
      return NextResponse.json({ error: '잘못된 목록 위치입니다.' }, { status: 400 });
    }
    return NextResponse.json({ error: '지식 목록을 불러오지 못했습니다.' }, { status: 500 });
  } finally {
    await pool.end();
  }
}
