# CLAUDE.md

## Dechive Project Principle

Dechive는 일반 블로그, 포트폴리오, SaaS 서비스가 아니다.

Dechive의 초본은 **개인 지식 도서관**이다.

사람들은 모르는 것을 구글에서 찾고, AI에게 묻는다.
하지만 Dechive는 그 전에, 내가 직접 모으고 정리한 지식들을 하나의 도서관처럼 쌓아두고, 그 안에서 다시 찾고, 연결하고, 검증하기 위해 시작된 프로젝트다.

Dechive는 내가 만들어가는 나만의 지식이자, 시간이 지나며 계속 성장하는 개인 아카이브다.

## Core Idea

Dechive의 핵심은 다음과 같다.

- 내가 모은 지식
- 내가 남긴 기록
- 내가 정리한 자료
- 내가 검증한 생각
- 내가 다시 꺼내보고 싶은 질문들

이 모든 것을 하나의 도서관처럼 모으고, 나중에는 나만의 AI가 그 안에서 답을 찾아주는 구조를 지향한다.

Dechive는 외부 검색을 대체하려는 서비스가 아니라,
**내가 쌓은 지식 안에서 다시 묻고 답하기 위한 개인 지식 시스템**이다.

## Current Remodel Direction

현재 Dechive 리모델링의 목표는 글을 먼저 옮기는 것이 아니다.

우선순위는 사이트의 정체성과 구조를 먼저 다시 세우는 것이다.

이번 리모델링의 기준은 다음과 같다.

1. Dechive는 개인 지식 도서관처럼 보여야 한다.
2. 사이트는 시간이 계속 지나가고 있다는 느낌을 줘야 한다.
3. 나만의 AI가 존재한다는 느낌이 있어야 한다.
4. 로그인, 회원가입, 프로필, 알림 같은 SaaS UI는 필요 없다.
5. Archive, Deep Dive, AI Update, Library는 도서관의 주요 공간처럼 다룬다.
6. 글, 링크, 실제 콘텐츠 이전은 나중에 한다.
7. 지금은 메인 페이지와 전체 사이트 골격을 우선 만든다.

## Required Site Concepts

### 1. No Login

Dechive는 회원제 서비스처럼 보이면 안 된다.

다음 요소는 넣지 않는다.

- Login
- Sign up
- Profile avatar
- Account menu
- Notification bell
- User dashboard 느낌의 UI

Dechive는 남들이 가입해서 쓰는 서비스가 아니라,
내가 쌓아가는 개인 지식 도서관을 보여주는 사이트다.

### 2. Personal AI

Dechive에는 나만의 AI 개념이 들어가야 한다.

이 AI는 외부 인터넷을 무작정 검색하는 존재가 아니다.
Dechive 안에 쌓인 지식, 기록, 글, 자료, 생각을 읽고 연결해주는 존재에 가깝다.

단, UI와 문서에서는 `AI Librarian`이라는 표현을 사용하지 않는다.
현재 기준에서는 단순히 `AI`라고 부른다.

표현 방향:

- Ask my archive
- Ask my library
- My AI
- Only your archive
- I search only your archive
- I connect notes, sources, concepts, and projects

실제 AI 기능 연결은 나중에 한다.
현재 단계에서는 UI와 구조만 먼저 만든다.

### 3. Living Time Counter

Dechive는 시간이 지나며 쌓이는 개인 지식 도서관이다.

상단에는 시간이 계속 흐르는 카운터가 들어간다.

- 화면에 시작 날짜 자체는 표시하지 않는다.
- 내부 기준일은 `1992-09-30T00:00:00+09:00`으로 둔다.
- 표시 예시는 다음과 같다.

`33 years · 281 days · 14 hours · 22 minutes · 08 seconds`

보조 문구 예시:

`always recording · always becoming`

중요한 배치 기준:

- 시간 카운터는 상단바 중앙에 두지 않는다.
- 시간 카운터는 상단바의 **맨 오른쪽**에 둔다.
- 글씨는 크지 않게, 조용한 상태 표시처럼 보이게 한다.
- 사이트의 주인공처럼 과하게 강조하지 않는다.
- Dechive가 시간이 지나며 계속 쌓이는 아카이브라는 인상을 주는 정도면 충분하다.

## Main Page Structure

메인 페이지는 다음 구조를 기준으로 한다.

### Header

- Left: Dechive logo / wordmark
- Center or main nav area: navigation
- Right: small living time counter

Navigation:

- Archive
- Deep Dive
- AI Update
- Library
- About

모바일에서는 navigation을 햄버거 메뉴로 줄인다.

모바일에서도 시간 카운터는 보이게 할 수 있지만,
화면을 많이 차지하지 않도록 작고 간결하게 처리한다.

### Hero

메인 카피 방향:

`A living private library for verified knowledge.`

보조 설명 방향:

`Collect it. Chunk it. Connect it. Your AI searches only your archive—linking ideas, sources, notes, and projects to deliver answers that are deeply personal and verifiable.`

검색창 placeholder:

`Ask my archive...`

### AI Panel

AI 패널은 Dechive의 핵심 정체성을 보여준다.

이 패널은 “AI Librarian”이라는 이름을 쓰지 않는다.
그냥 `AI` 또는 `My AI`처럼 간결하게 표현한다.

포함할 수 있는 항목:

- Sources
- Notes
- Concepts
- Projects
- References
- Connected knowledge
- Your archive only

실제 데이터가 없으면 placeholder로 둔다.

### Main Entry Cards

아래 4개 카드를 주요 진입점으로 둔다.

- Archive
- Deep Dive
- AI Update
- Library

각 카드는 단순 링크 박스가 아니라, 도서관 안의 공간처럼 느껴져야 한다.

## Responsive Direction

Dechive는 데스크탑, 태블릿, 모바일을 모두 고려한다.

### Desktop

- Header는 로고 / navigation / 작은 시간 카운터 구조
- 시간 카운터는 맨 오른쪽
- Hero는 2-column 구조
- 왼쪽은 카피와 검색
- 오른쪽은 AI panel
- 카드 영역은 4열

### Tablet

- Header 간격 조정
- 시간 카운터는 오른쪽에 두되 너무 길면 축약 가능
- Hero와 AI panel은 자연스럽게 재배치
- 카드 영역은 2x2

### Mobile

- 상단은 로고 + 햄버거
- 시간 카운터는 작고 간결하게 처리
- Hero 카피는 짧고 읽기 좋게 줄바꿈
- 검색창은 full width
- AI panel은 compact card
- 카드 영역은 1열 stack

## Visual Direction

Dechive의 현재 리모델링 톤은 다음과 같다.

- deep midnight navy
- charcoal
- soft ivory text
- muted bronze / amber accent
- subtle blue-teal glow
- quiet library mood
- personal archive feeling
- futuristic but not loud
- premium but not corporate
- calm, deep, organized

피해야 할 것:

- 밝은 SaaS 랜딩페이지 느낌
- 과한 네온 cyberpunk
- 로그인 기반 대시보드 느낌
- 지나치게 가벼운 블로그 스킨 느낌
- 무의미한 장식 중심 UI
- `AI Librarian`이라는 직접적인 명칭

## Current Priority

현재 최우선 작업은 글 작성 기준이나 콘텐츠 이전이 아니다.

지금의 우선순위는 다음이다.

1. Dechive의 초심에 맞는 사이트 구조 만들기
2. 반응형 메인 페이지 만들기
3. 로그인 없는 개인 아카이브 UI 만들기
4. AI 패널과 Ask my archive 구조 만들기
5. 상단 오른쪽에 작은 시간 카운터 구현하기

글, 링크, 콘텐츠, 세부 글쓰기 기준은 이후 단계에서 정리한다.
