# Open Source Evaluation

- **Status:** Initial evaluation; benchmarks required
- **Last Updated:** 2026-07-18
- **Authority:** 후보 기술 비교와 도입 gate 기준
- **Purpose:** 설치 수가 아니라 문제 해결·소유권·교체 가능성으로 기술을 평가한다.

## Stage 7 추가 평가

| 도구 | 역할/라이선스 | 결정 |
|---|---|---|
| PostgreSQL 17 | canonical metadata/version/artifact, PostgreSQL License | local prototype 채택 |
| Drizzle ORM/Kit | TS mapping/migration, Apache-2.0 | prototype 채택; Kit audit chain 추적 |
| `pg` | Node pool, MIT | 채택 |
| Docker Compose | local 재현 | local-only 채택 |

`@anthropic-ai/sdk`는 root 참조가 없어 root devDependency에서 제거했다. `content/.github/scripts/translate.mjs`와 subproject workflow는 변경하지 않았다. [PostgreSQL Decision](POSTGRESQL_DECISION.md)에 상세 비교가 있다.

## 공통 점수표

요구 해결성, 활동성/release/security, license, TypeScript/Next.js, Docker, data ownership/export, replacement boundary, ops complexity, security/backup, longevity, Korean quality, total cost를 1~5로 평가하고 prototype 증거를 첨부한다. 버전·라이선스·활동성은 도입 시점에 공식 저장소에서 다시 확인한다.

## 초기 결론

| 후보 | 초기 판단 | 이유/도입 gate |
|---|---|---|
| PostgreSQL | 우선 검증 | 관계·revision·JSONB·FTS·소유권을 한 기반에서 제공; schema/host/backup 승인 필요 |
| Docker Compose | 로컬 infra 시 도입 | 재현성은 좋지만 Vercel production 필수요소는 아님 |
| ORM/query builder | 비교 후 선택 | Drizzle/Prisma/Kysely 등의 migration, SQL escape, FTS, typing benchmark 필요 |
| TipTap | **runtime prototype 조건부 통과** | v3.28.0 MIT. React 19/Next 16, 100k자/custom node/autosave 통과; OS IME/a11y/paste/table export gate 남음 |
| BlockNote | 3순위 비교 prototype | block UX 빠름. 공식 Markdown/HTML export가 lossy이며 block JSON lock-in 검토 필요 |
| Lexical | 2순위 비교 prototype | MIT, 접근성·성능·custom node 강점. 완성 editor UI와 serialization glue 비용 큼 |

세 제품 모두 provider JSON을 canonical로 채택하지 않는다. 라이선스·활동성·기능 근거와 아직 미측정인 bundle 항목은 [Editor Benchmark](EDITOR_BENCHMARK.md)에 기록했다.

실제 설치는 TipTap core 관련 5개 직접 의존성과 browser 검증용 Playwright devDependency로 제한했다. 상세 package 역할과 제거 가능성은 [Editor Runtime Prototype](EDITOR_RUNTIME_PROTOTYPE.md)을 따른다.

Stage 6은 `sanitize-html`(MIT)을 HTML/paste allowlist 검증에 추가했다. Next는 16.2.3→16.2.6 patch, shadcn은 devDependency로 이동, dev-only `fast-uri`/`hono` transitive patch를 갱신해 audit High 3→0으로 낮췄다. 남은 11건의 실제 chain/완화는 [Editor Security and Migration](EDITOR_SECURITY_AND_MIGRATION.md)에 기록하며 자동 audit fix는 사용하지 않는다.
| S3-compatible/MinIO | API 경계 채택 후보 | 원본 소유·이식성; managed S3와 self-host 운영비 비교 |
| PostgreSQL FTS | 검색 1차 | 추가 서비스 없이 시작; 한국어 relevance corpus 통과가 gate |
| Meilisearch | 보류 후보 | typo/UX 강점; 별도 index/backup/ops는 FTS 실패 시 감수 |
| Typesense | 보류 후보 | 빠른 faceting/typo 후보; 한국어/운영 비교 필요 |
| pgvector | 나중에 판단 | citation 검색에서 의미 검색의 측정 이익이 있을 때만 |
| Vercel AI SDK | 선택적 | provider/streaming 필요가 확인될 때 adapter 내부에서 사용 |
| GA4 | 현재 유지 평가 | 이미 사용; privacy와 제품 학습 지표 적합성 재검토 |
| Umami/Plausible | 대안 비교 | 단순·소유권 장점; self-host 운영과 기능/비용 비교 |
| Sentry | 권장 평가 | 오류 가시성 필요; PII scrub/비용/retention gate |
| Uptime Kuma | 조건부 | 독립 운영 위치가 있을 때 유효 |
| 이메일 시스템 | 미결정 | double opt-in, deliverability, export, 비용으로 managed/self-host 비교 |
| 이미지 처리 | sharp 우선 조사 | Next 생태계 호환; async 대량 처리/metadata 보존 검증 |
| 관리자 UI library | 최소 도입 | shadcn 등 기존 기반 재사용성을 먼저 확인하고 통째 dashboard kit 금지 |

## 비도입 원칙

기능 요구, owner, backup, upgrade, exit plan이 없는 서비스는 설치하지 않는다. 동일 문제에 DB+검색 engine+vector를 한 번에 도입하지 않는다.
