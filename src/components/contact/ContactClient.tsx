'use client';

import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';

export default function ContactClient() {
  const { lang } = useLang();
  const t = i18n[lang];

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 min-h-[calc(100vh-64px-56px)]">
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-zinc-100">
        Contact
      </h1>
      <p className="mb-12 text-zinc-400">{t.contactDesc}</p>
      <div className="flex flex-col gap-6">
        <a
          href="mailto:heavenis0113@gmail.com"
          className="group flex items-center gap-4 rounded-2xl border border-zinc-800 p-6 transition-all hover:border-zinc-600"
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">Email</span>
            <span className="text-zinc-100 group-hover:underline group-hover:underline-offset-4">
              heavenis0113@gmail.com
            </span>
          </div>
        </a>
      </div>
    </main>
  );
}
