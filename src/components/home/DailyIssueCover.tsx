import Link from 'next/link';
import { ArrowRight, BookOpen, Search, Sparkles } from 'lucide-react';
import LangToggle from '@/components/layout/LangToggle';
import MusicToggle from '@/components/layout/MusicToggle';
import type { DailyAiUpdates } from '@/data/dailyAiUpdates';
import type { DailyIssue, DailyIssueBook, DailyIssueLayout, DailyIssueLink, LocalizedText } from '@/data/dailyIssues';
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

function getDailyAiUpdatesHref(dailyAiUpdates: DailyAiUpdates) {
  const targetDate = dailyAiUpdates.officialDate ?? dailyAiUpdates.date;

  return targetDate ? `/ai-updates/${targetDate}` : '/ai-updates';
}

function formatAiUpdateDate(date?: string) {
  return date ? date.replaceAll('-', '.') : '';
}

function getDailyAiUpdatesMeta(dailyAiUpdates: DailyAiUpdates, lang: Lang) {
  const officialDate = formatAiUpdateDate(dailyAiUpdates.officialDate);
  const checkedDate = formatAiUpdateDate(dailyAiUpdates.checkedDateKST);

  if (!officialDate) return '';

  if (lang === 'ko') {
    return checkedDate
      ? `공식 ${officialDate} · 확인 ${checkedDate} KST`
      : `공식 ${officialDate}`;
  }

  return checkedDate
    ? `Official ${officialDate} · Checked ${checkedDate} KST`
    : `Official ${officialDate}`;
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

function splitQuestionTitle(title: string) {
  const explicitLines = title
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (explicitLines.length > 1) {
    return explicitLines;
  }

  const commaIndex = title.search(/[,，]/);

  if (commaIndex > 0 && commaIndex < title.length - 1) {
    return [
      title.slice(0, commaIndex + 1).trim(),
      title.slice(commaIndex + 1).trim(),
    ];
  }

  return [title.trim()];
}

function EditorialSlot({
  item,
  lang,
  align = 'left',
  emphasis = 'secondary',
  heroSerifClassName,
  tone = 'dark',
}: {
  item: DailyIssueLink;
  lang: Lang;
  align?: 'left' | 'right' | 'responsive';
  emphasis?: 'primary' | 'secondary';
  heroSerifClassName: string;
  tone?: 'dark' | 'light';
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
  const labelClassName = tone === 'light' ? 'text-[#d6a352]' : 'text-[#a24f16]';
  const titleToneClassName = tone === 'light'
    ? 'text-[#fffaf0] drop-shadow-[0_2px_16px_rgba(0,0,0,0.34)]'
    : 'text-[#1f1712] drop-shadow-[0_1px_12px_rgba(248,246,241,0.5)]';

  return (
    <Link href={getLocalizedHref(item.href, lang)} className={className}>
      <p className={`text-[clamp(12px,0.92vw,14px)] font-black tracking-[0.24em] uppercase ${labelClassName}`}>
        {getText(item.label, lang)}
      </p>
      {!hasItems ? (
        <p
          className={`mt-2 font-semibold ${titleToneClassName} ${titleClassName} ${heroSerifClassName}`}
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
  className = '',
  titleClassName = '',
  tone = 'dark',
}: {
  item: DailyIssueLink;
  lang: Lang;
  heroSerifClassName: string;
  className?: string;
  titleClassName?: string;
  tone?: 'dark' | 'light';
}) {
  const title = getText(item.title, lang);
  const titleLines = splitQuestionTitle(title);
  const labelClassName = tone === 'light' ? 'text-[#d6a352]' : 'text-[#9b5a18]';
  const titleToneClassName = tone === 'light'
    ? 'text-[#fffaf0] [text-shadow:0_3px_22px_rgba(0,0,0,0.46)]'
    : 'text-[#17100b] [text-shadow:0_2px_16px_rgba(248,246,241,0.64)]';

  return (
    <Link href={getLocalizedHref(item.href, lang)} className={`group block max-w-[min(760px,54vw)] transition-opacity duration-200 hover:opacity-80 ${className}`}>
      <p className={`text-[clamp(13px,1vw,16px)] font-black tracking-[0.26em] uppercase ${labelClassName}`}>
        {getText(item.label, lang)}
      </p>
      <h1
        className={`mt-5 max-w-[min(760px,54vw)] text-[clamp(42px,4vw,70px)] leading-[0.98] font-semibold tracking-[-0.04em] [overflow-wrap:normal] [text-wrap:balance] [word-break:keep-all] ${titleToneClassName} ${heroSerifClassName} ${titleClassName}`}
      >
        {titleLines.map((line, index) => (
          <span
            key={`${line}-${index}`}
            className={index === 0 && titleLines.length > 1
              ? 'mb-4 block text-[0.86em] leading-[0.98] [text-wrap:balance]'
              : 'block text-[1em] leading-[0.98] [text-wrap:balance]'}
          >
            {line}
          </span>
        ))}
      </h1>
    </Link>
  );
}

function WeeklyBookSlot({
  book,
  lang,
  heroSerifClassName,
  tone = 'dark',
}: {
  book: DailyIssueBook;
  lang: Lang;
  heroSerifClassName: string;
  tone?: 'dark' | 'light';
}) {
  const labelClassName = tone === 'light' ? 'text-[#d6a352]' : 'text-[#a24f16]';
  const titleClassName = tone === 'light' ? 'text-[#fffaf0]' : 'text-[#1f1712]';
  const authorClassName = tone === 'light' ? 'text-[#fffaf0]/66' : 'text-[#5f5144]';
  const content = (
    <div>
      <p className={`text-[clamp(12px,0.92vw,14px)] font-black tracking-[0.24em] uppercase ${labelClassName}`}>
        {getText(book.label, lang)}
      </p>
      <p
        className={`mt-2 text-[clamp(20px,1.65vw,26px)] leading-[1.07] font-semibold ${titleClassName} ${heroSerifClassName}`}
      >
        {getText(book.title, lang)}
      </p>
      {book.author ? (
        <p className={`mt-2 text-[12px] font-semibold tracking-[0.08em] ${authorClassName}`}>
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
  showDescriptions = true,
  tone = 'dark',
}: {
  dailyAiUpdates: DailyAiUpdates;
  lang: Lang;
  heroSerifClassName: string;
  showDescriptions?: boolean;
  tone?: 'dark' | 'light';
}) {
  const visibleUpdates = dailyAiUpdates.updates.slice(0, 3);
  const labelClassName = tone === 'light' ? 'text-[#d6a352]' : 'text-[#a24f16]';
  const titleClassName = tone === 'light' ? 'text-[#fffaf0]' : 'text-[#1f1712]';
  const descriptionClassName = tone === 'light' ? 'text-[#fffaf0]/70' : 'text-[#5f5144]';
  const metaClassName = tone === 'light' ? 'text-[#fffaf0]/52' : 'text-[#5f5144]/72';
  const dailyUpdatesHref = getDailyAiUpdatesHref(dailyAiUpdates);
  const metaText = getDailyAiUpdatesMeta(dailyAiUpdates, lang);

  return (
    <div>
      <Link href={dailyUpdatesHref} className={`inline-flex text-[clamp(12px,0.92vw,14px)] font-black tracking-[0.24em] uppercase transition-opacity hover:opacity-75 ${labelClassName}`}>
          {getText(dailyAiUpdates.label, lang)}
      </Link>
      {metaText ? (
        <p className={`mt-2 text-[10px] font-bold tracking-[0.14em] uppercase ${metaClassName}`}>
          {metaText}
        </p>
      ) : null}
      {visibleUpdates.length ? (
        <ul className="mt-5 space-y-5 text-left">
          {visibleUpdates.map((update) => (
            <li key={update.title}>
              <Link href={update.href || dailyUpdatesHref} className="group block transition-opacity duration-200 hover:opacity-75">
                <span className={`block text-[clamp(20px,1.55vw,25px)] leading-[1.08] font-semibold ${titleClassName} ${heroSerifClassName}`}>
                  {update.title}
                </span>
                {showDescriptions ? (
                  <span className={`mt-2 block text-[clamp(13px,0.95vw,15px)] leading-6 font-semibold ${descriptionClassName}`}>
                    {getText(update.description, lang)}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className={`mt-2 text-sm font-semibold tracking-[0.08em] uppercase ${descriptionClassName}`}>
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

function Masthead({
  heroSerifClassName,
  compact = false,
  centered = false,
  tone = 'dark',
}: {
  heroSerifClassName: string;
  compact?: boolean;
  centered?: boolean;
  tone?: 'dark' | 'light';
}) {
  const positionClassName = centered
    ? 'absolute top-7 left-1/2 z-10 -translate-x-1/2 text-center'
    : 'absolute top-7 left-6 z-10 sm:left-10 lg:left-14 xl:left-20';
  const textClassName = tone === 'light'
    ? 'text-[#fffaf0]/92 drop-shadow-[0_2px_26px_rgba(0,0,0,0.36)]'
    : 'text-[#3a2416]/88 drop-shadow-[0_1px_18px_rgba(248,246,241,0.48)]';
  const taglineClassName = tone === 'light' ? 'text-[#fffaf0]/72' : 'text-[#3a2416]/72';

  return (
    <div className={positionClassName}>
      <p className={`${compact ? 'text-[clamp(42px,4vw,72px)]' : 'text-[clamp(56px,5vw,92px)]'} leading-[0.82] font-semibold tracking-[-0.035em] ${textClassName} ${heroSerifClassName}`}>
        DECHIVE
      </p>
      <p className={`mt-3 text-[10px] font-semibold tracking-[0.42em] uppercase ${taglineClassName}`}>
        DIGITAL DAILY MAGAZINE
      </p>
    </div>
  );
}

function FooterRail({
  archiveHref,
  deepDiveHref,
  issueDate,
}: {
  archiveHref: string;
  deepDiveHref: string;
  issueDate: string;
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 flex h-16 items-center justify-center border-t border-[#d6a352]/28 bg-[#080806]/72 px-4 text-[clamp(11px,0.82vw,12px)] font-black tracking-[0.24em] text-[#fffaf0]/86 uppercase backdrop-blur-sm sm:h-[4.35rem]">
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
      <time
        dateTime={issueDate}
        className="absolute right-6 hidden text-[10px] font-black tracking-[0.22em] text-[#fffaf0]/62 sm:right-10 lg:right-14 xl:right-20 xl:block"
      >
        {issueDate}
      </time>
    </div>
  );
}

function DarkPanelSection({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#d6a352]/22 py-7 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-4">
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d6a352]/38 text-[#d6a352]/88">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-black tracking-[0.18em] text-[#d6a352] uppercase">
            {label}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}

function DarkEditorialPanel({
  verificationItem,
  weeklyBook,
  dailyAiUpdates,
  lang,
  heroSerifClassName,
}: {
  verificationItem: DailyIssueLink;
  weeklyBook?: DailyIssueBook;
  dailyAiUpdates: DailyAiUpdates;
  lang: Lang;
  heroSerifClassName: string;
}) {
  const visibleUpdates = dailyAiUpdates.updates.slice(0, 3);
  const dailyUpdatesHref = getDailyAiUpdatesHref(dailyAiUpdates);
  const aiUpdatesMeta = getDailyAiUpdatesMeta(dailyAiUpdates, lang);

  return (
    <aside className="absolute top-0 right-0 bottom-[4.35rem] z-10 hidden w-[28vw] min-w-[20rem] max-w-[28rem] bg-[#080806]/68 px-9 pt-[14vh] pb-10 text-[#fffaf0] shadow-[-26px_0_90px_rgba(0,0,0,0.18)] backdrop-blur-[2px] xl:block">
      <div className="flex h-full flex-col justify-center">
        <DarkPanelSection icon={<Search size={18} strokeWidth={1.45} />} label={getText(verificationItem.label, lang)}>
          <Link href={getLocalizedHref(verificationItem.href, lang)} className="group mt-3 flex items-start justify-between gap-4 transition-opacity hover:opacity-80">
            <span className={`whitespace-pre-line text-[clamp(21px,1.55vw,27px)] leading-[1.12] font-semibold ${heroSerifClassName}`}>
              {getText(verificationItem.title, lang)}
            </span>
            <ArrowRight className="mt-1 shrink-0 text-[#d6a352]" size={18} />
          </Link>
        </DarkPanelSection>
        {weeklyBook ? (
          <DarkPanelSection icon={<BookOpen size={18} strokeWidth={1.45} />} label={getText(weeklyBook.label, lang)}>
            <Link href={getLocalizedHref(weeklyBook.href ?? '#', lang)} className="group mt-3 flex items-start justify-between gap-4 transition-opacity hover:opacity-80">
              <span className={`text-[clamp(21px,1.55vw,27px)] leading-[1.12] font-semibold ${heroSerifClassName}`}>
                {getText(weeklyBook.title, lang)}
              </span>
              <ArrowRight className="mt-1 shrink-0 text-[#d6a352]" size={18} />
            </Link>
          </DarkPanelSection>
        ) : null}
        <DarkPanelSection icon={<Sparkles size={18} strokeWidth={1.45} />} label={getText(dailyAiUpdates.label, lang)}>
          {aiUpdatesMeta ? (
            <p className="mt-2 text-[10px] font-bold tracking-[0.14em] text-[#fffaf0]/50 uppercase">
              {aiUpdatesMeta}
            </p>
          ) : null}
          {visibleUpdates.length ? (
            <ul className="mt-4 space-y-3">
              {visibleUpdates.map((update) => (
                <li key={update.title} className="flex gap-3 text-[clamp(15px,1.05vw,18px)] leading-snug font-semibold">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6a352]" />
                  <Link href={update.href || dailyUpdatesHref} className="transition-opacity hover:opacity-75">
                    {update.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </DarkPanelSection>
      </div>
    </aside>
  );
}

function WeeklyEditorialPanel({
  issue,
  weeklyEdition,
  verificationItem,
  weeklyBook,
  dailyAiUpdates,
  lang,
  heroSerifClassName,
  className = '',
  showAiDescriptions = true,
}: {
  issue: DailyIssue;
  weeklyEdition: WeeklyEdition | null;
  verificationItem: DailyIssueLink;
  weeklyBook?: DailyIssueBook;
  dailyAiUpdates: DailyAiUpdates;
  lang: Lang;
  heroSerifClassName: string;
  className?: string;
  showAiDescriptions?: boolean;
}) {
  return (
    <div className={`hidden text-left md:block ${className}`}>
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
                  showDescriptions={showAiDescriptions}
                />
              </div>
            </WeeklyIndexItem>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClassicEditorialLayout({
  issue,
  weeklyEdition,
  verificationItem,
  weeklyBook,
  dailyAiUpdates,
  lang,
  heroSerifClassName,
}: {
  issue: DailyIssue;
  weeklyEdition: WeeklyEdition | null;
  verificationItem: DailyIssueLink;
  weeklyBook?: DailyIssueBook;
  dailyAiUpdates: DailyAiUpdates;
  lang: Lang;
  heroSerifClassName: string;
}) {
  return (
    <>
      <Masthead heroSerifClassName={heroSerifClassName} tone="light" />
      <div className="absolute top-[32%] left-6 z-10 max-w-[min(800px,56vw)] sm:left-10 lg:left-14 xl:left-20">
        <QuestionSlot
          item={issue.question}
          lang={lang}
          heroSerifClassName={heroSerifClassName}
          tone="light"
          className="max-w-[min(800px,56vw)]"
          titleClassName="max-w-[min(800px,56vw)] text-[clamp(54px,5.2vw,92px)] leading-[0.94]"
        />
      </div>
      <DarkEditorialPanel
        verificationItem={verificationItem}
        weeklyBook={weeklyBook}
        dailyAiUpdates={dailyAiUpdates}
        lang={lang}
        heroSerifClassName={heroSerifClassName}
      />
      <WeeklyEditorialPanel
        issue={issue}
        weeklyEdition={weeklyEdition}
        verificationItem={verificationItem}
        weeklyBook={weeklyBook}
        dailyAiUpdates={dailyAiUpdates}
        lang={lang}
        heroSerifClassName={heroSerifClassName}
        className="absolute inset-x-10 bottom-[7.6rem] z-10 lg:inset-x-14 xl:hidden"
      />
    </>
  );
}

function BigQuestionLayout({
  issue,
  verificationItem,
  weeklyBook,
  dailyAiUpdates,
  lang,
  heroSerifClassName,
}: {
  issue: DailyIssue;
  verificationItem: DailyIssueLink;
  weeklyBook?: DailyIssueBook;
  dailyAiUpdates: DailyAiUpdates;
  lang: Lang;
  heroSerifClassName: string;
}) {
  const visibleUpdates = dailyAiUpdates.updates.slice(0, 3);
  const dailyUpdatesHref = getDailyAiUpdatesHref(dailyAiUpdates);
  const aiUpdatesMeta = getDailyAiUpdatesMeta(dailyAiUpdates, lang);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-[#030303]/78 via-[#030303]/36 to-[#030303]/18"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[45%] bg-linear-to-t from-[#030303]/56 via-[#030303]/18 to-transparent"
      />
      <Masthead heroSerifClassName={heroSerifClassName} compact centered tone="light" />
      <div className="absolute top-[25%] left-[11vw] z-10 w-[min(820px,66vw)] text-left xl:top-[29%]">
        <QuestionSlot
          item={issue.question}
          lang={lang}
          heroSerifClassName={heroSerifClassName}
          tone="light"
          className="max-w-[min(820px,66vw)]"
          titleClassName="max-w-[min(820px,66vw)] text-[clamp(42px,4.8vw,82px)] leading-[0.94]"
        />
      </div>
      <div className="absolute top-[58%] left-[11vw] z-10 hidden max-w-[62rem] text-[#fffaf0] md:block xl:top-[64%]">
        <div className="space-y-7 text-left">
          <Link href={getLocalizedHref(verificationItem.href, lang)} className="group block transition-opacity hover:opacity-80">
            <p className="text-[13px] font-black tracking-[0.14em] text-[#d6a352] uppercase">
              {getText(verificationItem.label, lang)} <span className="text-[#fffaf0]/56">—</span>
            </p>
            <p className={`mt-2 text-[clamp(18px,1.3vw,22px)] leading-snug font-semibold text-[#fffaf0] ${heroSerifClassName}`}>
              {getText(verificationItem.title, lang)}
            </p>
          </Link>
          {weeklyBook ? (
            <Link href={getLocalizedHref(weeklyBook.href ?? '#', lang)} className="group block transition-opacity hover:opacity-80">
              <p className="text-[13px] font-black tracking-[0.14em] text-[#d6a352] uppercase">
                {getText(weeklyBook.label, lang)} <span className="text-[#fffaf0]/56">—</span>
              </p>
              <p className={`mt-2 text-[clamp(18px,1.3vw,22px)] leading-snug font-semibold text-[#fffaf0] ${heroSerifClassName}`}>
                {getText(weeklyBook.title, lang)}
              </p>
            </Link>
          ) : null}
          <Link href={dailyUpdatesHref} className="group block transition-opacity hover:opacity-80">
            <p className="text-[13px] font-black tracking-[0.14em] text-[#d6a352] uppercase">
              {getText(dailyAiUpdates.label, lang)} <span className="text-[#fffaf0]/56">—</span>
            </p>
            {aiUpdatesMeta ? (
              <p className="mt-2 text-[10px] font-bold tracking-[0.14em] text-[#fffaf0]/50 uppercase">
                {aiUpdatesMeta}
              </p>
            ) : null}
            <p className="mt-2 max-w-[58rem] text-[clamp(14px,1vw,17px)] leading-snug font-semibold text-[#fffaf0]/88">
              {visibleUpdates.map((update) => update.title).join(' / ')}
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}

function SideCoverLine({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-t border-[#d6a352]/48 pt-4 ${className}`}>
      {children}
    </div>
  );
}

function SideCoverLinesLayout({
  issue,
  verificationItem,
  weeklyBook,
  dailyAiUpdates,
  lang,
  heroSerifClassName,
}: {
  issue: DailyIssue;
  verificationItem: DailyIssueLink;
  weeklyBook?: DailyIssueBook;
  dailyAiUpdates: DailyAiUpdates;
  lang: Lang;
  heroSerifClassName: string;
}) {
  const visibleUpdates = dailyAiUpdates.updates.slice(0, 3);
  const dailyUpdatesHref = getDailyAiUpdatesHref(dailyAiUpdates);
  const aiUpdatesMeta = getDailyAiUpdatesMeta(dailyAiUpdates, lang);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-[#030303]/62 via-[#030303]/22 to-[#030303]/34"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[38%] bg-linear-to-t from-[#030303]/54 via-[#030303]/12 to-transparent"
      />
      <Masthead heroSerifClassName={heroSerifClassName} centered tone="light" />
      <div className="absolute top-[31%] left-6 z-10 max-w-[min(720px,50vw)] sm:left-10 lg:left-14 xl:left-20">
        <QuestionSlot
          item={issue.question}
          lang={lang}
          heroSerifClassName={heroSerifClassName}
          tone="light"
          className="max-w-[min(720px,50vw)]"
          titleClassName="max-w-[min(720px,50vw)] text-[clamp(40px,4.6vw,82px)]"
        />
      </div>
      <div className="absolute top-[21%] right-8 z-10 hidden w-[27vw] max-w-[22rem] text-left md:block lg:right-14 xl:right-20">
        <div className="space-y-12">
          <SideCoverLine>
            <Link href={getLocalizedHref(verificationItem.href, lang)} className="group block transition-opacity hover:opacity-80">
              <p className="text-[13px] font-black tracking-[0.16em] text-[#d6a352] uppercase">
                {getText(verificationItem.label, lang)}
              </p>
              <p className={`mt-4 text-[clamp(22px,1.8vw,30px)] leading-[1.06] font-semibold text-[#fffaf0] [text-shadow:0_2px_18px_rgba(0,0,0,0.35)] ${heroSerifClassName}`}>
                {getText(verificationItem.title, lang)}
              </p>
              <span className="mt-5 inline-flex items-center gap-3 text-[12px] font-black tracking-[0.18em] text-[#d6a352] uppercase">
                READ <ArrowRight size={16} strokeWidth={1.8} />
              </span>
            </Link>
          </SideCoverLine>
          {weeklyBook ? (
            <SideCoverLine>
              <Link href={getLocalizedHref(weeklyBook.href ?? '#', lang)} className="group block transition-opacity hover:opacity-80">
                <p className="text-[13px] font-black tracking-[0.16em] text-[#d6a352] uppercase">
                  {getText(weeklyBook.label, lang)}
                </p>
                <p className={`mt-4 text-[clamp(22px,1.75vw,28px)] leading-[1.08] font-semibold text-[#fffaf0] [text-shadow:0_2px_18px_rgba(0,0,0,0.35)] ${heroSerifClassName}`}>
                  {getText(weeklyBook.title, lang)}
                </p>
                <span className="mt-5 inline-flex items-center gap-3 text-[12px] font-black tracking-[0.18em] text-[#d6a352] uppercase">
                  READ <ArrowRight size={16} strokeWidth={1.8} />
                </span>
              </Link>
            </SideCoverLine>
          ) : null}
          <SideCoverLine>
            <Link href={dailyUpdatesHref} className="inline-flex text-[13px] font-black tracking-[0.16em] text-[#d6a352] uppercase transition-opacity hover:opacity-80">
              {getText(dailyAiUpdates.label, lang)}
            </Link>
            {aiUpdatesMeta ? (
              <p className="mt-2 text-[10px] font-bold tracking-[0.14em] text-[#fffaf0]/50 uppercase">
                {aiUpdatesMeta}
              </p>
            ) : null}
            {visibleUpdates.length ? (
              <ul className={`mt-5 space-y-4 text-[clamp(18px,1.45vw,24px)] leading-[1.08] font-semibold text-[#fffaf0] [text-shadow:0_2px_18px_rgba(0,0,0,0.35)] ${heroSerifClassName}`}>
                {visibleUpdates.map((update) => (
                  <li key={update.title}>
                    <Link href={update.href || dailyUpdatesHref} className="block transition-opacity hover:opacity-80">
                      {update.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <Link href={dailyUpdatesHref} className="mt-5 inline-flex items-center gap-3 text-[12px] font-black tracking-[0.18em] text-[#d6a352] uppercase transition-opacity hover:opacity-80">
              READ MORE <ArrowRight size={16} strokeWidth={1.8} />
            </Link>
          </SideCoverLine>
        </div>
      </div>
    </>
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
  const layout: DailyIssueLayout = issue.layout ?? 'classic-editorial';
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
  const layoutProps = {
    issue,
    weeklyEdition,
    verificationItem,
    weeklyBook,
    dailyAiUpdates,
    lang,
    heroSerifClassName,
  };

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
      <div className="absolute top-5 right-5 z-20 flex items-center gap-3 opacity-70 transition-opacity hover:opacity-100 sm:right-8 lg:right-14">
        <LangToggle tone="hero" />
        <MusicToggle tone="light" />
      </div>

      {layout === 'big-question' ? <BigQuestionLayout {...layoutProps} /> : null}
      {layout === 'side-cover-lines' ? <SideCoverLinesLayout {...layoutProps} /> : null}
      {layout === 'classic-editorial' ? <ClassicEditorialLayout {...layoutProps} /> : null}

      <FooterRail archiveHref={archiveHref} deepDiveHref={deepDiveHref} issueDate={issue.date} />
    </section>
  );
}
