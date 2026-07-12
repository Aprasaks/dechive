import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, CalendarDays, ExternalLink, ShieldCheck } from 'lucide-react';
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

function cleanDateLabel(value?: string) {
  if (!value) return '';

  return value
    .replace('officialDate', '')
    .replace('reportDate', '')
    .replace('기준 흐름', '')
    .replace('보도일', '')
    .replace('확인 기준', '')
    .trim();
}

function getDailyTitle(day: AiUpdateDay) {
  return day.title ?? `${formatDisplayDate(day.date)} AI Updates`;
}

function getDailySubtitle(day: AiUpdateDay) {
  return day.subtitle ?? '공식 출처 날짜를 확인한 뒤 다음날 KST에 기록한 AI 변화 카드입니다.';
}

function getQuickSummary(day: AiUpdateDay) {
  if (day.quickSummary?.length) return day.quickSummary;

  return day.updates.slice(0, 3).map((update) => update.summary);
}

function toBriefingItem(update: AiUpdateDay['updates'][number], day: AiUpdateDay): AiUpdateBriefingItem {
  return {
    id: update.id,
    title: update.title,
    officialDate: formatDisplayDate(day.date),
    checkedDateKST: day.checkedDateKST ?? formatDisplayDate(day.date),
    sourceType: update.source.label,
    officialSource: {
      label: update.source.label,
      url: update.source.url,
    },
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

function getUpdates(day: AiUpdateDay) {
  if (day.groups?.length) return day.groups.flatMap((group) => group.updates);

  return day.updates.map((update) => toBriefingItem(update, day));
}

function getSource(update: AiUpdateBriefingItem) {
  return update.officialSource ?? update.reportSource ?? null;
}

function getOfficialDate(day: AiUpdateDay, update?: AiUpdateBriefingItem) {
  return cleanDateLabel(update?.officialDate ?? update?.reportDate) || formatDisplayDate(day.date);
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
    <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[11px] text-[#e8dfcd]/58">
      {label}
    </span>
  );
}

function SlideCard({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <section className="flex aspect-[4/5] min-h-[17rem] flex-col rounded-md border border-white/10 bg-[#080808]/86 p-5">
      <p className="text-[10px] font-semibold tracking-[0.22em] text-white/38 uppercase">
        {label}
      </p>
      <h4 className="mt-5 font-[family-name:var(--font-header-serif)] text-2xl leading-tight text-white">
        {title}
      </h4>
      <p className="mt-auto text-sm leading-7 text-[#e8dfcd]/66">
        {body}
      </p>
    </section>
  );
}

function UpdateStory({ day, update }: { day: AiUpdateDay; update: AiUpdateBriefingItem }) {
  const source = getSource(update);
  const officialDate = getOfficialDate(day, update);
  const recordedDate = update.checkedDateKST ?? day.checkedDateKST ?? formatDisplayDate(day.date);

  return (
    <article id={update.id} className="scroll-mt-28 border-t border-white/10 py-10 first:border-t-0 first:pt-0">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[#d7ad73]/18 bg-[#d7ad73]/8 px-3 py-1.5 text-[11px] text-[#f6d29b]/78">
              Official {officialDate}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] text-[#e8dfcd]/58">
              Recorded {recordedDate} KST
            </span>
          </div>
          <h2 className="mt-5 max-w-4xl font-[family-name:var(--font-header-serif)] text-3xl leading-tight font-medium text-white sm:text-4xl">
            {update.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#e8dfcd]/64 sm:text-base sm:leading-8">
            {update.summary}
          </p>
        </div>

        <aside className="rounded-md border border-white/10 bg-[#080808]/86 p-5">
          <p className="text-[10px] font-semibold tracking-[0.22em] text-white/38 uppercase">
            Source
          </p>
          <p className="mt-3 text-sm leading-6 text-[#e8dfcd]/64">
            {source?.label ?? update.sourceType}
          </p>
          {source ? (
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#f6d29b]/72 uppercase transition-colors hover:text-[#f6d29b]"
            >
              Open source
              <ExternalLink size={13} strokeWidth={1.7} />
            </a>
          ) : null}
        </aside>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SlideCard label="Card 01" title="What changed?" body={update.whatChanged} />
        <SlideCard label="Card 02" title="Why it matters" body={update.whyItMatters} />
        <SlideCard label="Card 03" title="What to verify" body={update.cautionNote} />
        <SlideCard label="Card 04" title="Dechive note" body={update.dechiveView || update.readerTakeaway} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {update.badges.slice(0, 6).map((badge) => (
          <Badge key={badge} label={badge} />
        ))}
      </div>
    </article>
  );
}

export default async function AiUpdateDatePage({ params }: PageProps) {
  const { date } = await params;
  const day = getAiUpdateDayByDate(date);

  if (!day) notFound();

  const updates = getUpdates(day);
  const quickSummary = getQuickSummary(day);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#030303] text-[#f3eadb]">
      <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link
          href="/ai-updates"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#e8dfcd]/52 uppercase transition-colors hover:text-[#f6d29b]"
        >
          <ArrowLeft size={14} strokeWidth={1.7} />
          AI Update
        </Link>

        <header className="mt-8 grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
              Official {formatDisplayDate(day.date)}
            </p>
            <h1 className="mt-5 max-w-4xl font-[family-name:var(--font-header-serif)] text-4xl leading-tight font-medium text-white sm:text-5xl">
              {getDailyTitle(day)}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#e8dfcd]/64">
              {getDailySubtitle(day)}
            </p>
          </div>

          <aside className="rounded-md border border-white/10 bg-[#080808]/86 p-5">
            <div className="flex items-start gap-4">
              <CalendarDays size={22} strokeWidth={1.6} className="mt-1 text-[#f6d29b]/78" />
              <div>
                <p className="font-[family-name:var(--font-header-serif)] text-xl text-white">
                  Recorded {day.checkedDateKST ?? formatDisplayDate(day.date)} KST
                </p>
                <p className="mt-2 text-sm leading-7 text-[#e8dfcd]/62">
                  공식 출처 날짜를 기준으로 다음날 한국 시간에 확인한 기록입니다.
                </p>
              </div>
            </div>
          </aside>
        </header>

        {quickSummary.length ? (
          <section className="border-b border-white/10 py-8">
            <p className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
              <ShieldCheck size={14} strokeWidth={1.7} />
              Briefing notes
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {quickSummary.slice(0, 3).map((summary) => (
                <p key={summary} className="rounded-md border border-white/10 bg-[#080808]/72 p-4 text-sm leading-7 text-[#e8dfcd]/64">
                  {summary}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        <section className="py-10">
          <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-4">
            <p className="text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
              Change cards
            </p>
            <p className="text-sm text-[#e8dfcd]/46">{updates.length} changes</p>
          </div>

          {updates.map((update) => (
            <UpdateStory key={update.id} day={day} update={update} />
          ))}
        </section>

        <section className="border-t border-white/10 py-8">
          <h2 className="font-[family-name:var(--font-header-serif)] text-2xl font-medium text-white">
            Verification note
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-8 text-[#e8dfcd]/64">
            {day.verificationNote ?? '이 날짜의 업데이트는 공식 출처로 확인된 범위 안에서만 기록합니다. 기능 출시, 문서 개정, 플랫폼 통합 여부를 구분해 읽어야 합니다.'}
          </p>
        </section>

        <section className="border-t border-white/10 pt-8">
          <p className="font-[family-name:var(--font-header-serif)] text-2xl leading-relaxed text-white">
            {day.closingLine ?? 'AI는 답을 만든다. Dechive는 그 답이 어디까지 검증 가능한지 기록한다.'}
          </p>
          <Link
            href="/ai-updates"
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#f6d29b]/72 uppercase transition-colors hover:text-[#f6d29b]"
          >
            Back to change cards
            <ArrowUpRight size={14} strokeWidth={1.7} />
          </Link>
        </section>
      </article>
    </main>
  );
}
