import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Projects | Dechive',
  description: '직접 만들고 부수며 배운 것들의 기록. 아이디어가 코드가 되는 과정.',
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 min-h-[calc(100vh-64px-56px)]">

      {/* 히어로 */}
      <section className="flex flex-col items-center text-center mb-20">
        <div className="relative w-48 h-48 mb-8">
          <Image
            src="/images/projects.webp"
            alt="Projects mascot"
            fill
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

      {/* Coming Soon */}
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

    </main>
  );
}
