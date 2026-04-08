import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: '질문, 피드백, 협업 제안 무엇이든 환영합니다.',
  alternates: { canonical: 'https://dechive.dev/contact' },
  openGraph: {
    title: 'Contact | Dechive',
    description: '질문, 피드백, 협업 제안 무엇이든 환영합니다.',
    url: 'https://dechive.dev/contact',
    images: [{ url: 'https://dechive.dev/images/thumb.webp', width: 1200, height: 630, alt: 'Contact Dechive' }],
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 min-h-[calc(100vh-64px-56px)]">
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-zinc-100">
        Contact
      </h1>
      <p className="mb-12 text-zinc-400">
        질문, 피드백, 협업 제안 무엇이든 환영해요.
      </p>

      <div className="flex flex-col gap-6">
        <a
          href="mailto:heavenis0113@gmail.com"
          className="group flex items-center gap-4 rounded-2xl border border-zinc-800 p-6 transition-all hover:border-zinc-600"
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
              Email
            </span>
            <span className="text-zinc-100 group-hover:underline group-hover:underline-offset-4">
              heavenis0113@gmail.com
            </span>
          </div>
        </a>
      </div>
    </main>
  );
}
