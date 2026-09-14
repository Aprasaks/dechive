export type BookPurchaseLink = {
  label: string;
  url: string;
};

export const FEATURED_BOOK = {
  title: '만들기 전에 검증하라',
  subtitle: '바이브코딩, 1인 창업, AI SaaS의 착각들',
  author: '윤강혁',
  publisher: 'e퍼플',
  publicationDate: '2026-09-04',
  isbn: '9791139063158',
  pageCount: 155,
  format: 'PDF 전자책',
  cover: '/images/books/build-before-verify-cover.jpg',
  coverAlt: '만들기 전에 검증하라 전자책 표지',
  summary:
    'AI가 빠르게 만들어주는 시대에도 무엇을 왜 만들지, 누가 필요로 하는지, 무엇으로 검증할지는 사람이 결정해야 합니다.',
  reason:
    '아이디어를 코드로 옮기기 전에 확인해야 할 질문을 1인 빌더의 언어로 정리했습니다. 만들 수 있다는 가능성과 실제로 필요한 제품 사이의 간격을 차분하게 점검하는 책입니다.',
  problem:
    'AI에게 요청하면 작동하는 결과물은 빠르게 나옵니다. 하지만 그 결과물이 실제 문제를 해결하는지, 누군가에게 필요한지, 시간을 들여 계속 만들 가치가 있는지는 별개의 질문입니다. 이 책은 만들기 시작한 뒤 뒤늦게 흔들리지 않도록 빌드 전·중·후에 확인할 기준을 정리합니다.',
  questions: [
    '내가 풀려는 문제는 실제로 반복되는 문제인가?',
    '작동하는 코드와 필요한 제품을 어떻게 구분할까?',
    '수익화는 언제부터 질문해야 할까?',
    '버전 1.0에는 무엇을 남기고 무엇을 미뤄야 할까?',
  ],
  audiences: [
    'AI로 처음 서비스나 자동화 도구를 만드는 사람',
    '아이디어는 많지만 무엇부터 검증해야 할지 막막한 1인 빌더',
    '기능을 계속 추가하면서도 출시 기준을 잡지 못한 사람',
  ],
  takeaways: [
    '아이디어를 한 문장의 문제로 정리하는 기준',
    '기능보다 먼저 검증할 사용 흐름을 고르는 방법',
    '막연한 칭찬 대신 행동을 확인하는 피드백 질문',
    '실제 반응으로 다음 버전을 결정하는 관점',
  ],
  tableOfContents: [
    {
      part: 'Part 1',
      title: '누구나 만들 수 있게 된 시대',
      description: '바이브코딩과 1인 창업이 바꾼 제작 환경을 살펴봅니다.',
    },
    {
      part: 'Part 2',
      title: '만들기 전에 물어야 할 것들',
      description: '문제·관심·대안·지속 가능성을 먼저 확인합니다.',
    },
    {
      part: 'Part 3',
      title: '돌아가는 코드의 착각',
      description: '작동한다는 사실과 쓸 만하다는 판단을 구분합니다.',
    },
    {
      part: 'Part 4',
      title: '수익화는 언제 시작되는가',
      description: '돈보다 먼저 확인해야 할 필요와 반복의 신호를 다룹니다.',
    },
    {
      part: 'Part 5',
      title: '버전 1.0이라는 경계선',
      description: '완성이 아니라 사람 앞에 내놓을 첫 기준을 세웁니다.',
    },
    {
      part: 'Part 6',
      title: '검증 가능한 빌드',
      description: '문제 정의부터 출시 이후 기록까지 하나의 흐름으로 연결합니다.',
    },
  ],
  purchaseLinks: [
    {
      label: 'YES24',
      url: 'https://www.yes24.com/product/goods/196268816',
    },
    {
      label: '교보문고',
      url: 'https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000013551259',
    },
  ] satisfies BookPurchaseLink[],
} as const;

function isFeaturedBook(title: string) {
  return title.replaceAll(' ', '') === FEATURED_BOOK.title.replaceAll(' ', '');
}

export function resolveBookCover(
  title: string,
  cover: { url: string; alt: string } | null | undefined,
) {
  if (cover) return cover;

  return isFeaturedBook(title)
    ? { url: FEATURED_BOOK.cover, alt: FEATURED_BOOK.coverAlt }
    : null;
}

export function resolveBookPurchaseLinks(
  title: string,
  links: BookPurchaseLink[],
) {
  if (links.length > 0) return links;
  return isFeaturedBook(title) ? [...FEATURED_BOOK.purchaseLinks] : [];
}
