# Migration Plan

> **Stage 14 결정으로 중단:** 기존 Markdown 114개를 새 CMS로 이전하지 않는다. 아래 Archive/Deep Dive import 계획은 실행하지 않는 역사적 계획이며 현재 기준은 [지식과 강의 콘텐츠 모델](14_KNOWLEDGE_AND_LECTURE_MODEL.md)이다. 기존 파일과 공개 URL은 삭제·변경하지 않는다.

- **Status:** Mapping approved; document dry-run validated; no data moved
- **Last Updated:** 2026-07-18
- **Authority:** 기존 데이터·URL의 목표 유형 매핑과 검증/rollback 기준
- **Purpose:** legacy 표현을 보존하면서 네 공개 영역으로 재분류한다.

## Stage 7 저장 대상 준비 상태

needs_review 격리, immutable version, alias route 구조는 구현됐지만 기존 Markdown import는 실행하지 않았다. 첫 dry-run은 fixture를 새 draft에만 적재하고 기존 파일·URL을 유지한다. 수동 editor gate 전 기존 작성 방식을 폐기하지 않는다.

## Stage 8 dry-run 결과

5개 Knowledge locale과 1개 Digest source identity(내부 AI Update draft 3개)를 local DB에 import했다. 모두 published pointer 없이 review 상태이며 기존 route만 기록했다. 같은 checksum 재실행은 전부 skipped, checksum 변화는 overwrite 없이 감지됐다. 구조 결과와 전체 확대 전 gate는 [Content Import Dry Run](CONTENT_IMPORT_DRY_RUN.md)을 따른다.

Stage 9는 22 localization/18 identity와 Issue projection 2개를 local staging-compatible DB에서 검증하고 backup restore를 통과했다. Neon staging 실제 적용과 item 단위 partial-failure runner가 전체 migration 전 남은 gate다. Production import는 계속 금지한다.

## 유형 매핑

| 현재 | 목표 domain | legacy URL |
|---|---|---|
| Archive 53 slug×KO/EN | Knowledge, format은 article/concept/technical/reference 등 개별 판정 | `/archive/**`, `/en/archive/**` 유지 |
| Deep Dive 4 slug×KO/EN | Knowledge `format=deep_dive`, `depth=deep` | `/deep-dive/**`, `/en/deep-dive/**` 유지 |
| Book KO 3 | Knowledge `format=book_note`; Course resource relation 가능 | `/book/**` 유지 |
| AI Updates 16일 | 개별 AIUpdate + 날짜별 UpdateDigest | `/ai-updates/{date}` 유지; anchor/detail 정책 미결정 |
| 수동 Issues 4 + 자동 생성 | EditorialCollection/Issue projection | `/issues/**` 유지 |
| 이미지 | media asset/usage | 기존 public URL alias/redirect 검토 |

상세 표본은 [Content Sample Mapping](CONTENT_SAMPLE_MAPPING.md)에 있다. 유형 통합은 URL 통합을 의미하지 않는다.

## import 전 정규화가 아닌 검토 queue

- A2 `tags`의 YAML null value.
- locale별 H1/heading 수 차이(A2/A3/A4/D3).
- D3 KO/EN 이미지·heading 차이.
- Book publisher/quote locator 누락.
- Deep Dive의 참고자료 문구는 있으나 raw source URL이 없는 사례.
- AI summary 하나에 복수 change/source가 묶인 07-02/07-04/07-05.
- Zoom/Canvas/Claude Code source가 product/docs root인 legacy item.
- 수동 Issue와 content에서 자동 합성한 Issue의 provenance 차이.

이 항목은 importer가 임의로 고치지 않고 `needs_review`와 원본 snapshot을 남긴다.

## 단계

1. 전체 inventory manifest: source path/commit/checksum, route, frontmatter raw+parsed, locale/type/slug, body features, media/link/source refs.
2. dry-run classification: Knowledge format/depth는 rule+사람 검토, Deep Dive/Book 결정은 위 mapping 적용.
3. translation group: 현재 shared slug pair를 후보로 묶되 body/version은 독립 import.
4. body round-trip spike: A2/A3/D2/D3로 heading/code/table/image/anchor 손실 검사 후 저장 형식 결정.
5. AI Update normalization dry-run: 개별 change 후보와 Digest membership을 만들고 source granularity review.
6. relation import: Book/Issue internal link는 migration provenance로 만들고 운영자가 검토.
7. URL parity와 dual-read: 기존 URL/canonical/sitemap/hreflang/render diff.

본문 dry-run은 `fixtures/editor-benchmark`에서만 수행한다. neutral document importer는 YAML null, 누락 source, 잘못된 image path를 고치지 않고 `needs_review` manifest로 남긴다. heading anchor는 최초 import 때 고정한다. 원문 formatting이 아니라 구조·의미를 검증하며, provider JSON은 migration 원본이 아니다. 실행 근거는 [Editor Benchmark](EDITOR_BENCHMARK.md)다.

Schema migration은 immutable published revision을 덮어쓰지 않는다. Read-time adapter는 과거 revision 표시용, write/publish-time migration은 새 revision 생성용, batch migration은 검토 가능한 후보 생성용으로 조합한다. v1→v2 prototype과 failure quarantine는 [Editor Security and Migration](EDITOR_SECURITY_AND_MIGRATION.md)을 따른다. AI Update Digest legacy anchor는 실제 콘텐츠 migration 단계에서 새 detail URL과 함께 전환하고 이후에도 alias/anchor 호환을 유지한다.
8. canary/read switch 후 rollback window. 기존 파일은 보존.

## 검증

- count/status/locale/slug/source checksum 일치.
- rendered text, heading level/order/anchor, code language/content, table cell, image src/alt, internal/external links.
- translation group만 공유되고 locale body가 독립인지 확인.
- sourceCheckedAt/lastReviewedAt를 발행일로 허위 채우지 않음.
- Course/Lesson은 Knowledge 본문을 복제하지 않았는지 검사.
- Digest item count/order와 individual Update source가 일치.
- legacy URL HTTP/canonical/OG/structured data parity.

## rollback과 삭제

import는 batch ID/source checksum으로 재실행 가능하게 하고 새 record를 기존 파일과 대조한다. read flag를 legacy loader로 되돌릴 수 있어야 한다. 기존 Markdown/static TS/public image/route는 restore drill, parity, 운영 승인, 보존 기간 전 삭제하지 않는다. 이번 단계에서는 어떤 데이터도 변환·이동·삭제하지 않았다.
