# Implementation Roadmap

- **Status:** Proposed phased roadmap
- **Last Updated:** 2026-07-18
- **Authority:** 구현 순서·완료·rollback 기준
- **Purpose:** 최종 구조 전체를 정의하되 의존성과 데이터 위험으로 실행을 나눈다.

## Stage 24 상태

공개 구조를 Knowledge, Lecture, Practice, AI Update, Books로 재설정했다. legacy Archive/Deep Dive/기존 AI Updates/Book/Library 및 영어 legacy URL은 이전·redirect하지 않고 410으로 정리한다. Practice, AI Update, Books는 CMS 설계 전 foundation route만 제공한다.

## Stage 7 완료 상태

PostgreSQL/Drizzle physical prototype, immutable revision/artifact, route/source/media/relation schema, atomic publish와 local integration tests를 완료했다. 남은 gate는 production provider/restore drill, auth/RBAC, scheduler, CMS 연결, legacy dry-run, 실제 장비 editor checklist다.

## Stage 8 완료 상태

Knowledge/AI Update 제한 importer, legacy identity/idempotency, repository/service query, read-back export, Digest 분해, scheduled job/authorization 논리 schema를 완료했다. 다음 gate는 Neon region 측정과 project provisioning 승인, import 표본 확대 기준, authentication library 조사, 실제 editor 장비 검증이다. 공개 renderer와 전체 migration은 계속 금지한다.

## Stage 9 상태

Singapore 운영 기준, 22-localization manifest, Issues projection, local logical/portable backup과 clean restore rehearsal을 완료했다. 당시 cloud 실행은 credential 없이 local evidence로 분리했다.

## Stage 10 상태

Item 단위 atomic importer, `partial_failure`, 여섯 failure injection과 failed-item retry를 Neon staging에서 재검증했다. Direct migration `0000..0003`, second-run no-op, 18 identity/22 localization, repeat/change detection, pooled repository query, logical/portable backup, isolated local restore, local→Singapore latency를 완료했다. Production은 untouched다. 남은 gate는 Vercel `sin1`, 전용 `preview-base`, Neon temporary restore branch rehearsal, backup encryption/storage/retention automation, TipTap OS/device 수동 test다.

## Stage 12B 상태

단일 email owner 로그인, 회전하는 12시간 서명 session, production secure/httpOnly/sameSite cookie, DB allowlist·owner membership 기반 route/Server Action/service guard를 구현했다. 기존 GA analytics는 같은 owner session을 재사용한다. 다중 사용자, 가입, OAuth, production DB 쓰기와 공개 renderer 전환은 포함하지 않았다.

## Stage 14 상태

새 CMS의 현재 모델을 지식과 강의로 정렬했다. 지식은 독립 원본 문서, 강의는 대표 지식을 바탕으로 별도 본문/version을 가진 학습 자료다. migration 0004는 `lecture` kind, 강의 detail, 지식 topic/order/검증 metadata를 additive하게 추가한다. Archive/DeepDive는 새 CMS type으로 쓰지 않고 기존 Markdown 114개는 이전하지 않는다. Publish, 공개 renderer, legacy URL은 변경하지 않았다. 현재 권위 문서는 [지식과 강의 콘텐츠 모델](14_KNOWLEDGE_AND_LECTURE_MODEL.md)이다.

## Stage 22 상태

Lecture Publish readiness, owner transaction, published pointer, `/lecture` 목록과 `/lecture/{slug}` 상세 renderer를 구현했다. 공개 query는 published Lecture와 published primary Knowledge만 사용하며 Draft/actor/revision metadata를 노출하지 않는다. Header, Homepage, Footer navigation에는 Lecture를 아직 연결하지 않았고 이는 Stage 23 범위다. Production과 Neon Production은 사용하지 않았다.

## Stage 23 상태

Lecture를 공통 Header/mobile navigation, Homepage, Footer, sitemap에 연결했다. 공개 동선은 Home → `/lecture` → published detail이며 Draft slug는 public 404로 유지된다. Archive/Deep Dive 및 영어 legacy route는 보존한다. Vercel Preview QA는 Preview target만 사용하며 Production은 사용하지 않는다.

## 공통 gate

각 단계는 ADR/결정, 예상 파일 목록 확정, lint/build+관련 test, data/URL diff, rollback rehearsal를 PR 완료 조건으로 둔다. 아래 파일은 예상이며 구현 전 현재 tree로 재확인한다.

## Stage 11 상태

로컬 Archive Knowledge 한 유형에 한해 `/admin` 목록·작성·편집·Draft preview 수직 흐름을 구현했다. Docker PostgreSQL의 단일 service transaction, immutable version, current draft pointer, route conflict, rollback fixture를 자동 검증한다. Neon과 공개 renderer는 연결하지 않으며 production route는 404 guard를 유지한다. 실제 업무 전환 gate는 [TipTap 수동 checklist](TIPTAP_MANUAL_TEST_CHECKLIST.md)다.

### 0. 기준선과 오래된 구조 정리

- 목표: docs 승인, route/content/dependency manifest와 회귀 기준 확보.
- 예상: `docs/**`, audit scripts/tests; 삭제 없음.
- 선행: 현재 문서 승인. 완료: inventory checksum·URL list·visual captures.
- 테스트: content check/lint/build/crawl. 위험: 낮음. 롤백: docs/script revert. 관계: 모든 단계 gate.

### 1. 라이트 디자인 시스템과 shell — 완료 (2026-07-18)

- 목표: tokens, typography, header/footer, responsive shell을 새 IA에 맞춤.
- 예상: `globals.css`, `layout.tsx`, `components/layout/**`.
- 선행: D-03 path, 디자인 승인. 완료: dark class/token/toggle 제거, WCAG/3 viewport 회귀.
- 테스트: lint/build/a11y/visual. 위험: 레거시 화면의 자체 dark palette가 남아 있어 화면별 후속 이전 필요. 롤백: 이전 layout/global shell 복원. 관계: main과 상세 UI 기반.

### 2. 메인페이지 — 완료 (2026-07-18)

- 목표: 확정 hero, 4개 진입, featured, Dechive 이야기, subscription shell.
- 예상: `app/page.tsx`, `components/home/**`.
- 선행: 1, 실제 route/data adapter. 완료: 더미 수치 없이 responsive/SEO.
- 테스트: lint/build, 390/768/1280 browser, metadata. 강의·실습·검색·구독·후원은 존재하지 않는 URL 대신 접근 가능한 준비 상태로 처리. 위험: 새 콘텐츠 route가 생기면 임시 연결 교체 필요. 롤백: 기존 home restore. 관계: 공개 진입점.

### 3A. 콘텐츠 모델 검증 — 완료 (2026-07-18)

- 목표: 실제 Archive 5쌍, Deep Dive 4쌍, Book 3, AI Update 5일, Issue 4의 구조로 Knowledge/Course/Practice/Update와 relation 경계를 검증.
- 변경: docs와 sample mapping만. 애플리케이션/데이터/package 변경 없음.
- 완료: Deep Dive/Book 후보 mapping, sample Course 1, Practice 3, Update 혼합 모델, DB 대안 3개, 관계 10개 이상, revision/translation 정책 문서화.
- 테스트: 실제 파일 parse와 `git diff --check`. 위험: 표본 밖 legacy edge case가 남음. 롤백: docs revert. 관계: D-17~D-22 사용자 승인과 editor/DB spike의 입력.

### 3B. 콘텐츠 모델·PostgreSQL 결정

- 목표: schema/repository/migration tooling 확정.
- 예상: schema/migrations, `lib/content/**`, env validation, Compose(선택).
- 선행: D-17~D-22 모델 결정, D-06/ORM spike. 완료: A2/A3/D2/D3 round-trip, version/source/relation/locale transaction test, dump/restore.
- 테스트: migration/integration/restore. 위험: schema lock-in/data loss. 롤백: DB 미연결, migration down/restore. 관계: editor와 모든 유형.

### 4. 미디어 시스템

- 목표: upload/original/variant/metadata/backup.
- 예상: media service/routes/admin UI/jobs/storage config.
- 선행: 3, D-08. 완료: sample upload→variant→render→restore, rights/alt validation.
- 테스트: MIME/security/image/backup. 위험: 원본 손실·비용. 롤백: 기존 public images read. 관계: editor/content.

### 5. 관리자 인증과 editor

- 목표: secure roles, draft/autosave/preview/review/publish/history.
- 예상: `app/admin/**`, auth/editor/services.
- 선행: 3~4, D-07/D-09. 완료: knowledge/course/lesson/practice/update round-trip+rollback.
- 테스트: authz/CSRF/session/editor export/E2E. 위험: draft 노출·revision 손실. 롤백: admin disable, DB published pointer restore. 관계: 운영 전환.

선행 gate(완료): Stage 4는 격리 fixture로 neutral document round-trip을 검증하고 TipTap 1순위 prototype과 DechiveDocument canonical 후보를 권고했다. 다음 변경 예상은 production app이 아닌 isolated adapter spike이며, 완료 기준은 8개 fixture provider↔neutral 구조 보존, 100k자/IME/a11y/hydration 측정이다. 실패 시 패키지와 spike를 제거하고 Lexical로 반복한다. 이 gate 전 CMS 연결과 물리 body schema migration을 만들지 않는다.

Stage 5 runtime gate(조건부 완료): 개발 전용 lab에서 React 19/Next 16, 실제 101k자 fixture, custom node, JSON/HTML/Markdown, composition-aware autosave, unknown publish block, 390/768/1280을 검증했다. 다음 단계는 CMS가 아니라 table export·OS IME/native keyboard·screen reader·paste·sanitization·schema migration 보강이다. 완료 기준은 해당 회귀 test와 제거 가능한 adapter 경계이며, 실패 시 TipTap package/lab을 제거하고 Lexical spike로 롤백한다.

Stage 6 security/migration gate(자동화 완료): input allowlist, malicious/paste fixtures, draft/publish validator, deterministic v1→v2, GFM/HTML table export, audit High 제거를 검증했다. 남은 선행 조건은 사용자 수동 macOS Chrome/Safari IME, iPhone keyboard, VoiceOver checklist다. 심각한 문제가 없으면 TipTap을 Stage 5 관리자 editor 구현에 사용하며, 실패 시 canonical schema는 유지하고 TipTap adapter만 제거해 Lexical로 반복한다.

### 6. 지식·강의·실습·AI 업데이트

- 목표: 최종 공개 type별 list/detail과 관계/출처/확인일/history.
- 예상: `app/{knowledge,courses,practice,ai-updates}/**`, shared content UI.
- 선행: 1,3~5. 완료: 각 유형 최소 실제 sample과 accessibility/SEO; course ordering/practice result 검증.
- 테스트: repository/component/E2E/structured data. 위험: type 요구 누락. 롤백: type별 route flag, legacy read. 관계: 검색/이전.

### 7. 검색

- 목표: 통합 한국어 검색과 filters.
- 예상: `app/search`, search adapter/indexer.
- 선행: 3,6,D-10. 완료: relevance set/zero result/latency 기준 통과, rebuild 가능.
- 테스트: relevance/integration/E2E. 위험: 잘못된 노출·index drift. 롤백: search disable/reindex. 관계: AI retrieval.

### 8. 공유·이메일·분석·SEO

- 목표: Web Share/fallback/event, double opt-in, analytics, canonical/sitemap/RSS/Search Console.
- 예상: shared controls, event/subscription routes, metadata builders.
- 선행: 6, provider decisions. 완료: device fallback, consent/unsubscribe/export, URL crawl.
- 테스트: browser/E2E/webhook/security/crawl. 위험: 개인정보·SEO 유실. 롤백: event/subscription flag, legacy sitemap/feed. 관계: 성장/운영.

### 9. AI 제작 보조와 내부 답변

- 목표: approval 기반 초안 도구, 이후 citation answer.
- 예상: AI adapter/prompts/evaluations/admin UI.
- 선행: 5,7, policy/provider 결정. 완료: evaluation set, audit, cost/rate/privacy guard, no auto-publish.
- 테스트: provider contract/prompt injection/citation/human approval. 위험: 유출·환각·비용. 롤백: provider kill switch. 관계: 운영 효율.

### 10. Docker·배포·백업·모니터링 강화

- 목표: 재현 가능한 local/staging, safe migrations, restore, error/uptime alerts.
- 예상: Compose/Docker(승인 시), CI, runbooks, Sentry/Uptime config.
- 선행: 실제 services 확정. 완료: fresh setup, staging restore, deploy rollback, alert drill.
- 테스트: CI/smoke/restore/incident drill. 위험: secret/운영 복잡도. 롤백: managed service/Vercel 기존 deploy. 관계: migration launch gate.

### 11. 기존 콘텐츠·이미지·URL 이전

- 목표: 모든 legacy record를 검증 이전하고 public read 전환.
- 예상: importers/manifests/redirects, legacy adapters.
- 선행: 3~8, backup/monitoring. 완료: [Migration Plan](13_MIGRATION_PLAN.md)의 count/hash/render/link/SEO/restore 기준 통과.
- 테스트: dry-run, parity crawl, visual diff, production canary. 위험: 데이터·검색 유입 손실. 롤백: read flag를 legacy로, DB batch 격리. 관계: legacy 제거 전제.

### 12. legacy 제거

- 목표: 검증된 중복 코드/의존성/Markdown canonical/submodule pipeline 제거.
- 예상: loaders/scripts/config/dependencies와 승인된 old UI.
- 선행: 안정화 기간, analytics/404, restore 승인. 완료: no reference, export/backup, lint/build/tests.
- 테스트: full suite/crawl/bundle/dependency audit. 위험: 숨은 route/content 손실. 롤백: tagged release와 backup. 관계: 전환 종료.
