import type { Pool } from 'pg';
import { createDatabase } from '@/db/client';
import type { DechiveDocument } from '@/features/editor-lab/document';
import type { KnowledgeReference } from './knowledge-drafts';

export function createPublishedLectureDatabase() {
  return createDatabase();
}

type VersionLectureMetadata = {
  title?: string;
  slug?: string;
  summary?: string;
  coreMessage?: string;
  references?: KnowledgeReference[];
};

export type PublishedLecturePrimaryKnowledge = {
  slug: string;
  title: string;
};

export type PublishedLectureListItem = {
  slug: string;
  title: string;
  summary: string;
  coreMessage: string;
  audience: string | null;
  estimatedDurationMinutes: number | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  primaryKnowledge: PublishedLecturePrimaryKnowledge | null;
  versionNumber: number;
  publishedAt: string;
};

export type PublishedLecture = PublishedLectureListItem & {
  document: DechiveDocument;
  learningObjectives: string[];
  checkpoints: string[];
  references: KnowledgeReference[];
};

function metadata(value: unknown): VersionLectureMetadata {
  if (!value || typeof value !== 'object') return {};
  const lecture = (value as { lecture?: unknown }).lecture;
  return lecture && typeof lecture === 'object'
    ? (lecture as VersionLectureMetadata)
    : {};
}

function strings(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
    ? value
    : [];
}

function references(value: unknown): KnowledgeReference[] {
  return Array.isArray(value) ? (value as KnowledgeReference[]) : [];
}

type PublishedLectureRow = {
  slug: string;
  title: string;
  summary: string;
  version_number: number;
  created_at: Date;
  metadata: unknown;
  audience: string | null;
  estimated_duration_minutes: number | null;
  difficulty: PublishedLectureListItem['difficulty'];
  primary_slug: string | null;
  primary_title: string | null;
};

function projectListItem(row: PublishedLectureRow): PublishedLectureListItem {
  const version = metadata(row.metadata);
  return {
    slug: version.slug ?? row.slug,
    title: version.title ?? row.title,
    summary: version.summary ?? row.summary,
    coreMessage: version.coreMessage ?? '',
    audience: row.audience,
    estimatedDurationMinutes: row.estimated_duration_minutes,
    difficulty: row.difficulty,
    primaryKnowledge:
      row.primary_slug && row.primary_title
        ? { slug: row.primary_slug, title: row.primary_title }
        : null,
    versionNumber: Number(row.version_number),
    publishedAt: row.created_at.toISOString(),
  };
}

const publishedLectureQuery = `
  SELECT cl.slug,cl.title,cl.summary,cv.version_number,cv.created_at,
         cv.canonical_document AS document,cv.migration_metadata AS metadata,
         ld.audience,ld.estimated_duration_minutes,ld.difficulty,
         ld.learning_objectives,ld.checkpoints,primary_route.route AS primary_route,
         primary_localization.slug AS primary_slug,
         primary_version.migration_metadata->'knowledge'->>'title' AS primary_title
  FROM content_localizations cl
  JOIN contents c ON c.id=cl.content_id AND c.kind='lecture'
  JOIN content_versions cv ON cv.id=cl.current_published_version_id
  JOIN lecture_details ld ON ld.localization_id=cl.id
  JOIN content_routes lecture_route ON lecture_route.localization_id=cl.id
    AND lecture_route.is_canonical AND lecture_route.active_until IS NULL
    AND lecture_route.route=CONCAT('/lecture/',cl.slug)
  LEFT JOIN content_localizations primary_localization
    ON primary_localization.content_id=ld.primary_source_knowledge_id
    AND primary_localization.locale=cl.locale
  LEFT JOIN content_versions primary_version
    ON primary_version.id=primary_localization.current_published_version_id
  LEFT JOIN content_routes primary_route ON primary_route.localization_id=primary_localization.id
    AND primary_route.is_canonical AND primary_route.active_until IS NULL
    AND primary_route.route=CONCAT('/knowledge/',primary_localization.slug)
  WHERE cl.route_scope='lecture'`;

export async function listPublishedLectures(
  pool: Pool,
): Promise<PublishedLectureListItem[]> {
  const rows = await pool.query<PublishedLectureRow>(
    `${publishedLectureQuery} ORDER BY cv.created_at DESC,cl.slug ASC`,
  );
  return rows.rows.map(projectListItem);
}

export async function getPublishedLecture(
  pool: Pool,
  slug: string,
): Promise<PublishedLecture | null> {
  const row = (
    await pool.query<PublishedLectureRow & {
      document: DechiveDocument;
      learning_objectives: unknown;
      checkpoints: unknown;
    }>(
      `${publishedLectureQuery}
       AND cl.slug=$1`,
      [slug],
    )
  ).rows[0];
  if (!row) return null;
  const version = metadata(row.metadata);
  return {
    ...projectListItem(row),
    document: row.document,
    learningObjectives: strings(row.learning_objectives),
    checkpoints: strings(row.checkpoints),
    references: references(version.references),
  };
}
