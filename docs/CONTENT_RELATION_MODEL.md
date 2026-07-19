# Content Relation Model

- **Status:** Proposed from stage 3 samples
- **Last Updated:** 2026-07-18
- **Authority:** 콘텐츠 간 의미 관계의 방향·승인·중복 규칙 기준
- **Purpose:** 본문 복제 없이 Knowledge, Course, Lesson, Practice, AI Update와 legacy editorial view를 연결한다.

## 관계 record

`Relation { id, sourceId, targetId, type, order?, note?, provenance, confidence?, status, createdBy, approvedBy?, createdAt }`를 논리 모델로 사용한다. `provenance`는 `manual | ai_suggested | migration`; AI 제안은 `pending`이며 운영자 승인 전 공개하지 않는다.

## 유형과 방향

| type | source → target 의미 | 역관계/표시 | 대칭 |
|---|---|---|---|
| `prerequisite` | source를 이해/수행하기 전에 target 필요 | target의 `enables`는 계산 | 아니오 |
| `related` | 서로 함께 읽을 가치 | 동일 `related` | 예 |
| `explains` | source가 target 개념을 설명 | target의 `explained_by` 계산 | 아니오 |
| `expands` | source가 target보다 깊게 확장 | target의 `expanded_by` 계산 | 아니오 |
| `belongs_to_course` | Lesson이 Course/Module에 소속 | course의 lesson membership 계산 | 아니오 |
| `lesson_practice` | Lesson이 Practice를 요구/추천 | practice의 lesson backlink 계산 | 아니오 |
| `update_affects` | AI Update가 Knowledge/Course/Practice의 최신성에 영향 | target의 `affected_by_update` 계산 | 아니오 |
| `supersedes` | source가 target의 효력을 대체 | target의 `superseded_by` 계산 | 아니오, cycle 금지 |
| `translation_of` | locale version이 동일 translation group의 다른 version | group membership으로 계산 권장 | 의미상 대칭 |
| `features` | Digest/Issue가 공개 콘텐츠를 편집해 노출 | target의 featured history | 아니오 |
| `references` | Lesson/Knowledge가 본문을 복제하지 않고 target을 참고 | target의 referenced_by | 아니오 |

`translation_of`는 pair 관계보다 `translation_group_id`를 기본으로 하고, relation export에서만 표현한다. Course hierarchy는 전용 membership table이 권위이며 `belongs_to_course`는 통합 relation view로 노출할 수 있다.

## 무결성

- self relation 금지(`related`도 예외 없음).
- `(source_id, target_id, type)` unique. 대칭 관계는 작은 ID를 source로 canonicalize한다.
- `supersedes`와 `prerequisite`는 cycle 검사. Course membership은 `(module_id, order)` unique와 transaction reorder.
- inverse row를 중복 저장하지 않고 query에서 계산한다.
- `order`는 같은 source/type 안에서만 의미가 있다. note는 “왜 연결했는가”가 기본 label로 충분하지 않을 때 선택적으로 요구한다.
- 삭제는 hard delete 대신 inactive/rejected 상태와 audit 기록을 남긴다.

## 실제 표본 관계 예시

1. D1 `can-ai-replace-learning` **expands** A1 `can-we-learn-directly-from-ai-answers` — 짧은 질문을 7부 심층 구조로 확장.
2. Book `knowing-what-we-know` **related** D1 — 현재 Book 본문의 실제 내부 링크.
3. Book `dual-brain` **related** D2 `data-analysis-beyond-business` — 현재 실제 내부 링크.
4. Book `ai-bubble-is-coming` **related** D3 `ai-era-agile-verification` — 현재 실제 내부 링크.
5. A4 `agile-methodology-guide` **prerequisite** D3 — Agile 역사/선언 이해가 AI 시대 적용보다 선행.
6. D3 **expands** A4 — AI·solo SaaS·검증까지 범위를 확장.
7. A1 **prerequisite** Practice P1 `verify-ai-answer-sources` — 실습 전 AI 답 검증 개념 필요.
8. sample Course `ai-learning-and-judgment`의 Lesson 3 **references** D1 — Course가 Knowledge 원문을 복제하지 않는다.
9. sample Course Lesson 4 **lesson_practice** P1.
10. sample Course Lesson 4 **lesson_practice** P2 `compare-ai-output-perspective`.
11. A2 `what-null-leaves-behind` **prerequisite** P3 `sql-null-prediction`.
12. 2026-06-19 Claude Code update **update_affects** A5 `what-does-giving-ai-permission-mean` — 위험 명령 승인 경계의 실제 변화.
13. 2026-07-02 GitHub Copilot 운영 update **update_affects** A5 — agent 관측/비용/권한 운영 보강.
14. 2026-07-05 digest **features** Mechanical Turk 개별 update.
15. Issue 2026-06-18 **features** `why-we-get-excited-about-ai-content`.
16. A1 KO version과 A1 EN version은 같은 translation group이며 export 시 **translation_of**.

## 수동·AI 운영

수동 관계가 권위다. AI는 published revision을 기준으로 type/note/confidence를 제안할 수 있으나 자동 공개·자동 prerequisite·자동 supersedes는 금지한다. 관리자는 source/target preview와 기존 관계 충돌을 본 뒤 approve/reject한다. 승인 뒤에도 provenance와 제안 model/prompt/version을 audit에 남긴다.

## 검색·추천 사용

검색 ranking은 relation 수 자체를 인기도로 쓰지 않는다. prerequisite는 학습 순서, expands는 “더 깊게”, update_affects는 “이 내용에 영향을 준 최신 변화”, related는 보조 탐색에 사용한다. superseded 콘텐츠는 검색에서 상태를 명시하되 기존 URL을 숨기거나 삭제하지 않는다.
