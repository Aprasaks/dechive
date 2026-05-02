'use client';

import Link from 'next/link';
import { useLang } from '@/components/layout/LangProvider';
import i18n from '@/lib/i18n';
import type { Project } from '@/types/archive';

interface ProjectsClientProps {
  projects: Project[];
}

const STATUS_LABEL: Record<Project['status'], string> = {
  'in-progress': 'In Progress',
  'completed': 'Completed',
  'archived': 'Archived',
};

const STATUS_COLOR: Record<Project['status'], string> = {
  'in-progress': 'text-emerald-400 border-emerald-800',
  'completed': 'text-blue-400 border-blue-800',
  'archived': 'text-zinc-500 border-zinc-700',
};

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const { lang } = useLang();
  const t = i18n[lang];

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 min-h-[calc(100vh-64px-56px)]">
      <section className="flex flex-col items-center text-center mb-20">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 leading-snug mb-6">
          {t.projectsTagline1}<br />{t.projectsTagline2}
        </h1>
        <p className="max-w-lg text-base leading-relaxed text-zinc-400">
          {t.projectsDesc}
        </p>
      </section>

      {projects.length === 0 ? (
        <section className="flex flex-col items-center text-center">
          <div className="rounded-2xl border border-zinc-800 px-12 py-10">
            <p className="text-xs font-semibold tracking-widest text-zinc-600 uppercase mb-3">
              {t.comingSoon}
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed">{t.projectsEmpty}</p>
          </div>
        </section>
      ) : (
        <section className="grid gap-6">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="rounded-2xl border border-zinc-800 p-6 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-lg font-bold text-zinc-100">{project.title}</h2>
                <span className={`text-xs font-semibold border rounded-full px-3 py-1 shrink-0 ${STATUS_COLOR[project.status]}`}>
                  {STATUS_LABEL[project.status]}
                </span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech) => (
                  <span key={tech} className="text-xs bg-zinc-800 text-zinc-300 rounded-md px-2 py-1">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                {project.url && (
                  <Link href={project.url} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors">
                    Live →
                  </Link>
                )}
                {project.github && (
                  <Link href={project.github} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors">
                    GitHub →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
