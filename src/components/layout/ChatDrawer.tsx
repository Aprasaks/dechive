'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { X, Send } from 'lucide-react';
import { useChatContext } from './ChatProvider';
import { useLang } from './LangProvider';
import i18n from '@/lib/i18n';
import type { ChatMessage } from '@/types/archive';

function createMessage(
  role: ChatMessage['role'],
  content: string,
  counter: { current: number },
  relatedPostIds?: string[],
): ChatMessage {
  counter.current += 1;
  return {
    id: String(counter.current),
    role,
    content,
    timestamp: new Date().toISOString(),
    relatedPostIds,
  };
}


export default function ChatDrawer() {
  const { isOpen, close } = useChatContext();
  const { lang } = useLang();
  const t = i18n[lang];
  const counter = useRef(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage('assistant', t.chatGreeting, counter),
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([createMessage('assistant', t.chatGreeting, counter)]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setInput('');
    setMessages((prev) => [...prev, createMessage('user', trimmed, counter)]);
    setLoading(true);

    const history = messages
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed, lang, history }),
      });
      const data = await res.json() as {
        answer?: string | null;
        relatedSlugs?: string[];
        error?: string;
      };

      const answer = data.answer ?? data.error ?? t.chatFallback;
      setMessages((prev) => [
        ...prev,
        createMessage('assistant', answer, counter, data.relatedSlugs),
      ]);
    } catch (err) {
      console.error('[ChatDrawer] API error:', err);
      setMessages((prev) => [
        ...prev,
        createMessage('assistant', t.chatError, counter),
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 백드롭 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={close}
        />
      )}

      {/* 드로어 */}
      <div
        className={`
          fixed bottom-0 right-0 z-50 flex flex-col
          w-full md:w-105 md:bottom-4 md:right-4 md:rounded-2xl
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
        `}
        style={{
          height: '70vh',
          background: 'rgba(8,6,4,0.92)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,150,58,0.15)',
          border: '1px solid rgba(200,150,58,0.12)',
        }}
      >
        {/* 헤더 */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid rgba(200,150,58,0.12)' }}
        >
          <div className="flex items-center gap-3">
            <Image
              src="/images/archive.webp"
              alt="사서"
              width={40}
              height={40}
              className="opacity-90"
            />
            <span className="text-sm font-semibold" style={{ color: '#e8d5a0' }}>
              {t.chatLibrarian}
            </span>
          </div>
          <button
            onClick={close}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
            aria-label="닫기"
          >
            <X size={16} style={{ color: '#8a6e3a' }} />
          </button>
        </div>

        {/* 메시지 영역 */}
        <div
          className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 min-h-0"
          style={{ scrollbarWidth: 'none' }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[88%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div
                className="rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                style={
                  msg.role === 'user'
                    ? { background: 'rgba(200,150,58,0.2)', color: '#e8d5a0' }
                    : { background: 'rgba(255,255,255,0.06)', color: '#c8b89a' }
                }
              >
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => (
                        <strong style={{ color: '#e8d5a0', fontWeight: 600 }}>{children}</strong>
                      ),
                      ul: ({ children }) => (
                        <ul className="mt-1 mb-2 flex flex-col gap-1 pl-4">{children}</ul>
                      ),
                      li: ({ children }) => <li className="list-disc">{children}</li>,
                      code: ({ children }) => (
                        <code
                          className="rounded px-1 py-0.5 text-xs"
                          style={{ background: 'rgba(255,255,255,0.1)', color: '#e8d5a0' }}
                        >
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div
              className="self-start rounded-2xl px-3.5 py-2.5 text-sm"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#8a6e3a' }}
            >
              <span className="animate-pulse">{t.chatSearching}</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* 입력 */}
        <form
          onSubmit={handleSubmit}
          className="p-3 shrink-0"
          style={{ borderTop: '1px solid rgba(200,150,58,0.12)' }}
        >
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#5a4520]"
              style={{ color: '#e8d5a0' }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="shrink-0 rounded-lg p-1.5 transition-all disabled:opacity-30"
              style={{ color: '#c8963a' }}
              aria-label="전송"
            >
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
