# Import Batch Failure Recovery

- **Status:** Local PostgreSQL verified
- **Last Updated:** 2026-07-18
- **Authority:** Item atomicity, partial failure, retry and crash recovery
- **Purpose:** 한 콘텐츠 실패가 다른 import를 rollback하지 않게 한다.

Batch manifest를 확정한 뒤 batch row를 `running`으로 만든다. 각 Knowledge localization 또는 Digest는 독립 client/transaction을 사용한다. 실패 transaction은 해당 identity/version/route/media/source를 전부 rollback하고 별도 transaction으로 `import_items.failed`를 기록한다. 다음 item은 계속 처리한다.

Aggregate 상태는 `completed`, `partial_failure`, `failed`, `cancelled`다. 같은 batch key는 PostgreSQL advisory session lock으로 동시 실행을 차단한다. Heartbeat와 recovery count를 저장한다. 재실행 시 성공 identity는 checksum이 같으면 skipped이고 실패 item만 다시 persist된다. Checksum 변화는 overwrite하지 않는다.

## Failure injection 결과

| 주입 | 결과 |
|---|---|
| 3번째 parse 실패 | item failed, 앞/뒤 item 유지 |
| 5번째 constraint 실패 | transaction rollback |
| source attach 실패 | 해당 item partial row 없음 |
| media usage 실패 | 해당 item partial row 없음 |
| route conflict | duplicate route 없음 |
| transaction abort | 해당 item 전체 rollback |
| report write 실패 | DB batch 결과 유지 |
| stale running/process resume | recovery count 증가, failed item 재실행 성공 |

첫 실행은 성공 12/실패 6, batch `partial_failure`였다. 재개 후 identity 18, localization 22, failed 0, duplicate route 0이었다. [failure recovery report](../fixtures/content-import/output/failure-recovery-report.json)에 secret-free 결과가 있다.

Report write는 DB transaction 이후 artifact 단계다. 실패해도 DB 상태를 되돌리지 않고 report regeneration으로 복구한다.
