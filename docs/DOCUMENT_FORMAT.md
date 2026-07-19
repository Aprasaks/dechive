# Dechive Document Format

- **Status:** Canonical format approved; schema v2 prototype validated
- **Last Updated:** 2026-07-18
- **Authority:** 본문 저장·변환·복구 형식의 기술 기준
- **Purpose:** 에디터 제품과 무관하게 콘텐츠 구조를 보존하는 versioned document contract를 정의한다.

## 결정 권고

Dechive 소유의 versioned, ProseMirror-compatible document JSON을 canonical body로 승인한다. 거대한 중립 AST는 만들지 않는다. HTML은 renderer output/cache, Markdown은 legacy import·복구·published export, plain text는 검색·AI 입력용 파생물이다. editor session JSON은 draft autosave에 쓸 수 있으나 canonical과 혼동하지 않는다. 모든 published revision에는 normalized Markdown을 생성하고 draft autosave마다 생성하지 않는다.

근거는 [Editor Benchmark](EDITOR_BENCHMARK.md)다. 7개 실제 Markdown 표본을 `Markdown → DechiveDocument → normalized Markdown`으로 변환했을 때 측정 대상 구조가 보존됐다. 이 결과는 production adapter 자체의 통과를 뜻하지 않는다.

## 최소 schema v1

```ts
type Document = { type: "doc"; schemaVersion: 1; content: Node[] };
type Text = { type: "text"; text: string; marks?: Mark[] };
```

현재 원문에 필요한 node는 `paragraph`, `heading`, `text`, `bold`, `italic`, `strikethrough`, `link`, `blockquote`, `bulletList`, `orderedList`, `listItem`, `codeBlock`, `inlineCode`, `table`, `tableRow`, `tableCell`, `image`, `divider`, `hardBreak`다. 가까운 제작 요구로 확실한 확장은 `figure`, `caption`, `callout`, `sourceReference`, `embed`다. 실습 전용 구조는 본문 node가 아니라 Practice detail에 둔다.

핵심 속성:

- `heading`: `level`, 영속적인 `anchorId`. 최초 import 때 결정하고 제목 수정 시 자동 변경하지 않는다. 중복은 `-2` suffix로 해소한다.
- `codeBlock`: `language`, `meta`, 선택 `filename`, `caption`, `highlightLines`. 문법 강조 theme는 저장하지 않는다.
- `image`: migration 중에는 `src`, `alt`, `title`; media 이전 뒤에는 `mediaId`가 identity이며 URL은 파생한다.
- `figure`: `mediaId`, `alt`, `caption`, `alignment`, `width`, 선택 `sourceReferenceId`.
- `sourceReference`: `sourceId`, 선택 `locator`, `note`. 출처 entity 자체를 body에 중복하지 않는다.
- `link`: `href`, 선택 `title`; 내부 링크는 가능하면 relation resolver가 content identity를 함께 관리한다.

## Versioning과 validation

- document에는 증가하는 정수 `schemaVersion`을 둔다. DB migration과 document migration은 분리한다.
- adapter 입력 전 JSON Schema 또는 동등한 runtime validation을 수행한다.
- migration은 순수 함수 `vN → vN+1`, 원본 version 보존, checksum, dry-run report를 요구한다.
- 알 수 없는 node는 삭제하지 않고 `unknown` envelope에 원 type/payload를 보존하고 `needs_review`로 격리한다. 공개 renderer는 안전한 경고 placeholder를 사용하며 임의 HTML을 실행하지 않는다.
- backward reader는 최소 직전 두 schema version을 읽고, write는 최신 version만 생성한다.

Validation status와 limits, sanitizer, v1→v2 migration은 [Editor Security and Migration](EDITOR_SECURITY_AND_MIGRATION.md)이 권위 문서다. Published table은 단순 구조를 GFM, 복합 구조를 sanitized HTML fallback으로 export하고 revision metadata에 mode/warnings/version을 기록한다.

## Adapter 경계

`MarkdownImporter`, `EditorAdapter`, `HtmlRenderer`, `MarkdownExporter`, `PlainTextExtractor`를 분리한다. editor adapter는 Dechive node와 provider node를 양방향 매핑하고 unsupported node 목록을 반환한다. 저장 전 canonical validation과 round-trip invariant를 통과해야 한다.

Markdown importer는 YAML 값을 자동 보정하지 않는다. YAML `null` tag, 상대 이미지, 누락 source는 `needs_review`로 남긴다. Markdown exporter는 의미 보존용 normalized 산출물이며 원래 공백·bullet 문자·줄바꿈까지 동일하다고 약속하지 않는다. HTML은 sanitize된 renderer 산출물이며 작성 원본이 아니다. plain text에는 caption과 source label을 포함하되 URL·presentation metadata는 별도 index field로 둔다.

## Backup과 복구

백업 단위는 content metadata, 모든 immutable version의 canonical JSON, normalized Markdown, source/relation/media manifest와 checksum이다. 에디터가 없어도 JSON schema와 exporter만으로 Markdown/HTML을 복원할 수 있어야 한다. provider JSON만 남는 백업은 복구 완료로 인정하지 않는다.

## 미검증 gate

TipTap runtime 결과는 [Editor Runtime Prototype](EDITOR_RUNTIME_PROTOTYPE.md)을 따른다. React/Next hydration, 자동화 composition guard, 100k자, custom node, JSON/HTML/Markdown 기본 경로는 통과했다. GFM table export, 실제 OS IME와 native mobile keyboard, screen reader, paste fidelity, sanitization, version migration은 미검증이다.
