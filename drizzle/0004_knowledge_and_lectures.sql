ALTER TYPE "public"."content_kind" ADD VALUE IF NOT EXISTS 'lecture';
--> statement-breakpoint
ALTER TABLE "knowledge_details" ADD COLUMN "topic" text;
--> statement-breakpoint
ALTER TABLE "knowledge_details" ADD COLUMN "recommended_order" integer;
--> statement-breakpoint
ALTER TABLE "knowledge_details" ADD COLUMN "verification_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;
--> statement-breakpoint
CREATE TABLE "lecture_details" (
  "localization_id" uuid PRIMARY KEY NOT NULL,
  "primary_source_knowledge_id" uuid NOT NULL,
  "learning_objectives" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "difficulty" text NOT NULL,
  "recommended_order" integer,
  "checkpoints" jsonb DEFAULT '[]'::jsonb NOT NULL,
  CONSTRAINT "lecture_difficulty" CHECK ("difficulty" in ('beginner','intermediate','advanced'))
);
--> statement-breakpoint
ALTER TABLE "lecture_details" ADD CONSTRAINT "lecture_details_localization_fk" FOREIGN KEY ("localization_id") REFERENCES "content_localizations"("id") ON DELETE cascade;
--> statement-breakpoint
ALTER TABLE "lecture_details" ADD CONSTRAINT "lecture_details_primary_knowledge_fk" FOREIGN KEY ("primary_source_knowledge_id") REFERENCES "contents"("id") ON DELETE restrict;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION validate_lecture_detail() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE owner_kind text; source_kind text; owner_content uuid;
BEGIN
  SELECT cl.content_id, c.kind::text INTO owner_content, owner_kind
  FROM content_localizations cl JOIN contents c ON c.id=cl.content_id WHERE cl.id=NEW.localization_id;
  SELECT kind::text INTO source_kind FROM contents WHERE id=NEW.primary_source_knowledge_id;
  IF owner_kind IS DISTINCT FROM 'lecture' THEN RAISE EXCEPTION 'lecture_detail_requires_lecture_content'; END IF;
  IF source_kind IS DISTINCT FROM 'knowledge' THEN RAISE EXCEPTION 'lecture_primary_source_requires_knowledge'; END IF;
  IF owner_content=NEW.primary_source_knowledge_id THEN RAISE EXCEPTION 'lecture_primary_source_cannot_be_self'; END IF;
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER lecture_details_validate BEFORE INSERT OR UPDATE ON "lecture_details" FOR EACH ROW EXECUTE FUNCTION validate_lecture_detail();
--> statement-breakpoint
CREATE INDEX "lecture_primary_source_idx" ON "lecture_details" ("primary_source_knowledge_id");
--> statement-breakpoint
CREATE INDEX "knowledge_recommended_order_idx" ON "knowledge_details" ("recommended_order");
--> statement-breakpoint
CREATE INDEX "lecture_recommended_order_idx" ON "lecture_details" ("recommended_order");
