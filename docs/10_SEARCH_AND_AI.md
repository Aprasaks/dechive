# Search and AI

- **Status:** Search document requirements validated; implementation deferred
- **Last Updated:** 2026-07-18
- **Authority:** 유형·관계·번역을 고려한 검색/AI 경계 기준
- **Purpose:** stage 3 모델이 검색과 AI 제작 보조에 주는 요구를 정의한다.

## 검색 document 단위

- Knowledge는 locale별 published version 하나가 검색 단위다. `format/depth/coreQuestion/concepts` filter/boost 후보.
- Course와 Lesson은 별도 결과 단위이며 Course 결과가 Lesson title을 삼키지 않는다.
- Practice는 objective/type/difficulty/tool/completion mode를 index한다.
- AI Update는 **개별 변화가 검색 단위**다. Digest는 날짜별 editorial 결과로 별도 index하며 같은 본문을 복제하지 않는다.
- Book note는 Knowledge format filter로, Issues는 collection 자체보다 featured Knowledge에 우선순위를 둔다.

검색 projection은 title/summary/headings/body/tags/concepts/source publisher, 유형별 field, lastReviewedAt/sourceCheckedAt, locale과 canonical URL을 포함한다. superseded/archived는 상태를 표시하고 기본 ranking을 낮추되 기존 URL을 삭제하지 않는다.

## 표본 기반 relevance set 후보

- “NULL COUNT 차이” → A2 technical Knowledge.
- “AI 답 그대로 배워도 되나” → A1, 이어 D1 expands relation.
- “Agile 선언문” → A4, “AI 시대 Agile” → D3.
- “Claude Code 위험 명령 승인” → 2026-06-19 개별 Update, 이어 A5 update_affects.
- “프롬프트 이메일 템플릿” → A3 내부 heading/block.

긴 A3/D2/D3는 heading/block anchor까지 result passage를 연결해야 한다. KO/EN heading이 다르므로 translation group의 동일 anchor를 가정하지 않는다.

## 검색 기술 gate

PostgreSQL FTS 우선 검토 원칙은 유지하지만 설치하지 않는다. 위 query corpus로 한국어 relevance, heading passage, type filter, locale, update freshness를 먼저 측정한다. 부족할 때 Meilisearch/Typesense를 비교한다. vector는 관계 기반 탐색과 lexical baseline보다 측정 가능한 개선이 있을 때만 검토한다.

## AI 제작 보조

제안 가능: coreQuestion/answerSummary 초안, difficulty 후보, content format, relation, source 필요 문장, translation drift, stale update, alt/SEO. 자동 결정 금지 항목: publish, supersedes, prerequisite, update granularity merge, difficulty 확정, source 신뢰 판정.

모든 제안은 provider/model/prompt version/source content version/time/reviewer decision을 기록한다. D3처럼 locale 구조가 크게 다른 문서는 AI가 “누락”으로 단정하지 않고 사람 검토 대상으로 표시한다.

## 내부 답변

published revision의 passage와 source를 인용할 수 있을 때만 도입한다. Digest summary가 아니라 가능한 한 canonical individual Update를 인용한다. Course completion이나 Practice 채점 결과를 AI가 임의로 확정하지 않는다.
