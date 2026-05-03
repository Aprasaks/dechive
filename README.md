# Dechive — The Infinite Archive

<p align="center">
  <strong>Knowledge recorded has value. Knowledge unrecorded disappears.</strong>
</p>

<p align="center">
  <a href="https://dechive.dev">dechive.dev</a>
</p>

---

## What is Dechive?

When LLMs like GPT, Gemini, and Claude started reshaping the world, one question emerged:

> **"In the age of AI, what does real knowledge actually mean?"**

Information is everywhere. Verified knowledge is rare. Anyone can ask AI anything — but few can tell when AI is confidently wrong. The difference between easily obtained information and personally verified, documented knowledge is enormous.

That question became a project on May 11, 2025.  
And on April 5, 2026, the library opened.

Dechive is the result. An ambitious, sincere attempt to organize knowledge — without hallucination, without shortcuts.

---

## The Library Structure

### Archive — Restructured Knowledge

Each post covers one topic completely. No other source should be needed. Every claim is verified. Every explanation is written from first principles — not copied, not paraphrased from AI output.

**Active Series:**

- **Prompt Guide** (18 parts, complete) — From LLM internals to multi-agent system design
- **SQL Mastery** (28 parts, in progress) — From data modeling to DCL
- **GA4 Mastery** (10 parts, in progress) — From GA4 fundamentals to Looker Studio
- **Standalone posts** — Dev, Productivity, Philosophy

### Projects — Everything Being Built

A collection of all active projects. Dechive is one of them. Each project has its own context, stack, and purpose — documented as it evolves.

---

## How It Works

### Supabase Vector RAG

Every published post is chunked by `##` heading and embedded as a vector using Cohere's `embed-multilingual-v3.0` model. These vectors are stored in a Supabase `document_chunks` table with pgvector.

When a user sends a message to the AI librarian:

```
User question
  → Vectorized using Cohere
  → Supabase pgvector similarity search
  → Top matching post chunks retrieved
  → Injected as context into Gemini
  → Gemini answers grounded in the archive
```

The librarian only knows what is written in the archive. As posts grow, so does the librarian's knowledge.

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

### Git Workflow & Auto-Embedding Pipeline

Content lives in a separate Git submodule (`dechive-content`), decoupled from the application code. This keeps the content history clean and independent from code changes.

**Authoring a new post:**

```bash
# 1. Write the Korean post
content/posts/{slug}.ko.md

# 2. Generate the English translation
npm run translate
# → Calls Claude Haiku via Anthropic API
# → Produces content/posts/{slug}.en.md automatically
# → Series names are mapped (e.g. 'GA4 완전 정복' → 'GA4 Mastery')

# 3. Commit and push the content submodule
cd content
git add . && git commit -m "feat: ..." && git push

# 4. Update the submodule reference in the main repo
cd ..
git add content && git commit -m "chore: update content submodule" && git push
```

**What happens after push:**

GitHub Actions (`embeddings.yml`) triggers on any push to `content/`:

```
Push to content submodule
  → GitHub Actions triggered
  → All published .md files read
  → Chunked by ## heading
  → Cohere embedding generated (batch size: 96)
  → Upserted into Supabase document_chunks
  → AI librarian updated automatically
```

No manual embedding step. No post-processing. Push and it's live.

---

## Tech Stack

| Layer              | Technology                     | Why                            |
| ------------------ | ------------------------------ | ------------------------------ |
| Framework          | Next.js 15 (App Router)        | SSG + full SEO control         |
| Language           | TypeScript                     | Zero `any` policy              |
| Styling            | Tailwind CSS V4                | Fast responsive design         |
| AI Librarian       | Google Gemini API              | Cost-efficient generation      |
| Vector DB          | Supabase pgvector              | Semantic search over posts     |
| Embedding Model    | Cohere embed-multilingual-v3.0 | Multilingual (KO + EN)         |
| Embedding Pipeline | GitHub Actions                 | Auto-triggered on content push |
| Translation        | Claude Haiku (Anthropic API)   | KO → EN post translation       |
| Content Storage    | Git Submodule (Markdown)       | Code and content decoupled     |
| Deployment         | Vercel                         | Edge network, zero config      |
| Monetization       | Google AdSense                 | ca-pub-4611005224374273        |
| Analytics          | Google Analytics 4             | G-Y08SJBLW8G                   |

---

## Principles

- **No hallucination** — If uncertain, it doesn't get written
- **Self-contained** — Each Archive post covers its topic completely, no external links required
- **Verified** — Every claim is checked before publishing
- **Zero `any`** — TypeScript strict mode, no exceptions
- **SEO first** — Every page is built to be found

---

<p align="center">
  In the age of AI, information is infinite and cheap.<br/>
  Verified, structured, human-checked knowledge is not.<br/><br/>
  <strong>Dechive</strong>
</p>
