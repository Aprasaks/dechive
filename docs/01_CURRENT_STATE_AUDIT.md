# Current State Audit

- **Status:** Audited baseline
- **Last Updated:** 2026-07-18
- **Authority:** 2026-07-18 저장소 현황의 사실 기준
- **Purpose:** 구현 전 현재 코드·콘텐츠·운영 구조를 파일 근거로 기록한다.

## 스택과 구조

- `package.json`: Next.js `^16.2.3`, React `19.2.4`, TypeScript `^5`, Tailwind CSS 4. App Router는 `src/app`에 있다.
- `tsconfig.json`: `strict: true`지만 `allowJs: true`; 관리자·GA 유틸 일부가 `.js/.jsx`다.
- `src/app/layout.tsx`: 전역 메타데이터, Google font, 광고 스크립트, 음악/언어 provider, GA, 공통 chrome을 결합한다.
- `next.config.ts`: 이미지 quality만 설정한다. `vercel.json`은 private content submodule을 받은 뒤 build한다.

## 라우트 인벤토리

| 영역 | 경로 | 근거/상태 |
|---|---|---|
| 메인 | `/` | `src/app/page.tsx`, Markdown 최신 글+정적 AI update를 조합 |
| Archive | `/archive`, `/archive/[slug]` | KO Markdown |
| Deep Dive | `/deep-dive`, `/deep-dive/[slug]` | 동일 loader의 `type` 필터 |
| 영문 | `/en/archive/**`, `/en/deep-dive/**` | `.en.md` 병렬 파일 |
| AI 업데이트 | `/ai-updates`, `/ai-updates/[date]` | `src/data/aiUpdates.ts` 정적 TS 데이터 |
| Book/Library | `/book/**`, `/library` | `src/content/books/*.ko.md`; 두 진입점이 혼재 |
| Issues | `/issues`, `/issues/[date]` | `src/data/dailyIssues.ts`; SiteChrome 예외 |
| 기타 공개 | `/about`, `/guestbook`, `/privacy-policy` | About, Supabase 방명록, 정책 |
| 관리자 | `/admin/login`, `/admin/analytics` | 콘텐츠 편집이 아닌 GA4 조회 |
| API | `/api/guestbook`, `/api/admin/{login,logout,analytics}` | Route Handler 4개 |
| 배포 산출 | `/feed.xml`, `/en/feed.xml`, `/sitemap.xml`, `/robots.txt` | 동적 route/metadata route |

`Footer.tsx`에는 실제 page가 없는 `/terms`, `/contact` 링크가 있다. 새 최상위 `지식/강의/실습/검색` 라우트는 아직 없다. Server Actions는 발견되지 않았다.

## 콘텐츠와 다국어

- `src/lib/posts.ts`가 `content/posts/*.{ko,en}.md`를 동기 파일 I/O+gray-matter로 읽는다. published만 노출하고 filename/slug로 조회한다.
- content는 Git submodule이며 `README.md`, `vercel.json`, `scripts/sync-images.ts`가 이를 운영 원본으로 전제한다.
- 조사 시 Markdown 114개: KO 57, EN 57, 고유 slug 57, archive 106(언어 파일 기준), deepdive 8, 전부 published.
- Book note는 별도 `src/content/books`에 KO Markdown 3개다. AI 업데이트는 16일의 정적 데이터다. `dailyIssues.ts`에는 수동 4일이 있지만 `src/lib/dailyIssues.ts`가 최신 KO 글에서 issue를 자동 합성해 현재 build는 `/issues/[date]` 23개를 생성한다. weekly edition도 정적+자동 합성 구조다.
- `src/types/archive.ts` 모델은 title/date/category/tags/description/cover/concepts/type/status/lang/content이며 출처, revision, checked date, 관계 모델이 없다.
- `LangProvider`/`LangToggle`과 영문 route가 있지만 전 사이트 locale routing은 아니다.

## 작성·관리·인증

- TipTap, BlockNote, Lexical 및 작성/초안/미리보기/발행 UI는 없다.
- `src/lib/adminAuth.js`는 환경변수 ID/password와 HMAC 고정 토큰 cookie를 사용한다. 사용자·역할·세션 저장소는 없다.
- `/admin/analytics`만 보호한다. 이 인증을 향후 편집 권한 체계로 그대로 확장하면 안 된다.

## 이미지와 정적 자산

- `content/posts`의 이미지가 build/dev 전에 `public/images/posts`로 복사된다(`scripts/sync-images.ts`). 원본/파생본 구분, DB metadata, alt 강제, 권한, 백업 정책이 없다.
- 본문 이미지 참조 39건, 이미지가 있는 Markdown 16개. `PostContent.tsx`가 상대 경로를 `/images/posts/`로 바꾸고 1200×630 intrinsic 값을 일괄 부여한다.
- public은 약 57MB: WebP 50, PNG 3, SVG 1, MP3 9 등. 음악 9개와 Three.js helix 자산은 새 제품 방향에서 재평가 대상이다.

## 검색, 공유, SEO, 분석

- Archive client의 클라이언트 필터 검색은 있으나 전역 검색 route/index는 없다. DB FTS/검색 엔진/vector 검색도 없다.
- Web Share API, copy fallback, 공유 이벤트는 발견되지 않았다.
- 루트와 주요 page/detail에 Metadata/canonical/Open Graph/Twitter가 있고 상세 글에는 JSON-LD가 있다. OG 이미지는 대체로 정적 cover다.
- `sitemap.ts`, `robots.ts`, KO/EN RSS가 있다. Search Console 코드는 없고 root metadata에 Naver verification이 있다.
- GA4 client tracking과 GA Data API 관리자 조회가 있다. GA ID는 client 파일에 상수이며 opt-out localStorage가 있다. Sentry/Umami/Plausible/Uptime Kuma는 없다.

## DB, 인프라, 환경

- 콘텐츠 DB는 없다. Supabase는 `/api/guestbook`의 `guestbook` table에만 사용한다.
- 환경변수 이름: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ADMIN_ID`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `GA_PROPERTY_ID`, `GA_CLIENT_EMAIL`, `GA_PRIVATE_KEY`; 번역 script는 별도 AI env를 로드한다. 값은 감사에서 기록하지 않았다.
- Vercel 배포이며 Docker/Docker Compose, DB migration, object storage, queue, backup, uptime/error monitoring 설정은 없다.
- 테스트 프레임워크/테스트 파일은 없다. ESLint와 content validation/build가 유일한 자동 검증이다.

## 다크모드 근거

- `src/app/layout.tsx`: `<html className="dark">`, `bg-black`, `text-zinc-100`, atom-one-dark highlight.
- `src/app/globals.css`: `@custom-variant dark`, `.dark` token 세트, 배경 transition.
- Header/Footer와 다수 page/component가 `bg-[#030303]`, `text-white`, `border-white/*`에 직접 결합돼 있다.
- 토글은 없지만 실제 제품은 전역 강제 다크 테마다. 단순 class 제거가 아니라 화면별 토큰/대비 마이그레이션이 필요하다.

## 의존성 감사 요약

실사용 근거가 확인된 주요 패키지는 gray-matter, react-markdown/remark/rehype, lucide-react, Three.js, Supabase, bcryptjs, Google Analytics Data다. Anthropic SDK는 번역 script, typography는 CSS plugin에 쓰인다. `shadcn` CLI package와 일부 설치 패키지는 import만으로 판단하지 말고 `npm`/bundle 분석 후 제거한다. 이번 단계에서는 package를 변경하지 않았다.

## 오래된/중복 위험

- 새 제품 정의와 기존 AGENTS/CLAUDE/README 카피가 충돌한다.
- `aiUpdates.ts`와 `dailyAiUpdates.ts`, Book/Library, Home navigation 변형이 중복 개념을 만든다.
- content가 submodule·`src/content`·`src/data` 세 저장 방식으로 분산돼 있다.
- 전역 provider와 음악/시간 counter/helix는 새 핵심 기능이 아니다.
- 사용되지 않는 컴포넌트는 정적 import graph와 런타임 route 확인 없이 삭제 판정하지 않는다.
