# AGENTS.md

## 1. Read First

This repository may use a Next.js version with breaking changes.  
Before editing Next.js code, check the relevant local docs under `node_modules/next/dist/docs/` when needed.

Before any change:

1. Run `git status`.
2. Identify existing user, Codex, or Claude Code changes.
3. Do not overwrite changes from another agent.
4. If ownership is unclear, stop and report.

## 2. Agent Ownership

Current Dechive identity:

- Core line: `AI는 답을 만든다. Dechive는 그 답을 검증한다.`
- Dechive is a personal archive that turns AI-era answers into verifiable records.
- Dechive language should center verification, questions, records, criteria, and judgment.
- Avoid retired book-place metaphors unless the user explicitly asks to restore them.
- Current content types are `archive` and `deepdive`.
- `Daily` is not currently used.

Codex owns:

- application code
- routes and components
- refactors
- tests
- type/lint/build verification
- app code that consumes content

Claude Code owns:

- content creation and editing
- copywriting
- planning and review
- translation script runs
- content submodule commits when requested

Shared only by explicit user request:

- workflow files
- translation scripts
- content metadata cleanup
- content submodule pointer updates

Codex must not edit `content/` or run translation unless explicitly asked.

## 3. Content Submodule Workflow

`content/` is not a normal folder. It is a Git submodule pointing to:

```txt
Aprasaks/dechive-content
```

Posts are written under:

```txt
content/posts/*.ko.md
```

But the actual content source repository is `dechive-content`.

When editing posts:

1. Modify files under `content/posts`.
2. Commit and push inside `content/` first.
3. Return to the root repository.
4. Commit and push the updated `content` submodule pointer in the root repository.

Never commit only the root submodule pointer before committing the content repository.

## 4. Harness Rules

Harness engineering means binding AI work to:

- goal
- scope
- boundary
- verification
- stop condition

Before editing, clarify internally:

- What problem is this change solving?
- Which files are allowed to change?
- Which systems must not be touched?
- What check proves the change is safe?
- When should the agent stop instead of guessing?

Stop and report when:

- git status shows unexpected changes
- the task crosses agent ownership boundaries
- the fix requires unrelated infrastructure changes
- errors appear unrelated to the current task
- the request conflicts with Dechive identity

A good harness makes the agent narrower, not louder.

## 5. Content Type Rules

Current content types:

- `archive`: an independent record built around one question
- `deepdive`: a long-form knowledge document that carries one deep question through concepts, examples, mistakes, limits, reasoning, and verification criteria

Rules:

- Do not add `series`.
- Do not add previous/next/series flows for Archive content.
- Archive posts must be readable independently.
- Deep Dive documents should preserve clear structure for future AI reasoning and verification guidance.

## 6. Language Routing Rules

Dechive uses Korean as the default source language and English as a protected translated content layer.

Rules:

- Content index/detail routes with separate language content should have language-specific URLs.
- Archive routes:
  - `/archive`
  - `/en/archive`
  - `/archive/[slug]`
  - `/en/archive/[slug]`
- Deep Dive routes:
  - `/deep-dive`
  - `/en/deep-dive`
  - `/deep-dive/[slug]`
  - `/en/deep-dive/[slug]`
- Shared utility or static pages should not get `/en/...` routes unless explicitly requested.
  - Keep `/guestbook`, `/about`, and `/privacy-policy` as shared URLs.
  - Render their UI copy from persisted language state instead.
- When a visitor selects KO or EN, preserve that language across navigation.
- Header, home, list, and detail links must generate language-appropriate content URLs.
- Do not collapse English content navigation back to Korean URLs.

## 7. Translation Policy

Korean posts are the source.  
Existing English posts are protected editorial content.

Canonical translation logic lives in:

```txt
content/.github/scripts/translate.mjs
```

Root script:

```txt
scripts/translate.ts
```

is only a wrapper for `npm run translate`.

Do not reintroduce translation prompts, frontmatter reconstruction, Anthropic calls, or file translation logic into the root wrapper.

Default:

- create missing `.en.md` files only
- skip existing `.en.md`
- do not overwrite reviewed English content

Force retranslation only when explicitly requested:

- GitHub Actions: `force_retranslate: true`
- Local: `npm run translate -- --force`

New English posts should translate:

- title
- description
- seoTitle
- tags
- body
- lang: ko → en

Do not translate:

- slug
- type
- status
- date
- category
- concepts

## 8. Commit / Push

Do not commit or push unless explicitly asked.

- "커밋해" = commit only
- "푸시해" = push only
- "커밋푸시해" = commit and push

When content submodule changes are involved:

1. Commit/push inside `content/` first.
2. Commit/push the root submodule pointer second.

## 9. Report Format

After work, report:

```txt
변경 파일:
- ...

주요 변경:
- ...

확인:
- ...

주의/TODO:
- ...
```

```

```
