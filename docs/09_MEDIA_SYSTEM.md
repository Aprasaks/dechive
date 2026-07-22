# Media System

- **Status:** Approved for Knowledge v1; R2 production and local adapter implemented
- **Last Updated:** 2026-07-21
- **Authority:** 이미지·파일 생명주기와 metadata 기준
- **Purpose:** 이미지를 장식 파일이 아닌 추적 가능한 콘텐츠 데이터로 관리한다.

## Stage 7 DB 경계

`media_assets`는 저장 위치·checksum·권리·승인 상태, `media_usages`는 version별 alt/caption/usage/order를 저장한다. 외부 URL은 pending reference일 뿐 발행에는 approved internal media ID가 필요하다. Knowledge v1의 object storage/upload는 local/R2 adapter와 owner API로 구현하며 iframe/embed는 금지한다.

## asset 모델

원본 object는 immutable하게 보존하고 DB에 storage key/public URL 정책, alt, caption, source, rights/license, AI-generated flag, MIME/bytes/width/height, checksum, creator, timestamps를 저장한다. content usage는 hero/body/diagram/step/result/OG/download 역할과 order/focal point를 기록한다.

## 파이프라인

업로드 → MIME/magic-byte/size 검증 → dimension/metadata 추출 → checksum 생성 → 원본 저장 → pending asset → 필수 alt와 version usage 연결 → approved → publish. Knowledge v1은 JPEG/PNG/WebP 원본과 저장된 width/height를 사용하며 자동 WebP/AVIF·responsive variant 생성은 후속 범위다. Knowledge v1의 alt는 필수이며 장식용 이미지는 허용하지 않는다. animated/SVG/document는 별도 안전 규칙을 둔다.

## 표현

hero는 전체 구도를 기본 보존하고 목록 crop은 명시적 focal point만 허용한다. Knowledge v1은 저장된 width/height로 CLS를 줄이고 hero 원본 URL을 OG·Twitter·Article JSON-LD에 재사용한다. 별도 OG composition과 `<picture>`/Next Image variant는 후속 범위다.

## 저장·백업

운영 object storage는 Cloudflare R2의 S3-compatible API를 사용하고 공개 URL은 `MEDIA_PUBLIC_BASE_URL`로 제공한다. 로컬은 `MEDIA_LOCAL_ROOT`에 저장하며 Docker에서 named volume 또는 `/data/media` bind mount를 연결한다. 새 업로드는 object key를 사용하고, 이전에 `source_url`만 가진 미디어 레코드는 기존 URL을 유지해 호환한다. DB backup과 object versioning/replication, manifest+checksum restore drill을 결합한다. 현재 `content/posts → public/images/posts` 복사는 migration 완료까지 유지한다.

## 생명주기

hero 교체나 본문 figure 삭제는 새 immutable Knowledge version에 새 `media_usages` 집합을 저장한다. 이전 version의 usage와 object는 revision history 보존을 위해 즉시 삭제하지 않는다. 업로드 후 Draft에 연결되지 않은 `pending` asset/object는 7일 grace period 뒤 `npm run media:cleanup`으로 object와 DB row를 함께 정리한다. cleanup은 usage가 생긴 행을 삭제하지 않으며, 자동 scheduler 연결은 배포 운영 TODO다. checksum 중복은 현재 dedup하지 않고 UUID key로 별도 object와 asset을 만든다.

## Editor 입력 정책 — 승인

External image URL과 data URL/SVG/GIF는 publish할 수 없다. 새 업로드는 JPEG/PNG/WebP만 허용하고 MIME, magic byte, 10 MiB 파일 크기, 10,000px 최대 dimension을 검증한다. 업로드 asset은 pending으로 저장하고 Knowledge version에 필수 alt와 함께 연결할 때 approved로 전환한다. Paste/import 단계에서는 external reference를 `needs_review`로 격리할 수 있으나 publish 전에 내부 media identity로 import해야 한다. Server fetch는 사용하지 않는다. Embed/iframe은 기본 금지이며 provider/origin/sandbox/privacy allowlist가 승인된 dedicated node만 허용한다. 상세 threat model은 [Editor Security and Migration](EDITOR_SECURITY_AND_MIGRATION.md)을 따른다.

## R2 smoke test — 배포 후

1. Vercel production 환경에서 `MEDIA_STORAGE_PROVIDER=r2`와 R2 관련 6개 변수, `MEDIA_PUBLIC_BASE_URL=https://media.dechive.dev`가 등록되어 있는지 확인한다. 값 자체는 로그에 출력하지 않는다.
2. owner로 로그인한 뒤 `/admin/knowledge/new`에서 테스트용 Knowledge를 만든다.
3. JPEG·PNG·WebP 중 하나를 업로드하고 alt를 입력한다. SVG/GIF는 업로드되지 않아야 한다.
4. 브라우저 Network에서 `POST /api/admin/media`가 200인지 확인하고 응답의 `publicUrl`이 `https://media.dechive.dev/knowledge/...`인지 확인한다.
5. 본문 또는 hero로 연결한 뒤 Draft 저장한다. DB의 새 `media_assets`가 `storage_provider='r2'`, `status='approved'`이고 `media_usages`가 해당 version에 연결되는지 확인한다.
6. 반환된 URL의 응답 헤더에서 `Content-Type`이 실제 이미지 MIME이고 `Cache-Control: public, max-age=31536000, immutable`인지 확인한다.
7. Draft Preview와 공개 페이지에서 이미지·alt·caption을 확인하고, OG/Twitter metadata와 Article JSON-LD image가 같은 절대 URL을 사용하는지 확인한다.
8. 테스트 Draft는 발행하지 않고 남겨도 되지만, 연결되지 않은 pending object는 7일 후 `npm run media:cleanup`으로 정리한다. 실제 R2 object 삭제가 필요한 경우 먼저 해당 version usage와 보존 필요성을 확인한다.
