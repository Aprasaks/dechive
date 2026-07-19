# Editor Runtime Prototype

- **Status:** Stage 5 runtime complete; TipTap conditionally accepted pending manual OS gates
- **Last Updated:** 2026-07-18
- **Authority:** TipTap runtime 호환성·성능·adapter 검증 근거
- **Purpose:** 실제 Dechive fixture로 TipTap과 ProseMirror-compatible document 방향의 현실성을 검증한다.

## 범위와 보호

개발 전용 `/dev/editor-lab`은 `NODE_ENV=production`에서 서버가 즉시 404를 반환한다. `robots: noindex,nofollow,nocache`, sitemap/navigation 미등록이며 fixture는 public asset이 아니라 개발 환경 server filesystem에서만 읽는다. 공개 Header/Footer/콘텐츠/URL은 수정하지 않았다. route는 production build graph에 존재하지만 응답은 404다.

## 설치 package

| package | version/license | 이유 | bundle/제거 |
|---|---|---|---|
| `@tiptap/react` | 3.28.0/MIT | React 19 editor runtime와 `EditorContent` | lab client bundle만; lab 제거 시 삭제 가능 |
| `@tiptap/pm` | 3.28.0/MIT | persistent anchor ProseMirror plugin/state/model | lab extension bundle; TipTap 제거 시 삭제 |
| `@tiptap/starter-kit` | 3.28.0/MIT | paragraph/text/marks/list/code/quote/history/divider | lab bundle; 직접 의존성 |
| `@tiptap/extension-table` | 3.28.0/MIT | table/row/cell/header runtime | lab bundle; 직접 의존성 |
| `@tiptap/html` | 3.28.0/MIT | Node/server HTML verification | 검증 script/server 사용; public client 미포함 |
| `@playwright/test` | 1.61.1/Apache-2.0 | 실제 Chromium viewport/IME/autosave 검증 | devDependency; production bundle 미포함 |

`@tiptap/extension-image`는 설치 후 custom Figure와 중복임을 확인해 제거했다. collaboration, UI kit, AI/cloud/유료 extension, BlockNote, Lexical은 설치하지 않았다. npm audit은 기존 트리를 포함해 13건(2 low/8 moderate/3 high)을 보고했으며 자동 수정은 하지 않았다.

## 구조

- `src/app/dev/editor-lab`: production 차단 server page
- `src/features/editor-lab`: schema helpers, Markdown fixture importer, TipTap extensions, client lab, light-only CSS
- `scripts/editor-runtime`: deterministic Node 검증과 Playwright browser 검증
- `fixtures/editor-runtime/output`: runtime 측정 결과

## Fixture

짧은 Archive, code 45 Archive, table/image Archive, heading 104 KO와 EN 43, Book note, image 5 Deep Dive, 실제 101,480자 EN Deep Dive, AI Update derivative example을 사용했다. 원문은 읽기 전용이다. 상대 image path는 `legacySrc`로 그대로 보존하면서 lab 표시용 `/images/posts/{file}`을 `src`에 분리했다.

## React 19 / Next.js 16과 hydration

Next.js 16.2.3 production build와 React 19.2.4에서 compile/type/static generation이 성공했다. `useEditor({ immediatelyRender:false })`와 client component 경계로 390/768/1280 Chromium에서 hydration/page error가 없었다. production 요청은 코드상 404이며 route는 sitemap에 없다.

## Node와 custom extension 결과

기본/StarterKit: doc(대체), paragraph, text, bold, italic, link, blockquote, bullet/ordered list, listItem, codeBlock, horizontalRule. TableKit: table/row/header/cell.

Dechive custom:

- `doc.attrs.schemaVersion`: TipTap runtime root attr. canonical adapter가 top-level `schemaVersion`과 변환한다.
- `heading.attrs.anchorId`: 기존 ID 유지, 신규 slug 생성, 중복 `-2` 처리. 제목 변경만으로 기존 ID를 변경하지 않는다.
- `figure`: `mediaId/src/legacySrc/alt/alignment/width/sourceReferenceId`와 child `caption`.
- `sourceReference`: `sourceId/locator/note/label`, HTML `aside[role=note]`.
- `callout`: `kind/title`와 block content.
- `unknownBlock`: `originalType/payload/fallbackText`, atom으로 원 payload 보존, 관리자 경고와 publish 차단.

모든 custom attribute는 Dechive 소유다. TipTap command/plugin API는 runtime dependency지만 document 의미는 별도 extension에 한정했다.

## Adapter와 JSON 분석

실제 흐름은 `Markdown → MDAST importer → ProseMirror-compatible Dechive JSON → TipTap → session JSON → canonical root adapter → HTML/Markdown/plain text/checksum`이다.

- ProseMirror 공통: `{type, attrs?, content?, text?, marks?}` tree, doc/paragraph/text 구조.
- StarterKit naming: `bulletList`, `orderedList`, `listItem`, `codeBlock`, `horizontalRule`, mark names.
- TipTap/runtime-specific: extension 등록 순서와 commands, root schema version이 `doc.attrs`에 위치, Link default attrs, TableKit schema attrs.
- Dechive-specific: `anchorId`, Figure/Caption/SourceReference/Callout/UnknownBlock와 그 attrs.

큰 양방향 AST 복제 계층은 필요하지 않다. document tree는 ProseMirror-compatible하게 유지하고 경계 adapter는 root version, allowlisted node/attrs validation, unknown quarantine, export policy만 담당하는 얇은 계층이 적절하다. `editor.getJSON()`을 검증 없이 canonical로 저장하는 것은 금지한다.

## Round-trip과 rendering

9개 fixture에서 JSON stringify/parse equality, schema validation, deterministic Markdown, HTML output을 통과했다. normalized Markdown은 published revision snapshot에서만 만든다. table은 현재 Markdown exporter에서 HTML fallback marker가 필요해 완전한 GFM export로는 미완성이다. Figure/Callout/SourceReference는 의미 보존 변환이지만 다른 Markdown consumer에서는 presentation이 축약된다.

## Autosave와 IME

dirty→700ms debounce→saving→saved/failed 상태, 마지막 저장 시각, failure simulation, reload 후 restore를 localStorage로 검증했다. compositionstart부터 850ms가 지나도 저장 상태가 `composing`으로 유지됐고 compositionend 뒤에만 저장됐다. Chromium `insertText`로 빠른 한국어 문자열이 자모 분리 없이 보존됐다. 이는 자동화된 composition event 검증이며 macOS 실제 OS IME 후보창/모바일 native keyboard 수동 검증은 남아 있다. autosave는 session JSON만 저장하고 Markdown을 만들지 않는다.

## Unknown node

의도적 `legacyInteractiveDiagram` payload가 JSON save/load와 editor 안에서 유지됐다. 정상 앞뒤 node는 보존되고 plain-text fallback을 제공하며 경고가 노출된다. unknown이 하나라도 있으면 기존 snapshot을 지우고 새 Publish Snapshot을 차단한다. 자동 paragraph 치환은 없다.

## 성능 관찰

개발용 Mac/headless Chromium/dev server 단일 실행치이며 benchmark SLA가 아니다.

| 측정 | 관찰 |
|---|---:|
| editor ready/navigation | 961ms |
| heading 104 fixture 전환 | 177ms |
| code 45 fixture 전환 | 99ms |
| image 5 fixture 전환 | 147ms |
| 101,480자 EN fixture 전환 | 115ms |
| 입력 후 next animation frame | 14.2ms |
| 100k fixture snapshot serialization | 6.40ms |
| 관찰 JS heap | 약 35.1MB |

Node server renderer에서는 101,480자 fixture HTML 24.20ms/Markdown 0.43ms, 119,279자 합성 문서 HTML 46.68ms/Markdown 1.18ms였다. raw 수치는 `fixtures/editor-runtime/output/runtime-report.json`에 있다.

## 접근성과 반응형

390/768/1280에서 horizontal page overflow 없음, toolbar 자체 horizontal scroll, table/code block 내부 scroll, contain 이미지, focus-visible, editor/toolbar/fixture/상태 accessible label을 확인했다. keyboard toolbar, heading/list/code, undo/redo, table cell, snapshot을 자동화했다. 색은 light-only이며 theme toggle/system dark CSS가 없다. 실제 screen reader 발화 순서, native mobile keyboard resize, 복합 copy/paste fidelity는 수동 검증이 남았다.

## 결론

TipTap은 조건부 production editor 후보로 승인됐다. Stage 6에서 GFM/HTML table export, complex paste, malicious payload sanitization, schema migration을 통과했다. 남은 gate는 [Manual Checklist](EDITOR_MANUAL_TEST_CHECKLIST.md)의 실제 OS IME/mobile keyboard/VoiceOver다.

Canonical body는 Dechive 소유의 versioned, ProseMirror-compatible document schema로 승인됐다. 보안 경계는 [Editor Security and Migration](EDITOR_SECURITY_AND_MIGRATION.md)을 따른다.
