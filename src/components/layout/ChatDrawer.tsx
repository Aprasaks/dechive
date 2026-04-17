'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { X, Send } from 'lucide-react';
import { useChatContext } from './ChatProvider';
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

const GREETING = '안녕하세요, 무한서고 사서입니다.\n찾고 싶은 글이 있으시면 말씀해주세요.';

export default function ChatDrawer() {
  const { isOpen, close } = useChatContext();
  const counter = useRef(0);
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage('assistant', GREETING, counter),
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved === 'ko' || saved === 'en') setLang(saved);
  }, []);

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

      const answer = data.answer ?? data.error ?? '답변을 가져오지 못했어요.';
      setMessages((prev) => [
        ...prev,
        createMessage('assistant', answer, counter, data.relatedSlugs),
      ]);
    } catch (err) {
      console.error('[ChatDrawer] API error:', err);
      setMessages((prev) => [
        ...prev,
        createMessage('assistant', '오류가 발생했어요. 잠시 후 다시 시도해주세요.', counter),
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
          w-full md:w-[420px] md:bottom-4 md:right-4 md:rounded-2xl
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
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/archive.webp"
              alt="사서"
              width={28}
              height={28}
              className="opacity-90"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold" style={{ color: '#e8d5a0' }}>
                해고리
              </span>
              <span className="text-[10px]" style={{ color: '#5a4520' }}>
                무한서고 사서
              </span>
            </div>
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
              <span className="animate-pulse">사서가 찾는 중...</span>
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
              placeholder="키워드를 입력하세요..."
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
