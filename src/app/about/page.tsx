import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Dechive의 운영 원칙과 공개 콘텐츠 범위.',
  alternates: { canonical: 'https://dechive.dev/about' },
};

export default function AboutPage() {
  return (
    <main id="main-content" className="page-shell py-[var(--section-space)]">
      <article className="max-w-3xl">
        <p className="text-accent text-sm font-semibold uppercase tracking-[0.14em]">About</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Dechive</h1>
        <p className="text-secondary-foreground mt-10 text-lg leading-8">
          Dechive는 사람이 직접 공부하고 이해한 내용을 지식, 강의, 실습과 기록으로 다시 구성하는 독립적인 학습 공간입니다. 공개 콘텐츠는 무료로 열람할 수 있습니다.
        </p>
      </article>
    </main>
  );
}
