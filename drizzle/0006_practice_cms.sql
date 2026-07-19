ALTER TABLE "practices" ADD COLUMN "outcome_status" text;
--> statement-breakpoint
ALTER TABLE "practices" ADD COLUMN "related_knowledge_id" uuid;
--> statement-breakpoint
ALTER TABLE "practices" ADD CONSTRAINT "practice_outcome_status_valid" CHECK ("outcome_status" IS NULL OR "outcome_status" IN ('verified','partially_verified','not_verified','failed','inconclusive'));
--> statement-breakpoint
ALTER TABLE "practices" ADD CONSTRAINT "practice_related_knowledge_fk" FOREIGN KEY ("related_knowledge_id") REFERENCES "contents"("id") ON DELETE RESTRICT;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION validate_practice_detail() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE owner_kind text; related_kind text; owner_content uuid;
BEGIN
  SELECT c.kind::text, cl.content_id INTO owner_kind, owner_content FROM content_localizations cl JOIN contents c ON c.id=cl.content_id WHERE cl.id=NEW.localization_id;
  IF owner_kind IS DISTINCT FROM 'practice' THEN RAISE EXCEPTION 'practice_detail_requires_practice_content'; END IF;
  IF NEW.related_knowledge_id IS NOT NULL THEN
    SELECT kind::text INTO related_kind FROM contents WHERE id=NEW.related_knowledge_id;
    IF related_kind IS DISTINCT FROM 'knowledge' THEN RAISE EXCEPTION 'practice_related_knowledge_requires_knowledge'; END IF;
    IF owner_content=NEW.related_knowledge_id THEN RAISE EXCEPTION 'practice_related_knowledge_cannot_be_self'; END IF;
  END IF;
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER practices_validate BEFORE INSERT OR UPDATE ON "practices" FOR EACH ROW EXECUTE FUNCTION validate_practice_detail();
--> statement-breakpoint
CREATE INDEX "practice_related_knowledge_idx" ON "practices" ("related_knowledge_id") WHERE "related_knowledge_id" IS NOT NULL;
--> statement-breakpoint
CREATE INDEX "practice_outcome_status_idx" ON "practices" ("outcome_status") WHERE "outcome_status" IS NOT NULL;
