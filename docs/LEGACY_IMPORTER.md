# Legacy Importer

- **Status:** Stage 8 dry-run importer implemented and verified
- **Last Updated:** 2026-07-18
- **Authority:** Legacy source discovery, conversion, idempotency, reporting policy
- **Purpose:** 기존 canonical source를 수정하지 않고 reviewable DB draft로 옮기는 절차를 정의한다.

## Pipeline

1. **discover**: allowlisted `importSpecs`와 2026-07-02 Digest만 선택한다. 전체 114개를 순회하지 않는다.
2. **parse**: `gray-matter`와 Stage 4~6 Markdown parser를 사용한다.
3. **normalize**: heading anchor만 deterministic하게 생성하고 relative image path는 `legacySrc`로 보존한다.
4. **validate**: draft DechiveDocument allowlist와 구조 제한을 검사한다.
5. **map**: Archive/Deep Dive/Book을 Knowledge detail로, 날짜 문서를 Digest와 AI Update draft로 매핑한다.
6. **persist**: service-owned transaction 안에서 identity, locale, version, route, media/source reference를 쓴다.
7. **verify**: DB document를 다시 export하고 구조 count/hash와 route/translation을 비교한다.
8. **report**: JSON과 Markdown 결과를 `fixtures/content-import/output`에 생성한다.

각 item 상태는 `ready`, `imported`, `imported_with_warnings`, `needs_review`, `rejected`, `skipped`, `change_detected`다. 누락 source, YAML null, media path, slug/date/publisher/locator를 importer가 추정하여 고치지 않는다.

## Identity와 재실행

`legacy_identities`의 `(source_type, stable_key)`가 unique다. 원문 SHA-256과 imported document SHA-256, importer version, target ID를 저장한다. 같은 checksum은 `skipped`; 다른 checksum은 `change_detected`이며 DB 원문/version을 덮어쓰지 않는다. `import_batches/import_items`는 batch, 단계 결과, warning/error, 구조 count를 보관한다.

## Input 보호

Importer는 `readFile`만 사용하고 source tree에 write하지 않는다. Relative image는 pending `media_assets.source_url`과 usage metadata의 `legacyPath`로 남는다. Legacy published date/status는 `migration_metadata`이고 DB workflow는 `needs_review`; published pointer는 설정하지 않는다.

## 실행

```bash
npm run db:up
npm run verify:content-import
```

Report에는 전체 본문을 복제하지 않고 checksum, count, warning, ID, route만 남긴다.

## Stage 9 확대

[Staging manifest](../fixtures/staging-import/manifest.json)는 16 Knowledge localization, Digest 2개에서 파생한 AI Update 6개, Issue projection 2개를 선택한다. AI 복합 item은 `needs_editor_review`와 근거만 기록하고 자동 split/detail route를 만들지 않는다.

Stage 10에서 batch 전체 transaction을 제거했다. 각 item은 별도 transaction이고 실패 row는 독립 transaction으로 기록한다. Batch는 partial_failure/failed/cancelled, heartbeat/recovery count와 advisory lock을 지원한다. 상세는 [Import Batch Failure Recovery](IMPORT_BATCH_FAILURE_RECOVERY.md)다.
