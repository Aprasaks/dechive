# CLAUDE.md

## Dechive Project Principle

Dechive는 일반 블로그, 포트폴리오, SaaS 서비스, AI 강사 소개 페이지가 아니다.

Dechive는 **AI 시대의 질문과 검증 기록이 계속 쌓이는 공개 지식 아카이브**다.

사람들은 AI에게 답을 얻는다. Dechive는 그 답을 그대로 믿지 않고, 직접 확인하고, 기록하고, 검증한 내용을 축적한다.

강의 소개와 교육 자료는 `studio.dechive.dev`가 담당한다. `dechive.dev`는 강의 홍보가 아니라 Dechive의 글, 검증 기록, 업데이트, 전자책, 프로젝트를 보여주는 본진이다.

## Core Line

> AI는 답을 만듭니다. 우리는 그 답을 기록하고, 검증합니다.

영문 표현이 필요할 경우:

> AI creates answers. Humans verify them.

## Core Content

Dechive는 다음을 한곳에 모은다.

- Archive: 하나의 질문을 검증한 독립 기록
- DeepDive: 하나의 주제를 깊게 파고든 지식 문서
- AI Updates: 빠르게 변하는 AI 소식과 변화 기록
- 전자책: 축적된 지식을 하나의 결과물로 정리한 출판물
- Projects: 직접 만들고 실험하며 남긴 프로젝트 기록

Studio는 별도 도메인에서 강의와 실습을 담당한다.

## Domain Separation

### `dechive.dev`

- Dechive 브랜드 본진
- 글과 검증 기록 중심
- Archive, DeepDive, AI Updates, 전자책, Projects 연결
- 오늘의 기록과 최신 콘텐츠를 편집해서 보여주는 메인

### `studio.dechive.dev`

- AI 강의 소개
- 교육 프로그램
- 강의 문의
- 실습 자료
- 템플릿과 워크숍 자료

`dechive.dev` 메인을 강의 페이지처럼 만들지 않는다.

## Current Remodel Direction

현재 리메이크의 목표는 다음과 같다.

1. Dechive를 밝고 정돈된 editorial archive로 재구성한다.
2. 메인 페이지에서 검색보다 기록과 편집을 우선한다.
3. 오늘의 활동, Featured record, Browse, Latest 구조를 만든다.
4. 강의 소개와 지역 사진을 제거한다.
5. Archive, DeepDive, AI Updates, 전자책, Projects가 명확히 보이게 한다.
6. 데스크탑 기준 디자인을 먼저 확정하고 태블릿과 모바일로 확장한다.

## Header

헤더에는 다음만 둔다.

### Left

- `DECHIVE`
- `AI를 기록하고, 검증하는 아카이브`

### Navigation

- Archive
- DeepDive
- AI Updates
- 전자책
- Projects
- About

헤더에서 제거한다.

- Studio
- Contact
- 강의 문의
- 검색창
- 테마 토글
- 시간 카운터
- 로그인 / 회원가입 / 프로필 / 알림

모바일에서는 navigation을 햄버거 메뉴로 줄인다.

## Main Page Structure

### 1. Hero

큰 `DECHIVE` wordmark와 짧은 브랜드 선언을 사용한다.

권장 카피:

`AI는 답을 만듭니다.`

`우리는 그 답을 기록하고, 검증합니다.`

보조 설명은 Dechive의 역할을 한두 문장으로 설명한다.

검색창은 넣지 않는다.

### 2. Today Summary

오늘 사이트에서 일어난 변화를 작은 상태 영역으로 보여준다.

예시:

- 새로운 Archive
- AI Updates 추가
- DeepDive 수정
- 전자책 업데이트

실제 데이터로 계산할 수 없으면 허위 숫자를 표시하지 않는다.

### 3. Featured Record

가장 먼저 읽었으면 하는 글 하나를 주인공으로 보여준다.

포함 요소:

- 콘텐츠 유형
- 제목
- 짧은 설명
- 날짜
- 예상 읽기 시간
- 읽기 링크
- 실제 대표 이미지 또는 커버

스톡 이미지를 사용하지 않는다.

### 4. Browse

다음 공간으로 진입할 수 있게 한다.

- Archive
- DeepDive
- AI Updates
- 전자책
- Projects

각 항목은 짧은 설명과 링크만 둔다.

### 5. Latest

최신 글은 목록형으로 정리한다.

- Latest Archive
- Latest DeepDive
- Latest AI Updates

카드 갤러리보다 제목, 태그, 날짜 중심의 editorial list를 우선한다.

### 6. Footer

기존 확정 구조를 유지한다.

- Left: DECHIVE / copyright
- Center: `기록은 흩어지지 않을 때, 지식이 됩니다.`
- Right: 필요한 외부 링크 아이콘

## Search Direction

메인 페이지는 검색 서비스처럼 보이면 안 된다.

검색이 필요하면 Archive 또는 전체 기록 페이지에서 제공한다.

핵심 기준:

> 메인은 사용자가 무엇을 검색하게 하는 곳이 아니라, 오늘 무엇을 읽어야 하는지 보여주는 곳이다.

## Studio Direction

Studio는 별도 강의 공간이다.

`dechive.dev`에서는 Studio를 다음처럼 다루지 않는다.

- 메인 navigation
- 큰 강의 CTA
- 대상별 강의 카드
- 강의 경력 / 수강 인원 숫자
- 학교 / 기관 / 소상공인 / 학부모 섹션

필요하면 About, Projects 또는 Footer에서 작은 외부 링크로 연결한다.

## Projects Direction

Projects에는 실제로 만들고 실험한 작업을 보여준다.

예시:

- 군산.com
- AI 자동화
- AI 업데이트 시스템
- 개인 AI 관제 시스템
- 기타 실험 프로젝트

프로젝트는 단순 포트폴리오 카드가 아니라, 문제와 과정, 검증 결과를 보여주는 기록으로 다룬다.

## Visual Direction

Dechive의 새 시각 방향:

- warm white / soft ivory
- black / deep charcoal typography
- thin neutral borders
- generous whitespace
- editorial magazine layout
- text-first design
- serif display typography + clean sans-serif body
- quiet, serious, precise
- light mode only as the primary design

피해야 할 것:

- dark mode 중심 디자인
- neon / cyberpunk
- 강의 랜딩페이지
- SaaS dashboard
- 과한 gradient와 glow
- 군산 풍경 이미지
- 물리적 도서관 이미지 남용
- 관련 없는 스톡 이미지
- 카드가 지나치게 많은 포털형 구성

## Responsive Direction

### Desktop

- Header: logo/tagline + navigation
- Hero와 Today summary는 2-column 가능
- Featured와 Browse를 한 행에서 연결 가능
- Latest는 3-column editorial list

### Tablet

- Hero와 Today를 자연스럽게 재배치
- Browse 2~3열
- Latest 1~2열

### Mobile

- Logo + hamburger
- tagline 축약 가능
- Hero single column
- Today compact list
- Featured vertical card
- Browse 1~2열
- Latest 1열

## Implementation Rules

- 기존 라우트를 임의로 변경하지 않는다.
- 기존 콘텐츠 구조와 데이터를 가능한 한 유지한다.
- TypeScript에서 `any`를 사용하지 않는다.
- Tailwind CSS가 있다면 Tailwind 중심으로 구현한다.
- 새 패키지는 꼭 필요할 때만 추가한다.
- 실제 Dechive 글과 무관한 더미 콘텐츠를 만들지 않는다.
- 이미지가 없으면 타이포그래피, 선, 여백으로 해결한다.
- 실제 데이터를 연결할 수 없는 숫자는 표시하지 않는다.
- 작업 후 lint와 build를 확인한다.

## Current Boundary

현재 단계에서는 다음을 하지 않는다.

- Studio 강의 페이지 수정
- 강의 브랜딩 추가
- AI 검색 기능 구현
- 개인 AI 패널
- 시간 카운터
- 테마 전환
- 로그인 기능
- 글 원고 전체 개편

지금은 메인 페이지와 새 visual system을 먼저 완성한다.

## Report Format

작업 완료 후 다음 형식으로 보고한다.

1. 변경 파일
2. 주요 변경 내용
3. 반응형 처리 방식
4. 확인 결과
5. 남은 TODO
