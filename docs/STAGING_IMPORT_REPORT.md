# Staging Import Report

- **Status:** Neon staging expanded import complete
- **Last Updated:** 2026-07-18
- **Authority:** Stage 9 확대 표본과 cloud 실행 여부
- **Purpose:** 실제 수행 결과와 미수행 cloud 항목을 분리한다.

## 확대 표본

[manifest](../fixtures/staging-import/manifest.json)는 Archive 4 KO/EN pair, Deep Dive 3 KO/EN pair, Book note 2개, Digest 2개, Issue projection 2개를 지정한다. Import 결과는 Knowledge 16 localization + AI Update 6 localization = 22 localization, 18 legacy source identity다.

포함 위험: YAML null/table/image, code block 45개, heading 104개, KO/EN drift, 100k자급 장문, source 누락, relative media, 복합 Digest, editorial Issue projection.

모든 legacy version은 `imported_with_warnings`/`needs_review`이고 published pointer는 없다. Digest별 3개 item은 order와 legacy anchor/slug candidate를 보존하고 detail route는 만들지 않았다. Issue 2026-06-15/16은 Knowledge body를 복제하지 않고 legacy content route만 ordered projection으로 저장했다.

## 실행 결과

- Clean migration `0000..0003`: 통과.
- 22 localization/18 identity import: 통과.
- Issues 2/item 2: 통과.
- Logical backup → clean restore: table counts/checksum exact.
- Portable export: secret-free JSON 생성.
- Neon staging migration/query/local→Singapore latency: 통과.

Stage 10 Neon staging에서 content/localization 단위 transaction, batch `partial_failure`, 실패 item retry를 재검증했다. 6개 주입 실패 뒤 성공 item 12개가 유지됐고 retry 후 18 identity/22 localization, failed 0, duplicate identity/route 0이다. exact repeat 18개는 skipped됐으며 변경 checksum은 자동 overwrite 없이 감지됐다. 상세는 [Neon execution report](NEON_STAGING_EXECUTION_REPORT.md)를 따른다.
