'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, ExternalLink } from 'lucide-react';
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
  officialDate: string;
  recordedDate: string;
  href: string;
};

function formatDisplayDate(date: string) {
  return date.replaceAll('-', '.');
}

function getMonthFromDate(date: string) {
  return date.slice(0, 7);
}

function getDisplayMonth(month: string) {
  return month.replace('-', '.');
}

function getDaysInMonth(month: string) {
  const [year, monthIndex] = month.split('-').map(Number);

  if (!year || !monthIndex) return 31;

  return new Date(year, monthIndex, 0).getDate();
}

function getDateFromMonthDay(month: string, day: number) {
  return `${month}-${String(day).padStart(2, '0')}`;
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

  return {
    id: `${day.date}-${update.id}`,
    title: update.title,
    summary: update.summary,
    sourceLabel: source?.label ?? update.sourceType,
    sourceUrl: source?.url,
    officialDate: cleanDateLabel(update.officialDate ?? update.reportDate) || formatDisplayDate(day.date),
    recordedDate: update.checkedDateKST ?? day.checkedDateKST ?? formatDisplayDate(day.date),
    href: `/ai-updates/${day.date}#${update.id}`,
  };
}

function fromLegacyItem(day: AiUpdateDay, update: AiUpdateItem): ChangeRecord {
  return {
    id: `${day.date}-${update.id}`,
    title: update.title,
    summary: update.summary,
    sourceLabel: update.source.label,
    sourceUrl: update.source.url,
    officialDate: formatDisplayDate(day.date),
    recordedDate: day.checkedDateKST ?? formatDisplayDate(day.date),
    href: `/ai-updates/${day.date}#${update.id}`,
  };
}

function getChangesForDay(day: AiUpdateDay | null) {
  if (!day) return [];

  if (day.groups?.length) {
    return day.groups.flatMap((group) => group.updates.map((update) => fromBriefingItem(day, update)));
  }

  return day.updates.map((update) => fromLegacyItem(day, update));
}

function ChangeRow({ change }: { change: ChangeRecord }) {
  return (
    <article className="rounded-md border border-white/10 bg-[#080808]/86 p-4 transition-colors hover:border-[#d7ad73]/34 hover:bg-[#101010] sm:p-5">
      <Link
        href={change.href}
        className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6d29b]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-[#e8dfcd]/44">
              Official {change.officialDate} · Recorded {change.recordedDate} KST
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-header-serif)] text-2xl leading-tight font-medium text-white transition-colors group-hover:text-[#f6d29b]">
              {change.title}
            </h3>
          </div>
          <ArrowUpRight
            size={17}
            strokeWidth={1.7}
            className="mt-1 shrink-0 text-[#f6d29b]/68 transition-transform group-hover:translate-x-1 group-hover:text-[#f6d29b]"
          />
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[#e8dfcd]/62">
          {change.summary}
        </p>
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-3 text-xs text-[#e8dfcd]/46">
          <span className="min-w-0 truncate">출처: {change.sourceLabel}</span>
          {change.sourceUrl ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-[#f6d29b]/62">
              source
              <ExternalLink size={12} strokeWidth={1.7} />
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

export default function AiUpdatesClient({ month, days }: AiUpdatesClientProps) {
  const months = React.useMemo(() => {
    const uniqueMonths = new Set(days.map((day) => getMonthFromDate(day.date)));

    return [...uniqueMonths].sort((a, b) => b.localeCompare(a));
  }, [days]);
  const initialMonth = months.includes(month.replace('.', '-'))
    ? month.replace('.', '-')
    : months[0] ?? '2026-07';
  const [selectedMonth, setSelectedMonth] = React.useState(initialMonth);
  const firstRecordedDate = days.find((day) => getMonthFromDate(day.date) === initialMonth)?.date ?? days[0]?.date;
  const [selectedDate, setSelectedDate] = React.useState(firstRecordedDate ?? `${initialMonth}-01`);
  const recordedDates = React.useMemo(() => new Set(days.map((day) => day.date)), [days]);
  const selectedDay = days.find((day) => day.date === selectedDate) ?? null;
  const selectedChanges = getChangesForDay(selectedDay);
  const daysInSelectedMonth = getDaysInMonth(selectedMonth);
  const monthDays = days.filter((day) => getMonthFromDate(day.date) === selectedMonth);

  function selectMonth(nextMonth: string) {
    setSelectedMonth(nextMonth);
    setSelectedDate(days.find((day) => getMonthFromDate(day.date) === nextMonth)?.date ?? `${nextMonth}-01`);
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#030303] text-[#f3eadb]">
      <section className="relative overflow-hidden border-b border-white/8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(246,210,155,0.08),transparent_30%),radial-gradient(circle_at_80%_22%,rgba(127,198,192,0.055),transparent_28%)]"
        />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
            AI Update · {getDisplayMonth(selectedMonth)}
          </p>
          <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-header-serif)] text-4xl leading-tight font-medium text-white sm:text-5xl lg:text-[3.4rem]">
            오늘 확인한 AI 변화
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#e8dfcd]/64">
            공식 출처 날짜를 먼저 확인하고, 다음날 KST에 기록합니다. 날짜를 선택하면 그날 남긴 변화만 짧게 볼 수 있습니다.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[21rem_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-md border border-white/10 bg-[#080808]/86 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="font-[family-name:var(--font-header-serif)] text-xl text-white">
                  {getDisplayMonth(selectedMonth)}
                </p>
                <p className="mt-1 text-xs text-[#e8dfcd]/46">
                  표시된 날짜에 기록이 있습니다.
                </p>
              </div>
              <CalendarDays size={22} strokeWidth={1.6} className="text-[#f6d29b]/70" />
            </div>

            {months.length > 1 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {months.map((availableMonth) => (
                  <button
                    key={availableMonth}
                    type="button"
                    onClick={() => selectMonth(availableMonth)}
                    className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                      selectedMonth === availableMonth
                        ? 'border-[#d7ad73]/48 bg-[#d7ad73]/12 text-[#f6d29b]'
                        : 'border-white/10 text-[#e8dfcd]/54 hover:border-[#d7ad73]/34 hover:text-white'
                    }`}
                  >
                    {getDisplayMonth(availableMonth)}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-5 hidden grid-cols-7 gap-2 lg:grid">
              {Array.from({ length: daysInSelectedMonth }, (_, index) => {
                const dayNumber = index + 1;
                const date = getDateFromMonthDay(selectedMonth, dayNumber);
                const hasRecord = recordedDates.has(date);
                const isSelected = selectedDate === date;

                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => hasRecord && setSelectedDate(date)}
                    disabled={!hasRecord}
                    className={`relative h-10 rounded-md border text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'border-[#d7ad73]/58 bg-[#d7ad73]/14 text-[#f6d29b]'
                        : hasRecord
                          ? 'border-white/10 bg-[#030303]/74 text-[#e8dfcd]/62 hover:border-[#d7ad73]/34 hover:text-white'
                          : 'border-white/5 text-white/16'
                    }`}
                    aria-pressed={isSelected}
                  >
                    {String(dayNumber).padStart(2, '0')}
                    {hasRecord ? (
                      <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#f6d29b]/72" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {monthDays.map((day) => (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => setSelectedDate(day.date)}
                  className={`shrink-0 rounded-full border px-3 py-2 text-xs transition-colors ${
                    selectedDate === day.date
                      ? 'border-[#d7ad73]/58 bg-[#d7ad73]/14 text-[#f6d29b]'
                      : 'border-white/10 text-[#e8dfcd]/58'
                  }`}
                >
                  {formatDisplayDate(day.date).slice(5)}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="border-b border-white/10 pb-5">
            <p className="text-[10px] font-semibold tracking-[0.24em] text-white/42 uppercase">
              Selected date
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-[family-name:var(--font-header-serif)] text-3xl leading-tight text-white sm:text-4xl">
                  Official {formatDisplayDate(selectedDate)}
                </h2>
                <p className="mt-2 text-sm text-[#e8dfcd]/52">
                  Recorded {selectedDay?.checkedDateKST ?? formatDisplayDate(selectedDate)} KST · {selectedChanges.length} changes
                </p>
              </div>
              {selectedDay ? (
                <Link
                  href={`/ai-updates/${selectedDay.date}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#f6d29b]/72 uppercase transition-colors hover:text-[#f6d29b]"
                >
                  날짜 상세 보기
                  <ArrowUpRight size={14} strokeWidth={1.7} />
                </Link>
              ) : null}
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {selectedChanges.length ? (
              selectedChanges.map((change) => <ChangeRow key={change.id} change={change} />)
            ) : (
              <div className="rounded-md border border-white/10 bg-[#080808]/86 p-6">
                <p className="font-[family-name:var(--font-header-serif)] text-2xl text-white">
                  이 날짜에는 기록된 업데이트가 없습니다.
                </p>
                <p className="mt-3 text-sm leading-7 text-[#e8dfcd]/62">
                  공식 출처로 확인된 변화가 있으면 다음날 KST 기준으로 이 달력에 표시됩니다.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
