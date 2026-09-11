# 시스템 구조

## 저장 위치

| 대상 | 원본 저장 위치 |
|---|---|
| 사이트 코드와 DB migration | GitHub |
| 글·revision·출처·관계·검증 기록 | Supabase Postgres |
| 이미지·PDF·강의·실습 파일 | Supabase Storage |
| 관리자 계정 | Supabase Auth |
| 배포 | Vercel |
| Jarvis 검색 사본 | Mac의 Jarvis Grounded Store |

## 콘텐츠 흐름

1. 관리자가 Supabase Auth로 로그인한다.
2. TipTap 에디터가 canonical JSON 초안을 자동 저장한다.
3. 서버가 발행 조건과 출처를 검증한다.
4. 발행하면 immutable revision, 파생 HTML·plain text·Markdown, change event가 함께 생성된다.
5. 공개 사이트는 현재 발행 포인터가 가리키는 public revision만 읽는다.
6. Jarvis는 읽기 전용 변경분 API로 허용된 revision을 동기화한다.

## 핵심 데이터 경계

- `contents`: 콘텐츠의 영구 정체성, 유형, 상태, 공개 범위, 현재 발행 포인터
- `content_drafts`: 자동 저장되는 현재 작업본
- `content_revisions`: 발행 시점의 immutable 원본
- `content_artifacts`: HTML·plain text·Markdown 파생본
- `sources`, `revision_sources`: 출처와 revision별 사용 관계
- `content_relations`: 필요한 지식과 후속 콘텐츠의 명시적 관계
- `verification_events`: 본문 수정과 독립된 검증 기록
- `assets`, `revision_assets`: 파일 metadata와 revision별 사용 위치
- `change_events`: Jarvis 증분 동기화용 순차 이벤트
- `jarvis_suggestions`: 재검증·깨진 출처·충돌 가능성에 대한 제안
- `embedding_chunks`: 검색용 파생 데이터

## 보안 경계

- 브라우저에는 Supabase publishable key만 제공한다.
- DB 비밀번호와 service role key는 서버 환경변수에만 둔다.
- 모든 테이블에 RLS를 적용한다.
- 방문자는 발행된 public revision만 읽는다.
- 관리 작업은 인증된 owner 한 명만 수행한다.
- Jarvis 토큰은 읽기 전용 scope를 가지며 Mac Keychain에 저장한다.
- private 콘텐츠는 `Jarvis에서 사용`을 명시적으로 켠 경우에만 동기화한다.
- draft는 기본적으로 Jarvis에 제공하지 않는다.

## Jarvis 원칙

Jarvis Grounded Store는 원본이 아니라 읽기용 사본이다. 응답에는 `content_id`, `revision_id`, `verified_at`, 출처를 유지한다. Jarvis가 변화를 발견해도 원문을 수정하지 않고 suggestion만 생성한다.

변경분 API는 `created`, `updated`, `reverified`, `unpublished`, `deleted`를 제공하며 단조 증가 cursor를 사용한다. 삭제와 비공개 전환도 tombstone event로 전달한다.

## 백업

- 콘텐츠를 Markdown·JSON으로 정기 내보낸다.
- 데이터베이스 dump와 Storage asset manifest를 함께 보관한다.
- 백업은 Supabase 프로젝트와 독립된 위치에도 보관한다.
- 복구 연습을 하지 않은 백업은 완료로 간주하지 않는다.

