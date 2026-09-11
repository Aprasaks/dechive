# 전면 재구축 구현 계획

## 원칙

기존 Supabase 데이터, 콘텐츠, slug, 이전 URL, legacy importer를 이전하지 않는다. 기존 운영 브랜치는 새 버전이 검증될 때까지 남기고 새 브랜치에서 교체한다.

## 1. 저장소 정리

- 현재 제품 헌장과 구조 문서만 남긴다.
- 기존 Markdown 콘텐츠, import fixture, 이전 DB migration과 호환 코드를 제거한다.
- Next.js·TypeScript·Vercel의 유효한 프로젝트 설정은 유지한다.
- 사용하지 않는 패키지는 새 코드 전환이 끝난 뒤 제거한다.

## 2. Supabase 기반

- 새 프로젝트용 단일 초기 SQL migration을 작성한다.
- Auth owner 정책, RLS, Storage bucket과 policy를 코드로 기록한다.
- Supabase browser/server client를 분리한다.
- 생성된 Database TypeScript 타입을 저장한다.

## 3. 관리자 원본 시스템

- 콘텐츠 유형 선택
- 유형별 메타데이터 입력
- TipTap JSON 자동 저장
- 이미지·PDF·파일 업로드
- 출처와 필요한 Knowledge 연결
- 미리보기
- 발행 조건 검사
- immutable revision 발행
- 수정 이력과 재검증 기록
- 휴지통과 복원

## 4. 공개 사이트

- 공통 Header/Footer
- 메인
- Knowledge 목록·상세·내부 지도
- Lecture 목록·상세
- Practice 목록·상세
- AI Update 목록·상세
- Books 목록·상세
- 통합 검색

메인은 밝은 종이색·먹색·코발트 블루의 현대적인 편집형 디자인을 사용한다. Knowledge를 중심에 두고 Lecture와 Practice를 첫 화면에 함께 배치한다. 큰 소개 문구만 놓지 않고 실제 발행 콘텐츠와 다섯 영역의 탐색 구조를 첫 화면에서 바로 보여준다.

## 5. 검색과 Jarvis

- PostgreSQL 전문 검색을 먼저 구현한다.
- 콘텐츠가 축적된 뒤 chunk와 embedding 검색을 추가한다.
- Jarvis 변경분 API와 읽기 전용 인증을 구현한다.
- Jarvis suggestion 검토 화면을 관리자에 추가한다.

## 6. 전환

- 빈 DB에서 작성→자동 저장→미리보기→발행→공개 조회를 검증한다.
- 이미지와 자료 업로드, 실패 복구, revision rollback을 검증한다.
- 데스크톱·태블릿·모바일을 확인한다.
- Vercel 환경변수를 새 Supabase 프로젝트로 연결한다.
- 검증 후 새 브랜치를 main으로 병합하고 배포한다.
