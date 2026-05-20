'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Lang } from '@/lib/i18n';

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [lang, setLangState] = useState<Lang>('ko');

  useEffect(() => {
    if (pathname === '/en' || pathname.startsWith('/en/')) {
      setLangState('en');
      localStorage.setItem('lang', 'en');
      return;
    }
    if (pathname.startsWith('/archive') || pathname.startsWith('/deep-dive')) {
      setLangState('ko');
      localStorage.setItem('lang', 'ko');
      return;
    }

    const saved = localStorage.getItem('lang');
    if (saved === 'ko' || saved === 'en') {
      setLangState(saved);
    } else if (navigator.language.toLowerCase().startsWith('en')) {
      setLangState('en');
    }
  }, [pathname]);

  function setLang(next: Lang) {
    setLangState(next);
    localStorage.setItem('lang', next);
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
