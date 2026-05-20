import type { Metadata } from 'next';
import Image from 'next/image';

const DOWNLOAD_DESCRIPTION =
  'AI에 낯선 사람들이 AI를 제대로 이해할 수 있도록 정리한 무료 전자책입니다.';

export const metadata: Metadata = {
  title: 'AI가 낯선 사람들을 위한 AI 이해 가이드',
  description: DOWNLOAD_DESCRIPTION,
  alternates: {
    canonical: 'https://dechive.dev/downloads/parents-ai-guide',
  },
  openGraph: {
    title: 'AI가 낯선 사람들을 위한 AI 이해 가이드 | Dechive',
    description: DOWNLOAD_DESCRIPTION,
    url: 'https://dechive.dev/downloads/parents-ai-guide',
    siteName: 'Dechive',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://dechive.dev/downloads/parents-ai-guide-cover.webp',
        width: 1200,
        height: 630,
        alt: 'AI가 낯선 사람들을 위한 AI 이해 가이드',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI가 낯선 사람들을 위한 AI 이해 가이드 | Dechive',
    description: DOWNLOAD_DESCRIPTION,
    images: ['https://dechive.dev/downloads/parents-ai-guide-cover.webp'],
  },
};

const COVERS = [
  'AI가 왜 그럴듯하게 틀릴 수 있는지',
  '프롬프트 공식보다 중요한 것',
  'AI 부업·1인 기업·자동화 담론을 걸러서 보는 법',
  'AI 직원과 에이전트의 실제 의미',
  '개인정보, 목소리, 얼굴을 지키는 법',
  'AI 답변을 걸러서 믿는 체크리스트',
];

const AUDIENCE = [
  'AI를 처음 배우는 사람',
  'AI를 어디까지 믿어야 할지 헷갈리는 사람',
  'AI 부업 광고가 헷갈리는 사람',
  'AI를 무조건 믿지도, 무조건 거부하지도 않고 제대로 이해하고 싶은 사람',
];

function DownloadButton() {
  return (
    <a
      href="/downloads/dechive-parents-ai-guide-2026.pdf"
      target="_blank"
      rel="noopener noreferrer"
      download
      aria-label="AI가 낯선 사람들을 위한 AI 이해 가이드 PDF 무료 다운로드"
      className="inline-flex items-center gap-2 rounded-sm bg-[#2a211b] px-7 py-3.5 text-sm font-medium tracking-wide text-[#f8f6f1] transition-colors hover:bg-[#19140f]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      무료 PDF 다운로드
    </a>
  );
}

function Divider() {
  return (
    <div className="my-14 flex items-center gap-3">
      <div className="h-px flex-1 bg-[#9a7a3f]/20" />
      <span className="text-[10px] text-[#9a7a3f]/50">✦</span>
      <div className="h-px flex-1 bg-[#9a7a3f]/20" />
    </div>
  );
}

export default function ParentsAiGuidePage() {
  return (
    <main className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[#f8f6f1] text-[#19140f]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(176,141,87,0.07),transparent_50%)]" />

      <div className="relative mx-auto max-w-5xl px-6 py-16 sm:py-20">

        {/* Hero */}
        <section className="flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-16">
          <div className="flex flex-1 flex-col gap-6">
            <div>
              <p className="mb-3 text-xs font-medium tracking-[0.2em] text-[#9a7a3f] uppercase">
                Dechive · 무료 전자책
              </p>
              <h1 className="mb-3 font-[family-name:var(--font-header-serif)] text-4xl font-semibold leading-snug tracking-tight text-[#17120d] sm:text-5xl">
                AI가 낯선 사람들을 위한
                <br />
                AI 이해 가이드
              </h1>
              <p className="text-base leading-relaxed text-[#5f564d]">
                AI의 답을 무조건 믿지 않고,
                <br />
                무조건 밀어내지도 않는 법
              </p>
            </div>

            <p className="text-sm leading-loose text-[#5f564d]">
              AI 부업, 자동화, 프롬프트, 에이전트, 개인정보까지.
              <br />
              {DOWNLOAD_DESCRIPTION}
            </p>

            <div className="flex items-center gap-4">
              <DownloadButton />
              <span className="text-xs text-[#9a7a3f]/70">PDF · 무료</span>
            </div>
          </div>

          {/* Cover image */}
          <div className="w-full max-w-[220px] shrink-0 md:max-w-[240px]">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm border border-[#9a7a3f]/20 bg-[#efe7da]/60 shadow-[0_32px_64px_rgba(42,33,27,0.14)]">
              <Image
                src="/downloads/parents-ai-guide-cover.webp"
                alt="AI가 낯선 사람들을 위한 AI 이해 가이드 표지"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 220px, 240px"
                priority
              />
            </div>
          </div>
        </section>

        <Divider />

        {/* Why */}
        <section className="mx-auto max-w-2xl">
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-[#9a7a3f] uppercase">
            왜 만들었는지
          </p>
          <p className="text-lg leading-loose text-[#2a211b]">
            AI 부업 강의가 쏟아진다. 자동화로 월 1000만 원, 에이전트로 직원 대체, 프롬프트 공식만
            알면 끝. 이런 말들이 SNS와 유튜브를 가득 채우고 있다.
          </p>
          <p className="mt-5 text-sm leading-loose text-[#5f564d]">
            문제는, AI가 정말로 강력하다는 점이다. 그래서 과장이 더 그럴듯하게 들린다. AI를 써본
            적 없는 사람일수록 그 말들을 통째로 믿거나, 통째로 불신하게 된다.
          </p>
          <p className="mt-4 text-sm leading-loose text-[#5f564d]">
            이 책은 AI 부업 강의에 흔들리기 전에, AI를 걸러서 믿는 기준을 먼저 갖추기 위해
            만들었다. 어떻게 작동하는지, 어디서 틀리는지, 무엇을 조심해야 하는지. 빠른 답 대신
            판단할 수 있는 기준을 남기려 했다.
          </p>
        </section>

        <Divider />

        {/* What's covered */}
        <section>
          <p className="mb-2 text-xs font-medium tracking-[0.2em] text-[#9a7a3f] uppercase">
            이 책에서 다루는 것
          </p>
          <p className="mb-8 text-sm text-[#5f564d]">
            AI를 처음 접하는 분들이 가장 혼란스러워하는 질문들을 기준으로 정리했습니다.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {COVERS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-sm border border-[#9a7a3f]/18 bg-white/50 px-5 py-4"
              >
                <span className="mt-0.5 text-[#9a7a3f]" aria-hidden="true">
                  ✦
                </span>
                <span className="text-sm leading-relaxed text-[#2a211b]">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <Divider />

        {/* Who it's for */}
        <section>
          <p className="mb-2 text-xs font-medium tracking-[0.2em] text-[#9a7a3f] uppercase">
            이런 분께 추천합니다
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {AUDIENCE.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-sm border border-[#9a7a3f]/14 bg-[#efe7da]/50 px-5 py-4"
              >
                <span className="mt-0.5 shrink-0 text-[#9a7a3f]" aria-hidden="true">
                  —
                </span>
                <span className="text-sm leading-relaxed text-[#443a32]">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <Divider />

        {/* Testimonial */}
        <section className="mx-auto max-w-2xl">
          <blockquote className="rounded-sm border border-[#9a7a3f]/20 bg-white/50 px-7 py-6">
            <p className="text-sm leading-loose text-[#2a211b]">
              &ldquo;이 책은 AI를 무조건 두려워하거나 맹신하지 말고, 스스로 판단하며 걸러서 받아들이는
              힘을 길러야 한다는 메시지를 전달한 점이 인상 깊었습니다. 빠르게 발전하는 AI 시대에서는
              단순히 기술을 익히는 것보다, 정보를 직접 확인하고 비판적으로 생각하는 습관이 더
              중요하다는 내용이 특히 마음에 남았습니다.&rdquo;
            </p>
            <footer className="mt-4 text-xs text-[#9a7a3f]">— 10년차 풀스택 개발자 윤*현</footer>
          </blockquote>
        </section>

        {/* Bottom CTA */}
        <section className="mt-16 flex flex-col items-center gap-4 text-center">
          <div className="mx-auto mb-2 h-px w-16 bg-[#9a7a3f]/30" />
          <p className="text-xs font-medium tracking-[0.2em] text-[#9a7a3f] uppercase">
            무료로 읽기
          </p>
          <p className="text-sm text-[#5f564d]">PDF 파일로 바로 다운로드할 수 있습니다.</p>
          <DownloadButton />
        </section>
      </div>
    </main>
  );
}
