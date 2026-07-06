import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAiUpdateDayByDate,
  getAiUpdateDayStaticParams,
  type AiUpdateBriefingItem,
  type AiUpdateDay,
} from '@/data/aiUpdates';

const BASE_URL = 'https://dechive.dev';

interface PageProps {
  params: Promise<{
    date: string;
  }>;
}

function formatDisplayDate(date: string) {
  return date.replaceAll('-', '.');
}

function getDailyTitle(day: AiUpdateDay) {
  return day.title ?? `${formatDisplayDate(day.date)} AI Updates`;
}

function getDailySubtitle(day: AiUpdateDay) {
  return day.subtitle ?? '공식 문서 기준으로 확인한 오늘의 AI 업데이트 기록입니다.';
}

function getQuickSummary(day: AiUpdateDay) {
  if (day.quickSummary?.length) return day.quickSummary;

  return day.updates.slice(0, 3).map((update) => update.summary);
}

function toBriefingItem(update: AiUpdateDay['updates'][number]): AiUpdateBriefingItem {
  return {
    id: update.id,
    title: update.title,
    officialDate: '',
    checkedDateKST: '',
    sourceType: update.source.label,
    updateType: update.badges.slice(0, 2).join(' / ') || 'Official Update',
    badges: update.badges,
    summary: update.summary,
    whatChanged: update.whatChanged,
    whyItMatters: update.useCriteria,
    dechiveView: update.verificationNotes.join(' '),
    readerTakeaway: update.summary,
    screenMaterialStatus: update.image.caption,
    cautionNote: '이 항목은 공식 출처 기준으로 확인한 범위 안에서만 읽어야 합니다.',
  };
}

function getGroups(day: AiUpdateDay) {
  if (day.groups?.length) return day.groups;

  return [
    {
      name: 'Daily Briefing',
      intro: '이 날짜에 확인한 공식 문서 기반 AI 업데이트입니다.',
      updates: day.updates.map(toBriefingItem),
    },
  ];
}

export function generateStaticParams() {
  return getAiUpdateDayStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date } = await params;
  const day = getAiUpdateDayByDate(date);

  if (!day) return {};

  return {
    title: `${formatDisplayDate(date)} AI Updates`,
    description: getDailySubtitle(day),
    alternates: {
      canonical: `${BASE_URL}/ai-updates/${date}`,
    },
    openGraph: {
      title: `${formatDisplayDate(date)} AI Updates | Dechive`,
      description: getDailySubtitle(day),
      url: `${BASE_URL}/ai-updates/${date}`,
      siteName: 'Dechive',
      locale: 'ko_KR',
      type: 'article',
      images: [
        {
          url: `${BASE_URL}/images/thumb.webp`,
          width: 1200,
          height: 630,
          alt: `${formatDisplayDate(date)} AI Updates`,
        },
      ],
    },
  };
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-sm border border-[#bda77e]/45 bg-[#fbfaf7] px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#6d5634] uppercase">
      {label}
    </span>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-[#ded6c9] pt-5">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-[#9a7342] uppercase">
        {label}
      </p>
      <div className="mt-2 text-sm leading-7 text-[#50473f]">
        {children}
      </div>
    </div>
  );
}

function getUpdateMeta(update: AiUpdateBriefingItem) {
  return [
    update.reportDate ? `reportDate ${update.reportDate}` : '',
    update.officialDate ? `officialDate ${update.officialDate}` : '',
    update.checkedDateKST ? `Checked KST ${update.checkedDateKST}` : '',
    update.sourceType,
  ].filter(Boolean).join(' · ');
}

function UpdateCard({ update }: { update: AiUpdateBriefingItem }) {
  const sourceLinks = [update.officialSource, update.reportSource].filter(
    (source): source is NonNullable<typeof source> => Boolean(source)
  );

  return (
    <article id={update.id} className="border-t border-[#d8cdbd] py-9 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-[#9a7342] uppercase">
            {getUpdateMeta(update)}
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-header-serif)] text-2xl leading-tight font-medium text-[#2a211b] sm:text-3xl">
            {update.title}
          </h3>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5f564d]">
            {update.summary}
          </p>
        </div>
        <p className="shrink-0 text-xs font-semibold tracking-[0.14em] text-[#8a6a39] uppercase">
          {update.updateType}
        </p>
        {sourceLinks.length ? (
          <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
            {sourceLinks.map((source) => (
              <a
                key={`${source.label}-${source.url}`}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-xs font-semibold tracking-[0.12em] text-[#8a6a39] uppercase underline decoration-[#b08d57]/35 underline-offset-4 transition-colors hover:text-[#2a211b]"
              >
                {source.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {update.badges.map((badge) => (
          <Badge key={badge} label={badge} />
        ))}
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <Field label="무엇이 바뀌었나">
          <p>{update.whatChanged}</p>
        </Field>
        <Field label="왜 중요한가">
          <p>{update.whyItMatters}</p>
        </Field>
        <Field label="Dechive 해석">
          <p>{update.dechiveView}</p>
        </Field>
        <Field label="독자가 기억할 한 문장">
          <p>{update.readerTakeaway}</p>
        </Field>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="border border-[#ded6c9] bg-[#fbfaf7]/65 p-5">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#9a7342] uppercase">
            공식 화면/설명 자료
          </p>
          <p className="mt-3 text-sm leading-7 text-[#5f564d]">
            {update.screenMaterialStatus}
          </p>
        </div>
        <div className="border border-[#ded6c9] bg-[#f3efe7]/70 p-5">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#9a7342] uppercase">
            주의 문장
          </p>
          <p className="mt-3 text-sm leading-7 text-[#5f564d]">
            {update.cautionNote}
          </p>
        </div>
      </div>
    </article>
  );
}

export default async function AiUpdateDatePage({ params }: PageProps) {
  const { date } = await params;
  const day = getAiUpdateDayByDate(date);

  if (!day) notFound();

  const groups = getGroups(day);
  const quickSummary = getQuickSummary(day);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8f6f1] px-6 py-12 text-[#19140f] sm:px-8 lg:py-16">
      <article className="mx-auto max-w-6xl">
        <Link
          href="/ai-updates"
          className="text-xs font-semibold tracking-[0.16em] text-[#8a6a39] uppercase transition-colors hover:text-[#2a211b]"
        >
          ← AI-Update
        </Link>

        <header className="mt-8 border-b border-[#ded6c9] pb-10">
          <p className="text-xs font-semibold tracking-[0.24em] text-[#9a7342] uppercase">
            {formatDisplayDate(date)} AI Updates
          </p>
          {day.checkedDateKST ? (
            <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-[#8a6a39] uppercase">
              Checked {day.checkedDateKST} KST
            </p>
          ) : null}
          <h1 className="mt-4 max-w-4xl font-[family-name:var(--font-header-serif)] text-4xl leading-tight font-medium text-[#2a211b] sm:text-5xl">
            {getDailyTitle(day)}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#5f564d]">
            {getDailySubtitle(day)}
          </p>
        </header>

        {quickSummary.length ? (
          <section className="border-b border-[#ded6c9] py-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#9a7342] uppercase">
              Quick Summary
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {quickSummary.map((summary) => (
                <p key={summary} className="border-t border-[#d8cdbd] pt-4 text-sm leading-7 text-[#50473f]">
                  {summary}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        <section className="py-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#9a7342] uppercase">
            Update Groups
          </p>
          <div className="mt-6 space-y-14">
            {groups.map((group) => (
              <section key={group.name} className="bg-[#fbfaf7]/45 px-5 py-7 sm:px-7">
                <div className="border-b border-[#ded6c9] pb-6">
                  <h2 className="font-[family-name:var(--font-header-serif)] text-3xl font-medium text-[#2a211b]">
                    {group.name}
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f6257]">
                    {group.intro}
                  </p>
                </div>
                <div className="mt-8">
                  {group.updates.map((update) => (
                    <UpdateCard key={update.id} update={update} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="border-t border-[#ded6c9] py-8">
          <h2 className="font-[family-name:var(--font-header-serif)] text-2xl font-medium text-[#2a211b]">
            Today&rsquo;s Verification Note
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-[#5f564d]">
            {day.verificationNote ?? '이 날짜의 업데이트는 공식 출처로 확인된 범위 안에서만 기록합니다. 기능 출시, 문서 개정, 플랫폼 통합 여부를 구분해 읽어야 합니다.'}
          </p>
        </section>

        <section className="border-t border-[#ded6c9] pt-8">
          <p className="font-[family-name:var(--font-header-serif)] text-2xl leading-relaxed text-[#2a211b]">
            {day.closingLine ?? 'AI는 답을 만든다. Dechive는 그 답이 어디까지 검증 가능한지 기록한다.'}
          </p>
        </section>
      </article>
    </main>
  );
}
