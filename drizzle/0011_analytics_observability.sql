CREATE TABLE "analytics_sessions" (
  "session_id" text PRIMARY KEY NOT NULL,
  "anonymous_id" text NOT NULL,
  "started_at" timestamp with time zone NOT NULL,
  "last_activity_at" timestamp with time zone NOT NULL,
  "landing_route" text NOT NULL,
  "exit_route" text,
  "referrer_source" text,
  "referrer_url" text,
  "utm_source" text,
  "utm_medium" text,
  "utm_campaign" text,
  "utm_content" text,
  "utm_term" text,
  "device_type" text,
  "country_code" text,
  "consent_state" text NOT NULL,
  "schema_version" integer NOT NULL DEFAULT 1,
  CONSTRAINT "analytics_sessions_consent_state_valid" CHECK ("consent_state" IN ('granted','denied','not_required','unknown')),
  CONSTRAINT "analytics_sessions_schema_version_valid" CHECK ("schema_version" >= 1)
);
--> statement-breakpoint
CREATE INDEX "analytics_sessions_anonymous_idx" ON "analytics_sessions" ("anonymous_id");
--> statement-breakpoint
CREATE INDEX "analytics_sessions_activity_idx" ON "analytics_sessions" ("last_activity_at");
--> statement-breakpoint
CREATE TABLE "analytics_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "event_id" text NOT NULL,
  "event_name" text NOT NULL,
  "occurred_at" timestamp with time zone NOT NULL,
  "session_id" text NOT NULL REFERENCES "analytics_sessions"("session_id") ON DELETE cascade,
  "anonymous_id" text NOT NULL,
  "page_view_id" text,
  "content_type" text,
  "content_id" text,
  "route" text NOT NULL,
  "landing_route" text,
  "referrer_source" text,
  "referrer_url" text,
  "utm_source" text,
  "utm_medium" text,
  "utm_campaign" text,
  "utm_content" text,
  "utm_term" text,
  "metadata" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "consent_state" text NOT NULL,
  "schema_version" integer NOT NULL DEFAULT 1,
  CONSTRAINT "analytics_events_event_name_valid" CHECK ("event_name" IN (
    'content_open','content_progress','content_complete','internal_link_click','share_complete','file_download',
    'lecture_start','lecture_complete','practice_start','practice_complete',
    'search_submit','search_result_click','search_zero_result',
    'book_preview_open','book_purchase_click','purchase_start','purchase_complete',
    'error_404','error_500','client_error','api_error'
  )),
  CONSTRAINT "analytics_events_consent_state_valid" CHECK ("consent_state" IN ('granted','denied','not_required','unknown')),
  CONSTRAINT "analytics_events_schema_version_valid" CHECK ("schema_version" >= 1)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "analytics_event_id_uq" ON "analytics_events" ("event_id");
--> statement-breakpoint
CREATE INDEX "analytics_event_name_time_idx" ON "analytics_events" ("event_name", "occurred_at");
--> statement-breakpoint
CREATE INDEX "analytics_event_session_time_idx" ON "analytics_events" ("session_id", "occurred_at");
--> statement-breakpoint
CREATE INDEX "analytics_event_content_time_idx" ON "analytics_events" ("content_type", "content_id", "occurred_at");
