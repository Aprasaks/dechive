# TipTap Manual Test Checklist

- **Status:** Pending real OS/device execution
- **Last Updated:** 2026-07-18
- **Authority:** Stage 11 local Archive editor release gate
- **Purpose:** 자동 검증으로 대체할 수 없는 IME, mobile selection, VoiceOver 결과를 실제 장비별로 기록한다.

## 실행 전

- Docker PostgreSQL과 migration `0000..0003`을 실행한다.
- development server를 localhost에서 실행하고 `/admin/knowledge/new`를 연다.
- fixture를 저장하고 edit/preview URL에서 다시 연다.
- production build 또는 공개 host에서는 해당 route가 404인지 별도로 확인한다.

## 1. macOS Chrome Korean IME — 미수행

- 빠른 한글 연속 입력, 조합 중 backspace, H2/H3/H4 전환
- 조합 중 Draft 저장 버튼 disabled 여부
- 조합 종료 후 명시적 저장과 재접속 시 자모 보존
- undo/redo, link, list, table cell, code block 입력

## 2. macOS Safari Korean IME — 미수행

- Chrome과 같은 조합 시나리오
- 붙여넣기 후 focus와 selection
- 저장 후 새 version 생성 및 preview 확인

## 3. iPhone Safari keyboard/selection — 미수행

- 390px toolbar wrap, virtual keyboard viewport
- 한글 자동 수정, selection handle, 긴 코드 horizontal scroll
- table cell 이동, 이미지/캡션 확인

## 4. macOS VoiceOver — 미수행

- toolbar 버튼 accessible name과 순서
- editor label `Archive 본문 편집기`
- 저장 상태 `aria-live`
- sourceReference와 callout 읽기 순서
- 목록 → 편집 → 미리보기 navigation

## 기록 규칙

실제 장비, OS/browser version, 수행자, 일시, pass/fail, 재현 단계와 영상/스크린샷 위치를 기록한다. 자동화 결과를 수동 pass로 바꾸지 않는다. 이 checklist가 통과하기 전 production 관리자 route와 실제 편집 업무 전환은 금지한다.
