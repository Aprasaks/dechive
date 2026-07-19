# Technical Architecture

- **Status:** Proposed target; ADR approval required
- **Last Updated:** 2026-07-18
- **Authority:** 애플리케이션 경계와 기술 선택 기준
- **Purpose:** 특정 제품에 종속되지 않는 목표 구조를 정의한다.

## Stage 7 storage 결정

콘텐츠 저장 prototype은 PostgreSQL 17, Drizzle ORM/Kit, reviewed SQL migration을 사용한다. 공개 앱 import graph에는 연결하지 않았다. [PostgreSQL Decision](POSTGRESQL_DECISION.md)과 [Database Implementation](DATABASE_IMPLEMENTATION.md)을 따른다. Guestbook Supabase와 콘텐츠 DB는 별도 경계다.

## Stage 8 repository/import 경계

Neon을 production provider로 선정했지만 cloud 연결은 없다. UI/API → domain service → repository → PostgreSQL 순서를 적용하며 공개 route는 DB를 호출하지 않는다. 제한 표본 importer와 read-back은 [Legacy Importer](LEGACY_IMPORTER.md), repository/service는 [Repository and Service](REPOSITORY_AND_SERVICE.md)가 권위다.

## 권장 기준 구조

Next.js App Router 단일 애플리케이션을 유지하고, PostgreSQL을 후보 canonical metadata/content/version store로 검증한다. typed repository/service 계층으로 UI를 DB/ORM과 분리한다. 미디어는 S3-compatible object storage, 검색은 PostgreSQL FTS부터 시작 가능한 인터페이스, background job은 실제 비동기 요구가 생길 때 도입한다.

```text
Public/Admin UI → Server services → repositories → PostgreSQL
                                ├─ object storage
                                ├─ search adapter
                                ├─ analytics/events
                                └─ AI provider adapter (approval required)
```

## 기술 원칙

- ORM/query builder는 schema migration, transaction, JSONB, FTS, TypeScript 추론, raw SQL escape hatch를 비교한 뒤 선택한다.
- vendor SDK를 domain code에 직접 퍼뜨리지 않는다. media/search/email/AI/analytics adapter를 둔다.
- Node runtime이 필요한 파일 I/O/이미지/DB 기능과 Edge 호환 route를 구분한다.
- preview/draft/auth는 cache leakage를 막고 published public read는 cache/revalidation 전략을 둔다.

## 현재에서 유지할 것

Next.js App Router, TypeScript strict, Tailwind 4, Metadata API, sitemap/robots/RSS, 기존 Markdown renderer는 migration reader로 유지한다. Supabase guestbook과 GA admin auth는 신규 CMS 구조와 분리해 평가한다.

## 아직 결정하지 않은 것

PostgreSQL host, ORM, editor, object storage provider, search engine, auth, email, monitoring, deployment topology, Docker production 사용 여부. 비교는 [Open Source Evaluation](OPEN_SOURCE_EVALUATION.md), 결정은 [Decisions](DECISIONS.md)에 기록한다.
