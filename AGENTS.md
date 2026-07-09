# AGENTS.md

## Agent Role

이 프로젝트에서 에이전트의 역할은 Dechive를 일반 블로그처럼 수정하는 것이 아니다.

에이전트는 Dechive를 **개인 지식 도서관이자 나만의 AI가 있는 아카이브 사이트**로 리모델링하는 작업을 돕는다.

Dechive는 사용자가 모은 지식, 글, 자료, 생각, 검증 기록을 쌓아두고, 그 지식 안에서 다시 찾고, 연결하고, 묻기 위한 사이트다.

## Project Identity

Dechive의 핵심 정체성:

> A living private library for verified knowledge.

Dechive는 다음과 같은 사이트다.

- 개인 지식 도서관
- 시간 위에 쌓이는 아카이브
- 내가 모은 지식을 다시 찾는 공간
- 나만의 AI에게 묻는 구조
- 외부 검색보다 먼저 내 도서관을 확인하는 시스템

Dechive는 다음이 아니다.

- 일반 블로그
- 포트폴리오 사이트
- SaaS 서비스
- 회원제 앱
- 단순 콘텐츠 목록 페이지
- 유행하는 랜딩페이지 템플릿

## Current Work Priority

현재 작업의 최우선 목표는 사이트 리모델링이다.

글, 링크, 실제 콘텐츠 이전, 글쓰기 기준 정리는 나중에 한다.

지금은 다음을 우선한다.

1. 메인 페이지 구조
2. 반응형 UI
3. Dechive의 새 정체성 반영
4. AI 영역
5. Ask my archive 검색 UI
6. 상단 오른쪽의 작은 시간 카운터
7. 로그인 없는 navigation 구조

## Required Rules

### 1. Do Not Add Login UI

절대 추가하지 말 것:

- Login
- Sign up
- Profile avatar
- Account menu
- Notification bell
- User settings menu
- SaaS dashboard 느낌의 사용자 영역

Dechive는 회원가입해서 쓰는 서비스처럼 보이면 안 된다.

### 2. Do Not Use “AI Librarian”

현재 리모델링 기준에서는 `AI Librarian`이라는 표현을 사용하지 않는다.

AI는 Dechive 안에 들어가는 나만의 AI다.
하지만 UI와 문서에서는 이를 사서라고 직접 부르지 않는다.

사용 가능한 표현:

- AI
- My AI
- Ask my archive
- Ask my library
- Only your archive
- Searching your archive only
- I search only your archive
- I connect notes, sources, concepts, and projects

피해야 할 표현:

- AI Librarian
- Dechive AI Librarian
- Librarian
- 사서

단, 개념적으로는 Dechive 안의 지식을 읽고 연결해주는 AI라는 방향을 유지한다.

### 3. Add the Living Time Counter

상단에는 시간이 흐르는 카운터를 넣는다.

화면에 시작 날짜는 표시하지 않는다.

내부 기준일:

`1992-09-30T00:00:00+09:00`

표시 형식 예시:

`33 years · 281 days · 14 hours · 22 minutes · 08 seconds`

보조 문구 예시:

`always recording · always becoming`

구현 주의:

- 1초마다 갱신
- client component로 분리
- hydration mismatch 방지
- 모바일에서 너무 많은 공간을 차지하지 않게 조정
- 텍스트는 크지 않게 처리
- 상단바 중앙이 아니라 **맨 오른쪽**에 배치
- 사이트의 주인공처럼 과하게 강조하지 말 것

### 4. Main Navigation

기본 navigation:

- Archive
- Deep Dive
- AI Update
- Library
- About

데스크탑에서는 상단 navigation으로 표시한다.
모바일에서는 햄버거 메뉴로 축약한다.

상단바 기본 구조:

- Left: Dechive logo / wordmark
- Center or main area: navigation
- Right: small living time counter

로그인, 프로필, 알림 영역은 만들지 않는다.

### 5. Main Page Sections

메인 페이지에는 다음 섹션을 둔다.

- Header
- Small living time counter on the far right
- Hero copy
- Ask my archive search input
- AI panel
- Archive card
- Deep Dive card
- AI Update card
- Library card
- Optional bottom summary strip

## Responsive Requirements

반응형은 필수다.

### Desktop

- Header는 로고 / navigation / 작은 시간 카운터 구조
- 시간 카운터는 맨 오른쪽
- Hero는 2-column 구조
- 왼쪽: headline, description, search
- 오른쪽: AI panel
- Entry cards: 4 columns

### Tablet

- Header 간격 조정
- 시간 카운터는 오른쪽에 두되 너무 길면 축약 가능
- Hero와 AI panel은 자연스럽게 재배치
- Entry cards: 2x2

### Mobile

- Logo + hamburger
- 시간 카운터는 작고 간결하게 처리
- Hero는 single column
- Search input은 full width
- AI panel은 compact card
- Entry cards는 1 column stack

## Visual Style

Dechive의 리모델링 스타일은 다음을 따른다.

- deep midnight navy
- charcoal
- soft ivory
- muted bronze / amber
- subtle blue-teal glow
- quiet library mood
- refined archive feeling
- personal, accumulated, living
- futuristic but not noisy

피해야 할 스타일:

- 밝고 가벼운 SaaS UI
- 과한 네온
- 로그인 앱 대시보드
- 일반 블로그 스킨
- 무의미한 애니메이션 남발
- 텍스트가 읽기 어려운 과한 장식
- AI Librarian 명칭

## Implementation Rules

- 기존 라우트를 임의로 깨지 않는다.
- 글 데이터, archive 데이터, deep dive 데이터는 이번 단계에서 크게 건드리지 않는다.
- 실제 AI API 연결은 하지 않는다.
- 검색 기능은 우선 UI placeholder로 둔다.
- 필요한 컴포넌트는 새로 분리해도 된다.
- TypeScript 파일에서는 `any`를 사용하지 않는다.
- Tailwind CSS가 있다면 Tailwind 중심으로 구현한다.
- 새 패키지는 꼭 필요할 때만 추가한다.
- 이미지가 없으면 gradient, border, glow, icon, CSS pattern으로 먼저 구현한다.
- 작업 후 lint/build를 확인한다.

## Current Boundary

지금은 글 기준을 정리하지 않는다.

다음 항목은 이후 단계에서 다룬다.

- Archive 글쓰기 기준
- Deep Dive 글쓰기 기준
- SEO 기준
- MD frontmatter 기준
- 외부 배포 기준
- 실제 글/링크 이전
- 실제 AI 검색 연결

현재는 Dechive의 초심에 맞는 사이트 구조와 메인 UI를 먼저 만든다.

## Report Format

작업 완료 후 다음 형식으로 보고한다.

1. 변경 파일
2. 주요 변경 내용
3. 반응형 처리 방식
4. 확인 결과
5. 남은 TODO
