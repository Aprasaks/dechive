# Stage 22 Lecture Publish and Public Renderer

Lecture는 운영자가 지식을 다른 사람에게 설명하기 위해 만든 공개 강의 설계 자료다. 수강 코스, 결제 상품, 회원 전용 콘텐츠가 아니다. 이 단계는 `/lecture`와 `/lecture/{slug}`의 published-only 조회를 구현하며 Header·홈페이지·Footer 연결은 Stage 23으로 남긴다.

## Publish readiness

Publish는 Draft 저장과 분리된다. 다음은 blocking 조건이다.

- title, slug, summary와 실제 텍스트가 있는 TipTap body
- 하나의 primary Knowledge와 `contents.kind='knowledge'` 검증
- learning objective 최소 하나
- 공백이 아닌 coreMessage
- immutable references의 기존 validation 통과

audience, estimated duration, difficulty, checkpoints, recommended order는 선택값이다. Draft 저장은 이 readiness를 강제하지 않는다.

## Transaction and pointer

owner Server Action은 same-origin session을 확인하고 service transaction 안에서 owner membership을 다시 확인한다. transaction은 Lecture localization/current Draft를 `FOR UPDATE`로 잠그고, canonical `/lecture/{slug}` route ownership과 readiness·primary Knowledge kind를 확인한 다음 current draft version을 `current_published_version_id`로 설정한다. 이어 `published` revision event와 actor를 기록한다. 중간 실패는 rollback되어 기존 pointer와 event가 유지된다.

Publish는 version을 복사하지 않는다. immutable Draft version을 pointer가 가리킬 뿐이다. 이후 Draft 저장은 새 version과 draft pointer만 바꾸므로 이전 공개본은 유지되고, ready Draft를 다시 Publish하면 pointer가 이동한다. 첫 Publish 뒤 slug 변경은 Knowledge와 동일하게 server/editor에서 잠긴다.

Lecture version metadata `lecture`에는 title, slug, summary, coreMessage, references snapshot을 둔다. 따라서 공개본의 title/summary/coreMessage/references도 Draft의 이후 수정과 분리된다. `lecture_details`의 audience/duration 등은 Stage 21의 mutable metadata 계약을 유지한다.

## Public contract

- 목록 `/lecture`: `contents.kind='lecture'`, canonical `/lecture/{slug}` route와 non-null published pointer만 사용하며 최신 published version 순으로 정렬한다.
- 상세 `/lecture/{slug}`: 같은 published pointer를 직접 join한다. Draft slug, 없는 slug, 다른 kind는 not found다.
- Draft service, draft pointer, actor/revision data, owner membership은 public payload에 포함하지 않는다.
- primary Knowledge가 published 상태이고 canonical `/knowledge/{slug}` route를 가질 때만 공개 링크와 제목을 보인다. unpublished primary Knowledge의 제목·ID·관리 정보는 숨긴다.
- references는 published version metadata에서 순서를 보존해 렌더링하고 외부 링크는 `target=_blank`와 `rel=noopener noreferrer`를 쓴다.

목록과 상세는 5분 revalidation을 사용한다. Publish Server Action은 `/lecture`와 `/lecture/{slug}`만 revalidate한다. Draft save는 공개 route를 revalidate하지 않는다.

## SEO and UI

목록은 canonical `/lecture`, 상세는 `/lecture/{slug}`와 published title/summary 기반 Open Graph metadata를 사용한다. unpublished content는 metadata를 생성하지 않고 notFound 계약을 따른다. 공개 상세는 title, summary, core message, 선택 metadata, objectives, 공개 가능한 primary Knowledge, TipTap body, checkpoints, references 순으로 보인다.

## Verification

`npm run verify:lecture-publish`는 local `dechive_test`만 reset/migrate하여 readiness, pointer v1→v2, rollback, primary Knowledge 공개 처리, Draft public isolation, slug lock, actor/revision event와 membership guard를 확인한다. Production과 Neon Production은 사용하지 않는다.

## Stage 23

Stage 23은 public Lecture를 Header, Homepage, Footer와 sitemap에 연결했다. Publish transaction, data model, public query contract, legacy Archive/Deep Dive는 변경하지 않았다.
