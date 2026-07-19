# Database Deployment Runbook

- **Status:** Local and Neon staging migration 0000..0003 passed; production not run
- **Last Updated:** 2026-07-18
- **Authority:** Staging/production migration 순서와 rollback
- **Purpose:** Reviewed migration을 direct connection으로 안전하게 적용한다.

## Staging

```bash
test -n "$STAGING_DATABASE_DIRECT_URL"
env DATABASE_URL="$STAGING_DATABASE_DIRECT_URL" npm run db:migrate
env DATABASE_URL="$STAGING_DATABASE_DIRECT_URL" npm run db:migrate
```

대상은 `0000_initial.sql`부터 `0003_import_batch_recovery.sql`까지다. 두 번째 실행은 no-op이어야 한다. `schema_migrations`의 name/checksum/applied_at을 read-only query로 확인한다. Runtime smoke query는 pooled `STAGING_DATABASE_URL`로 실행한다. Command/report에서 URL 자체를 출력하지 않는다.

순서는 restore point 확인 → direct migration → schema/checksum verification → application deploy → pooled smoke test → 이전 deployment 유지 확인이다. `0000`, `0001`, `0002`는 수정하지 않는다. Runner는 migration 전체를 transaction으로 실행하지만 PostgreSQL DDL/외부 provider operation의 모든 rollback을 보장한다고 가정하지 않는다. 실패 시 앱 deploy를 중단하고, 이미 commit된 파괴적 migration은 새 forward migration 또는 staging restore branch로 복구한다.

## Production

Stage 9에서는 실행 금지다. 승인 시에도 backup/restore point, direct production migration credential, reviewer 확인 후 동일 runner를 사용한다. Reset/import/fixture actor/publish test는 production credential로 절대 실행하지 않는다.

## Status/rollback

- Applied migration checksum이 파일과 다르면 즉시 중단한다.
- Runtime deploy가 실패하면 DB-compatible 이전 deployment로 traffic을 유지한다.
- Additive migration을 우선하고 destructive DDL은 expand/contract 두 단계로 분리한다.
- Production rollback은 `db:reset`이 아니라 Neon restore/PITR 또는 검토된 forward migration이다.
