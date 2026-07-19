# Scheduled Publish Design

- **Status:** Logical schema implemented; worker not deployed
- **Last Updated:** 2026-07-18
- **Authority:** Scheduled job idempotency and execution state
- **Purpose:** content workflow와 worker 실행 상태를 혼동하지 않는 발행 설계를 정의한다.

`publish_jobs`는 version, unique idempotency key, due time, status, attempts, lock owner/time, completion, failure reason, requesting actor를 저장한다. Content version의 `scheduled`는 editorial workflow이고 job의 `pending/running/completed/failed/cancelled`는 실행 상태다.

기본값은 batch 10, max attempts 5, stale lock 10분이다. Retry는 1분, 5분, 15분, 1시간, 6시간이며 `next_attempt_at`을 저장한다. 다섯 번째 실패는 permanent failure이고 manual retry는 새 audit event와 명시적 승인으로 attempts 상태를 재개한다.

Worker는 due pending job을 `FOR UPDATE SKIP LOCKED`로 claim하고 attempts/lock을 원자적으로 갱신한다. 같은 idempotency key의 중복 enqueue는 거부한다. 이미 target version이 published면 성공으로 종료하고, current pointer가 예상과 다르거나 validation/source/media/artifact가 실패하면 기존 published version을 유지한다. Stale lock은 제한 시간 뒤 재시도하되 최대 attempts 이후 failed로 둔다.

UTC timestamptz를 canonical로 사용하고 UI만 locale timezone으로 표시한다. Archived target/cancelled job은 실행하지 않는다. 이미 published target은 idempotent completed, concurrent worker는 row lock으로 한 개만 claim한다.

향후 Vercel Cron은 secret header를 server에서 timing-safe 검증하고 worker service 하나만 호출한다. Cron HTTP 요청 자체를 actor로 보지 않고 DB의 system actor로 audit한다. 실제 route/secret/배포는 Stage 8 범위 밖이다.
