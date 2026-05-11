export type Lang = 'ko' | 'en';

const i18n = {
  ko: {
    // Home
    homeTagline1: '생각이 머무는 도서관',
    homeTagline2: '생각이 기록이 되는 순간,\n의미를 가진다.',
    homeBrowseRecords: '기록 둘러보기',
    homeRandomRecord: '아무 기록이나 펼쳐보기',

    // About
    aboutKicker: '생각이 머무는 도서관',
    aboutDefinition: 'Dechive는 생각과 지식을 기록하고\n다시 탐색하기 위한 개인 도서관입니다.',
    aboutPurpose: '빠르게 지나가는 정보는 쉽게 소비되고,\n쉽게 잊힙니다.\nDechive는 그 흐름 속에서 필요한 생각을 붙잡아,\n다시 꺼내 읽을 수 있는 기록으로 남깁니다.',
    aboutReading: '이곳의 글은 단순한 포스트가 아니라\n하나의 짧은 책입니다.\n각 기록은 주제 책장에 놓이고,\n태그라는 색인을 따라 다른 기록과 조용히 이어집니다.',
    aboutExplore: 'Dechive는 정답을 모아두는 공간이 아닙니다.',
    aboutClosing: '생각이 머물고,\n다시 꺼내지고,\n다른 생각과 맞닿는 서가입니다.',
    aboutContactTitle: '사서에게 닿을 곳',
    aboutContactEmail: 'heavenis0113@gmail.com',
    aboutBrand: 'Dechive',

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

    // About
    aboutKicker: 'A library where thoughts stay',
    aboutDefinition: 'Dechive is a personal library for recording thoughts and knowledge,\nthen returning to explore them again.',
    aboutPurpose: 'Fast-moving information is easily consumed\nand easily forgotten.\nDechive holds onto the thoughts worth keeping\nand leaves them as records that can be opened again.',
    aboutReading: 'The writing here is not just a set of posts,\nbut a shelf of short books.\nEach record rests on a subject shelf\nand connects quietly through tags as an index.',
    aboutExplore: 'Dechive is not a place for collecting final answers.',
    aboutClosing: 'It is a shelf where thoughts can stay,\nbe taken out again,\nand meet other thoughts.',
    aboutContactTitle: 'Where to reach the librarian',
    aboutContactEmail: 'heavenis0113@gmail.com',
    aboutBrand: 'Dechive',

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
