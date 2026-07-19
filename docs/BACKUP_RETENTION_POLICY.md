# Backup Retention Policy

- **Status:** Policy approved; external provider and encryption key pending
- **Last Updated:** 2026-07-18
- **Authority:** PITR 외 logical/portable backup의 보존·암호화·검증
- **Purpose:** Provider 장애와 운영 실수에 대비한 독립 복구 사본을 정의한다.

## Retention

- Daily: 최근 30개
- Weekly: 최근 12개
- Monthly: 최근 12개

Neon PITR/7일 restore window와 별도 운영한다. 삭제 전 최소 한 개의 검증된 후속 backup 존재를 확인한다.

Artifact set은 PostgreSQL custom-format dump, Dechive portable export, checksum manifest다. Manifest에는 UTC 생성 시각, non-secret 환경/branch ID, PostgreSQL major, 최고 migration, byte size, plaintext SHA-256, encrypted artifact SHA-256, exporter version을 둔다.

Connection string, password, OAuth/token, backup key를 포함하지 않는다. Key는 secret manager/KMS에 두고 artifact·manifest·git·`.env.example`과 분리한다. 암호화 전 checksum은 복호화 내용 검증, 암호화 후 checksum은 전송/저장 무결성 검증에 쓴다.

Provider 선정 전에는 도구를 고정하지 않는다. 우선 권고는 provider-side KMS envelope encryption 또는 조직 표준 `age`다. 실제 key가 없어 encryption/decryption 성공은 주장하지 않는다.
