import { NextRequest, NextResponse } from 'next/server';
import { sendDiscordWebhook } from '@/lib/discord';

export async function POST(req: NextRequest) {
  let query: string;

  try {
    const body = await req.json() as { query?: unknown };
    if (!body.query || typeof body.query !== 'string' || !body.query.trim()) {
      return NextResponse.json({ error: '요청 내용을 입력해주세요.' }, { status: 400 });
    }
    query = body.query.trim();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: '서버 설정 오류입니다.' }, { status: 500 });
  }

  try {
    await sendDiscordWebhook(webhookUrl, {
      title: '📬 포스트 작성 요청',
      description: `**"${query}"** 에 대한 포스트 요청이 들어왔어요!`,
      color: 0x5865f2,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[request-post] Discord webhook error:', err);
    return NextResponse.json({ error: '요청 전송에 실패했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
