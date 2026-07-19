# Infrastructure and Operations

- **Status:** Proposed operating baseline
- **Last Updated:** 2026-07-18
- **Authority:** 배포·보안·백업·관측 운영 기준
- **Purpose:** 기능 구현 전에 복구 가능성과 운영 책임을 정의한다.

## Stage 7 local database

`docker-compose.db.yml`의 PostgreSQL 17.6 단일 service가 local/test 환경이다. localhost만 노출하고 production secret은 없다. `npm run db:up`, `npm run verify:database`, `npm run db:down`으로 재현한다. Production 권고는 [PostgreSQL Decision](POSTGRESQL_DECISION.md)을 따른다.

Stage 9 운영 기준은 Neon Singapore + Vercel `sin1`, direct migration/pooled runtime 분리, 7일 restore window와 별도 logical backup이다. 계정 작업은 [Neon Staging Setup](NEON_STAGING_SETUP.md), restore는 [Backup and Restore](BACKUP_AND_RESTORE.md)를 따른다.

## 현재

Vercel이 Git submodule을 인증 token으로 checkout하고 `npm run build`를 실행한다. 콘텐츠 DB/object store/migration runner/backup/error tracking/uptime check/Docker는 없다. Supabase는 방명록에만 사용한다.

## 목표 환경

development/staging/production을 분리하고 env schema validation, least-privilege secret, preview data isolation을 둔다. application deploy와 DB migration을 분리하며 backward-compatible migration→deploy→cleanup 순서를 사용한다.

## Docker

Docker Compose는 PostgreSQL/object store/search를 로컬에서 재현해야 할 때 도입 가치가 있다. Vercel production 때문에 무조건 containerize하지 않는다. 선택 시 pinned image, healthcheck, named volume, initialization/migration, ARM 지원, backup example을 포함한다.

## 백업과 복구

DB PITR/daily dump, object version/replica, off-provider encrypted copy, retention, restore test와 RPO/RTO를 결정한다. “backup 성공”이 아니라 staging restore+checksum+sample URL 검증을 완료 기준으로 한다.

## 관측·보안

Sentry 등 error tracing은 source-map/PII scrub/cost를 비교한다. Uptime Kuma는 독립 host가 확보될 때 public/admin/API synthetic check 후보이며 같은 장애 영역에 두지 않는다. structured logs, deploy marker, latency/error alert, dependency/secret scanning, rate limits, upload validation, incident runbook을 단계적으로 둔다.
