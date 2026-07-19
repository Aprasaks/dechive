# Practice Model

Practice는 Knowledge를 직접 적용하고 실행·관찰·검증한 공개 기록이다. Knowledge는 무엇을 아는지, Lecture는 어떻게 설명하는지, Practice는 실제로 어떻게 적용하고 무엇을 확인했는지를 다룬다.

`practices` 기존 detail table을 유지하고 `objective`, nullable `related_knowledge_id`, `outcome_status`를 CMS의 구조화 필드로 사용한다. outcome은 `verified`, `partially_verified`, `not_verified`, `failed`, `inconclusive` 중 하나다. Knowledge 연결은 선택적이며 하나만 허용한다.

환경, 준비 조건, 절차, 관찰, 결과 상세, 한계와 다음 변경은 TipTap canonical body에 둔다. references는 mutable detail이 아니라 immutable version metadata의 `practice.references`다.

Draft 저장은 새 immutable version을 만들고 draft pointer를 이동한다. Publish는 현재 Draft version을 복사하지 않고 published pointer로 가리킨다. 최초 Publish 뒤 slug는 잠긴다. 독립 rollback API는 없으며, 과거 내용을 새 revision으로 저장하고 재발행하는 방식으로 복구한다.

공개 `/practice`와 `/practice/[slug]`는 published pointer만 읽는다. Draft와 unpublished Practice는 404 또는 목록 제외다. 이 Stage는 사용자 제출, 채점, AI 작성, 첨부, 다대다 관계, Lecture 직접 관계를 만들지 않는다.
