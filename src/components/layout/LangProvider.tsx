'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Lang } from '@/lib/i18n';

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ko');

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved === 'ko' || saved === 'en') {
      setLangState(saved);
    } else if (navigator.language.toLowerCase().startsWith('en')) {
      setLangState('en');
    }
  }, []);

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
