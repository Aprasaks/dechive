import Link from 'next/link';
import type { Lang } from '@/lib/i18n';

interface GuestbookCTAProps {
  lang: Lang;
}

export default function GuestbookCTA({ lang }: GuestbookCTAProps) {
  const copy = lang === 'en'
    ? {
        eyebrow: 'Question for Dechive',
        title: 'What should be verified next?',
        body: 'Leave a short question, an AI answer you want checked, or a point that felt unclear while reading.',
        action: 'Leave a Question',
      }
    : {
        eyebrow: 'Dechive에 묻기',
        title: '다음에 검증할 질문이 있나요?',
        body: '읽다가 헷갈린 개념, 확인해보고 싶은 AI 답변, 더 파고들 주제를 한 줄로 남겨주세요.',
        action: '검증 질문 남기기',
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
