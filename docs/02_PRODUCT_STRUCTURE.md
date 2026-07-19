# Product Structure

- **Status:** Approved baseline
- **Last Updated:** 2026-07-18
- **Authority:** 제품 영역과 역할의 기준
- **Purpose:** 공개 제품과 운영 도구의 경계를 정의한다.

## 공개 영역

| 영역 | 역할 | 대표 산출물 |
|---|---|---|
| 메인 | 학습 시작점과 편집된 추천 | hero, 4개 진입점, 주목 콘텐츠, Dechive 이야기 |
| 지식 | 독립 개념·질문을 이해하는 문서 | article, guide, reference |
| 강의 | 목표와 순서가 있는 학습 과정 | course, module, lesson |
| 실습 | 입력·단계·결과·검증이 있는 실행 자료 | exercise, lab, download |
| AI 업데이트 | 변화, 영향, 근거, 확인일 | update record |
| About | 운영 철학과 제작자/플랫폼 설명 | story, policy links |
| 검색 | 모든 공개 콘텐츠 통합 탐색 | keyword/filter/result |

커뮤니티, 카페, 당근 모임, YouTube, Discord는 top-level 메뉴가 아니다. 외부 배포 채널은 필요한 콘텐츠/푸터 문맥에서만 연결한다.

## 운영 영역

관리자는 콘텐츠, 관계, 출처, 미디어, SEO/공유 정보, revision, 발행 상태를 관리한다. 공개 제품과 동일 DB를 사용하되 인증·권한·audit log 경계를 둔다. 상세 흐름은 [Editor and Admin](08_EDITOR_AND_ADMIN.md)에 둔다.

## 메인 구조

Header(`DECHIVE | 지식 | 강의 | 실습 | AI 업데이트 | About | 검색창`) → hero(“배우고, 이해하고, 직접 해보는 AI”) → 4개 영역 진입 → 주목 콘텐츠+`DECHIVE 이야기` → footer(DECHIVE, 이메일 구독, Buy Me a Coffee, 정책/저작권).

CTA는 `처음부터 배우기`, `지식 찾아보기`를 기준으로 하되 실제 시작 과정/지식 route가 준비된 뒤 연결한다.
