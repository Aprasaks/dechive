# Neon Staging Setup

- **Status:** Neon staging connected and verified; Vercel staging pending
- **Last Updated:** 2026-07-18
- **Authority:** Neon/Vercel staging resource and credential setup
- **Purpose:** Secret을 노출하지 않고 Singapore staging을 생성하는 정확한 사용자 절차를 제공한다.

## 사용자 콘솔 절차

1. Neon Console에서 project `dechive-content`, AWS Singapore `ap-southeast-1`, PostgreSQL 17을 선택한다.
2. Launch plan과 7일 restore window를 확인한다. Console의 실제 표기가 다르면 결제 전 중단하고 기록한다.
3. 기본 production branch에는 데이터/migration/seed를 실행하지 않는다. Persistent child branch `staging`을 만든다.
4. Staging에 schema owner/migration role과 runtime application role을 분리한다. 필요하면 backup read-only role을 추가한다.
5. Connect 창에서 staging runtime role의 **pooled** URL과 migration role의 **direct** URL을 각각 받는다. `sslmode=require`를 확인한다.
6. Vercel Settings → Functions에서 DB 사용 Function region을 Singapore `sin1`로 설정한다.
7. Vercel Environment Variables에서 staging용 별도 project/environment에 `DATABASE_URL`(pooled), `DATABASE_DIRECT_URL`(direct)을 encrypted로 입력한다. Production scope에는 Stage 9 값을 넣지 않는다.
8. Preview integration을 승인할 경우 parent를 sanitized/schema-only staging branch로 설정한다. Production branch copy-on-write preview를 사용하지 않는다.

사용자가 Neon project `dechive-content`, persistent `staging` branch(parent `production`), Singapore region, PostgreSQL 17을 생성했다. pooled/direct credential은 Git ignored `.env.staging.local`에 mode `0600`으로 저장했으며 값과 connection identity는 문서·로그에 기록하지 않았다. Vercel staging/sin1 integration은 아직 없다. 공식 기준: [Neon project/branch 구조](https://neon.com/docs/manage/projects), [pooled/direct 연결](https://neon.com/docs/connect/connection-pooling), [Vercel manual connection](https://neon.com/docs/guides/vercel-manual), [Vercel Functions regions](https://vercel.com/docs/functions/configuring-functions/region).

## 환경 변수

| Scope | Runtime | Migration |
|---|---|---|
| Local | unset → Docker default 또는 `DATABASE_URL` | local direct URL |
| Preview | branch별 injected `DATABASE_URL` | CI-only direct URL |
| Staging | `STAGING_DATABASE_URL` 또는 staging Vercel scope의 `DATABASE_URL` | `STAGING_DATABASE_DIRECT_URL` |
| Production | production scope `DATABASE_URL` | 승인된 deploy job의 direct credential |

`NEXT_PUBLIC_` 접두사는 금지한다. URL을 log/report/error에 출력하지 않는다. Runtime role은 schema owner/CREATE 권한을 갖지 않는다.
