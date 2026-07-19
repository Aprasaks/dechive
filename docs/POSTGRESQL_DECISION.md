# PostgreSQL Decision

- **Status:** Neon selected; cloud project and region connection pending
- **Last Updated:** 2026-07-18
- **Authority:** PostgreSQL hosting and ORM/migration decision
- **Purpose:** 운영 후보와 Stage 7의 재현 가능한 선택을 기록한다.

## 결론

**Neon managed PostgreSQL 17**, AWS Singapore `ap-southeast-1`을 승인했다. DB 사용 Vercel Functions는 `sin1` 기준이다. Cloud project/secret은 아직 만들지 않았다. 시작은 Launch, restore window 7일, DB 외부 logical/portable backup을 별도 운영한다.

환경은 local Docker PostgreSQL, PR별 비공개 production 데이터가 없는 ephemeral preview branch, persistent staging branch, production main branch로 분리한다. UUID v4를 유지하고 PostgreSQL 18/UUID v7은 안정화 뒤 재평가한다.

## 운영 후보 비교

| 후보 | Vercel/pooling | backup·분리 | 소유권·lock-in | 비용·운영 | 판단 |
|---|---|---|---|---|---|
| Neon | Vercel Marketplace, pooled URL, branch 기반 preview/staging | branch/restore window 제공; plan별 PITR 확인 필요 | 표준 Postgres export 가능, branching은 provider 기능 | serverless 운영 부담 낮음 | **1순위 권고**. Vercel preview와 DB branch 결합이 명확 |
| Supabase | Supavisor transaction/session/direct URL; Vercel 연동 | daily backup/PITR plan 차이; auth/storage와 환경 분리 가능 | 표준 Postgres이나 auth/storage 결합 시 전환비 증가 | Guestbook 경험 재사용 가능 | 2순위. 콘텐츠 DB는 독립 project/credential 필요 |
| Vercel 동등 서비스 | 현재 Vercel Marketplace DB(Neon/Supabase 등)를 뜻함 | 공급자 정책에 따름 | Vercel integration과 DB 공급자를 분리해 봐야 함 | 편리하나 추상 명칭으로 계약 금지 | 별도 DB 제품으로 평가하지 않음 |
| 일반 managed PG | RDS/Cloud SQL 등 pooling 별도, Vercel egress 고려 | PITR/replica/region 성숙 | 표준성 최고 | 소규모 팀에는 네트워크·pooler·비용 부담 | 규모/규제 증가 시 후보 |
| self-host | 직접 pooler/방화벽 | backup/PITR/restore drill 직접 책임 | 최대 통제 | 단일 운영자에게 위험 집중 | production 비권고, local test만 사용 |

근거: [Neon pooling](https://neon.com/docs/connect/connection-pooling), [Neon branching](https://neon.com/docs/guides/branching-intro), [Supabase connections](https://supabase.com/docs/guides/database/connecting-to-postgres), [Supabase backups](https://supabase.com/docs/guides/platform/backups), [Vercel Database Marketplace](https://vercel.com/marketplace/category/database).

## ORM/migration 비교

| 도구 | 강점 | 약점 | 결정 |
|---|---|---|---|
| Drizzle | 얇은 TS mapping, JSONB/transaction, SQL을 읽고 수정 가능, serverless adapter 교체 쉬움 | 복잡 trigger/partial index는 SQL 검토 필요; drizzle-kit dev dependency audit 이슈 | **선택** |
| Prisma | schema/client/migration DX와 transaction 성숙 | 생성 client와 engine/adapter 계층, DB-native DDL을 별도 SQL로 보완 | 비선택 |
| Kysely + migrator | SQL에 가까운 type-safe query, 낮은 lock-in | schema 선언과 migration을 더 직접 관리, 팀 표준 추가 필요 | 좋은 fallback |
| 직접 SQL | 기능·가독성·이식 통제 최대 | query type safety와 mapping을 자체 유지 | migration의 최종 검토 형식으로만 사용 |

Drizzle schema가 모델의 TS 기준이고, 생성 SQL은 commit 전에 검토한다. migration 적용 후 파일 checksum이 바뀌면 runner가 중단한다. [Drizzle migrations](https://orm.drizzle.team/docs/migrations), [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate), [Kysely migrations](https://www.kysely.dev/docs/migrations)를 기준으로 비교했다.

## ID

PostgreSQL 17의 `gen_random_uuid()` UUID v4를 선택했다. UUID v7은 정렬성 장점이 있으나 PostgreSQL 18 함수 또는 앱 생성 의존성이 필요하고 Stage 7의 핵심 요건이 아니다. ULID도 추가 package/encoding 규칙을 만든다. ID는 immutable이고 URL에는 강제 노출하지 않는다. [PostgreSQL 17 UUID functions](https://www.postgresql.org/docs/17/functions-uuid.html).
