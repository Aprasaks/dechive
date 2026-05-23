'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DATE_PRESETS } from '@/lib/analyticsDateRange';

export default function DateRangeControls({ activePreset, startDate, endDate }) {
  const router = useRouter();
  const [customStartDate, setCustomStartDate] = useState(
    /^\d{4}-\d{2}-\d{2}$/.test(startDate) ? startDate : '',
  );
  const [customEndDate, setCustomEndDate] = useState(
    /^\d{4}-\d{2}-\d{2}$/.test(endDate) ? endDate : '',
  );

  function goToPreset(preset) {
    router.push(`/admin/analytics?preset=${preset}`);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!customStartDate || !customEndDate) return;

    router.push(
      `/admin/analytics?startDate=${encodeURIComponent(customStartDate)}&endDate=${encodeURIComponent(customEndDate)}`,
    );
  }

  return (
    <div className="border border-white/10 bg-black/25 p-4">
      <div className="flex flex-wrap gap-2">
        {DATE_PRESETS.map((preset) => (
          <button
            key={preset.key}
            type="button"
            onClick={() => goToPreset(preset.key)}
            className={`border px-3 py-2 text-xs font-semibold tracking-[0.14em] uppercase transition-colors ${
              activePreset === preset.key
                ? 'border-amber-400/45 bg-amber-500/10 text-amber-100'
                : 'border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input
          type="date"
          value={customStartDate}
          onChange={(event) => setCustomStartDate(event.target.value)}
          className="border border-white/10 bg-stone-950 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-amber-500/40"
          aria-label="시작일"
        />
        <input
          type="date"
          value={customEndDate}
          onChange={(event) => setCustomEndDate(event.target.value)}
          className="border border-white/10 bg-stone-950 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-amber-500/40"
          aria-label="종료일"
        />
        <button
          type="submit"
          className="border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-amber-100 uppercase transition-colors hover:border-amber-400/55"
        >
          조회
        </button>
      </form>
    </div>
  );
}
