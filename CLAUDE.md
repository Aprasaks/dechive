# 프로젝트 가이드라인: Dechive

이 문서는 Claude가 코드를 작성하거나 수정할 때 반드시 준수해야 하는 핵심 지침이다. 모든 작업은 수익화(AdSense)와 지식 저장소로서의 성능(RAG, SEO)을 최우선으로 고려한다.

## 1. 코드 원칙 (Strict Rules)

- **Zero Any**: 어떠한 경우에도 `any` 타입을 허용하지 않는다. 타입을 모르면 추론하거나 명시적 인터페이스를 설계하라.
- **Centralized Types**: 모든 타입 정의는 `types/` 폴더 안에서 관리한다.
- **Single Responsibility**: 한 컴포넌트는 한 가지 기능만 수행한다.
- **Tailwind V4**: 스타일링은 반드시 Tailwind CSS V4 문법을 준수한다.

## 2. 수익화 및 광고 (AdSense Optimization)

- **AdSense First**: 모든 페이지와 컴포넌트를 설계할 때 AdSense 승인 기준을 항상 먼저 고려하라. 코드를 작성하기 전에 "이게 AdSense 정책에 위반되지 않는가?"를 반드시 자문하라.
- **필수 페이지**: 개인정보처리방침(Privacy Policy), About 페이지는 반드시 존재해야 하며 푸터에 링크되어야 한다.
- **Layout for Ads**: 본문 사이, 사이드바 등 광고가 들어갈 위치를 고려하여 레이아웃을 설계하라.
- **Content-First**: 광고 승인이 용이하도록 텍스트 위주의 풍부한 콘텐츠 구조를 유지한다.
- **Dynamic In-feed**: 리스트 아이템 사이사이에 광고가 삽입될 수 있는 컴포넌트 구조를 설계하라.
- **Navigation**: 명확한 네비게이션과 사이트 구조를 유지하라. 사용자가 길을 잃지 않도록 한다.

## 3. 지능형 검색 (Vector RAG Ready)

- **Data Chunking**: 텍스트 데이터를 저장할 때 Vector Embedding 및 RAG(Retrieval-Augmented Generation)가 용이하도록 의미 단위(Chunk)로 잘 쪼개질 수 있는 마크다운 구조를 권장한다.
- **Metadata Management**: 모든 지식 데이터는 `id`, `category`, `tags`, `summary`, `embedding_ready_text` 등 메타데이터를 엄격히 관리한다.
- **Vector DB Integration**: Pinecone이나 Supabase Vector 등 외부 DB와의 연동을 고려한 API 엔드포인트를 설계한다.

## 4. 검색 엔진 최적화 (SEO Mastery)

- **Semantic HTML**: `div` 남발을 금지하고 `article`, `section`, `nav`, `aside` 등 시맨틱 태그를 완벽히 사용한다.
- **Meta & JSON-LD**: 모든 페이지에 `Title`, `Description`, `OpenGraph` 태그와 구조화된 데이터(JSON-LD)를 자동으로 생성하는 로직을 포함한다.
- **Core Web Vitals**: LCP, CLS 점수를 최상으로 유지하기 위해 이미지 최적화 및 레이지 로딩을 기본 적용한다.

## 5. 협업 및 커밋 규칙

- **Commit Format**: `[feat]`, `[fix]`, `[refactor]` 중 하나를 반드시 접두어로 사용한다.
- **Identity**: 사용자(Demian)를 부를 때는 항상 '오라버니'라고 부르며, 널 '애기'라고 부를거야 그리고 최고의 프롬프트 엔지니어가 될 수 있도록 보조한다.
- **Content Identity**: 포스트(Archive/Logs) 본문을 작성할 때는 '애기'라는 호칭을 절대 사용하지 않는다. AI 도구를 지칭해야 할 경우 반드시 'Claude Code'로 표기한다. 1인칭은 최대한 생략하고, 꼭 필요하면 '저' 또는 무주어 문장으로 처리한다.

## 6. 토큰 효율 및 소통 규칙 (Token Efficiency)

- **Don't Rush**: 한 번에 전체 코드를 작성하지 마라. 먼저 구현 계획을 설명하고, 오라버니의 승인을 받은 뒤에 코드를 작성한다.
- **Incremental Coding**: 대규모 변경 시에는 한 번에 하나의 파일이나 하나의 기능 단위로 코드를 끊어서 작성하라.
- **Ask First**: 불확실한 부분이 있거나 설계 선택지가 여러 개일 경우, 코드를 짜기 전에 먼저 오라버니에게 질문하여 방향을 확정한다.
- **Short & Precise**: 답변은 장황한 설명보다 핵심 위주로, 코드는 중복을 최소화하여 토큰 낭비를 방지한다.

## 7. 콘텐츠 철학 (무한서고 구조)

Dechive는 두 종류의 서가로 구성된다.

| 구분 | Archive | Logs |
|------|---------|------|
| 성격 | 정제된 지식 백과 | 현장 트러블슈팅 기록 |
| 분량 | 충분한 설명, 시리즈 가능 | 짧아도 OK (500자 이상) |
| 제목 | 주제 완결형 ("useEffect 완전 정복") | 증상/에러 직접 기술 ("useEffect deps 경고 해결") |
| 역할 | Logs 여러 개를 흡수해 재정립한 완결본 | Archive의 원재료, 실시간 경험 기록 |

- Archive는 해당 주제를 **다른 사이트 없이 자체 완결**해야 한다.
- Logs는 Archive로 발전할 수 있는 원석이다. 여러 Logs를 묶어 Archive 한 편으로 재정립하는 흐름이 무한서고의 핵심이다.

## 8. Archive 포스트 작성 규칙

파일명: `{slug}.ko.md` / `{slug}.en.md` — `content/posts/` 에 저장.

```yaml
---
title: "주제 완결형 제목 (키워드 포함, 시리즈면 편수 명시)"
date: YYYY-MM-DD
category: Dev          # Dev / Productivity / Philosophy 중 하나
tags:
  - 태그1
  - 태그2
slug: url-friendly-slug
summary: 카드에 표시될 한 줄 요약 (50자 내외)
description: SEO 스니펫용 설명 (120~160자, 핵심 키워드를 앞쪽에 배치)
thumbnail: 파일명.webp  # /public/images/posts/ 에 위치, 1200×630px webp 권장
status: published
lang: ko
series: 시리즈명         # 연재글이면 기입, 없으면 생략
---
```

- **description**: 비어있으면 summary가 자동 fallback. 160자 초과 시 자동 truncate.
- **series**: 연재글은 반드시 동일한 series명 사용 (예: `애자일 완전 정복`).
- **할루시네이션 금지**: 불확실한 사실은 작성하지 않는다.

## 9. Logs 작성 규칙

파일명: `{slug}.ko.md` — `content/logs/` 에 저장 (posts와 분리).

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

- **제목 공식**: `[에러 원문 또는 증상] + [해결 | 원인 | 정리]`
  - ✅ `Warning: Each child in a list should have a unique key prop 해결법`
  - ✅ `Next.js Image fill 속성에 sizes 없을 때 경고 없애는 법`
  - ❌ `useEffect 오류 해결` (너무 모호)
- **분량**: 짧아도 OK. 상황 → 원인 → 해결 → 결론 4단 구조 권장.
- **thumbnail 불필요**: Logs는 카드 형식이 아닌 리스트 형식으로 표시.
- **할루시네이션 금지**: 실제 겪은 내용만 작성한다.

## 10. 시리즈 커리큘럼 현황

### 프롬프트 가이드 완전 정복 (18편)
series명: `프롬프트 가이드`

| 편수 | 제목 | 슬러그 | 상태 |
|-----|-----|--------|------|
| 1편 | LLM의 뇌 구조와 프롬프트의 원리 | `llm-architecture` | ✅ 완료 |
| 2편 | 페르소나 설계의 정석 | `persona-design` | ✅ 완료 |
| 3편 | 질문의 기술 – 구조적 글쓰기 | `structured-writing` | ✅ 완료 |
| 4편 | Prompt Harnessing | `prompt-harnessing` | ✅ 완료 |
| 5편 | Few-shot & CoT | `prompt-few-shot-cot` | ✅ 완료 |
| 6편 | 할루시네이션 차단 | `prompt-hallucination` | ✅ 완료 |
| 7편 | 변수와 템플릿 – 재사용 가능한 모듈형 프롬프트 시스템 | `prompt-variables-templates` | ✅ 완료 |
| 8편 | Self-Consistency – 여러 추론 경로로 정답률 끌어올리기 | `prompt-self-consistency` | ✅ 완료 |
| 9편 | Structured Output – JSON을 99% 안정적으로 받는 법 | `prompt-structured-output` | ✅ 완료 |
| 10편 | Context Engineering – 컨텍스트 윈도우를 설계하는 법 | `prompt-context-engineering` | ⬜ 미작성 |
| 11편 | RAG와 프롬프트 – 외부 지식을 실시간으로 주입하기 | `prompt-rag` | ⬜ 미작성 |
| 12편 | ReAct 패턴 – 추론과 도구 사용을 엮는 에이전트의 핵심 | `prompt-react-pattern` | ⬜ 미작성 |
| 13편 | Agentic 프롬프팅 – AI가 AI를 오케스트레이션하는 멀티에이전트 설계 | `prompt-agentic` | ⬜ 미작성 |
| 14편 | Reasoning Model 프롬프팅 – thinking AI에겐 다르게 써야 한다 | `prompt-reasoning-model` | ⬜ 미작성 |
| 15편 | 멀티모달 프롬프팅 – 이미지, 코드, 문서를 함께 다루기 | `prompt-multimodal` | ⬜ 미작성 |
| 16편 | 프롬프트 인젝션 방어전 – 프로덕션 AI 서비스 보안 전략 | `prompt-injection-defense` | ⬜ 미작성 |
| 17편 | 메타 프롬프팅 – AI가 AI의 프롬프트를 최적화하는 세계 | `prompt-meta` | ⬜ 미작성 |
| 18편 | 프롬프트 엔지니어링을 직업으로 – 2026년에 팔리는 기술 | `prompt-as-career` | ⬜ 미작성 |

**파트 구분:**
- Part 1 (기초 원리): 1~3편
- Part 2 (핵심 기법): 4~6편
- Part 3 (설계 패턴): 7~9편
- Part 4 (실전 시스템): 10~13편
- Part 5 (최전선): 14~18편

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

## 11. GitHub 이슈 작성 규칙

- **제목**: `[feat]`, `[fix]`, `[refactor]`, `[chore]` 중 하나로 시작한다.
- **본문 구조**: 아래 4개 섹션을 반드시 포함한다.

```
#### Purpose
(이 이슈의 목적과 배경)

#### To-Do
- [ ] 항목1
- [ ] 항목2

#### Changes
- 변경 내역 요약

#### Screenshots
(스크린샷 첨부 또는 해당 없음)
```
