# Decisions

## D-62 — Practice는 적용·관찰·검증 기록이다

Practice는 Knowledge를 실제로 적용한 결과를 기록하며 성공만 요구하지 않는다. `verified`, `partially_verified`, `not_verified`, `failed`, `inconclusive` 결과를 모두 허용한다. Knowledge 연결은 선택적 하나이며 Lecture 직접 관계와 다대다 relation은 만들지 않는다. 과거 상태 복구는 독립 rollback API가 아니라 새 immutable revision 저장 후 재발행으로 수행한다.

- **Status:** Living decision register
- **Last Updated:** 2026-07-18
- **Authority:** 승인된 결정과 미결정 gate의 단일 기록
- **Purpose:** 문서·코드가 상충할 때 적용할 결정과 책임을 추적한다.

## D-61 — Stage 24 공개 구조 reset

새 공개 구조는 Knowledge, Lecture, Practice, AI Update, Books다. Header는 이 다섯 항목만, Footer는 Privacy Policy, Terms, Contact, About만 표시한다. legacy 콘텐츠는 새 사이트로 이전하거나 redirect하지 않고 410으로 정리한다. Dechive 내부 CMS만 새 콘텐츠 원본이며, 공개 콘텐츠는 무료이고 회원·결제·댓글·다크모드는 제공하지 않는다.

## 승인

| ID    | 결정                                   | 상태                          | 결과                                                                                                                                                                                                         |
| ----- | -------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D-01  | 제품 정의를 독립 학습 플랫폼으로 변경  | Accepted                      | 지식·강의·실습·AI 업데이트를 top-level로 둔다                                                                                                                                                                |
| D-02  | 라이트 모드 전용                       | Accepted                      | dark theme/toggle/system dark를 제거 계획에 포함                                                                                                                                                             |
| D-03A | Obsidian/Markdown canonical 폐기       | Accepted                      | Markdown은 migration/import/export 데이터                                                                                                                                                                    |
| D-04  | 기존 콘텐츠·URL 보호                   | Accepted                      | 이전 검증·롤백 전 삭제/slug 변경 금지                                                                                                                                                                        |
| D-05  | AI human approval                      | Accepted                      | AI 자동 발행 금지, provider adapter 사용                                                                                                                                                                     |
| D-14  | 2단계 임시 route 연결                  | Accepted                      | 지식은 `/archive`, AI 업데이트는 `/ai-updates`, About은 `/about`; 강의·실습은 비활성 준비 상태                                                                                                               |
| D-15  | 미구현 서비스 표시                     | Accepted                      | 검색·이메일 구독·Buy Me a Coffee는 동작을 가장하지 않고 준비 상태로 표시                                                                                                                                     |
| D-16  | 코드 문법 강조 분리                    | Accepted                      | 전역 UI 다크모드는 제거하되 `atom-one-dark`는 코드 블록 전용으로 임시 유지                                                                                                                                   |
| D-17  | Archive/Deep Dive 통합                 | Accepted                      | 둘 다 Knowledge; Deep Dive는 `format=deep_dive`, `depth=deep`, 장기 navigation 제거, legacy URL 유지                                                                                                         |
| D-18  | Book 분류                              | Accepted                      | 기존 Book은 `Knowledge(format=book_note)`, `/book/**` 유지; 판매/다운로드물은 별도 Resource                                                                                                                  |
| D-19  | AI Update 혼합 모델                    | Accepted                      | 개별 AIUpdate canonical, 날짜 Digest editorial collection, 기존 날짜 URL 유지, detail은 `/ai-updates/{date}/{slug}` 1차 기준                                                                                 |
| D-20  | DB 논리·물리 prototype                 | Accepted                      | 공통 `contents/content_versions` + 유형별 detail; PostgreSQL 17/Drizzle prototype 승인. Production host는 미확정                                                                                             |
| D-21  | 신규 다국어 C안                        | Accepted                      | 유형별 선택 운영, 기존 영어 전부 보존, locale version 독립                                                                                                                                                   |
| D-22  | Knowledge difficulty                   | Accepted                      | 선택 필드                                                                                                                                                                                                    |
| D-23  | Course/Lesson 공개 상태                | Accepted                      | 각각 상태를 가지며 미완성 Course는 최소 공개 조건 전 비공개                                                                                                                                                  |
| D-24  | Practice 초기 저장                     | Accepted                      | 로그인/서버 진도 불필요; localStorage는 편의이며 canonical 아님                                                                                                                                              |
| D-25  | canonical document와 editor state 경계 | Accepted                      | Dechive 소유 versioned ProseMirror-compatible JSON. 거대 중립 AST 없음; schema/allowlist/custom 의미/validation/migration/unknown/publish rule 직접 통제                                                     |
| D-26  | published artifact/export 정책         | Accepted                      | 모든 published revision에 Markdown/HTML 재생성 정보/plain text/checksums 저장, draft autosave 제외, 무기한 보존, JSON+Markdown backup                                                                        |
| D-27  | AI Update detail identity/slug         | Accepted                      | `/ai-updates/{date}/{slug}`; immutable id가 identity, 같은 날짜 slug unique, 제목 변경은 slug 유지, 변경 시 alias/redirect                                                                                   |
| D-28  | unknown/migration 차단                 | Accepted                      | 원 payload 보존, unresolved unknown 새 revision 발행 차단, 문제 콘텐츠는 `needs_review` 격리                                                                                                                 |
| D-29  | TipTap production editor               | Accepted with release gate    | production editor로 선정. 실제 OS/device IME·native a11y 수동 gate 통과 전 관리자 공개/업무 전환 금지                                                                                                        |
| D-30  | Table Markdown export                  | Accepted                      | 단순/inline 표는 GFM, 복합 cell/span은 sanitized HTML fallback; mode/warning/fallback count/exporter version 기록                                                                                            |
| D-31  | Unknown node 책임                      | Accepted                      | 개별 콘텐츠는 콘텐츠 관리자, 반복 구조는 개발자 migration; AI 제안은 사람 승인 전 적용 금지                                                                                                                  |
| D-32  | Digest anchor 전환                     | Accepted                      | 실제 콘텐츠 migration 단계에 수행하고 새 detail URL 전환 뒤에도 legacy anchor 호환 유지                                                                                                                      |
| D-33  | Published artifact storage             | Accepted                      | HTML/normalized Markdown/plain text를 DB immutable artifact로 저장; backup export는 2차 복구 사본                                                                                                            |
| D-34  | External media/embed v1                | Accepted                      | 외부 media는 검증·승인된 internal ID 필요; v1 iframe/embed 금지, YouTube는 일반 링크                                                                                                                         |
| D-35  | Stage 7 DB tooling/provider            | Accepted                      | PostgreSQL 17 + Drizzle + reviewed SQL migration; production provider는 Neon, UUID v4 유지. Cloud project/secret은 미생성                                                                                    |
| D-36  | Neon 환경 구조                         | Accepted                      | local Docker, PR별 sanitized ephemeral branch, persistent staging, production main; Launch 기준, restore window 7일 목표, 외부 backup 별도                                                                   |
| D-37  | Legacy dry-run                         | Accepted                      | 전체 이전 전 Knowledge/AI Update 제한 표본을 needs_review draft로 import; migration 완료 전 Markdown canonical 유지                                                                                          |
| D-38  | Scheduled publish                      | Accepted                      | content workflow와 publish job 상태 분리, unique idempotency key와 retry/lock을 가진 worker 방식                                                                                                             |
| D-39  | 관리자 identity/role                   | Accepted                      | 외부 identity는 인증 수단, Dechive DB actor-role membership이 권한 canonical; v1 일반 회원가입 없음                                                                                                          |
| D-40  | Neon/Vercel region                     | Accepted                      | Neon AWS Singapore `ap-southeast-1`, DB 사용 Vercel Functions `sin1`; PostgreSQL 17, Launch, 7일 restore 기준                                                                                                |
| D-41  | Neon environment safety                | Accepted                      | 첫 연결은 staging; production import/seed 금지; preview는 sanitized/schema-only parent와 fake/public seed만 사용                                                                                             |
| D-42  | Stage 9 확대 dry-run                   | Accepted                      | 전체 이전 전 Archive 4쌍, Deep Dive 3쌍, Book 2, Digest 2, Issue 2로 약 20 localization 검증                                                                                                                 |
| D-43  | AI Update split review                 | Accepted                      | `single/split_recommended/split_required/needs_editor_review`; importer는 근거만 기록하고 콘텐츠 관리자가 확정                                                                                               |
| D-44  | Scheduled worker defaults              | Accepted                      | attempts 5, stale lock 10분, batch 10, retry 1m/5m/15m/1h/6h, system actor와 SKIP LOCKED 필수                                                                                                                |
| D-45  | Stage 9/10 evidence 경계               | Accepted                      | Stage 9A local rehearsal 완료; 실제 Neon staging evidence는 credential 연결 후에만 기록                                                                                                                      |
| D-46  | Preview parent                         | Accepted                      | production/staging 복제가 아닌 전용 `preview-base`; schema, deterministic public fixture, fake actor만 허용                                                                                                  |
| D-47  | Import failure isolation               | Accepted                      | localization/content 단위 transaction, batch partial_failure, failed-item retry, advisory lock/heartbeat recovery                                                                                            |
| D-48  | Backup retention                       | Accepted                      | PITR 외 daily 30, weekly 12, monthly 12 logical/portable backup; 암호화와 두 checksum manifest 필수                                                                                                          |
| D-49  | Neon staging provisioning/verification | Accepted and verified         | `dechive-content` staging, parent production, Singapore, PostgreSQL 17. Direct migration과 pooled runtime을 분리해 18 identity/22 localization cloud dry run 완료; production untouched                      |
| D-50  | Stage 11 local Archive admin slice     | Accepted for local validation | Knowledge `format=article`만 localhost/Docker PostgreSQL에서 create/edit/preview. 명시적 save와 immutable version을 사용하며 auth/production 공개/공개 renderer 전환은 제외                                  |
| D-51  | Stage 12B single-owner auth            | Accepted                      | 기존 GA env 인증을 bcrypt email credential과 12시간 난수 서명 세션으로 보강하고, `external_identities` allowlist와 `actor_role_memberships.owner`를 CMS 권한 canonical로 사용. 다중 사용자·가입·OAuth는 제외 |
| D-52  | Stage 14 지식·강의 모델                | Accepted                      | 새 CMS type은 `knowledge`와 `lecture`. Archive/DeepDive는 새 type이 아니며 기존 Markdown 114개를 이전하지 않는다. 강의는 대표 기반 지식을 필수 참조하되 본문/version은 지식과 독립                           |
| D-53  | Stage 16 Knowledge 공개·발행 계약      | Accepted                      | 기본 필드는 title/slug/summary/body/tags/references. tags/references는 version payload로 immutable 보존하고 public canonical은 `/knowledge/{slug}`. published pointer 없는 Draft는 공개 조회 금지            |

## 3단계 표본 기반 결정 이력

아래는 실제 표본 분석으로 좁힌 권고안이며 사용자가 승인하기 전 최종 정책이나 물리 schema가 아니다.

| ID        | 추천         | 상태                | 근거/결과                                                        |
| --------- | ------------ | ------------------- | ---------------------------------------------------------------- |
| D-17~D-24 | Stage 3 제안 | Accepted 2026-07-18 | 위 승인 표로 통합; 물리 schema와 editor product는 승인 범위 아님 |

## 사용자 결정 필요

| ID    | 질문                                                                                | 선택 시점              | 필요한 증거                                              |
| ----- | ----------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------- |
| D-03  | 새 공개 path를 영문(`/knowledge`) 또는 한글로 할지, 기존 URL을 canonical로 유지할지 | IA 구현 전             | Search Console/GA URL 유입, redirect 영향                |
| D-06A | Neon Launch plan과 7일 restore window가 Console에서 실제 활성화됐는지               | production 준비 전     | billing/restore 설정 화면의 사용자 확인                  |
| D-08  | object storage(managed S3-compatible vs MinIO)                                      | media spike 후         | CDN, backup, transform, 월 비용                          |
| D-09  | 인증 방식                                                                           | admin 구축 전          | 계정 수, MFA, vendor/self-host, recovery                 |
| D-10  | 한국어 검색(Postgres FTS vs engine)                                                 | relevance benchmark 후 | test corpus precision/latency/ops                        |
| D-12  | guestbook/issues/music/helix를 보존·archive·제거할지                                | UI migration 전        | 사용량과 제품 적합성                                     |
| D-13  | 구독/분석/오류 모니터링 공급자                                                      | 각 단계 전             | privacy, export, cost, 운영 책임                         |
| D-19A | 기존 Digest anchor와 새 detail URL의 redirect/canonical 전환 시점                   | AI Update 구현 전      | 현재 anchor 유입, 공유/SEO 요구                          |
| D-25A | 실제 OS IME/native keyboard/VoiceOver gate를 통과해 TipTap 관리자 공개를 허용할지   | 사용자 수동 test 후    | [Manual Checklist](EDITOR_MANUAL_TEST_CHECKLIST.md) 결과 |

## 다국어 운영안 비교

| 안                    | 장점                                                                           | 위험                                                               |
| --------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| A. KO/EN 동시 발행    | locale parity와 hreflang 시점 명확                                             | 모든 revision을 두 배 검토; 현재 D3 같은 구조 drift 관리 부담이 큼 |
| B. KO 우선, 선택 번역 | 한국어 품질과 발행 속도에 집중                                                 | 영어 coverage 불균일, 기존 영어 독자 기대 관리 필요                |
| C. 유형별 범위 분리   | 유입/가치가 큰 Knowledge만 번역하고 빠른 AI Update는 KO 중심 등 운영 현실 반영 | 정책 설명과 type별 workflow 필요                                   |

**승인: C**. Knowledge evergreen/핵심 Course는 선택적 EN, 빠른 AI Update와 초기 Practice는 KO 우선으로 운영하고 성과·인력에 따라 확대한다. 기존 EN 57개는 보존한다. AI 번역은 draft만 생성하고 사람 검토를 필수로 하며 source version이 바뀌면 번역을 `outdated`로 표시한다. canonical/hreflang은 실제 published locale만 선언한다.

## CLAUDE.md 처리

현재 내용은 과거 “검증 아카이브/Studio 분리” 방향으로 새 비전과 충돌한다. 유지할 규칙은 기존 URL·콘텐츠 보호, TypeScript/Tailwind, light editorial·responsive 원칙이다. 이는 `AGENTS.md`로 이동했다. 제품/IA/디자인 상세는 docs로 이동했다. 검색 금지, 강의 분리, 과거 header/home 구조는 폐기한다. 파일은 이번 단계에서 삭제·수정하지 않고 **deprecated 후보**로 남기며, 다음 승인 단계에서 상단 경고만 추가하거나 보관한다.

# D-54 — Knowledge Publish는 immutable version pointer를 사용한다 (Stage 17)

Knowledge Publish는 current draft version을 복제하지 않고 `current_published_version_id`가 그 immutable version을 가리키게 한다. pointer 갱신과 `published` revision event는 owner membership을 다시 확인하는 하나의 transaction이다. Publish 이후 slug는 redirect 정책이 준비될 때까지 잠근다. 공개 `/knowledge` 조회는 published pointer만 join하며 legacy Archive/Deep Dive renderer와 분리한다.

## D-55 — Knowledge 공개 UI는 문서 인덱스다 (Stage 18)

`/knowledge`는 published Knowledge만 표시하는 제목 중심의 기록 인덱스이며, `/knowledge/{slug}`는 읽기 폭 중심의 단일 문서다. 기존 라이트 토큰과 Header/Footer를 재사용하고 Archive/Deep Dive의 renderer·URL·정보 구조와 섞지 않는다.

## D-56 — 공개 메뉴는 실제 route만 사용한다 (Stage 19)

주 메뉴와 Footer는 Knowledge, Deep Dive, AI Updates, Book, About을 사용한다. Archive는 legacy URL과 Markdown 보존을 위해 유지하지만 주 메뉴에서 Knowledge와 중복하지 않는다. Projects route는 현재 없으므로 placeholder를 만들지 않는다.

## D-57 — Lecture는 공개 강의 설계 자료다 (Stage 20)

Dechive의 Lecture는 유료 온라인 강의 상품이 아니다. 운영자가 자신의 지식을 다른 사람에게 설명할 때 사용하는 강의 설계와 공개 강의 자료다. 모든 Lecture는 공개 열람을 전제로 하며 회원, 결제, 진도, 수료 기능을 제품 범위에 포함하지 않는다.

## D-58 — Lecture Draft metadata의 mutable/immutable 경계 (Stage 21)

audience와 estimated duration은 최신 강의 설계 metadata로 `lecture_details`에 둔다. coreMessage와 references는 immutable version metadata에 둔다. Stage 22 Publish는 learning objectives와 coreMessage를 필수 readiness 조건으로 사용한다.

## D-59 — Lecture Publish는 published version pointer와 공개 전용 query를 사용한다 (Stage 22)

Lecture Publish는 현재 immutable Draft version을 복사하지 않고 `current_published_version_id`가 가리키도록 한다. owner membership 재검증, readiness, primary Knowledge kind, canonical route ownership, pointer 변경과 published revision event는 한 transaction이다. `/lecture`와 `/lecture/{slug}`는 published pointer만 조회하며 unpublished primary Knowledge와 Draft metadata를 공개하지 않는다. Header/Home/Footer 연결은 Stage 23으로 분리한다.

## D-60 — Lecture는 기존 공개 navigation의 독립 진입점이다 (Stage 23)

공개 navigation과 Footer는 Knowledge, Lecture, Deep Dive, AI Updates, Book, About 순서를 공유한다. Homepage는 Knowledge가 무엇을 알아야 하는지를, Lecture가 타인에게 어떻게 설명하는지를 구분해 `/lecture`로 연결한다. Archive는 legacy URL 호환으로 유지하되 주 메뉴로 복귀하지 않는다. sitemap은 published Lecture pointer만 포함한다.
