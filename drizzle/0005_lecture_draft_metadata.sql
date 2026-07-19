ALTER TABLE "lecture_details" ADD COLUMN "audience" text;
--> statement-breakpoint
ALTER TABLE "lecture_details" ADD COLUMN "estimated_duration_minutes" integer;
--> statement-breakpoint
ALTER TABLE "lecture_details" ADD CONSTRAINT "lecture_duration_positive" CHECK ("estimated_duration_minutes" IS NULL OR "estimated_duration_minutes" >= 1);
