# Content System

> **Stage 14 현재 기준:** 새 CMS의 확정 타입은 지식과 강의다. Archive/DeepDive/기존 Markdown 이전 및 Course 계층을 전제로 한 아래 내용은 과거 모델 조사 기록이다. 충돌 시 [지식과 강의 콘텐츠 모델](14_KNOWLEDGE_AND_LECTURE_MODEL.md)을 따른다.
>
> Knowledge 작성·공개·발행 계약은 Stage 16의 [Knowledge 공개 및 발행 계약](16_KNOWLEDGE_PUBLISH_CONTRACT.md)이 최우선이다.

- **Status:** Approved logical model; document format recommended
- **Last Updated:** 2026-07-18
- **Authority:** 콘텐츠 유형·생명주기·공통 필드의 논리 기준
- **Purpose:** 실제 legacy 표본으로 Knowledge, Course, Lesson, Practice, AI Update의 경계를 정의한다.

근거 표본은 [Content Sample Mapping](CONTENT_SAMPLE_MAPPING.md), 관계 규칙은 [Content Relation Model](CONTENT_RELATION_MODEL.md)을 따른다. 이 문서는 PostgreSQL, table schema, editor document format을 확정하지 않는다.

## 공개 유형과 보조 구조

공개 핵심 유형은 `Knowledge | Course | Practice | AIUpdate`다. `Lesson`은 Course 안에서 독립 URL/revision을 가질 수 있는 학습 단위다.

- Archive와 Deep Dive는 모두 Knowledge로 표현한다. Deep Dive는 `format=deep_dive`, `depth=deep`인 editorial 형식이지 별도 최상위 domain type이 아니다.
- Book은 현재 표본상 `Knowledge(format=book_note)`다. 학습 목표·순서·완료 기준이 없어 Course가 아니다.
- Issues와 날짜별 AI digest는 다른 콘텐츠를 편집해 묶는 `EditorialCollection/Digest`다. 핵심 학습 content type과 분리한다.

기존 route/label은 migration과 URL 정책에 따라 계속 제공할 수 있으며 domain type 통합과 URL 변경은 같은 결정이 아니다.

## 공통 metadata

모든 independently publishable entity가 공유한다.

`id, type, slug, locale, translationGroupId?, title, summary, status, author/owner, currentVersionId, publishedVersionId?, publishedAt?, updatedAt, lastReviewedAt?, reviewDueAt?, heroMedia?, seo, shareMetadata, createdAt`.

Source, relation, media usage, revision은 별도 entity로 연결한다. `slug`는 locale별 URL segment이고 translation identity가 아니다. SEO/canonical은 legacy URL 정책을 보존할 수 있어 slug와 분리한다.

## Knowledge

후보 필드:

`coreQuestion?, answerSummary?, body, format, depth, difficulty?, tags, concepts, prerequisites, sources, relatedContent, heroMedia, revision`.

- `coreQuestion`: 질문형 Archive에는 자연스럽지만 NULL 가이드나 실전 노트처럼 제목이 질문이 아닌 표본도 있어 **선택 필드**다. 비어 있음을 허용하고 발행 준비도 규칙은 format별로 둔다.
- `answer`와 `body`: 완전한 두 본문을 저장하지 않는다. 검색/preview를 위한 짧은 `answerSummary`만 선택적으로 두고, 권위 본문은 `body` 하나다. 같은 내용을 두 군데 수정하는 drift를 방지한다.
- `difficulty`: Course/Practice에는 필수 후보지만 Knowledge는 독자층이 명확할 때만 사용한다. 표본만으로 모든 기존 글에 신뢰할 수 있는 자동 난이도를 부여할 수 없다.
- `format`: `article | concept_guide | technical_guide | reference | deep_dive | book_note` 후보.
- `depth`: `standard | extended | deep`; 글자 수로 자동 결정하지 않고 editorial intent로 정한다.
- Markdown heading: 순서·level·inline text를 body block으로 그대로 보존하고 stable block/anchor ID를 migration 시 생성한다. locale 간 heading 구조가 달라도 강제로 맞추지 않는다.

## Course / Module / Lesson

### Course

`title, description, audience, level, learningObjectives, prerequisites, status, estimatedDuration, modules, locale/translationGroup`.

### Module

`courseId, title, summary?, order, learningObjectives?, status, lessons`.

### Lesson

`title, summary, learningObjectives, body, relatedKnowledge, practices, completionCriteria, estimatedDuration, status`와 공통 publish metadata.

- Course는 ordered membership과 completion criteria를 가진다. 단순 링크 모음은 Course가 아니다.
- Lesson body는 학습 안내·맥락·전환을 담당하고 Knowledge 원문을 복제하지 않는다. 기존 Knowledge를 relation으로 참조하고 필요하면 특정 published revision/block을 citation한다.
- Module/Lesson 순서는 gap number가 아닌 명시적 ordered membership으로 관리하고 reorder를 transaction/audit 대상으로 본다.
- 미완료 Course는 `draft`(비공개), 준비된 일부만 보여줄 때 `preview` 성격의 별도 공개 정책이 필요하다. 없는 lesson을 완료된 것처럼 표시하지 않는다.
- KO/EN Course는 translation group을 공유하되 module/lesson availability가 달라질 수 있다. locale별 status와 order를 독립 보존한다.

샘플 Course는 `CONTENT_SAMPLE_MAPPING.md`의 “AI 시대에 배우고 판단하기”를 따른다. Book 3개는 참고 resource가 될 수 있지만 Course로 직접 변환하지 않는다.

## Practice

`title, objective, practiceType, difficulty, prerequisites, estimatedDuration, instructions, steps, inputSchema?, expectedOutcome, evaluationCriteria, hints, commonMistakes, relatedKnowledge, relatedLesson, downloadableAssets, completionMode`.

practiceType 후보: `guided_task | prompt_writing | output_comparison | hallucination_detection | source_verification | tool_walkthrough | reflection | checklist`.

- 자동 채점은 SQL 결과처럼 deterministic한 경우만 우선한다. reflection/관점 비교는 self-check 또는 운영자 review가 맞다.
- 로그인 없이 정적 instruction, client-only checklist, 결과 비교가 가능하다. localStorage는 device-local 편의 기능이며 진도 원본으로 간주하지 않는다.
- 계정 간 동기화, 제출/피드백, 수료 증명, instructor review가 필요하면 서버 저장이 필요하다.
- AI API는 자유 답안의 보조 피드백 후보일 뿐 필수 기반이 아니다. 결과를 자동 정답·자동 발행하지 않는다.
- 완료는 `viewed`가 아니라 유형별 `completionCriteria` 충족으로 정의한다.

## AI Update와 Digest

개별 `AIUpdate`가 canonical change unit이다.

`occurredAt?, announcedAt, publishedAt, sourceCheckedAt, product/vendor, changeType, whatChanged, whyItMatters/useCriteria, verificationNotes, sourceConfidence, sources, imageStatus, affectedContent`.

날짜별 `UpdateDigest`는 `date, title, subtitle, editorialSummary, ordered update relations, excludedCandidateNotes?`를 가진 collection이다. 개별 update를 복제하지 않는다. 기존 `/ai-updates/{date}`는 Digest URL로 유지하고 anchor/향후 detail URL 전략은 별도 결정한다.

이 구조는 검색·공유·revision·source check를 변화 단위로 수행하면서 현재 날짜별 편집 경험을 보존한다.

## 상태와 revision

기본 상태: `draft → review → scheduled → published → archived`. `scheduled`는 publish job과 time zone을 명시한다. unpublish는 상태 변경+audit이며 hard delete가 아니다.

- autosave draft와 immutable published version을 분리한다.
- version은 `summary, changedFields, previousPublishedVersionId, editor, createdAt`을 기록한다.
- rollback은 과거 version을 복제해 새 version으로 publish한다. 역사를 덮어쓰지 않는다.
- `sourceCheckedAt`은 source relation별, `lastReviewedAt/reviewDueAt`은 콘텐츠 전체 검토다.
- AI Update는 기본 검토 주기가 짧고 source 변화/제품 lifecycle에 반응한다. 일반 Knowledge는 주제별 cadence를 둔다. 같은 고정 주기를 강제하지 않는다.

## 다국어

현재 KO/EN은 같은 slug지만 실제 표본에서 heading·이미지·분량 drift가 있다. 따라서:

- 언어별 콘텐츠/version/status를 독립 record로 보존하고 `translationGroupId`로 연결한다.
- shared slug를 기본 제안으로 두되 필수 제약으로 만들지 않는다. 기존 shared slug는 그대로 보존한다.
- source locale version이 publish되면 번역본을 자동 덮어쓰지 않고 `translationStatus=outdated`와 source version 기준을 표시한다.
- AI 번역은 draft만 만들고 사람 검토 후 publish한다.

운영안 A/B/C 비교와 추천은 `DECISIONS.md` D-11에 남긴다. 이 단계에서는 정책을 확정하지 않는다.

## 본문 저장 형식 미결정

현재 Markdown이 표현하는 heading, paragraph, list, quote, code, table, image, link와 anchor를 lossless round-trip할 수 있어야 한다. Stage 4는 neutral DechiveDocument JSON을 canonical 후보로 권고했다. HTML/plain text/Markdown은 파생·교환 형식이며 최종 승인은 TipTap adapter spike 후다. 상세는 [Document Format](DOCUMENT_FORMAT.md)과 [Editor Benchmark](EDITOR_BENCHMARK.md)을 따른다.

Archive와 Deep Dive 통합, Deep Dive의 장기 navigation 제거와 legacy URL 보존, Book note 분류, AI Update/Digest 혼합 모델, C안 다국어, 선택 difficulty, Course/Lesson 독립 상태, 초기 Practice 무로그인 원칙은 승인됐다.
