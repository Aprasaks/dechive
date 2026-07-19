# Editor Manual Test Checklist

- **Status:** Manual execution required; automated coverage recorded separately
- **Last Updated:** 2026-07-18
- **Authority:** OS IME·native keyboard·screen reader production gate
- **Purpose:** 자동화가 신뢰성 있게 대체할 수 없는 항목의 사용자 수행 절차와 결과 기록 형식을 제공한다.

## 자동화 완료와 수동 미수행 구분

Stage 5/6 headless Chromium은 composition event, 한국어 문자열, paste sanitizer, keyboard commands, 390/768/1280 layout, aria label과 malicious execution을 검증했다. 이는 실제 OS IME 후보창, 모바일 virtual keyboard, VoiceOver를 통과했다는 뜻이 아니다.

현재 실제 수동 수행 결과: **Codex 환경에서는 GUI/native device 접근이 없어 전 항목 미수행**. 아래 표의 Result는 사용자가 직접 `Pass/Fail/Blocked`, OS/browser version, 날짜와 증거를 기록한다.

## 공통 준비

1. 개발 환경에서 `npm run dev`, `/dev/editor-lab` 접속.
2. 실제 콘텐츠 fixture와 100k fixture 각각 시험.
3. Fail 시 fixture, cursor 위치, 입력 순서, console, 화면 녹화/스크린샷을 기록한다.
4. 실제 개인정보나 비공개 문서는 paste하지 않는다.

## Matrix

| 환경 | 항목 | 기대 결과 | Result |
|---|---|---|---|
| macOS Chrome | 한국어 후보창·빠른 입력·조합 중 Backspace | 자모 분리/중복/커서 점프 없음, 미완성 autosave 없음 | Not run |
| macOS Chrome | 조합 중 heading 전환 | 조합이 안전하게 종료되거나 명확히 유지 | Not run |
| macOS Safari | 위 IME 전체+undo/redo+paste | Chrome과 의미 동일, hydration/console error 없음 | Not run |
| iPhone Safari | 자동 수정, selection, virtual keyboard resize | toolbar/editor가 가려지거나 viewport가 고정되지 않음 | Not run |
| iPhone Safari | table cell 이동·긴 code scroll | document 전체 horizontal overflow 없이 셀/코드 내부 scroll | Not run |
| Android Chrome | Gboard 한국어, selection, paste | 조합/selection 안정, autosave composition guard | Not run |
| macOS VoiceOver | page→fixture→toolbar→editor 순서 | landmark/label/button name이 의미 순서로 발표 | Not run |
| macOS VoiceOver | Callout/SourceReference/Unknown | note/alert와 label을 중복 없이 발표 | Not run |
| macOS VoiceOver | 저장 상태 aria-live | dirty/saving/saved/failed가 과도하지 않게 발표 | Not run |
| iOS VoiceOver | editor 진입·문단/heading 이동 | focus trap 없음, toolbar 복귀 가능 | Not run |

## 상세 입력 시나리오

- `한글 입력을 빠르게 이어서 씁니다`를 세 번 입력하고 조합 중 Backspace 3회.
- 조합 중 toolbar `제목 2`, 목록, code 전환을 각각 시험.
- 표 첫/중간/마지막 셀에서 Tab/Shift+Tab과 한글 입력.
- 100k fixture에서 처음/중간/끝으로 이동하고 5분 scroll/edit.
- Google Docs/Word에서 heading, bold/link, nested list, table을 paste한 뒤 style 제거와 의미 보존 확인.
- 외부 image 포함 paste가 publish 전에 review를 요구하는지 확인.
- 저장 실패 simulation 후 VoiceOver 발표와 재시도 가능성 확인.

## 승인 기준

Chrome+Safari macOS IME, iPhone Safari keyboard/selection, macOS VoiceOver 핵심 흐름은 production editor 채택 전 필수다. Android/iOS VoiceOver 일부는 장비 미확보 시 Blocked로 명시할 수 있으나 공개 전 별도 device test가 필요하다.
