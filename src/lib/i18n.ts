export type Lang = 'ko' | 'en';

const i18n = {
  ko: {
    // Home
    homeTagline1: '생각이 머무는 도서관',
    homeTagline2: '생각이 기록이 되는 순간,\n의미를 가진다.',
    homeBrowseRecords: '기록 둘러보기',
    homeRandomRecord: '아무 기록이나 펼쳐보기',

    // About
    aboutKicker: 'About Dechive',
    aboutTitle: '검증의 시대',
    aboutDefinition: 'AI가 답을 만드는 시대에도,\n그 답을 믿을지 결정하는 일은 사람에게 남아 있습니다.',
    aboutPurpose: 'Dechive는 그 판단을 위해\n질문과 이해를 기록하는 개인 지식 아카이브입니다.',
    aboutWhyTitle: 'Why',
    aboutWhyDescription: '빠른 답은 쉬워졌지만,\n그 답이 왜 맞는지, 언제 틀릴 수 있는지는\n여전히 사람이 검토해야 합니다.',
    aboutHowTitle: 'How',
    aboutHowDescription: '책과 문서, 코드와 AI 사이에서 붙잡은 질문을\n다시 꺼내볼 수 있는 기록으로 남깁니다.',
    aboutArchiveTitle: 'Archive',
    aboutArchiveDescription: '하나의 질문에서 출발해 남긴 독립 기록입니다.\n각 글은 이어지는 시리즈가 아니라,\n다시 꺼내볼 수 있는 이해의 조각입니다.',
    aboutDeepDiveTitle: 'Deep Dive',
    aboutDeepDiveDescription: '하나의 깊은 질문을 끝까지 밀고 가는 심층 문서입니다.\n개념, 예시, 실수, 한계, 추론, 검증 기준까지 길게 정리합니다.',
    aboutExplore: 'Dechive는 정답을 모아두는 공간이 아닙니다.',
    aboutClosing: '질문을 남기고,\n이해를 쌓고,\n다시 검증하기 위한 서가입니다.',
    aboutContactTitle: '사서에게 닿을 곳',
    aboutContactEmail: 'heavenis0113@gmail.com',

    // Common
    noRecords: '아직 기록이 없습니다.',

    // BookArchive
    archiveLabel: 'Dechive',
    infiniteArchive: '무한서고',
    allPosts: '전체 기록',
    categoryLabel: 'Category',
    subjectLabel: 'Subject',
    recordCount: '개의 기록',

    // GuestBook
    guestBookNickname: '닉네임',
    guestBookPassword: '비밀번호',
    guestBookMessage: '검증해보고 싶은 질문이나 AI 답변을 남겨주세요...',
    guestBookSubmit: '질문 남기기',

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

    // About
    aboutKicker: 'About Dechive',
    aboutTitle: 'The Age of Verification',
    aboutDefinition: 'Even in an age where AI can produce answers,\nthe decision to trust them still belongs to people.',
    aboutPurpose: 'Dechive is a personal knowledge archive\nfor recording questions and understanding behind that judgment.',
    aboutWhyTitle: 'Why',
    aboutWhyDescription: 'Fast answers are easier now,\nbut why an answer is right and when it can fail\nstill need human review.',
    aboutHowTitle: 'How',
    aboutHowDescription: 'Questions caught between books, documents, code, and AI\nare kept as records that can be opened again.',
    aboutArchiveTitle: 'Archive',
    aboutArchiveDescription: 'Independent records that begin with one question.\nEach post is not part of a series,\nbut a fragment of understanding that can be reopened.',
    aboutDeepDiveTitle: 'Deep Dive',
    aboutDeepDiveDescription: 'A long-form document that carries one deep question to the end.\nIt organizes concepts, examples, mistakes, limits, reasoning, and verification criteria.',
    aboutExplore: 'Dechive is not a place for collecting final answers.',
    aboutClosing: 'It leaves questions,\nbuilds understanding,\nand keeps a shelf for verification.',
    aboutContactTitle: 'Where to reach the librarian',
    aboutContactEmail: 'heavenis0113@gmail.com',

    // Common
    noRecords: 'No records yet.',

    // BookArchive
    archiveLabel: 'Dechive',
    infiniteArchive: 'Infinite Archive',
    allPosts: 'All Posts',
    categoryLabel: 'Category',
    subjectLabel: 'Subject',
    recordCount: ' records',

    // GuestBook
    guestBookNickname: 'Nickname',
    guestBookPassword: 'Password',
    guestBookMessage: 'Leave a question or an AI answer to verify...',
    guestBookSubmit: 'Leave Question',

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
