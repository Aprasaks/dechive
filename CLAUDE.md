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

## 6. 토큰 효율 및 소통 규칙 (Token Efficiency)

- **Don't Rush**: 한 번에 전체 코드를 작성하지 마라. 먼저 구현 계획을 설명하고, 오라버니의 승인을 받은 뒤에 코드를 작성한다.
- **Incremental Coding**: 대규모 변경 시에는 한 번에 하나의 파일이나 하나의 기능 단위로 코드를 끊어서 작성하라.
- **Ask First**: 불확실한 부분이 있거나 설계 선택지가 여러 개일 경우, 코드를 짜기 전에 먼저 오라버니에게 질문하여 방향을 확정한다.
- **Short & Precise**: 답변은 장황한 설명보다 핵심 위주로, 코드는 중복을 최소화하여 토큰 낭비를 방지한다.

## 7. 포스트 작성 규칙 (Content Guidelines)

포스트는 반드시 아래 frontmatter 구조를 준수한다. 파일명은 `{slug}.ko.md` / `{slug}.en.md` 형식.

```yaml
---
title: "제목 (검색결과 클릭률 직결 — 키워드 포함, 명확하게)"
date: YYYY-MM-DD
category: Dev          # Dev / Productivity / Philosophy 중 하나
tags:
  - 태그1
  - 태그2
slug: url-friendly-slug
summary: 카드에 표시될 한 줄 요약 (50자 내외)
description: SEO 스니펫용 설명 (120~160자, 핵심 키워드 반드시 포함)
thumbnail: 파일명.webp  # /public/images/posts/ 에 위치
status: published       # draft | published
lang: ko                # ko | en
series: 시리즈명         # 연재글이면 기입, 없으면 생략
---
```

- **description 규칙**: 120~160자 이내, 핵심 키워드를 앞쪽에 배치. 비어있으면 summary가 자동 fallback.
- **series 규칙**: 연재글은 반드시 동일한 series명 사용 (예: `애자일 완전 정복`).
- **thumbnail 규칙**: 1200×630px webp 권장. `/public/images/posts/`에 저장.
- **한 포스트 = 한 주제 완결**: 다른 사이트 링크 없이 해당 주제를 자체적으로 완결.
- **할루시네이션 금지**: 불확실한 사실은 작성하지 않는다.

## 8. GitHub 이슈 작성 규칙

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
