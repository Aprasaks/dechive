# Analytics, SEO and Sharing

- **Status:** Proposed requirements; current SEO retained
- **Last Updated:** 2026-07-18
- **Authority:** 측정·검색 노출·공유 기능 기준
- **Purpose:** 신뢰와 유입을 URL·metadata·event 수준에서 일관되게 관리한다.

## SEO

각 published content는 canonical, locale alternate, title/description, OG/Twitter, share asset, robots policy, structured data, sitemap lastmod를 가진다. 과정은 Course/ItemList, article/update는 Article 계열, breadcrumb를 실제 구조와 맞춘다. Search Console ownership/monitoring은 별도 운영 checklist로 추가한다.

기존 `Metadata`, canonical, JSON-LD, sitemap, robots, RSS를 유지하되 새 DB published revision에서 생성하도록 이전한다. redirect manifest와 404/soft-404/canonical mismatch를 배포 전 crawl한다.

## 공유

모든 지식·과정·강의·실습·업데이트 상세 상단에 share button, 하단에 문맥 있는 share 영역을 둔다. Web Share API 성공/취소를 처리하고 미지원/실패 시 clipboard fallback과 accessible confirmation을 제공한다.

event 후보: `share_open`, `share_complete`, `copy_link`, channel/content id/type/revision/location. URL query나 개인정보를 payload에 넣지 않는다.

## 분석 선택

현재 GA4와 GA Data API 관리 화면이 있다. GA4는 marketing ecosystem 필요성을 기준으로 유지 여부를 정하고, privacy/소유권이 우선이면 Umami/Plausible self-host/managed를 비교한다. 두 도구 중복 운영은 migration 측정 기간 외 피한다. consent/retention/opt-out 정책과 핵심 funnel(학습 시작→lesson→practice completion)을 먼저 정의한다.

## 구독

double opt-in, consent evidence, unsubscribe, suppression/export/delete, bounce/abuse 처리가 가능한 provider/API를 선택한다. subscriber DB 소유권과 export를 보장하며 footer form만 먼저 만들어 주소를 임시 저장하지 않는다.
