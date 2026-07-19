# Stage 17 Knowledge Publish 및 Public Renderer

이 문서는 Knowledge의 Draft/Published 경계와 최소 공개 조회의 현재 기준 문서다. Stage 16의 [Knowledge Publish Contract](./16_KNOWLEDGE_PUBLISH_CONTRACT.md)를 구현 기준으로 구체화한다.

## Publish transaction

Publish는 owner 인증 Server Action만 호출할 수 있다. Server Action은 same-origin session을 확인하고, service transaction 안에서 owner membership을 다시 확인한다.

한 PostgreSQL transaction에서 다음을 수행한다.

1. Knowledge localization과 current draft version을 `FOR UPDATE`로 잠근다.
2. current draft version의 immutable document와 version metadata로 publish readiness를 검사한다.
3. blocking error가 없으면 `current_published_version_id`를 current draft version ID로 갱신한다.
4. `revision_events`에 `published` event와 actor, 이전 published pointer, warning을 기록한다.
5. 어느 단계든 실패하면 rollback하며 기존 published pointer는 유지한다.

Draft document를 복사하거나 수정하지 않는다. Publish는 immutable version을 pointer로 선택하는 작업이다.

## Draft와 Published 분리

- Draft save는 immutable version과 `current_draft_version_id`만 갱신한다.
- Draft save는 published pointer와 public cache를 변경하지 않는다.
- Publish 전에는 slug를 바꿀 수 있다.
- 하나라도 Publish된 Knowledge는 server와 editor 모두 slug 변경을 거부한다. Redirect 정책은 아직 구현하지 않는다.
- version별 title, slug, summary, tags, references는 `content_versions.migration_metadata.knowledge`에 snapshot으로 저장한다.

## Public query contract

공개 서비스는 관리자 Draft service와 분리돼 있다.

- 목록 `/knowledge`: `contents.kind='knowledge'`, `route_scope='knowledge'`, `current_published_version_id IS NOT NULL`만 조회한다.
- 상세 `/knowledge/{slug}`: slug와 `current_published_version_id`를 직접 join한다.
- title, summary, document, tags, references는 published version에서 읽는다.
- current draft pointer, admin preview, `content_routes.route_type='cms_draft'`는 공개 조회 근거가 아니다.
- 존재하지 않거나 미발행이면 404다.

기존 `/archive`, `/deep-dive` 및 Markdown renderer는 이 경로와 독립적으로 보존된다.

## Cache revalidation

공개 목록은 5분 revalidation을 사용한다. Publish 성공 Server Action은 `/knowledge`와 해당 `/knowledge/{slug}`을 명시적으로 revalidate한다. 따라서 Draft save만으로 공개 route가 변경되지 않으며 Publish 후에는 즉시 갱신 대상이 된다.

## Stage 18 준비

- 공개 UI의 정보 구조와 접근성 개선
- published slug redirect 정책과 migration 설계
- Knowledge 목록 탐색/검색은 별도 결정 후 추가
- Lecture publish/public renderer는 Stage 17 범위 밖
