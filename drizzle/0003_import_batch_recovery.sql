ALTER TYPE "import_batch_status" ADD VALUE IF NOT EXISTS 'partial_failure';
--> statement-breakpoint
ALTER TYPE "import_batch_status" ADD VALUE IF NOT EXISTS 'cancelled';
--> statement-breakpoint
ALTER TYPE "import_item_status" ADD VALUE IF NOT EXISTS 'failed';
--> statement-breakpoint
ALTER TABLE "import_batches" ADD COLUMN "last_heartbeat_at" timestamptz DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "import_batches" ADD COLUMN "recovery_count" integer DEFAULT 0 NOT NULL CHECK ("recovery_count" >= 0);
--> statement-breakpoint
ALTER TABLE "import_items" ADD COLUMN "attempt_count" integer DEFAULT 1 NOT NULL CHECK ("attempt_count" >= 1);
--> statement-breakpoint
ALTER TABLE "import_items" ADD COLUMN "last_attempted_at" timestamptz DEFAULT now() NOT NULL;
