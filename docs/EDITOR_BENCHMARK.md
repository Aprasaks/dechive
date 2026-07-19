# Editor Benchmark

- **Status:** Stage 4 comparison complete; TipTap runtime prototype passed conditionally
- **Last Updated:** 2026-07-18
- **Authority:** TipTap·BlockNote·Lexical 및 본문 형식 비교 근거
- **Purpose:** 실제 legacy 표본의 구조 보존 결과로 editor와 canonical body 결정을 좁힌다.

## 방법과 범위

`node scripts/editor-benchmark/run.mjs`가 [manifest](../fixtures/editor-benchmark/manifest.json)의 원본을 읽기 전용으로 parse한다. `Markdown → neutral DechiveDocument → normalized Markdown`을 수행하고 재parse한 구조를 [report](../fixtures/editor-benchmark/output/report.json)에 기록한다. 원문 자동 수정은 없고 결과는 deterministic JSON이다. 제품 패키지는 설치하지 않았으며 production import graph와 분리했다.

## 실제 fixture와 결과

| fixture | 실제 파일 | 핵심 위험 | 관찰 | 등급 |
|---|---|---|---|---|
| short Archive | `can-we-learn-directly-from-ai-answers.ko.md` | source URL 없음 | H 4, image 1 | preserved |
| code-heavy Archive | `prompt-real-world-guide.ko.md` | 장문/code | H 62, code 45 | preserved |
| table/null/images | `what-null-leaves-behind.ko.md` | YAML null, 상대 image | H 5, code 9, table 1, image 3, null tag 1 | body preserved; metadata review |
| multi-image Deep Dive | `data-analysis-beyond-business.ko.md` | 장문/복수 media | H 50, code 1, table 7, image 5 | preserved |
| heading-heavy KO | `ai-era-agile-verification.ko.md` | anchor/relative image | H 104, code 3, image 2 | preserved |
| corresponding EN | `ai-era-agile-verification.en.md` | translation drift | H 43, code 4, image 1 | preserved independently |
| Book note | `knowing-what-we-know.ko.md` | locator 부족 | H 5 | body preserved; source review |
| AI Digest | `aiUpdates.ts`, 2026-07-02 | 여러 change/source granularity | slug 3을 data slice로 식별 | transformable; custom importer |

모든 Markdown fixture에서 heading 수/level/생성 anchor, paragraph/list, code 수와 language/meta, table, image path, link, blockquote, normalized text hash가 일치했다. KO/EN은 104 대 43 heading으로 구조가 다르므로 하나의 공유 body가 아니라 독립 locale version이어야 한다. 문자열 formatting은 normalized되며 원래 공백과 fence 표현은 보존 대상이 아니다.

등급은 `preserved`, `transformable`, `custom extension required`, `lossy`, `unsupported`를 사용한다. YAML null, 출처 부재는 body 변환 손실이 아니라 migration review 항목이다.

## 제품 비교

| 항목 | TipTap | BlockNote | Lexical |
|---|---|---|---|
| 기반/Next.js | ProseMirror, client editor; App Router에서 SSR 즉시 render 비활성 필요 | React block editor; Next.js dynamic/client 경계 안내 | framework-agnostic core+React; headless/SSR glue 직접 구성 |
| TypeScript/custom node | 강함; extension/node schema와 command 생태계 | block schema/custom block이 빠름 | 강함; custom node·plugin을 가장 낮은 수준에서 직접 설계 |
| table/code/image | 공식 extensions; code language는 attr, highlighting 별도 | built-in block UX 우수, custom props 가능 | packages 존재하나 image/caption 등 product node 조립 필요 |
| heading id/source/callout | custom attrs/extensions 필요 | custom block/property 필요 | custom nodes/transforms 필요 |
| Markdown round-trip | Markdown extension이 beta; custom tokenizer 가능, comment와 복합 table cell 제약 | 공식 문서가 import/export를 lossy라고 명시 | transformers를 직접 구성; custom node마다 import/export 책임 |
| HTML/JSON | JSON 저장과 server/static render 도구 | block JSON이 native non-lossy, HTML/Markdown export는 이탈 시 손실 가능 | EditorState JSON과 DOM import/export; node version migration 직접 관리 |
| slash/drag/paste/mobile | extension/UI 선택 폭 큼; 조합 테스트 필요 | 기본 UX가 가장 완성됨 | playground 예시는 풍부하나 제품 UI 조립비가 큼 |
| 접근성/testability | ProseMirror 기반, custom UI 검증 필요 | 완성 UI 이점, custom UI 접근성 검증 필요 | 접근성·성능을 핵심 목표로 명시, headless unit test 유리 |
| 협업 | Yjs 계열 지원; JSON만으로 collaborative history 복구 불가 | collaboration 제공 | collaboration package/extension, 별도 state 전략 필요 |
| license/활동성 | core MIT; 유료 cloud/기능 경계 확인 | MPL-2.0 core 및 package별 확인 필요 | MIT, 활발한 월별 release |
| lock-in | ProseMirror JSON/extension attrs | BlockNote block JSON와 UI 결합 | Lexical node JSON/version |

공식 근거: TipTap의 [Next.js 안내](https://tiptap.dev/docs/editor/getting-started/install/nextjs), [Markdown beta와 제약](https://tiptap.dev/docs/editor/markdown), [JSON/HTML output](https://tiptap.dev/docs/guides/output-json-html); BlockNote의 [Markdown 손실 경고](https://www.blocknotejs.org/docs/features/import/markdown), [import/export](https://www.blocknotejs.org/docs/features/import), [custom blocks](https://www.blocknotejs.org/docs/features/blocks/custom), [Next.js 안내](https://www.blocknotejs.org/docs/getting-started/nextjs); Lexical의 [repository/라이선스](https://github.com/facebook/lexical), [serialization](https://lexical.dev/docs/concepts/serialization), [Markdown](https://lexical.dev/docs/packages/lexical-markdown). 버전·bundle은 설치 직전 lockfile prototype에서 다시 측정한다.

## Dechive 요구별 판정

- 기본 heading/list/code/table/image/link: 세 후보 모두 `transformable`; TipTap/BlockNote는 빠른 구성, Lexical은 더 많은 glue.
- 영속 heading anchor, figure/caption, sourceReference, callout, embed: 모두 `custom extension required`.
- Markdown의 YAML/frontmatter, 원래 formatting, source entity: editor body 밖 importer/domain 계층 책임.
- 복합 table cell과 provider-specific node의 범용 Markdown: `lossy` 가능성이 있어 canonical Markdown 단독은 부적합.
- raw HTML: 안전상 `unsupported` 기본값; allowlist importer만 별도 검토.

## 저장 형식 A–E

| 후보 | 보존/교체 | 검색·diff·AI | 운영/복구 | 판단 |
|---|---|---|---|---|
| A editor JSON만 canonical | editor 안에서는 높지만 provider schema lock-in | extractor가 provider 종속 | editor 없이 복구 어려움 | 비추천 |
| B Markdown만 canonical | custom figure/source/table metadata 손실 | text diff는 쉬움 | portable하지만 요구 구조 부족 | legacy import/export만 |
| C HTML만 canonical | presentation과 의미 혼합 | semantic query/diff 어려움 | sanitize/migration 부담 | renderer output만 |
| D neutral Dechive JSON canonical | versioned domain semantics 보존, adapter 교체 가능 | structured extract/diff/AI 유리 | schema migration 책임 증가 | **추천** |
| E editor JSON+normalized export | 복구 보조는 좋으나 dual canonical 충돌 위험 | 두 산출물 drift | editor lock-in 잔존 | draft/cache+export로만 사용 |

## 추천

에디터는 **TipTap을 1순위 prototype**으로 추천한다(확신도: 중간). ProseMirror schema/extension과 server renderer가 Dechive adapter에 가장 직접적이고, BlockNote보다 document semantics 통제가 쉬우며 Lexical보다 완성 editor 구축량이 작다. 단, Markdown extension beta와 React 19/Next 16 hydration, 100k자 KO 문서, IME·mobile·a11y를 실제 package spike로 통과하기 전 최종 production 승인으로 보지 않는다.

canonical body는 **D: versioned neutral DechiveDocument JSON**을 권고한다(확신도: 중상). HTML/plain text/normalized Markdown은 파생물이다. TipTap JSON은 draft cache일 수 있으나 canonical이 아니다.

## 아직 검증하지 못한 항목

TipTap runtime 결과는 [Editor Runtime Prototype](EDITOR_RUNTIME_PROTOTYPE.md)을 따른다. React 19/Next 16, 100k자, custom nodes, composition-aware autosave, 3 viewport는 통과했다. 실제 OS IME, screen reader, paste fidelity, GFM table export, sanitization/version migration은 남았으며 실패 시 Lexical로 재평가한다.
