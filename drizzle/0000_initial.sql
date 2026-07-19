CREATE TYPE "public"."artifact_type" AS ENUM('rendered_html', 'normalized_markdown', 'plain_text');--> statement-breakpoint
CREATE TYPE "public"."content_kind" AS ENUM('knowledge', 'course', 'lesson', 'practice', 'ai_update');--> statement-breakpoint
CREATE TYPE "public"."validation_status" AS ENUM('valid', 'valid_with_warnings', 'needs_review', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."workflow_status" AS ENUM('draft', 'review', 'scheduled', 'published', 'archived', 'needs_review');--> statement-breakpoint
CREATE TABLE "actors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" text NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "actors_role" CHECK ("actors"."role" in ('owner','editor','reviewer','publisher','media_manager'))
);
--> statement-breakpoint
CREATE TABLE "ai_updates" (
	"localization_id" uuid PRIMARY KEY NOT NULL,
	"vendor" text,
	"product" text,
	"announced_at" timestamp with time zone,
	"occurred_at" timestamp with time zone,
	"checked_at" timestamp with time zone,
	"change_summary" text NOT NULL,
	"impact" text,
	"source_confidence" text
);
--> statement-breakpoint
CREATE TABLE "content_localizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_id" uuid NOT NULL,
	"locale" text NOT NULL,
	"source_locale" text,
	"translation_status" text DEFAULT 'original' NOT NULL,
	"translation_outdated_at" timestamp with time zone,
	"title" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"slug" text NOT NULL,
	"route_scope" text NOT NULL,
	"seo" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"current_draft_version_id" uuid,
	"current_published_version_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_relations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_content_id" uuid NOT NULL,
	"target_content_id" uuid NOT NULL,
	"relation_type" text NOT NULL,
	"order_index" integer,
	"description" text,
	"provenance" text DEFAULT 'manual' NOT NULL,
	"approval_status" text DEFAULT 'approved' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "relation_no_self" CHECK ("content_relations"."source_content_id" <> "content_relations"."target_content_id")
);
--> statement-breakpoint
CREATE TABLE "content_routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"localization_id" uuid,
	"digest_id" uuid,
	"route" text NOT NULL,
	"route_type" text NOT NULL,
	"is_canonical" boolean DEFAULT false NOT NULL,
	"redirect_status" integer,
	"active_from" timestamp with time zone DEFAULT now() NOT NULL,
	"active_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "route_exactly_one_target" CHECK (num_nonnulls("content_routes"."localization_id", "content_routes"."digest_id") = 1)
);
--> statement-breakpoint
CREATE TABLE "content_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_version_id" uuid NOT NULL,
	"source_id" uuid NOT NULL,
	"role" text NOT NULL,
	"locator" text,
	"note" text,
	"claim_reference" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"source_checked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "content_version_artifacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_version_id" uuid NOT NULL,
	"artifact_type" "artifact_type" NOT NULL,
	"body" text NOT NULL,
	"generator_version" text NOT NULL,
	"checksum" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"localization_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"schema_version" integer NOT NULL,
	"canonical_document" jsonb NOT NULL,
	"status" "workflow_status" NOT NULL,
	"revision_summary" text DEFAULT '' NOT NULL,
	"changed_fields" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"supersedes_version_id" uuid,
	"migration_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"document_checksum" text NOT NULL,
	"validation_status" "validation_status" NOT NULL,
	"validation_warnings" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "content_kind" NOT NULL,
	"translation_group_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_module_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module_id" uuid NOT NULL,
	"lesson_localization_id" uuid NOT NULL,
	"order_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_localization_id" uuid NOT NULL,
	"title" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"order_index" integer NOT NULL,
	"objectives" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"localization_id" uuid PRIMARY KEY NOT NULL,
	"audience" text,
	"level" text,
	"learning_objectives" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"prerequisites" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"estimated_duration_minutes" integer,
	"publication_status" text DEFAULT 'draft' NOT NULL,
	"completion_criteria" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_details" (
	"localization_id" uuid PRIMARY KEY NOT NULL,
	"format" text NOT NULL,
	"depth" text DEFAULT 'standard' NOT NULL,
	"core_question" text,
	"answer_summary" text,
	"difficulty" text,
	"concepts" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"localization_id" uuid PRIMARY KEY NOT NULL,
	"objectives" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"estimated_duration_minutes" integer,
	"completion_criteria" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"publication_status" text DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"storage_provider" text,
	"storage_key" text,
	"original_filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer,
	"width" integer,
	"height" integer,
	"checksum" text NOT NULL,
	"source_url" text,
	"rights" text,
	"license" text,
	"ai_generated" text DEFAULT 'unknown' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_usages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_id" uuid NOT NULL,
	"content_version_id" uuid NOT NULL,
	"usage_type" text NOT NULL,
	"alt" text NOT NULL,
	"caption" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practices" (
	"localization_id" uuid PRIMARY KEY NOT NULL,
	"practice_type" text NOT NULL,
	"objective" text NOT NULL,
	"difficulty" text,
	"duration_minutes" integer,
	"evaluation_criteria" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"completion_mode" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revision_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_version_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"actor_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_type" text NOT NULL,
	"title" text NOT NULL,
	"publisher" text,
	"author" text,
	"url" text,
	"canonical_url" text,
	"published_at" timestamp with time zone,
	"accessed_at" timestamp with time zone,
	"archived_url" text,
	"identifier" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"review_status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translation_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_locale" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "update_digest_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"digest_id" uuid NOT NULL,
	"update_localization_id" uuid NOT NULL,
	"order_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "update_digests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"digest_date" date NOT NULL,
	"locale" text NOT NULL,
	"title" text NOT NULL,
	"editorial_summary" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_updates" ADD CONSTRAINT "ai_updates_localization_id_content_localizations_id_fk" FOREIGN KEY ("localization_id") REFERENCES "public"."content_localizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_localizations" ADD CONSTRAINT "content_localizations_content_id_contents_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."contents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_relations" ADD CONSTRAINT "content_relations_source_content_id_contents_id_fk" FOREIGN KEY ("source_content_id") REFERENCES "public"."contents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_relations" ADD CONSTRAINT "content_relations_target_content_id_contents_id_fk" FOREIGN KEY ("target_content_id") REFERENCES "public"."contents"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_relations" ADD CONSTRAINT "content_relations_created_by_actors_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."actors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_routes" ADD CONSTRAINT "content_routes_localization_id_content_localizations_id_fk" FOREIGN KEY ("localization_id") REFERENCES "public"."content_localizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_routes" ADD CONSTRAINT "content_routes_digest_id_update_digests_id_fk" FOREIGN KEY ("digest_id") REFERENCES "public"."update_digests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_sources" ADD CONSTRAINT "content_sources_content_version_id_content_versions_id_fk" FOREIGN KEY ("content_version_id") REFERENCES "public"."content_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_sources" ADD CONSTRAINT "content_sources_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_version_artifacts" ADD CONSTRAINT "content_version_artifacts_content_version_id_content_versions_id_fk" FOREIGN KEY ("content_version_id") REFERENCES "public"."content_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_localization_id_content_localizations_id_fk" FOREIGN KEY ("localization_id") REFERENCES "public"."content_localizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_created_by_actors_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."actors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_reviewed_by_actors_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."actors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contents" ADD CONSTRAINT "contents_translation_group_id_translation_groups_id_fk" FOREIGN KEY ("translation_group_id") REFERENCES "public"."translation_groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contents" ADD CONSTRAINT "contents_created_by_actors_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."actors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_module_items" ADD CONSTRAINT "course_module_items_module_id_course_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."course_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_module_items" ADD CONSTRAINT "course_module_items_lesson_localization_id_lessons_localization_id_fk" FOREIGN KEY ("lesson_localization_id") REFERENCES "public"."lessons"("localization_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_course_localization_id_courses_localization_id_fk" FOREIGN KEY ("course_localization_id") REFERENCES "public"."courses"("localization_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_localization_id_content_localizations_id_fk" FOREIGN KEY ("localization_id") REFERENCES "public"."content_localizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_details" ADD CONSTRAINT "knowledge_details_localization_id_content_localizations_id_fk" FOREIGN KEY ("localization_id") REFERENCES "public"."content_localizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_localization_id_content_localizations_id_fk" FOREIGN KEY ("localization_id") REFERENCES "public"."content_localizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_created_by_actors_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."actors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_usages" ADD CONSTRAINT "media_usages_media_id_media_assets_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_assets"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_usages" ADD CONSTRAINT "media_usages_content_version_id_content_versions_id_fk" FOREIGN KEY ("content_version_id") REFERENCES "public"."content_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practices" ADD CONSTRAINT "practices_localization_id_content_localizations_id_fk" FOREIGN KEY ("localization_id") REFERENCES "public"."content_localizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revision_events" ADD CONSTRAINT "revision_events_content_version_id_content_versions_id_fk" FOREIGN KEY ("content_version_id") REFERENCES "public"."content_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revision_events" ADD CONSTRAINT "revision_events_actor_id_actors_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."actors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "update_digest_items" ADD CONSTRAINT "update_digest_items_digest_id_update_digests_id_fk" FOREIGN KEY ("digest_id") REFERENCES "public"."update_digests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "update_digest_items" ADD CONSTRAINT "update_digest_items_update_localization_id_ai_updates_localization_id_fk" FOREIGN KEY ("update_localization_id") REFERENCES "public"."ai_updates"("localization_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "localization_content_locale_uq" ON "content_localizations" USING btree ("content_id","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "localization_scoped_slug_uq" ON "content_localizations" USING btree ("locale","route_scope","slug");--> statement-breakpoint
CREATE INDEX "localization_translation_idx" ON "content_localizations" USING btree ("locale","translation_status");--> statement-breakpoint
CREATE UNIQUE INDEX "relation_unique" ON "content_relations" USING btree ("source_content_id","target_content_id","relation_type");--> statement-breakpoint
CREATE UNIQUE INDEX "content_route_uq" ON "content_routes" USING btree ("route");--> statement-breakpoint
CREATE UNIQUE INDEX "version_source_role_order_uq" ON "content_sources" USING btree ("content_version_id","source_id","role","order_index");--> statement-breakpoint
CREATE UNIQUE INDEX "version_artifact_type_uq" ON "content_version_artifacts" USING btree ("content_version_id","artifact_type");--> statement-breakpoint
CREATE UNIQUE INDEX "content_version_number_uq" ON "content_versions" USING btree ("localization_id","version_number");--> statement-breakpoint
CREATE UNIQUE INDEX "module_item_order_uq" ON "course_module_items" USING btree ("module_id","order_index");--> statement-breakpoint
CREATE UNIQUE INDEX "module_lesson_uq" ON "course_module_items" USING btree ("module_id","lesson_localization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "course_module_order_uq" ON "course_modules" USING btree ("course_localization_id","order_index");--> statement-breakpoint
CREATE UNIQUE INDEX "version_media_usage_uq" ON "media_usages" USING btree ("content_version_id","media_id","usage_type","order_index");--> statement-breakpoint
CREATE UNIQUE INDEX "digest_item_order_uq" ON "update_digest_items" USING btree ("digest_id","order_index");--> statement-breakpoint
CREATE UNIQUE INDEX "digest_update_uq" ON "update_digest_items" USING btree ("digest_id","update_localization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "digest_date_locale_uq" ON "update_digests" USING btree ("digest_date","locale");
--> statement-breakpoint
ALTER TABLE "content_localizations" ADD CONSTRAINT "localization_current_draft_fk" FOREIGN KEY ("current_draft_version_id") REFERENCES "content_versions"("id") ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;
--> statement-breakpoint
ALTER TABLE "content_localizations" ADD CONSTRAINT "localization_current_published_fk" FOREIGN KEY ("current_published_version_id") REFERENCES "content_versions"("id") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;
--> statement-breakpoint
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_supersedes_fk" FOREIGN KEY ("supersedes_version_id") REFERENCES "content_versions"("id") ON DELETE RESTRICT;
--> statement-breakpoint
CREATE UNIQUE INDEX "canonical_localization_route_uq" ON "content_routes" ("localization_id") WHERE "is_canonical" AND "active_until" IS NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX "canonical_digest_route_uq" ON "content_routes" ("digest_id") WHERE "is_canonical" AND "active_until" IS NULL;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION reject_published_version_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status = 'published' THEN
    RAISE EXCEPTION 'published content version % is immutable', OLD.id;
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END $$;
--> statement-breakpoint
CREATE TRIGGER content_versions_immutable BEFORE UPDATE OR DELETE ON "content_versions"
FOR EACH ROW EXECUTE FUNCTION reject_published_version_mutation();
--> statement-breakpoint
CREATE OR REPLACE FUNCTION reject_published_artifact_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE target_version uuid;
DECLARE target_status workflow_status;
BEGIN
  target_version := CASE WHEN TG_OP = 'DELETE' THEN OLD.content_version_id ELSE NEW.content_version_id END;
  SELECT status INTO target_status FROM content_versions WHERE id = target_version;
  IF target_status = 'published' THEN
    RAISE EXCEPTION 'artifacts for published version % are immutable', target_version;
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END $$;
--> statement-breakpoint
CREATE TRIGGER content_version_artifacts_immutable BEFORE INSERT OR UPDATE OR DELETE ON "content_version_artifacts"
FOR EACH ROW EXECUTE FUNCTION reject_published_artifact_mutation();
--> statement-breakpoint
CREATE OR REPLACE FUNCTION normalize_relation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.relation_type IN ('related', 'translation_of') AND NEW.source_content_id::text > NEW.target_content_id::text THEN
    SELECT NEW.target_content_id, NEW.source_content_id INTO NEW.source_content_id, NEW.target_content_id;
  END IF;
  RETURN NEW;
END $$;
--> statement-breakpoint
CREATE TRIGGER content_relations_normalize BEFORE INSERT OR UPDATE ON "content_relations"
FOR EACH ROW EXECUTE FUNCTION normalize_relation();
