import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Dechive',
  description: '기록되어지는 지식은 가치를 가진다. Dechive는 수많은 정보를 재정립하여 지식으로 만드는 공간입니다.',
};

const SPACES = [
  {
    href: '/archive',
    mascot: '/images/archive.webp',
    name: 'Archive',
    description: '수집된 지식을 정제하고 기록하는 공간. 기술, 철학, 사유의 흔적들이 쌓인다.',
  },
  {
    href: '/projects',
    mascot: '/images/projects.webp',
    name: 'Projects',
    description: '직접 만들고 부수며 배운 것들의 기록. 아이디어가 코드가 되는 과정.',
  },
  {
    href: '/logs',
    mascot: '/images/logs.webp',
    name: 'Logs',
    description: 'AI와 함께하는 트러블슈팅과 데일리 로그. 날것의 성장 기록.',
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 min-h-[calc(100vh-64px-56px)]">

      {/* 히어로 */}
      <section className="flex flex-col items-center text-center mb-20">
        <div className="relative w-48 h-48 mb-8">
          <Image
            src="/images/about.webp"
            alt="Dechive mascot"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
        <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-4">
          Dechive
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 leading-snug mb-6">
          기록되어지는 지식은<br />가치를 가진다.
        </h1>
        <p className="max-w-lg text-base leading-relaxed text-zinc-400">
          수많은 정보 속에서 의미 있는 것을 골라내고, 재정립하여 지식으로 만드는 공간.
          Dechive는 그 과정을 투명하게 기록합니다.
        </p>
      </section>

      {/* 공간 소개 */}
      <section>
        <h2 className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-8 text-center">
          Spaces
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {SPACES.map((space) => (
            <Link
              key={space.name}
              href={space.href}
              className="group flex flex-col items-center text-center rounded-2xl border border-zinc-800 p-8 transition-all hover:border-zinc-600"
            >
              <div className="relative w-32 h-32 mb-6">
                <Image
                  src={space.mascot}
                  alt={space.name}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-base font-bold text-zinc-100 mb-3">
                {space.name}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                {space.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
