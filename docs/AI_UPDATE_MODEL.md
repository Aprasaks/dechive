# AI Update 모델

AI Update는 공식 발표를 그대로 옮기는 뉴스가 아니라, 무엇이 변했고 우리가 무엇을 알아야 하는지 확인해 남기는 기록이다. 일반 뉴스 수집·RSS·자동 작성이나 자동 발행은 포함하지 않는다.

- 구조화 필드: 제목, slug, 요약, `official_updated_at`, `last_verified_at`, 공개 상태와 포인터.
- immutable version metadata: 제목·slug·요약·두 날짜·공식 출처 배열. 출처는 제목과 HTTP(S) URL이 필수이며 URL 중복을 허용하지 않는다.
- 본문: TipTap으로 변한 내용과 우리가 알아야 할 점을 설명한다.
- 날짜: 공식 업데이트일은 기관 발표일, 마지막 확인일은 운영자 재확인일, Dechive 게시일은 published version의 생성일이다.
- 발행: title, slug, summary, 의미 있는 body, 두 날짜, 최소 한 개 유효한 공식 출처가 필요하다. draft는 public query에 노출되지 않는다.
- 복구: 별도 rollback API가 아니라 새 revision 저장 후 재발행한다. 최초 발행 후 slug는 잠긴다.
- 공개: `/ai-update`와 `/ai-update/[slug]`는 published pointer만 읽고 sitemap에는 published non-fixture만 넣는다. `qa-fixture-*`는 noindex 및 sitemap 제외다.
