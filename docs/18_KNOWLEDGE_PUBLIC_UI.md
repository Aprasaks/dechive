# Stage 18 Knowledge Public UI

`/knowledge`는 published Knowledge만 탐색하는 기록 인덱스다. 각 항목은 title, summary, tags, published version/date와 상세 링크를 보이며, 번호형 연재나 카드 갤러리로 취급하지 않는다.

`/knowledge/{slug}`는 Knowledge 표시, title, summary, 대표 이미지, canonical document, 태그, 작성·발행·최종 수정일, 공유, 목록 복귀 링크 순서의 읽기 화면이다. 태그는 본문 뒤에 일반 칩으로 표시하며 가짜 태그 링크를 만들지 않는다. 기존 참고문헌 payload는 보존하지만 현재 공개 화면에서는 자동 출력하지 않는다.

UI는 light-only token(`--background`, `--surface`, `--foreground`, `--accent`)과 `--page-gutter`, `--reading-max`를 사용한다. 390px는 한 열과 내부 code scroll, 768px 이상은 여백 확대, 1280px도 reading width를 유지한다. heading 순서, skip link 대상, 의미 있는 링크 이름, tag의 비버튼 표현, 외부 링크 새 창 안내와 URL overflow를 포함한다.

목록 canonical은 `/knowledge`, 상세 canonical은 `/knowledge/{slug}`다. 상세 metadata는 published version의 title/summary만 사용하며 미발행 또는 없는 slug는 metadata 없이 404다. 모든 UI 조회는 `current_published_version_id` join을 유지한다.

Stage 19에서는 공개 Knowledge의 탐색 개선을 검토할 수 있으나 검색, 태그 필터, 관계 그래프와 Lecture 공개는 별도 결정이 필요하다.
