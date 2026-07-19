CREATE TYPE "import_review_classification" AS ENUM ('single', 'split_recommended', 'split_required', 'needs_editor_review');
--> statement-breakpoint
ALTER TABLE "import_items" ADD COLUMN "review_classification" "import_review_classification";
--> statement-breakpoint
ALTER TABLE "import_items" ADD COLUMN "review_reasons" jsonb DEFAULT '[]'::jsonb NOT NULL;
--> statement-breakpoint
ALTER TABLE "publish_jobs" ADD COLUMN "next_attempt_at" timestamptz;
--> statement-breakpoint
ALTER TABLE "publish_jobs" ADD COLUMN "permanent_failure" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
CREATE TABLE "editorial_issues" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "legacy_key" text NOT NULL UNIQUE,
  "issue_date" date NOT NULL,
  "locale" text DEFAULT 'ko' NOT NULL,
  "title" text NOT NULL,
  "summary" text DEFAULT '' NOT NULL,
  "editorial_note" text,
  "provenance" text NOT NULL,
  "generation_mode" text NOT NULL CHECK ("generation_mode" IN ('manual','automatic','mixed')),
  "legacy_route" text NOT NULL UNIQUE,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "editorial_issue_date_locale_uq" UNIQUE("issue_date", "locale")
);
--> statement-breakpoint
CREATE TABLE "editorial_issue_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "issue_id" uuid NOT NULL REFERENCES "editorial_issues"("id") ON DELETE CASCADE,
  "content_id" uuid REFERENCES "contents"("id") ON DELETE RESTRICT,
  "legacy_content_route" text NOT NULL,
  "order_index" integer NOT NULL,
  "editorial_label" text,
  "provenance" text NOT NULL,
  CONSTRAINT "editorial_issue_item_order_uq" UNIQUE("issue_id", "order_index"),
  CONSTRAINT "editorial_issue_item_route_uq" UNIQUE("issue_id", "legacy_content_route")
);
