# Stage 21 Lecture Draft and Publish Readiness

Migration 0005 adds nullable `lecture_details.audience` and `estimated_duration_minutes` with a positive-integer constraint. External create/update input is optional for backward compatibility; service normalization returns `audience: ''`, duration `null`, coreMessage `''`, and references `[]` when old data lacks fields.

Mutable detail fields: audience and estimated duration. Immutable `content_versions.migration_metadata.lecture`: coreMessage and references. References reuse KnowledgeReference normalization and are never copied from primary Knowledge.

Lecture 1.0 editor and preview add audience, duration, core message, and references without altering TipTap body. Primary Knowledge remains exactly one required Knowledge; related Knowledge expansion is deferred.

Stage 22 Publish readiness: title, slug, summary, body, valid primary Knowledge, at least one learning objective, coreMessage, and valid references. Audience, duration, difficulty, checkpoints, and recommended order remain optional. Stage 22 implements this contract with an immutable published pointer and `/lecture` public renderer; Production remains unused.
