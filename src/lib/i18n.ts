export type Lang = 'ko' | 'en';

const i18n = {
  ko: {
    // Home
    homeTagline1: '생각이 기록이 되는 순간',
    homeTagline2: '의미를 가진다.',
    enterArchive: '서고 입장 →',

    // About
    aboutLabel: 'Dechive',
    aboutTagline1: '기록되어지는 지식은',
    aboutTagline2: '가치를 가진다.',
    aboutDesc: '수많은 정보 속에서 의미 있는 것을 골라내고, 재정립하여 지식으로 만드는 공간. Dechive는 그 과정을 투명하게 기록합니다.',
    spacesLabel: 'Spaces',
    spaceArchiveDesc: '수집된 지식을 정제하고 기록하는 공간. 기술, 철학, 사유의 흔적들이 쌓인다.',
    spaceProjectsDesc: '직접 만들고 부수며 배운 것들의 기록. 아이디어가 코드가 되는 과정.',
    spaceLogsDesc: 'AI와 함께하는 트러블슈팅과 데일리 로그. 날것의 성장 기록.',

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
    enterArchive: 'Enter Archive →',

    // About
    aboutLabel: 'Dechive',
    aboutTagline1: 'Knowledge that is recorded',
    aboutTagline2: 'holds value.',
    aboutDesc: 'A space for filtering meaning from an ocean of information — restructuring it into knowledge. Dechive documents that process with transparency.',
    spacesLabel: 'Spaces',
    spaceArchiveDesc: 'A space where collected knowledge is refined and recorded. Layers of technology, philosophy, and thought.',
    spaceProjectsDesc: 'Records of building and breaking things. The process of turning ideas into code.',
    spaceLogsDesc: 'Troubleshooting and daily logs with AI. Raw records of growth.',

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
