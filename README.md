# Dechive — 무한서고

<p align="center">
  <strong>기록된 지식은 가치를 가진다.</strong>
</p>

<p align="center">
  <a href="https://dechive.dev">dechive.dev</a>
</p>

---

## 꿈에서 시작됐다

GPT, Gemini, Claude가 나오고 LLM이 세상을 뒤흔들기 시작할 때, 하나의 질문이 생겼다.

> **"AI 전성시대에 진짜 지식이란 무엇인가?"**

정보는 넘쳐나지만 검증된 지식은 드물다. 누구나 AI에게 물어볼 수 있지만, AI가 내뱉는 그럴듯한 거짓말을 구분할 수 있는 사람은 많지 않다. 손쉽게 얻는 정보와 직접 검증하고 기록한 지식은 다르다.

그 생각이 2025년 5월 11일, 하나의 기획이 됐다.  
그리고 2026년 4월 5일, 나의 도서관이 생겼다.

Dechive는 그 꿈의 결과물이다. 세상의 모든 지식을 정리해보겠다는, 다소 무모하지만 진심인 기획.

---

## 무한서고의 구조

Dechive는 두 종류의 서가로 구성된다.

### 📚 Archive — 정제된 지식
한 편으로 주제를 완결한다. 다른 사이트 없이 이 글 하나로 충분해야 한다. 시리즈로 연결되는 깊은 지식의 흐름.

- **프롬프트 가이드** (18편) — LLM 원리부터 멀티에이전트 설계까지
- **SQL 완전 정복** (28편) — 데이터모델부터 DCL까지
- **그 외** — Dev, Productivity, Philosophy

### 📝 Logs — 날것의 기록
에러, 삽질, 해결. 실제로 겪은 것만 쓴다. 거짓말하지 않는다. 여러 Logs가 쌓이면 하나의 Archive로 재정립된다.

---

## 기술 스택

단순히 블로그를 만든 게 아니다. 지식 저장소로서 작동하는 시스템을 설계했다.

| 영역 | 기술 | 선택 이유 |
|------|------|----------|
| Framework | Next.js 15 (App Router) | SSG + SEO 최적화 |
| Language | TypeScript | Zero `any` 원칙 |
| Styling | Tailwind CSS V4 | 빠른 반응형 설계 |
| AI Chat | Google Gemini API | 비용 효율 |
| Vector DB | Supabase pgvector | 포스트 내용 기반 RAG |
| Embedding | GitHub Actions | 포스트 업로드 시 자동 생성 |
| Content | Git Submodule (Markdown) | 콘텐츠와 코드의 분리 |
| Deployment | Vercel | Edge 네트워크 |

### AI 사서 챗봇
단순한 챗봇이 아니다. 서고에 쌓인 모든 글을 벡터로 변환해 의미 기반으로 검색하고, Gemini가 그 위에서 답변을 생성한다. 포스트가 쌓일수록 사서는 똑똑해진다.

```
사용자 질문
  → 질문 벡터화
  → Supabase pgvector에서 유사 포스트 검색
  → 검색된 포스트를 컨텍스트로 주입
  → Gemini가 서고의 내용 기반으로 답변
```

### 자동 임베딩 파이프라인
포스트를 커밋하면 GitHub Actions가 자동으로 벡터를 생성하고 Supabase에 업로드한다. 수동 작업 없음.

---

## 프로젝트 구조

```
dechive/
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── archive/       # 한국어 포스트 상세
│   │   ├── en/archive/    # 영어 포스트 상세
│   │   ├── logs/          # Logs 페이지
│   │   └── api/           # chat, embeddings API
│   ├── components/
│   │   ├── archive/       # BookArchive, PostContent, TOC
│   │   ├── layout/        # Header, Footer, ChatDrawer
│   │   └── home/          # HeroSection, ParticleCanvas
│   ├── lib/               # posts, logs, i18n 유틸
│   └── types/             # TypeScript 타입 정의
├── content/               # Git Submodule — Markdown 콘텐츠
│   ├── posts/             # Archive (.ko.md / .en.md)
│   └── logs/              # Logs (.ko.md)
└── public/images/         # 정적 이미지 (WebP)
```

---

## 로컬 실행

```bash
# 의존성 설치
npm install

# 콘텐츠 서브모듈 초기화
git submodule update --init --recursive

# 개발 서버
npm run dev
```

`.env.local` 설정:

```env
GOOGLE_GENERATIVE_AI_API_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

## 원칙

- **할루시네이션 금지** — 불확실한 사실은 쓰지 않는다
- **자체 완결** — Archive 한 편은 그 주제의 모든 것을 담는다
- **Zero `any`** — TypeScript `any` 타입 사용 금지
- **SEO First** — 모든 페이지는 검색에 발견되어야 한다

---

<p align="center">
  AI 전성시대, 수많은 정보를 손쉽게 얻을 수 있지만<br/>
  수많은 거짓 정보도 함께 넘쳐난다.<br/>
  직접 검증하고, 직접 기록한 Demian의 아카이브.<br/><br/>
  <strong>Dechive</strong>
</p>
