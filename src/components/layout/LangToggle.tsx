'use client';

import { useLang } from './LangProvider';

export default function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      <button
        onClick={() => setLang('ko')}
        className={`transition-colors ${lang === 'ko' ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-400'}`}
      >
        KO
      </button>
      <span className="text-zinc-700">·</span>
      <button
        onClick={() => setLang('en')}
        className={`transition-colors ${lang === 'en' ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-400'}`}
      >
        EN
      </button>
    </div>
  );
}
