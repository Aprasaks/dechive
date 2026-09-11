# DECHIVE 작업 기준

이 저장소는 2026년 9월 전면 재구축 버전이다. 과거 코드·문서·슬러그·콘텐츠 모델은 새 구현의 근거로 사용하지 않는다. 제품 판단은 `docs/PROJECT_CONSTITUTION.md`를 최우선으로 따른다.

## 제품 정의

Dechive는 AI를 이해하고 다루는 데 필요한 지식을 사람이 확인하고 자신의 언어로 다시 설명해 축적하는 공개 지식 저장소다.

- 핵심 영역: `Knowledge`, `Lecture`, `Practice`, `AI Update`, `Books`
- Knowledge는 독립된 개념 지식이다.
- Lecture는 여러 Knowledge를 학습 순서로 묶고 영상과 자료로 설명한다.
- Practice는 실제 결과물 하나와 그 제작 과정을 기록한다.
- AI Update는 날짜별로 반드시 알아야 할 변화만 정리한다.
- Books는 출판물을 소개하고 외부 판매처로 연결한다.
- 공개 사이트에는 회원가입, 진도율, 수료, 평점 기능을 만들지 않는다.
- Jarvis는 사이트 기능이 아니다. 이후 읽기 전용 API로 연결되는 별도 로컬 시스템이다.

## 원본과 저장소

- Dechive 관리자 에디터가 콘텐츠의 canonical source다.
- Supabase Postgres는 글·revision·출처·관계·검증 이력의 원본이다.
- Supabase Storage는 이미지·PDF·강의자료의 원본이다.
- TipTap JSON을 본문 원본으로 저장하고 HTML·plain text·Markdown은 파생 산출물로 만든다.
- 자동 저장 초안과 immutable 발행 revision을 분리한다.
- 임베딩은 검색용 파생 데이터이며 원본이 아니다.
- Jarvis는 전용 변경분 API를 통해 읽기 전용 사본을 동기화한다.

## 디자인

- 라이트 테마만 제공한다.
- 밝고 차가운 종이색 배경, 짙은 먹색 본문, 선명한 코발트 블루를 주색으로 사용한다. 붉은 포인트는 날짜나 변화처럼 의미가 있을 때만 제한적으로 쓴다.
- 편집 잡지처럼 정보가 풍부하지만 차분하고 읽기 쉬워야 한다.
- 물리적인 서가를 모사하지 않는다.
- 모든 영역을 둥근 카드로 만들지 않는다.
- 네온, 글래스모피즘, 과한 그라데이션, SaaS 통계 화면을 사용하지 않는다.
- 콘텐츠 이미지에 로봇·발광 소재가 등장하는 것은 금지하지 않는다.
- 사용자가 명시적으로 요청하기 전에는 이미지를 생성하지 않는다.

## 코드 원칙

- Next.js App Router와 TypeScript strict를 사용한다.
- 새 `any`를 사용하지 않는다.
- Supabase 접근은 browser/server/admin 경계를 분리한다.
- 서비스 역할 키와 DB 비밀번호를 클라이언트 코드·문서·로그에 노출하지 않는다.
- 공개 조회는 발행된 public revision만 반환해야 한다.
- 데이터 삭제는 soft delete와 change event를 남기는 것을 기본으로 한다.
- 패키지는 실제 필요가 확인된 경우에만 추가한다.
- 관련 없는 사용자 작업을 되돌리지 않는다.

## 작업 순서

1. `docs/PROJECT_CONSTITUTION.md`
2. `docs/CONTENT_AND_PAGES.md`
3. `docs/SYSTEM_ARCHITECTURE.md`
4. `docs/IMPLEMENTATION_PLAN.md`
5. 스키마와 RLS
6. 관리자 에디터
7. 공개 페이지
8. 검색과 Jarvis API

## 검증

```bash
npm run lint
npm run build
```

DB 변경은 새 Supabase 프로젝트용 SQL migration과 생성된 TypeScript 타입을 함께 검증한다.
