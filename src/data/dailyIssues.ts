export type LocalizedText = {
  ko: string;
  en: string;
};

export type DailyIssueLink = {
  label: LocalizedText;
  title: LocalizedText;
  description?: LocalizedText;
  items?: LocalizedText[];
  href: string;
};

export type DailyIssue = {
  id: string;
  date: string;
  issueNo: string;
  coverImage: string;
  question: DailyIssueLink;
  verification?: DailyIssueLink;
  weeklyBook: {
    label: LocalizedText;
    title: LocalizedText;
    author?: string;
    coverImage?: string;
    showBookCoverOnCover?: boolean;
    href?: string;
  };
  aiUpdate: DailyIssueLink;
};

export const dailyIssues: DailyIssue[] = [
  {
    id: '2026-06-17',
    date: '2026-06-17',
    issueNo: '',
    coverImage: '/images/covers/2026-06-17.webp',
    question: {
      label: {
        ko: '오늘의 질문',
        en: 'Question',
      },
      title: {
        ko: '급변하는 시대에 있는 우리는 어디까지 AI 컨텐츠를 믿을 수 있을까요?',
        en: 'In a rapidly changing age, how far can we trust AI content?',
      },
      href: '/archive/how-much-can-we-trust-human-made-content',
    },
    verification: {
      label: {
        ko: '검증 기록',
        en: 'Verification',
      },
      title: {
        ko: '1인 기업, agile 필요합니다',
        en: 'Solo companies need Agile',
      },
      href: '/deep-dive/ai-era-agile-verification',
    },
    weeklyBook: {
      label: {
        ko: '도서',
        en: 'Book',
      },
      title: {
        ko: 'AI 버블이 온다',
        en: 'The AI Bubble Is Coming',
      },
      author: '아르빈드 나라야난, 사야시 카푸르',
      coverImage: '/images/books/book-slug.webp',
    },
    aiUpdate: {
      label: {
        ko: '오늘의 AI 업데이트',
        en: 'AI Update',
      },
      title: {
        ko: 'AI가 제품 안으로 들어오는 세 가지 장면',
        en: 'Three ways AI is moving inside products',
      },
      items: [
        {
          ko: 'Grok for PowerPoint: AI가 발표 자료 안으로 들어왔다',
          en: 'Grok for PowerPoint: AI moved into slide decks',
        },
        {
          ko: 'Facebook AI Mode: SNS 검색이 AI 요약으로 바뀐다',
          en: 'Facebook AI Mode: social search turns into AI summaries',
        },
        {
          ko: 'OpenAI Deployment Simulation: AI 출시 전 위험을 미리 시뮬레이션한다',
          en: 'OpenAI Deployment Simulation: risks are tested before launch',
        },
      ],
      href: '/archive',
    },
  },
  {
    id: '2026-06-16',
    date: '2026-06-16',
    issueNo: 'No. 001',
    coverImage: '/images/covers/2026-06-16.webp',
    question: {
      label: {
        ko: '오늘의 질문',
        en: 'Question',
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
    verification: {
      label: {
        ko: '검증 기록',
        en: 'Verification',
      },
      title: {
        ko: '1인 기업, agile 필요합니다',
        en: 'Solo companies need Agile',
      },
      href: '/deep-dive/ai-era-agile-verification',
    },
    weeklyBook: {
      label: {
        ko: '이번 주 도서',
        en: 'Book of the Week',
      },
      title: {
        ko: '생각을 검증하는 독서',
        en: 'Reading to Verify Thought',
      },
      author: 'Dechive Notes',
      coverImage: '/images/books/book-slug.webp',
    },
    aiUpdate: {
      label: {
        ko: '오늘의 AI 업데이트',
        en: 'AI Update',
      },
      title: {
        ko: '이번 주 AI 변화',
        en: 'This Week in AI Change',
      },
      href: '/archive',
    },
  },
  {
    id: '2026-06-15',
    date: '2026-06-15',
    issueNo: 'No. 000',
    coverImage: '/images/bg.webp',
    question: {
      label: {
        ko: '오늘의 질문',
        en: 'Question',
      },
      title: {
        ko: '사람은 왜 AI 결과를 보지 않게 되는가?',
        en: 'Why do people stop reading AI results?',
      },
      href: '/archive/why-people-stop-reading-ai-results',
    },
    verification: {
      label: {
        ko: '검증 기록',
        en: 'Verification',
      },
      title: {
        ko: '방향을 검증하는 방식',
        en: 'A Way to Verify Direction',
      },
      href: '/deep-dive/ai-era-agile-verification',
    },
    weeklyBook: {
      label: {
        ko: '이번 주 도서',
        en: 'Book of the Week',
      },
      title: {
        ko: '검증을 위한 기록법',
        en: 'Records for Verification',
      },
      author: 'Dechive Notes',
    },
    aiUpdate: {
      label: {
        ko: '오늘의 AI 업데이트',
        en: 'AI Update',
      },
      title: {
        ko: '답보다 기준을 남기기',
        en: 'Keep Criteria, Not Just Answers',
      },
      href: '/archive',
    },
  },
];
