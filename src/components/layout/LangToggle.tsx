'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLang } from './LangProvider';
import type { Lang } from '@/lib/i18n';

export default function LangToggle() {
  const { lang, setLang } = useLang();
  const router = useRouter();
  const pathname = usePathname();

  function toggle(next: Lang) {
    setLang(next);

    if (pathname.startsWith('/en/archive/')) {
      // 영문 포스트 → 한글로
      if (next === 'ko') {
        router.push(pathname.replace('/en/archive/', '/archive/'));
      }
    } else if (pathname.startsWith('/archive/')) {
      // 한글 포스트 → 영문으로
      if (next === 'en') {
        router.push(`/en${pathname}`);
      }
    }
  }

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      <button
        onClick={() => toggle('ko')}
        className={`transition-colors ${lang === 'ko' ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-400'}`}
      >
        KO
      </button>
      <span className="text-zinc-700">·</span>
      <button
        onClick={() => toggle('en')}
        className={`transition-colors ${lang === 'en' ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-400'}`}
      >
        EN
      </button>
    </div>
  );
}
