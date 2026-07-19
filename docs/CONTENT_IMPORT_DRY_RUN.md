# Content Import Dry Run

- **Status:** Completed against local PostgreSQL
- **Last Updated:** 2026-07-18
- **Authority:** Stage 8 실제 표본 import/read-back 결과
- **Purpose:** 전체 migration 전에 확인된 보존 수준과 review 위험을 기록한다.

## 표본과 결과

| 표본 | 목표 | 구조 | 결과 |
|---|---|---|---|
| `what-null-leaves-behind.ko.md` | Knowledge/article KO | table/code/image, YAML null 위험 | exact canonical read-back; null/source/media warning |
| 대응 EN | Knowledge/article EN | table/code/image | exact; KO와 같은 content/translation group, 독립 version |
| `ai-era-agile-verification.ko.md` | Knowledge/deep_dive/deep | H104, code3, image2 | exact; needs_review |
| 대응 EN | Knowledge/deep_dive/deep | H43, code4, image1 | exact; 구조 차이 보존 |
| `knowing-what-we-know.ko.md` | Knowledge/book_note | H5, link1 | exact; source locator/서지 보강 필요 |
| `aiUpdates.ts#2026-07-02` | Digest + 3 AIUpdate drafts | order 0,1,2 | Digest route만 보존; detail slug는 candidate |

## 비교

DB read-back canonical JSON의 heading level/anchor, code language, table, image legacy path, link, normalized text hash는 import 직전 document와 동일했다. 결과 분류는 5 Knowledge 모두 `exact`이다. Normalized Markdown/HTML/plain text/checksum도 재생성했지만 needs_review import에는 published artifact row를 만들지 않았다.

KO/EN은 같은 translation 연결을 가지나 body/version/current draft가 독립이다. Deep Dive의 104/43 heading drift를 정상 데이터로 보존했다.

## AI Update 분해

2026-07-02 Digest에서 처음 3개 item을 원래 order로 분리했다. `legacyAnchor`를 migration metadata에 보존하고 item ID를 slug candidate로 기록했다. 공개 detail route는 생성하지 않았다. Source row는 pending review이며 여러 변화가 섞이거나 source가 모호한 경우 자동 추가 분해하지 않는다.

## 재실행

첫 실행은 6 source identity를 만들고, 즉시 두 번째 실행은 6개 모두 `skipped`였다. Content/localization/version duplicate는 0이다. 다른 checksum은 overwrite 없이 감지됐다. 기계 보고서는 [import-report.json](../fixtures/content-import/output/import-report.json), 요약은 [import-report.md](../fixtures/content-import/output/import-report.md)다.

Stage 9의 확대 결과는 [Staging Import Report](STAGING_IMPORT_REPORT.md)가 권위다. 22 localization local rehearsal은 성공했으나 Neon credential 부재로 cloud 실행은 하지 않았다.
