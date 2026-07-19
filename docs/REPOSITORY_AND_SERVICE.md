# Repository and Service Boundary

- **Status:** Knowledge and AI Update prototype verified
- **Last Updated:** 2026-07-18
- **Authority:** DB 접근과 domain transaction 경계
- **Purpose:** UI/route가 SQL이나 Drizzle을 직접 호출하지 않도록 저장 책임을 분리한다.

## Repository

`ContentRepository`는 legacy/route/slug lookup, version/current pointer, translation sibling, source/media/relation query를 제공한다. `KnowledgeRepository`는 detail, `AIUpdateRepository`는 ordered Digest item, `ImportRepository`는 batch lifecycle을 담당한다. PostgreSQL 구현은 `PostgresRepositories` 하나지만 interface 책임은 분리돼 있고 generic CRUD/query builder는 만들지 않았다.

검증 query: route lookup, locale+slug Knowledge, current draft/published, history, translation sibling, detail, ordered Digest items, source/media usage, related content. Digest item+source는 한 join query로 가져온다. 목록에서 각 content의 source/media/relation을 개별 호출하면 N+1이 되므로 실제 list API는 ID batch query 또는 projection을 추가해야 한다.

## Service

- `importLegacyContent`: importer pipeline 및 item/batch transaction.
- `exportContentVersion`: canonical JSON에서 normalized Markdown/HTML/plain text/checksum 생성.
- `publishVersion`: Stage 7의 validation/artifact/pointer 원자적 전환.

추가 명명 경계는 `createKnowledgeDraft`, `createAIUpdateDraft`, `createUpdateDigestDraft`, `resolveContentRoute`, `compareImportedContent`다. 이번 구현은 importer 내부에서 draft 생성/map을 호출하며 공개 API는 아직 만들지 않았다. Repository는 persistence, service는 validation/import/export/transaction 정책을 소유한다.
