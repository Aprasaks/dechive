# Database Schema

> **Stage 14 현재 기준:** 공통 identity/localization/version 구조는 유지하되 새 CMS type은 `knowledge`와 `lecture`다. migration `0004_knowledge_and_lectures.sql` 이후의 모델은 [지식과 강의 콘텐츠 모델](14_KNOWLEDGE_AND_LECTURE_MODEL.md)이 권위다.
>
> Knowledge의 canonical tags/references는 Stage 16부터 version의 `migration_metadata.knowledge` payload이며 [Knowledge 공개 및 발행 계약](16_KNOWLEDGE_PUBLISH_CONTRACT.md)을 따른다.

- **Status:** PostgreSQL physical prototype implemented and verified
- **Last Updated:** 2026-07-18
- **Authority:** 향후 데이터 경계와 DB 대안 비교 기준
- **Purpose:** 승인된 논리 구조와 Stage 7 PostgreSQL 구현의 권위 있는 schema 기준을 연결한다.

> 실제 table/constraint는 [Database Implementation](DATABASE_IMPLEMENTATION.md), 발행 경계는 [Publish Transaction](PUBLISH_TRANSACTION.md), cloud/ORM 판단은 [PostgreSQL Decision](POSTGRESQL_DECISION.md)이 권위다.

Stage 8의 새 `0001_legacy_import.sql`은 `import_batches`, `import_items`, `legacy_identities`, `publish_jobs`, `external_identities`, `actor_role_memberships`를 추가한다. 기존 `0000`은 수정하지 않았다. Import identity는 source type+stable key unique이고 checksum 변화는 overwrite가 아니라 review 상태다.

## 비교

| 구조 | 장점 | 단점 | Dechive 적합성 |
|---|---|---|---|
| 1. 단일 `contents` + type별 JSONB | 초기 schema 단순, 새 type 추가 빠름, 공통 검색 쉬움 | required field/FK/order 제약이 약해짐; 거대 JSON과 null/런타임 validation 증가; Course membership/source/relation query가 불투명 | prototype에는 가능하지만 장기 권장 아님. D2 같은 장문 block은 version document로 JSON을 쓸 수 있어도 domain detail까지 JSONB에 넣지 않는다 |
| 2. 공통 `contents` + 유형별 detail table | 공통 metadata/revision/SEO/locale 중복 없이 type별 제약·관계·query 가능; Course/Practice/Update 차이를 정직하게 표현 | join과 migration 수 증가; type 추가 시 schema 변경 | **추천 논리 구조**. 네 공개 유형과 Lesson의 공통 publish lifecycle은 공유하고 전용 데이터를 분리하기 적합 |
| 3. 유형별 완전 분리 table | 각 모델 독립, 단순한 type-local query | slug/locale/status/SEO/revision/source/relation/search를 중복 구현; polymorphic relation 복잡 | 공통 발행·검색·번역 요구가 큰 Dechive에는 부적합 |

2번을 PostgreSQL 17 + Drizzle/검토된 SQL migration으로 구현했다.

## 논리 entity

### 공통

- `contents`: stable identity, kind, locale, slug, translation group, workflow pointers/timestamps.
- `content_versions`: immutable title/summary/body document, author/editor, revision summary, previous published version.
- `seo_entries`, `media_assets/media_usages`, `sources/content_sources`, `content_relations`.
- `translation_groups`: 같은 의미의 locale version 묶음. slug equality와 독립.

### 유형별

- `knowledge_details`: format, depth, core question, answer summary, difficulty.
- `course_details`, `course_modules`, `module_lessons`: audience/level/objectives/duration와 ordered membership.
- `lesson_details`: objectives, completion criteria, duration.
- `practice_details`, `practice_steps`, `practice_evaluation_criteria`: practice type/input/outcome/completion mode.
- `ai_update_details`: dates/vendor/change/impact/source confidence.
- `update_digests/digest_items`: date editorial view와 ordered update membership.
- `editorial_collections/collection_items`: legacy Issues 같은 projection.

Body는 `content_versions`에 versioned neutral DechiveDocument JSON, `document_schema_version`, checksum을 두는 방향을 권고한다. normalized Markdown/HTML/plain text는 파생 artifact다. provider editor JSON만 canonical로 두지 않는다. 물리 column type/index/ORM migration은 미확정이며 [Document Format](DOCUMENT_FORMAT.md)의 adapter gate 뒤 정한다. Source/relation/media/order를 body JSON 안에만 묻지 않는다.

## 제약 후보

- public route namespace를 고려한 locale+slug uniqueness. 기존 URL은 redirect/alias table과 분리.
- detail table은 content kind와 일치하는 1:1.
- `(source_content_id, target_content_id, relation_type)` unique; self relation 금지; cycle 검사.
- Course membership의 `(module_id, order)`와 Digest/Collection의 `(container_id, order)` unique.
- published pointer는 immutable existing version만 참조.
- translation group은 locale당 최대 한 current content 후보이나 archive history는 유지.
- source check timestamp는 source relation에, last review는 content에 둔다.

## 표본이 요구한 예외 처리

- A2의 YAML null tag는 import validation에서 문자열 `null`로 자동 추정하지 말고 quarantine/review한다.
- D3의 KO 104 headings/EN 43 headings은 translation group이 같은 구조를 강제하면 안 됨을 증명한다.
- AI 2026-07-02의 한 summary가 여러 GitHub changelog를 묶으므로 import 전에 update granularity review가 필요하다.
- Issue 06-15/06-16이 같은 Knowledge를 feature하므로 target 중복이 아니라 container별 relation unique가 맞다.

## revision, rollback, schedule

published version은 immutable하다. 편집은 draft version을 만들고 publish 시 pointer를 원자적으로 전환한다. rollback도 과거 version을 새 version으로 복제·publish한다. scheduled publish는 expected current version을 함께 확인해 오래된 draft가 최신 수정 위에 발행되지 않게 한다. unpublish/archived는 URL·revision을 삭제하지 않는다.

## 검색 projection

검색 index는 published version과 유형별 detail을 합친 projection이다. Course는 Course/Lesson, AI는 개별 Update/Digest의 검색 문서를 구분한다. index는 DB/원본 entity에서 재생성 가능해야 하며 relation 수를 인기도 점수로 오용하지 않는다.
