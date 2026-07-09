'use client';

import * as React from 'react';

const STARTED_AT = new Date('1992-09-30T00:00:00+09:00').getTime();

type ElapsedTime = {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getElapsedTime(): ElapsedTime {
  const now = Date.now();
  const elapsedSeconds = Math.max(0, Math.floor((now - STARTED_AT) / 1000));

  const secondsInMinute = 60;
  const secondsInHour = secondsInMinute * 60;
  const secondsInDay = secondsInHour * 24;
  const secondsInYear = secondsInDay * 365;

  const years = Math.floor(elapsedSeconds / secondsInYear);
  const remainingAfterYears = elapsedSeconds - years * secondsInYear;
  const days = Math.floor(remainingAfterYears / secondsInDay);
  const remainingAfterDays = remainingAfterYears - days * secondsInDay;
  const hours = Math.floor(remainingAfterDays / secondsInHour);
  const remainingAfterHours = remainingAfterDays - hours * secondsInHour;
  const minutes = Math.floor(remainingAfterHours / secondsInMinute);
  const seconds = remainingAfterHours - minutes * secondsInMinute;

  return {
    years,
    days,
    hours,
    minutes,
    seconds,
  };
}

function padTime(value: number) {
  return value.toString().padStart(2, '0');
}

function formatElapsedTime(elapsedTime: ElapsedTime) {
  return `${elapsedTime.years}y · ${elapsedTime.days}d · ${padTime(elapsedTime.hours)}h · ${padTime(elapsedTime.minutes)}m · ${padTime(elapsedTime.seconds)}s`;
}

export default function LivingTimeCounter() {
  const [elapsedTime, setElapsedTime] = React.useState<ElapsedTime | null>(null);

  React.useEffect(() => {
    setElapsedTime(getElapsedTime());

    const timerId = window.setInterval(() => {
      setElapsedTime(getElapsedTime());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return (
    <p
      className="font-mono text-[10px] leading-none tracking-[0.08em] whitespace-nowrap text-white/34 sm:text-[11px]"
      aria-label="Living time counter"
    >
      {elapsedTime ? formatElapsedTime(elapsedTime) : '00y · 000d · 00h · 00m · 00s'}
    </p>
  );
}
