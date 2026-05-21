import Link from 'next/link';
import type { Lang } from '@/lib/i18n';

interface GuestbookCTAProps {
  lang: Lang;
}

export default function GuestbookCTA({ lang }: GuestbookCTAProps) {
  const copy = lang === 'en'
    ? {
        eyebrow: 'Note for Dechive',
        title: 'Want to leave something?',
        body: 'Leave a short impression, feedback, a question, or an AI answer you want checked.',
        action: 'Leave a Note',
      }
    : {
        eyebrow: 'Dechive에 남기기',
        title: '짧게 남기고 싶은 말이 있나요?',
        body: '읽고 난 감상, 피드백, 헷갈린 개념, 확인해보고 싶은 AI 답변을 편하게 남겨주세요.',
        action: '흔적 남기기',
      };

  return (
    <aside className="mt-16 border-y border-[#9a7a3f]/25 bg-[#efe7da]/55 px-5 py-7 sm:px-7">
      <p className="text-xs font-semibold tracking-[0.22em] text-[#9a7a3f] uppercase">
        {copy.eyebrow}
      </p>
      <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <h2 className="font-[family-name:var(--font-header-serif)] text-2xl font-medium text-[#2a211b]">
            {copy.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#6f6257]">
            {copy.body}
          </p>
        </div>
        <Link
          href="/guestbook"
          className="inline-flex shrink-0 items-center justify-center rounded-sm border border-[#9a7a3f]/45 bg-[#2a211b] px-5 py-3 text-sm font-medium tracking-[0.12em] text-[#f8f6f1] transition hover:bg-[#4b3827]"
        >
          {copy.action}
        </Link>
      </div>
    </aside>
  );
}
