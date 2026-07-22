# Knowledge 공개 및 발행 계약

- **Status:** Approved contract; Knowledge Publish와 public renderer의 현재 media slice 구현 완료
- **Last Updated:** 2026-07-22
- **Authority:** Knowledge 작성 필드, version payload, 공개 URL, 발행 준비 규칙의 현재 기준

이 문서는 새 CMS Knowledge의 canonical 계약이다. [지식과 강의 콘텐츠 모델](14_KNOWLEDGE_AND_LECTURE_MODEL.md), [Content System](04_CONTENT_SYSTEM.md), [Database Schema](07_DATABASE_SCHEMA.md), [Editor and Admin](08_EDITOR_AND_ADMIN.md)의 Knowledge 필드나 Archive/Deep Dive 설명과 충돌할 경우 이 문서를 따른다.

## 작성 필드

운영자가 기본 Knowledge editor에서 작성하는 필드는 다음 여섯 가지다.

- `title`: 필수 제목
- `slug`: 소문자 영문·숫자·하이픈으로 구성한 필수 경로 segment
- `summary`: 필수 요약
- `body`: 필수 DechiveDocument 본문
- `tags`: 선택 문자열 배열
- `hero`: 선택 `mediaId`, 필수 `alt`, 선택 `caption`; hero usage 하나로 OG/Twitter/Article image에 재사용

본문 `figure`는 내부 `mediaId`와 필수 `alt`를 가져야 하며, 선택적으로 `caption`을 가진다. 새 업로드는 `media_assets`에 저장하고 해당 immutable version의 `media_usages`에 `hero` 또는 `body`로 연결한다.

locale는 신규 Knowledge에서 현재 `ko`를 기본값으로 사용하고 기존 Draft의 값을 유지한다. immutable version, draft/published pointer, timestamp, actor, revision event는 CMS가 자동 관리한다.

## 기존 참고문헌 데이터 호환

기존 Knowledge version의 참고문헌 payload와 기존 참고문헌 테이블은 호환성을 위해 보존한다. 현재 Knowledge 작성·발행 UI는 참고문헌을 입력하거나 요구하지 않으며, 사용자는 본문에 직접 링크를 작성한다. 새 version을 저장하면 새 version의 참고문헌 payload는 빈 배열이 되지만 과거 immutable version의 데이터는 변경하지 않는다.

과거 payload의 항목은 `type, title, authorOrOrganization, url, accessedAt, note`를 가진다. API/DB JSON의 camelCase 이름은 UI의 `author_or_organization`, `accessed_at` 의미와 같다.

- `type`: `external | direct_verification`
- `title`: 항상 필수, 최대 200자
- `authorOrOrganization`: 선택, 최대 200자
- `url`: external에서 필수, HTTP(S), 최대 2048자
- `accessedAt`: 선택 `YYYY-MM-DD`
- `note`: direct_verification에서 필수, 최대 2000자
- 최대 20개이며 빈 항목은 저장하지 않는다.

`external`은 외부 논문·공식 문서·책·보고서·웹 자료다. `direct_verification`은 운영자가 직접 실행·테스트·재현·관찰한 기록이다. 기존 normalized `sources/content_sources`는 legacy/import 및 향후 source projection용으로 남기며 새 기본 editor 참고문헌의 canonical 저장소가 아니다.

## 태그

태그는 `content_versions.migration_metadata.knowledge.tags`에 입력 순서대로 저장한다. 저장 전 trim, 빈 문자열 제거, 첫 항목을 유지하는 중복 제거를 적용한다. 최대 12개, 항목당 최대 40자다. 별도 taxonomy는 만들지 않는다. `knowledge_details.concepts`는 현재 Draft 목록 호환을 위한 mutable projection이며 과거 version의 canonical 태그가 아니다.

## legacy metadata 호환

`topic`, `recommended_order`, prerequisite/related relation, `verification_metadata`는 migration 0004 호환을 위해 DB에서 삭제하지 않는다. 기본 editor에는 노출하지 않고 Knowledge 저장 시 해당 컬럼과 관계를 update하지 않는다. 기존 값이 있으면 편집 화면에 보존 안내만 표시하며 읽기와 본문 수정이 가능하다.

## Draft와 Published

- Draft save는 새 immutable `content_versions` row를 만들고 current draft pointer만 이동한다.
- Draft save는 current published pointer를 자동 이동하지 않는다.
- version 2가 만들어져도 version 1과 version 1의 tags/references는 보존된다.
- Publish는 별도 명시적 owner Server Action으로만 요청한다.
- Publish 성공 transaction은 선택한 version으로 published pointer를 이동한다.
- validation, artifact 또는 transaction이 실패하면 published pointer를 변경하지 않는다.
- public read contract는 `current_published_version_id IS NOT NULL`이고 그 pointer로 join되는 Knowledge만 반환한다. draft route record나 current draft pointer만으로 공개하면 안 된다.

현재 CMS의 `content_routes.route_type='cms_draft'` row는 slug 충돌과 향후 canonical 경로 예약을 위한 내부 record다. 공개 여부를 의미하지 않는다. 관리자 preview는 `/admin/knowledge/{localizationId}/preview`이고 owner 인증이 필요하다.

## 공개 URL

- 목록 canonical URL: `/knowledge`
- 상세 canonical URL: `/knowledge/{slug}`

새 Knowledge는 `/archive/{slug}` 또는 `route_scope='archive'`를 사용하지 않는다. 현재 `/archive/**`는 기존 Markdown renderer의 legacy URL이며 새 CMS와 암묵적으로 연결하지 않는다. `/knowledge` public route는 published pointer와 version media usage를 사용한다.

미발행 slug가 `/knowledge/{slug}`용 route record를 가져도 public query는 published pointer가 없으면 반드시 null/404를 반환해야 한다. `getPublishedKnowledgeContract`가 이 최소 DB guard를 코드로 고정한다.

slug는 첫 Publish 전 변경할 수 있다. Published Knowledge의 slug 변경은 기존 URL 보존, redirect/alias 생성, canonical·sitemap·feed 갱신을 하나의 transaction/배포 경계로 다뤄야 한다. 이 정책이 구현되기 전에는 published slug 변경을 허용하지 않는 것이 Stage 17의 안전한 기본값이다.

## 발행 준비 validation

blocking errors와 non-blocking warnings를 분리한다.

Blocking:

- title, slug, summary, body 중 하나가 없음
- document publish validation의 error/review issue
- 이미지 `figure`의 내부 media identity 또는 필수 alt가 없음
- 연결된 media asset이 승인되지 않음

Warnings:

- tags가 없음 (`tags_missing`)
- document validator의 warning issue

태그 없음은 Publish를 차단하지 않는다. 참고문헌도 Publish 조건이 아니다. `validateKnowledgePublishReadiness`는 결과를 `{ blockingErrors, warnings, ready }`로 반환하고, 실제 Publish 시 media 승인 상태와 alt를 다시 검증한다.

## 상태와 날짜

Knowledge의 `content_localizations.workflow_status`는 `draft`, `published`, `withdrawn`, `archived` 중 하나다. 발행된 version row는 immutable로 보존하고, 발행 취소와 보관은 공개 pointer와 Knowledge 상태만 변경한다. 발행 후 편집은 새 Draft version을 만들며 현재 공개 pointer는 새 version을 발행할 때까지 유지한다.

- 작성일: 최초 Draft를 만든 `contents.created_at`
- 발행일: 해당 Knowledge의 최초 `content_versions.published_at`
- 최종 수정일: 현재 공개 version의 `content_versions.published_at`

발행되지 않은 문서는 관리자와 미리보기에서 `아직 발행되지 않음`으로 표시한다.

## Stage 17 준비사항

- owner-only Publish Server Action과 service authorization 재검증
- 선택 version lock 및 readiness 재검증
- 세 가지 immutable artifact 생성과 실패 rollback
- published pointer atomic 이동 및 기존 published version 보존
- `/knowledge`와 `/knowledge/{slug}`의 published pointer·media usage renderer 회귀 검증 및 전체 SEO crawl
- draft/preview cache 분리와 404/robots/canonical/SEO 검증
- published slug 변경 금지 또는 redirect transaction 구현
- staging backup, failure injection, redeploy/cold-start 회귀
