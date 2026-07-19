ALTER TABLE "ai_updates" ADD COLUMN "official_updated_at" timestamp with time zone;
--> statement-breakpoint
ALTER TABLE "ai_updates" ADD COLUMN "last_verified_at" timestamp with time zone;
--> statement-breakpoint
CREATE INDEX "ai_updates_official_updated_idx" ON "ai_updates" ("official_updated_at" DESC) WHERE "official_updated_at" IS NOT NULL;
