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

## 2. Tech Stack

package.json 기준 (2026-07 현재):

```txt
Next.js 16 (App Router)         next ^16.2.3
React 19                        react 19.2.4
TypeScript 5                    admin 영역만 예외적으로 JS/JSX
Tailwind CSS 4                  @tailwindcss/postcss, @tailwindcss/typography,
                                tw-animate-css, shadcn/tailwind.css (globals.css에서 @import)
마크다운 렌더링                  gray-matter, react-markdown, remark-gfm,
                                rehype-highlight, rehype-slug
아이콘                          lucide-react
방명록 저장소                    @supabase/supabase-js
관리자 분석                      @google-analytics/data (GA4 Data API), bcryptjs
스크립트 실행                    tsx
번역                            @anthropic-ai/sdk (devDep — content 서브모듈의
                                translate.mjs가 루트 node_modules에서 resolve)
배포                            Vercel (main 푸시 시 자동 배포)
```

주의:

- `shadcn` 패키지는 CLI가 아니라 `globals.css`의 `@import "shadcn/tailwind.css"`로 실제 사용 중이다. 제거하지 않는다.
- `@anthropic-ai/sdk`는 src에서 import되지 않지만 `npm run translate`가 사용한다. 제거하지 않는다.

## 3. Route Structure

```txt
/                          홈. 데스크톱(md 이상) = DailyIssueCover 일간 표지,
                           모바일 = MobileHomeCover 4슬라이드 가로 스와이프 커버
/archive                   Archive 색인 (KO)
/archive/[slug]            Archive 글 (KO)
/en/archive                Archive 색인 (EN)
/en/archive/[slug]         Archive 글 (EN)
/deep-dive                 Deep Dive 랜딩 (KO)
/deep-dive/[slug]          Deep Dive 문서 (KO)
/en/deep-dive              Deep Dive 랜딩 (EN)
/en/deep-dive/[slug]       Deep Dive 문서 (EN)
/book                      독서 기록 목록 (현재 KO 원문만 존재)
/book/[slug]               독서 기록 상세
/ai-updates                AI 업데이트 브리핑 목록
/ai-updates/[date]         날짜별 AI 업데이트 브리핑
/issues                    일간 표지 앨범 (반응형 그리드)
/issues/[date]             일간 표지 상세 + Issue Navigator
/guestbook                 방명록 (공용 URL, lang state로 카피 전환)
/about                     소개 (공용 URL)
/privacy-policy            개인정보처리방침 (공용 URL)
/admin/login               관리자 로그인 (JSX)
/admin/analytics           관리자 GA4 분석 대시보드 (JSX)
/api/admin/login|logout|analytics   관리자 API — 외부 대시보드도 직접 호출
/api/guestbook             방명록 API (Supabase)
/feed.xml, /en/feed.xml    RSS
/sitemap.xml, /robots.txt
```

### 일간 표지(Daily Issue) 시스템

- 데이터: `src/data/dailyIssues.ts`에 수동 등록. 등록된 최신 날짜 이후의 Archive 글은 `src/lib/dailyIssues.ts`가 자동으로 표지로 생성한다.
- 표지 템플릿 3종: `classic-editorial`(좌측 헤드라인 + 우측 다크 패널), `big-question`(질문 중심 풀블리드), `side-cover-lines`(사이드 매거진 라인). 날짜의 일(day) % 3으로 로테이션한다.
- 템플릿 커버 이미지: `public/images/covers/YYYY-MM/template-*.webp` (월별 3종). 없으면 `/images/bg.webp` 폴백.
- 표지에는 `weeklyEditions`(주간 책)와 `dailyAiUpdates`(그날의 AI 업데이트)가 결합된다.
- Issue Navigator: `/issues/[date]`에서 이전 표지 / 전체 표지 / 다음 표지 이동. 데스크톱은 우측 플로팅 패널, 모바일은 하단 고정 바.

### KO/EN 다국어

- `/en/...` 라우트는 archive와 deep-dive에만 존재한다.
- 나머지 페이지는 공용 URL을 유지하고 `LangProvider`의 언어 상태로 UI 카피만 전환한다.
- 언어 선택은 내비게이션 간에 유지되어야 하며, EN 콘텐츠 링크를 KO URL로 되돌리지 않는다.

## 4. Directory Structure

```txt
src/app/                 App Router 라우트 (페이지는 서버 컴포넌트)
src/components/          기능별 폴더: about, ai-updates, analytics, archive,
                         book, deep-dive, guestbook, home, issues, layout, privacy
src/lib/                 데이터 로더·유틸
                         posts.ts(글), books.ts(독서 기록), dailyIssues.ts(표지),
                         i18n.ts, rss.ts,
                         adminAuth.js, ga4Client.js, analytics*.js (관리자 전용, JS)
src/data/                TS 상수 데이터: dailyIssues, dailyAiUpdates,
                         weeklyEditions, aiUpdates
src/types/               공용 타입
src/content/books/       독서 기록 마크다운 (.ko.md — 메인 레포 소속, 서브모듈 아님)
content/                 글 서브모듈 (Aprasaks/dechive-content)
                         posts/*.ko.md 원문, *.en.md 번역
scripts/                 check-content.ts, sync-images.ts, translate.ts(래퍼)
public/images/covers/    월별 표지 템플릿 (YYYY-MM/template-*.webp)
public/images/books/     주간 책 커버
public/images/posts/     sync-images.ts 생성물 — gitignore 대상, 직접 편집 금지
public/audio/            배경음악 background-music1~9.mp3
                         (MusicProvider가 파일명을 동적 생성하므로 9개 전부 필요)
```

## 5. Code Conventions

- 페이지 패턴: `page.tsx`는 서버 컴포넌트로 메타데이터와 데이터 로딩을 담당하고, 인터랙티브 UI는 같은 기능 폴더의 `*Client.tsx`(`'use client'`)로 분리한다.
- import alias: `@/*` → `src/*`
- 스타일: Tailwind 유틸리티 클래스 inline. 전역 CSS는 `globals.css` 하나만 쓴다.
- 팔레트: warm ivory `#f8f6f1`, dark `#080806`, muted gold `#d6a352`. 얇은 border, 넓은 여백, 에디토리얼 지면.
- 폰트: `next/font/google` (Geist, Noto Serif KR 등) + CSS 변수 `--font-*`.
- 네이밍: 라우트 폴더는 kebab-case, 컴포넌트는 PascalCase, lib/데이터는 camelCase.
- admin 영역(`src/app/admin/*`, `src/lib/adminAuth.js` 등)만 역사적으로 JS/JSX다. 새 코드는 TS/TSX로 작성한다.
- 콘텐츠 파일명: `slug.ko.md` / `slug.en.md`.

## 6. Commands

```bash
npm run dev            # sync-images 후 next dev
npm run build          # check-content + sync-images + next build
npm run lint           # eslint
npm run check:content  # frontmatter 검증만
npm run translate      # 새 .en.md 생성 (기존 en.md 보호)
npm run translate -- --force   # 검수 전제의 강제 재번역
npx tsc --noEmit       # 타입 체크
```

배포: main 브랜치 푸시 → Vercel 자동 배포.  
환경변수(Vercel 관리): `ADMIN_ID`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `GA_CLIENT_EMAIL`, `GA_PRIVATE_KEY`, `GA_PROPERTY_ID`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`.

## 7. 주의사항 (건드리면 안 되는 영역)

- **admin API는 외부 대시보드가 사용하므로 삭제/수정 금지.**
  `/api/admin/login|logout|analytics` 라우트와
  `src/lib/adminAuth.js`, `src/lib/ga4Client.js`, `src/lib/analyticsDateRange.js`,
  `src/lib/analyticsInsight.js`, `src/lib/analyticsLabels.js`,
  의존성 `@google-analytics/data`, `bcryptjs`까지 전부 해당된다.
  레포 내 `/admin/*` 페이지 외에 별도 외부 관리자 대시보드가 이 API를 직접 호출한다.
- 모바일 미구현 영역:
  - 일간 표지(`DailyIssueCover`)는 `md` 이상 전용이다(`hidden md:grid`). 모바일 홈은 `MobileHomeCover` 슬라이드로 대체된다.
  - `/issues/[date]`는 모바일에서 표지 본문이 렌더되지 않고 하단 고정 내비게이션만 보인다. 모바일 표지 뷰는 미구현 상태다.
- Index(개념 지도) 페이지는 아직 라우트로 구현되지 않았다. `concepts`는 frontmatter 색인으로만 존재한다.
- request-post API와 Discord 웹훅 연동은 2026-07-02 정리 작업에서 제거되었다.
- 아래는 명시 요청 없이 건드리지 않는다:
  - 한/영 이중 경로
  - Sitemap
  - Google Analytics
  - AdSense (`public/ads.txt`, layout의 adsbygoogle 스크립트)
  - Privacy Policy
  - Vercel 환경변수
  - 번역 스크립트
  - content 서브모듈 워크플로우 (translate.yml)

## 8. Harness Thinking

하네스 엔지니어링은 AI를 강하게 만드는 주문이 아니다.

Dechive에서 하네스란 작업을 다음 요소로 묶는 것이다.

- Goal: 무엇을 해결하는가
- Scope: 어디까지 다루는가
- Boundary: 무엇을 하지 않는가
- Verification: 무엇으로 확인하는가
- Stop Condition: 언제 멈추는가

코드든 글이든, 작업 전에 이 다섯 가지를 먼저 잡는다.

좋은 하네스는 가능성을 줄이는 것이 아니라, 방향을 준다.

## 9. Content Model

Dechive의 콘텐츠 구조:

```txt
type = archive | deepdive
category = 큰 분류
post = 하나의 독립 기록 또는 심층 문서
tags = 색인
concepts = Deep Dive 개념 색인
```

콘텐츠 타입:

```txt
Archive = 하나의 질문으로 남긴 독립 기록
Deep Dive = 하나의 키워드를 끝까지 파고드는 심층 지식 문서
Book Note = 독서 기록 (src/content/books, /book 라우트 — 글 서브모듈과 별개)
```

Daily 구분:

- 마크다운 콘텐츠 타입으로서의 `daily`는 사용하지 않는다.
- 단, 일간 표지(Daily Issue) 시스템은 코드 레벨(`src/data`, `/issues`)로 운영 중이다. 이것은 글이 아니라 표지 UI다.

Archive는 짧더라도 하나의 질문에 답해야 한다.  
다른 글의 앞뒤 순서를 전제로 쓰지 않는다.

Deep Dive는 하나의 키워드를 기준으로 개념, 배경, 구조, 예시, 실수, 한계, 추론, 검증 기준까지 정리한다.  
나중에 사람이 다시 검증하고 판단할 수 있도록 문서 구조가 명확해야 한다.

기본 category:

```txt
Dev
Data
Product
AI
```

규칙:

- `series` 사용 금지
- 각 글은 독립적으로 읽혀야 한다
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

## 10. Frontmatter Rules

check-content.ts가 빌드 전에 검증한다.

공통 필수 필드:

```txt
title, seoTitle, date, type, category, tags, slug, description, status, lang
```

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
---
```

Deep Dive 기본 구조:

```yaml
---
title: '키워드를 끝까지 파고드는 제목'
seoTitle: '검색용 설명형 제목'
date: YYYY-MM-DD
type: deepdive
category: Product
tags:
  - Agile
  - AI
  - Verification
slug: ai-era-agile-verification
description: '개념, 예시, 실수, 한계, 추론, 검증 기준까지 다루는 설명'
status: draft
lang: ko
coverImage: './ai-era-agile-cover.webp'
concepts:
  - Agile
  - Verification
---
```

Book Note 기본 구조 (src/content/books):

```yaml
---
title: '책 제목'
author: '저자'
publisher: ''
date: YYYY-MM-DD
readDate: YYYY-MM-DD
slug: url-friendly-slug
coverImage: '/images/books/YYYY-MM-DD.webp'
tags:
  - AI
status: published
lang: ko
summary: '이 독서 기록이 남기는 관점을 설명하는 문장'
---
```

규칙:

- title은 Dechive 안에서 보이는 책 제목이다
- seoTitle은 구글 검색용 색인 제목이다
- title을 SEO 때문에 바꾸지 않는다
- slug는 임의로 변경하지 않는다
- description은 과장 없이 명확하게 쓴다
- category는 큰 분류다
- type은 `archive` 또는 `deepdive`를 사용한다
- Archive는 `subject`, `thumbnail`, `coverImage`, `updated`, `concepts`를 쓰지 않는다
- Deep Dive는 `coverImage`와 `concepts`를 반드시 쓴다
- Deep Dive는 `subject`, `thumbnail`, `updated`를 쓰지 않는다
- 한국어 `.ko.md`가 원문이다
- 기존 영어 `.en.md`는 보호한다
- slug는 번역하지 않는다

이미지 규칙:

- `coverImage`는 Deep Dive에만 기본 사용한다 (Book Note는 별도 규격)
- Archive에는 `coverImage`를 넣지 않는다
- Archive는 텍스트 중심의 독립 기록으로 둔다
- Deep Dive는 커버가 있는 특집 문서로 다룬다
- 이미지 안에는 제목이나 긴 텍스트를 넣지 않는다
- 제목, 설명, 태그는 코드나 본문에서 렌더링한다
- 커버 이미지는 텍스트 없는 상징 이미지로 만든다
- 글 본문 이미지는 해당 md 파일과 같은 `content/posts` 안에 두고 `./filename.png` 형식으로 참조한다 (빌드 시 sync-images.ts가 public으로 복사)
- 본문 도식 이미지는 필요한 경우에만 최소한으로 넣는다
- Deep Dive 본문 이미지는 처음부터 많이 넣지 말고, 핵심 도식 2~3개부터 시작한다

이미지는 장식이 아니라 글의 입구를 돕는 시각적 문장이다.

이미지 기획 시 아래 항목을 작성한다.

```txt
Image Purpose: 이 이미지는 검색/SNS/본문/Deep Dive 커버 중 어디에 쓰이는가?
Visual Metaphor: 글의 핵심 질문을 어떤 장면으로 상징하는가?
Objects: 이미지에 들어갈 주요 사물은 무엇인가?
Mood: 색감, 분위기, 빛은 어떤가?
Avoid: 넣지 말아야 할 요소는 무엇인가?
Text Policy: 이미지 안에는 긴 텍스트를 넣지 않는다.
```

- Dechive 톤은 warm ivory, muted gold, 조용한 아카이브, 에디토리얼한 지면을 유지한다
- 이미지 방향은 글 작성 전에 함께 정한다
- 이미지가 필요하지 않은 Archive는 억지로 만들지 않는다

## 11. Writing Rules

글을 쓰기 전에 핵심 질문을 정한다.

예:

```txt
LLM은 어떻게 답을 만들어내는가?
AI에게 정확하게 말한다는 것은 무엇인가?
MCP는 워크플로우와 무엇이 다른가?
```

글 전체는 이 질문 하나에 답해야 한다.

Archive 밀도 기준:

Archive는 짧아야 하는 글이 아니다. 하나의 질문을 너무 넓히지 않고, 충분히 답하는 글이다.
읽고 나서 하나의 관점이나 판단 기준이 남아야 한다. 단순 메모가 아니라 완결된 기록이어야 한다.

```txt
최소 완성 단위:
하나의 질문. 하나의 관점. 하나의 검증 기준.

Archive는 글자 수를 목표로 쓰지 않는다.
Archive는 하나의 질문을 독자가 충분히 납득하고 이해할 수 있을 만큼 전개해야 한다.
문제 제기만 하고 끝내지 않는다.
질문의 배경, 헷갈리는 지점, 구분해야 할 기준, 검증 관점, 마지막 질문까지 충분히 다룬다.
단순한 의견문이나 짧은 메모처럼 쓰지 않는다.
Archive는 짧은 기록이 아니라, 하나의 질문을 독립적으로 검증하는 글이다.
글이 너무 짧아져서 질문의 의미가 사라지지 않도록 한다.
다만 Deep Dive처럼 주제를 과도하게 넓히지는 않고, 하나의 질문 안에서 충분히 깊게 쓴다.

Deep Dive 후보:
하나의 질문을 넘어서 개념, 배경, 구조, 사례, 한계, 추론, 검증 기준까지 확장되어야 하는 글
```

Archive 기본 흐름:

```txt
1. 질문 — 이 글이 붙잡는 하나의 질문
2. 배경 — 왜 이 질문이 생겼는가
3. 오해 — 흔히 어디서 잘못 이해하는가
4. 관점 — 이 글이 제안하는 답
5. 검증 기준 / 남는 질문 — 그래서 무엇을 확인해야 하는가
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

글의 첫 문장은 정의보다 문제에 가까워야 한다.

피할 도입:

```txt
~란 무엇일까?
~에 대해 알아보자.
~는 중요한 개념이다.
```

좋은 도입:

```txt
AI는 설명을 잘한다. 그래서 우리는 더 쉽게 착각한다.
처음에는 같은 말처럼 보인다. 하지만 판단 기준은 다르다.
문제는 답을 받는 순간이 아니라, 그 답을 이해했다고 믿는 순간에 생긴다.
```

글의 입구는 다음 질문에 답해야 한다.

```txt
이 글을 읽으면 독자는 무엇을 구분하게 되는가?
이 글은 어떤 착각을 줄여주는가?
이 글은 어떤 판단 기준을 남기는가?
```

추가 원칙:

- 글은 개념 정의로 바로 시작하지 않는다.
- 독자가 겪는 혼란, 착각, 판단 문제에서 시작한다.
- 첫 문단은 검색/SNS에서 들어온 독자가 왜 계속 읽어야 하는지 알려줘야 한다.
- 제목이 질문이라면 첫 문단은 그 질문이 왜 필요한지 보여줘야 한다.
- 설명보다 먼저 문제의식을 세운다.
- Archive는 마지막에 하나의 검증 질문이 남아야 한다.

## 12. Writing Harness

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

### Entry Design

글을 쓰기 전에 본문만 설계하지 않는다.
독자가 이 글을 발견하고 눌러볼 이유까지 함께 설계한다.

각 글은 작성 전에 아래 항목을 먼저 잡는다.

```txt
Reader Problem: 이 글을 눌러야 할 사람은 어떤 문제를 갖고 있는가?
Search Intent: 그 사람은 어떤 말로 검색할 가능성이 있는가?
Dechive Title: Dechive 안에서 보이는 질문형 제목은 무엇인가?
SEO Title: 검색자가 이해하기 쉬운 설명형 제목은 무엇인가?
SNS Hook: 검색하지 않던 사람이 멈출 첫 문장은 무엇인가?
One-line Summary: 이 글을 한 문장으로 설명하면 무엇인가?
Closing Question: 글을 읽은 뒤 독자에게 남길 검증 질문은 무엇인가?
```

원칙:

- title은 Dechive다운 질문으로 유지한다.
- seoTitle은 검색자의 언어에 가깝게 쓴다.
- SNS Hook은 frontmatter 필드가 아니다.
- SNS Hook은 본문에 반드시 들어가는 문장도 아니다.
- SNS Hook은 글을 외부에 공유할 때 사용하는 첫 문장이다.
- SNS Hook은 과장된 홍보 문구가 아니라, 검색하지 않던 사람도 글의 문제의식을 알아볼 수 있게 만드는 문장이다.
- One-line Summary는 공유 문장이나 뉴스레터 미리보기에도 쓸 수 있어야 한다.
- Closing Question은 Dechive의 검증 철학으로 닫는다.
- 생각나는 대로 쓰는 것은 글감 발굴 단계까지만 허용한다.
- 발행 글은 반드시 입구를 설계한 뒤 작성한다.

## 13. Writing Tone

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

## 14. Translation Rules

한국어 원문을 먼저 작성한다.
영어 파일은 번역 스크립트로 최초 생성한다.

정책:

```txt
자동 번역 = 새 영어 글 최초 생성용
기존 en.md = 보호
기존 en.md 재번역 = 명시적 force일 때만 허용
```

번역 로직의 원본은 `content/.github/scripts/translate.mjs`다.
루트의 `scripts/translate.ts`는 래퍼일 뿐이다. 래퍼에 번역 로직을 다시 넣지 않는다.

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

## 15. SEO Rules

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

각 글은 다음 세 가지 문장의 역할을 구분해서 설계한다.

```txt
title    = Dechive 안에서 보이는 책 제목
seoTitle = 검색자가 입력할 법한 말에 가까운 색인 제목
SNS Hook = 검색하지 않던 사람도 멈출 수 있는 첫 문장
```

예시:

```txt
title:
AI가 알려준 답을 그대로 배워도 될까?

seoTitle:
AI로 공부해도 될까? AI 답변을 그대로 믿으면 안 되는 이유

SNS Hook:
AI는 설명을 정말 잘한다.
그래서 우리는 더 쉽게 착각한다.
설명을 들은 것과 이해한 것은 같지 않다.
```

추가 원칙:

- title을 검색 유입 때문에 낚시 제목으로 바꾸지 않는다.
- seoTitle은 검색자의 언어에 맞춘다.
- SNS Hook은 과장하지 않는다.
- SNS Hook은 문제의식, 착각, 검증 기준을 짧게 드러낸다.
- title, seoTitle, SNS Hook이 모두 같은 문장일 필요는 없다.
- 세 문장은 같은 글을 서로 다른 입구에서 설명해야 한다.

## 16. UI / UX Rules

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

Archive 화면:

- 왼쪽은 색인, 필터, 검색 / 오른쪽은 기록 목록
- 필터는 category 기준으로 작동한다
- 이전 글, 다음 글, 이어지는 글처럼 순서를 암시하지 않는다

About:

- Dechive가 무엇인지, 왜 검증 아카이브인지
- AI 시대에 왜 사람이 이해하고 검증해야 하는지
- Archive와 Deep Dive가 어떤 역할인지 설명한다

## 17. 콘텐츠 배포 워크플로우

새 글을 쓰고 배포하는 순서:

```txt
1. .ko.md 작성 → content 서브모듈 커밋·푸시
2. GitHub Actions translate.yml 완료 대기 (1~2분)
   → .en.md 자동 생성됨
3. content 서브모듈 pull (포인터 최신화)
   cd content && git pull
4. 메인 레포에서 서브모듈 포인터 업데이트
   git add content && git commit && git push
5. Vercel 자동 배포
```

Claude Code가 지켜야 할 규칙:

- `.ko.md` 커밋·푸시 후 번역 완료 전에 메인 레포를 커밋하지 않는다
- 메인 레포 커밋 전에 반드시 `cd content && git pull`로 최신 상태 확인
- 이슈 → 커밋 → 푸시 순서는 항상 지킨다
- content 서브모듈과 메인 레포 커밋은 항상 분리한다

## 18. Never Do

절대 하지 말 것:

- **admin API(`/api/admin/*`)와 관련 lib/의존성 삭제·수정 — 외부 대시보드가 사용 중**
- Dechive를 일반 블로그처럼 만들기
- series 추가
- 1편/2편/다음 편 표현 사용
- slug 임의 변경
- 인프라 임의 수정
- 기존 영어 글 자동 덮어쓰기
- 검수 없이 force 재번역
- skill percentage bar 추가
- 밝은 SaaS 스타일로 변경
- `daily`를 마크다운 콘텐츠 타입으로 임의 추가
- Deep Dive를 단순히 긴 Archive 글처럼 작성
- Archive 글을 이어지는 연재처럼 작성
- 사실을 만들어내기
- 글을 길게 보이게 하려고 불필요하게 늘리기
- 본문만 쓰고 title / seoTitle / SNS Hook / Image Direction을 나중에 대충 붙이기
- 검색 유입을 위해 Dechive다운 title을 낚시 제목으로 바꾸기
- SNS 반응을 위해 과장된 훅 사용하기
- 이미지 안에 긴 제목이나 설명문을 넣기
- Archive frontmatter에 임의로 coverImage 추가하기
- 입구를 설계하지 않은 상태로 글을 발행하기
- `public/images/posts/` 직접 편집 (sync-images.ts 생성물)

## 19. Work Report Format

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

## 20. Final Standard

좋은 Dechive 작업은 다음을 만족한다.

- 정체성을 흐리지 않는다
- 필요한 것만 바꾼다
- 글은 하나의 질문에 답한다
- Archive는 독립 기록으로 남는다
- Deep Dive는 검증 가능한 심층 문서가 된다
- UI는 에디토리얼한 검증 아카이브 분위기를 유지한다
- SEO보다 사람을 먼저 생각한다
- 결과는 조용하지만 선명하다
- 글은 발견될 입구까지 설계되어 있다
- title, seoTitle, SNS Hook의 역할이 구분되어 있다
- 첫 문단은 독자의 문제의식과 연결되어 있다
- 이미지 방향은 글의 핵심 질문을 상징한다
- 독자는 글을 누르기 전에 왜 읽어야 하는지 알 수 있다

Dechive는 콘텐츠를 빠르게 쌓는 곳이 아니다.
Dechive는 AI 시대의 답을 이해하고 검증하기 위한 지식 아카이브다.
