# 지식과 강의 콘텐츠 모델

> **Stage 16 Knowledge 기준:** Knowledge 기본 필드, version별 tags/references, 공개 URL과 발행 준비 규칙은 [Knowledge 공개 및 발행 계약](16_KNOWLEDGE_PUBLISH_CONTRACT.md)이 우선한다. 이 문서의 topic/order/관계/검증 metadata 설명은 기존 데이터 호환 모델이다.

- **Status:** Approved and implemented in Stage 14
- **Last Updated:** 2026-07-19
- **Authority:** 새 CMS의 콘텐츠 타입, 관계, 관리자 작성 흐름에 대한 현재 기준

이 문서는 새 CMS 콘텐츠 모델의 현재 권위 문서다. 기존 Markdown 표본 이전을 전제로 작성된 `04_CONTENT_SYSTEM`, `07_DATABASE_SCHEMA`, `08_EDITOR_AND_ADMIN`, `13_MIGRATION_PLAN`의 Archive·Deep Dive·Course 관련 설명과 충돌할 경우 이 문서를 따른다. 기존 문서의 해당 내용은 당시 조사와 공개 legacy 보존 기록으로만 유지한다.

## 확정 원칙

- Dechive의 새 콘텐츠 타입은 지식과 강의다.
- Archive와 DeepDive는 새 CMS의 콘텐츠 타입으로 사용하지 않는다.
- 기존 Markdown 114개는 이전하지 않는다.
- 지식은 원본 지식 문서다.
- 강의는 지식을 바탕으로 강의식·자료식으로 재구성한 콘텐츠다.
- 지식은 권장 순서를 가질 수 있지만 독립적으로 읽을 수 있다.
- 강의와 지식의 본문 및 version은 서로 독립적이다.

기존 공개 `/archive`, `/deep-dive`, `/book` URL과 Markdown renderer는 현재 그대로 유지한다. 이는 새 CMS의 type 정의가 아니라 legacy 공개 사이트 보존 경계다.

## 지식

지식은 하나의 개념, 질문, 기술, 원리 또는 판단 기준을 다루는 독립 문서다. 공통 localization과 immutable `content_versions`에 title, slug, summary, canonical document를 저장한다. `knowledge_details`에는 topic, tags/concepts, recommended order, 검증 metadata를 두고, 선수·관련 지식은 기존 `content_relations`의 `prerequisite`, `related` 관계를 사용한다.

권장 순서는 변경 가능한 학습 안내이며 장 번호나 읽기 전제 조건이 아니다. 선수 지식과 관련 지식은 knowledge만 대상으로 하고 self relation을 허용하지 않는다.

## 강의

강의는 `contents.kind=lecture`인 독립 콘텐츠다. 최소 하나의 대표 기반 지식을 `lecture_details.primary_source_knowledge_id`로 참조한다. DB FK와 trigger, application service가 대상의 knowledge type과 존재 여부를 검증한다.

학습 목표, 난이도, 권장 순서, 실습·확인 항목은 강의 detail에 저장한다. 기반 지식 선택 UI에는 제목과 요약만 보여 주며 본문을 복사하지 않는다. 지식 revision은 강의 document/version을 변경하지 않는다.

## 작성·발행 경계

관리자 route는 지식 `/admin/knowledge/**`, 강의 `/admin/lectures/**`로 분리한다. 두 유형은 기존 owner route guard, same-origin Server Action guard, service membership 확인, revision actor 기록을 공유한다. 저장은 새 immutable version을 만들고 current draft pointer만 이동한다. Stage 14는 Publish와 public DB renderer를 구현하지 않으며 current published pointer를 설정하지 않는다.

## 기존 테스트 데이터

Stage 11–13의 Archive 이름 테스트 Draft는 삭제하지 않는다. 현재 DB의 `knowledge` test fixture로 유지하되 제목·slug 때문에 테스트 데이터임을 식별할 수 있다. 향후 staging 정리는 별도 승인된 cleanup manifest와 backup 확인 후 수행한다. Production 콘텐츠로 간주하지 않는다.
