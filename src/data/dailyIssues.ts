export type LocalizedText = {
  ko: string;
  en: string;
};

export type DailyIssueLink = {
  label: LocalizedText;
  kicker?: LocalizedText;
  title: LocalizedText;
  description?: LocalizedText;
  items?: LocalizedText[];
  href: string;
};

export type DailyIssueTheme = {
  text?: string;
  accent?: string;
  muted?: string;
};

export type DailyIssueLayout =
  | 'classic-editorial'
  | 'big-question'
  | 'side-cover-lines';

// Layout rotation guide:
// - classic-editorial: left headline + right dark editorial panel
// - big-question: question-led full-bleed cover
// - side-cover-lines: full-bleed cover with side magazine lines

export type DailyIssueBook = {
  label: LocalizedText;
  title: LocalizedText;
  author?: string;
  coverImage?: string;
  showBookCoverOnCover?: boolean;
  href?: string;
};

export type DailyIssue = {
  id: string;
  date: string;
  coverImage: string;
  question: DailyIssueLink;
  layout?: DailyIssueLayout;
  theme?: DailyIssueTheme;
  issueNo?: string;
  verification?: DailyIssueLink;
  weeklyBook?: DailyIssueBook;
  aiUpdate?: DailyIssueLink;
};

export const dailyIssues: DailyIssue[] = [
  {
    id: '2026-06-18',
    date: '2026-06-18',
    coverImage: '/images/covers/2026-06/template-classic-editorial.webp',
    // Image #3 reference: right editorial panel.
    layout: 'classic-editorial',
    question: {
      label: {
        ko: '오늘의 질문',
        en: 'QUESTION',
      },
      title: {
        ko: '우리는 왜 AI 콘텐츠에 열광할까?',
        en: 'Why Are We So Captivated by AI-Generated Content?',
      },
      href: '/archive/why-we-get-excited-about-ai-content',
    },
    theme: {
      text: '#1f1712',
      accent: '#a24f16',
      muted: '#5f5144',
    },
  },
  {
    id: '2026-06-17',
    date: '2026-06-17',
    coverImage: '/images/covers/2026-06/template-big-question.webp',
    // Image #2 reference: question-led cover.
    layout: 'big-question',
    question: {
      label: {
        ko: '오늘의 질문',
        en: 'QUESTION',
      },
      kicker: {
        ko: '급변하는 시대에 있는 우리는',
        en: 'In a rapidly changing age,',
      },
      title: {
        ko: '어디까지 AI 컨텐츠를 믿을 수 있을까요?',
        en: 'how far can we trust AI content?',
      },
      href: '/archive/how-much-can-we-trust-human-made-content',
    },
    theme: {
      text: '#1f1712',
      accent: '#a24f16',
      muted: '#5f5144',
    },
  },
  {
    id: '2026-06-16',
    date: '2026-06-16',
    coverImage: '/images/covers/2026-06/template-side-cover-lines.webp',
    // Image #1 reference: side cover lines.
    layout: 'side-cover-lines',
    question: {
      label: {
        ko: '오늘의 질문',
        en: 'QUESTION',
      },
      title: {
        ko: 'AI가 만든 답을 우리는 정말 읽고 있는가?',
        en: 'Are we really reading the answers AI makes?',
      },
      description: {
        ko: '생성된 정보의 홍수 속에서, 우리는 더 깊이 질문하고 있는가.',
        en: 'In a flood of generated information, are we asking deeper questions?',
      },
      href: '/archive/why-people-stop-reading-ai-results',
    },
    theme: {
      text: '#1f1712',
      accent: '#a24f16',
      muted: '#5f5144',
    },
  },
  {
    id: '2026-06-15',
    date: '2026-06-15',
    coverImage: '/images/bg.webp',
    question: {
      label: {
        ko: '오늘의 질문',
        en: 'QUESTION',
      },
      title: {
        ko: '사람은 왜 AI 결과를 보지 않게 되는가?',
        en: 'Why do people stop reading AI results?',
      },
      href: '/archive/why-people-stop-reading-ai-results',
    },
    theme: {
      text: '#1f1712',
      accent: '#a24f16',
      muted: '#5f5144',
    },
  },
];
