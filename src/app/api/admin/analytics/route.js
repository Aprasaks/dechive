import { NextResponse } from 'next/server';
import { getAuthorizedOwnerActor } from '@/features/admin/owner-auth';
import { createAdminDatabase } from '@/services/knowledge-drafts';
import { resolveAnalyticsDateRange } from '@/lib/analyticsDateRange';
import { getAnalytics } from '@/lib/ga4Client';

export const dynamic = 'force-dynamic';
export const preferredRegion = 'sin1';

export async function GET(request) {
  const { pool } = createAdminDatabase();
  try { if (!(await getAuthorizedOwnerActor(pool))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  finally { await pool.end(); }

  try {
    const dateRange = resolveAnalyticsDateRange({
      preset: request.nextUrl.searchParams.get('preset'),
      startDate: request.nextUrl.searchParams.get('startDate'),
      endDate: request.nextUrl.searchParams.get('endDate'),
    });
    const analytics = await getAnalytics(dateRange);
    return NextResponse.json(analytics);
  } catch {
    return NextResponse.json(
      { error: 'GA4 데이터를 불러오지 못했습니다.' },
      { status: 500 },
    );
  }
}
