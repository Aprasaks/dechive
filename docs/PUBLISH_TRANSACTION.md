# Publish Transaction

- **Status:** Prototype implemented and integration-tested
- **Last Updated:** 2026-07-18
- **Authority:** 발행 원자성, 실패, rollback 규칙
- **Purpose:** draft가 immutable published revision으로 전환되는 유일한 경계를 정의한다.

## 흐름

1. 앱 계층에서 DechiveDocument validation 및 sanitized renderer/export를 완료한다.
2. `BEGIN`, version row `FOR UPDATE`.
3. 상태가 draft/review/scheduled이고 validation이 valid/valid_with_warnings인지 확인한다.
4. source/media가 승인됐고 active canonical route가 정확히 하나인지 확인한다.
5. `rendered_html`, `normalized_markdown`, `plain_text`를 version artifact로 삽입하고 checksum/생성기 metadata를 기록한다.
6. version을 published로 전환하고 localization의 current published pointer를 바꾼다.
7. `revision_events`에 actor와 artifact type을 기록하고 `COMMIT`한다.

Artifact 생성 함수 자체는 DB lock을 오래 잡지 않도록 transaction 전에 실행한다. 단, 빈 결과/세 종류 누락은 DB 변경 전에 실패한다. 실제 DB 쓰기와 pointer 전환은 한 transaction이다.

## 실패 정책

- invalid/unknown/needs_review document, 미승인 source/media, canonical route 부재, artifact 누락/중복/생성 실패는 발행 차단.
- insert/constraint/transaction 실패는 전부 rollback; 이전 current published pointer 유지.
- 실패 draft는 수정 후 재시도 가능하며, artifact partial row는 남지 않는다.
- published version/artifact의 update/delete는 DB trigger가 거부한다.
- rollback은 과거 canonical JSON을 새 version으로 복사하고 새 artifacts/checksums를 생성해 발행한다.

## Artifact metadata

`metadata`에는 유형에 따라 `markdownExportMode`, `exportWarnings`, `fallbackNodeCount`, `exporterVersion`, `rendererVersion`을 둔다. DB에는 artifact body를 저장한다. 백업 export는 canonical JSON과 Markdown을 함께 내보내는 2차 복구 사본이며 DB artifact를 대체하지 않는다.

## 아직 구현하지 않은 것

Production auth/role enforcement, scheduler worker, CMS, media upload/storage, cloud connection, legacy content publish는 없다. 현재 actor/role은 authorization 경계의 논리/DB 표현이며 신원 인증 시스템이 아니다.
