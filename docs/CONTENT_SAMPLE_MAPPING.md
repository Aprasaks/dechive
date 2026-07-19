# Content Sample Mapping

- **Status:** Evidence baseline for stage 3
- **Last Updated:** 2026-07-18
- **Authority:** 실제 legacy 콘텐츠 표본과 목표 유형 매핑의 사실 기준
- **Purpose:** 원문을 변경하지 않고 구조·관계·변환 위험을 검증한다.

## 조사 방법과 표기

실제 파일을 `gray-matter`로 읽고 frontmatter, Markdown heading, image, fenced code, table row, raw URL과 내부 link를 조사했다. `코드`는 fenced block 수, `표`는 Markdown table 존재 여부다. `출처 없음`은 링크로 구조화된 출처가 없다는 뜻이며, 본문에 일반 서술이나 참고자료 heading이 없다는 뜻은 아니다. 원문 전체는 복사하지 않았다.

## Archive 표본 5쌍

공통 현재 route는 KO `/archive/{slug}`, EN `/en/archive/{slug}`다.

### A1. AI가 알려준 답을 그대로 배워도 될까?

- 파일: `content/posts/can-we-learn-directly-from-ai-answers.ko.md`, 대응 `*.en.md`; slug 공유; locale `ko`/`en`.
- frontmatter: `{title, seoTitle, date: 2026-06-26, type: archive, category: AI, tags: [AI, Verification, Learning, Human Judgment], slug, description, status: published, lang}`. 언어별 title/description/seoTitle만 번역된다.
- 본문: H2 4개로 “정확성→유창성 착각→학습→판단 기준” 순서. KO 1,585자, EN 3,494자.
- 이미지: 양쪽 `ai-learning-verification-desk.webp` 1개와 언어별 alt. 코드/표/외부 링크/구조화 출처/관련 콘텐츠 없음.
- 현재→추천: Archive → `Knowledge(format=article, depth=standard)`.
- 이유/위험: 독립 질문과 답의 흐름이 명확하다. `coreQuestion`을 title에서 추출할 수 있으나 자동 추출 대신 검토가 필요하고, 출처·review date 보강이 필요하다.

### A2. 비어 있는 값이 남기는 문제

- 파일: `content/posts/what-null-leaves-behind.{ko,en}.md`; route는 공통 규칙; slug 공유.
- frontmatter: `{title, date: 2026-05-10, type: archive, category: Data, tags: [SQL, database, null, data], slug, description, seoTitle, status, lang}`. YAML `null`이 문자열 tag가 아니라 실제 null로 파싱되는 데이터 결함이 양쪽에 있다.
- 본문: KO H2 5, EN은 추가 H1 때문에 6 headings. 이미지 3개, fenced code 9개, Markdown 표 1개(6 rows). 외부 링크/출처/관련 콘텐츠 없음.
- 현재→추천: Archive → `Knowledge(format=technical_guide, depth=standard)` + Practice 후보.
- 이유/위험: code/table/image block round-trip 시험에 적합하다. null tag 정규화, EN 전용 H1 제거 여부가 아닌 구조 drift 보존, 이미지 상대 경로 보존이 핵심 위험이다.

### A3. AI에게 제대로 묻기 위한 실전 노트

- 파일: `content/posts/prompt-real-world-guide.{ko,en}.md`; slug 공유.
- frontmatter: `{title, date: 2026-04-26, type: archive, category: AI, tags: [llm,prompt,chatgpt,claude,gemini,ai-prompting], slug, description, seoTitle, status, lang}`.
- 본문: KO 10,607자/62 headings/45 fenced blocks, EN 18,958자/63 headings/44 blocks. 16개 사용 장면이 반복 구조를 가진다. 이미지/표/외부 링크/출처/관련 콘텐츠 없음.
- 현재→추천: Archive → `Knowledge(format=reference, depth=extended)`. 각 장면은 향후 Lesson/Practice가 참조한다.
- 이유/위험: 단일 지식으로 검색 가치가 있지만 Course로 복제하면 revision drift가 생긴다. 반복 heading과 prompt 예제가 editor custom block으로 손실되지 않아야 한다.

### A4. 애자일이란 무엇인가 — 탄생과 선언문

- 파일: `content/posts/agile-methodology-guide.{ko,en}.md`; slug 공유.
- frontmatter: `{title, date: 2026-04-08, type: archive, category: Product, tags: [agile,methodology,scrum,waterfall,teamwork], slug, description, seoTitle, status, lang}`.
- 본문: KO 9 headings, EN 10(EN 추가 H1), fenced block 1, Markdown 표 1(7 rows). 이미지/외부 링크/구조화 출처/관련 콘텐츠 없음.
- 현재→추천: Archive → `Knowledge(format=concept_guide, depth=standard)`; Course lesson의 related Knowledge.
- 이유/위험: 역사적 주장에 출처가 없고 표/heading locale drift가 있다. Course에 본문을 복사하지 않고 참조해야 한다.

### A5. AI에게 권한을 준다는 것은 무엇을 맡긴다는 뜻일까?

- 파일: `content/posts/what-does-giving-ai-permission-mean.{ko,en}.md`; slug 공유.
- frontmatter: `{title, seoTitle, date: 2026-07-04, type: archive, category: AI, tags: [AI,Automation,Agent,Verification,Human Judgment], slug, description, status, lang}`.
- 본문: H2 6개의 순수 서술 구조, 이미지/코드/표/외부 링크/구조화 출처/관련 콘텐츠 없음.
- 현재→추천: Archive → `Knowledge(format=article, depth=standard)` + permission-design Practice의 prerequisite.
- 이유/위험: `coreQuestion`은 명확하지만 answer를 별도 필드로 기계 추출할 근거가 없다. 시의성 있는 agent 권한 주장에 review date/source가 필요하다.

## Deep Dive 표본 4쌍

현재 route는 KO `/deep-dive/{slug}`, EN `/en/deep-dive/{slug}`다. 네 쌍 모두 frontmatter가 Archive 공통 필드에 `coverImage`, `concepts`를 추가한다.

| ID | 파일/slug | frontmatter 핵심 | 본문 구조·미디어 | 출처/관계 | 추천과 위험 |
|---|---|---|---|---|---|
| D1 | `can-ai-replace-learning.{ko,en}.md`; `can-ai-replace-learning` | date 2026-06-29, category AI, published, tags 5, cover, concepts 5 | KO 30,511자/37 headings, EN 66,105자/37; 본문 이미지 4, code/table 없음 | 참고 언급은 있으나 raw URL 0; 명시 관계 없음 | `Knowledge(format=deep_dive, depth=deep)`. Course seed로는 좋지만 자체 Course는 아님. 7 Part 구조와 이미지 보존, EN 분량 drift 위험 |
| D2 | `data-analysis-beyond-business.{ko,en}.md`; 동일 slug | date 2026-06-21, category Data, published, cover, concepts 5 | KO 49,132자/50 headings, EN 101,480자/50; 이미지 5, code 1, table rows 54 | 참고 언급, raw URL 0; 관계 없음 | `Knowledge(deep_dive)` + Course/Lesson seed. 가장 복잡한 변환 표본; 표·이미지·장문·앵커 안정성 위험 |
| D3 | `ai-era-agile-verification.{ko,en}.md`; 동일 slug | date 2026-05-18, category Product, published, cover, concepts 3 | KO 41,570자/104 headings/이미지 2/code 3, EN 36,869자/43 headings/이미지 1/code 4 | KO `참고자료` heading, raw URL 0; 관계 없음 | `Knowledge(deep_dive)`. KO/EN 구조가 크게 달라 translation version 독립성이 필수. Course lesson으로 쪼개도 원문은 유지 |
| D4 | `does-ai-improve-or-average-my-thinking.{ko,en}.md`; 동일 slug | date 2026-07-06, category AI, published, cover, concepts 5 | KO 34,514자/71, EN 71,515자/71; 본문 이미지/code/table 없음 | KO reference 표식 없음, EN reference 문자열 존재; raw URL 0 | `Knowledge(deep_dive)`. 관점 체크리스트는 Practice 후보. cover 경로와 실제 본문 이미지 없음의 구분 필요 |

결론: Deep Dive는 별도 top-level content type보다 Knowledge의 `format=deep_dive`, `depth=deep`로 충분히 표현된다. 단, 기존 route와 editorial label은 보존 가능하다. 분량은 format 판정 규칙이 아니며 운영자 선택이다.

## Book 표본 3개

현재 파일은 `src/content/books/*.ko.md`, route는 `/book/{slug}`다. 공통 frontmatter는 `{title, author, publisher, date, readDate, slug, coverImage, tags, status, lang, summary}`이고 본문은 “펼친 이유/붙잡은 문장·질문/내 생각/남은 질문/연결된 기록” H2 5개다. code/table/external URL은 없다.

| 파일/slug | 고유 metadata | 내부 관계 | 추천과 위험 |
|---|---|---|---|
| `ai-bubble-is-coming.ko.md` | author 2명, publisher 빈 값, 2026-06-21, readDate 06-15, cover `/images/books/2026-06-15.webp` | `/deep-dive/ai-era-agile-verification` | `Knowledge(format=book_note)` 또는 resource note. Course가 아님. 짧은 인용의 locator/page와 판권 정보 부재 |
| `dual-brain.ko.md` | author 이선 몰릭, publisher 빈 값, 2026-06-22, cover 06-22 | `/deep-dive/data-analysis-beyond-business` | `Knowledge(book_note)`. Course source로 참고 가능. 서지 metadata 부족 |
| `knowing-what-we-know.ko.md` | author 사이먼 윈체스터, publisher 인플루엔셜, 2026-06-29, cover 06-29 | `/deep-dive/can-ai-replace-learning` | `Knowledge(book_note)` + sample Course source. 인용/질문의 source locator 보강 필요 |

세 Book은 학습 순서·목표·완료 기준이 없어 그 자체로 Course가 될 수 없다. 독서 기록 세 개를 단순 묶어도 Course가 되지 않는다.

## AI Updates 표본 5일

현재 파일은 `src/data/aiUpdates.ts`, route는 `/ai-updates/{date}`와 `#slug` anchor다. 각 update는 이미 `{id, slug, title, summary, badges, detailHref, source, whatChanged, useCriteria, verificationNotes, image}`를 가진다.

| 날짜 | 현재 형태 | 표본 변화/출처 | 추천 매핑 | 위험 |
|---|---|---|---|---|
| 2026-07-05 | digest title/subtitle/quickSummary, groups 6, update 3 | Samsung 공급망(Reuters), Mechanical Turk(Amazon/TechCrunch), AI funding/robotics(TechCrunch) | 개별 `AIUpdate` 3 + `UpdateDigest` 1 | 하나의 summary update가 복수 기사/변화를 묶어 canonical granularity가 불명확 |
| 2026-07-04 | digest, groups 5, update 3 | 소상공인 AI(Reuters), Midjourney discovery, Google 광고/Robocup | 개별 3 + digest | 세 번째 item이 문화/robotics 두 변화를 결합; 분리 검토 필요 |
| 2026-07-02 | digest, groups 9, update 3 | Anthropic 안전, Microsoft 기업 구현, GitHub Copilot 운영 묶음 | 개별 변화로 재분해 + digest | GitHub item이 다섯 changelog를 묶어 revision/source 단위가 너무 큼 |
| 2026-06-20 | legacy 단순 day, update 2 | Zoom Virtual Agent, Canvas IgniteAI; 각 공식 source와 image 상태 | 개별 2 + 자동 digest view | source URL이 product root라 canonical detail 확인 필요 |
| 2026-06-19 | legacy 단순 day, update 1 | Claude Code 승인 경계; Anthropic docs root | 개별 1, date view는 digest 없이도 생성 | 정확한 changelog URL과 occurredAt 확인 필요 |

추천은 **변화 단위 개별 AIUpdate가 canonical이고 날짜별 Digest는 관계 기반 editorial view/document**인 혼합 모델이다. 기존 날짜 URL은 digest로 유지한다.

## Issues 표본 4개

현재 파일 `src/data/dailyIssues.ts`; route `/issues/{date}`. body가 아니라 기존 콘텐츠 링크를 cover/layout/theme으로 표현하는 editorial projection이다.

| 날짜 | front-like 구조 | 연결 | 추천과 위험 |
|---|---|---|---|
| 2026-06-18 | id/date, classic-editorial cover/layout, bilingual question, theme | `/archive/why-we-get-excited-about-ai-content` | `EditorialCollection/IssueView`가 Knowledge를 featured. 별도 공개 핵심 type 불필요 |
| 2026-06-17 | big-question, bilingual kicker/title, theme | `/archive/how-much-can-we-trust-human-made-content` | 동일. template presentation metadata를 content domain과 분리 |
| 2026-06-16 | side-cover-lines, bilingual description, theme | `/archive/why-people-stop-reading-ai-results` | 동일. KO/EN 문구가 한 객체에 있어 locale version으로 정규화 필요 |
| 2026-06-15 | bg cover, no explicit layout, bilingual question, theme | `/archive/why-people-stop-reading-ai-results` | 동일 Knowledge를 06-16과 중복 feature. duplicate relation 허용하되 `(issue,target,role)` unique |

Issue는 새 `Content` 본문 유형이 아니라 published 콘텐츠를 날짜별로 편집한 collection/view가 적합하다. 자동 생성 issue는 별도 migration manifest에서 수동 issue와 구분해야 한다.

## Knowledge 매핑 예시 4개

| legacy | 목표 필드 예시(본문 복제 없음) |
|---|---|
| A1 | `format=article`, `depth=standard`, `coreQuestion=AI 답을 그대로 배워도 되는가`, `difficulty=beginner`, hero media=desk image, translation group 공유 |
| A2 | `format=technical_guide`, `depth=standard`, `coreQuestion=NULL은 왜 빈칸이 아닌가`, `difficulty=beginner`, body에 code/table/image block 보존, Practice relation |
| D1 | `format=deep_dive`, `depth=deep`, `coreQuestion=배움은 AI가 대신할 수 있는가`, `difficulty=intermediate`, concepts 5, 4 media, Course prerequisite relation |
| D3 | `format=deep_dive`, `depth=deep`, `coreQuestion=AI 시대 Agile은 무엇을 검증하는가`, `difficulty=intermediate`, KO/EN version 구조 독립, Agile Knowledge 확장 relation |

## Sample Course: AI 시대에 배우고 판단하기

기존 원문을 복사하지 않고 relation으로 구성한다.

- Course: audience=AI로 공부를 시작한 성인 학습자, level=beginner, objectives=AI 답/이해/검증/기록을 구분하고 작은 학습 루프를 수행, estimatedDuration=3h, status=draft.
- Module 1 `답을 받는 것과 배우는 것`: Lesson 1은 A1을 related Knowledge로, Lesson 2는 Book `지식의 탄생`을 참고 resource로 연결.
- Module 2 `질문과 검증`: Lesson 3은 D1의 Part 2~4를 참조하고 A5를 prerequisite Knowledge로 연결.
- Module 3 `직접 해보기`: Lesson 4는 D1의 AI 학습 루프를 참조하며 Practice P1/P2를 완료 조건으로 연결.
- 기존 D1/Book 본문은 Lesson body에 복제하지 않는다. Lesson에는 목표, 안내, 연결 문맥, 완료 기준만 작성한다.

## Sample Practice 3개

| ID | 실제 주제 | type/objective | 핵심 단계와 완료 정의 | 저장/API |
|---|---|---|---|---|
| P1 | A1/D1 | `source_verification`; AI 답 하나에서 검증 필요 주장 찾기 | 주장 3개 분리→공식/보조 출처 구분→판정과 근거 기록. 기준 4개 중 3개 충족+출처 URL 존재 시 self-complete | 로그인 없이 메모리/localStorage 임시 저장 가능; AI API 불필요 |
| P2 | `does-ai-improve...` | `output_comparison`; 원문 관점과 AI 수정본 비교 | 보존할 관점 작성→두 결과 비교→평균화된 표현 표시→선택 설명. 제출/모범 기준 확인으로 완료 | localStorage 선택적; 규칙 기반 checklist, AI API 선택 사항 |
| P3 | A2 | `guided_task`; SQL NULL 결과 예측·실행 | sample rows→`IS NULL`, arithmetic, `COUNT(*)/COUNT(col)` 결과 예측→실행 결과 대조→오류 설명. 전 항목 대조 시 완료 | 정적 sandbox/브라우저 SQL 도구 검토; 서버 사용자 저장 불필요, 자동 채점은 deterministic |

로그인 없이 instruction/checklist/result comparison은 가능하다. device 간 진행률, 제출 이력, instructor review, certificate가 필요할 때만 서버 저장이 필요하다. AI API는 자유 답안 피드백처럼 규칙으로 판정할 수 없는 경우에만 사용하고 사람 검토 없이 정답 판정자로 두지 않는다.
