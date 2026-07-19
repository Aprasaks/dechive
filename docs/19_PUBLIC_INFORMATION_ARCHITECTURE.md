# Stage 19 Public Information Architecture

현재 공개 핵심 메뉴는 Knowledge, Deep Dive, AI Updates, Book, About이다. Knowledge는 새 published CMS Knowledge의 첫 공개 진입점이며 `/knowledge`로 연결한다. `/archive`와 `/en/archive`는 legacy Markdown 및 SEO URL 보존을 위해 유지하되 주 메뉴에서 Knowledge와 중복 노출하지 않는다.

Header와 mobile menu는 동일한 실제 route만 사용하며 active state와 focus style을 제공한다. Footer도 같은 공개 경로를 사용한다. `/library`는 기존 `/book` redirect를 유지하며 Book 메뉴는 `/book` 하나로 통일한다. Projects는 현재 public route가 없으므로 허위 메뉴를 만들지 않는다.

한국어·영어 Archive/Deep Dive route는 유지한다. Knowledge 영어 공개 정책은 미결정이며 번역되지 않은 Knowledge의 `/en` fallback을 생성하지 않는다. Homepage는 published Knowledge count를 읽어 `/knowledge` 진입 링크에만 사용하며 미발행 데이터를 노출하지 않는다.

Stage 20은 Lecture 공개 준비를 검토할 수 있으나 lecture publish, public renderer, locale policy는 별도 결정이 필요하다. Production은 사용하지 않았다.
