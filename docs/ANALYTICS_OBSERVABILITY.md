# Dechive Analytics Observability

- **Status:** Phase 1 implemented
- **Authority:** Dechive visitor measurement and learning-flow event contract
- **Scope:** Public event collection only; admin reporting and external adapters follow later

## 운영 원칙

Dechive의 방문자 행동 데이터 원천은 자체 Postgres에 둔다. GA4, Search Console, Cloudflare, Clarity, PostHog는 각각 유입·검색·엣지·정성 관찰·분석 보조 역할을 맡으며 원본 학습 이벤트를 소유하지 않는다.

`revision_events`는 관리자 콘텐츠 변경 감사 로그이므로 방문자 분석에 재사용하지 않는다.

## 이벤트 이름

### 콘텐츠

`content_open`, `content_progress`, `content_complete`, `internal_link_click`, `share_complete`, `file_download`

`content_progress`는 `metadata.progress`에 `25`, `50`, `75`, `90`, `100` 중 하나를 저장한다.

### 학습

`lecture_start`, `lecture_complete`, `practice_start`, `practice_complete`

시작과 완료를 분리해 진입 퍼널과 완료 퍼널을 섞지 않는다.

### 검색

`search_submit`, `search_result_click`, `search_zero_result`

검색어는 `metadata.query`에 저장할 수 있지만, 수집·보존 기간과 개인정보 정책을 별도로 적용한다.

### 책·구매

`book_preview_open`, `book_purchase_click`, `purchase_start`, `purchase_complete`

실제 결제 확인 전에는 `purchase_complete`를 임의로 발생시키지 않는다.

### 오류

`error_404`, `error_500`, `client_error`, `api_error`

브라우저 JavaScript 오류와 API 오류를 하나의 이벤트로 합치지 않는다.

## 공통 필드

```text
event_id, event_name, occurred_at
session_id, anonymous_id, page_view_id
content_type, content_id, route, landing_route
referrer_source, referrer_url
utm_source, utm_medium, utm_campaign, utm_content, utm_term
metadata, consent_state, schema_version
```

- `event_id`: 재시도 중복을 막는 클라이언트 UUID
- `session_id`: 30분 활동 공백 기준의 세션 UUID
- `anonymous_id`: 브라우저 단위 익명 UUID. 사용자를 의미하지 않는다.
- `page_view_id`: 같은 세션에서 같은 콘텐츠를 다시 연 방문을 구분하는 UUID
- `content_id`: 자주 조회하므로 JSON metadata가 아닌 고정 필드에 저장한다.
- `landing_route`: 현재 route와 분리한 최초 진입 경로
- `schema_version`: 이벤트 구조 변경을 위한 버전

## 서버 경계

`POST /api/analytics/events`는 다음을 적용한다.

- 요청 본문 64KiB, 요청 이벤트 50개 제한
- UUID, route, event name, timestamp, consent, metadata 검증
- metadata 16KiB 제한과 prototype-significant key 거부
- 이벤트 UUID unique 처리로 재시도 중복 제거
- 세션당 분당 120개 이벤트 rate limit
- 명시적 cross-origin 요청 거부
- 알려진 bot user-agent 무시
- `consent_state=denied` 이벤트 저장 금지

현재 수집 API는 준비됐지만 브라우저 계측은 별도 단계에서 consent·session 정책과 함께 연결한다. `unknown` 상태를 임시로 허용하는 것은 계약 호환성을 위한 것이며, 실제 공개 계측 전 정책을 확정한다.

## 완료 판정 초안

`content_complete`는 단순한 최하단 도달과 동일하지 않다. 초기 계측 기준은 본문 90% 도달과 활성 체류 30초 이상이며, 이후 콘텐츠 길이·예상 읽기 시간에 따라 보정한다.

## AI 유입 구분

- **AI referral:** 리퍼러 또는 UTM으로 확인된 유입
- **Suspected AI referral:** 패턴으로 추정한 유입
- **AI citation evidence:** 외부에서 실제 링크·인용을 확인한 별도 증거 데이터

AI prompt는 수집 대상이 아니다. AI citation evidence는 방문 이벤트와 섞지 않고 별도 설계한다.
