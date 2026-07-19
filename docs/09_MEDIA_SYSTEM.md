# Media System

- **Status:** Proposed storage requirements; editor input policy approved
- **Last Updated:** 2026-07-18
- **Authority:** 이미지·파일 생명주기와 metadata 기준
- **Purpose:** 이미지를 장식 파일이 아닌 추적 가능한 콘텐츠 데이터로 관리한다.

## Stage 7 DB 경계

`media_assets`는 저장 위치·checksum·권리·승인 상태, `media_usages`는 version별 alt/caption/usage/order를 저장한다. 외부 URL은 pending reference일 뿐 발행에는 approved internal media ID가 필요하다. Object storage/upload는 미구현이며 v1 iframe/embed는 금지한다.

## asset 모델

원본 object는 immutable하게 보존하고 DB에 storage key/public URL 정책, alt, caption, source, rights/license, AI-generated flag, MIME/bytes/width/height, checksum, creator, timestamps를 저장한다. content usage는 hero/body/diagram/step/result/OG/download 역할과 order/focal point를 기록한다.

## 파이프라인

업로드 → MIME/magic-byte/size 검증 → malware 고려 → checksum/dedup → dimension/metadata 추출 → 원본 저장 → WebP/AVIF 및 responsive variant 생성 → review(alt/rights) → publish. animated/SVG/document는 별도 안전 규칙을 둔다.

## 표현

hero는 전체 구도를 기본 보존하고 목록 crop은 명시적 focal point만 허용한다. width/height 또는 aspect ratio를 제공해 CLS를 막고 `<picture>`/Next Image로 현대 format fallback을 제공한다. OG는 별도 1200×630 composition으로 관리한다.

## 저장·백업

S3-compatible API를 우선해 provider/MinIO 교체를 가능하게 하되 production 운영 주체는 비용·백업·CDN을 비교해 결정한다. DB backup과 object versioning/replication, manifest+checksum restore drill을 결합한다. 현재 `content/posts → public/images/posts` 복사는 migration 완료까지 유지한다.

## Editor 입력 정책 — 승인

External image URL과 data URL/SVG는 publish할 수 없다. Paste/import 단계에서는 external reference를 `needs_review`로 격리할 수 있으나 publish 전에 내부 media identity로 import해야 한다. 아직 fetch/upload/object storage는 구현하지 않는다. 향후 server fetch는 scheme/host allowlist, DNS/private IP·redirect 재검증, byte/MIME/dimension limit, malware/rasterization 검증을 요구한다. Embed/iframe은 기본 금지이며 provider/origin/sandbox/privacy allowlist가 승인된 dedicated node만 허용한다. 상세 threat model은 [Editor Security and Migration](EDITOR_SECURITY_AND_MIGRATION.md)을 따른다.
