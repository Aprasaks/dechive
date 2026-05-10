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
    aboutDefinition: 'Dechive는 생각과 지식을 기록하고\n다시 탐색하기 위한 개인 도서관입니다.',
    aboutPurpose: '빠르게 지나가는 정보는 쉽게 소비되고,\n쉽게 잊힙니다.\nDechive는 그 흐름 속에서 필요한 생각을 붙잡아,\n다시 꺼내 읽을 수 있는 기록으로 남깁니다.',
    aboutReading: '이곳의 글은 단순한 포스트가 아니라\n하나의 짧은 책입니다.\n각 기록은 주제 책장에 놓이고,\n태그라는 색인을 따라 다른 기록과 조용히 이어집니다.',
    aboutExplore: 'Dechive는 정답을 모아두는 공간이 아닙니다.',
    aboutClosing: '생각이 머물고,\n다시 꺼내지고,\n다른 생각과 맞닿는 서가입니다.',
    aboutContactTitle: '사서에게 닿을 곳',
    aboutContactEmail: 'heavenis0113@gmail.com',
    aboutBrand: 'Dechive',
    spaceArchiveTitle: '정제된 지식',
    spaceArchiveDesc: 'AI 프롬프트 엔지니어링, SQL, 개발 개념을 주제별로 정리. 한 편으로 하나의 생각을 다룹니다.',
    aboutContactCta: '같이 이야기해요',
    spacesLabel: 'Spaces',

    // Common
    comingSoon: 'Coming Soon',
    noRecords: '아직 기록이 없습니다.',

    // BookArchive
    archiveLabel: 'Dechive',
    infiniteArchive: '무한서고',
    allPosts: '전체 기록',
    categoryLabel: 'Category',
    subjectLabel: 'Subject',
    recordCount: '개의 기록',

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
    aboutDefinition: 'Dechive is a personal library for recording thoughts and knowledge,\nthen returning to explore them again.',
    aboutPurpose: 'Fast-moving information is easily consumed\nand easily forgotten.\nDechive holds onto the thoughts worth keeping\nand leaves them as records that can be opened again.',
    aboutReading: 'The writing here is not just a set of posts,\nbut a shelf of short books.\nEach record rests on a subject shelf\nand connects quietly through tags as an index.',
    aboutExplore: 'Dechive is not a place for collecting final answers.',
    aboutClosing: 'It is a shelf where thoughts can stay,\nbe taken out again,\nand meet other thoughts.',
    aboutContactTitle: 'Where to reach the librarian',
    aboutContactEmail: 'heavenis0113@gmail.com',
    aboutBrand: 'Dechive',
    spaceArchiveTitle: 'Refined Knowledge',
    spaceArchiveDesc: 'AI Prompt Engineering, SQL, and dev concepts organized by subject — each record shaped around a focused idea.',
    aboutContactCta: 'Let\'s Talk',
    spacesLabel: 'Spaces',

    // Common
    comingSoon: 'Coming Soon',
    noRecords: 'No records yet.',

    // BookArchive
    archiveLabel: 'Dechive',
    infiniteArchive: 'Infinite Archive',
    allPosts: 'All Posts',
    categoryLabel: 'Category',
    subjectLabel: 'Subject',
    recordCount: ' records',

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
