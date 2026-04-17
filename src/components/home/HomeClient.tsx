'use client';

import Link from 'next/link';
import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';

export default function HomeClient() {
  const { lang } = useLang();
  const t = i18n[lang];

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 pb-20 text-center">
      <div className="flex flex-col items-center gap-8">
        <div className="h-px w-10 bg-zinc-700" />
        <h1 className="text-3xl font-extrabold leading-snug tracking-tight sm:text-4xl lg:text-5xl">
          <span className="text-zinc-400">{t.homeTagline1}</span><br />
          <span className="text-white">{t.homeTagline2}</span>
        </h1>
        <div className="h-px w-10 bg-zinc-700" />
        <Link
          href="/archive"
          className="rounded-full border border-zinc-600 px-8 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-400 hover:text-white active:scale-95"
        >
          {t.enterArchive}
        </Link>
      </div>
    </main>
  );
}
