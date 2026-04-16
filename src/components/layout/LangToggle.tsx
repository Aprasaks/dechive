'use client';

import { useState, useEffect } from 'react';

export default function LangToggle() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as 'ko' | 'en' | null;
    if (saved) {
      setLang(saved);
    } else {
      const browser = navigator.language.toLowerCase();
      if (browser.startsWith('en')) setLang('en');
    }
  }, []);

  function toggle(next: 'ko' | 'en') {
    setLang(next);
    localStorage.setItem('lang', next);
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
