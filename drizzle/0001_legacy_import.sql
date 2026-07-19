CREATE TYPE "import_batch_status" AS ENUM ('running', 'completed', 'completed_with_warnings', 'failed');
--> statement-breakpoint
CREATE TYPE "import_item_status" AS ENUM ('ready', 'imported', 'imported_with_warnings', 'needs_review', 'rejected', 'skipped', 'change_detected');
--> statement-breakpoint
CREATE TABLE "import_batches" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "batch_key" text NOT NULL,
  "importer_version" text NOT NULL,
  "status" "import_batch_status" DEFAULT 'running' NOT NULL,
  "started_at" timestamptz DEFAULT now() NOT NULL,
  "finished_at" timestamptz,
  "summary" jsonb DEFAULT '{}'::jsonb NOT NULL,
  CONSTRAINT "import_batches_batch_key_uq" UNIQUE("batch_key")
);
--> statement-breakpoint
CREATE TABLE "legacy_identities" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "source_type" text NOT NULL,
  "source_path" text NOT NULL,
  "stable_key" text NOT NULL,
  "content_id" uuid REFERENCES "contents"("id") ON DELETE RESTRICT,
  "localization_id" uuid REFERENCES "content_localizations"("id") ON DELETE RESTRICT,
  "digest_id" uuid REFERENCES "update_digests"("id") ON DELETE RESTRICT,
  "source_checksum" text NOT NULL,
  "imported_checksum" text NOT NULL,
  "importer_version" text NOT NULL,
  "imported_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "legacy_identity_key_uq" UNIQUE("source_type", "stable_key"),
  CONSTRAINT "legacy_identity_target_ck" CHECK (num_nonnulls("localization_id", "digest_id") = 1)
);
--> statement-breakpoint
CREATE TABLE "import_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "batch_id" uuid NOT NULL REFERENCES "import_batches"("id") ON DELETE CASCADE,
  "source_type" text NOT NULL,
  "source_path" text NOT NULL,
  "stable_key" text NOT NULL,
  "source_checksum" text NOT NULL,
  "result_checksum" text,
  "status" "import_item_status" NOT NULL,
  "mapped_entity" text,
  "content_id" uuid REFERENCES "contents"("id") ON DELETE RESTRICT,
  "localization_id" uuid REFERENCES "content_localizations"("id") ON DELETE RESTRICT,
  "content_version_id" uuid REFERENCES "content_versions"("id") ON DELETE RESTRICT,
  "digest_id" uuid REFERENCES "update_digests"("id") ON DELETE RESTRICT,
  "warnings" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "structural_counts" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "comparison" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "import_item_batch_key_uq" UNIQUE("batch_id", "source_type", "stable_key")
);
--> statement-breakpoint
CREATE TYPE "publish_job_status" AS ENUM ('pending', 'running', 'completed', 'failed', 'cancelled');
--> statement-breakpoint
CREATE TABLE "publish_jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "idempotency_key" text NOT NULL UNIQUE,
  "content_version_id" uuid NOT NULL REFERENCES "content_versions"("id") ON DELETE RESTRICT,
  "requested_by" uuid REFERENCES "actors"("id") ON DELETE RESTRICT,
  "due_at" timestamptz NOT NULL,
  "status" "publish_job_status" DEFAULT 'pending' NOT NULL,
  "attempts" integer DEFAULT 0 NOT NULL CHECK ("attempts" >= 0),
  "locked_at" timestamptz,
  "locked_by" text,
  "completed_at" timestamptz,
  "failure_reason" text,
  "created_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "publish_jobs_due_idx" ON "publish_jobs" ("status", "due_at");
--> statement-breakpoint
CREATE TABLE "external_identities" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "provider" text NOT NULL,
  "provider_subject" text NOT NULL,
  "email" text,
  "email_verified" boolean DEFAULT false NOT NULL,
  "actor_id" uuid NOT NULL REFERENCES "actors"("id") ON DELETE RESTRICT,
  "allowlisted" boolean DEFAULT false NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "external_identity_subject_uq" UNIQUE("provider", "provider_subject")
);
--> statement-breakpoint
CREATE TABLE "actor_role_memberships" (
  "actor_id" uuid NOT NULL REFERENCES "actors"("id") ON DELETE CASCADE,
  "role" text NOT NULL CHECK ("role" IN ('owner','editor','reviewer','publisher','media_manager')),
  "granted_by" uuid REFERENCES "actors"("id") ON DELETE RESTRICT,
  "granted_at" timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY ("actor_id", "role")
);
