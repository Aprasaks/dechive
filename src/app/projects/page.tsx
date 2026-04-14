import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProjects } from '@/lib/projects';
import type { Project } from '@/types/archive';

export const metadata: Metadata = {
  title: 'Projects',
  description: '직접 만들고 부수며 배운 것들의 기록. 아이디어가 코드가 되는 과정.',
  alternates: { canonical: 'https://dechive.dev/projects' },
  openGraph: {
    title: 'Projects | Dechive',
    description: '직접 만들고 부수며 배운 것들의 기록. 아이디어가 코드가 되는 과정.',
    url: 'https://dechive.dev/projects',
    images: [{ url: 'https://dechive.dev/images/thumb.webp', width: 1200, height: 630, alt: 'Dechive Projects' }],
  },
};

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

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 min-h-[calc(100vh-64px-56px)]">

      {/* 히어로 */}
      <section className="flex flex-col items-center text-center mb-20">
        <div className="relative w-48 h-48 mb-8">
          <Image
            src="/images/projects.webp"
            alt="Projects mascot"
            fill
            sizes="192px"
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-4">
          Dechive · Projects
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 leading-snug mb-6">
          아이디어가 코드가 되는<br />과정을 기록한다.
        </h1>
        <p className="max-w-lg text-base leading-relaxed text-zinc-400">
          직접 만들고, 부수고, 다시 만드는 과정에서 배운 것들을 기록하는 공간.
          완성된 결과물보다 그 과정이 더 값지다.
        </p>
      </section>

      {/* 프로젝트 목록 */}
      {projects.length === 0 ? (
        <section className="flex flex-col items-center text-center">
          <div className="rounded-2xl border border-zinc-800 px-12 py-10">
            <p className="text-xs font-semibold tracking-widest text-zinc-600 uppercase mb-3">
              Coming Soon
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              프로젝트 기록들이 곧 채워질 예정입니다.
            </p>
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
                  <Link
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    Live →
                  </Link>
                )}
                {project.github && (
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
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
