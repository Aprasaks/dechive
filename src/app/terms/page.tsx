import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Dechive 이용약관 안내.',
  alternates: { canonical: 'https://dechive.dev/terms' },
};

export default function TermsPage() {
  return (
    <main id="main-content" className="page-shell py-[var(--section-space)]">
      <article className="max-w-3xl">
        <p className="text-accent text-sm font-semibold uppercase tracking-[0.14em]">Terms</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">이용약관</h1>
        <div className="text-secondary-foreground mt-10 flex flex-col gap-10 leading-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground">서비스 이용</h2>
            <p className="mt-4">
              Dechive는 사람이 직접 공부하고 이해한 내용을 지식, 강의, 실습과 기록으로 다시 구성해 공개하는 학습 플랫폼입니다. 공개 콘텐츠는 누구나 자유롭게 열람할 수 있습니다.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-foreground">콘텐츠 이용 기준</h2>
            <p className="mt-4">
              Dechive의 콘텐츠를 이용할 때에는 관련 법령과 제3자의 권리를 존중해야 합니다. 콘텐츠의 정확성이나 완전성을 보증하지 않으므로 중요한 판단에는 별도의 확인이 필요합니다.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-foreground">서비스 변경</h2>
            <p className="mt-4">
              Dechive는 서비스의 내용과 운영 방식을 필요한 범위에서 변경할 수 있으며, 중요한 변경 사항은 이 사이트를 통해 안내합니다.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
