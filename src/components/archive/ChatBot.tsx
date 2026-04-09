'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '@/types/archive';

interface ChatBotProps {
  onHighlight: (ids: string[]) => void;
  lang: string;
}

let messageCounter = 0;

function createMessage(
  role: ChatMessage['role'],
  content: string,
  relatedPostIds?: string[],
): ChatMessage {
  return {
    id: String(++messageCounter),
    role,
    content,
    timestamp: new Date().toISOString(),
    relatedPostIds,
  };
}

const GREETING: Record<string, string> = {
  ko: '어서오세요~ 원하시는 정보가 있으신가요?',
  en: 'Welcome~ Is there anything you\'re looking for?',
};

const PLACEHOLDER: Record<string, string> = {
  ko: '키워드 입력...',
  en: 'Enter keyword...',
};

const SEND_LABEL: Record<string, string> = {
  ko: '전송',
  en: 'Send',
};

export default function ChatBot({ onHighlight, lang }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage('assistant', GREETING[lang] ?? GREETING.ko),
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // 언어 바뀌면 대화 초기화
  useEffect(() => {
    setMessages([createMessage('assistant', GREETING[lang] ?? GREETING.ko)]);
    onHighlight([]);
  }, [lang]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setInput('');
    setMessages((prev) => [...prev, createMessage('user', trimmed)]);

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
      const data = await res.json() as { answer?: string | null; relatedSlugs?: string[]; error?: string };

      const answer = data.answer ?? data.error ?? '답변을 가져오지 못했어요.';
      const relatedSlugs = data.relatedSlugs ?? [];
      setMessages((prev) => [...prev, createMessage('assistant', answer, relatedSlugs)]);
      onHighlight(relatedSlugs);
    } catch {
      setMessages((prev) => [...prev, createMessage('assistant', '오류가 발생했어요. 잠시 후 다시 시도해주세요.')]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <img src="/images/emoticon-small.png" alt="해고리" className="w-5 h-5 object-contain" />
          <span className="text-sm font-semibold text-zinc-300">해고리</span>
          <span className="text-xs text-zinc-600">— 무한서고 사서</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={[
              'max-w-[90%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
              msg.role === 'user'
                ? 'self-end bg-white/20 text-white'
                : 'self-start bg-white/10 text-zinc-300',
            ].join(' ')}
          >
            {msg.role === 'user' ? (
              msg.content
            ) : (
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-zinc-100">{children}</strong>,
                  ul: ({ children }) => <ul className="mt-1 mb-2 flex flex-col gap-1 pl-4">{children}</ul>,
                  ol: ({ children }) => <ol className="mt-1 mb-2 flex flex-col gap-1 pl-4 list-decimal">{children}</ol>,
                  li: ({ children }) => <li className="list-disc">{children}</li>,
                  code: ({ children }) => <code className="rounded bg-white/10 px-1 py-0.5 text-xs text-zinc-200">{children}</code>,
                  h3: ({ children }) => <p className="font-semibold text-zinc-100 mb-1">{children}</p>,
                  h4: ({ children }) => <p className="font-semibold text-zinc-200 mb-1">{children}</p>,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            )}
          </div>
        ))}
        {loading && (
          <div className="self-start rounded-2xl bg-white/10 px-3 py-2 text-sm text-zinc-400">
            검색 중...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-white/10 p-3 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            id="chatbot-input"
            name="chatbot-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={PLACEHOLDER[lang] ?? PLACEHOLDER.ko}
            className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-white/20 px-3 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40 cursor-pointer hover:bg-white/30"
          >
            {SEND_LABEL[lang] ?? SEND_LABEL.ko}
          </button>
        </div>
      </form>
    </aside>
  );
}
