export type Lang = 'ko' | 'en';

const i18n = {
  ko: {
    // Home
    homeTagline1: '생각이 머무는 도서관',
    homeTagline2: '생각이 기록이 되는 순간,\n의미를 가진다.',
    homeBrowseRecords: '기록 둘러보기',
    homeRandomRecord: '아무 기록이나 펼쳐보기',
    enterArchive: '아카이브 입장',

    // About
    aboutLabel: 'About Demian',
    aboutRole: '기록하는 학습자',
    aboutBio: '4년간의 강의 경험을 토대로 누구나 쉽게 이해할 수 있게 지식을 정리합니다. 기록은 계속됩니다.',
    aboutSkillsLabel: 'Skills & Tools',
    aboutPhilosophyLabel: 'Dechive 철학',
    aboutPhilosophyQuote: '자고 일어나면 AI가 또 바뀌어 있는 시대,\n편리함과 함께 수많은 할루시네이션도 함께 왔습니다.\n그래서 직접 검증하고, 직접 기록합니다.',
    aboutGetLabel: '이 서고에서 얻을 수 있는 것',
    aboutKicker: '생각이 머무는 도서관',
    aboutDefinition: 'Dechive는 생각과 지식을 기록하고 다시 탐색하기 위한 개인 도서관입니다.',
    aboutPurpose: 'AI가 수많은 답을 만들어내는 시대에, 빠르게 지나가는 정보를 그대로 소비하지 않고 직접 읽고, 검증하고, 기록하기 위해 만들어졌습니다.',
    aboutReading: '이곳의 기록들은 하나의 글로 끝나지 않습니다. 주제로 묶이고, 태그를 따라 다른 기록으로 이어집니다.',
    aboutExplore: 'Dechive에서는 주제별로 기록을 따라 읽거나, 태그로 이어진 글을 발견하거나, 아무 기록이나 펼쳐볼 수 있습니다.',
    aboutClosing: 'Dechive는 정답을 모아두는 공간이 아니라, 생각이 머물고 다시 꺼내지는 서가입니다.',
    aboutIntro: 'GPT, Gemini, Claude가 등장하고 LLM과 머신러닝이 세상을 뒤흔들기 시작했을 때, 나는 세상의 지식을 나만의 방식으로 정리해보고 싶었습니다.',
    aboutTimeline1Date: '2025.05.11',
    aboutTimeline1Text: '그 꿈을 위한 기획을 세웠고',
    aboutTimeline2Date: '2026.04.05',
    aboutTimeline2Text: 'Dechive라는 작은 도서관이 생겼습니다.',
    aboutBrand: 'Dechive',
    spaceArchiveTitle: '정제된 지식',
    spaceArchiveDesc: 'AI 프롬프트 엔지니어링, SQL, 개발 개념을 주제별로 정리. 한 편으로 하나의 생각을 다룹니다.',
    aboutContactCta: '같이 이야기해요',
    spacesLabel: 'Spaces',

    // Contact
    contactDesc: '질문, 피드백, 협업 제안 무엇이든 환영해요.',

    // Common
    comingSoon: 'Coming Soon',
    noRecords: '아직 기록이 없습니다.',

    // BookArchive
    archiveLabel: 'Dechive',
    infiniteArchive: '무한서고',
    allPosts: '전체 기록',
    categoryLabel: 'Category',
    subjectLabel: 'Subject',
    episodes: '편',

    // GuestBook
    guestBookTitle: '방명록 입장',
    guestBookNickname: '닉네임',
    guestBookPassword: '비밀번호',
    guestBookMessage: '한 마디 남겨주세요...',
    guestBookSubmit: '등록',

    // TableOfContents
    tocTitle: '목차',

    // ChatDrawer
    chatGreeting: '안녕하세요. 오늘도 좋은 하루입니다.\n무엇을 도와드릴까요?',
    chatPlaceholder: '키워드를 입력하세요...',
    chatSearching: '사서가 찾는 중...',
    chatLibrarian: 'Dechive 사서',
    chatError: '오류가 발생했어요. 잠시 후 다시 시도해주세요.',
    chatFallback: '답변을 가져오지 못했어요.',
  },

  en: {
    // Home
    homeTagline1: 'A library where thoughts stay',
    homeTagline2: 'When thoughts become records,\nmeaning is born.',
    homeBrowseRecords: 'Browse Records',
    homeRandomRecord: 'Open a Random Record',
    enterArchive: 'Enter Library',

    // About
    aboutLabel: 'About Demian',
    aboutRole: 'Knowledge Explorer',
    aboutBio: 'With 4 years of teaching experience, I break down complex knowledge so anyone can understand it. The records keep going.',
    aboutSkillsLabel: 'Skills & Tools',
    aboutPhilosophyLabel: 'The Dechive Philosophy',
    aboutPhilosophyQuote: 'Every morning, a new AI.\nMore convenience. More hallucination.\nSo I verify it myself. And I write it down.',
    aboutGetLabel: 'What You Can Find Here',
    aboutKicker: 'A library where thoughts stay',
    aboutDefinition: 'Dechive is a personal library for recording thoughts and knowledge, then returning to explore them again.',
    aboutPurpose: 'In an age where AI can generate countless answers, it was built to avoid simply consuming passing information and instead read, verify, and record it by hand.',
    aboutReading: 'The records here do not end as isolated posts. They gather by subject, connect through tags, and lead back into other records.',
    aboutExplore: 'In Dechive, you can follow records by subject, discover posts connected by tags, or open a record by chance.',
    aboutClosing: 'Dechive is not a place for collecting final answers. It is a shelf where thoughts can stay, then be taken out again.',
    aboutIntro: 'When GPT, Gemini, and Claude emerged and LLMs began reshaping the world, I wanted to organize knowledge in my own way.',
    aboutTimeline1Date: '2025.05.11',
    aboutTimeline1Text: 'The dream became a plan.',
    aboutTimeline2Date: '2026.04.05',
    aboutTimeline2Text: 'A small library called Dechive was built.',
    aboutBrand: 'Dechive',
    spaceArchiveTitle: 'Refined Knowledge',
    spaceArchiveDesc: 'AI Prompt Engineering, SQL, and dev concepts organized by subject — each record shaped around a focused idea.',
    aboutContactCta: 'Let\'s Talk',
    spacesLabel: 'Spaces',

    // Contact
    contactDesc: 'Questions, feedback, or collaboration proposals — all welcome.',

    // Common
    comingSoon: 'Coming Soon',
    noRecords: 'No records yet.',

    // BookArchive
    archiveLabel: 'Dechive',
    infiniteArchive: 'Infinite Archive',
    allPosts: 'All Posts',
    categoryLabel: 'Category',
    subjectLabel: 'Subject',
    episodes: 'ep.',

    // GuestBook
    guestBookTitle: 'GUEST BOOK',
    guestBookNickname: 'Nickname',
    guestBookPassword: 'Password',
    guestBookMessage: 'Leave a message...',
    guestBookSubmit: 'Submit',

    // TableOfContents
    tocTitle: 'On this page',

    // ChatDrawer
    chatGreeting: 'Hello. Hope you have a wonderful day.\nHow can I help you?',
    chatPlaceholder: 'Enter a keyword...',
    chatSearching: 'Searching...',
    chatLibrarian: 'Dechive Librarian',
    chatError: 'An error occurred. Please try again later.',
    chatFallback: 'Unable to retrieve a response.',
  },
} as const;

export default i18n;
