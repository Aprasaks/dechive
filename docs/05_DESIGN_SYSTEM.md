# Design System

- **Status:** Implemented baseline for global shell and home
- **Last Updated:** 2026-07-18
- **Authority:** 공개·관리 UI의 시각/반응형 기준
- **Purpose:** 라이트 전용 교육 플랫폼의 일관된 디자인 원칙을 정의한다.

## 절대 규칙

다크모드, toggle, system dark 대응을 제공하지 않는다. 검은 전체 배경, 네온, glass, hologram, AI 얼굴·로봇, 입자 효과, 과도한 gradient/shadow, 모든 영역의 rounded card화를 금지한다.

## 기반

- Surface: warm white/cream, secondary pale gray; text: deep charcoal; accent: deep navy/muted blue.
- 본문 sans, 제한된 display serif를 사용한다. 한국어 본문 line-height 1.7~1.9, 좁은 읽기 폭과 명확한 heading scale을 둔다.
- 얇은 중립 border, 여백, typography, editorial alignment로 계층을 만든다.
- 상태는 색만으로 전달하지 않고 label/icon/text를 병행한다.

## 구현 토큰

`src/app/globals.css`의 `:root`를 라이트 전용 단일 기준으로 사용한다.

- 배경/표면: `--background`, `--surface`, `--surface-elevated`
- 텍스트: `--foreground`, `--secondary-foreground`, `--muted-foreground`
- 선: `--border`, `--border-subtle`
- 강조: `--accent`, `--accent-hover`, `--accent-soft`
- 상태/접근성: `--success`, `--warning`, `--danger`, `--focus-ring`
- 레이아웃: `--page-max: 90rem`, `--reading-max: 46rem`, 반응형 `--page-gutter`, `--section-space`

버튼은 채워진 primary, border 기반 secondary, underline/text link로 구분한다. 콘텐츠 진입은 선으로 구획한 entry, featured는 이미지와 본문 조합, story는 accent-soft 편집자 note로 서로 다른 구조를 사용한다.

## 이미지 규칙

- 대표 이미지·구조도처럼 전체 구도가 중요한 자산은 `contain` 또는 intrinsic ratio로 전부 보인다.
- 동일 비율의 목록 thumbnail만 승인된 focal point와 함께 `cover`를 쓴다.
- 본문 이미지는 원본 비율을 유지하고 확대 viewer를 제공한다. crop/variant는 media metadata에 기록한다.

## 반응형

- Mobile first: header는 logo+menu/search, 본문 1열, tap target ≥44px.
- Tablet: 진입 영역 2열, 콘텐츠+이야기 1~2열.
- Desktop: 넓은 editorial grid, hero/진입/featured의 비대칭 구성이 가능하되 본문 measure를 유지한다.

## 접근성

WCAG AA 대비, keyboard focus, skip link, semantic heading, reduced motion, 의미 있는 alt/caption을 기본 완료 기준으로 둔다. 라이트 마이그레이션은 `layout.tsx` 강제 class→global token→component hard-coded dark class 순으로 화면 회귀 검증한다.

전역 `html.dark`, dark variant와 dark token은 제거했다. `atom-one-dark`는 일반 UI 테마가 아닌 코드 문법 강조이며 레거시 코드 블록 대비 재설계 전까지 유지한다. Archive, Deep Dive, AI Updates 등 레거시 화면의 자체 dark palette는 후속 화면별 마이그레이션 대상으로 남긴다.
