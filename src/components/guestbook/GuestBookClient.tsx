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
        setError(data.error ?? (lang === 'en' ? 'Unable to load notes.' : '남겨진 글을 불러오지 못했습니다.'));
        return;
      }

      setMessages(data.messages ?? []);
    } catch {
      setError(lang === 'en' ? 'Unable to load notes.' : '남겨진 글을 불러오지 못했습니다.');
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
        setError(data.error ?? (lang === 'en' ? 'Unable to leave a note.' : '글을 남기지 못했습니다.'));
        return;
      }

      setName('');
      setPassword('');
      setMessage('');
      setPage(0);
      await fetchMessages();
    } catch {
      setError(lang === 'en' ? 'Unable to leave a note.' : '글을 남기지 못했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-5rem)] flex-1 items-center justify-center bg-[#f8f6f1] px-6 py-16 text-[#19140f]">
      <section className="w-full max-w-3xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.34em] text-[#9a7a3f]">
            Dechive
          </p>
          <h1 className="font-[family-name:var(--font-header-serif)] text-4xl font-medium text-[#2a211b] sm:text-5xl">
            {lang === 'en' ? 'Leave a Note' : '흔적 남기기'}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#6f6257]">
            {lang === 'en'
              ? 'Leave a question, feedback, a short impression, or a topic Dechive should examine next.'
              : '질문, 피드백, 짧은 감상, 다음에 다뤄볼 주제를 편하게 남겨주세요.'}
          </p>
        </div>

        <div className="rounded-md border border-[#d8c9b0] bg-[#fbfaf7] p-5 shadow-[0_18px_60px_rgba(42,33,27,0.06)] sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              autoComplete="nickname"
              placeholder={t.guestBookNickname}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-md border border-[#ded6c9] bg-[#f8f6f1] px-4 py-3 text-sm text-[#19140f] outline-none placeholder:text-[#8b8175] focus:border-[#9a7a3f]/70"
            />
            <input
              type="password"
              autoComplete="off"
              placeholder={t.guestBookPassword}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-md border border-[#ded6c9] bg-[#f8f6f1] px-4 py-3 text-sm text-[#19140f] outline-none placeholder:text-[#8b8175] focus:border-[#9a7a3f]/70"
            />
          </div>

          <textarea
            rows={4}
            placeholder={t.guestBookMessage}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="mt-3 w-full resize-none rounded-md border border-[#ded6c9] bg-[#f8f6f1] px-4 py-3 text-sm leading-relaxed text-[#19140f] outline-none placeholder:text-[#8b8175] focus:border-[#9a7a3f]/70"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-h-5 text-xs text-[#9a5f32]">
              {error}
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#9a7a3f]/45 bg-[#2a211b] px-5 py-2.5 text-sm font-medium text-[#f8f6f1] transition-colors hover:bg-[#4b3827] disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Feather size={15} className="text-[#efe7da]" />
              {submitting ? (lang === 'en' ? 'Leaving...' : '남기는 중...') : t.guestBookSubmit}
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-md border border-[#d8c9b0] bg-[#f2eee6]/70 p-5 shadow-[0_18px_60px_rgba(42,33,27,0.05)] sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-sm font-medium tracking-[0.18em] text-[#5d4630]">
              {lang === 'en' ? 'NOTES LEFT ON DECHIVE' : '남겨진 흔적'}
            </h2>
            <span className="text-xs text-[#8b8175]">
              {messages.length}
            </span>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-[#8b8175]">
              {lang === 'en' ? 'Loading notes...' : '남겨진 글을 불러오는 중입니다...'}
            </p>
          ) : pageMessages.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#8b8175]">
              {lang === 'en' ? 'No notes have been left yet.' : '아직 남겨진 글이 없습니다.'}
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {pageMessages.map((guestMessage) => (
                <article key={guestMessage.id} className="border-b border-[#d8c9b0] pb-5 last:border-b-0 last:pb-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-medium text-[#2a211b]">
                      {guestMessage.name}
                    </span>
                    <span className="text-[11px] text-[#8b8175]">
                      {new Date(guestMessage.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'ko-KR', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-[#3f342b]">
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
                className="rounded-md border border-[#d8c9b0] p-2 text-[#6f6257] transition-colors hover:border-[#9a7a3f]/70 hover:text-[#17120d] disabled:opacity-35"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-[#8b8175]">
                {page + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((currentPage) => Math.min(totalPages - 1, currentPage + 1))}
                disabled={page >= totalPages - 1}
                className="rounded-md border border-[#d8c9b0] p-2 text-[#6f6257] transition-colors hover:border-[#9a7a3f]/70 hover:text-[#17120d] disabled:opacity-35"
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
