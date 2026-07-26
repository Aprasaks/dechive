import Image from 'next/image';
import Link from 'next/link';
import {
  FileText,
} from 'lucide-react';

export type FeaturedKnowledge = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  hero: {
    publicUrl: string;
    alt: string;
    width: number | null;
    height: number | null;
  } | null;
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  return `${parsed.getFullYear()}.${String(parsed.getMonth() + 1).padStart(2, '0')}.${String(parsed.getDate()).padStart(2, '0')}`;
};

export function HomeSections({
  featuredKnowledge,
}: {
  featuredKnowledge: FeaturedKnowledge | null;
}) {
  return (
    <section className="page-shell py-5 sm:py-7 lg:py-5" aria-label="Dechive 소개와 공개 기록">
      <div className="grid gap-10 md:grid-cols-12 md:gap-6 lg:items-center lg:gap-6">
        <div className="hidden lg:col-span-3 lg:flex lg:items-center lg:justify-center">
          <h1 className="max-w-[18rem] font-serif text-[clamp(1.7rem,2.25vw,2.25rem)] font-medium leading-[1.5] tracking-[.01em] text-foreground">
            배우고, 확인하고
            <br />
            다시 설명하는
            <br />
            AI 지식 플랫폼
          </h1>
        </div>

        <div className="min-w-0 md:col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 lg:grid-cols-[3.5rem_minmax(0,1fr)]">
            <div className="relative hidden items-start justify-center lg:flex" aria-hidden="true">
              <span className="absolute inset-y-2 w-px bg-border-subtle" />
              <span className="relative z-10 bg-background px-1 font-serif text-sm text-secondary-foreground">01</span>
            </div>
            {featuredKnowledge ? (
              <Link
                href={`/knowledge/${featuredKnowledge.slug}`}
                className="group block min-w-0 border-b border-border pb-7 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 lg:pb-8"
              >
                <article className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(13rem,15rem)] lg:items-center lg:gap-8">
                  <div className="flex min-w-0 flex-col justify-center">
                    <p className="text-accent text-xs font-semibold tracking-[.18em] uppercase">Knowledge</p>
                    <span className="mt-3 block h-px w-7 bg-accent" aria-hidden="true" />
                    <h2 className="mt-8 font-serif text-3xl font-medium leading-[1.35] tracking-[-.04em] group-hover:text-accent sm:text-4xl lg:mt-7 lg:text-[2rem]">
                      {featuredKnowledge.title}
                    </h2>
                    <p className="mt-6 max-w-[32rem] font-serif text-base leading-8 text-secondary-foreground sm:text-lg lg:mt-5 lg:text-sm lg:leading-7">
                      {featuredKnowledge.summary}
                    </p>
                    <p className="mt-7 text-sm text-secondary-foreground lg:mt-8 lg:text-xs">
                      <time dateTime={featuredKnowledge.publishedAt}>{formatDate(featuredKnowledge.publishedAt)}</time>
                    </p>
                  </div>
                  <div className="aspect-[2/1] overflow-hidden bg-[#eee8de]">
                    {featuredKnowledge.hero ? (
                      <Image
                        src={featuredKnowledge.hero.publicUrl}
                        alt={featuredKnowledge.hero.alt}
                        width={featuredKnowledge.hero.width ?? 800}
                        height={featuredKnowledge.hero.height ?? 400}
                        unoptimized
                        priority
                        loading="eager"
                        decoding="async"
                        sizes="(max-width: 48rem) 100vw, 15rem"
                        className="block h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src="/images/dechive-home-hero.webp"
                        alt="Dechive의 지식 검증 작업 공간"
                        width={1280}
                        height={720}
                        priority
                        className="block h-full w-full object-cover"
                      />
                    )}
                  </div>
                </article>
              </Link>
            ) : (
              <div className="grid gap-7 border-b border-border pb-7 lg:grid-cols-[minmax(0,1fr)_minmax(13rem,15rem)] lg:items-center lg:gap-8">
                <div>
                  <p className="text-accent text-xs font-semibold tracking-[.18em] uppercase">Knowledge</p>
                  <span className="mt-3 block h-px w-7 bg-accent" aria-hidden="true" />
                  <h2 className="mt-7 font-serif text-3xl font-medium tracking-[-.03em]">첫 번째 지식을 준비하고 있습니다.</h2>
                  <p className="mt-4 font-serif text-base leading-8 text-secondary-foreground">이해하고 검증한 개념을 곧 공유할게요.</p>
                </div>
                <Image
                  src="/images/dechive-home-hero.webp"
                  alt="Dechive의 지식 검증 작업 공간"
                  width={1280}
                  height={720}
                  priority
                  className="block aspect-[2/1] h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 border-b border-border py-6 lg:grid-cols-[3.5rem_minmax(0,1fr)] lg:py-7">
            <div className="relative hidden justify-center lg:flex" aria-hidden="true">
              <span className="absolute inset-y-0 w-px bg-border-subtle" />
              <span className="relative z-10 bg-background px-1 font-serif text-sm text-secondary-foreground">02</span>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)] lg:gap-8">
              <div className="flex items-start gap-5">
                <div className="hidden border-r border-border-subtle pr-5 lg:block">
                  <p className="text-accent text-xs font-semibold tracking-[.18em] uppercase">Lecture</p>
                  <span className="mt-3 block h-px w-6 bg-accent" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-accent text-xs font-semibold tracking-[.18em] uppercase lg:hidden">Lecture</p>
                  <h2 id="lecture-block-title" className="mt-2 font-serif text-2xl font-medium tracking-[-.03em] sm:text-3xl lg:mt-0 lg:text-xl">
                    강의 콘텐츠를 준비하고 있습니다.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-secondary-foreground">Knowledge를 설명과 학습의 순서로 다시 구성할 예정입니다.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 border-b border-border py-5 lg:grid-cols-[3.5rem_minmax(0,1fr)] lg:py-4">
            <div className="relative hidden justify-center lg:flex" aria-hidden="true">
              <span className="absolute inset-y-0 w-px bg-border-subtle" />
              <span className="relative z-10 bg-background px-1 font-serif text-sm text-secondary-foreground">03</span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:gap-8">
              <p className="text-accent-warm shrink-0 text-xs font-semibold tracking-[.18em] uppercase">AI Update</p>
              <span className="hidden h-8 w-px bg-border-subtle sm:block" aria-hidden="true" />
              <h2 id="update-block-title" className="font-serif text-xl font-medium tracking-[-.025em] lg:text-lg">새로운 AI 변화를 정리하고 있습니다.</h2>
              <FileText className="hidden text-secondary-foreground sm:ml-auto sm:block" size={25} strokeWidth={1.2} aria-hidden="true" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 pt-6 sm:grid-cols-2 lg:grid-cols-[3.5rem_minmax(0,1fr)_3.5rem_minmax(0,1fr)] lg:gap-0 lg:pt-6">
            <div className="relative hidden justify-center lg:flex" aria-hidden="true">
              <span className="absolute inset-y-0 w-px bg-border-subtle" />
              <span className="relative z-10 bg-background px-1 font-serif text-sm text-secondary-foreground">04</span>
            </div>
            <div className="border-b border-border pb-7 lg:pr-8 lg:pb-0">
              <p className="text-accent text-xs font-semibold tracking-[.18em] uppercase">Practice</p>
              <span className="mt-3 block h-px w-6 bg-accent" aria-hidden="true" />
              <h2 id="practice-block-title" className="mt-5 font-serif text-xl font-medium leading-[1.4] tracking-[-.03em] lg:text-lg">직접 만들어보는 실습을 준비하고 있습니다.</h2>
              <p className="mt-4 text-sm leading-6 text-secondary-foreground">배운 개념을 직접 실행하고 결과를 기록할 예정입니다.</p>
            </div>

            <div className="relative hidden justify-center lg:flex" aria-hidden="true">
              <span className="absolute inset-y-0 w-px bg-border-subtle" />
              <span className="relative z-10 bg-background px-1 font-serif text-sm text-secondary-foreground">05</span>
            </div>
            <Link
              href="/books"
              className="group grid min-w-0 grid-cols-[minmax(0,1fr)_5rem] border-b border-border pb-7 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 sm:grid-cols-[minmax(0,1fr)_8rem] lg:pl-8 lg:pb-0"
            >
              <div className="min-w-0">
                <p className="text-accent-warm text-xs font-semibold tracking-[.18em] uppercase">Books</p>
                <span className="mt-3 block h-px w-6 bg-accent-warm" aria-hidden="true" />
                <h2 className="mt-5 font-serif text-xl font-medium leading-[1.4] tracking-[-.03em] group-hover:text-accent lg:text-lg">만들기 전에 검증하라</h2>
                <p className="mt-4 text-sm leading-6 text-secondary-foreground">바이브코딩, 1인창업, AI SaaS의 착각들</p>
                <p className="mt-4 text-xs text-secondary-foreground">
                  출간 <time dateTime="2025-05-26">2025.05.26</time> · 154쪽
                </p>
              </div>
              <div className="ml-3 flex min-h-[10rem] items-center justify-center overflow-hidden bg-[#e7e8e9] sm:ml-5">
                <Image
                  src="/images/books/book-1.webp"
                  alt="만들기 전에 검증하라 책 표지"
                  width={215}
                  height={306}
                  loading="lazy"
                  decoding="async"
                  className="block h-full w-full object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
