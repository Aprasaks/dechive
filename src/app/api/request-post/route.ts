import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { query } = await req.json() as { query: string };

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook URL 없음' }, { status: 500 });
  }

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [
        {
          title: '📬 포스트 작성 요청',
          description: `**"${query}"** 에 대한 포스트 요청이 들어왔어요!`,
          color: 0x5865f2,
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });

  return NextResponse.json({ ok: true });
}
