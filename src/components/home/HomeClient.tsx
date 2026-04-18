'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
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

function GuestBookModal({ t, onClose }: { t: T; onClose: () => void }) {
  const [page, setPage] = useState(0);
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalPages = Math.ceil(messages.length / PER_PAGE);
  const pageMessages = messages.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const fetchMessages = useCallback(async () => {
    const res = await fetch('/api/guestbook');
    const data = await res.json() as { messages: GuestMessage[] };
    setMessages(data.messages ?? []);
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleSubmit = async () => {
    if (!name.trim() || !password.trim() || !message.trim()) return;
    setSubmitting(true);
    await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password, message }),
    });
    setName(''); setPassword(''); setMessage('');
    await fetchMessages();
    setPage(0);
    setSubmitting(false);
  };

  return (
    <>
      {/* 백드롭 */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* 모달 */}
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl"
        style={{
          background: 'rgba(20,12,4,0.6)',
          backdropFilter: 'blur(24px)',
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent), linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent), linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      >
        {/* 파피루스 텍스처 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'url(/images/background-image.svg)',
            backgroundSize: 'cover',
            opacity: 0.5,
          }}
        />

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
                type="text"
                placeholder={t.guestBookNickname}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-300 focus:border-white/40"
              />
              <input
                type="password"
                placeholder={t.guestBookPassword}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-300 focus:border-white/40"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
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
              className="text-amber-300 transition-opacity disabled:opacity-20"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="text-amber-300 transition-opacity disabled:opacity-20"
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

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center">
      <div className="flex flex-col items-center gap-8">
        <div className="h-px w-10 bg-zinc-700" />
        <h1 className="text-3xl font-extrabold leading-snug tracking-tight sm:text-4xl lg:text-5xl">
          <span className="text-zinc-400">{t.homeTagline1}</span><br />
          <span className="text-white">{t.homeTagline2}</span>
        </h1>
        <div className="h-px w-10 bg-zinc-700" />
        <Link
          href="/archive"
          className="rounded-full border border-zinc-600 px-8 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-400 hover:text-white active:scale-95"
        >
          {t.enterArchive}
        </Link>
        <button
          onClick={() => setGuestBookOpen(true)}
          className="rounded-full border border-zinc-600 px-8 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-400 hover:text-white active:scale-95"
        >
          {t.guestBookTitle}
        </button>
      </div>

      {guestBookOpen && (
        <GuestBookModal t={t} onClose={() => setGuestBookOpen(false)} />
      )}
    </main>
  );
}
