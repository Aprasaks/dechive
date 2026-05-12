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
- Supabase/RAG embedding generation
- content submodule commits when requested

Shared only by explicit user request:

- workflow files
- translation scripts
- content metadata cleanup
- content submodule pointer updates

Codex must not edit `content/`, run translation, or run embeddings unless explicitly asked.

## 3. Harness Rules

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

## 4. Translation Policy

Korean posts are the source.  
Existing English posts are protected editorial content.

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

Do not translate slug.

## 5. Commit / Push

Do not commit or push unless explicitly asked.

- "커밋해" = commit only
- "푸시해" = push only
- "커밋푸시해" = commit and push

## 6. Report Format

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
