# Dechive 프로젝트 가이드라인

Claude가 이 프로젝트에서 코드를 작성하거나 콘텐츠를 다룰 때 반드시 준수해야 하는 지침이다. 모든 작업은 수익화(AdSense)와 지식 저장소 성능(RAG, SEO)을 최우선으로 고려한다.

---

## 0. 디자인/UX 방향

UI/UX 또는 시각 디자인을 변경하기 전에 `docs/dechive_design_notes.md`를 읽고 그 방향을 따른다.

핵심 방향:
- Dechive는 단순 블로그가 아니라 **탐색 가능한 지식의 도서관**으로 보여야 한다.
- 메인은 글 목록이 아니라 **도서관 입구** 역할을 한다.
- Archive는 펼쳐진 책 UI를 유지하되, 탐색창/총 기록 수/시리즈 수/랜덤 탐색/관련 기록 등 탐색 루프를 강화한다.
- 해골 마스코트는 장식이 아니라 **사서 인터페이스**로 다룬다.
- 오로라, 네온, 강한 마법진보다 조용한 고딕 도서관 분위기와 텍스트 가독성을 우선한다.

---

## 1. 코드 규칙

- **Zero Any**: `any` 타입 사용 금지. 타입을 모르면 추론하거나 명시적 인터페이스를 설계하라.
- **Centralized Types**: 모든 타입 정의는 `types/` 폴더에서 관리한다.
- **Single Responsibility**: 한 컴포넌트는 한 가지 기능만 수행한다.
- **Tailwind V4**: `bg-linear-to-r/l/t/b`, `size-*`, `shrink-0`, `backdrop-blur-xs` 등 V4 유틸리티 우선. arbitrary value `[value]` 최소화.
- **ESLint 0**: `npm run lint` 항상 0 errors. 코드 수정 후 반드시 확인.
- **TypeScript 0**: `npx tsc --noEmit` 항상 0 errors.

### 자주 발생하는 실수

**prose pre 가로 스크롤** — `globals.css`에 이미 적용됨:
```css
.prose pre { max-width: calc(100vw - 2rem); width: 100%; overflow-x: auto; }
```
`overflow-x-hidden`을 article에 넣으면 코드블록 스크롤이 막힘 → 절대 넣지 마라.

**Next.js Image** — `fill` 사용 시 부모에 `relative` + `sizes` prop 필수. width/height 고정 시 `className`에 `size-*` 추가.

**포스트 이미지 경로** — 이미지는 반드시 `content/posts/`에 저장. `public/`에 넣으면 마크다운에서 상대 경로 참조가 안 된다.

---

## 2. 워크플로우

### 이슈 → 커밋 → 푸시 (절대 불변)
```
gh issue create → git commit → git push
```
순서를 절대 바꾸지 않는다. 커밋/푸시 먼저 하고 이슈 나중에 만드는 것 금지.

**각 단계는 반드시 명시적 요청 시에만 실행한다.**
- "이슈 만들어" → 이슈 생성만
- "커밋해" → 커밋만. 푸시 자동 실행 절대 금지
- "푸시해" 또는 "커밋푸시해" → 그 때만 push 실행

### 번역 스크립트
```bash
# 새 포스트 작성 후
npm run translate

# 특정 포스트만 재번역
rm content/posts/{slug}.en.md && npm run translate
```
- `.en.md` 직접 작성 또는 수동 번역 **절대 금지**
- `--force` 옵션 사용 금지 (전체 재번역 → API 비용 폭발)
- 새 시리즈 추가 시 **두 군데** 모두 반드시 추가:
  - `scripts/translate.ts`의 `SERIES_MAP`
  - `src/components/archive/BookArchive.tsx`의 `SERIES_MAP`
```typescript
const SERIES_MAP: Record<string, string> = {
  '프롬프트 가이드': 'Prompt Guide',
  'SQL 완전 정복': 'SQL Mastery',
  'GA4 완전 정복': 'GA4 Mastery',
  // 새 시리즈는 여기에 추가
};
```

### 서브모듈 워크플로우
```bash
cd content
git pull --rebase origin main
git add . && git commit -m "..." && git push
cd ..
git pull --rebase origin main
git add content && git commit -m "chore: content 서브모듈 업데이트" && git push
```
충돌 시: `git checkout --theirs {file}` → push

---

## 3. 인프라 현황 (건드리면 안 되는 것들)

| 시스템 | 상태 | 설명 |
|--------|------|------|
| Supabase pgvector RAG | ✅ | 포스트 벡터 임베딩. GitHub Actions로 push 시 자동 실행 |
| 한/영 이중 경로 | ✅ | `/archive/{slug}` (KO) / `/en/archive/{slug}` (EN) |
| AI 사서 챗봇 | ✅ | Gemini API + Supabase RAG |
| AdSense | ✅ | ca-pub-4611005224374273 |
| Google Analytics | ✅ | G-Y08SJBLW8G |
| Sitemap | ✅ | `/en/archive/` 경로 포함 자동 생성 |
| 모바일 최적화 | ✅ | BookArchive 탭 전환, prose pre 가로 스크롤 |

**Vercel 환경변수:**
`GOOGLE_GENERATIVE_AI_API_KEY` / `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` / `ANTHROPIC_API_KEY`

---

## 4. 콘텐츠 규칙

### 철학

| 구분 | Archive | Logs |
|------|---------|------|
| 성격 | 정제된 지식 백과 | 현장 트러블슈팅 기록 |
| 분량 | 충분한 설명, 시리즈 가능 | 짧아도 OK (500자 이상) |
| 제목 | 주제 완결형 | 증상/에러 직접 기술 |
| 역할 | Logs를 흡수해 재정립한 완결본 | Archive의 원재료 |

- Archive는 해당 주제를 **다른 사이트 없이 자체 완결**해야 한다.
- **할루시네이션 금지**: 불확실한 사실은 작성하지 않는다.
- 포스트 작성 후 반드시 번역 스크립트 실행.

### Archive 포스트 frontmatter

파일명: `{slug}.ko.md` — `content/posts/` 저장. `.en.md`는 번역 스크립트가 생성.

```yaml
---
title: "주제 완결형 제목 (키워드 포함, 시리즈면 편수 명시)"
date: YYYY-MM-DD
category: Dev          # Dev / Productivity / Philosophy 중 하나
tags:
  - 태그1
slug: url-friendly-slug
summary: 카드에 표시될 한 줄 요약 (50자 내외)
description: "SEO 스니펫용 설명 (120~160자, 콤마 포함 시 따옴표 필수)"
status: published
lang: ko
series: 시리즈명         # 연재글이면 기입, 없으면 생략
---
```

### Logs frontmatter

파일명: `{slug}.ko.md` — `content/logs/` 저장.

```yaml
---
title: "에러 메시지 원문 또는 증상 그대로 + 해결/원인/정리"
date: YYYY-MM-DD
tags:
  - 태그1
slug: url-friendly-slug
summary: 한 줄 요약
description: 어떤 상황 → 뭐가 문제 → 이 글에서 뭘 알 수 있는지 (120~160자)
status: published
lang: ko
---
```

### SEO / AdSense

- Semantic HTML: `article`, `section`, `nav`, `aside` 사용.
- 모든 페이지에 Title, Description, OpenGraph, JSON-LD 포함.
- hreflang KO/EN 상호 참조 (`alternates.languages`). canonical URL 명시.
- AdSense 정책 위반 여부 항상 자문. Privacy Policy, About 푸터 링크 필수.

---

## 5. 시리즈 현황

### 프롬프트 가이드 — 완결 (18/18편)
series명: `프롬프트 가이드` | 슬러그: `llm-architecture` ~ `prompt-as-career` | 번외: `prompt-real-world-guide`

### SQL 완전 정복 (2/28편 진행 중)
series명: `SQL 완전 정복`

| 편수 | 주제 | 슬러그 | 상태 |
|-----|------|--------|------|
| 1편 | 데이터모델의 이해 | `data-modeling-understanding` | ✅ |
| 2편 | 관계형 데이터베이스 개요 | `relational-database-sql` | ✅ |
| 3편 | 엔터티 | - | ⬜ |
| 4편 | 속성 | - | ⬜ |
| 5편 | 관계 | - | ⬜ |
| 6편 | 식별자 | - | ⬜ |
| 7편 | 정규화 | - | ⬜ |
| 8편 | 관계와 조인의 이해 | - | ⬜ |
| 9편 | 모델이 표현하는 트랜잭션의 이해 | - | ⬜ |
| 10편 | NULL 속성의 이해 | - | ⬜ |
| 11편 | 본질 식별자 vs 인조 식별자 | - | ⬜ |
| 12편 | SELECT문 | - | ⬜ |
| 13편 | 함수 | - | ⬜ |
| 14편 | WHERE 절 | - | ⬜ |
| 15편 | GROUP BY / HAVING / ORDER BY | - | ⬜ |
| 16편 | JOIN | - | ⬜ |
| 17편 | 서브쿼리 | - | ⬜ |
| 18편 | 집합 연산자 | - | ⬜ |
| 19편 | 그룹 함수 | - | ⬜ |
| 20편 | 윈도우 함수 | - | ⬜ |
| 21편 | Top N 쿼리 | - | ⬜ |
| 22편 | 계층형 질의와 셀프 조인 | - | ⬜ |
| 23편 | PIVOT 절과 UNPIVOT 절 | - | ⬜ |
| 24편 | 정규 표현식 | - | ⬜ |
| 25편 | DML 심화 | - | ⬜ |
| 26편 | TCL 심화 | - | ⬜ |
| 27편 | DDL 심화 | - | ⬜ |
| 28편 | DCL 심화 | - | ⬜ |

### GA4 완전 정복 (1/10편 진행 중)
series명: `GA4 완전 정복`

| 편수 | 제목 | 슬러그 | 상태 |
|-----|------|--------|------|
| 1편 | GA4란 무엇인가 — 개념과 구조 | `ga4-introduction` | ✅ |
| 2편 | 데이터 수집의 원리 — 이벤트 설계 | - | ⬜ |
| 3편 | GA4 설치하기 — 구글 태그와 GTM | - | ⬜ |
| 4편 | GA4 설정 완전 정리 | - | ⬜ |
| 5편 | 보고서 읽는 법 — 측정 기준과 측정 항목 | - | ⬜ |
| 6편 | GA4 기본 보고서 완전 해부 | - | ⬜ |
| 7편 | 탐색 분석 완전 정복 | - | ⬜ |
| 8편 | 세그먼트와 잠재 고객 | - | ⬜ |
| 9편 | 다른 도구와 연결하기 | - | ⬜ |
| 10편 | 데이터 시각화 — 루커 스튜디오 | - | ⬜ |

---

## 6. 협업 규칙

**커밋 포맷**: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:` 중 하나로 시작.

**이슈 본문 구조**:
```
#### Purpose
#### To-Do
- [ ] 항목
#### Changes
#### Screenshots
```

**이슈 제목**: `[feat]`, `[fix]`, `[refactor]`, `[chore]`, `[docs]` 중 하나로 시작.

**소통**:
- 구현 계획 먼저, 승인 후 코드 작성.
- 설계 선택지가 여러 개면 먼저 물어본다.
- 사용자(Demian)는 '오라버니', Claude는 '애기'.
- 포스트 본문에서 '애기' 호칭 사용 금지. AI 도구는 'Claude Code'로 표기. 1인칭은 '저' 또는 무주어.
