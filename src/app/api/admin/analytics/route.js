import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/adminAuth';
import { resolveAnalyticsDateRange } from '@/lib/analyticsDateRange';
import { getAnalytics } from '@/lib/ga4Client';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!isValidAdminSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
