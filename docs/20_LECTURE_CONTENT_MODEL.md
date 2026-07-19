# Stage 20 Lecture Content Model

## 정의

Knowledge는 특정 주제의 깊고 넓은 원본 지식 문서다. Lecture는 운영자가 그 지식을 다른 사람에게 어떤 순서와 방식으로 설명할지 정리하는 공개 강의 설계 자료다. 여러 Knowledge를 단순히 묶은 수강 코스가 아니며, 연결 Knowledge는 강의의 근거와 참고 지식이다.

Lecture는 누구나 공개 열람하는 자료를 전제로 한다. 회원, 사용자 계정, 결제, 유료 강의, 수강 신청, 진도율, 수료증, 콘텐츠 잠금, 학생 대시보드, 퀴즈 점수 관리는 영구적으로 제품 범위 밖이다. 댓글도 Lecture 핵심 기능이 아니며 별도 후속 결정이다.

## 현재 구현 조사

- migration `0004_knowledge_and_lectures.sql`은 `content_kind`에 `lecture`를 추가하고 `lecture_details`를 만든다.
- `lecture_details`는 localization ID, `primary_source_knowledge_id`, `learning_objectives`, difficulty, recommended order, checkpoints를 가진다.
- primary source는 `contents(kind='knowledge')`만 가능하며 FK `RESTRICT`, trigger, self-reference 차단으로 보호된다.
- Lecture 본문은 Knowledge와 같은 `content_versions.canonical_document`의 TipTap document다. create/update 모두 immutable version을 만들고 current draft pointer를 갱신한다.
- admin route는 `/admin/lectures`, `/new`, `/{id}/edit`, `/{id}/preview`다. owner action/membership guard를 재사용한다.
- slug는 `/lecture/{slug}` route record로 생성되지만 public `/lecture` renderer와 publish action은 없다. published pointer는 Stage 15 이후 null이다.
- 삭제 UI/service는 없다. Knowledge 삭제는 primary-source FK RESTRICT로 차단된다.
- Stage 15 검증은 Knowledge/Lecture 각각 version 1/2, 독립 본문 보존, 잘못된 type/없는 ID/self-reference 차단, Knowledge 삭제 RESTRICT를 확인했다.

## Lecture 1.0 제안

현재 유지: title, slug, summary, body, primary source Knowledge, learning objectives, difficulty, checkpoints, immutable versions, draft pointer, actor/revision event.

공개 설계 자료에 필요한 목표 모델은 title, slug, summary, audience(선택), duration(선택), objective, coreMessage, body, relatedKnowledge, references다.

현재 `learning_objectives`는 objective의 복수형으로 유지 가능하다. difficulty와 checkpoints는 공개 강의 설계에 유용하므로 제거하지 않는다. `recommended_order`는 코스 순번처럼 보일 위험이 있어 Stage 21에서 UI 기본값 노출 여부만 검토한다.

`primary_source_knowledge_id`는 Lecture 1.0의 필수 대표 related Knowledge로 유지한다. 여러 related Knowledge는 Stage 21에서 기존 content relation을 재사용할 수 있는지 별도 검토하며, 지금은 새 relation table을 만들지 않는다.

references는 Knowledge의 immutable version payload 구조를 재사용하는 것이 우선이다. Lecture version metadata에 snapshot으로 넣어야 과거 version이 바뀌지 않는다. 현재 Lecture에는 references 입력/저장이 없다.

## 본문 권장 구조

TipTap 본문에 선택적으로 작성한다. 강제 schema나 section table로 만들지 않는다.

1. 강의 도입
2. 먼저 던질 질문
3. 강의 목표
4. 핵심 개념 설명
5. 사용할 예시
6. 실습 또는 활동
7. 예상 질문과 답변
8. 마무리
9. 강사 노트

기존 본문은 자동 생성·덮어쓰기 없이 보존한다.

## Publish 및 공개 방향

Knowledge Stage 17 Publish transaction을 복사하지 않는다. Stage 21은 Lecture readiness, immutable metadata snapshot, published pointer transaction, public query/renderer의 최소 설계를 별도로 구현한다. 공개 Lecture는 수강 상태가 아닌 단일 공개 강의 자료로만 렌더링한다.

## Migration과 Stage 21

Stage 20은 문서화만 하며 migration은 필요 없다. Stage 21의 최소 범위는 Lecture editor 안내 문구와 template, audience/duration/coreMessage/references의 저장 위치 결정, metadata snapshot/additive migration 필요성 판단, Publish/public renderer 설계다. Production은 사용하지 않는다.

## Stage 21 결과

Stage 21은 migration 0005로 audience와 estimated duration을 nullable detail metadata로 추가했다. coreMessage와 references는 immutable Lecture version metadata에 저장한다. Publish와 public renderer는 Stage 22 이후 범위다.
