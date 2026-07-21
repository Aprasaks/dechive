ALTER TYPE "public"."content_kind" ADD VALUE IF NOT EXISTS 'book';
--> statement-breakpoint
CREATE TABLE "book_details" (
  "localization_id" uuid PRIMARY KEY NOT NULL REFERENCES "content_localizations"("id") ON DELETE cascade,
  "publication_status" text NOT NULL,
  "access_type" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "book_publication_status_valid" CHECK ("publication_status" IN ('coming_soon','available','unavailable')),
  CONSTRAINT "book_access_type_valid" CHECK ("access_type" IN ('free','paid'))
);
--> statement-breakpoint
CREATE INDEX "book_details_publication_status_idx" ON "book_details" ("publication_status");
