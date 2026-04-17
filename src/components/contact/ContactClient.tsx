'use client';

import Image from 'next/image';
import { GitBranch, Mail } from 'lucide-react';
import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';

const GOLD = '#c8963a';

const SKILLS = [
  { name: 'AI Prompting', level: 90 },
  { name: 'Next.js', level: 75 },
  { name: 'Tailwind CSS', level: 75 },
  { name: 'TypeScript', level: 65 },
  { name: 'SQL', level: 20 },
  { name: 'Python', level: 10 },
];

const CONTACTS = [
  {
    icon: GitBranch,
    label: 'GitHub',
    value: 'github.com/Aprasaks',
    href: 'https://github.com/Aprasaks',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'heavenis0113@gmail.com',
    href: 'mailto:heavenis0113@gmail.com',
  },
];

function Divider() {
  return (
    <div className="my-10 flex items-center gap-3">
      <div className="h-px flex-1 bg-zinc-800" />
      <span className="text-[10px] text-zinc-700">✦</span>
      <div className="h-px flex-1 bg-zinc-800" />
    </div>
  );
}

export default function ContactClient() {
  const { lang } = useLang();
  const t = i18n[lang];

  return (
    <main className="mx-auto min-h-[calc(100vh-64px-56px)] max-w-2xl px-6 py-14">

      {/* Hero */}
      <section className="mb-2 flex items-center gap-6">
        <div className="relative size-30 shrink-0">
          <Image
            src="/images/archive.webp"
            alt="Dechive mascot"
            fill
            sizes="120px"
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        <div className="flex flex-col justify-center gap-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
            Demian
          </h1>
          <p className="text-base leading-relaxed text-zinc-200">
            {t.aboutBio}
          </p>
        </div>
      </section>

      <Divider />

      {/* Skills */}
      <section>
        <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-zinc-500 uppercase">
          {t.aboutSkillsLabel}
        </p>
        <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
          {SKILLS.map((skill) => (
            <div key={skill.name} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-zinc-100">{skill.name}</span>
                <span className="text-sm font-semibold tabular-nums" style={{ color: GOLD }}>
                  {skill.level}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${skill.level}%`,
                    background: `linear-gradient(to right, rgba(200,150,58,0.5), ${GOLD})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Contact */}
      <section className="flex flex-col gap-4">
        {CONTACTS.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group flex items-center gap-4 rounded-2xl border border-zinc-800 p-5 transition-all hover:border-zinc-600"
          >
            <c.icon size={20} className="shrink-0 text-zinc-500 transition-colors group-hover:text-zinc-100" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">{c.label}</span>
              <span className="text-sm text-zinc-100 group-hover:underline group-hover:underline-offset-4">{c.value}</span>
            </div>
          </a>
        ))}
      </section>

    </main>
  );
}
