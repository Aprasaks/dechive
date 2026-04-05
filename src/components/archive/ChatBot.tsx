'use client';

import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '@/types/archive';

interface ChatBotProps {
  onHighlight: (ids: string[]) => void;
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

export default function ChatBot({ onHighlight }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      'assistant',
      '안녕하세요! 찾고 싶은 글의 주제나 키워드를 입력하면 관련 포스트를 찾아드릴게요.',
    ),
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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

    // TODO: RAG 연동 — POST /api/chat 로 교체
    // const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ query: trimmed }) });
    // const { answer, relatedPostIds } = await res.json();
    await new Promise((r) => setTimeout(r, 800));
    const mockIds: string[] = []; // RAG 연동 시 채워질 포스트 ID 목록
    const mockAnswer =
      'RAG 시스템이 연동되면 여기서 관련 포스트를 찾아드릴 수 있어요. 현재는 준비 중입니다.';

    setMessages((prev) => [
      ...prev,
      createMessage('assistant', mockAnswer, mockIds),
    ]);
    onHighlight(mockIds);
    setLoading(false);
  };

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
          Archive Search
        </p>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={[
              'max-w-[90%] rounded-2xl px-3 py-2 text-xs leading-relaxed',
              msg.role === 'user'
                ? 'self-end bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'self-start bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
            ].join(' ')}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="self-start rounded-2xl bg-zinc-100 px-3 py-2 text-xs text-zinc-400 dark:bg-zinc-800">
            검색 중...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-zinc-200 p-3 dark:border-zinc-800"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="키워드 입력..."
            className="flex-1 rounded-xl bg-zinc-100 px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none dark:bg-zinc-800 dark:text-zinc-100"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition-opacity disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
          >
            전송
          </button>
        </div>
      </form>
    </aside>
  );
}
