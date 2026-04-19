# Dechive — 무한서고

> 기록된 지식은 가치를 가진다.  
> 기술, 철학, 사유의 흔적을 기록하는 공간.

**[dechive.dev](https://dechive.dev)**

---

## 소개

Dechive는 정제된 지식 백과(Archive)와 현장 트러블슈팅 기록(Logs)으로 구성된 개인 기술 블로그입니다. 단순한 블로그를 넘어 Vector RAG 기반 AI 사서 챗봇, 자동 임베딩 파이프라인, SEO 최적화 구조를 갖춘 지식 저장소를 목표로 합니다.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS V4 |
| AI / Chat | Google Gemini API |
| Vector DB | Supabase pgvector |
| Embedding | GitHub Actions 자동화 |
| Deployment | Vercel |
| Content | Git Submodule (Markdown) |

---

## 주요 기능

- **무한서고 Archive** — 책 형태 UI의 지식 백과, 카테고리/시리즈 필터
- **Logs** — 짧은 트러블슈팅 기록
- **AI 사서 챗봇** — Supabase Vector RAG + Gemini 기반, 포스트 내용으로 답변
- **다국어 지원** — 한국어(`/archive`) / 영어(`/en/archive`) 경로 분리
- **자동 임베딩** — 포스트 업로드 시 GitHub Actions로 벡터 자동 생성
- **SEO 최적화** — JSON-LD, OpenGraph, hreflang, sitemap 자동 생성

---

## 프로젝트 구조

```
dechive/
├── src/
│   ├── app/               # Next.js App Router 페이지
│   │   ├── archive/       # 한국어 포스트 상세
│   │   ├── en/archive/    # 영어 포스트 상세
│   │   ├── logs/          # Logs 페이지
│   │   └── api/           # API 라우트 (chat, embeddings)
│   ├── components/        # UI 컴포넌트
│   │   ├── archive/       # BookArchive, PostContent, TOC 등
│   │   ├── layout/        # Header, Footer, ChatDrawer 등
│   │   └── home/          # HeroSection, ParticleCanvas 등
│   ├── lib/               # 유틸리티 (posts, logs, i18n 등)
│   └── types/             # TypeScript 타입 정의
├── content/               # Git Submodule — Markdown 콘텐츠
│   ├── posts/             # Archive 포스트 (.ko.md / .en.md)
│   └── logs/              # Logs (.ko.md)
└── public/
    └── images/            # 정적 이미지 (WebP)
```

---

## 로컬 실행

```bash
# 의존성 설치
npm install

# 서브모듈 초기화 (콘텐츠)
git submodule update --init --recursive

# 개발 서버 실행
npm run dev
```

환경 변수 설정 (`.env.local`):

```env
GOOGLE_GENERATIVE_AI_API_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 콘텐츠 구조

| 구분 | 위치 | 성격 |
|------|------|------|
| Archive | `content/posts/{slug}.ko.md` | 정제된 지식 백과, 시리즈 가능 |
| Archive (EN) | `content/posts/{slug}.en.md` | 영어 번역본 |
| Logs | `content/logs/{slug}.ko.md` | 짧은 트러블슈팅 기록 |

---

## 라이선스

개인 프로젝트입니다. 콘텐츠 무단 복제를 금합니다.
