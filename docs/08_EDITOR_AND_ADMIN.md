# Editor and Admin

> **Stage 14 현재 기준:** 관리자 작성 흐름은 `/admin/knowledge/**`와 `/admin/lectures/**`다. Archive 작성 UI 및 Course/Module/Lesson builder 설명은 과거 단계 기록이며 [지식과 강의 콘텐츠 모델](14_KNOWLEDGE_AND_LECTURE_MODEL.md)을 우선한다.
>
> Stage 16부터 Knowledge 기본 editor는 title, slug, summary, body, tags, references만 노출한다. 상세 계약은 [Knowledge 공개 및 발행 계약](16_KNOWLEDGE_PUBLISH_CONTRACT.md)을 따른다.

- **Status:** TipTap selected; manual OS release gates pending
- **Last Updated:** 2026-07-18
- **Authority:** 작성·검토·관계·번역·revision 운영 요구 기준
- **Purpose:** 실제 표본이 요구하는 편집 기능을 정의하며 editor를 설치·선정하지 않는다.

## Stage 7 gate와 역할

TipTap은 production editor로 선정됐지만 [수동 검증 체크리스트](EDITOR_MANUAL_TEST_CHECKLIST.md) 통과 전 공개/실무 전환을 차단한다. DB role은 `owner`, `editor`, `reviewer`, `publisher`, `media_manager`다. 인증은 구현하지 않았다.

Stage 11은 localhost 또는 server-only development flag에서만 접근 가능한 Archive Knowledge 수직 흐름을 추가했다. 명시적 Draft 저장은 단일 application service transaction으로 content/localization/immutable version/route/revision event를 생성하고 published pointer를 설정하지 않는다. 수정은 이전 version을 보존하고 current draft pointer만 이동한다. 실제 OS/device 결과는 [Stage 11 TipTap checklist](TIPTAP_MANUAL_TEST_CHECKLIST.md)에서 별도로 관리한다.

외부 로그인 identity와 내부 actor/role membership을 분리하는 정책은 [Authorization Boundary](AUTHORIZATION_BOUNDARY.md)를 따른다. Stage 8 importer draft도 수동 editor gate를 우회해 published 상태로 만들지 않는다.

## 표본 기반 editor 요구

- A2: code 9, table, image 3의 lossless import/export와 alt/caption 관리.
- A3: 60개 이상 heading과 반복 prompt/code block의 outline, anchor, reusable block이 필요.
- D2: 10만 자에 가까운 EN 문서, 표 54 rows, 이미지 5를 다룰 장문 성능과 autosave가 필요.
- D3: KO/EN heading·이미지 구조가 달라도 translation group으로 비교할 수 있어야 함.
- Book: 서지 metadata, 짧은 인용과 locator, internal relation picker가 필요.
- AI Update: source URL/check date, 여러 변화 분리, digest membership과 excluded candidate를 관리해야 함.

## workflow

유형 선택 → 공통 metadata → 유형별 detail → body 작성/import → source/media/relation 연결 → validation → preview → review → schedule/publish → revision/rollback.

Knowledge format/depth는 운영자가 고른다. Course builder는 module/lesson reorder와 미완료 상태를 보여준다. Practice builder는 steps/evaluation/completion mode를 구조화한다. AI Update editor는 개별 change를 먼저 작성하고 Digest에 순서를 정해 포함한다.

## publish readiness

공통: title/summary/slug/locale/status, SEO/canonical, relation validity, media alt/rights, revision summary. 유형별:

- Knowledge: body 존재; coreQuestion/difficulty는 format 정책에 따라 선택.
- Course: audience/objectives와 적어도 하나의 publishable module/lesson; 빈 예정 lesson을 완료처럼 공개하지 않음.
- Lesson: objective, body/required reference, completion criteria.
- Practice: objective, steps, expected outcome, evaluation criteria, completion mode.
- AI Update: 정확한 source, sourceCheckedAt, change/impact, 날짜 granularity.

## relation과 AI 제안

양쪽 content preview, relation direction, inverse 의미, 기존 중복/cycle을 확인하는 relation picker가 필요하다. AI 추천은 `pending` queue에 provenance/confidence/reason을 남기며 운영자 승인 전 공개하지 않는다. `supersedes`, `prerequisite`, `update_affects`는 특히 자동 승인하지 않는다.

## revision·번역 UI

- autosave draft와 published version을 명확히 분리한다.
- field/block diff, revision summary, changed fields, source check change를 표시한다.
- rollback은 새 revision 생성임을 명시한다.
- 번역본에는 source locale/version, translation status(`draft | review | current | outdated`), structural drift를 표시한다.
- 원문 publish가 기존 번역을 자동 덮어쓰지 않고 outdated 표시와 review task만 만든다.

## editor 평가 gate

Stage 5 [runtime prototype](EDITOR_RUNTIME_PROTOTYPE.md)은 React 19/Next 16, 100k자, custom node, JSON restore, composition-aware autosave와 3 viewport를 통과했다. TipTap은 1순위 후보를 유지하지만 production 미승인이다. 다음 gate는 실제 OS IME/native keyboard, screen reader, paste fidelity, GFM table export, sanitization/version migration이다. 실패 시 Lexical로 동일 gate를 실행한다.

Stage 6은 paste/table/sanitization/schema migration gate를 통과해 TipTap을 조건부 production 후보로 승인했다. 실제 OS IME/native keyboard/VoiceOver는 수동 checklist가 필요하다. Draft는 unknown/external media를 `needs_review`로 보존할 수 있지만 publish는 차단한다. 개별 unknown은 콘텐츠 관리자, 구조적 반복은 개발자가 migration으로 해결하며 AI 제안은 자동 적용하지 않는다.

## 인증·보안 경계

Stage 12B는 기존 analytics 인증을 단일 owner email credential로 확장했다. 비밀번호는 server-only bcrypt hash, 세션은 로그인마다 새 nonce를 가진 12시간 HMAC 서명 cookie이며 production에서 `secure`, 항상 `httpOnly`, `sameSite=lax`다. DB의 allowlisted `external_identity`와 `actor_role_memberships.owner`를 route, Server Action, 저장 service에서 재검증하고 revision event와 version creator에 같은 actor를 기록한다. 로그인/로그아웃은 same-origin 요청만 허용한다.

남은 gate는 managed secret 설정, rate limiting, session server-side revocation/MFA/recovery와 preview expiry다. 다중 사용자·회원가입·초대·role UI는 구현하지 않았다.
