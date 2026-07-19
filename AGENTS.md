# AGENTS.md

## Dechive 정의

Dechive는 **사람이 직접 공부하고 이해한 내용을 지식, 강의, 실습, AI 업데이트로 다시 구성하는 독립적인 학습 플랫폼**이다. 제품·정보 구조의 기준은 [프로젝트 비전](docs/00_PROJECT_VISION.md)과 [제품 구조](docs/02_PRODUCT_STRUCTURE.md)를 따른다.

## 절대 금지 사항

- 일반 블로그, Markdown 아카이브, AI SaaS·뉴스 수집·커뮤니티·영상 목록 사이트로 만들지 않는다.
- Obsidian 또는 외부 문서 도구를 canonical source로 삼거나 새 연동을 추가하지 않는다.
- 기존 콘텐츠·URL·slug를 승인 없이 삭제하거나 변경하지 않는다.
- 조사·결정 없이 DB, Docker, 인증, 검색 엔진, AI 챗봇, 대규모 패키지를 도입하지 않는다.
- 네온, 글래스모피즘, 홀로그램, AI 얼굴·로봇, 무의미한 애니메이션, SaaS 통계, 과장 문구를 사용하지 않는다.

## 디자인 절대 규칙

- 라이트 모드만 제공한다. 다크모드, 테마 토글, 시스템 다크모드 대응을 구현하지 않는다.
- 따뜻한 흰색·크림·옅은 회색 배경, 짙은 남색/차분한 청색 포인트, 높은 본문 가독성과 충분한 여백을 사용한다.
- 모든 영역을 둥근 카드로 만들거나 과도한 그림자·그라데이션을 사용하지 않는다.
- 이미지는 콘텐츠 데이터로 다루며 대표 이미지는 전체 구도가 보이게 한다. 세부 기준은 [디자인 시스템](docs/05_DESIGN_SYSTEM.md)과 [미디어 시스템](docs/09_MEDIA_SYSTEM.md)을 따른다.

## 기술 선택과 데이터 보호

- 요구 해결성, 활동성, 라이선스, TypeScript/Next.js·Docker 호환성, 데이터 소유권·내보내기·교체 가능성, 운영·보안·백업·한국어·비용을 비교한 뒤 채택한다.
- 기존 Markdown과 정적 데이터는 이전 대상 원본으로 보존한다. 새 시스템의 검증된 이전과 롤백이 끝나기 전 제거하지 않는다.
- AI 산출물은 자동 발행하지 않으며 운영자 승인과 공급자 교체 경계를 둔다.

## 작업별 필수 참고 문서

- 제품/IA: [02_PRODUCT_STRUCTURE](docs/02_PRODUCT_STRUCTURE.md), [03_INFORMATION_ARCHITECTURE](docs/03_INFORMATION_ARCHITECTURE.md)
- 콘텐츠/DB/관리자: [04_CONTENT_SYSTEM](docs/04_CONTENT_SYSTEM.md), [07_DATABASE_SCHEMA](docs/07_DATABASE_SCHEMA.md), [08_EDITOR_AND_ADMIN](docs/08_EDITOR_AND_ADMIN.md)
- UI/이미지: [05_DESIGN_SYSTEM](docs/05_DESIGN_SYSTEM.md), [09_MEDIA_SYSTEM](docs/09_MEDIA_SYSTEM.md)
- 검색/AI/SEO: [10_SEARCH_AND_AI](docs/10_SEARCH_AND_AI.md), [11_ANALYTICS_SEO_AND_SHARING](docs/11_ANALYTICS_SEO_AND_SHARING.md)
- 인프라/이전: [12_INFRASTRUCTURE_AND_OPERATIONS](docs/12_INFRASTRUCTURE_AND_OPERATIONS.md), [13_MIGRATION_PLAN](docs/13_MIGRATION_PLAN.md)
- 구현 전: [DECISIONS](docs/DECISIONS.md), [IMPLEMENTATION_ROADMAP](docs/IMPLEMENTATION_ROADMAP.md)

## 코드 규칙

- Next.js App Router와 기존 라우트를 보존하고 TypeScript strict를 유지한다. 새 `any`를 사용하지 않는다.
- Tailwind CSS 중심으로 구현하고 새 패키지는 승인된 결정 기록 뒤에만 추가한다.
- 비밀값을 코드·문서·로그에 노출하지 않는다. 관련 없는 사용자 변경을 되돌리지 않는다.
- 콘텐츠 모델·이미지·URL 변경은 마이그레이션과 롤백을 함께 설계한다.

## 테스트 명령어

```bash
npm run check:content
npm run lint
npm run build
```

## 완료 보고 형식

1. 변경 파일
2. 주요 변경 내용
3. 반응형 처리 방식(해당 시)
4. 확인 결과와 실행 명령
5. 데이터·URL 위험 및 롤백
6. 남은 TODO와 사용자 결정 항목
