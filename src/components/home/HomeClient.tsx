'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X, ChevronDown, BookOpen, Wrench } from 'lucide-react';
import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const PER_PAGE = 3;

type T = typeof i18n['ko'] | typeof i18n['en'];

function GuestBookModal({ t, messages, onClose, onRefresh }: { t: T; messages: GuestMessage[]; onClose: () => void; onRefresh: () => Promise<void> }) {
  const [page, setPage] = useState(0);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalPages = Math.ceil(messages.length / PER_PAGE);
  const pageMessages = messages.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const handleSubmit = async () => {
    if (!name.trim() || !password.trim() || !message.trim()) return;
    setSubmitting(true);
    await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password, message }),
    });
    setName(''); setPassword(''); setMessage('');
    await onRefresh();
    setPage(0);
    setSubmitting(false);
  };

  return (
    <>
      {/* 백드롭 */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* 모달 */}
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl animate-in fade-in zoom-in-95 duration-200"
        style={{
          background: 'rgba(20,12,4,0.6)',
          backdropFilter: 'blur(24px)',
          maskImage: 'linear-gradient(to bottom, transparent, black 15%), linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%), linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      >

        <div className="relative px-6 py-6">
          {/* 헤더 */}
          <div className="mb-5 flex items-center justify-between">
            <p className="text-xs font-semibold tracking-widest uppercase text-white">
              {t.guestBookTitle}
            </p>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-zinc-300 transition-colors hover:text-white"
            >
              <X size={15} />
            </button>
          </div>

          {/* 입력 */}
          <div className="mb-5 flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                id="guestbook-name"
                name="name"
                type="text"
                autoComplete="nickname"
                placeholder={t.guestBookNickname}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-300 focus:border-white/40"
              />
              <input
                id="guestbook-password"
                name="password"
                type="password"
                autoComplete="off"
                placeholder={t.guestBookPassword}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-300 focus:border-white/40"
              />
            </div>
            <div className="flex gap-2">
              <input
                id="guestbook-message"
                name="message"
                type="text"
                autoComplete="off"
                placeholder={t.guestBookMessage}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-300 focus:border-white/40"
              />
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="shrink-0 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/30 disabled:opacity-40"
              >
                {t.guestBookSubmit}
              </button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="mb-4 h-px bg-white/10" />

          {/* 메시지 */}
          <div className="flex flex-col gap-4">
            {pageMessages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-100">{msg.name}</span>
                  <span className="text-[11px] text-zinc-300">{new Date(msg.created_at).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' })}</span>
                </div>
                <p className="text-sm leading-relaxed text-white">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="text-white transition-opacity disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="text-white transition-opacity disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function HomeClient() {
  const { lang } = useLang();
  const t = i18n[lang];
  const [guestBookOpen, setGuestBookOpen] = useState(false);
  const [messages, setMessages] = useState<GuestMessage[]>([]);

  const fetchMessages = useCallback(async () => {
    const res = await fetch('/api/guestbook');
    const data = await res.json() as { messages: GuestMessage[] };
    setMessages(data.messages ?? []);
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const spaces = [
    {
      icon: <BookOpen size={22} />,
      name: 'Archive',
      href: '/archive',
      desc: lang === 'en'
        ? 'Books re-established after reading vast amounts of knowledge. Each post distills a subject into one complete, standalone record.'
        : '수많은 지식을 탐독한 뒤 다시 재정립한 책들을 모아놓은 공간. 한 편이 하나의 주제를 완결합니다.',
    },
    {
      icon: <Wrench size={22} />,
      name: 'Projects',
      href: '/projects',
      desc: lang === 'en'
        ? 'The space where ideas become reality. Every concept, prototype, and shipped product starts here.'
        : '아이디어를 현실로 바꾼 공간. 구상에서 완성까지의 과정을 기록합니다.',
    },
  ];

  return (
    <>
    <main className="flex flex-1 flex-col">

      {/* 히어로 */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center gap-8 -mt-16">
          <div className="h-px w-10 bg-white" />
          <h1 className="text-3xl font-extrabold leading-snug tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-zinc-400">{t.homeTagline1}</span><br />
            <span className="text-white">{t.homeTagline2}</span>
          </h1>
          <div className="h-px w-10 bg-white" />
        </div>
        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs tracking-widest text-white uppercase">scroll</span>
          <ChevronDown size={20} className="text-white" />
        </div>
      </section>

      {/* 공간 소개 */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-32">
        <div className="flex flex-col gap-6">
          {spaces.map((space) => (
            <Link
              key={space.name}
              href={space.href}
              className="flex items-start gap-6 rounded-2xl p-6 transition-all hover:-translate-y-0.5"
              style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="mt-0.5 shrink-0 text-amber-500/70">
                {space.icon}
              </div>
              <div className="flex flex-col gap-2 text-left">
                <span className="text-base font-bold text-white">
                  {space.name}
                </span>
                <p className="text-sm leading-relaxed text-zinc-200">{space.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 방명록 */}
      <section className="flex flex-col items-center px-6 pb-32 text-center">
        <p className="mb-6 text-sm text-zinc-400">
          {lang === 'en' ? 'Leave a message to fill this archive with meaning.' : '의미를 채워주는 방명록을 남겨볼까요?'}
        </p>
        <button
          onClick={() => setGuestBookOpen(true)}
          className="group relative text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
        >
          &gt; {t.guestBookTitle} &lt;
          <span className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
        </button>
      </section>

      {guestBookOpen && (
        <GuestBookModal t={t} messages={messages} onClose={() => setGuestBookOpen(false)} onRefresh={fetchMessages} />
      )}
    </main>
    </>
  );
}
