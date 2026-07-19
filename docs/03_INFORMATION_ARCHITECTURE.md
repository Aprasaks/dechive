# Information Architecture

- **Status:** Proposed; URL decisions gated
- **Last Updated:** 2026-07-18
- **Authority:** 공개 navigation, route, taxonomy 기준
- **Purpose:** 최종 정보 구조를 정의하면서 기존 URL 보존 조건을 명시한다.

## 목표 트리

```text
/
├─ knowledge/                 지식 목록 및 상세
├─ courses/                   과정 목록
│  └─ [course]/[lesson]/      개별 강의
├─ practice/                  실습 목록 및 상세
├─ ai-updates/                업데이트 목록 및 상세
├─ about/
└─ search/
```

영문 제공 범위와 locale URL은 별도 결정 전 현재 `/en/archive`, `/en/deep-dive`를 유지한다. 한국어 menu label과 영문 path의 조합은 SEO·운영 편의상 권장하지만 최종 path는 `DECISIONS.md` D-03에서 승인한다.

## 기존 URL 정책

- `/archive/**`, `/deep-dive/**`, `/book/**`, `/library`, `/issues/**`, `/en/**`, feed URL을 마이그레이션 완료 전 유지한다.
- 새 유형으로 매핑하더라도 가능하면 기존 canonical URL을 그대로 제공한다. 변경이 필요하면 manifest 기반 permanent redirect와 canonical을 함께 배포한다.
- sitemap에는 공개·canonical·indexable URL만 포함한다. admin/search query/preview/draft는 제외한다.

## 분류와 탐색

공통 taxonomy는 content type, topic, level, format, tool, status를 분리한다. tag 자유 입력만으로 navigation을 만들지 않는다. 관련 콘텐츠는 명시적 relation(type, source, target, order, note)으로 저장한다.

## 검색 UX

Header 검색창은 짧은 query 진입점이며 결과 페이지에서 유형·주제·난이도·최종 확인일 필터를 제공한다. 메인 hero 검색은 두지 않는다. 상세는 [Search and AI](10_SEARCH_AND_AI.md)를 따른다.
