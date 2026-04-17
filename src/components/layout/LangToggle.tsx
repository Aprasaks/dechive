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

    const isPostPage =
      pathname.startsWith('/archive/') || pathname.startsWith('/logs/');

    if (isPostPage) {
      const params = new URLSearchParams(window.location.search);
      if (next === 'en') {
        params.set('lang', 'en');
      } else {
        params.delete('lang');
      }
      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ''}`);
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
