# Database Implementation

- **Status:** Stage 7 local PostgreSQL prototype implemented and verified
- **Last Updated:** 2026-07-18
- **Authority:** 실제 schema, migration, local test 실행 기준
- **Purpose:** 논리 모델이 PostgreSQL에서 강제되는 방식을 설명한다.

## 구조

- 공통: `translation_groups`, `contents`, `content_localizations`, `content_versions`, `content_version_artifacts`.
- 유형: `knowledge_details`, `courses`, `course_modules`, `lessons`, `course_module_items`, `practices`, `ai_updates`, `update_digests`, `update_digest_items`.
- 증거/연결: `content_relations`, `sources`, `content_sources`.
- 미디어/URL: `media_assets`, `media_usages`, `content_routes`.
- 운영: `actors`, `revision_events`, `schema_migrations`.

본문은 `content_versions.canonical_document JSONB` 한 곳에만 저장한다. title/summary/slug/SEO는 locale identity에, 학습/분류/정렬/날짜처럼 query와 constraint가 필요한 정보는 detail column에 둔다. Practice instructions, Lesson body, Course narrative를 detail JSON에 복제하지 않는다.

## 핵심 제약

- `(content_id, locale)`, `(locale, route_scope, slug)`, `(localization_id, version_number)` unique.
- AI Update의 `route_scope=ai-updates/{date}`로 같은 날짜+locale+slug unique를 표현한다.
- route 문자열 전역 unique, active canonical route는 localization/digest당 하나.
- published version과 artifact는 trigger로 update/delete 금지. Rollback은 과거 document를 복제한 새 draft/version이다.
- artifact는 version+type unique. 앱 transaction이 세 필수 artifact의 완전성을 보장한다.
- relation self-reference 금지, symmetric `related/translation_of` ID 순서 정규화 후 duplicate 차단.
- Course module/item 및 Digest item 순서 unique.
- Source와 media usage는 version에 묶어 published revision의 증거를 재현한다.

## Locale와 translation

KO/EN은 서로 다른 localization ID, slug, metadata, current draft/published pointer를 갖는다. `translation_group_id`는 의미상 연결일 뿐 body 동기화가 아니다. `translation_status`와 `translation_outdated_at`으로 drift를 표시한다.

## Local PostgreSQL

`docker-compose.db.yml`은 PostgreSQL 17.6을 `127.0.0.1:55432`에만 바인딩하고 `dechive_test` DB와 named volume을 만든다. credential은 local-only이며 production secret이 아니다.

```bash
npm run db:up
npm run verify:database
npm run db:down
```

`db:reset`은 hostname이 localhost이고 DB명이 정확히 `dechive_test`일 때만 `public` schema를 재생성한다. 전체 volume 제거는 명시적으로 `docker compose -f docker-compose.db.yml down -v`가 필요하며 자동 script에 넣지 않았다.

## Migration

`src/db/schema.ts` → `drizzle/0000_initial.sql`. Generated SQL에 immutable trigger, deferred pointer FK, canonical partial unique index, symmetric relation normalization을 검토 후 추가했다. `scripts/db/migrate.ts`는 전체 migration을 transaction으로 적용하고 SHA-256 checksum을 `schema_migrations`에 기록한다.

Stage 9 `0002_staging_operations.sql`은 AI split review metadata, scheduled retry 상태, editorial Issue projection을 additive하게 추가했다. 기존 migration은 수정하지 않았다. 배포는 direct URL, runtime은 pooled URL을 사용하며 [Database Deployment Runbook](DATABASE_DEPLOYMENT_RUNBOOK.md)을 따른다.

Stage 10 `0003_import_batch_recovery.sql`은 batch/item 상태, heartbeat, recovery/attempt metadata를 additive하게 추가했다. Item transaction 격리와 retry 정책은 [Import Batch Failure Recovery](IMPORT_BATCH_FAILURE_RECOVERY.md)를 따른다.

## 검증 범위

실제 PostgreSQL에서 22개 assertion으로 migration, translation 독립, duplicate slug/route, immutable revision/artifact, needs_review 차단, rollback copy, symmetric relation 중복, source locator, 미승인 source/media 차단, 세 artifact unique, scheduled timestamp, publish success와 simulated rollback, checksum을 검증했다. Scheduler worker는 범위 밖이다.
