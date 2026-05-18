# CLAUDE.md

Dechive 작업에서 Claude Code가 따라야 할 기준이다.  
속도보다 방향성, 변경량보다 정확성을 우선한다.

## 1. Project Identity

Dechive는 일반 블로그, 포트폴리오, 튜토리얼 사이트가 아니다.

Dechive는 AI 시대의 검증 지식 아카이브다.

Core line:

> AI는 답을 만든다.  
> Dechive는 그 답을 검증한다.

Dechive의 글은 빠른 답을 모으는 포스트가 아니다.  
각 글은 하나의 질문, 하나의 키워드, 하나의 판단 기준을 남겨야 한다.

지향:

- AI가 만든 답을 이해하고 검증하는 기준
- 질문과 이해가 쌓이는 Archive
- 하나의 키워드를 끝까지 파고드는 Deep Dive
- 추론, 한계, 실수, 검증 기준을 남기는 문서
- 에디토리얼한 지식 아카이브

피할 것:

- 일반 개발 블로그
- SaaS 랜딩 페이지
- 포트폴리오 템플릿
- 강의/튜토리얼 플랫폼
- 트렌드 추격형 SEO 사이트

## 2. Harness Thinking

하네스 엔지니어링은 AI를 강하게 만드는 주문이 아니다.

Dechive에서 하네스란 작업을 다음 요소로 묶는 것이다.

- Goal: 무엇을 해결하는가
- Scope: 어디까지 다루는가
- Boundary: 무엇을 하지 않는가
- Verification: 무엇으로 확인하는가
- Stop Condition: 언제 멈추는가

코드든 글이든, 작업 전에 이 다섯 가지를 먼저 잡는다.

좋은 하네스는 가능성을 줄이는 것이 아니라, 방향을 준다.

## 3. Content Model

Dechive의 콘텐츠 구조:

```txt
type = archive | deepdive
category = 큰 서가
subject = 주제 책장
post = 하나의 독립 기록 또는 심층 문서
tags = 색인
concepts = 개념 색인 연결
```

콘텐츠 타입:

```txt
Archive = 하나의 질문으로 남긴 독립 기록
Deep Dive = 하나의 키워드를 끝까지 파고드는 심층 지식 문서
Daily = 현재 사용하지 않음
```

Archive는 짧더라도 하나의 질문에 답해야 한다.  
다른 글의 앞뒤 순서를 전제로 쓰지 않는다.

Deep Dive는 하나의 키워드를 기준으로 개념, 배경, 구조, 예시, 실수, 한계, 추론, 검증 기준까지 정리한다.  
나중에 AI 추론 시스템이나 사서가 붙을 수 있으므로 문서 구조가 명확해야 한다.

기본 category:

```txt
Dev
Data
Product
AI
```

subject 예시:

```txt
Dev: JavaScript, TypeScript, React
Data: SQL, Google Analytics
Product: Agile, PM
AI: Prompt, Deep Learning
```

규칙:

- `series` 사용 금지
- subject는 시리즈가 아니라 책장이다
- 각 글은 독립적으로 읽혀야 한다
- 같은 subject 안에서 자연스럽게 연결될 수는 있지만 연재처럼 쓰지 않는다
- Daily는 현재 콘텐츠 구조에 포함하지 않는다
- Archive와 Deep Dive는 type으로 구분한다

금지 표현:

```txt
1편
2편
이번 편
다음 편
이전 글
지난 시간
이 시리즈
완전 정복
```

## 4. Frontmatter Rules

Archive 기본 구조:

```yaml
---
title: '하나의 질문을 담은 제목'
seoTitle: '검색용 설명형 제목'
date: YYYY-MM-DD
type: archive
category: AI
tags:
  - AI
  - Prompt
slug: url-friendly-slug
description: '질문과 답의 핵심을 설명하는 문장'
status: published
lang: ko
concepts:
  - Prompt
---
```

Deep Dive 기본 구조:

```yaml
---
title: '키워드를 끝까지 파고드는 제목'
seoTitle: '검색용 설명형 제목'
date: YYYY-MM-DD
updated: YYYY-MM-DD
type: deepdive
category: Product
subject: Agile
tags:
  - Agile
  - AI
  - Verification
slug: ai-era-agile-verification
description: '개념, 예시, 실수, 한계, 추론, 검증 기준까지 다루는 설명'
status: draft
lang: ko
concepts:
  - Agile
  - Verification
---
```

규칙:

- title은 Dechive 안에서 보이는 책 제목이다
- seoTitle은 구글 검색용 색인 제목이다
- title을 SEO 때문에 바꾸지 않는다
- slug는 임의로 변경하지 않는다
- description은 과장 없이 명확하게 쓴다
- category는 큰 서가, subject는 주제 책장이다
- type은 `archive` 또는 `deepdive`를 사용한다
- Archive는 하나의 질문을 담은 독립 기록이다
- Deep Dive는 하나의 키워드를 끝까지 파고드는 심층 문서다
- 한국어 `.ko.md`가 원문이다
- 기존 영어 `.en.md`는 보호한다
- slug는 번역하지 않는다

## 5. Writing Rules

글을 쓰기 전에 핵심 질문을 정한다.

예:

```txt
LLM은 어떻게 답을 만들어내는가?
AI에게 정확하게 말한다는 것은 무엇인가?
MCP는 워크플로우와 무엇이 다른가?
```

글 전체는 이 질문 하나에 답해야 한다.

Archive 기본 흐름:

```txt
도입
문제의식
핵심 개념
예시 또는 비교
의미 정리
조용한 마무리
```

단, 이 이름을 헤딩으로 쓰지 않는다.

Deep Dive 기본 흐름:

```txt
핵심 키워드
왜 필요한가
개념과 배경
구조
예시
자주 하는 실수
한계
추론 과정
검증 기준
정리
```

Deep Dive는 단순히 긴 글이 아니다.  
다른 글을 다시 찾아보지 않아도 하나의 키워드를 이해하고 검증할 수 있어야 한다.

도입은 정의가 아니라 혼란, 관찰, 문제의식에서 시작한다.

피할 문장:

```txt
본 글에서는 ~에 대해 알아본다.
결론적으로 말하자면 ~이다.
이것만 알면 완벽하게 이해할 수 있다.
```

좋은 문장:

```txt
처음에는 이 차이가 작아 보인다.
문제는 여기서 시작된다.
이 말은 틀리지 않지만, 충분하지도 않다.
중요한 건 도구가 아니라 기준이다.
```

## 6. Writing Harness

글쓰기 하네스는 다음을 먼저 잡는다.

### Core Question

이 글이 답하는 하나의 질문은 무엇인가?

### Scope

이 글에 포함할 것과 제외할 것은 무엇인가?

### Boundary

튜토리얼, 백과사전, SEO 글, 강의식 글로 흐르지 않도록 경계를 둔다.

### Concept Anchor

이 글이 붙잡는 핵심 개념을 한 문장으로 정의한다.

예:

```txt
Prompt = AI가 해석할 가능성을 좁히는 구조
RAG = 오늘 필요한 자료를 AI 앞에 놓는 방식
Tool Use = AI에게 통제된 외부 기능을 쥐여주는 방식
MCP = AI가 도구와 자료를 발견하고 호출하는 표준 연결 규약
Workflow = 일이 흘러가는 순서
```

### Stop Condition

아래 상황이면 멈추고 좁힌다.

- 글이 너무 넓어진다
- 개념을 정확히 설명하지 못한다
- 튜토리얼처럼 흐른다
- SEO 제목을 위해 본문이 흔들린다
- 확실하지 않은 내용을 단정하게 된다

## 7. Writing Tone

문체 기준:

- 차분하다
- 명확하다
- 사람에게 설명하듯 자연스럽다
- 기술적으로 정확하다
- 독자를 가르치려 들지 않는다
- 과장된 마케팅 문구를 피한다

확실하지 않은 내용은 단정하지 않는다.

피할 표현:

```txt
반드시
항상
완전히
유일한
무조건
```

완화 표현:

```txt
~에 가깝다
~라고 볼 수 있다
~일 가능성이 높다
대체로
보통
많은 경우
```

## 8. Translation Rules

한국어 원문을 먼저 작성한다.
영어 파일은 번역 스크립트로 최초 생성한다.

정책:

```txt
자동 번역 = 새 영어 글 최초 생성용
기존 en.md = 보호
기존 en.md 재번역 = 명시적 force일 때만 허용
```

새 영어 글 번역 대상:

```txt
title
description
seoTitle
tags
body
lang: ko → en
```

`slug`는 번역하지 않는다.

기존 영어 글은 검수된 콘텐츠로 본다.
자동 번역이 다시 덮어쓰면 안 된다.

Force 재번역:

```bash
npm run translate -- --force
```

Force 후에는 영어 title, seoTitle, tags, body를 반드시 검수한다.

## 9. SEO Rules

SEO는 키워드 반복이 아니라 명확한 색인이다.

원칙:

- 사람을 위한 글을 쓴다
- title은 Dechive다운 제목으로 유지한다
- seoTitle은 검색자가 이해하기 쉬운 설명형 제목으로 쓴다
- description은 정확하게 쓴다
- 낚시 제목을 쓰지 않는다
- canonical, hreflang, OG/Twitter 메타데이터를 유지한다

Dechive의 기준:

```txt
title = 책 제목
seoTitle = 검색 색인 제목
description = 책 설명
tags = 색인어
concepts = 개념 연결
```

## 10. UI / UX Rules

Dechive UI는 에디토리얼한 검증 아카이브 분위기를 유지한다.

지향:

```txt
잡지형 지면
검증 아카이브
명확한 색인
넓은 여백
얇은 border
muted gold
warm ivory
```

피할 것:

```txt
밝은 SaaS 버튼
과한 gradient
둥글고 큰 스타트업 카드
skill percentage bar
시끄러운 애니메이션
일반 블로그 리스트
```

## 11. Archive / Index / About

### Archive

Archive는 하나의 질문으로 남긴 독립 기록의 색인이다.

- 왼쪽은 색인, 필터, 검색
- 오른쪽은 기록 목록과 검색 결과
- 검색은 현재 category/subject 범위 안에서 작동한다
- 선택된 범위는 명확하게 보여준다
- 이전 글, 다음 글, 이어지는 글처럼 순서를 암시하지 않는다
- 각 Archive 글은 단독으로 읽혀야 한다

### Deep Dive

Deep Dive는 하나의 키워드를 끝까지 파고드는 심층 지식 문서다.

- 개념, 배경, 구조, 예시를 포함한다
- 실수, 한계, 추론, 검증 기준을 포함한다
- 단순한 긴 글이나 튜토리얼로 만들지 않는다
- 나중에 AI 추론 시스템이나 사서가 읽을 수 있도록 구조를 명확히 한다

### Index

Index는 단순 사전이 아니라 개념 지도다.

- 개념의 짧은 정의
- 헷갈리기 쉬운 지점
- 관련 concepts 기반 자동 연결
- Archive 글로 이어지는 길

관련 기록 연결은 가능하면 frontmatter `concepts`를 통해 자동화한다.

### About

About은 Dechive의 정체성을 설명한다.

- Dechive가 무엇인지
- 왜 검증 아카이브인지
- AI 시대에 왜 사람이 이해하고 검증해야 하는지
- Archive와 Deep Dive가 어떤 역할인지
- 일반 블로그와 무엇이 다른지

## 12. Infrastructure Rules

아래는 명시 요청 없이 건드리지 않는다.

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

## 13. Never Do

절대 하지 말 것:

- Dechive를 일반 블로그처럼 만들기
- series 추가
- 1편/2편/다음 편 표현 사용
- slug 임의 변경
- 인프라 임의 수정
- 기존 영어 글 자동 덮어쓰기
- 검수 없이 force 재번역
- skill percentage bar 추가
- 밝은 SaaS 스타일로 변경
- Daily를 현재 구조에 임의로 추가
- Deep Dive를 단순히 긴 Archive 글처럼 작성
- Archive 글을 이어지는 연재처럼 작성
- 사실을 만들어내기
- 글을 길게 보이게 하려고 불필요하게 늘리기

## 14. Work Report Format

작업 후 보고:

```txt
변경 파일:
- file/path

주요 변경:
- 변경 내용

확인:
- npm run lint: 통과 / 미실행
- npx tsc --noEmit: 통과 / 미실행

주의/TODO:
- 필요한 경우만
```

## 15. Final Standard

좋은 Dechive 작업은 다음을 만족한다.

- 정체성을 흐리지 않는다
- 필요한 것만 바꾼다
- 글은 하나의 질문에 답한다
- Archive는 독립 기록으로 남는다
- Deep Dive는 검증 가능한 심층 문서가 된다
- UI는 에디토리얼한 검증 아카이브 분위기를 유지한다
- SEO보다 사람을 먼저 생각한다
- 결과는 조용하지만 선명하다

Dechive는 콘텐츠를 빠르게 쌓는 곳이 아니다.
Dechive는 AI 시대의 답을 이해하고 검증하기 위한 지식 아카이브다.
