<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Additional Repository Instructions

Before making code changes, read `CLAUDE.md` in this repository and follow its instructions.

Before making UI/UX or visual design changes, read `docs/dechive_design_notes.md` and follow its direction.

# Current Product Direction

The Logs section has been removed from Dechive. Do not recreate `/logs`, `content/logs`, Logs navigation items, Logs sitemap entries, Logs i18n strings, or log-generation scripts unless explicitly asked.

# Multi-Agent Workflow

Codex and Claude Code may work in this repository at the same time. Before editing, check `git status` and avoid overwriting changes from the other agent.

Keep work ownership separate:
- Codex: application code implementation, refactors, tests, type/lint verification, Next.js route and component changes.
- Claude Code: content creation and editing, copywriting, design critique, planning, review, translation script runs, and Supabase embedding generation.
- Shared by explicit user request only: workflow files, translation scripts, content metadata cleanup, and content submodule commit/push coordination.

Claude Code owns content workflows:
- Create or edit posts/projects inside `content/`.
- Run translation only when needed after new Korean posts are ready.
- Run the embedding workflow for Supabase/RAG updates (`npm run embeddings` or the current project-specific embedding command).
- Handle content submodule commits when the user asks for content commits.

Codex should not run translation or embedding generation unless explicitly asked. Codex may edit app code that consumes content, and may edit content workflow files when the user explicitly asks for automation fixes. Codex should avoid changing `content/` while Claude Code is assigned content work.

# Translation Policy

Dechive uses Korean posts as the source, but existing English posts are protected editorial content.

Default behavior:
- Automatic translation is for first-time creation of missing `posts/*.en.md` files.
- If the matching English file already exists, translation scripts and workflows must skip it.
- Existing English files must not be overwritten unless the user explicitly requests force retranslation.

Force behavior:
- GitHub Actions may overwrite existing English posts only when manually run with `force_retranslate: true`.
- Local translation may overwrite existing English posts only when run with `npm run translate -- --force`.
- After any force retranslation, English `title`, `seoTitle`, `tags`, and body text need review.

Frontmatter translation:
- New English posts should translate `title`, `description`, `seoTitle`, `tags`, and body content.
- `lang` changes from `ko` to `en`.
- `slug` must stay unchanged across Korean and English versions.

When a Korean post changes:
- Do not assume the English post should be regenerated.
- Existing English content may intentionally differ because it has been reviewed or refined.
- If the Korean change materially affects meaning, report that the matching English post may need manual review or explicit force retranslation.

Do not edit the same files concurrently. If a task needs files currently being edited by the other agent, stop and ask for coordination instead of forcing changes.

Only commit or push when the user explicitly asks. When committing content submodule changes, commit inside `content/` first, then commit the updated submodule pointer in the root repository.
