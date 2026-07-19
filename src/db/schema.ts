import { sql } from 'drizzle-orm';
import { boolean, check, date, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export const contentKind = pgEnum('content_kind', ['knowledge', 'course', 'lesson', 'practice', 'ai_update', 'lecture']);
export const workflowStatus = pgEnum('workflow_status', ['draft', 'review', 'scheduled', 'published', 'archived', 'needs_review']);
export const validationStatus = pgEnum('validation_status', ['valid', 'valid_with_warnings', 'needs_review', 'rejected']);
export const artifactType = pgEnum('artifact_type', ['rendered_html', 'normalized_markdown', 'plain_text']);

const audit = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
};

export const actors = pgTable('actors', {
  id: uuid('id').primaryKey().defaultRandom(),
  role: text('role').notNull(),
  displayName: text('display_name').notNull(),
  ...audit,
}, (t) => [check('actors_role', sql`${t.role} in ('owner','editor','reviewer','publisher','media_manager')`)]);

export const translationGroups = pgTable('translation_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  originalLocale: text('original_locale').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const contents = pgTable('contents', {
  id: uuid('id').primaryKey().defaultRandom(),
  kind: contentKind('kind').notNull(),
  translationGroupId: uuid('translation_group_id').references(() => translationGroups.id, { onDelete: 'set null' }),
  createdBy: uuid('created_by').references(() => actors.id, { onDelete: 'restrict' }),
  ...audit,
});

export const contentLocalizations = pgTable('content_localizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  contentId: uuid('content_id').notNull().references(() => contents.id, { onDelete: 'cascade' }),
  locale: text('locale').notNull(),
  sourceLocale: text('source_locale'),
  translationStatus: text('translation_status').default('original').notNull(),
  translationOutdatedAt: timestamp('translation_outdated_at', { withTimezone: true }),
  title: text('title').notNull(),
  summary: text('summary').notNull().default(''),
  slug: text('slug').notNull(),
  routeScope: text('route_scope').notNull(),
  seo: jsonb('seo').$type<Record<string, unknown>>().default({}).notNull(),
  currentDraftVersionId: uuid('current_draft_version_id'),
  currentPublishedVersionId: uuid('current_published_version_id'),
  ...audit,
}, (t) => [
  uniqueIndex('localization_content_locale_uq').on(t.contentId, t.locale),
  uniqueIndex('localization_scoped_slug_uq').on(t.locale, t.routeScope, t.slug),
  index('localization_translation_idx').on(t.locale, t.translationStatus),
]);

export const contentVersions = pgTable('content_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  localizationId: uuid('localization_id').notNull().references(() => contentLocalizations.id, { onDelete: 'cascade' }),
  versionNumber: integer('version_number').notNull(),
  schemaVersion: integer('schema_version').notNull(),
  canonicalDocument: jsonb('canonical_document').$type<Record<string, unknown>>().notNull(),
  status: workflowStatus('status').notNull(),
  revisionSummary: text('revision_summary').notNull().default(''),
  changedFields: jsonb('changed_fields').$type<string[]>().default([]).notNull(),
  createdBy: uuid('created_by').references(() => actors.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  reviewedBy: uuid('reviewed_by').references(() => actors.id, { onDelete: 'restrict' }),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  supersedesVersionId: uuid('supersedes_version_id'),
  migrationMetadata: jsonb('migration_metadata').$type<Record<string, unknown>>().default({}).notNull(),
  documentChecksum: text('document_checksum').notNull(),
  validationStatus: validationStatus('validation_status').notNull(),
  validationWarnings: jsonb('validation_warnings').$type<string[]>().default([]).notNull(),
}, (t) => [uniqueIndex('content_version_number_uq').on(t.localizationId, t.versionNumber)]);

export const contentVersionArtifacts = pgTable('content_version_artifacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  contentVersionId: uuid('content_version_id').notNull().references(() => contentVersions.id, { onDelete: 'restrict' }),
  artifactType: artifactType('artifact_type').notNull(),
  body: text('body').notNull(),
  generatorVersion: text('generator_version').notNull(),
  checksum: text('checksum').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [uniqueIndex('version_artifact_type_uq').on(t.contentVersionId, t.artifactType)]);

export const knowledgeDetails = pgTable('knowledge_details', {
  localizationId: uuid('localization_id').primaryKey().references(() => contentLocalizations.id, { onDelete: 'cascade' }),
  format: text('format').notNull(), depth: text('depth').notNull().default('standard'),
  coreQuestion: text('core_question'), answerSummary: text('answer_summary'), difficulty: text('difficulty'),
  concepts: jsonb('concepts').$type<string[]>().default([]).notNull(),
  topic: text('topic'), recommendedOrder: integer('recommended_order'), verificationMetadata: jsonb('verification_metadata').$type<Record<string, unknown>>().default({}).notNull(),
}, (t) => [index('knowledge_recommended_order_idx').on(t.recommendedOrder)]);
export const lectureDetails = pgTable('lecture_details', {
  localizationId: uuid('localization_id').primaryKey().references(() => contentLocalizations.id, { onDelete: 'cascade' }),
  primarySourceKnowledgeId: uuid('primary_source_knowledge_id').notNull().references(() => contents.id, { onDelete: 'restrict' }),
  learningObjectives: jsonb('learning_objectives').$type<string[]>().default([]).notNull(), difficulty: text('difficulty').notNull(),
  recommendedOrder: integer('recommended_order'), checkpoints: jsonb('checkpoints').$type<string[]>().default([]).notNull(),
}, (t) => [check('lecture_difficulty', sql`${t.difficulty} in ('beginner','intermediate','advanced')`), index('lecture_primary_source_idx').on(t.primarySourceKnowledgeId), index('lecture_recommended_order_idx').on(t.recommendedOrder)]);
export const courses = pgTable('courses', {
  localizationId: uuid('localization_id').primaryKey().references(() => contentLocalizations.id, { onDelete: 'cascade' }),
  audience: text('audience'), level: text('level'), learningObjectives: jsonb('learning_objectives').default([]).notNull(),
  prerequisites: jsonb('prerequisites').default([]).notNull(), estimatedDurationMinutes: integer('estimated_duration_minutes'),
  publicationStatus: text('publication_status').notNull().default('draft'), completionCriteria: jsonb('completion_criteria').default([]).notNull(),
});
export const courseModules = pgTable('course_modules', {
  id: uuid('id').primaryKey().defaultRandom(), courseLocalizationId: uuid('course_localization_id').notNull().references(() => courses.localizationId, { onDelete: 'cascade' }),
  title: text('title').notNull(), summary: text('summary').notNull().default(''), order: integer('order_index').notNull(), objectives: jsonb('objectives').default([]).notNull(), status: text('status').notNull().default('draft'),
}, (t) => [uniqueIndex('course_module_order_uq').on(t.courseLocalizationId, t.order)]);
export const lessons = pgTable('lessons', {
  localizationId: uuid('localization_id').primaryKey().references(() => contentLocalizations.id, { onDelete: 'cascade' }),
  objectives: jsonb('objectives').default([]).notNull(), estimatedDurationMinutes: integer('estimated_duration_minutes'), completionCriteria: jsonb('completion_criteria').default([]).notNull(), publicationStatus: text('publication_status').notNull().default('draft'),
});
export const courseModuleItems = pgTable('course_module_items', {
  id: uuid('id').primaryKey().defaultRandom(), moduleId: uuid('module_id').notNull().references(() => courseModules.id, { onDelete: 'cascade' }), lessonLocalizationId: uuid('lesson_localization_id').notNull().references(() => lessons.localizationId, { onDelete: 'restrict' }), order: integer('order_index').notNull(),
}, (t) => [uniqueIndex('module_item_order_uq').on(t.moduleId, t.order), uniqueIndex('module_lesson_uq').on(t.moduleId, t.lessonLocalizationId)]);
export const practices = pgTable('practices', {
  localizationId: uuid('localization_id').primaryKey().references(() => contentLocalizations.id, { onDelete: 'cascade' }),
  practiceType: text('practice_type').notNull(), objective: text('objective').notNull(), difficulty: text('difficulty'), durationMinutes: integer('duration_minutes'), evaluationCriteria: jsonb('evaluation_criteria').default([]).notNull(), completionMode: text('completion_mode').notNull(), outcomeStatus: text('outcome_status'), relatedKnowledgeId: uuid('related_knowledge_id').references(() => contents.id, { onDelete: 'restrict' }),
}, (t) => [check('practice_outcome_status_valid', sql`${t.outcomeStatus} is null or ${t.outcomeStatus} in ('verified','partially_verified','not_verified','failed','inconclusive')`), index('practice_related_knowledge_idx').on(t.relatedKnowledgeId), index('practice_outcome_status_idx').on(t.outcomeStatus)]);
export const aiUpdates = pgTable('ai_updates', {
  localizationId: uuid('localization_id').primaryKey().references(() => contentLocalizations.id, { onDelete: 'cascade' }),
  vendor: text('vendor'), product: text('product'), announcedAt: timestamp('announced_at', { withTimezone: true }), occurredAt: timestamp('occurred_at', { withTimezone: true }), checkedAt: timestamp('checked_at', { withTimezone: true }), changeSummary: text('change_summary').notNull(), impact: text('impact'), sourceConfidence: text('source_confidence'),
});
export const updateDigests = pgTable('update_digests', {
  id: uuid('id').primaryKey().defaultRandom(), digestDate: date('digest_date').notNull(), locale: text('locale').notNull(), title: text('title').notNull(), editorialSummary: text('editorial_summary').notNull().default(''), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [uniqueIndex('digest_date_locale_uq').on(t.digestDate, t.locale)]);
export const updateDigestItems = pgTable('update_digest_items', {
  id: uuid('id').primaryKey().defaultRandom(), digestId: uuid('digest_id').notNull().references(() => updateDigests.id, { onDelete: 'cascade' }), updateLocalizationId: uuid('update_localization_id').notNull().references(() => aiUpdates.localizationId, { onDelete: 'restrict' }), order: integer('order_index').notNull(),
}, (t) => [uniqueIndex('digest_item_order_uq').on(t.digestId, t.order), uniqueIndex('digest_update_uq').on(t.digestId, t.updateLocalizationId)]);

export const contentRelations = pgTable('content_relations', {
  id: uuid('id').primaryKey().defaultRandom(), sourceContentId: uuid('source_content_id').notNull().references(() => contents.id, { onDelete: 'cascade' }), targetContentId: uuid('target_content_id').notNull().references(() => contents.id, { onDelete: 'restrict' }), relationType: text('relation_type').notNull(), order: integer('order_index'), description: text('description'), provenance: text('provenance').notNull().default('manual'), approvalStatus: text('approval_status').notNull().default('approved'), createdBy: uuid('created_by').references(() => actors.id), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [check('relation_no_self', sql`${t.sourceContentId} <> ${t.targetContentId}`), uniqueIndex('relation_unique').on(t.sourceContentId, t.targetContentId, t.relationType)]);
export const sources = pgTable('sources', {
  id: uuid('id').primaryKey().defaultRandom(), sourceType: text('source_type').notNull(), title: text('title').notNull(), publisher: text('publisher'), author: text('author'), url: text('url'), canonicalUrl: text('canonical_url'), publishedAt: timestamp('published_at', { withTimezone: true }), accessedAt: timestamp('accessed_at', { withTimezone: true }), archivedUrl: text('archived_url'), identifier: text('identifier'), metadata: jsonb('metadata').default({}).notNull(), reviewStatus: text('review_status').notNull().default('pending'),
});
export const contentSources = pgTable('content_sources', {
  id: uuid('id').primaryKey().defaultRandom(), contentVersionId: uuid('content_version_id').notNull().references(() => contentVersions.id, { onDelete: 'cascade' }), sourceId: uuid('source_id').notNull().references(() => sources.id, { onDelete: 'restrict' }), role: text('role').notNull(), locator: text('locator'), note: text('note'), claimReference: text('claim_reference'), order: integer('order_index').notNull().default(0), sourceCheckedAt: timestamp('source_checked_at', { withTimezone: true }),
}, (t) => [uniqueIndex('version_source_role_order_uq').on(t.contentVersionId, t.sourceId, t.role, t.order)]);
export const mediaAssets = pgTable('media_assets', {
  id: uuid('id').primaryKey().defaultRandom(), status: text('status').notNull().default('pending'), storageProvider: text('storage_provider'), storageKey: text('storage_key'), originalFilename: text('original_filename').notNull(), mimeType: text('mime_type').notNull(), sizeBytes: integer('size_bytes'), width: integer('width'), height: integer('height'), checksum: text('checksum').notNull(), sourceUrl: text('source_url'), rights: text('rights'), license: text('license'), aiGenerated: text('ai_generated').notNull().default('unknown'), createdBy: uuid('created_by').references(() => actors.id), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
export const mediaUsages = pgTable('media_usages', {
  id: uuid('id').primaryKey().defaultRandom(), mediaId: uuid('media_id').notNull().references(() => mediaAssets.id, { onDelete: 'restrict' }), contentVersionId: uuid('content_version_id').notNull().references(() => contentVersions.id, { onDelete: 'cascade' }), usageType: text('usage_type').notNull(), alt: text('alt').notNull(), caption: text('caption'), order: integer('order_index').notNull().default(0), metadata: jsonb('metadata').default({}).notNull(),
}, (t) => [uniqueIndex('version_media_usage_uq').on(t.contentVersionId, t.mediaId, t.usageType, t.order)]);
export const contentRoutes = pgTable('content_routes', {
  id: uuid('id').primaryKey().defaultRandom(), localizationId: uuid('localization_id').references(() => contentLocalizations.id, { onDelete: 'cascade' }), digestId: uuid('digest_id').references(() => updateDigests.id, { onDelete: 'cascade' }), route: text('route').notNull(), routeType: text('route_type').notNull(), isCanonical: boolean('is_canonical').notNull().default(false), redirectStatus: integer('redirect_status'), activeFrom: timestamp('active_from', { withTimezone: true }).defaultNow().notNull(), activeUntil: timestamp('active_until', { withTimezone: true }), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [uniqueIndex('content_route_uq').on(t.route), check('route_exactly_one_target', sql`num_nonnulls(${t.localizationId}, ${t.digestId}) = 1`)]);
export const revisionEvents = pgTable('revision_events', {
  id: uuid('id').primaryKey().defaultRandom(), contentVersionId: uuid('content_version_id').notNull().references(() => contentVersions.id, { onDelete: 'restrict' }), eventType: text('event_type').notNull(), actorId: uuid('actor_id').references(() => actors.id), metadata: jsonb('metadata').default({}).notNull(), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
