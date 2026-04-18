export type Lang = 'ko' | 'en';

const i18n = {
  ko: {
    // Home
    homeTagline1: '생각이 기록이 되는 순간',
    homeTagline2: '의미를 가진다.',
    enterArchive: '아카이브 입장',

    // About
    aboutLabel: 'About Demian',
    aboutRole: '기록하는 학습자',
    aboutBio: '4년간의 강의 경험을 토대로 누구나 쉽게 이해할 수 있게 지식을 정리합니다. 기록은 계속됩니다.',
    aboutSkillsLabel: 'Skills & Tools',
    aboutPhilosophyLabel: 'Dechive 철학',
    aboutPhilosophyQuote: '자고 일어나면 AI가 또 바뀌어 있는 시대,\n편리함과 함께 수많은 할루시네이션도 함께 왔습니다.\n그래서 직접 검증하고, 직접 기록합니다.',
    aboutGetLabel: '이 서고에서 얻을 수 있는 것',
    aboutIntro: 'GPT, Gemini, Claude가 나오고\nLLM과 머신러닝이 세상을 뒤흔들 때,\n세상의 모든 지식을 정리해보자는 꿈을 가지기 시작했다.',
    aboutTimeline1Date: '2025.05.11',
    aboutTimeline1Text: '그 꿈을 위한 기획을 세웠고',
    aboutTimeline2Date: '2026.04.05',
    aboutTimeline2Text: '나의 도서관이 생겼다.',
    aboutClosing: 'AI 전성시대, 수많은 정보를 손쉽게 얻을 수 있지만\n수많은 거짓 정보도 함께 넘쳐난다.\n직접 검증하고, 직접 기록한 Demian의 아카이브.',
    aboutBrand: 'Dechive',
    spaceArchiveTitle: '정제된 지식',
    spaceArchiveDesc: 'AI 프롬프트 엔지니어링, SQL, 개발 개념을 시리즈로 정리. 한 편으로 주제를 완결합니다.',
    spaceLogsTitle: '날것의 기록',
    spaceLogsDesc: '에러, 삽질, 해결. AI와 함께하는 현장 트러블슈팅을 날것 그대로 기록합니다.',
    spaceProjectsTitle: '만들어가는 과정',
    spaceProjectsDesc: '아이디어를 코드로 만드는 과정. 완성된 결과물보다 그 여정이 더 값집니다.',
    aboutContactCta: '같이 이야기해요',
    spacesLabel: 'Spaces',

    // Logs
    logsLabel: 'Dechive · Logs',
    logsTagline: '날것의 성장을 기록한다.',
    logsDesc: '에러, 삽질, 해결. 정제되지 않은 현장 기록.',
    logsEmpty: '로그 기록들이 곧 채워질 예정입니다.',

    // Projects
    projectsLabel: 'Dechive · Projects',
    projectsTagline1: '아이디어가 코드가 되는',
    projectsTagline2: '과정을 기록한다.',
    projectsDesc: '직접 만들고, 부수고, 다시 만드는 과정에서 배운 것들을 기록하는 공간. 완성된 결과물보다 그 과정이 더 값지다.',
    projectsEmpty: '프로젝트 기록들이 곧 채워질 예정입니다.',

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
    seriesLabel: 'Series',
    episodes: '편',

    // GuestBook
    guestBookTitle: 'GUEST BOOK',
    guestBookNickname: '닉네임',
    guestBookPassword: '비밀번호',
    guestBookMessage: '한 마디 남겨주세요...',
    guestBookSubmit: '등록',

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
    homeTagline1: 'When thoughts become records,',
    homeTagline2: 'meaning is born.',
    enterArchive: 'Enter Library',

    // About
    aboutLabel: 'About Demian',
    aboutRole: 'Knowledge Explorer',
    aboutBio: 'With 4 years of teaching experience, I break down complex knowledge so anyone can understand it. The records keep going.',
    aboutSkillsLabel: 'Skills & Tools',
    aboutPhilosophyLabel: 'The Dechive Philosophy',
    aboutPhilosophyQuote: 'Every morning, a new AI.\nMore convenience. More hallucination.\nSo I verify it myself. And I write it down.',
    aboutGetLabel: 'What You Can Find Here',
    aboutIntro: 'When GPT, Gemini, and Claude emerged\nand LLMs began reshaping the world,\na dream was born — to organize all the world\'s knowledge.',
    aboutTimeline1Date: '2025.05.11',
    aboutTimeline1Text: 'The dream became a plan.',
    aboutTimeline2Date: '2026.04.05',
    aboutTimeline2Text: 'The library was built.',
    aboutClosing: 'In the age of AI, information is everywhere.\nBut so is misinformation.\nThis is Demian\'s archive — verified and recorded by hand.',
    aboutBrand: 'Dechive',
    spaceArchiveTitle: 'Refined Knowledge',
    spaceArchiveDesc: 'AI Prompt Engineering, SQL, and dev concepts organized into series — each post designed to stand alone.',
    spaceLogsTitle: 'Raw Records',
    spaceLogsDesc: 'Errors, struggles, solutions. Real-time troubleshooting logs with AI, unfiltered.',
    spaceProjectsTitle: 'Works in Progress',
    spaceProjectsDesc: 'Turning ideas into code. The journey matters more than the finished product.',
    aboutContactCta: 'Let\'s Talk',
    spacesLabel: 'Spaces',

    // Logs
    logsLabel: 'Dechive · Logs',
    logsTagline: 'Recording raw growth.',
    logsDesc: 'Errors, struggles, solutions. Unfiltered field notes.',
    logsEmpty: 'Log entries will be added soon.',

    // Projects
    projectsLabel: 'Dechive · Projects',
    projectsTagline1: 'Where ideas become code —',
    projectsTagline2: 'the process is recorded.',
    projectsDesc: 'A space for recording what is learned through building, breaking, and rebuilding. The process is worth more than the finished product.',
    projectsEmpty: 'Project records will be added soon.',

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
    seriesLabel: 'Series',
    episodes: 'ep.',

    // GuestBook
    guestBookTitle: 'GUEST BOOK',
    guestBookNickname: 'Nickname',
    guestBookPassword: 'Password',
    guestBookMessage: 'Leave a message...',
    guestBookSubmit: 'Submit',

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
