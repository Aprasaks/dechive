# Neon Staging Execution Report

- **Status:** Neon staging verification complete; Vercel sin1 and Neon temporary restore branch remain blocked
- **Last Updated:** 2026-07-18
- **Authority:** Stage 10 cloud 실행 여부와 증거
- **Purpose:** 로컬 결과를 Neon 결과로 오인하지 않도록 실제 실행 경계를 기록한다.

## Credential preflight

| Variable | 상태 |
|---|---|
| `STAGING_DATABASE_URL` | configured; value not logged |
| `STAGING_DATABASE_DIRECT_URL` | configured; value not logged |

두 값은 Git ignored `.env.staging.local`에 mode `0600`으로 저장했다. 값, host, database name, role name, username, password는 출력하거나 report에 기록하지 않았다. pooled/direct URL 차이, endpoint pair, SSL requirement, database/role identity 일치, PostgreSQL 17, production marker 부재를 확인했다. 이 결과는 사용자가 명시한 project `dechive-content`/branch `staging` 정보와 결합한 안전장치다.

## 실제 Neon staging 결과

- Direct migration `0000..0003`: 4개 적용, checksum 확인, second run no-op.
- Schema: public table 31, index 59, trigger 7, constraint 291.
- Pooled importer: 18 legacy identity, 22 localization. 6개 failure injection 후 retry로 잔여 실패 0.
- Repeat: 18 item 전부 skipped. changed checksum은 overwrite 없이 감지.
- Workflow: `draft`/`needs_review` 외 version 0, published pointer 0.
- Duplicate: legacy identity 0, route 0.
- Repository/service: route, Knowledge, draft/published, version, translation, detail, Digest, Issue, source, media, relation, batch/item query 통과.
- Backup: PostgreSQL 17 custom dump와 application portable export/checksum manifest 생성.
- Restore: production/Neon staging에 쓰지 않고 격리된 local restore database에서 18개 핵심 table count, integrity checksum, immutable trigger 일치.
- Latency: local macOS→Singapore만 측정. [latency report](NEON_LATENCY_REPORT.md) 참고.

## 남은 blocked 항목

- Vercel staging/sin1 environment 및 secret 미설정: Vercel query/latency 미수행.
- 별도 Neon temporary restore branch credential 미제공: cloud restore rehearsal 미수행. Local isolated restore는 완료.
- `preview-base` branch/credential 미제공: 생성·seed 미수행.
- TipTap 실제 OS/device 수동 gate 미통과.

Production branch에는 연결, migration, import, seed, backup/restore, query를 실행하지 않았다.
