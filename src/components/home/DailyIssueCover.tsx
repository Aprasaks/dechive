import Link from 'next/link';
import LangToggle from '@/components/layout/LangToggle';
import MusicToggle from '@/components/layout/MusicToggle';
import type { DailyAiUpdates } from '@/data/dailyAiUpdates';
import type { DailyIssue, DailyIssueBook, DailyIssueLink, LocalizedText } from '@/data/dailyIssues';
import type { WeeklyEdition } from '@/data/weeklyEditions';
import type { Lang } from '@/lib/i18n';

interface DailyIssueCoverProps {
  issue: DailyIssue;
  weeklyEdition: WeeklyEdition | null;
  dailyAiUpdates: DailyAiUpdates;
  lang: Lang;
  heroSerifClassName: string;
}

function getText(text: LocalizedText, lang: Lang) {
  return text[lang];
}

function getLocalizedHref(href: string, lang: Lang) {
  if (lang !== 'en' || href.startsWith('/en/')) return href;
  if (href === '/archive' || href.startsWith('/archive/')) return `/en${href}`;
  if (href === '/deep-dive' || href.startsWith('/deep-dive/')) return `/en${href}`;
  return href;
}

function formatCoverDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00+09:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).formatToParts(parsedDate);

  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value.toUpperCase() ?? '';
  const year = parts.find((part) => part.type === 'year')?.value ?? '';

  return `${day} ${month} ${year}`.trim();
}

function splitCoverLineItem(item: string) {
  const separatorIndex = item.indexOf(':');

  if (separatorIndex < 0) {
    return {
      title: item,
      description: '',
    };
  }

  return {
    title: item.slice(0, separatorIndex).trim(),
    description: item.slice(separatorIndex + 1).trim(),
  };
}

function EditorialSlot({
  item,
  lang,
  align = 'left',
  emphasis = 'secondary',
  heroSerifClassName,
}: {
  item: DailyIssueLink;
  lang: Lang;
  align?: 'left' | 'right' | 'responsive';
  emphasis?: 'primary' | 'secondary';
  heroSerifClassName: string;
}) {
  const alignClassName =
    align === 'right'
      ? 'text-right'
      : align === 'responsive'
        ? 'text-left xl:text-right'
        : 'text-left';
  const className = `group block transition-opacity duration-200 hover:opacity-75 ${alignClassName}`;
  const hasItems = Boolean(item.items?.length);
  const titleClassName = emphasis === 'primary'
    ? 'text-[clamp(40px,4vw,68px)] leading-[0.98]'
    : 'text-[clamp(20px,1.65vw,26px)] leading-[1.07]';

  return (
    <Link href={getLocalizedHref(item.href, lang)} className={className}>
      <p className="text-[clamp(12px,0.92vw,14px)] font-black tracking-[0.24em] text-[#a24f16] uppercase">
        {getText(item.label, lang)}
      </p>
      {!hasItems ? (
        <p
          className={`mt-2 font-semibold text-[#1f1712] drop-shadow-[0_1px_12px_rgba(248,246,241,0.5)] ${titleClassName} ${heroSerifClassName}`}
        >
          {getText(item.title, lang)}
        </p>
      ) : null}
      {item.items ? (
        <ul className="mt-5 space-y-5 text-left">
          {item.items.map((listItem) => (
            <li key={getText(listItem, lang)}>
              <span className={`block text-[clamp(20px,1.55vw,25px)] leading-[1.08] font-semibold text-[#1f1712] ${heroSerifClassName}`}>
                {splitCoverLineItem(getText(listItem, lang)).title}
              </span>
              {splitCoverLineItem(getText(listItem, lang)).description ? (
                <span className="mt-2 block text-[clamp(13px,0.95vw,15px)] leading-6 font-semibold text-[#5f5144]">
                  {splitCoverLineItem(getText(listItem, lang)).description}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </Link>
  );
}

function QuestionSlot({
  item,
  lang,
  heroSerifClassName,
}: {
  item: DailyIssueLink;
  lang: Lang;
  heroSerifClassName: string;
}) {
  const title = getText(item.title, lang);

  return (
    <Link href={getLocalizedHref(item.href, lang)} className="group block max-w-[min(760px,54vw)] transition-opacity duration-200 hover:opacity-80">
      <p className="text-[clamp(13px,1vw,16px)] font-black tracking-[0.26em] text-[#9b5a18] uppercase">
        {getText(item.label, lang)}
      </p>
      <h1
        className={`mt-5 max-w-[min(760px,54vw)] text-[clamp(42px,4vw,70px)] leading-[0.98] font-semibold tracking-[-0.04em] text-[#17100b] [word-break:keep-all] drop-shadow-[0_1px_12px_rgba(248,246,241,0.58)] ${heroSerifClassName}`}
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
        }}
      >
        {title}
      </h1>
    </Link>
  );
}

function WeeklyBookSlot({
  book,
  lang,
  heroSerifClassName,
}: {
  book: DailyIssueBook;
  lang: Lang;
  heroSerifClassName: string;
}) {
  const content = (
    <div>
      <p className="text-[clamp(12px,0.92vw,14px)] font-black tracking-[0.24em] text-[#a24f16] uppercase">
        {getText(book.label, lang)}
      </p>
      <p
        className={`mt-2 text-[clamp(20px,1.65vw,26px)] leading-[1.07] font-semibold text-[#1f1712] ${heroSerifClassName}`}
      >
        {getText(book.title, lang)}
      </p>
      {book.author ? (
        <p className="mt-2 text-[12px] font-semibold tracking-[0.08em] text-[#5f5144]">
          {book.author}
        </p>
      ) : null}
    </div>
  );

  if (book.href) {
    return (
      <Link href={getLocalizedHref(book.href, lang)} className="block transition-opacity duration-200 hover:opacity-75">
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}

function DailyAiUpdatesSlot({
  dailyAiUpdates,
  lang,
  heroSerifClassName,
}: {
  dailyAiUpdates: DailyAiUpdates;
  lang: Lang;
  heroSerifClassName: string;
}) {
  return (
    <div>
      <p className="text-[clamp(12px,0.92vw,14px)] font-black tracking-[0.24em] text-[#a24f16] uppercase">
        {getText(dailyAiUpdates.label, lang)}
      </p>
      {dailyAiUpdates.updates.length ? (
        <ul className="mt-5 space-y-5 text-left">
          {dailyAiUpdates.updates.map((update) => (
            <li key={update.title}>
              <Link href={update.href} className="group block transition-opacity duration-200 hover:opacity-75">
                <span className={`block text-[clamp(20px,1.55vw,25px)] leading-[1.08] font-semibold text-[#1f1712] ${heroSerifClassName}`}>
                  {update.title}
                </span>
                <span className="mt-2 block text-[clamp(13px,0.95vw,15px)] leading-6 font-semibold text-[#5f5144]">
                  {getText(update.description, lang)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm font-semibold tracking-[0.08em] text-[#5f5144] uppercase">
          {lang === 'ko' ? '업데이트 준비 중' : 'Updates pending'}
        </p>
      )}
    </div>
  );
}

function WeeklyIndexItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-[rgba(70,45,25,0.16)] pt-5 first:border-t-0 first:pt-0">
      {children}
    </div>
  );
}

export default function DailyIssueCover({
  issue,
  weeklyEdition,
  dailyAiUpdates,
  lang,
  heroSerifClassName,
}: DailyIssueCoverProps) {
  const archiveHref = lang === 'en' ? '/en/archive' : '/archive';
  const deepDiveHref = lang === 'en' ? '/en/deep-dive' : '/deep-dive';
  const verificationItem: DailyIssueLink = weeklyEdition?.verification ?? issue.verification ?? {
    label: {
      ko: '검증 기록',
      en: 'Verification',
    },
    title: {
      ko: 'Deep Dive',
      en: 'Deep Dive',
    },
    href: '/deep-dive',
  };
  const weeklyBook = weeklyEdition?.book ?? issue.weeklyBook;

  return (
    <section className="relative isolate hidden h-screen min-h-[720px] overflow-hidden border-b border-black/10 bg-[#f8f6f1] px-6 py-7 sm:px-10 md:grid lg:px-14 xl:px-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-cover bg-[center_bottom] xl:bg-center"
        style={{ backgroundImage: `url('${issue.coverImage}')` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[#2f2117]/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[42%] bg-linear-to-t from-[rgba(47,33,23,0.34)] via-[rgba(47,33,23,0.08)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-0 h-full w-[56%] bg-linear-to-r from-[rgba(247,236,216,0.34)] via-[rgba(247,236,216,0.18)] to-transparent"
      />
      <div className="absolute top-7 left-6 z-10 sm:left-10 lg:left-14 xl:left-20">
        <p className={`text-[clamp(56px,5vw,92px)] leading-[0.82] font-semibold tracking-[-0.035em] text-[#3a2416]/88 drop-shadow-[0_1px_18px_rgba(248,246,241,0.48)] ${heroSerifClassName}`}>
          DECHIVE
        </p>
        <p className="mt-3 text-[10px] font-semibold tracking-[0.4em] text-[#3a2416]/72 uppercase">
          VERIFY. ARCHIVE. ELEVATE.
        </p>
      </div>

      <div className="absolute top-6 right-6 z-20 flex items-center gap-4 sm:right-10 lg:right-20">
        <LangToggle tone="light" />
        <MusicToggle tone="light" />
      </div>

      <div className="absolute top-[28%] left-6 z-10 max-w-[min(760px,54vw)] sm:left-10 lg:left-14 xl:top-[32%] xl:left-20">
        <QuestionSlot
          item={issue.question}
          lang={lang}
          heroSerifClassName={heroSerifClassName}
        />
      </div>

      <div className="absolute inset-x-10 bottom-[7.6rem] z-10 hidden text-left md:block lg:inset-x-14 xl:inset-y-0 xl:right-0 xl:left-auto xl:w-[38vw] xl:max-w-[34rem]">
        <div className="relative overflow-hidden px-7 py-6 xl:h-full xl:px-10 xl:py-0 xl:pr-20">
          <div
            aria-hidden="true"
            className="absolute -inset-6 z-0 bg-[rgba(244,226,198,0.46)] backdrop-blur-[3px] [mask-image:radial-gradient(ellipse_at_center,black_58%,transparent_100%)] xl:inset-y-0 xl:right-0 xl:left-[-7rem] xl:bg-[rgba(244,226,198,0.42)] xl:[mask-image:linear-gradient(90deg,transparent_0%,black_28%,black_100%)]"
          />
          <div className="relative z-10 xl:pt-[15vh]">
            <div className="flex flex-col gap-1 border-b border-[rgba(70,45,25,0.16)] pb-5">
              <p className="text-[clamp(13px,0.9vw,15px)] font-semibold tracking-[0.14em] text-[#3a2c22] uppercase">
                {weeklyEdition ? getText(weeklyEdition.label, lang) : formatCoverDate(issue.date)}
              </p>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-[#5f5144] uppercase">
                {formatCoverDate(issue.date)}
              </p>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-3 xl:grid-cols-1 xl:gap-7">
              <WeeklyIndexItem>
                <EditorialSlot
                  item={verificationItem}
                  lang={lang}
                  heroSerifClassName={heroSerifClassName}
                />
              </WeeklyIndexItem>
              {weeklyBook ? (
                <WeeklyIndexItem>
                  <WeeklyBookSlot
                    book={weeklyBook}
                    lang={lang}
                    heroSerifClassName={heroSerifClassName}
                  />
                </WeeklyIndexItem>
              ) : null}
              <WeeklyIndexItem>
                <div className="max-w-64">
                  <DailyAiUpdatesSlot
                    dailyAiUpdates={dailyAiUpdates}
                    lang={lang}
                    heroSerifClassName={heroSerifClassName}
                  />
                </div>
              </WeeklyIndexItem>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-6 bottom-6 z-10 flex items-center justify-center px-4 py-2 text-[clamp(11px,0.82vw,12px)] font-black tracking-[0.2em] text-[#3a2416]/78 uppercase sm:inset-x-10 lg:inset-x-14 xl:inset-x-20">
        <nav aria-label="Daily issue footer navigation">
          <Link href={archiveHref} className="transition-opacity hover:opacity-70">
            ARCHIVE
          </Link>
          <span className="mx-3">·</span>
          <Link href={deepDiveHref} className="transition-opacity hover:opacity-70">
            DEEP DIVE
          </Link>
          <span className="mx-3">·</span>
          <Link href="/issues" className="transition-opacity hover:opacity-70">
            ISSUE
          </Link>
          <span className="mx-3">·</span>
          <a href="#" className="transition-opacity hover:opacity-70">
            SUBSCRIBE
          </a>
        </nav>
      </div>
    </section>
  );
}
