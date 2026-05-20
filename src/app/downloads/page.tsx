import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const DOWNLOADS_DESCRIPTION =
  'Dechive에서 만든 무료 전자책과 자료를 모아둔 다운로드 서가입니다.';

const downloads = [
  {
    title: 'AI가 낯선 사람들을 위한 AI 이해 가이드',
    description: 'AI에 낯선 사람들이 AI를 제대로 이해할 수 있도록 정리한 무료 전자책입니다.',
    href: '/downloads/parents-ai-guide',
    image: '/downloads/parents-ai-guide-cover.webp',
    meta: 'PDF · 무료 전자책',
  },
];

export const metadata: Metadata = {
  title: 'Downloads',
  description: DOWNLOADS_DESCRIPTION,
  alternates: {
    canonical: 'https://dechive.dev/downloads',
  },
  openGraph: {
    title: 'Downloads | Dechive',
    description: DOWNLOADS_DESCRIPTION,
    url: 'https://dechive.dev/downloads',
    siteName: 'Dechive',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://dechive.dev/images/thumb.webp',
        width: 1200,
        height: 630,
        alt: 'Dechive Downloads',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Downloads | Dechive',
    description: DOWNLOADS_DESCRIPTION,
    images: ['https://dechive.dev/images/thumb.webp'],
  },
};

export default function DownloadsPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8f6f1] px-6 py-16 text-[#19140f] sm:px-8 lg:py-20">
      <section className="mx-auto max-w-5xl">
        <div className="border-b border-[#ded6c9] pb-10">
          <p className="text-xs font-medium tracking-[0.24em] text-[#9a7a3f] uppercase">
            Dechive Downloads
          </p>
          <h1 className="mt-5 font-[family-name:var(--font-header-serif)] text-4xl font-medium text-[#2a211b] sm:text-5xl">
            무료 자료 서가
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6f6257]">
            Dechive에서 만든 전자책과 자료를 모아둡니다.
            <br className="hidden sm:block" />
            AI 시대의 답을 더 천천히 이해하고 검증하기 위한 다운로드 공간입니다.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {downloads.map((download) => (
            <Link
              key={download.href}
              href={download.href}
              className="group grid overflow-hidden rounded-md border border-[#d8c9b0] bg-[#fbfaf7] shadow-[0_18px_60px_rgba(42,33,27,0.06)] transition-colors hover:border-[#b08d57]/70 sm:grid-cols-[10rem_1fr]"
            >
              <div className="relative min-h-64 bg-[#efe7da] sm:min-h-0">
                <Image
                  src={download.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 160px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-col justify-between p-6">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-[#9a7a3f] uppercase">
                    {download.meta}
                  </p>
                  <h2 className="mt-4 font-[family-name:var(--font-header-serif)] text-2xl font-medium leading-snug text-[#2a211b]">
                    {download.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#6f6257]">
                    {download.description}
                  </p>
                </div>
                <span className="mt-7 text-sm font-semibold text-[#7a5d2c] transition-colors group-hover:text-[#17120d]">
                  무료 전자책 보기
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
