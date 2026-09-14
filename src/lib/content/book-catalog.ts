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
