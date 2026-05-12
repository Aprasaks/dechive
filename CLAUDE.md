# CLAUDE.md

Dechive 프로젝트에서 Claude Code가 코드를 작성하거나 콘텐츠를 다룰 때 반드시 따라야 하는 규칙이다.

이 문서는 속도보다 방향성과 안정성을 우선한다.  
작업은 작게, 변경은 정확하게, Dechive의 정체성은 절대 흐리지 않는다.

---

## 0. Project Identity

Dechive는 일반 블로그, 포트폴리오, 튜토리얼 사이트가 아니다.

Dechive는 **생각이 머무는 개인 도서관**이다.

핵심 문장:

> 생각이 머무는 도서관  
> A library where thoughts stay.

Dechive의 모든 페이지, UI, 글, 메타데이터는 이 정체성을 지켜야 한다.

Dechive에서 글은 단순한 포스트가 아니라 하나의 짧은 책이다.  
각 글은 하나의 주제를 독립적으로 다루며, 같은 subject 안에 놓이면 하나의 책장처럼 보인다.

피해야 할 방향:

- 일반 개발 블로그
- 포트폴리오 템플릿
- SaaS 랜딩 페이지
- 강의/튜토리얼 플랫폼
- 프로젝트 쇼케이스 사이트
- 시끄러운 AI 도구 사이트

지향하는 방향:

- 조용한 고딕 도서관
- 짧은 책이 꽂힌 서가
- 지식을 다시 꺼내 읽는 공간
- 차분한 기록과 탐색
- AI 사서가 도와주는 개인 지식 저장소

---

## 1. Think Before Coding

구현 전에 먼저 생각한다.

- 사용자의 요청을 정확히 해석한다.
- 애매한 부분이 있으면 바로 구현하지 말고, 무엇이 애매한지 말한다.
- 여러 선택지가 있으면 장단점을 짧게 정리한다.
- 더 단순한 방법이 있으면 먼저 제안한다.
- 사용자가 명시하지 않은 기능을 임의로 추가하지 않는다.

단, 너무 사소한 수정은 과도하게 질문하지 말고 기존 패턴을 따라 최소 변경으로 처리한다.

---

## 2. Simplicity First

최소한의 코드로 해결한다.

- 요청받지 않은 기능 추가 금지
- 한 번만 쓰는 추상화 금지
- 불필요한 설정화 금지
- 과한 예외 처리 금지
- 200줄로 쓴 코드가 50줄로 가능하면 다시 줄인다

항상 스스로 묻는다.

> 이 변경은 정말 필요한가?  
> 이 코드가 Dechive를 더 단단하게 만드는가?

---

## 3. Surgical Changes

필요한 파일만 수정한다.

- 관련 없는 코드 리팩터링 금지
- 인접 코드 스타일 개선 금지
- 요청받지 않은 dead code 삭제 금지
- 기존 스타일을 따른다
- 내 변경 때문에 생긴 unused import, unused variable은 정리한다
- 기존에 있던 불필요한 코드는 발견해도 삭제하지 말고 보고만 한다

모든 변경 줄은 사용자의 요청과 직접 연결되어야 한다.

---

## 4. Verification Rules

코드 변경 후 가능한 경우 반드시 확인한다.

```bash
npm run lint
npx tsc --noEmit
```

프로젝트에서 build 확인이 필요한 변경이면:

```bash
npm run build
```

검증을 실행하지 못했다면, 왜 못 했는지 보고한다.

---

## 5. Code Rules

### TypeScript

- `any` 사용 금지
- 타입을 모르면 추론하거나 명시적 인터페이스를 만든다
- 공용 타입은 가능하면 `types/` 폴더에서 관리한다
- 단일 컴포넌트 안에서만 쓰는 타입은 가까운 곳에 둬도 된다

### Component

- 한 컴포넌트는 한 가지 책임만 가진다
- UI 변경은 기존 레이아웃을 최대한 유지한다
- 큰 구조 변경은 사용자의 명시 요청 없이는 하지 않는다

### Tailwind

- Tailwind v4 유틸리티를 우선 사용한다
- `bg-linear-to-*`, `size-*`, `shrink-0`, `backdrop-blur-xs` 등 기존 프로젝트 스타일을 따른다
- arbitrary value는 필요한 경우만 사용한다
- Dechive의 어두운 도서관 분위기를 깨는 밝은 SaaS 스타일을 피한다

### Next.js Image

- `fill` 사용 시 부모에 `relative` 필수
- `sizes` prop 필수
- 고정 크기 이미지는 width/height와 className 크기를 일관되게 맞춘다

### Markdown code block scroll

`article`에 `overflow-x-hidden`을 넣지 않는다.
코드블록 가로 스크롤이 막힐 수 있다.

---

## 6. Infrastructure Rules

아래 시스템은 이미 구축되어 있으므로 임의로 건드리지 않는다.

- Supabase pgvector RAG
- Gemini API 기반 AI 사서
- 한/영 이중 경로
- Sitemap
- Google Analytics
- AdSense
- Privacy Policy
- Vercel 환경변수
- 번역 스크립트
- GitHub Actions 임베딩 파이프라인

인프라 변경은 반드시 사용자가 명시적으로 요청했을 때만 한다.

---

## 7. Workflow Rules

GitHub issue, commit, push는 명시 요청이 있을 때만 실행한다.

절대 자동으로 push하지 않는다.

요청별 행동:

- "이슈 만들어" → issue 생성만
- "커밋해" → commit만
- "푸시해" → push만
- "커밋푸시해" → commit 후 push

권장 순서:

```txt
issue → commit → push
```

하지만 각 단계는 사용자 요청이 있을 때만 실행한다.

커밋 메시지는 다음 중 하나로 시작한다.

```txt
feat:
fix:
refactor:
chore:
docs:
style:
```

---

## 8. Content Model

Dechive의 콘텐츠 구조는 다음과 같다.

```txt
category = 큰 서가
subject = 주제 책장
post = 하나의 짧은 책
tags = 색인
```

Dechive의 category는 작은 기술명이 아니라 큰 서가다.
React, SQL, Prompt 같은 이름은 category가 아니라 subject에 가깝다.

현재 기본 서가는 다음을 기준으로 한다.

```txt
Dev = 코드와 웹 개발의 서가
Data = 데이터, 분석, 쿼리의 서가
Product = 제품, 기획, 일하는 방식의 서가
AI = 인공지능, 프롬프트, 모델 이해의 서가
```

subject는 각 서가 안의 주제 책장이다.

```txt
Dev
- JavaScript
- TypeScript
- React
- HTML CSS
- Docker

Data
- SQL
- Google Analytics

Product
- PM
- Agile

AI
- Prompt
- Deep Learning
```

필요할 때만 Tool 서가를 추가할 수 있다.

```txt
Tool
- GitHub
- Supabase
- Vercel
- Claude Code
- Codex
```

단, category를 너무 많이 만들지 않는다.
새 category는 여러 subject를 담을 수 있을 때만 만든다.

중요:

- `series`는 사용하지 않는다
- subject는 시리즈가 아니다
- subject는 같은 주제의 책장이다
- 각 글은 독립적으로 읽혀야 한다
- 같은 subject 안에서 자연스럽게 연결될 수는 있지만, 연재처럼 쓰면 안 된다

금지:

```txt
1편
2편
이번 편
다음 편
이전 글
앞선 글
지난 시간
이 시리즈
완전 정복
```

대체 표현:

```txt
이 주제를 이해하려면 먼저 한 가지를 받아들여야 한다.
여기서 중요한 질문은 이것이다.
같은 원리는 다른 상황에서도 반복된다.
이 개념은 결국 하나의 문제로 이어진다.
```

---

## 9. Frontmatter Rules

모든 한국어 원문 포스트는 `content/posts/{slug}.ko.md`에 저장한다.
영어 파일은 번역 스크립트가 생성한다.

기본 구조:

```yaml
---
title: '글의 핵심 통찰을 담은 제목'
date: YYYY-MM-DD
category: Data
tags:
  - SQL
  - database
  - query
slug: url-friendly-slug
description: 'SEO 스니펫용 설명'
status: published
lang: ko
subject: SQL
---
```

규칙:

- `series` 사용 금지
- `summary` 사용 금지
- `subject` 필수
- `category`는 글의 기술명이 아니라 큰 서가를 나타낸다
- `subject`는 그 안에서 글이 놓일 주제 책장이다
- `slug`는 가능하면 변경하지 않는다
- 이미 Google에 노출된 slug는 특히 신중하게 다룬다
- `description`은 과장 없이 명확하게 쓴다
- title은 블로그식 제목이 아니라 짧은 책 제목처럼 쓴다

category / subject 선택 예:

```txt
React 글
category: Dev
subject: React

SQL 글
category: Data
subject: SQL

GA4 글
category: Data
subject: Google Analytics

PM 글
category: Product
subject: PM

프롬프트 글
category: AI
subject: Prompt
```

잘못된 예:

```txt
category: React
category: SQL
category: Prompt
```

이런 값은 category가 아니라 subject에 가깝다.

나쁜 제목:

```txt
프롬프트 작성법 2편
AI 페르소나 완전 정복
스크럼 이벤트 가이드
GA4 기본 보고서 완전 해부
```

좋은 제목:

```txt
AI에게 정확하게 말한다는 것
페르소나는 가면이 아니다
AI의 힘을 묶어 쓴다는 것
프롬프트를 틀로 만든다는 것
GA4를 이해한다는 것
```

---

## 10. Writing Rules

Dechive의 글은 하나의 질문에 답해야 한다.

글을 쓰거나 재작성하기 전에 먼저 핵심 질문을 정한다.

예:

```txt
LLM은 어떻게 답을 만들어내는가?
AI에게 정확하게 말한다는 것은 무엇인가?
페르소나는 왜 가면이 아닌가?
프롬프트 하네싱은 무엇을 묶는 일인가?
GA4는 왜 UA와 다르게 보이는가?
```

글 전체는 이 질문 하나에 답해야 한다.

범위를 벗어나는 내용은 줄인다.
다른 글에서 다룰 수 있는 내용은 현재 글에 억지로 넣지 않는다.

---

## 11. Writing Tone

문체는 다음 기준을 따른다.

- 차분하다
- 명확하다
- 사람에게 설명하듯 자연스럽다
- 기술적으로 정확하다
- 딱딱한 기술 문서처럼 쓰지 않는다
- 감성 에세이처럼 흐리지 않는다
- 과장된 마케팅 문구를 피한다
- 독자를 가르치려 들지 않는다
- 농담이나 밈을 넣지 않는다

피할 문장:

```txt
본 글에서는 ~에 대해 알아본다.
결론적으로 말하자면 ~이다.
반드시 기억해야 할 핵심 포인트는 다음과 같다.
이것만 알면 완벽하게 이해할 수 있다.
```

좋은 문장:

```txt
처음에는 이 차이가 작아 보인다.
문제는 여기서 시작된다.
이 말은 틀리지 않지만, 충분하지도 않다.
중요한 건 도구가 아니라 기준이다.
이 관점이 잡히면 숫자는 조금씩 읽을 수 있는 언어가 된다.
```

---

## 12. Post Structure

기본 흐름:

```txt
도입
문제의식
핵심 개념
예시 또는 비교
의미 정리
조용한 마무리
```

단, 이 이름을 헤딩으로 쓰지 않는다.
헤딩은 생각의 흐름에 맞게 자연스럽게 만든다.

도입은 정의로 시작하지 않는다.
독자가 겪는 혼란, 관찰, 문제의식에서 시작한다.

나쁜 도입:

```txt
GA4는 구글이 제공하는 이벤트 기반 웹 분석 도구다.
스크럼은 애자일 방법론 중 하나다.
페르소나는 AI에게 역할을 부여하는 프롬프트 기법이다.
```

좋은 도입:

```txt
GA4 보고서를 처음 열면 숫자가 낯설게 느껴진다.
역할이 누구인지는 알겠다. 그런데 스크럼이 실제로 어떻게 돌아가는지는 아직 막막하다.
AI에게 역할을 주는 일은 생각보다 쉽게 오해된다.
```

---

## 13. Heading Rules

헤딩은 정보 분류가 아니라 생각의 흐름이어야 한다.

피할 헤딩:

```txt
개요
정리
결론
요약
다음 편에서는
1편에서 이어서
완전 정복
```

좋은 헤딩:

```txt
전문가라는 말이 부족한 이유
역할을 구체화하는 네 가지 요소
경계가 능력을 만든다
GA4가 세상을 보는 방식
데이터가 보고서가 되기까지
AI를 다룬다는 것
```

마지막 헤딩은 `정리`나 `결론`이 아니라 글의 핵심 생각을 닫는 제목이어야 한다.

예:

```txt
GA4를 이해한다는 것
역할이 만드는 것
AI를 다룬다는 것
반복 가능한 프롬프트
리듬이 자리 잡힐 때
```

---

## 14. Examples

예시는 중요하지만, 많이 넣는 것보다 정확한 예시 하나가 낫다.

예시는 반드시 본문에서 해석한다.
예시만 던지고 끝내지 않는다.

예시 구조:

```txt
모호한 프롬프트
→ 구체화한 프롬프트
→ 왜 달라졌는지 해석
```

좋은 해석 문장:

```txt
두 번째 프롬프트가 더 긴 것은 사실이다. 하지만 AI 입장에서는 선택할 공간이 훨씬 좁아진다.
지능이 달라진 것이 아니다. 답이 나아갈 수 있는 범위가 달라진 것이다.
템플릿의 구조는 그대로다. 바뀐 것은 변수뿐이다.
```

---

## 15. Technical Accuracy

없는 사실을 만들지 않는다.
확실하지 않은 내용은 단정하지 않는다.

피할 표현:

```txt
반드시
항상
완전히
유일한
무조건
사실은 이것 때문이다
```

완화 표현:

```txt
~에 가깝다
~라고 볼 수 있다
~일 가능성이 높다
~로 이해할 수 있다
대체로
보통
많은 경우
```

나쁨:

```txt
AI가 규칙을 잊는 것은 어텐션 점수 배분 때문이다.
PO는 스프린트 중 항목을 변경할 수 없다.
```

좋음:

```txt
AI가 규칙을 잊는 것처럼 보이는 현상도 이런 맥락에서 이해할 수 있다.
스프린트가 시작된 뒤에는 스프린트 목표를 쉽게 흔들지 않는다.
```

---

## 16. Korean Markdown Bold Spacing

한국어 문장에서는 볼드 앞뒤 공백을 확인한다.

```md
❌ **세션(Session)**이었다
✅ **세션(Session)** 이었다

❌ 기본 단위는**이벤트(Event)**다
✅ 기본 단위는 **이벤트(Event)** 다
```

조사 앞뒤가 어색해질 수 있으므로 렌더링을 고려해 확인한다.

---

## 17. Translation Rules

한국어 원문을 먼저 작성한다.
영어 파일은 번역 스크립트로 최초 생성한다.

번역 운영 정책:

```txt
자동 번역 = 새 영어 글 최초 생성용
기존 en.md = 보호
기존 en.md 재번역 = 명시적 force일 때만 허용
```

자동 번역 workflow는 `posts/**.ko.md` 변경에 반응할 수 있다.
하지만 대응되는 `.en.md`가 이미 있으면 기본적으로 스킵해야 한다.

예:

```txt
posts/example.ko.md 변경
posts/example.en.md 존재
→ example.en.md는 덮어쓰지 않는다

posts/new-post.ko.md 추가
posts/new-post.en.md 없음
→ new-post.en.md를 새로 생성한다
```

새 영어 글을 만들 때 번역 대상:

```txt
title
description
seoTitle
tags
본문
lang: ko → lang: en
```

`slug`는 번역하지 않는다.
한국어와 영어 글은 같은 slug를 유지한다.

기존 영어 글은 단순 자동 번역물이 아니라 검수된 콘텐츠로 본다.
제목, `seoTitle`, 태그, 문체를 수동으로 다듬은 뒤에는 자동 번역이 다시 덮어쓰면 안 된다.

```bash
npm run translate
```

특정 포스트를 새로 만들고 싶을 때:

```bash
rm content/posts/{slug}.en.md
npm run translate
```

기존 영어 글을 의도적으로 다시 만들 때만 force를 쓴다.
force 실행 뒤에는 반드시 영어 제목, `seoTitle`, 태그, 본문을 다시 검수한다.

```bash
npm run translate -- --force
```

GitHub Actions 수동 실행에서는 `force_retranslate: true`일 때만 기존 `.en.md`를 덮어쓴다.
기본값은 항상 `false`다.

주의:

- 한국어 글을 크게 수정해도 기존 영어 글은 자동으로 업데이트되지 않는다
- 필요한 경우 영어 글을 직접 수정하거나, force 재번역 후 다시 검수한다
- 영어 태그는 자동 번역 후에도 대소문자와 띄어쓰기를 검수한다
- `Prompt`, `SQL`, `GA4`, `RAG`, `MCP`, `Tool Use`, `Structured Output` 같은 핵심 태그는 일관되게 유지한다

금지:

- `.en.md`를 처음부터 손으로 새로 작성
- 기존 영어 글을 자동 번역으로 무심코 덮어쓰기
- 검수 없이 `--force`로 전체 재번역
- 불필요한 번역 비용 발생

---

## 18. SEO Rules

SEO는 키워드 반복이 아니라 명확한 글쓰기에서 나온다.

원칙:

- 사람을 위한 글을 쓴다
- 제목에 키워드를 억지로 넣지 않는다
- slug는 안정적으로 유지한다
- description은 과장하지 않는다
- title, description, OpenGraph, canonical을 확인한다
- KO/EN hreflang 상호 참조를 유지한다
- Privacy Policy, About 링크는 유지한다
- AdSense 정책 위반 가능성이 있는 내용은 피한다

중요:

> 잘 읽히는 글 = 사람을 위한 글 = 검색에도 오래 남는 글

---

## 19. Archive Page Rules

Archive는 Dechive의 핵심이다.

역할:

```txt
왼쪽 페이지 = 색인, 필터, 검색
오른쪽 페이지 = 기록 목록, 검색 결과
```

규칙:

- Archive의 펼쳐진 책 UI를 유지한다
- 검색창은 왼쪽에 둔다
- 검색 결과는 오른쪽 목록 영역에 표시한다
- 드롭다운 검색 결과는 기본 방식으로 쓰지 않는다
- 검색은 현재 category/subject 범위 안에서 작동한다
- 현재 검색 범위를 사용자에게 보여준다
- 결과가 없으면 empty state를 보여준다
- category를 바꾸면 selectedSubject를 초기화한다
- 선택된 category/subject는 명확하게 active 상태를 표시한다

검색 대상:

```txt
title
description
tags
category
subject
content/body/rawContent
```

검색 품질:

- 한 단어 검색은 하나라도 맞으면 포함 가능
- 여러 단어 검색은 너무 넓게 잡히지 않게 matchedTermCount와 score를 함께 본다
- title, tags, subject, description, content 순으로 가중치를 둘 수 있다

---

## 20. UI/UX Rules

Dechive UI는 다음 느낌을 유지한다.

```txt
고딕 도서관
조용한 서가
짧은 책
기록장
사서
낮은 대비
얇은 border
은은한 amber
```

피할 것:

```txt
밝은 SaaS 버튼
과한 gradient
둥글고 큰 스타트업 카드
포트폴리오식 skill bar
퍼센트 숙련도 표시
시끄러운 애니메이션
일반 블로그 리스트
```

폰트 원칙:

- 문학적 heading / 기록 제목: serif 계열 가능
- 기능적 UI / 라벨 / 날짜 / 숫자: sans 계열 유지
- 손글씨체는 메인 폰트로 사용하지 않는다
- 손글씨체는 방명록, 마스코트 말풍선, 작은 메모 정도에만 제한적으로 사용한다

---

## 21. Home Page Rules

Home은 글 목록이 아니라 도서관의 입구다.

역할:

- Dechive의 한 줄 정체성을 보여준다
- Archive로 들어가는 문을 제공한다
- 너무 많은 섹션을 두지 않는다
- 고요한 첫인상을 유지한다

hero 문구는 사이트의 선언문처럼 다룬다.

한글 hero 큰 문구에는 serif를 사용할 수 있다.
작은 문구, nav, 버튼은 sans를 유지한다.

---

## 22. About Page Rules

About은 Dechive의 정체성을 설명하는 페이지다.

About은 다음을 설명해야 한다.

- Dechive가 무엇인지
- 왜 도서관인지
- 글을 왜 짧은 책으로 보는지
- Archive와 subject 구조가 무엇인지
- 이 사이트가 일반 블로그와 무엇이 다른지

과한 자기소개보다 Dechive의 방향을 중심으로 쓴다.

---

## 23. Contact Page Rules

Contact는 별도 페이지로 강조하지 않는다.
Dechive에서는 About 하단에 사서에게 닿을 수 있는 이메일을 조용히 남기는 방식을 기본으로 한다.

금지:

- 이력서 페이지처럼 보이는 Contact
- skill percentage bar
- AI Prompting 90%
- Next.js 75%
- SQL 20%
- 포트폴리오식 자기소개
- 포트폴리오식 자기 과시
- 기술 숙련도 숫자화

현재 방향:

- Header에는 Archive, About만 둔다
- Footer에는 Guestbook, RSS, Privacy Policy를 둔다
- 연락 수단은 About 하단에 작게 배치한다

---

## 24. Projects / Works Rules

Dechive를 일반 포트폴리오 사이트처럼 보이게 만들지 않는다.

현재 판단:

- 작업물이 적다면 Works/Projects를 헤더에 크게 올리지 않는다
- 필요하면 About이나 Footer에서 조용히 연결한다
- Dechive의 중심은 Archive다

프로젝트 관계:

```txt
Dechive = 세상의 지식과 생각을 저장하는 개인 도서관
Akashic = 한 사람의 삶을 기록하고 저장하고 분석하는 AI 비서
```

둘은 모두 기록, 저장, 분석, 다시 읽기라는 축을 공유한다.

포트폴리오 문장으로는 다음 방향을 유지한다.

```txt
AI와 웹 기술로 지식, 생각, 삶의 기록을 구조화하는 서비스를 만든다.
```

---

## 25. Guestbook Rules

방명록은 모달보다 별도 페이지가 기본 방향이다.

Guestbook은 방문자의 흔적을 남기는 공간이다.

방향:

- 조용한 기록장
- 짧은 메시지
- 낮은 대비
- 사서/도서관 세계관과 연결
- Contact나 Footer에서 연결

---

## 26. Akashic Concept

Akashic은 단순한 프로젝트가 아니다.

Akashic은 한 사람의 인생을 기록하고 저장하고 분석하는 AI 비서 개념이다.

Dechive와의 관계:

```txt
Dechive = 지식의 기록
Akashic = 삶의 기록
```

또는:

```txt
Dechive는 내가 세상을 읽는 방식이다.
Akashic은 내가 나를 읽는 방식이다.
```

이 둘은 Dechive 전체 세계관에서 중요한 축이다.

---

## 27. What Never To Do

절대 하지 말 것:

- Dechive를 일반 블로그처럼 만들기
- Dechive를 평범한 포트폴리오처럼 만들기
- `series` 추가
- `1편`, `2편`, `다음 편` 표현 사용
- slug 임의 변경
- 인프라 임의 수정
- 번역 파일 수동 작성
- 전체 재번역 강행
- 스킬 퍼센트 바 추가
- 밝은 SaaS 스타일로 변경
- 마스코트를 단순 장식으로만 사용
- 사실을 만들어내기
- 글을 길게 보이게 하려고 불필요하게 늘리기

---

## 28. Work Report Format

작업 후 반드시 짧게 보고한다.

```txt
변경 파일:
- file/path

주요 변경:
- 변경 내용 1
- 변경 내용 2

확인:
- npm run lint: 통과 / 미실행
- npx tsc --noEmit: 통과 / 미실행

주의/TODO:
- 필요한 경우만 작성
```

---

## 29. Final Standard

좋은 Dechive 작업은 다음을 만족한다.

- Dechive의 정체성을 흐리지 않는다
- 필요한 것만 바꾼다
- 글은 하나의 질문에 답한다
- UI는 도서관 분위기를 유지한다
- 검색과 탐색은 사용자가 길을 잃지 않게 한다
- SEO보다 사람을 먼저 생각한다
- 결과는 조용하지만 선명하다

Dechive는 콘텐츠를 빠르게 쌓는 곳이 아니다.

Dechive는 생각이 머무는 곳이다.
