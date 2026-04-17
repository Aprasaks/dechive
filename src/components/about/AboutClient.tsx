'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';

const SPACES = [
  { href: '/archive', mascot: '/images/archive.webp', name: 'Archive', descKey: 'spaceArchiveDesc' },
  { href: '/projects', mascot: '/images/projects.webp', name: 'Projects', descKey: 'spaceProjectsDesc' },
  { href: '/logs', mascot: '/images/logs.webp', name: 'Logs', descKey: 'spaceLogsDesc' },
] as const;

export default function AboutClient() {
  const { lang } = useLang();
  const t = i18n[lang];

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 min-h-[calc(100vh-64px-56px)]">
      <section className="flex flex-col items-center text-center mb-20">
        <div className="relative w-48 h-48 mb-8">
          <Image src="/images/about.webp" alt="Dechive mascot" fill sizes="192px" className="object-contain drop-shadow-2xl" priority />
        </div>
        <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-4">
          {t.aboutLabel}
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 leading-snug mb-6">
          {t.aboutTagline1}<br />{t.aboutTagline2}
        </h1>
        <p className="max-w-lg text-base leading-relaxed text-zinc-400">
          {t.aboutDesc}
        </p>
      </section>

      <section>
        <h2 className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-8 text-center">
          {t.spacesLabel}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SPACES.map((space) => (
            <Link
              key={space.name}
              href={space.href}
              className="group flex flex-col items-center text-center rounded-2xl border border-zinc-800 p-8 transition-all hover:border-zinc-600"
            >
              <div className="relative w-32 h-32 mb-6">
                <Image src={space.mascot} alt={space.name} fill sizes="128px" className="object-contain transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-base font-bold text-zinc-100 mb-3">{space.name}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">{t[space.descKey]}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
