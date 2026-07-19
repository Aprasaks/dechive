# Backup and Restore

- **Status:** Local logical restore rehearsal passed; Neon rehearsal pending
- **Last Updated:** 2026-07-18
- **Authority:** PITR 외 logical/portable backup과 복구 검증
- **Purpose:** Canonical JSON과 stable identity를 provider 외부에서도 복구 가능하게 한다.

## 두 백업

1. PostgreSQL logical backup: direct/read-only role로 `pg_dump --format=custom`; encrypted artifact storage와 retention 정책 필요.
2. Dechive portable export: `formatVersion`, legacy stable key, locale/slug/route, canonical JSON/checksum, normalized metadata, source/media reference, Digest/Issue ordering을 JSON에 보관한다. Connection string과 secret은 포함하지 않는다.

Portable export는 DB UUID만으로 관계를 복구하지 않고 stable legacy key/route/locale을 사용한다. Published content가 생기면 normalized Markdown과 artifact checksum도 포함해야 한다.

## Rehearsal 결과

Local PostgreSQL에서 clean `dechive_restore` DB 생성 → `0000..0002` migration → data-only custom dump를 단일 transaction으로 restore → 17개 핵심 table count 및 document/artifact/route/import checksum aggregate 비교를 수행했다. 22 localization과 모든 count/checksum이 일치했다. 결과는 [staging-rehearsal-report.json](../fixtures/staging-import/output/staging-rehearsal-report.json), portable data는 [portable-export.json](../fixtures/staging-import/output/portable-export.json)이다.

Neon에서는 staging child/temp branch에서 같은 순서를 실행해야 하며 production은 restore rehearsal 대상이 아니다. Neon PITR와 별도 `pg_dump` 병행 근거는 [Neon PITR/pg_dump 안내](https://neon.com/blog/announcing-point-in-time-restore)를 따른다.

보존과 암호화/checksum manifest는 [Backup Retention Policy](BACKUP_RETENTION_POLICY.md)를 따른다. Stage 10에서 Neon staging의 PostgreSQL 17 custom-format dump와 portable export/checksum manifest를 생성하고 격리된 local PostgreSQL에 복원해 count/checksum을 검증했다. 별도 Neon restore branch와 encryption key/storage는 아직 없어 cloud restore와 암호화 검증은 미수행이다.
