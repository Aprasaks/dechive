'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, CheckCircle2, ExternalLink } from 'lucide-react';
import type { AiUpdateBriefingItem, AiUpdateDay, AiUpdateItem } from '@/data/aiUpdates';

interface AiUpdatesClientProps {
  month: string;
  days: AiUpdateDay[];
}

type ChangeRecord = {
  id: string;
  title: string;
  summary: string;
  sourceLabel: string;
  sourceUrl?: string;
  sourceType: string;
  officialDate: string;
  recordedDate: string;
  href: string;
  badges: string[];
};

const VISIBLE_CHANGE_LIMIT = 9;

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

function getSourceFromBriefing(update: AiUpdateBriefingItem) {
  return update.officialSource ?? update.reportSource ?? null;
}

function fromBriefingItem(day: AiUpdateDay, update: AiUpdateBriefingItem): ChangeRecord {
  const source = getSourceFromBriefing(update);
  const officialDate = cleanDateLabel(update.officialDate ?? update.reportDate) || formatDisplayDate(day.date);

  return {
    id: `${day.date}-${update.id}`,
    title: update.title,
    summary: update.summary,
    sourceLabel: source?.label ?? update.sourceType,
    sourceUrl: source?.url,
    sourceType: update.sourceType,
    officialDate,
    recordedDate: update.checkedDateKST ?? day.checkedDateKST ?? formatDisplayDate(day.date),
    href: `/ai-updates/${day.date}#${update.id}`,
    badges: update.badges.slice(0, 3),
  };
}

function fromLegacyItem(day: AiUpdateDay, update: AiUpdateItem): ChangeRecord {
  return {
    id: `${day.date}-${update.id}`,
    title: update.title,
    summary: update.summary,
    sourceLabel: update.source.label,
    sourceUrl: update.source.url,
    sourceType: update.source.description,
    officialDate: formatDisplayDate(day.date),
    recordedDate: day.checkedDateKST ?? formatDisplayDate(day.date),
    href: `/ai-updates/${day.date}#${update.id}`,
    badges: update.badges.slice(0, 3),
  };
}

function flattenChanges(days: AiUpdateDay[]) {
  return days.flatMap((day) => {
    if (day.groups?.length) {
      return day.groups.flatMap((group) => group.updates.map((update) => fromBriefingItem(day, update)));
    }

    return day.updates.map((update) => fromLegacyItem(day, update));
  });
}

function ChangeCard({ change }: { change: ChangeRecord }) {
  return (
    <article className="group rounded-md border border-white/10 bg-[#080808]/86 p-5 transition-colors hover:border-[#d7ad73]/38 hover:bg-[#101010] sm:p-6">
      <Link
        href={change.href}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b]"
      >
        <div className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.22em] text-white/42 uppercase">
              Official {change.officialDate}
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-header-serif)] text-2xl leading-tight font-medium text-white transition-colors group-hover:text-[#f6d29b]">
              {change.title}
            </h2>
          </div>
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 text-[#f6d29b]/70 transition-colors group-hover:border-[#d7ad73]/36 group-hover:text-[#f6d29b]">
            <ArrowUpRight size={17} strokeWidth={1.7} />
          </span>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#e8dfcd]/62">
          {change.summary}
        </p>

        <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 text-xs text-[#e8dfcd]/52 sm:grid-cols-2">
          <p>
            <span className="block font-semibold tracking-[0.14em] text-white/36 uppercase">Recorded</span>
            <span className="mt-1 block">{change.recordedDate} KST</span>
          </p>
          <p>
            <span className="block font-semibold tracking-[0.14em] text-white/36 uppercase">Source</span>
            <span className="mt-1 block truncate">{change.sourceLabel}</span>
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {change.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[11px] text-[#e8dfcd]/58"
            >
              {badge}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}

export default function AiUpdatesClient({ month, days }: AiUpdatesClientProps) {
  const changes = React.useMemo(() => flattenChanges(days), [days]);
  const visibleChanges = changes.slice(0, VISIBLE_CHANGE_LIMIT);
  const latestDays = days.slice(0, 6);
  const monthLabel = month.replace('.', '-').replace('-', '.');

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#030303] text-[#f3eadb]">
      <section className="relative overflow-hidden border-b border-white/8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(246,210,155,0.08),transparent_30%),radial-gradient(circle_at_80%_22%,rgba(127,198,192,0.055),transparent_28%)]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_27rem] lg:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
              AI Update · {monthLabel}
            </p>
            <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-header-serif)] text-4xl leading-tight font-medium text-white sm:text-5xl lg:text-[3.4rem]">
              AI changes, verified one day later.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#e8dfcd]/64">
              공식 출처 날짜를 먼저 확인하고, 다음날 KST에 기록합니다. 빠르게 지나가는 AI 변화 중 나중에 다시 확인할 가치가 있는 신호만 남깁니다.
            </p>
          </div>

          <aside className="rounded-md border border-white/10 bg-[#080808]/86 p-5">
            <div className="flex items-start gap-4">
              <CalendarDays size={22} strokeWidth={1.6} className="mt-1 text-[#f6d29b]/80" />
              <div>
                <p className="font-[family-name:var(--font-header-serif)] text-xl leading-snug text-white">
                  Official date + KST D+1
                </p>
                <p className="mt-2 text-sm leading-7 text-[#e8dfcd]/62">
                  속보보다 검증을 우선합니다. 날짜가 애매한 정보는 Watch로 분리하거나 기록하지 않습니다.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-md border border-white/10 bg-[#080808]/72 p-4 sm:p-5">
          <p className="text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
            Recent briefing dates
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {latestDays.map((day) => (
              <Link
                key={day.date}
                href={`/ai-updates/${day.date}`}
                className="group rounded-md border border-white/10 bg-[#030303]/62 p-4 transition-colors hover:border-[#d7ad73]/38 hover:bg-[#101010]"
              >
                <span className="text-xs text-[#e8dfcd]/46">Official {formatDisplayDate(day.date)}</span>
                <span className="mt-2 block font-[family-name:var(--font-header-serif)] text-xl leading-tight text-white transition-colors group-hover:text-[#f6d29b]">
                  {day.title ?? `${formatDisplayDate(day.date)} AI Updates`}
                </span>
                <span className="mt-3 block text-xs text-[#e8dfcd]/42">
                  Recorded {day.checkedDateKST ?? formatDisplayDate(day.date)} KST · {day.groups?.reduce((count, group) => count + group.updates.length, 0) ?? day.updates.length} changes
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mb-5 flex items-end justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
              Latest change cards
            </p>
            <p className="mt-2 text-sm text-[#e8dfcd]/52">
              Showing latest {visibleChanges.length} of {changes.length} recorded changes
            </p>
          </div>
          <p className="hidden items-center gap-2 text-xs text-[#e8dfcd]/46 sm:inline-flex">
            <CheckCircle2 size={14} strokeWidth={1.6} />
            Source first
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {visibleChanges.map((change) => (
            <ChangeCard key={change.id} change={change} />
          ))}
        </div>

        <div className="mt-8 rounded-md border border-white/10 bg-[#080808]/72 p-5 text-sm leading-7 text-[#e8dfcd]/56">
          <p className="font-semibold tracking-[0.14em] text-white/42 uppercase">Recording rule</p>
          <p className="mt-2">
            Official date는 원문 출처의 날짜입니다. Recorded date는 Dechive가 한국 시간 기준으로 다음날 확인해 기록한 날짜입니다.
          </p>
          <a
            href="https://platform.openai.com/docs/changelog"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#f6d29b]/72 uppercase transition-colors hover:text-[#f6d29b]"
          >
            Example source
            <ExternalLink size={13} strokeWidth={1.7} />
          </a>
        </div>
      </section>
    </main>
  );
}
