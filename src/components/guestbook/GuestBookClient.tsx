'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Feather } from 'lucide-react';
import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

interface GuestBookResponse {
  messages?: GuestMessage[];
  error?: string;
}

const PER_PAGE = 5;

export default function GuestBookClient() {
  const { lang } = useLang();
  const t = i18n[lang];
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [page, setPage] = useState(0);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalPages = Math.max(1, Math.ceil(messages.length / PER_PAGE));
  const pageMessages = useMemo(
    () => messages.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE),
    [messages, page],
  );

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/guestbook');
      const data = await response.json() as GuestBookResponse;

      if (!response.ok) {
        setError(data.error ?? (lang === 'en' ? 'Unable to load messages.' : '방명록을 불러오지 못했습니다.'));
        return;
      }

      setMessages(data.messages ?? []);
    } catch {
      setError(lang === 'en' ? 'Unable to load messages.' : '방명록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSubmit = async () => {
    if (!name.trim() || !password.trim() || !message.trim()) {
      setError(lang === 'en' ? 'Please fill in every field.' : '모든 항목을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          password,
          message,
        }),
      });
      const data = await response.json() as GuestBookResponse;

      if (!response.ok) {
        setError(data.error ?? (lang === 'en' ? 'Unable to leave a message.' : '방명록을 남기지 못했습니다.'));
        return;
      }

      setName('');
      setPassword('');
      setMessage('');
      setPage(0);
      await fetchMessages();
    } catch {
      setError(lang === 'en' ? 'Unable to leave a message.' : '방명록을 남기지 못했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <section className="w-full max-w-3xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.34em] text-white/45">
            Dechive
          </p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            {lang === 'en' ? 'Guestbook' : '방명록'}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-zinc-300">
            {lang === 'en'
              ? 'If you passed through this library, leave a small trace.'
              : '이 도서관을 지나갔다면, 작은 흔적을 남겨주세요.'}
          </p>
        </div>

        <div className="rounded-md border border-white/12 bg-black/35 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-md sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              autoComplete="nickname"
              placeholder={t.guestBookNickname}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-md border border-white/12 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/30"
            />
            <input
              type="password"
              autoComplete="off"
              placeholder={t.guestBookPassword}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-md border border-white/12 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/30"
            />
          </div>

          <textarea
            rows={4}
            placeholder={t.guestBookMessage}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="mt-3 w-full resize-none rounded-md border border-white/12 bg-black/25 px-4 py-3 text-sm leading-relaxed text-white outline-none placeholder:text-white/45 focus:border-white/30"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-h-5 text-xs text-amber-100/70">
              {error}
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-amber-200/30 bg-amber-200/10 px-5 py-2.5 text-sm font-medium text-amber-50 transition-colors hover:bg-amber-200/15 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Feather size={15} className="text-amber-100/80" />
              {submitting ? (lang === 'en' ? 'Leaving...' : '남기는 중...') : t.guestBookSubmit}
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-md border border-white/10 bg-black/25 p-5 backdrop-blur-md sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-sm font-medium tracking-[0.18em] text-white/75">
              {lang === 'en' ? 'TRACES LEFT BEHIND' : '남겨진 흔적들'}
            </h2>
            <span className="text-xs text-zinc-400">
              {messages.length}
            </span>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-zinc-400">
              {lang === 'en' ? 'Opening the guestbook...' : '방명록을 여는 중입니다...'}
            </p>
          ) : pageMessages.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-400">
              {lang === 'en' ? 'No traces have been left yet.' : '아직 남겨진 흔적이 없습니다.'}
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {pageMessages.map((guestMessage) => (
                <article key={guestMessage.id} className="border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-100">
                      {guestMessage.name}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {new Date(guestMessage.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'ko-KR', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-200">
                    {guestMessage.message}
                  </p>
                </article>
              ))}
            </div>
          )}

          {messages.length > PER_PAGE && (
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
                disabled={page === 0}
                className="rounded-md border border-white/10 p-2 text-zinc-300 transition-colors hover:text-white disabled:opacity-35"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-zinc-400">
                {page + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((currentPage) => Math.min(totalPages - 1, currentPage + 1))}
                disabled={page >= totalPages - 1}
                className="rounded-md border border-white/10 p-2 text-zinc-300 transition-colors hover:text-white disabled:opacity-35"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
