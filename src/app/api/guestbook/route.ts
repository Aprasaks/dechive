import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

// GET — 메시지 목록
export async function GET() {
  const { data, error } = await supabase
    .from('guestbook')
    .select('id, name, message, created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data });
}

// POST — 메시지 등록
export async function POST(req: NextRequest) {
  const { name, password, message } = await req.json() as {
    name: string;
    password: string;
    message: string;
  };

  if (!name?.trim() || !password?.trim() || !message?.trim()) {
    return NextResponse.json({ error: '모든 항목을 입력해주세요.' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase.from('guestbook').insert({
    name: name.trim(),
    password: hashedPassword,
    message: message.trim(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
