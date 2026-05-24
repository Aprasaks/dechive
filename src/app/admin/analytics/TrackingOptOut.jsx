'use client';

import { useEffect, useState } from 'react';

const OPT_OUT_KEY = 'dechive_disable_ga';

export default function TrackingOptOut() {
  const [isOptedOut, setIsOptedOut] = useState(false);

  useEffect(() => {
    setIsOptedOut(window.localStorage.getItem(OPT_OUT_KEY) === 'true');
  }, []);

  function toggleOptOut() {
    const nextValue = !isOptedOut;
    window.localStorage.setItem(OPT_OUT_KEY, nextValue ? 'true' : 'false');
    setIsOptedOut(nextValue);
  }

  return (
    <div className="border border-white/10 bg-black/25 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-zinc-400 uppercase">
            내 브라우저 GA 제외
          </p>
          <p className="mt-2 text-xs leading-5 text-zinc-500">
            켜두면 이 브라우저에서 일반 페이지를 봐도 GA 스크립트를 로드하지 않습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleOptOut}
          className={`border px-4 py-2 text-xs font-semibold tracking-[0.16em] uppercase transition-colors ${
            isOptedOut
              ? 'border-amber-400/45 bg-amber-500/10 text-amber-100'
              : 'border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-200'
          }`}
        >
          {isOptedOut ? '제외 중' : '제외하기'}
        </button>
      </div>
    </div>
  );
}
