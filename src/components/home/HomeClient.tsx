'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Feather } from 'lucide-react';
import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';

interface HomeClientProps {
  koPostHrefs: string[];
  enPostHrefs: string[];
}

export default function HomeClient({ koPostHrefs, enPostHrefs }: HomeClientProps) {
  const router = useRouter();
  const { lang } = useLang();
  const t = i18n[lang];

  const handleRandomPost = useCallback(() => {
    const postHrefs = lang === 'en' ? enPostHrefs : koPostHrefs;
    if (postHrefs.length === 0) {
      router.push('/archive');
      return;
    }

    const randomIndex = Math.floor(Math.random() * postHrefs.length);
    router.push(postHrefs[randomIndex]);
  }, [enPostHrefs, koPostHrefs, lang, router]);

  return (
    <main className="flex min-h-[calc(100vh-64px-56px)] flex-1 flex-col overflow-hidden">
      {/* 히어로 */}
      <section className="relative flex min-h-[calc(100vh-64px-56px)] flex-col items-center justify-center px-6 text-center">
        <div className="-mt-20 flex w-full max-w-4xl flex-col items-center sm:-mt-24">
          <div className="flex w-full max-w-lg items-center justify-center gap-4">
            <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/45" />
            <p className="shrink-0 text-sm font-medium tracking-[0.22em] text-white/65 sm:text-base">
              {t.homeTagline1}
            </p>
            <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/45" />
          </div>

          <h1 className="mt-9 text-3xl font-semibold leading-[1.35] tracking-normal whitespace-pre-line text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.18)] sm:text-4xl lg:text-[52px]">
            {t.homeTagline2}
          </h1>

          <div className="mt-20 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/archive"
              className="group flex min-w-56 items-center justify-center gap-3 rounded-md border border-amber-200/35 bg-black/35 px-6 py-3.5 text-sm font-medium text-amber-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors hover:border-amber-200/45 hover:bg-black/45"
            >
              <BookOpen size={16} className="text-amber-100/80" />
              {t.homeBrowseRecords}
            </Link>

            <button
              type="button"
              onClick={handleRandomPost}
              className="group flex min-w-56 items-center justify-center gap-3 rounded-md border border-white/15 bg-black/25 px-6 py-3.5 text-sm font-medium text-zinc-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-md transition-colors hover:border-white/25 hover:bg-black/35"
            >
              <Feather size={15} className="text-zinc-200/75" />
              {t.homeRandomRecord}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
