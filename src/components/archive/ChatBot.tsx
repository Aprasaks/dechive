'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [lastRelatedSlugs, setLastRelatedSlugs] = useState<string[]>([]);

  // 언어 바뀌면 대화 초기화 (하이라이트는 같은 slug로 유지)
  useEffect(() => {
    setMessages([createMessage('assistant', GREETING[lang] ?? GREETING.ko)]);
    onHighlight(lastRelatedSlugs);
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

    // 직전 답변 있고 + 짧은 후속 질문이면 출처 안내
    if (lastRelatedSlugs.length > 0 && trimmed.length <= 20) {
      setMessages((prev) => [...prev, createMessage('assistant', '방금 답변이 담긴 포스트예요!', lastRelatedSlugs)]);
      onHighlight(lastRelatedSlugs);
      return;
    }

    setLoading(true);

    const history = messages
      .filter((m) => !m.content.startsWith('__REQUEST__:'))
      .map((m) => ({ role: m.role, content: m.content }));

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: trimmed, lang, history }),
    });
    const data = await res.json() as { answer?: string | null; relatedSlugs?: string[]; allSlugs?: string[]; notFound?: boolean; error?: string };

    if (data.notFound) {
      setMessages((prev) => [
        ...prev,
        createMessage('assistant', `__REQUEST__:${trimmed}`),
      ]);
    } else {
      const answer = data.answer ?? data.error ?? '답변을 가져오지 못했어요.';
      const relatedSlugs = data.relatedSlugs ?? [];
      const allSlugs = data.allSlugs ?? [];
      setMessages((prev) => [...prev, createMessage('assistant', answer, relatedSlugs)]);
      if (allSlugs.length > 0) setLastRelatedSlugs(allSlugs);
      onHighlight(relatedSlugs);
    }
    setLoading(false);
  };

  return (
    <aside className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base">🦴</span>
          <span className="text-sm font-semibold text-zinc-300">해고리</span>
          <span className="text-xs text-zinc-600">— 무한서고 사서</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4 min-h-0">
        {messages.map((msg) => {
          const isRequest = msg.role === 'assistant' && msg.content.startsWith('__REQUEST__:');
          const requestQuery = isRequest ? msg.content.replace('__REQUEST__:', '') : '';

          return (
            <div key={msg.id} className="flex flex-col gap-2">
              <div
                className={[
                  'max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'self-end bg-white/20 text-white'
                    : 'self-start bg-white/10 text-zinc-300',
                ].join(' ')}
              >
                {isRequest
                  ? '아직 이 내용에 대한 포스트가 없어요. 작성을 요청하시겠어요?'
                  : msg.content}
              </div>
              {isRequest && (
                <button
                  onClick={async () => {
                    await fetch('/api/request-post', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ query: requestQuery }),
                    });
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === msg.id
                          ? { ...m, content: '요청이 전달됐어요! 곧 포스트로 만들어볼게요 😊' }
                          : m,
                      ),
                    );
                  }}
                  className="self-start ml-1 rounded-xl bg-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/30 transition-colors cursor-pointer"
                >
                  포스트 요청하기
                </button>
              )}
            </div>
          );
        })}
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
