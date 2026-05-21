import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export interface DeepDivePost {
  slug: string;
  title: string;
  meta: string;
  description: string;
  image: string;
  tags: string[];
}

interface DeepDiveLandingProps {
  basePath: string;
  deepDives: DeepDivePost[];
  serifFontClassName: string;
  sansFontClassName: string;
}

const keywords = ['Agile', 'Prompt', 'React', 'SQL', 'Next.js', 'GA4', 'Testing', 'Product'];

const fallbackDeepDives: DeepDivePost[] = [
  {
    slug: 'ai-era-agile-verification',
    title: 'Agile은 속도가 아니라 방향을 검증하는 방식이다',
    meta: 'Product · Agile',
    description: 'AI가 구현 속도를 높이는 시대에도 Agile이 왜 필요한지, 방향 검증의 방식으로 정리합니다.',
    image: '/images/posts/ai-era-agile-cover.webp',
    tags: ['Agile', 'AI', 'Verification'],
  },
];

export default function DeepDiveLanding({
  basePath,
  deepDives,
  serifFontClassName,
  sansFontClassName,
}: DeepDiveLandingProps) {
  const isEnglish = basePath.startsWith('/en');
  const visibleDeepDives = deepDives.length > 0 ? deepDives : fallbackDeepDives;
  const featuredDeepDive = visibleDeepDives[0];
  const copy = isEnglish
    ? {
        guideTitle: 'Verification Guide',
        guideBody: 'Use this space to follow the question.\nDeep Dive keeps concepts, examples, limits, and verification criteria together.',
        guideAction: 'Check the record',
        leadTitle: 'Documents that carry one deep question to the end.',
        leadBody: 'Deep Dive follows a deeper question through concepts, examples, mistakes, limits, and verification criteria.',
        read: 'Read Deep Dive',
        all: 'All Deep Dives',
        sort: 'Latest',
        fallbackTags: ['Concept', 'Example', 'Verification'],
      }
    : {
        guideTitle: '검증 안내',
        guideBody: '이 공간은 깊은 질문을 끝까지 따라갑니다.\n개념, 예시, 한계, 검증 기준을 하나의 기록 안에서 확인합니다.',
        guideAction: '기록 확인하기',
        leadTitle: '하나의 깊은 질문을 끝까지 밀고 가는 문서들.',
        leadBody: 'Deep Dive는 심층적인 질문을 따라 개념, 예시, 실수, 한계, 검증 기준까지 길게 정리합니다.',
        read: 'Read Deep Dive',
        all: 'All Deep Dives',
        sort: '최신순',
        fallbackTags: ['개념', '예시', '검증 기준'],
      };
  const featuredTags = featuredDeepDive.tags.length > 0
    ? featuredDeepDive.tags
    : copy.fallbackTags;

  return (
    <section className={`flex min-h-[calc(100vh-5rem)] flex-1 bg-[#f8f6f1] text-[#17120d] ${sansFontClassName}`}>
      <div className="grid min-h-[calc(100vh-5rem)] w-full lg:grid-cols-[15.5rem_1fr] xl:grid-cols-[17rem_1fr]">
        <aside className="hidden border-r border-[#ded6c9] bg-[#f2eee6]/70 px-6 pt-12 pb-12 sm:px-7 lg:block lg:px-8">
          <div className="sticky top-28">
            <p className={`text-sm font-semibold tracking-[0.08em] text-[#8a6332] uppercase ${serifFontClassName}`}>
              Deep Dive
            </p>

            <div className="mt-8 flex w-14 items-center gap-1.5">
              <span className="h-px flex-1 bg-[#b08d57]/70" />
              <span className="h-1.5 w-1.5 rotate-45 border border-[#b08d57]/80" />
              <span className="h-px flex-1 bg-[#b08d57]/70" />
            </div>

            <div className="mt-10">
              <p className={`text-base font-semibold tracking-[0.06em] text-[#17120d] uppercase ${serifFontClassName}`}>
                Keywords
              </p>
              <div className="mt-6 flex flex-col gap-5">
                {keywords.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    className="w-fit text-left text-[15px] leading-none text-[#4b4036] transition-colors hover:text-[#8a6332]"
                  >
                    <span className="text-[#8a6332]">#</span> {keyword}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-20 rounded-md border border-[#d5c5aa] bg-[#f8f6f1]/70 p-5 shadow-[0_18px_60px_rgba(42,33,27,0.06)]">
              <ShieldCheck size={29} strokeWidth={1.2} className="text-[#9a7340]" />
              <p className={`mt-5 text-sm font-semibold tracking-[0.08em] text-[#8a6332] uppercase ${serifFontClassName}`}>
                {copy.guideTitle}
              </p>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#4b4036]">
                {copy.guideBody}
              </p>
              <button
                type="button"
                className={`mt-6 inline-flex items-center gap-3 text-sm text-[#8a6332] transition-colors hover:text-[#17120d] ${serifFontClassName}`}
              >
                {copy.guideAction}
                <ArrowRight size={18} strokeWidth={1.4} />
              </button>
            </div>
          </div>
        </aside>

        <div className="px-6 py-10 sm:px-8 lg:px-14 lg:py-16 xl:px-20">
          <div className="mx-auto max-w-6xl">
            <div className="border-b border-[#ded6c9] pb-10">
              <p className={`max-w-2xl text-2xl leading-snug text-[#2b2119] ${serifFontClassName}`}>
                {copy.leadTitle}
              </p>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6f6257]">
                {copy.leadBody}
              </p>
            </div>

            <article className="group relative mt-10 overflow-hidden rounded-md border border-[#d8c9b0] bg-[#17120d] shadow-[0_28px_90px_rgba(42,33,27,0.18)]">
              <div className="relative min-h-[25rem]">
                <Image
                  src={featuredDeepDive.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 75vw, 100vw"
                  className="object-cover object-center opacity-85 transition-transform duration-700 group-hover:scale-[1.02]"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-r from-[#120c08]/90 via-[#120c08]/54 to-[#120c08]/14" />
                <div className="absolute inset-0 bg-linear-to-t from-[#120c08]/62 via-transparent to-transparent" />

                <div className="relative z-10 flex min-h-[25rem] max-w-2xl flex-col justify-center px-7 py-10 text-[#f8f6f1] sm:px-10">
                  <p className="text-xs font-medium tracking-[0.12em] text-[#e2c47b] uppercase">
                    {featuredDeepDive.meta}
                  </p>
                  <h2 className={`mt-7 text-4xl leading-snug font-medium tracking-[-0.04em] md:text-5xl ${serifFontClassName}`}>
                    {featuredDeepDive.title}
                  </h2>
                  <p className="mt-7 max-w-lg text-base leading-8 text-[#f1eadf]/86">
                    {featuredDeepDive.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {featuredTags.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-[#f8f6f1]/18 px-3 py-1 text-sm text-[#f8f6f1]/86"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`${basePath}/${featuredDeepDive.slug}`}
                    className={`mt-8 inline-flex w-fit items-center gap-8 rounded-sm bg-[#9a6b2e] px-6 py-3 text-lg text-white transition-colors hover:bg-[#7f5421] ${serifFontClassName}`}
                  >
                    {copy.read}
                    <ArrowRight size={22} strokeWidth={1.4} />
                  </Link>
                </div>
              </div>
            </article>

            <section className="mt-10" aria-labelledby="all-deep-dives-heading">
              <div className="flex items-center gap-7">
                <h2
                  id="all-deep-dives-heading"
                  className={`shrink-0 text-xl font-medium text-[#17120d] ${serifFontClassName}`}
                >
                  {copy.all}
                </h2>
                <span className="h-px flex-1 bg-[#d8c9b0]" />
                <button type="button" className="shrink-0 text-sm text-[#4b4036] transition-colors hover:text-[#8a6332]">
                  {copy.sort}
                </button>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {visibleDeepDives.map((deepDive) => (
                  <Link
                    key={deepDive.title}
                    href={`${basePath}/${deepDive.slug}`}
                    className="group overflow-hidden rounded-md border border-[#ded6c9] bg-[#fbfaf7] shadow-[0_16px_50px_rgba(42,33,27,0.06)] transition-colors hover:border-[#b08d57]/55"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#e8e1d6]">
                      <Image
                        src={deepDive.image}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 18vw, (min-width: 768px) 40vw, 100vw"
                        className="object-cover object-center sepia-[0.18] transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-[#f8f6f1]/12" />
                    </div>
                    <div className="p-5">
                      <p className="text-[11px] font-medium tracking-[0.12em] text-[#6f6257] uppercase">
                        {deepDive.meta}
                      </p>
                      <h3 className={`mt-3 text-xl leading-snug font-medium text-[#17120d] ${serifFontClassName}`}>
                        {deepDive.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[#6f6257]">
                        {deepDive.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
