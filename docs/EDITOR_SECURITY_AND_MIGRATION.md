# Editor Security and Migration

- **Status:** Stage 6 security/export/migration policy approved; CMS implementation not started
- **Last Updated:** 2026-07-18
- **Authority:** DechiveDocument 입력 보안·validation·migration·published artifact 정책
- **Purpose:** production editor 후보가 지켜야 할 신뢰 경계와 재현 가능한 검증 결과를 정의한다.

## 결론

Canonical body는 Dechive 소유의 versioned ProseMirror-compatible JSON이다. 거대한 별도 AST를 두지 않고 Dechive가 schemaVersion, node/mark/attribute allowlist, custom 의미, validation, migration, unknown quarantine와 publish rule을 통제한다. TipTap은 이 계약을 편집하는 조건부 production 후보다.

검증 자료는 `fixtures/editor-security/**`, 실행은 `npm run verify:editor-security`, 결과는 `fixtures/editor-security/output/security-report.json`이다.

## NPM audit 분석

### 초기 상태와 조치

초기 13건은 Low 2, Moderate 8, High 3이었다. 자동 audit fix는 실행하지 않았다.

| package | 직접성/chain | advisory·영향 범위 | Dechive 노출 | 조치 |
|---|---|---|---|---|
| `next@16.2.3` | direct production | RSC/Cache Components DoS, Proxy bypass, WebSocket SSRF 등 `<16.2.5/6` | 공개 runtime. 현재 proxy/cache component/WebSocket upgrade를 쓰지 않아 일부 경로는 비활성이지만 원격 표면이므로 실제 영향 있음 | `16.2.6` patch upgrade; High 제거, breaking change 없음 |
| `fast-uri@3.1.0` | `shadcn → MCP SDK → ajv → fast-uri` | encoded path traversal `<=3.1.0`, host confusion `<=3.1.1` | shadcn CLI dev-only; public runtime import 없음 | shadcn을 devDependency로 이동, transitive 수정판 update; High 제거 |
| `hono@4.12.12` | `shadcn → MCP SDK → hono/@hono/node-server` | CORS credentials reflection `<4.12.25` 포함 | dev CLI only; Dechive는 Hono server/JWT/CORS/static handler 미사용 | transitive `>=4.12.25` update; High 제거 |

최종 audit는 **High 0, Moderate 9, Low 2, 총 11**이다.

| 남은 package | chain/범위 | threat와 판단 | 대응 |
|---|---|---|---|
| `@anthropic-ai/sdk@0.82` Moderate | direct devDependency, local filesystem memory tool `0.79–0.91.0` | 해당 memory tool과 AI 기능 미사용, production bundle 미포함 | 사용 전 major upgrade 검증; 현재 제거 후보 |
| `postcss@8.4.31`/`next` Moderate | Next internal, `<8.5.10` | untrusted CSS를 `<style>`로 stringify할 때 XSS. 앱은 사용자 CSS 입력을 처리하지 않음 | 사용 방식 완화+Next upstream patch 대기; 강제 override 금지 |
| `js-yaml` Moderate | gray-matter 3.x, ESLint/shadcn 4.x | repeated alias merge DoS. legacy Markdown은 trusted repository 파일이나 향후 import는 untrusted 가능 | import byte/depth limit; gray-matter 교체/upgrade spike 필요 |
| `protobufjs` Moderate | Google Analytics Data→google-gax | 공격자가 protobuf schema name을 공급해야 함; 현재 고정 Google schema | analytics dependency update 추적; public editor 무관 |
| `brace-expansion` Moderate | ESLint/ts-morph tooling | crafted numeric glob + user interaction DoS; build tooling only | patched upstream update, untrusted glob 금지 |
| `express-rate-limit`/`ip-address` Moderate | shadcn→MCP SDK dev-only | Address6 HTML helper XSS; 해당 helper/server 미사용 | shadcn dev-only 유지, upstream update |
| `qs` Moderate | shadcn→MCP SDK→Express dev-only | 특정 stringify option/array로 DoS; public runtime 미사용 | upstream update |
| `@babel/core` Low | shadcn/ESLint | local source map arbitrary file read, local/build context | trusted repository build만 수행, update 추적 |
| `esbuild` Low | tsx | Windows dev server arbitrary file read; macOS, esbuild serve 미사용 | tsx update 추적; public runtime 없음 |

`sanitize-html`은 MIT 직접 production dependency다. HTML/clipboard import allowlist에 사용하며 lab client와 server verification에 포함된다. 향후 server import pipeline으로 옮기면 public editor client에서 제거할 수 있다.

## Input threat model

| 입력 | 주요 위협 | 정책 |
|---|---|---|
| keyboard | oversized/deep content, invalid attrs | transaction 후 draft limits, publish full validation |
| clipboard HTML | script/event/style/SVG/iframe/javascript/data/external tracker | HTML sanitizer 후 JSON validator 재검증 |
| Markdown import | raw HTML, huge YAML aliases, relative media, malformed table | byte limit, raw HTML quarantine, metadata parser limit, needs_review |
| document JSON | unknown node/mark, prototype keys, malformed tree, huge attrs | parse size limit+allowlist+prototype key rejection |
| legacy migration | missing source/media, old schema, unknown | immutable source, deterministic migration, needs_review |
| image URL | tracking, SVG script, data URL, path traversal | publish는 internal media reference만; external은 review quarantine |
| external link | javascript/data/custom schemes, opener | `https/http/mailto`, internal `/`, `#`; renderer rel 정책 |
| embed | iframe/script/tracking | v1 미허용; 향후 provider+origin+sandbox allowlist node |
| sourceReference/callout | markup in string attrs | markup 금지, text로만 render |
| code block | script-looking text | 실행하지 않고 escaped text로 render |
| table HTML fallback | active tags/attrs | exporter가 자체 safe HTML 생성; 재import sanitizer 필수 |

## Sanitization policy와 결과

Raw HTML을 신뢰하지 않는다. `sanitize-html` policy 1.0.0은 semantic text/heading/list/code/table/figure만 허용하고 script/style/iframe/svg/event/class/style을 제거한다. Links는 http/https/mailto/internal/hash만 허용한다. Image는 internal `/images/**` 또는 fixture reference만 허용하며 external/data/SVG는 quarantine한다. React escape는 마지막 렌더링 방어일 뿐 sanitization 경계가 아니다.

9개 악성 HTML fixture(script, onerror, javascript/data URL, iframe, SVG, style, malformed table, external image)는 import→JSON→server HTML에서 scriptable pattern 0건이었다. Unknown HTML payload는 draft `needs_review`, publish `rejected`; source note/callout title markup, 35-depth list, 70KB attr, invalid media, javascript JSON link는 draft/publish 모두 rejected다. External image JSON은 `needs_review`로 보존하며 publishable 상태가 아니다.

삭제보다 quarantine가 원칙이지만 명백한 executable tag/attribute는 HTML input boundary에서 제거하고 warning/provenance를 남긴다. 구조를 복원할 수 없는 unknown JSON은 payload를 보존한다.

## Document validation

Prototype limit:

- schema v1/v2, root `doc`, allowlisted 25 node/5 mark
- node별 attrs와 required anchor/source/media
- link protocol allowlist
- heading level 1–6와 unique anchor
- maximum depth 30, node 20,000, total text 2M, single text 200k, attr 64KiB
- prototype-significant key 금지
- table→row→cell/header tree 검증
- internal media path/fixture reference 검증

결과는 `valid`, `valid_with_warnings`, `needs_review`, `rejected`다. Draft는 unknown node/attribute와 external media를 원문 보존 상태로 load할 수 있지만 executable URL, markup attr, oversize/depth/malformed tree는 저장도 거부한다. Publish는 unknown/미승인 attribute/duplicate anchor/외부 media를 통과시키지 않는다. Missing alt는 warning이다.

자동 처리는 heading 신규 anchor/중복 suffix 생성과 sanitized HTML의 active-content 제거뿐이다. Unknown payload, external media, migration failure는 임의 변환하지 않는다.

## Schema v1→v2 migration

실제 prototype은 다음을 deterministic하게 변환한다.

- `figure.{mediaId,src,legacySrc}` → `figure.media.{id,displayUrl,legacySrc}`
- `callout.kind` → `callout.tone`
- `sourceReference.locator: string` → `{value,label}`
- root `schemaVersion: 1 → 2`

원본 v1 객체와 checksum은 유지하고 v2 새 객체, before/after checksum, 변화 목록을 만든다. v2 validation→HTML→Markdown을 통과했으며 두 번 실행 report checksum이 동일하다. 실패는 `needs_review`이며 기존 revision을 덮어쓰지 않는다.

정책:

- **Read-time:** 과거 revision preview/복구에 사용하되 결과를 암묵 저장하지 않는다. 장점은 즉시 호환, 단점은 매 read 비용과 renderer 차이.
- **Write-time:** draft 저장 때 최신 schema 강제. 새 편집에는 적합하지만 published immutable revision에는 적용하지 않는다.
- **Batch:** schema 폐기 전 승인된 migration job으로 새 revision 후보 생성. 대량 검증/rollback에 적합.
- **Publish-time:** 편집 중 구버전을 publish하려 할 때 명시 migration+diff 승인. 기본 publish gate.

권고는 read-time adapter + write/publish 최신화 + 필요 시 검토 가능한 batch 조합이다. 과거 published revision은 immutable하며 새 revision으로만 승격한다.

## Table export policy

| fixture | 결과 |
|---|---|
| 단순 text | GFM |
| inline bold/link | GFM |
| inline code | GFM |
| 여러 paragraph | sanitized HTML fallback |
| list/image cell | sanitized HTML fallback |
| colspan/rowspan | sanitized HTML fallback |
| malformed tree | publish rejected |

Published metadata는 `markdownExportMode: gfm|mixed_gfm_html|blocked`, `exportWarnings`, `fallbackNodeCount`, `exporterVersion`을 기록한다. Mixed Markdown의 HTML table은 재import sanitizer→table JSON으로 복구됐다. 단순 GFM 재import는 Stage 4 Markdown importer contract를 사용한다.

## Complex paste

Google Docs, Word-like HTML, 일반 web, Markdown source/code, table, external image, nested list, styled HTML, malicious HTML 10개를 재현했다. Style/class/event/script는 제거됐고 heading/list/table/link/code 의미는 가능한 범위에서 유지됐다. Word table, raw table, nested list는 provider attrs/schema normalization 때문에 `needs_review`; 외부 image는 제거+warning; source application metadata는 보존되지 않으므로 필요 시 paste provenance를 별도 metadata로 기록해야 한다.

## External media와 embed

- External image는 draft 임시 reference만 허용하며 `needs_review`; publish 전 내부 media import를 강제한다.
- `data:` image와 SVG는 허용하지 않는다. 향후 SVG가 필요하면 rasterize/security pipeline을 별도로 둔다.
- External image fetch는 server allowlist, size/MIME/redirect/private-IP 검증 전 구현하지 않는다.
- iframe/embed는 현재 금지한다. 향후 YouTube 등도 provider/origin allowlist, privacy-enhanced URL, sandbox/referrerpolicy, consent를 통과한 dedicated node만 허용한다.

## Published artifact model

논리 필드: `canonicalDocument`, `schemaVersion`, `normalizedMarkdown`, `markdownExportMode`, `exportWarnings`, `fallbackNodeCount`, `exporterVersion`, `renderedHtml?`, `rendererVersion`, `plainText`, `documentChecksum`, `markdownChecksum`, `createdAt`, `createdBy`, `migrationMetadata`.

초기에는 canonical JSON, Markdown, plain text, checksums와 metadata를 DB 논리 record로 보며 rendered HTML은 versioned cache/object artifact를 권고한다. HTML은 rendererVersion이 다르면 재생성한다. Markdown은 DB column 또는 immutable artifact 중 DB/backup benchmark로 결정하지만 canonical JSON과 같은 backup export에 반드시 포함한다. Published revision은 기간 제한 없이 보존한다.

Backup은 revision manifest+canonical JSON+Markdown+checksums+media/source relation manifest다. Restore는 checksum→schema reader/migration availability→JSON validation→Markdown recovery comparison→renderer regeneration 순서다.

## Lab protection

`/dev/editor-lab`은 production server-side `notFound()`로 HTTP 404, sitemap 미포함, noindex metadata, navigation 미노출이다. Fixture는 public/static asset이 아니며 production branch에서 loader가 실행되지 않는다. Build trace는 `turbopackIgnore`로 전체 repository file trace를 막았다. Source map 공개 여부는 hosting 설정에서도 재확인해야 하며 fixture에 secret을 넣지 않는 것이 최종 방어다.

## Unknown ownership와 AI

개별 콘텐츠의 unknown은 콘텐츠 관리자가 원본과 intended meaning을 확인한다. 반복/구조적 문제는 개발자가 version migration을 작성한다. AI는 mapping과 diff를 제안할 수 있지만 자동 적용·자동 publish할 수 없다.
