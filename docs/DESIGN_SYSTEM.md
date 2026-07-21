# Dechive Public Design System

## Purpose

Dechive의 Public UI는 매일 쌓이는 AI 검증 기록을 중심에 둔다. 블로그, SaaS 대시보드, 과장된 랜딩 페이지가 아니라 절제된 editorial interface를 만든다.

## Color

- Light theme only. Dark mode와 theme toggle은 제공하지 않는다.
- 기본 배경은 warm ivory와 옅은 회색 표면을 사용한다.
- 본문은 deep charcoal, 강조는 muted navy/blue를 사용한다.
- 상태와 중요도는 색만으로 구분하지 않고 텍스트를 병행한다.

## Typography

- 본문은 읽기 쉬운 sans-serif를 기본으로 한다.
- display 크기는 필요한 경우에만 사용하며 Hero도 과도하게 키우지 않는다.
- 제목은 명확한 위계와 조밀한 tracking을 쓰고, 본문은 충분한 line-height를 유지한다.
- Public 페이지에서 문장은 콘텐츠를 설명해야 하며 광고 문구처럼 과장하지 않는다.

## Radius, Border, Shadow

- Radius는 작게 사용하고, 모든 영역을 카드로 만들지 않는다.
- Border는 얇은 neutral line을 기본 구획으로 사용한다.
- Shadow는 계층에 꼭 필요한 경우만 최소로 쓴다.
- Hover는 색상·underline·작은 이동처럼 조용한 변화만 허용한다.

## Grid and Spacing

- `page-shell`과 기존 page gutter를 Public 화면의 정렬 기준으로 사용한다.
- 콘텐츠 목록은 카드 갤러리보다 editorial row와 선 기반 구획을 우선한다.
- section 사이에는 충분한 숨 쉴 공간을 둔다. 여백으로 위계를 만들고 장식으로 채우지 않는다.

## Hero

- Hero 이미지는 frame, border, shadow 없이 하나의 장면으로 사용한다.
- Header는 홈페이지 Hero 위에 투명하게 overlay될 수 있으며, 가독성을 위한 아주 약한 blur만 허용한다.
- 텍스트는 이미지 피사체를 피하고, 필요할 때 왼쪽에서 옅어지는 ivory gradient로 읽기성을 확보한다.
- 데스크톱에서는 이미지가 충분히 크고, tablet/mobile에서는 crop보다 원본 비율 보존을 우선한다.
- Hero CTA는 기본값이 아니다. 명확한 다음 행동이 있을 때만 추가한다.

## Navigation

- Header는 logo와 public navigation만 둔다.
- login, profile, search, 통계성 아이콘을 Public header에 추가하지 않는다.
- navigation은 현재 경로와 keyboard focus를 명확히 표시한다.

## Card and Content Entry

- 콘텐츠는 UI 장식보다 제목, category, date, 읽기 흐름이 주인공이다.
- 최신 기록은 category, title, date 중심의 얇은 선 기반 row로 보여준다.
- Knowledge, Lecture, Practice, AI Update, Books는 서비스 판매 카드가 아니라 콘텐츠 진입점으로 표현한다.

## Responsive Rules

- Mobile first로 설계한다. 모바일에서는 단순 축소가 아니라 읽기 순서와 여백을 재배치한다.
- 최소 44px tap target, 보이는 keyboard focus, horizontal overflow 없음이 기본이다.
- Tablet에서는 이미지와 텍스트 충돌을 피하고 grid를 자연스럽게 축소한다.
- Desktop에서는 넓은 여백과 비대칭 editorial grid를 허용하지만 본문 measure를 유지한다.
