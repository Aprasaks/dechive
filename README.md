# Dechive

<p align="center">
  <strong>생각이 머무는 도서관 — A library where thoughts stay.</strong>
</p>

<p align="center">
  <a href="https://dechive.dev">dechive.dev</a>
</p>

---

## What is Dechive?

Dechive is a personal library — not a blog, not a portfolio.

Each post is a short book. Each subject is a bookshelf. The Archive is the library itself.

In the age of AI, information is infinite and cheap. Verified knowledge — written from first principles, checked against reality, edited until it holds — is not.

Dechive is where that knowledge is kept.

---

## The Library

```
category   — a large shelf section
subject    — a topic bookshelf
post       — one short book
tags       — the index
```

Every post covers one topic completely. No other source should be needed. Each stands alone — but posts within the same subject share a shelf.

**Current shelves:**

- **Prompt** — From LLM internals to multi-agent system design
- **SQL** — From data modeling to DCL
- **GA4** — From fundamentals to Looker Studio
- Dev, Productivity, Philosophy — standalone reads

---

## How It Works

### AI Librarian

Every published post is chunked by `##` heading and embedded as a vector using Cohere's `embed-multilingual-v3.0` model. Vectors are stored in Supabase with pgvector.

When a reader asks the librarian a question:

```
Question
  → Vectorized (Cohere)
  → pgvector similarity search
  → Matching chunks retrieved
  → Injected into Gemini as context
  → Answer grounded in the archive
```

The librarian only knows what is written here. As the archive grows, so does its knowledge.

**Schema: `document_chunks`**

```
id          — {slug}-{lang}-{chunk_index}
slug        — post slug
lang        — ko / en
title       — post title
category    — Dev / Productivity / Philosophy
tags        — string array
section     — ## heading the chunk belongs to
content     — chunk text
embedding   — vector(1024)
```

### Content Pipeline

Content lives in a separate Git submodule, decoupled from the application code.

```bash
# Write the Korean post
content/posts/{slug}.ko.md

# Generate the English translation
npm run translate
# → Claude Haiku → content/posts/{slug}.en.md

# Commit and push
cd content && git add . && git commit -m "feat: ..." && git push
cd .. && git add content && git commit -m "chore: update content submodule" && git push
```

On push, GitHub Actions re-embeds all published posts into Supabase automatically. No manual step.

---

## Tech Stack

| Layer       | Technology                     | Why                            |
| ----------- | ------------------------------ | ------------------------------ |
| Framework   | Next.js 15 (App Router)        | SSG + full SEO control         |
| Language    | TypeScript                     | Zero `any` policy              |
| Styling     | Tailwind CSS v4                | Fast responsive design         |
| AI Librarian | Google Gemini API             | Cost-efficient generation      |
| Vector DB   | Supabase pgvector              | Semantic search over posts     |
| Embedding   | Cohere embed-multilingual-v3.0 | Multilingual (KO + EN)         |
| Pipeline    | GitHub Actions                 | Auto-triggered on content push |
| Translation | Claude Haiku (Anthropic API)   | KO → EN post translation       |
| Content     | Git Submodule (Markdown)       | Code and content decoupled     |
| Deployment  | Vercel                         | Edge network, zero config      |

---

## Principles

- **No hallucination** — If uncertain, it doesn't get written
- **Self-contained** — Each post covers its topic completely
- **Verified** — Every claim is checked before publishing
- **Zero `any`** — TypeScript strict, no exceptions

---

<p align="center">
  <em>Dechive</em>
</p>
