import { createHash } from 'node:crypto';
import type { JSONContent } from '@tiptap/core';
import type { Pool, PoolClient } from 'pg';
import { createDatabase, LOCAL_TEST_DATABASE_URL } from '@/db/client';
import {
  normalizeAnchors,
  plainText,
  type DechiveDocument,
} from '@/features/editor-lab/document';
import { validateDechiveDocument } from '@/features/editor-lab/security';
import { isAuthorizedOwner } from '@/features/admin/owner-auth';
import {
  getKnowledgeHero,
  resolveKnowledgeDocument,
  saveKnowledgeMediaUsages,
  type KnowledgeHero,
} from './media-assets';

type Locale = 'ko' | 'en';
type DraftStatus = 'draft' | 'needs_review';
type BaseDraftInput = {
  title: string;
  slug: string;
  locale: Locale;
  summary: string;
  document: DechiveDocument;
};
export type KnowledgeReference = {
  type: 'external' | 'direct_verification';
  title: string;
  authorOrOrganization: string;
  url: string;
  accessedAt: string;
  note: string;
};
export type KnowledgeDraftInput = BaseDraftInput & {
  tags: string[];
  references?: KnowledgeReference[];
  hero?: KnowledgeHero | null;
};
export type KnowledgeWorkflowStatus = 'draft' | 'published' | 'withdrawn' | 'archived';
export type KnowledgeListItem = {
  id: string;
  slug: string;
  title: string;
  locale: Locale;
  workflowStatus: KnowledgeWorkflowStatus;
  versionNumber: number;
  publishedVersionNumber: number | null;
  hasUnpublishedChanges: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};
export type LectureDraftInput = BaseDraftInput & {
  primarySourceKnowledgeId: string;
  learningObjectives: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  recommendedOrder: number | null;
  checkpoints: string[];
  audience?: string;
  estimatedDurationMinutes?: number | null;
  coreMessage?: string;
  references?: KnowledgeReference[];
};
export type KnowledgeOption = {
  localizationId: string;
  contentId: string;
  title: string;
  summary: string;
};
export type KnowledgeDraft = KnowledgeDraftInput & {
  localizationId: string;
  contentId: string;
  versionId: string;
  versionNumber: number;
  status: DraftStatus;
  route: string;
  updatedAt: string;
  createdAt: string;
  publishedAt: string | null;
  lastPublishedAt: string | null;
  publishedVersionId: string | null;
  publishedVersionNumber: number | null;
  workflowStatus: KnowledgeWorkflowStatus;
  hero: KnowledgeHero | null;
  heroImageUrl: string | null;
  legacyMetadata: {
    topic: string;
    recommendedOrder: number | null;
    prerequisiteKnowledgeIds: string[];
    relatedKnowledgeIds: string[];
    verificationMetadata: string;
  };
};
export type KnowledgePublishState = {
  draftVersionId: string;
  draftVersionNumber: number;
  publishedVersionId: string | null;
  publishedVersionNumber: number | null;
  createdAt: string;
  publishedAt: string | null;
  lastPublishedAt: string | null;
  workflowStatus: KnowledgeWorkflowStatus;
  readiness: ReturnType<typeof validateKnowledgePublishReadiness>;
};
export type LecturePublishState = {
  draftVersionId: string;
  draftVersionNumber: number;
  publishedVersionId: string | null;
  publishedVersionNumber: number | null;
  readiness: ReturnType<typeof validateLecturePublishReadiness>;
};
export type LectureDraft = Omit<LectureDraftInput, 'audience' | 'estimatedDurationMinutes' | 'coreMessage' | 'references'> & {
  localizationId: string;
  contentId: string;
  versionId: string;
  versionNumber: number;
  status: DraftStatus;
  route: string;
  updatedAt: string;
  primarySourceTitle: string;
  primarySourceSummary: string;
  audience: string;
  estimatedDurationMinutes: number | null;
  coreMessage: string;
  references: KnowledgeReference[];
};
export const KNOWLEDGE_CANONICAL_LIST_ROUTE = '/knowledge';
export const LECTURE_CANONICAL_LIST_ROUTE = '/lecture';
export function knowledgeCanonicalRoute(slug: string) {
  return `${KNOWLEDGE_CANONICAL_LIST_ROUTE}/${slug}`;
}
export function lectureCanonicalRoute(slug: string) {
  return `${LECTURE_CANONICAL_LIST_ROUTE}/${slug}`;
}

export function createAdminDatabase() {
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL)
    throw new Error('admin_database_not_configured');
  return createDatabase();
}
export function createLocalAdminDatabase() {
  return createDatabase(LOCAL_TEST_DATABASE_URL);
}
const checksum = (value: unknown) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeBase<T extends BaseDraftInput>(input: T) {
  const title = input.title.trim(),
    slug = input.slug.trim(),
    summary = input.summary.trim();
  if (!title) throw new Error('title_required');
  if (!summary) throw new Error('summary_required');
  if (!slugPattern.test(slug)) throw new Error('slug_invalid');
  if (!['ko', 'en'].includes(input.locale)) throw new Error('locale_invalid');
  const document = normalizeAnchors(input.document);
  const validation = validateDechiveDocument(document, 'draft');
  if (validation.status === 'rejected') throw new Error('document_invalid');
  const status: DraftStatus =
    validation.status === 'needs_review' ? 'needs_review' : 'draft';
  return { title, slug, summary, document, validation, status };
}
function order(value: number | null) {
  if (value === null) return null;
  if (!Number.isInteger(value) || value < 0)
    throw new Error('recommended_order_invalid');
  return value;
}
const unique = (values: string[]) => [
  ...new Set(values.map((v) => v.trim()).filter(Boolean)),
];
export function normalizeKnowledgeTags(values: string[]) {
  const tags = unique(values);
  if (tags.length > 12) throw new Error('tags_too_many');
  if (tags.some((tag) => tag.length > 40)) throw new Error('tag_too_long');
  return tags;
}
function optional(value: string, limit: number, code: string) {
  const normalized = value.trim();
  if (normalized.length > limit) throw new Error(code);
  return normalized;
}
export function normalizeKnowledgeReferences(values: KnowledgeReference[]) {
  if (values.length > 20) throw new Error('references_too_many');
  return values.map((value) => {
    const reference = {
      type: value.type,
      title: optional(value.title, 200, 'reference_title_too_long'),
      authorOrOrganization: optional(
        value.authorOrOrganization,
        200,
        'reference_author_too_long',
      ),
      url: optional(value.url, 2048, 'reference_url_too_long'),
      accessedAt: optional(
        value.accessedAt,
        32,
        'reference_accessed_at_invalid',
      ),
      note: optional(value.note, 2000, 'reference_note_too_long'),
    };
    if (!['external', 'direct_verification'].includes(reference.type))
      throw new Error('reference_type_invalid');
    if (!reference.title) throw new Error('reference_title_required');
    if (reference.type === 'external' && !reference.url)
      throw new Error('external_reference_url_required');
    if (reference.url && !/^https?:\/\/[^\s]+$/i.test(reference.url))
      throw new Error('reference_url_invalid');
    if (reference.type === 'direct_verification' && !reference.note)
      throw new Error('direct_verification_note_required');
    if (
      reference.accessedAt &&
      !/^\d{4}-\d{2}-\d{2}$/.test(reference.accessedAt)
    )
      throw new Error('reference_accessed_at_invalid');
    return reference;
  });
}
function normalizeKnowledge(input: KnowledgeDraftInput) {
  const base = normalizeBase(input);
  if (input.hero && (!input.hero.mediaId.trim() || !input.hero.alt.trim()))
    throw new Error('hero_media_alt_required');
  return {
    ...base,
    tags: normalizeKnowledgeTags(input.tags),
    // Legacy reference payloads are retained on old immutable versions, but
    // the current Knowledge editor no longer accepts or validates references.
    references: [],
    hero: input.hero
      ? {
          mediaId: input.hero.mediaId.trim(),
          alt: input.hero.alt.trim(),
          caption: input.hero.caption.trim(),
        }
      : null,
  };
}
export function validateKnowledgePublishReadiness(input: KnowledgeDraftInput) {
  const blockingErrors: string[] = [];
  const warnings: string[] = [];
  let normalized: ReturnType<typeof normalizeKnowledge> | undefined;
  try {
    normalized = normalizeKnowledge(input);
  } catch (error) {
    blockingErrors.push(
      error instanceof Error ? error.message : 'knowledge_invalid',
    );
  }
  if (normalized) {
    if (!plainText(normalized.document))
      blockingErrors.push('body_required');
    if (!normalized.tags.length) warnings.push('tags_missing');
    const publishDocument = validateDechiveDocument(
      normalized.document,
      'publish',
    );
    blockingErrors.push(
      ...publishDocument.issues
        .filter(
          (issue) => issue.severity === 'error' || issue.severity === 'review',
        )
        .map((issue) => issue.code),
    );
    warnings.push(
      ...publishDocument.issues
        .filter((issue) => issue.severity === 'warning')
        .map((issue) => issue.code),
    );
  }
  return {
    blockingErrors: [...new Set(blockingErrors)],
    warnings: [...new Set(warnings)],
    ready: blockingErrors.length === 0,
  };
}
export function validateLecturePublishReadiness(input: LectureDraftInput) {
  const blockingErrors: string[] = [];
  const warnings: string[] = [];
  if (!input.title.trim()) blockingErrors.push('title_required');
  if (!slugPattern.test(input.slug.trim())) blockingErrors.push('slug_invalid');
  if (!input.summary.trim()) blockingErrors.push('summary_required');
  if (!['ko', 'en'].includes(input.locale)) blockingErrors.push('locale_invalid');
  const document = normalizeAnchors(input.document);
  if (!plainText(document)) blockingErrors.push('body_required');
  const publishDocument = validateDechiveDocument(document, 'publish');
  blockingErrors.push(
    ...publishDocument.issues
      .filter(
        (issue) => issue.severity === 'error' || issue.severity === 'review',
      )
      .map((issue) => issue.code),
  );
  warnings.push(
    ...publishDocument.issues
      .filter((issue) => issue.severity === 'warning')
      .map((issue) => issue.code),
  );
  if (!input.primarySourceKnowledgeId.trim())
    blockingErrors.push('primary_source_knowledge_required');
  if (!unique(input.learningObjectives).length)
    blockingErrors.push('learning_objectives_required');
  if (!input.coreMessage?.trim()) blockingErrors.push('core_message_required');
  try {
    normalizeKnowledgeReferences(input.references ?? []);
  } catch (error) {
    blockingErrors.push(
      error instanceof Error ? error.message : 'references_invalid',
    );
  }
  return {
    blockingErrors: [...new Set(blockingErrors)],
    warnings: [...new Set(warnings)],
    ready: blockingErrors.length === 0,
  };
}
function normalizeLecture(input: LectureDraftInput) {
  const base = normalizeBase(input);
  if (!input.primarySourceKnowledgeId)
    throw new Error('primary_source_knowledge_required');
  if (!['beginner', 'intermediate', 'advanced'].includes(input.difficulty))
    throw new Error('difficulty_invalid');
  const learningObjectives = unique(input.learningObjectives),
    checkpoints = unique(input.checkpoints);
  if (!learningObjectives.length)
    throw new Error('learning_objectives_required');
  const audience = optional(input.audience ?? '', 200, 'audience_too_long');
  const coreMessage = optional(input.coreMessage ?? '', 300, 'core_message_too_long');
  const estimatedDurationMinutes = input.estimatedDurationMinutes ?? null;
  if (estimatedDurationMinutes !== null && (!Number.isInteger(estimatedDurationMinutes) || estimatedDurationMinutes < 1)) throw new Error('estimated_duration_invalid');
  return {
    ...base,
    primarySourceKnowledgeId: input.primarySourceKnowledgeId,
    learningObjectives,
    difficulty: input.difficulty,
    recommendedOrder: order(input.recommendedOrder),
    checkpoints,
    audience,
    estimatedDurationMinutes,
    coreMessage,
    references: normalizeKnowledgeReferences(input.references ?? []),
  };
}
async function requireOwner(tx: PoolClient, actorId: string) {
  if (!(await isAuthorizedOwner(tx, actorId)))
    throw new Error('admin_access_denied');
}
function knowledgeVersionMetadata(
  input: ReturnType<typeof normalizeKnowledge>,
) {
  return {
    knowledge: {
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      tags: input.tags,
      references: input.references,
      hero: input.hero,
    },
  };
}
function lectureVersionMetadata(input: ReturnType<typeof normalizeLecture>) {
  return {
    lecture: {
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      coreMessage: input.coreMessage,
      references: input.references,
    },
  };
}
async function transaction<T>(pool: Pool, run: (tx: PoolClient) => Promise<T>) {
  const tx = await pool.connect();
  try {
    await tx.query('BEGIN');
    const value = await run(tx);
    await tx.query('COMMIT');
    return value;
  } catch (error) {
    await tx.query('ROLLBACK');
    throw error;
  } finally {
    tx.release();
  }
}
async function assertKnowledgeIds(tx: PoolClient, localizationIds: string[]) {
  if (!localizationIds.length) return new Map<string, string>();
  const rows = await tx.query<{ id: string; content_id: string }>(
    `SELECT cl.id,cl.content_id FROM content_localizations cl JOIN contents c ON c.id=cl.content_id AND c.kind='knowledge' WHERE cl.id=ANY($1::uuid[])`,
    [localizationIds],
  );
  if (rows.rowCount !== localizationIds.length)
    throw new Error('knowledge_reference_invalid');
  return new Map(rows.rows.map((row) => [row.id, row.content_id]));
}
async function insertVersion(
  tx: PoolClient,
  localizationId: string,
  input: ReturnType<typeof normalizeBase>,
  actorId: string,
  kind: 'knowledge' | 'lecture',
  current: string | null,
  versionMetadata: Record<string, unknown> = {},
) {
  const versionNumber = Number(
    (
      await tx.query(
        `SELECT coalesce(max(version_number),0)+1 AS next FROM content_versions WHERE localization_id=$1`,
        [localizationId],
      )
    ).rows[0].next,
  );
  const versionId = (
    await tx.query<{ id: string }>(
      `INSERT INTO content_versions(localization_id,version_number,schema_version,canonical_document,status,revision_summary,changed_fields,created_by,supersedes_version_id,migration_metadata,document_checksum,validation_status,validation_warnings) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
      [
        localizationId,
        versionNumber,
        input.document.schemaVersion,
        input.document,
        input.status,
        `${kind} draft ${versionNumber === 1 ? 'created' : 'revised'}`,
        JSON.stringify(
          kind === 'knowledge'
            ? ['title', 'slug', 'summary', 'body', 'tags', 'references', 'hero']
            : ['title', 'slug', 'summary', 'body'],
        ),
        actorId,
        current,
        versionMetadata,
        checksum(input.document),
        input.validation.status,
        JSON.stringify(input.validation.issues.map((issue) => issue.code)),
      ],
    )
  ).rows[0]!.id;
  return { versionId, versionNumber };
}
async function createBase(
  tx: PoolClient,
  input: ReturnType<typeof normalizeBase>,
  locale: Locale,
  kind: 'knowledge' | 'lecture',
  actorId: string,
) {
  const groupId = (
    await tx.query<{ id: string }>(
      `INSERT INTO translation_groups(original_locale) VALUES ($1) RETURNING id`,
      [locale],
    )
  ).rows[0]!.id;
  const contentId = (
    await tx.query<{ id: string }>(
      `INSERT INTO contents(kind,translation_group_id,created_by) VALUES ($1,$2,$3) RETURNING id`,
      [kind, groupId, actorId],
    )
  ).rows[0]!.id;
  const localizationId = (
    await tx.query<{ id: string }>(
      `INSERT INTO content_localizations(content_id,locale,source_locale,translation_status,title,summary,slug,route_scope) VALUES ($1,$2,$2,'original',$3,$4,$5,$6) RETURNING id`,
      [contentId, locale, input.title, input.summary, input.slug, kind],
    )
  ).rows[0]!.id;
  return { contentId, localizationId };
}
async function finalize(
  tx: PoolClient,
  localizationId: string,
  input: ReturnType<typeof normalizeBase>,
  kind: 'knowledge' | 'lecture',
  actorId: string,
  current: string | null,
  versionMetadata: Record<string, unknown> = {},
) {
  const saved = await insertVersion(
    tx,
    localizationId,
    input,
    actorId,
    kind,
    current,
    versionMetadata,
  );
  const route =
    kind === 'knowledge'
      ? knowledgeCanonicalRoute(input.slug)
      : lectureCanonicalRoute(input.slug);
  const conflict = await tx.query(
    `SELECT 1 FROM content_routes WHERE route=$1 AND localization_id<>$2 AND active_until IS NULL`,
    [route, localizationId],
  );
  if (conflict.rowCount) throw new Error('route_conflict');
  await tx.query(
    `UPDATE content_localizations
     SET title=$1,summary=$2,slug=$3,current_draft_version_id=$4,
         workflow_status=CASE
           WHEN current_published_version_id IS NULL AND workflow_status IN ('withdrawn','archived') THEN 'draft'
           ELSE workflow_status
         END,
         updated_at=now()
     WHERE id=$5`,
    [input.title, input.summary, input.slug, saved.versionId, localizationId],
  );
  if (current)
    await tx.query(
      `UPDATE content_routes SET route=$1 WHERE localization_id=$2 AND is_canonical AND active_until IS NULL`,
      [route, localizationId],
    );
  else
    await tx.query(
      `INSERT INTO content_routes(localization_id,route,route_type,is_canonical) VALUES ($1,$2,'cms_draft',true)`,
      [localizationId, route],
    );
  await tx.query(
    `INSERT INTO revision_events(content_version_id,event_type,actor_id,metadata) VALUES ($1,$2,$3,$4)`,
    [
      saved.versionId,
      current ? 'draft_revised' : 'draft_created',
      actorId,
      { source: 'admin', kind },
    ],
  );
  return { ...saved, route, status: input.status };
}

export async function createKnowledgeDraft(
  pool: Pool,
  raw: KnowledgeDraftInput,
  options: { actorId: string; failAfterVersion?: boolean },
) {
  const input = normalizeKnowledge(raw);
  return transaction(pool, async (tx) => {
    await requireOwner(tx, options.actorId);
    const base = await createBase(
      tx,
      input,
      raw.locale,
      'knowledge',
      options.actorId,
    );
    await tx.query(
      `INSERT INTO knowledge_details(localization_id,format,depth,concepts,verification_metadata) VALUES ($1,'concept','standard',$2,'{}')`,
      [base.localizationId, JSON.stringify(input.tags)],
    );
    const saved = await finalize(
      tx,
      base.localizationId,
      input,
      'knowledge',
      options.actorId,
      null,
      knowledgeVersionMetadata(input),
    );
    await saveKnowledgeMediaUsages(tx, saved.versionId, input.document, input.hero);
    if (options.failAfterVersion)
      throw new Error('injected_draft_transaction_failure');
    return { ...base, ...saved };
  });
}
export async function updateKnowledgeDraft(
  pool: Pool,
  id: string,
  raw: KnowledgeDraftInput,
  options: { actorId: string },
) {
  const input = normalizeKnowledge(raw);
  return transaction(pool, async (tx) => {
    await requireOwner(tx, options.actorId);
    const row = (
      await tx.query<{
        current_draft_version_id: string | null;
        current_published_version_id: string | null;
        slug: string;
      }>(
        `SELECT cl.current_draft_version_id,cl.current_published_version_id,cl.slug FROM content_localizations cl JOIN contents c ON c.id=cl.content_id AND c.kind='knowledge' WHERE cl.id=$1 FOR UPDATE`,
        [id],
      )
    ).rows[0];
    if (!row) throw new Error('knowledge_not_found');
    if (row.current_published_version_id && row.slug !== input.slug)
      throw new Error('published_slug_locked');
    await tx.query(
      `UPDATE knowledge_details SET concepts=$1 WHERE localization_id=$2`,
      [JSON.stringify(input.tags), id],
    );
    const saved = await finalize(
      tx,
      id,
      input,
      'knowledge',
      options.actorId,
      row.current_draft_version_id,
      knowledgeVersionMetadata(input),
    );
    await saveKnowledgeMediaUsages(tx, saved.versionId, input.document, input.hero);
    return { localizationId: id, ...saved };
  });
}

export async function getKnowledgePublishState(
  pool: Pool,
  id: string,
): Promise<KnowledgePublishState | null> {
  const draft = await getKnowledgeDraft(pool, id);
  if (!draft) return null;
  return {
    draftVersionId: draft.versionId,
    draftVersionNumber: draft.versionNumber,
    publishedVersionId: draft.publishedVersionId,
    publishedVersionNumber: draft.publishedVersionNumber,
    createdAt: draft.createdAt,
    publishedAt: draft.publishedAt,
    lastPublishedAt: draft.lastPublishedAt,
    workflowStatus: draft.workflowStatus,
    readiness: validateKnowledgePublishReadiness(draft),
  };
}

export async function publishKnowledgeDraft(
  pool: Pool,
  id: string,
  options: { actorId: string; failAfterPointer?: boolean },
) {
  return transaction(pool, async (tx) => {
    await requireOwner(tx, options.actorId);
    const row = (
      await tx.query<{
        draft_version_id: string | null;
        published_version_id: string | null;
        draft_status: string;
        title: string;
        slug: string;
        locale: Locale;
        summary: string;
        document: DechiveDocument;
        metadata: { knowledge?: { tags?: string[]; references?: KnowledgeReference[] } };
      }>(
        `SELECT cl.current_draft_version_id AS draft_version_id,cl.current_published_version_id AS published_version_id,
                cv.status AS draft_status,cl.title,cl.slug,cl.locale,cl.summary,
                cv.canonical_document AS document,cv.migration_metadata AS metadata
         FROM content_localizations cl
         JOIN contents c ON c.id=cl.content_id AND c.kind='knowledge'
         JOIN content_versions cv ON cv.id=cl.current_draft_version_id
         WHERE cl.id=$1 FOR UPDATE`,
        [id],
      )
    ).rows[0];
    if (!row) throw new Error('knowledge_not_found');
    if (!row.draft_version_id) throw new Error('draft_version_missing');
    const readiness = validateKnowledgePublishReadiness({
      title: row.title,
      slug: row.slug,
      locale: row.locale,
      summary: row.summary,
      document: row.document,
      tags: row.metadata?.knowledge?.tags ?? [],
      references: row.metadata?.knowledge?.references ?? [],
    });
    if (!readiness.ready) throw new Error('publish_validation_failed');
    if (row.draft_status !== 'published') {
      await tx.query(
        `UPDATE content_versions SET status='published',published_at=coalesce(published_at,now()) WHERE id=$1`,
        [row.draft_version_id],
      );
    }
    const media = await tx.query<{ count: string }>(
      `SELECT count(*) FROM media_usages mu JOIN media_assets ma ON ma.id=mu.media_id
       WHERE mu.content_version_id=$1 AND (ma.status <> 'approved' OR btrim(mu.alt)='')`,
      [row.draft_version_id],
    );
    if (Number(media.rows[0]?.count ?? 0) > 0) throw new Error('media_publish_validation_failed');
    await tx.query(
      `UPDATE content_localizations SET current_published_version_id=$1,workflow_status='published',updated_at=now() WHERE id=$2`,
      [row.draft_version_id, id],
    );
    if (options.failAfterPointer)
      throw new Error('injected_publish_transaction_failure');
    await tx.query(
      `INSERT INTO revision_events(content_version_id,event_type,actor_id,metadata) VALUES ($1,'published',$2,$3)`,
      [
        row.draft_version_id,
        options.actorId,
        {
          source: 'admin',
          kind: 'knowledge',
          previousPublishedVersionId: row.published_version_id,
          warnings: readiness.warnings,
        },
      ],
    );
    return {
      localizationId: id,
      versionId: row.draft_version_id,
      slug: row.slug,
      warnings: readiness.warnings,
      alreadyPublished: row.published_version_id === row.draft_version_id,
    };
  });
}

async function changeKnowledgeWorkflow(
  pool: Pool,
  id: string,
  actorId: string,
  workflowStatus: 'withdrawn' | 'archived',
  eventType: 'unpublished' | 'archived',
) {
  return transaction(pool, async (tx) => {
    await requireOwner(tx, actorId);
    const row = (await tx.query<{
      content_id: string;
      current_published_version_id: string | null;
      current_draft_version_id: string | null;
      workflow_status: KnowledgeWorkflowStatus;
    }>(
      `SELECT cl.content_id,cl.current_published_version_id,cl.current_draft_version_id,cl.workflow_status
       FROM content_localizations cl JOIN contents c ON c.id=cl.content_id AND c.kind='knowledge'
       WHERE cl.id=$1 FOR UPDATE`,
      [id],
    )).rows[0];
    if (!row) throw new Error('knowledge_not_found');
    if (!row.current_published_version_id) throw new Error('knowledge_not_published');
    await tx.query(
      `UPDATE content_localizations SET current_published_version_id=NULL,workflow_status=$1,updated_at=now() WHERE id=$2`,
      [workflowStatus, id],
    );
    await tx.query(
      `INSERT INTO revision_events(content_version_id,event_type,actor_id,metadata) VALUES ($1,$2,$3,$4)`,
      [row.current_published_version_id, eventType, actorId, { source: 'admin', kind: 'knowledge', previousWorkflowStatus: row.workflow_status }],
    );
    return { localizationId: id, workflowStatus };
  });
}

export function withdrawKnowledge(pool: Pool, id: string, options: { actorId: string }) {
  return changeKnowledgeWorkflow(pool, id, options.actorId, 'withdrawn', 'unpublished');
}

export function archiveKnowledge(pool: Pool, id: string, options: { actorId: string }) {
  return changeKnowledgeWorkflow(pool, id, options.actorId, 'archived', 'archived');
}

export async function deleteKnowledgeDraft(pool: Pool, id: string, options: { actorId: string }) {
  return transaction(pool, async (tx) => {
    await requireOwner(tx, options.actorId);
    const row = (await tx.query<{ content_id: string; current_published_version_id: string | null }>(
      `SELECT cl.content_id,cl.current_published_version_id
       FROM content_localizations cl JOIN contents c ON c.id=cl.content_id AND c.kind='knowledge'
       WHERE cl.id=$1 FOR UPDATE`,
      [id],
    )).rows[0];
    if (!row) throw new Error('knowledge_not_found');
    if (row.current_published_version_id) throw new Error('knowledge_delete_published_forbidden');
    const published = await tx.query(
      `SELECT 1 FROM content_versions WHERE localization_id=$1 AND (status='published' OR published_at IS NOT NULL) LIMIT 1`,
      [id],
    );
    if (published.rowCount) throw new Error('knowledge_delete_published_forbidden');
    const legacy = await tx.query(
      `SELECT 1 FROM legacy_identities WHERE content_id=$1 OR localization_id=$2 LIMIT 1`,
      [row.content_id, id],
    );
    if (legacy.rowCount) throw new Error('knowledge_delete_legacy_blocked');
    const incomingRelation = await tx.query(
      `SELECT 1 FROM content_relations WHERE target_content_id=$1 LIMIT 1`,
      [row.content_id],
    );
    if (incomingRelation.rowCount) throw new Error('knowledge_delete_relation_blocked');
    const media = await tx.query<{ id: string }>(
      `SELECT DISTINCT mu.media_id AS id
       FROM media_usages mu JOIN content_versions cv ON cv.id=mu.content_version_id
       WHERE cv.localization_id=$1`,
      [id],
    );
    const versions = await tx.query<{ id: string }>(
      `SELECT id FROM content_versions WHERE localization_id=$1`,
      [id],
    );
    if (versions.rowCount) {
      const versionIds = versions.rows.map((version) => version.id);
      await tx.query(`DELETE FROM content_version_artifacts WHERE content_version_id=ANY($1::uuid[])`, [versionIds]);
      await tx.query(`DELETE FROM revision_events WHERE content_version_id=ANY($1::uuid[])`, [versionIds]);
    }
    await tx.query(`DELETE FROM content_localizations WHERE id=$1`, [id]);
    await tx.query(`DELETE FROM contents WHERE id=$1 AND NOT EXISTS (SELECT 1 FROM content_localizations WHERE content_id=$1)`, [row.content_id]);
    if (media.rowCount) {
      await tx.query(
        `UPDATE media_assets SET status='pending' WHERE id=ANY($1::uuid[]) AND NOT EXISTS (SELECT 1 FROM media_usages WHERE media_id=media_assets.id)`,
        [media.rows.map((item) => item.id)],
      );
    }
    return { localizationId: id };
  });
}
export async function getLecturePublishState(
  pool: Pool,
  id: string,
): Promise<LecturePublishState | null> {
  const draft = await getLectureDraft(pool, id);
  if (!draft) return null;
  const published = (
    await pool.query<{ id: string; version_number: number }>(
      `SELECT cv.id,cv.version_number
       FROM content_localizations cl
       JOIN contents c ON c.id=cl.content_id AND c.kind='lecture'
       LEFT JOIN content_versions cv ON cv.id=cl.current_published_version_id
       WHERE cl.id=$1`,
      [id],
    )
  ).rows[0];
  return {
    draftVersionId: draft.versionId,
    draftVersionNumber: draft.versionNumber,
    publishedVersionId: published?.id ?? null,
    publishedVersionNumber: published ? Number(published.version_number) : null,
    readiness: validateLecturePublishReadiness(draft),
  };
}

export async function publishLectureDraft(
  pool: Pool,
  id: string,
  options: { actorId: string; failAfterPointer?: boolean },
) {
  return transaction(pool, async (tx) => {
    await requireOwner(tx, options.actorId);
    const row = (
      await tx.query<{
        draft_version_id: string | null;
        published_version_id: string | null;
        title: string;
        slug: string;
        locale: Locale;
        summary: string;
        document: DechiveDocument;
        primary_source_knowledge_id: string | null;
        learning_objectives: string[];
        difficulty: LectureDraftInput['difficulty'];
        recommended_order: number | null;
        checkpoints: string[];
        audience: string | null;
        estimated_duration_minutes: number | null;
        metadata: {
          lecture?: { coreMessage?: string; references?: KnowledgeReference[] };
        };
      }>(
        `SELECT cl.current_draft_version_id AS draft_version_id,
                cl.current_published_version_id AS published_version_id,
                cl.title,cl.slug,cl.locale,cl.summary,
                cv.canonical_document AS document,cv.migration_metadata AS metadata,
                ld.primary_source_knowledge_id,ld.learning_objectives,ld.difficulty,
                ld.recommended_order,ld.checkpoints,ld.audience,ld.estimated_duration_minutes
         FROM content_localizations cl
         JOIN contents c ON c.id=cl.content_id AND c.kind='lecture'
         JOIN lecture_details ld ON ld.localization_id=cl.id
         JOIN content_versions cv ON cv.id=cl.current_draft_version_id
         JOIN content_routes cr ON cr.localization_id=cl.id
           AND cr.is_canonical AND cr.active_until IS NULL
           AND cr.route=CONCAT('/lecture/',cl.slug)
         WHERE cl.id=$1 FOR UPDATE`,
        [id],
      )
    ).rows[0];
    if (!row) throw new Error('lecture_not_found');
    if (!row.draft_version_id) throw new Error('draft_version_missing');
    const readiness = validateLecturePublishReadiness({
      title: row.title,
      slug: row.slug,
      locale: row.locale,
      summary: row.summary,
      document: row.document,
      primarySourceKnowledgeId: row.primary_source_knowledge_id ?? '',
      learningObjectives: row.learning_objectives ?? [],
      difficulty: row.difficulty,
      recommendedOrder: row.recommended_order,
      checkpoints: row.checkpoints ?? [],
      audience: row.audience ?? '',
      estimatedDurationMinutes: row.estimated_duration_minutes,
      coreMessage: row.metadata?.lecture?.coreMessage ?? '',
      references: row.metadata?.lecture?.references ?? [],
    });
    if (!readiness.ready) throw new Error('publish_validation_failed');
    const source = await tx.query(
      `SELECT 1 FROM contents WHERE id=$1 AND kind='knowledge'`,
      [row.primary_source_knowledge_id],
    );
    if (!source.rowCount) throw new Error('knowledge_reference_invalid');
    await tx.query(
      `UPDATE content_localizations
       SET current_published_version_id=$1,updated_at=now()
       WHERE id=$2`,
      [row.draft_version_id, id],
    );
    if (options.failAfterPointer)
      throw new Error('injected_publish_transaction_failure');
    await tx.query(
      `INSERT INTO revision_events(content_version_id,event_type,actor_id,metadata)
       VALUES ($1,'published',$2,$3)`,
      [
        row.draft_version_id,
        options.actorId,
        {
          source: 'admin',
          kind: 'lecture',
          previousPublishedVersionId: row.published_version_id,
          warnings: readiness.warnings,
        },
      ],
    );
    return {
      localizationId: id,
      versionId: row.draft_version_id,
      slug: row.slug,
      warnings: readiness.warnings,
      alreadyPublished: row.published_version_id === row.draft_version_id,
    };
  });
}
export async function createLectureDraft(
  pool: Pool,
  raw: LectureDraftInput,
  options: { actorId: string },
) {
  const input = normalizeLecture(raw);
  return transaction(pool, async (tx) => {
    await requireOwner(tx, options.actorId);
    const source = (
      await assertKnowledgeIds(tx, [input.primarySourceKnowledgeId])
    ).get(input.primarySourceKnowledgeId)!;
    const base = await createBase(
      tx,
      input,
      raw.locale,
      'lecture',
      options.actorId,
    );
    await tx.query(
      `INSERT INTO lecture_details(localization_id,primary_source_knowledge_id,learning_objectives,difficulty,recommended_order,checkpoints,audience,estimated_duration_minutes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        base.localizationId,
        source,
        JSON.stringify(input.learningObjectives),
        input.difficulty,
        input.recommendedOrder,
        JSON.stringify(input.checkpoints),
        input.audience || null,
        input.estimatedDurationMinutes,
      ],
    );
    return {
      ...base,
      ...(await finalize(
        tx,
        base.localizationId,
        input,
        'lecture',
        options.actorId,
        null,
        lectureVersionMetadata(input),
      )),
    };
  });
}
export async function updateLectureDraft(
  pool: Pool,
  id: string,
  raw: LectureDraftInput,
  options: { actorId: string },
) {
  const input = normalizeLecture(raw);
  return transaction(pool, async (tx) => {
    await requireOwner(tx, options.actorId);
    const row = (
      await tx.query<{
        current_draft_version_id: string | null;
        current_published_version_id: string | null;
        slug: string;
      }>(
        `SELECT cl.current_draft_version_id,cl.current_published_version_id,cl.slug FROM content_localizations cl JOIN contents c ON c.id=cl.content_id AND c.kind='lecture' WHERE cl.id=$1 FOR UPDATE`,
        [id],
      )
    ).rows[0];
    if (!row) throw new Error('lecture_not_found');
    if (row.current_published_version_id && row.slug !== input.slug)
      throw new Error('published_slug_locked');
    const source = (
      await assertKnowledgeIds(tx, [input.primarySourceKnowledgeId])
    ).get(input.primarySourceKnowledgeId)!;
    await tx.query(
      `UPDATE lecture_details SET primary_source_knowledge_id=$1,learning_objectives=$2,difficulty=$3,recommended_order=$4,checkpoints=$5,audience=$6,estimated_duration_minutes=$7 WHERE localization_id=$8`,
      [
        source,
        JSON.stringify(input.learningObjectives),
        input.difficulty,
        input.recommendedOrder,
        JSON.stringify(input.checkpoints),
        input.audience || null,input.estimatedDurationMinutes,id,
      ],
    );
    return {
      localizationId: id,
      ...(await finalize(
        tx,
        id,
        input,
        'lecture',
        options.actorId,
        row.current_draft_version_id,
        lectureVersionMetadata(input),
      )),
    };
  });
}

export async function listKnowledgeOptions(
  pool: Pool,
): Promise<KnowledgeOption[]> {
  return (
    await pool.query(
      `SELECT cl.id AS "localizationId",cl.content_id AS "contentId",cl.title,cl.summary FROM content_localizations cl JOIN contents c ON c.id=cl.content_id AND c.kind='knowledge' WHERE cl.current_draft_version_id IS NOT NULL ORDER BY coalesce((SELECT recommended_order FROM knowledge_details WHERE localization_id=cl.id),2147483647),cl.title`,
    )
  ).rows;
}
export async function getPublishedKnowledgeContract(pool: Pool, slug: string) {
  return (
    (
      await pool.query(
        `SELECT cl.id,cl.slug,cl.title,cl.summary,cv.id AS "versionId",cv.canonical_document AS document,cv.migration_metadata->'knowledge' AS metadata FROM content_localizations cl JOIN contents c ON c.id=cl.content_id AND c.kind='knowledge' JOIN content_versions cv ON cv.id=cl.current_published_version_id WHERE cl.route_scope='knowledge' AND cl.slug=$1`,
        [slug],
      )
    ).rows[0] ?? null
  );
}
export async function getKnowledgeDraft(
  pool: Pool,
  id: string,
): Promise<KnowledgeDraft | null> {
  const row = (
    await pool.query(
      `SELECT cl.id AS localization_id,cl.content_id,cl.locale,cl.title,cl.summary,cl.slug,
              cl.created_at AS localization_created_at,cl.updated_at,cl.workflow_status,
              cl.current_published_version_id,
              cv.id AS version_id,cv.version_number,cv.status,cv.canonical_document,cv.migration_metadata,
              published_cv.version_number AS published_version_number,
              published_cv.published_at AS last_published_at,
              (SELECT min(history.published_at) FROM content_versions history WHERE history.localization_id=cl.id AND history.published_at IS NOT NULL) AS first_published_at,
              kd.concepts,kd.topic,kd.recommended_order,kd.verification_metadata,cr.route
       FROM content_localizations cl
       JOIN contents c ON c.id=cl.content_id AND c.kind='knowledge'
       JOIN knowledge_details kd ON kd.localization_id=cl.id
       JOIN content_versions cv ON cv.id=cl.current_draft_version_id
       LEFT JOIN content_versions published_cv ON published_cv.id=cl.current_published_version_id
       JOIN content_routes cr ON cr.localization_id=cl.id AND cr.is_canonical AND cr.active_until IS NULL
       WHERE cl.id=$1`,
      [id],
    )
  ).rows[0];
  if (!row) return null;
  const relations = await pool.query<{ id: string; relation_type: string }>(
    `SELECT target.id,cr.relation_type FROM content_relations cr JOIN content_localizations target ON target.content_id=cr.target_content_id AND target.locale=$2 WHERE cr.source_content_id=$1`,
    [row.content_id, row.locale],
  );
  const versionKnowledge = row.migration_metadata?.knowledge;
  const tags = Array.isArray(versionKnowledge?.tags)
    ? versionKnowledge.tags
    : row.concepts;
  const references = Array.isArray(versionKnowledge?.references)
    ? versionKnowledge.references
    : [];
  const document = await resolveKnowledgeDocument(pool, String(row.version_id), row.canonical_document);
  const hero = await getKnowledgeHero(pool, String(row.version_id));
  return {
    localizationId: row.localization_id,
    contentId: row.content_id,
    versionId: row.version_id,
    versionNumber: Number(row.version_number),
    status: row.status,
    title: row.title,
    slug: row.slug,
    locale: row.locale,
    summary: row.summary,
    tags,
    references,
    legacyMetadata: {
      topic: row.topic ?? '',
      recommendedOrder: row.recommended_order,
      prerequisiteKnowledgeIds: relations.rows
        .filter((r) => r.relation_type === 'prerequisite')
        .map((r) => r.id),
      relatedKnowledgeIds: relations.rows
        .filter((r) => r.relation_type === 'related')
        .map((r) => r.id),
      verificationMetadata: row.verification_metadata?.notes ?? '',
    },
    document,
    hero: hero ? { mediaId: hero.mediaId, alt: hero.alt, caption: hero.caption } : null,
    heroImageUrl: hero?.publicUrl ?? null,
    route: row.route,
    updatedAt: new Date(row.updated_at).toISOString(),
    createdAt: new Date(row.localization_created_at).toISOString(),
    publishedAt: row.first_published_at ? new Date(row.first_published_at).toISOString() : null,
    lastPublishedAt: row.last_published_at ? new Date(row.last_published_at).toISOString() : null,
    publishedVersionId: row.current_published_version_id ?? null,
    publishedVersionNumber: row.published_version_number ? Number(row.published_version_number) : null,
    workflowStatus: row.workflow_status as KnowledgeWorkflowStatus,
  };
}
export async function getLectureDraft(
  pool: Pool,
  id: string,
): Promise<LectureDraft | null> {
  const row = (
    await pool.query(
      `SELECT cl.id AS localization_id,cl.content_id,cl.locale,cl.title,cl.summary,cl.slug,cl.updated_at,cv.id AS version_id,cv.version_number,cv.status,cv.canonical_document,ld.*,source.title AS source_title,source.summary AS source_summary,source.id AS source_localization_id,cr.route FROM content_localizations cl JOIN contents c ON c.id=cl.content_id AND c.kind='lecture' JOIN lecture_details ld ON ld.localization_id=cl.id JOIN content_localizations source ON source.content_id=ld.primary_source_knowledge_id AND source.locale=cl.locale JOIN content_versions cv ON cv.id=cl.current_draft_version_id JOIN content_routes cr ON cr.localization_id=cl.id AND cr.is_canonical AND cr.active_until IS NULL WHERE cl.id=$1`,
      [id],
    )
  ).rows[0];
  if (!row) return null;
  const lectureMetadata = row.migration_metadata?.lecture ?? {};
  return {
    localizationId: row.localization_id,
    contentId: row.content_id,
    versionId: row.version_id,
    versionNumber: Number(row.version_number),
    status: row.status,
    title: row.title,
    slug: row.slug,
    locale: row.locale,
    summary: row.summary,
    primarySourceKnowledgeId: row.source_localization_id,
    primarySourceTitle: row.source_title,
    primarySourceSummary: row.source_summary,
    learningObjectives: row.learning_objectives,
    difficulty: row.difficulty,
    recommendedOrder: row.recommended_order,
    checkpoints: row.checkpoints,
    audience: row.audience ?? '',
    estimatedDurationMinutes: row.estimated_duration_minutes ?? null,
    coreMessage: typeof lectureMetadata.coreMessage === 'string' ? lectureMetadata.coreMessage : '',
    references: Array.isArray(lectureMetadata.references) ? lectureMetadata.references : [],
    document: row.canonical_document,
    route: row.route,
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}
async function listDrafts(
  pool: Pool,
  kind: 'knowledge' | 'lecture',
  filters: { locale?: string; status?: string } = {},
) {
  const values: string[] = [kind];
  const clauses = [`c.kind=$1`, `cl.current_draft_version_id IS NOT NULL`];
  if (filters.locale && ['ko', 'en'].includes(filters.locale)) {
    values.push(filters.locale);
    clauses.push(`cl.locale=$${values.length}`);
  }
  if (filters.status && ['draft', 'needs_review'].includes(filters.status)) {
    values.push(filters.status);
    clauses.push(`cv.status=$${values.length}`);
  }
  return (
    await pool.query(
      `SELECT cl.id,cl.title,cl.locale,cl.updated_at AS "updatedAt",c.kind,cv.status,cv.version_number AS "versionNumber" FROM content_localizations cl JOIN contents c ON c.id=cl.content_id JOIN content_versions cv ON cv.id=cl.current_draft_version_id WHERE ${clauses.join(' AND ')} ORDER BY cl.updated_at DESC LIMIT 100`,
      values,
    )
  ).rows;
}
export async function listKnowledgeDrafts(
  pool: Pool,
  filters: { locale?: string; status?: string } = {},
): Promise<KnowledgeListItem[]> {
  const values: string[] = [];
  const clauses = [`c.kind='knowledge'`, `cl.current_draft_version_id IS NOT NULL`];
  if (filters.locale && ['ko', 'en'].includes(filters.locale)) {
    values.push(filters.locale);
    clauses.push(`cl.locale=$${values.length}`);
  }
  if (filters.status && ['draft', 'published', 'withdrawn', 'archived'].includes(filters.status)) {
    values.push(filters.status);
    clauses.push(`cl.workflow_status=$${values.length}`);
  }
  const rows = (await pool.query<{
    id: string;
    title: string;
    slug: string;
    locale: Locale;
    workflow_status: KnowledgeWorkflowStatus;
    version_number: number;
    published_version_number: number | null;
    current_draft_version_id: string;
    current_published_version_id: string | null;
    created_at: Date;
    updated_at: Date;
    published_at: Date | null;
  }>(
    `SELECT cl.id,cl.title,cl.slug,cl.locale,cl.workflow_status,cv.version_number,
            published_cv.version_number AS published_version_number,
            cl.current_draft_version_id,cl.current_published_version_id,
            c.created_at,cl.updated_at,published_cv.published_at
     FROM content_localizations cl
     JOIN contents c ON c.id=cl.content_id
     JOIN content_versions cv ON cv.id=cl.current_draft_version_id
     LEFT JOIN content_versions published_cv ON published_cv.id=cl.current_published_version_id
     WHERE ${clauses.join(' AND ')}
     ORDER BY cl.updated_at DESC,cl.id DESC LIMIT 100`,
    values,
  )).rows;
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    locale: row.locale,
    workflowStatus: row.workflow_status,
    versionNumber: Number(row.version_number),
    publishedVersionNumber: row.published_version_number === null ? null : Number(row.published_version_number),
    hasUnpublishedChanges: Boolean(row.current_published_version_id && row.current_published_version_id !== row.current_draft_version_id),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    publishedAt: row.published_at ? new Date(row.published_at).toISOString() : null,
  }));
}
export const listLectureDrafts = (
  pool: Pool,
  filters?: { locale?: string; status?: string },
) => listDrafts(pool, 'lecture', filters);
export async function getAdminSummary(pool: Pool) {
  const counts = (
    await pool.query(
      `SELECT count(*) FILTER(WHERE c.kind='knowledge')::int AS knowledge,count(*) FILTER(WHERE c.kind='lecture')::int AS lectures,count(*) FILTER(WHERE cv.status='needs_review')::int AS needs_review FROM content_localizations cl JOIN contents c ON c.id=cl.content_id JOIN content_versions cv ON cv.id=cl.current_draft_version_id`,
    )
  ).rows[0];
  return {
    knowledge: Number(counts?.knowledge ?? 0),
    lectures: Number(counts?.lectures ?? 0),
    needsReview: Number(counts?.needs_review ?? 0),
    recentKnowledge: await listKnowledgeDrafts(pool),
    recentLectures: await listLectureDrafts(pool),
  };
}
export function isDechiveDocument(
  value: JSONContent,
): value is DechiveDocument {
  return (
    value.type === 'doc' &&
    (value.schemaVersion === 1 || value.schemaVersion === 2) &&
    Array.isArray(value.content)
  );
}
