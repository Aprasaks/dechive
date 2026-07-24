import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  FileText,
  FlaskConical,
  GraduationCap,
  Tablet,
} from 'lucide-react';

export type LatestRecord = {
  category: 'Knowledge' | 'Lecture' | 'Practice' | 'Books';
  title: string;
  publishedAt: string;
  href: string;
  indexHref: string;
};

const publicAreas = [
  {
    title: 'Knowledge',
    description: '이해한 내용을 지식으로 정리합니다.',
    linkLabel: '지식 살펴보기',
    href: '/knowledge',
    icon: BookOpen,
  },
  {
    title: 'Lecture',
    description: '설명할 수 있는 구조로 다시 구성합니다.',
    linkLabel: '강의 살펴보기',
    href: '/lecture',
    icon: GraduationCap,
  },
  {
    title: 'Practice',
    description: '직접 실행하고 결과를 기록합니다.',
    linkLabel: '실습 살펴보기',
    href: '/practice',
    icon: FlaskConical,
  },
  {
    title: 'Books',
    description: '축적된 지식을 한 권으로 엮습니다.',
    linkLabel: '전자책 살펴보기',
    href: '/books',
    icon: Tablet,
  },
] as const;

const formatDate = (value: string) => {
  const parsed = new Date(value);
  return `${parsed.getFullYear()}.${String(parsed.getMonth() + 1).padStart(2, '0')}.${String(parsed.getDate()).padStart(2, '0')}`;
};

export function HomeSections({ latestRecord }: { latestRecord: LatestRecord | null }) {
  return (
    <>
      <section
        className="relative isolate min-h-[31rem] overflow-hidden bg-[#f5eee4] sm:min-h-[40rem] lg:min-h-[clamp(42rem,78svh,52rem)]"
        aria-labelledby="home-title"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/dechive-hero-workspace.webp"
            alt="Dechive에서 지식을 정리하고 검증하는 작업 공간"
            fill
            priority
            sizes="100vw"
            className="object-contain object-bottom md:object-contain md:object-bottom lg:object-cover lg:object-center"
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#f8f2e9]/95 via-[#f8f2e9]/80 to-[#f8f2e9]/20 md:bg-gradient-to-r md:from-[#f8f2e9]/82 md:via-[#f8f2e9]/50 md:to-transparent lg:via-[#f8f2e9]/45"
          aria-hidden="true"
        />
        <div className="page-shell relative z-10 flex min-h-[31rem] items-start pt-32 pb-14 sm:min-h-[40rem] sm:pt-36 sm:pb-16 lg:min-h-[clamp(42rem,78svh,52rem)] lg:items-center lg:pt-28 lg:pb-12">
          <div className="max-w-[35rem]">
            <p className="text-accent text-xs font-semibold tracking-[.18em] uppercase">
              AI verification archive
            </p>
            <h1
              id="home-title"
              className="mt-5 font-serif text-[clamp(2.375rem,3.4vw,3.5rem)] leading-[1.2] font-medium tracking-[-.02em]"
            >
              AI creates answers.
              <br />
              Humans verify them.
            </h1>
            <p className="mt-6 max-w-[33rem] text-[0.9375rem] leading-7 text-foreground/80 sm:text-base sm:leading-8">
              Dechive는 사람이 이해하고 검증한 내용을
              <br className="hidden sm:block" /> 지식과 기록으로 다시 설명하는 아카이브입니다.
            </p>
          </div>
        </div>
      </section>

      <section className="page-shell py-14 sm:py-16" aria-labelledby="latest-record-title">
        <h2 id="latest-record-title" className="text-accent text-xs font-semibold tracking-[.18em] uppercase">
          Latest record
        </h2>
        {latestRecord ? (
          <article className="mt-4 flex flex-col gap-5 rounded-lg border border-border bg-surface-elevated px-6 py-5 sm:flex-row sm:items-center sm:gap-6">
            <FileText className="text-accent-warm hidden shrink-0 sm:block" size={22} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-accent-warm text-xs font-semibold tracking-[.04em]">{latestRecord.category}</p>
              <div className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="text-base font-medium tracking-[-.015em] sm:text-lg">
                  <Link href={latestRecord.href} className="hover:text-accent transition-colors">
                    {latestRecord.title}
                  </Link>
                </h3>
                <time className="text-sm tabular-nums text-muted-foreground" dateTime={latestRecord.publishedAt}>
                  {formatDate(latestRecord.publishedAt)}
                </time>
              </div>
            </div>
            <Link
              href={latestRecord.indexHref}
              className="text-accent group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium hover:text-accent-hover"
            >
              모든 기록 보기
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" size={15} aria-hidden="true" />
            </Link>
          </article>
        ) : (
          <p className="mt-4 rounded-lg border border-border bg-surface-elevated px-6 py-5 text-sm leading-7 text-secondary-foreground">
            아직 발행된 기록이 없습니다. 첫 기록을 준비하고 있습니다.
          </p>
        )}
      </section>

      <section className="page-shell pb-16 sm:pb-20" aria-label="콘텐츠 영역 바로가기">
        <ul className="grid gap-y-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-0 lg:divide-x lg:divide-border-subtle">
          {publicAreas.map(({ title, description, linkLabel, href, icon: Icon }) => (
            <li key={href} className="lg:px-8 lg:first:pl-0 lg:last:pr-0">
              <Icon className="text-accent" size={22} aria-hidden="true" strokeWidth={1.6} />
              <h3 className="mt-4 font-semibold tracking-[-.01em]">{title}</h3>
              <p className="mt-2 max-w-[11rem] text-sm leading-6 text-secondary-foreground">{description}</p>
              <Link
                href={href}
                className="text-accent group mt-4 inline-flex items-center gap-1.5 text-sm font-medium hover:text-accent-hover"
              >
                {linkLabel}
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" size={15} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

    </>
  );
}
