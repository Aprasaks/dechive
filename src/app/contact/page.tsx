import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Dechive 문의 안내.',
  alternates: { canonical: 'https://dechive.dev/contact' },
};

export default function ContactPage() {
  return (
    <main id="main-content" className="page-shell py-[var(--section-space)]">
      <article className="max-w-3xl">
        <p className="text-accent text-sm font-semibold uppercase tracking-[0.14em]">Contact</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">문의</h1>
        <p className="text-secondary-foreground mt-10 leading-8">
          Dechive에 관한 문의나 콘텐츠 관련 의견은 아래 이메일로 보내 주세요.
        </p>
        <a
          href="mailto:heavenis0113@gmail.com"
          className="text-accent mt-6 inline-block underline underline-offset-4 transition-colors hover:text-foreground"
        >
          heavenis0113@gmail.com
        </a>
      </article>
    </main>
  );
}
