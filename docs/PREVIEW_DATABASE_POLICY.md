# Preview Database Policy

- **Status:** Policy approved; integration not enabled
- **Last Updated:** 2026-07-18
- **Authority:** PR별 Neon branch의 데이터·비용·삭제 정책
- **Purpose:** Preview가 production 비공개 데이터를 복제하지 않도록 한다.

Branch 이름은 `preview/pr-{number}-{short-name}`이다. Parent는 전용 `preview-base`다. `preview-base`는 production/일반 staging clone이 아니며 clean migration과 deterministic public seed로 재생성한다. Neon branch는 copy-on-write이므로 parent 선택이 곧 데이터 노출 경계다.

허용 seed는 migration schema, deterministic public fixture, fake actor, 가짜 승인 source/media뿐이다. Production draft, identity/email/token, 비공개 content, audit, Guestbook 개인정보는 금지한다. Auth integration은 설치하지 않는다.

PR close/merge 시 branch를 삭제한다. 실패 cleanup은 매일 age audit로 48시간 이상 closed/orphan preview를 찾아 수동 승인 후 삭제한다. 동시 branch/compute 사용량은 Launch allowance 안에서 주간 확인한다. 자동화는 Neon/Vercel integration 사용자가 승인한 뒤 활성화한다. [Neon preview integration](https://neon.com/blog/neon-vercel-native-integration), [branching guide](https://neon.com/docs/guides/branching-intro).
