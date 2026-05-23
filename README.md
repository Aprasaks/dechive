# Dechive

<p align="center">
  <strong>AI는 답을 만든다. Dechive는 그 답을 검증한다.</strong>
</p>

<p align="center">
  <a href="https://dechive.dev">dechive.dev</a>
</p>

---

## What is Dechive?

Dechive is a personal archive for turning AI-era answers into verifiable records.

It is not a general blog, portfolio, or tutorial platform. Archive keeps one question as an independent record. Deep Dive carries a deeper question through concepts, examples, mistakes, limits, reasoning, and verification criteria. Downloads turns selected criteria into reusable material.

In the age of AI, information is infinite and cheap. Verified knowledge, written from first principles and checked against reality, is not.

---

## Content Model

```txt
type       — archive | deepdive
category   — broad content area
post       — independent record or long-form verification document
tags       — index terms
concepts   — concept links for structured reasoning
```

Current content types:

- **Archive** — independent records built around one question
- **Deep Dive** — long-form documents built around one deep question
- **Downloads** — reusable ebooks and materials

---

## Content Pipeline

Content lives in a separate Git submodule, decoupled from the application code.

```bash
# Write the Korean post
content/posts/{slug}.ko.md

# Generate the English translation
npm run translate
# -> content/posts/{slug}.en.md

# Commit and push content first
cd content && git add . && git commit -m "feat: ..." && git push

# Then update the root submodule pointer
cd .. && git add content && git commit -m "chore: update content submodule" && git push
```

---

## Tech Stack

| Layer       | Technology               | Why                            |
| ----------- | ------------------------ | ------------------------------ |
| Framework   | Next.js App Router       | SSG + SEO control              |
| Language    | TypeScript               | Strict application contracts   |
| Styling     | Tailwind CSS v4          | Responsive interface work      |
| Guestbook   | Supabase                 | Lightweight visitor notes      |
| Translation | Anthropic API            | KO -> EN post translation      |
| Content     | Git Submodule + Markdown | Code and content decoupled     |
| Deployment  | Vercel                   | Production hosting             |

---

## Principles

- **Verification first** — Every record exists to make an answer checkable.
- **Independent records** — Archive posts must stand on their own.
- **Deep reasoning** — Deep Dive documents carry one question through limits and criteria.
- **Clear boundaries** — Automation should support publishing, not obscure it.

---

<p align="center">
  <em>Dechive</em>
</p>
