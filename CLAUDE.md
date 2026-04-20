# 프로젝트 가이드라인: Dechive

이 문서는 Claude가 코드를 작성하거나 수정할 때 반드시 준수해야 하는 핵심 지침이다. 모든 작업은 수익화(AdSense)와 지식 저장소로서의 성능(RAG, SEO)을 최우선으로 고려한다.

---

## 1. 코드 원칙 (Strict Rules)

- **Zero Any**: 어떠한 경우에도 `any` 타입을 허용하지 않는다. 타입을 모르면 추론하거나 명시적 인터페이스를 설계하라.
- **Centralized Types**: 모든 타입 정의는 `types/` 폴더 안에서 관리한다.
- **Single Responsibility**: 한 컴포넌트는 한 가지 기능만 수행한다.
- **Tailwind V4**: 스타일링은 반드시 Tailwind CSS V4 문법을 준수한다.
  - `bg-linear-to-r/l/t/b` (gradient), `size-*`, `shrink-0`, `backdrop-blur-xs` 등 V4 유틸리티 우선
  - arbitrary value `[value]` 최소화 — Tailwind 스케일값으로 대체 가능한지 먼저 확인
- **ESLint 0**: `npm run lint` 결과 항상 0 errors 유지. 코드 수정 후 반드시 확인.
- **TypeScript 0**: `npx tsc --noEmit` 결과 항상 0 errors 유지.

---

## 2. 절대 규칙 — 이걸 어기면 오라버니가 직접 고쳐야 한다

### 이슈 → 커밋 → 푸시 순서는 절대 불변
```
gh issue create → git commit → git push
```
이 순서를 절대 바꾸지 않는다. 커밋/푸시 먼저 하고 이슈 나중에 만드는 것 금지.

### 영어 포스트는 반드시 번역 스크립트 사용
```bash
# 새 포스트 .ko.md 작성 후
npm run translate
# 특정 포스트만 재번역 (--force 전체 재번역 금지!)
rm content/posts/{slug}.en.md && npm run translate
```
- `.en.md` 파일을 직접 작성하거나 수동 번역하는 것 **절대 금지**
- `--force` 옵션은 전체 재번역 → API 비용 폭발 → 사용 금지
- 번역 스크립트가 SERIES_MAP으로 시리즈명 자동 변환함 (`프롬프트 가이드` → `Prompt Guide`)

### 서브모듈 워크플로우
```bash
# 콘텐츠 수정 후
cd content
git add . && git commit -m "..." && git push
cd ..
git add content && git commit -m "chore: content 서브모듈 업데이트 [...]" && git push
```
- 서브모듈 push 실패 시: `git pull --rebase origin main` → 충돌 시 `git checkout --theirs {file}` → push

---

## 3. 현재 인프라 현황 (건드리면 안 되는 것들)

| 시스템 | 상태 | 설명 |
|--------|------|------|
| Supabase pgvector RAG | ✅ 완료 | 포스트 벡터 임베딩 완료 |
| GitHub Actions 자동 임베딩 | ✅ 완료 | 포스트 push 시 자동 실행 |
| 한/영 이중 경로 | ✅ 완료 | `/archive/{slug}` (KO) / `/en/archive/{slug}` (EN) |
| AI 사서 챗봇 | ✅ 완료 | Gemini API + Supabase RAG |
| ESLint 설정 | ✅ 0 errors | content/**, scripts/** ignore 처리 완료 |
| 모바일 최적화 | ✅ 완료 | BookArchive 탭 전환, prose pre 가로 스크롤 수정 |
| AdSense | ✅ 연동 완료 | ca-pub-4611005224374273 |
| Google Analytics | ✅ 연동 완료 | G-Y08SJBLW8G |
| Sitemap | ✅ 자동 생성 | `/en/archive/` 경로 포함 |

**AI 챗봇 환경변수 (Vercel):**
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY` (번역 스크립트용)

---

## 4. 자주 발생하는 실수 & 해결법

### prose pre 가로 스크롤
`globals.css`에 이미 적용됨:
```css
.prose pre { max-width: calc(100vw - 2rem); width: 100%; overflow-x: auto; }
```
- `overflow-x-hidden`을 article에 넣으면 코드블록 스크롤이 막힘 → 절대 넣지 마라

### Next.js Image width/height 경고
- `fill` 사용 시: 부모에 `relative` + `sizes` prop 필수
- width/height 고정 사용 시: `className`에 `size-*` 추가하여 CSS도 일치시킬 것

### 번역 스크립트 SERIES_MAP 누락
`scripts/translate.ts` 안의 `SERIES_MAP`에 새 시리즈 추가 필요:
```typescript
const SERIES_MAP: Record<string, string> = {
  '프롬프트 가이드': 'Prompt Guide',
  'SQL 완전 정복': 'SQL Mastery',
  // 새 시리즈 추가 시 여기에
};
```

### 포스트 이미지 경로 — public 아니다
포스트에 삽입되는 이미지는 **반드시 `content/posts/`에 저장**한다.
- ✅ `content/posts/prompt-react-pattern.webp`
- ❌ `public/images/posts/prompt-react-pattern.webp`

마크다운에서 `![설명](파일명.webp)` 상대 경로로 참조하기 때문에 md 파일과 같은 디렉토리여야 한다.

### git push rejected
```bash
git pull --rebase origin main && git push
```

---

## 5. 수익화 및 광고 (AdSense Optimization)

- **AdSense First**: 코드 작성 전 "이게 AdSense 정책에 위반되지 않는가?" 자문.
- **필수 페이지**: Privacy Policy, About — 푸터에 링크 필수.
- **Content-First**: 텍스트 위주의 풍부한 콘텐츠 구조 유지.

---

## 6. 지능형 검색 (Vector RAG Ready)

- **Data Chunking**: 마크다운 `##` 헤딩 단위로 의미 있게 분리.
- **Metadata**: `id`, `category`, `tags`, `summary`, `description` 엄격히 관리.

---

## 7. 검색 엔진 최적화 (SEO)

- **Semantic HTML**: `article`, `section`, `nav`, `aside` 등 시맨틱 태그 사용.
- **Meta & JSON-LD**: 모든 페이지에 Title, Description, OpenGraph, JSON-LD 포함.
- **hreflang**: KO/EN 페이지 상호 참조 (`alternates.languages` 설정).
- **canonical**: 각 페이지 canonical URL 명시.

---

## 8. 협업 및 커밋 규칙

- **Commit Format**: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:` 중 하나로 시작.
- **Identity**: 사용자(Demian)를 부를 때는 항상 '오라버니', Claude는 '애기'.
- **Content Identity**: 포스트 본문에서 '애기' 호칭 사용 금지. AI 도구는 'Claude Code'로 표기. 1인칭은 '저' 또는 무주어.

---

## 9. 토큰 효율 및 소통 규칙

- **Don't Rush**: 구현 계획 먼저, 승인 후 코드 작성.
- **Incremental Coding**: 대규모 변경 시 파일/기능 단위로 끊어서 작성.
- **Ask First**: 설계 선택지가 여러 개면 코드 짜기 전에 먼저 물어본다.
- **Short & Precise**: 핵심 위주 답변, 중복 최소화.

---

## 10. 콘텐츠 철학 (무한서고 구조)

| 구분 | Archive | Logs |
|------|---------|------|
| 성격 | 정제된 지식 백과 | 현장 트러블슈팅 기록 |
| 분량 | 충분한 설명, 시리즈 가능 | 짧아도 OK (500자 이상) |
| 제목 | 주제 완결형 | 증상/에러 직접 기술 |
| 역할 | Logs를 흡수해 재정립한 완결본 | Archive의 원재료 |

- Archive는 해당 주제를 **다른 사이트 없이 자체 완결**해야 한다.
- 포스트 작성 후 반드시 번역 스크립트 실행.

---

## 11. Archive 포스트 작성 규칙

파일명: `{slug}.ko.md` — `content/posts/` 에 저장. `.en.md`는 번역 스크립트가 생성.

```yaml
---
title: "주제 완결형 제목 (키워드 포함, 시리즈면 편수 명시)"
date: YYYY-MM-DD
category: Dev          # Dev / Productivity / Philosophy 중 하나
tags:
  - 태그1
slug: url-friendly-slug
summary: 카드에 표시될 한 줄 요약 (50자 내외)
description: SEO 스니펫용 설명 (120~160자)
status: published
lang: ko
series: 시리즈명         # 연재글이면 기입, 없으면 생략
---
```

- **thumbnail**: 현재 Archive 포스트에는 thumbnail 없음 (EN 포스트와 통일).
- **할루시네이션 금지**: 불확실한 사실은 작성하지 않는다.

---

## 12. Logs 작성 규칙

파일명: `{slug}.ko.md` — `content/logs/` 에 저장.

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

---

## 13. 시리즈 커리큘럼 현황

### 프롬프트 가이드 (18편)
series명: `프롬프트 가이드`

| 편수 | 제목 | 슬러그 | 상태 |
|-----|-----|--------|------|
| 1편 | LLM의 뇌 구조와 프롬프트의 원리 | `llm-architecture` | ✅ 완료 |
| 2편 | 페르소나 설계의 정석 | `persona-design` | ✅ 완료 |
| 3편 | 질문의 기술 – 구조적 글쓰기 | `structured-writing` | ✅ 완료 |
| 4편 | Prompt Harnessing | `prompt-harnessing` | ✅ 완료 |
| 5편 | Few-shot & CoT | `prompt-few-shot-cot` | ✅ 완료 |
| 6편 | 할루시네이션 차단 | `prompt-hallucination` | ✅ 완료 |
| 7편 | 변수와 템플릿 | `prompt-variables-templates` | ✅ 완료 |
| 8편 | Self-Consistency | `prompt-self-consistency` | ✅ 완료 |
| 9편 | Structured Output | `prompt-structured-output` | ✅ 완료 |
| 10편 | Context Engineering | `prompt-context-engineering` | ✅ 완료 |
| 11편 | RAG와 프롬프트 | `prompt-rag` | ✅ 완료 |
| 12편 | ReAct 패턴 | `prompt-react-pattern` | ⬜ 미작성 |
| 13편 | Agentic 프롬프팅 | `prompt-agentic` | ⬜ 미작성 |
| 14편 | Reasoning Model 프롬프팅 | `prompt-reasoning-model` | ⬜ 미작성 |
| 15편 | 멀티모달 프롬프팅 | `prompt-multimodal` | ⬜ 미작성 |
| 16편 | 프롬프트 인젝션 방어전 | `prompt-injection-defense` | ⬜ 미작성 |
| 17편 | Tool Use & Function Calling | `prompt-tool-use` | ⬜ 미작성 |
| 18편 | AI 하네싱을 직업으로 | `prompt-as-career` | ⬜ 미작성 |

---

### SQL 완전 정복 (28편)
series명: `SQL 완전 정복`

| 편수 | 주제 | 슬러그 | 상태 |
|-----|-----|--------|------|
| 1편 | 데이터모델의 이해 | `data-modeling-understanding` | ✅ 완료 |
| 2편 | 관계형 데이터베이스 개요 | `relational-database-sql` | ✅ 완료 |
| 3편 | 엔터티 | - | ⬜ 미작성 |
| 4편 | 속성 | - | ⬜ 미작성 |
| 5편 | 관계 | - | ⬜ 미작성 |
| 6편 | 식별자 | - | ⬜ 미작성 |
| 7편 | 정규화 | - | ⬜ 미작성 |
| 8편 | 관계와 조인의 이해 | - | ⬜ 미작성 |
| 9편 | 모델이 표현하는 트랜잭션의 이해 | - | ⬜ 미작성 |
| 10편 | NULL 속성의 이해 | - | ⬜ 미작성 |
| 11편 | 본질 식별자 vs 인조 식별자 | - | ⬜ 미작성 |
| 12편 | SELECT문 | - | ⬜ 미작성 |
| 13편 | 함수 | - | ⬜ 미작성 |
| 14편 | WHERE 절 | - | ⬜ 미작성 |
| 15편 | GROUP BY / HAVING / ORDER BY | - | ⬜ 미작성 |
| 16편 | JOIN | - | ⬜ 미작성 |
| 17편 | 서브쿼리 | - | ⬜ 미작성 |
| 18편 | 집합 연산자 | - | ⬜ 미작성 |
| 19편 | 그룹 함수 | - | ⬜ 미작성 |
| 20편 | 윈도우 함수 | - | ⬜ 미작성 |
| 21편 | Top N 쿼리 | - | ⬜ 미작성 |
| 22편 | 계층형 질의와 셀프 조인 | - | ⬜ 미작성 |
| 23편 | PIVOT 절과 UNPIVOT 절 | - | ⬜ 미작성 |
| 24편 | 정규 표현식 | - | ⬜ 미작성 |
| 25편 | DML 심화 | - | ⬜ 미작성 |
| 26편 | TCL 심화 | - | ⬜ 미작성 |
| 27편 | DDL 심화 | - | ⬜ 미작성 |
| 28편 | DCL 심화 | - | ⬜ 미작성 |

---

## 14. GitHub 이슈 작성 규칙

- **제목**: `[feat]`, `[fix]`, `[refactor]`, `[chore]`, `[docs]` 중 하나로 시작.
- **본문 구조**:

```
#### Purpose
(목적과 배경)

#### To-Do
- [ ] 항목1

#### Changes
- 변경 내역

#### Screenshots
(스크린샷 또는 해당 없음)
```
