'use client';

import * as React from 'react';
import Link from 'next/link';
import type { AiUpdateDay, AiUpdateItem } from '@/data/aiUpdates';

interface AiUpdatesClientProps {
  month: string;
  days: AiUpdateDay[];
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

function formatDisplayDate(date: string) {
  return date.replaceAll('-', '.');
}

function getRecordedDates(days: AiUpdateDay[]) {
  return new Set(days.map((day) => day.date));
}

function getUpdatesForDate(days: AiUpdateDay[], date: string) {
  return days.find((day) => day.date === date)?.updates ?? [];
}

function getDayForDate(days: AiUpdateDay[], date: string) {
  return days.find((day) => day.date === date) ?? null;
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-sm border border-[#bda77e]/45 bg-[#fbfaf7] px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#6d5634] uppercase">
      {label}
    </span>
  );
}

function UpdateCard({ update }: { update: AiUpdateItem }) {
  return (
    <article
      id={update.id}
      className="group border-t border-[#d8cdbd] py-7 first:border-t-0 first:pt-0"
    >
      <Link href={update.detailHref} className="block">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#9a7342] uppercase">
              Verified Briefing
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-header-serif)] text-2xl leading-snug font-medium text-[#211812] transition-colors group-hover:text-[#7a5d2c] sm:text-3xl">
              {update.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#655b51]">
              {update.summary}
            </p>
          </div>
          <span className="shrink-0 text-xs font-semibold tracking-[0.14em] text-[#8a6a39] uppercase transition-colors group-hover:text-[#211812]">
            날짜 기록 보기
          </span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {update.badges.map((badge) => (
            <Badge key={badge} label={badge} />
          ))}
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
  const [selectedDate, setSelectedDate] = React.useState(days[0]?.date ?? `${initialMonth}-01`);
  const recordedDates = React.useMemo(() => getRecordedDates(days), [days]);
  const selectedUpdates = getUpdatesForDate(days, selectedDate);
  const selectedDay = getDayForDate(days, selectedDate);
  const visibleUpdates = selectedUpdates.slice(0, 3);
  const hasMoreUpdates = selectedUpdates.length > visibleUpdates.length;
  const dateDetailHref = `/ai-updates/${selectedDate}`;
  const daysInSelectedMonth = getDaysInMonth(selectedMonth);

  function selectMonth(nextMonth: string) {
    setSelectedMonth(nextMonth);

    const firstRecordedDateInMonth = days.find((day) => getMonthFromDate(day.date) === nextMonth)?.date;
    setSelectedDate(firstRecordedDateInMonth ?? `${nextMonth}-01`);
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8f6f1] text-[#19140f]">
      <section className="border-b border-[#ded6c9] px-6 py-12 sm:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.24em] text-[#9a7342] uppercase">
            Official AI Briefing Archive
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-header-serif)] text-4xl font-medium text-[#2a211b] sm:text-5xl">
            Ai-Update
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6f6257]">
            매일 공식 문서에서 확인한 AI 업데이트를 날짜별 브리핑으로 남깁니다.
            <br />
            Archive와 Deep Dive가 질문과 판단을 다룬다면,
            <br />
            이곳은 변화 자체를 검증 가능한 기록으로 정리합니다.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[18rem_1fr] lg:gap-12 lg:py-12">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-[#ded6c9] bg-[#f3efe7]/70 p-5">
            <div className="flex items-center justify-between gap-4 border-b border-[#d8cdbd] pb-4">
              <div>
                <p className="font-[family-name:var(--font-header-serif)] text-xl font-medium text-[#2a211b]">
                  Monthly Index
                </p>
                <p className="mt-1 text-xs font-semibold tracking-[0.16em] text-[#8a6a39] uppercase">
                  Official records
                </p>
              </div>
              <span className="shrink-0 rounded-sm border border-[#bda77e]/50 px-3 py-1.5 text-xs font-semibold tracking-[0.12em] text-[#5d4630]">
                {getDisplayMonth(selectedMonth)}
              </span>
            </div>

            {months.length > 1 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {months.map((availableMonth) => {
                  const isSelectedMonth = selectedMonth === availableMonth;

                  return (
                    <button
                      key={availableMonth}
                      type="button"
                      onClick={() => selectMonth(availableMonth)}
                      className={`rounded-sm border px-3 py-1.5 text-xs font-semibold tracking-[0.12em] transition-colors ${
                        isSelectedMonth
                          ? 'border-[#8a6a39] bg-[#2a211b] text-[#f8f6f1]'
                          : 'border-[#d8cdbd] bg-[#fbfaf7]/70 text-[#5f564d] hover:border-[#b08d57]/70 hover:bg-[#efe7da]'
                      }`}
                    >
                      {getDisplayMonth(availableMonth)}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <div className="mt-5 grid grid-cols-6 gap-2 sm:grid-cols-10 lg:grid-cols-5">
              {Array.from({ length: daysInSelectedMonth }, (_, index) => {
                const dayNumber = index + 1;
                const date = getDateFromMonthDay(selectedMonth, dayNumber);
                const hasRecord = recordedDates.has(date);
                const isSelected = selectedDate === date;

                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`relative h-10 rounded-sm border text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'border-[#8a6a39] bg-[#2a211b] text-[#f8f6f1]'
                        : 'border-[#d8cdbd] bg-[#fbfaf7]/70 text-[#5f564d] hover:border-[#b08d57]/70 hover:bg-[#efe7da]'
                    }`}
                    aria-pressed={isSelected}
                    aria-label={`${formatDisplayDate(date)} AI updates`}
                  >
                    {String(dayNumber).padStart(2, '0')}
                    {hasRecord ? (
                      <span
                        className={`absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                          isSelected ? 'bg-[#f8f6f1]' : 'bg-[#b08d57]'
                        }`}
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="border-b border-[#ded6c9] pb-6">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#9a7342] uppercase">
              {formatDisplayDate(selectedDate)}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#6f6257]">
              공식 출처 확인 여부와 실제 화면 자료 존재 여부를 함께 기록합니다.
            </p>
          </div>

          <div className="mt-7 bg-[#fbfaf7]/55 px-5 py-7 sm:px-7">
            {selectedUpdates.length ? (
              <>
                {visibleUpdates.map((update) => (
                  <UpdateCard
                    key={update.id}
                    update={{
                      ...update,
                      detailHref: dateDetailHref,
                    }}
                  />
                ))}
                {hasMoreUpdates || selectedDay?.groups?.length ? (
                  <div className="border-t border-[#d8cdbd] pt-7">
                    <Link
                      href={dateDetailHref}
                      className="inline-flex text-xs font-semibold tracking-[0.16em] text-[#8a6a39] uppercase transition-colors hover:text-[#2a211b]"
                    >
                      {formatDisplayDate(selectedDate)} 전체 기록 보기
                    </Link>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="border-t border-[#d8cdbd] py-10">
                <p className="font-[family-name:var(--font-header-serif)] text-2xl font-medium text-[#2a211b]">
                  이 날짜에는 기록된 AI 업데이트가 없습니다.
                </p>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[#6f6257]">
                  공식 문서로 확인된 변화가 생기면 이 날짜 색인에 브리핑으로
                  추가됩니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
