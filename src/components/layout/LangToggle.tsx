'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLang } from './LangProvider';
import type { Lang } from '@/lib/i18n';

export default function LangToggle({ tone = 'dark' }: { tone?: 'dark' | 'light' | 'hero' }) {
  const { lang, setLang } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const activeClass = tone === 'hero' ? 'text-white' : tone === 'light' ? 'text-[#111111]' : 'text-white';
  const inactiveClass = tone === 'hero'
    ? 'text-white/70 hover:text-white'
    : tone === 'light'
      ? 'text-[#777777] hover:text-[#111111]'
      : 'text-zinc-400 hover:text-zinc-200';
  const separatorClass = tone === 'hero' ? 'text-white/55' : tone === 'light' ? 'text-[#b7ad9e]' : 'text-zinc-500';

  function toggle(next: Lang) {
    setLang(next);

    if (pathname.startsWith('/en/archive/')) {
      // 영문 포스트 → 한글로
      if (next === 'ko') {
        router.push(pathname.replace('/en/archive/', '/archive/'));
      }
    } else if (pathname.startsWith('/en/deep-dive/')) {
      if (next === 'ko') {
        router.push(pathname.replace('/en/deep-dive/', '/deep-dive/'));
      }
    } else if (pathname === '/en/deep-dive') {
      if (next === 'ko') {
        router.push('/deep-dive');
      }
    } else if (pathname === '/en/archive') {
      if (next === 'ko') {
        router.push('/archive');
      }
    } else if (pathname.startsWith('/archive/')) {
      // 한글 포스트 → 영문으로
      if (next === 'en') {
        router.push(`/en${pathname}`);
      }
    } else if (pathname === '/archive') {
      if (next === 'en') {
        router.push('/en/archive');
      }
    } else if (pathname.startsWith('/deep-dive/')) {
      if (next === 'en') {
        router.push(`/en${pathname}`);
      }
    } else if (pathname === '/deep-dive') {
      if (next === 'en') {
        router.push('/en/deep-dive');
      }
    }
  }

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      <button
        onClick={() => toggle('ko')}
        className={`transition-colors ${lang === 'ko' ? activeClass : inactiveClass}`}
      >
        KO
      </button>
      <span className={separatorClass}>·</span>
      <button
        onClick={() => toggle('en')}
        className={`transition-colors ${lang === 'en' ? activeClass : inactiveClass}`}
      >
        EN
      </button>
    </div>
  );
}
