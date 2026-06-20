'use client';

import * as React from 'react';
import Link from 'next/link';
import type { AiUpdateDay, AiUpdateItem } from '@/data/aiUpdates';

interface AiUpdatesClientProps {
  month: string;
  days: AiUpdateDay[];
}

const DAYS_IN_MONTH = 30;

function getDateFromDay(day: number) {
  return `2026-06-${String(day).padStart(2, '0')}`;
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
            상세 보기
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
  const [selectedDate, setSelectedDate] = React.useState('2026-06-20');
  const recordedDates = React.useMemo(() => getRecordedDates(days), [days]);
  const selectedUpdates = getUpdatesForDate(days, selectedDate);

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
                {month}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-6 gap-2 sm:grid-cols-10 lg:grid-cols-5">
              {Array.from({ length: DAYS_IN_MONTH }, (_, index) => {
                const dayNumber = index + 1;
                const date = getDateFromDay(dayNumber);
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
              selectedUpdates.map((update) => (
                <UpdateCard key={update.id} update={update} />
              ))
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
