# Authorization Boundary

- **Status:** Logical boundary approved; authentication not implemented
- **Last Updated:** 2026-07-18
- **Authority:** 외부 identity와 내부 권한의 분리
- **Purpose:** 로그인 공급자가 Dechive role의 canonical source가 되지 않도록 한다.

`external_identities`는 provider+subject, verified email, allowlist, actor 연결만 저장한다. `actors`는 audit identity이고 `actor_role_memberships`가 owner/editor/reviewer/publisher/media_manager 권한의 canonical source다. OAuth의 email/domain claim만으로 role을 자동 부여하지 않는다.

- External provider: 신원 확인과 세션 수단.
- Actor: Dechive 내부 행위자와 audit ID.
- Role membership: DB에서 승인·회수되는 권한.
- System actor: scheduled worker/migration 같은 비인간 행위.
- v1: allowlisted 관리자만 대상이며 일반 회원가입은 없다.

Editor는 draft, reviewer는 review/source, media manager는 media approval, publisher는 publish/rollback, owner는 role/migration/unknown-node 승인 권한을 가진다. 실제 authentication library, session, MFA, recovery는 다음 단계에서 공식 Next.js 16 호환성을 조사한다.
