ALTER TABLE "content_localizations" ADD COLUMN IF NOT EXISTS "workflow_status" text NOT NULL DEFAULT 'draft';
ALTER TABLE "content_localizations" ADD CONSTRAINT "knowledge_workflow_status_valid" CHECK ("workflow_status" IN ('draft','published','withdrawn','archived'));
UPDATE "content_localizations" SET "workflow_status" = 'published' WHERE "current_published_version_id" IS NOT NULL AND "workflow_status" = 'draft';
