import type { Pool } from 'pg';
import { createDatabase } from '@/db/client';
import type { DechiveDocument } from '@/features/editor-lab/document';
import type { KnowledgeReference } from './knowledge-drafts';
import { getKnowledgeHero, resolveKnowledgeDocument, type KnowledgeHero } from './media-assets';

export function createPublishedKnowledgeDatabase() {
  return createDatabase();
}

type VersionKnowledgeMetadata = {
  title?: string;
  slug?: string;
  summary?: string;
  tags?: string[];
  references?: KnowledgeReference[];
};

export type PublishedKnowledgeListItem = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  versionNumber: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type PublishedKnowledge = PublishedKnowledgeListItem & {
  document: DechiveDocument;
  references: KnowledgeReference[];
  hero: (KnowledgeHero & { publicUrl: string; width: number | null; height: number | null; aiGenerated: boolean }) | null;
};

function metadata(value: unknown): VersionKnowledgeMetadata {
  if (!value || typeof value !== 'object') return {};
  const knowledge = (value as { knowledge?: unknown }).knowledge;
  return knowledge && typeof knowledge === 'object'
    ? (knowledge as VersionKnowledgeMetadata)
    : {};
}

function strings(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
    ? value
    : [];
}

function references(value: unknown) {
  return Array.isArray(value) ? (value as KnowledgeReference[]) : [];
}

export async function listPublishedKnowledge(
  pool: Pool,
): Promise<PublishedKnowledgeListItem[]> {
  const rows = await pool.query<{
    slug: string;
    title: string;
    summary: string;
    version_number: number;
    created_at: Date;
    updated_at: Date;
    first_published_at: Date | null;
    current_published_at: Date | null;
    metadata: unknown;
  }>(
    `SELECT cl.slug,cl.title,cl.summary,cv.version_number,c.created_at,cl.updated_at,
            (SELECT min(history.published_at) FROM content_versions history WHERE history.localization_id=cl.id AND history.published_at IS NOT NULL) AS first_published_at,
            cv.published_at AS current_published_at,cv.migration_metadata AS metadata
     FROM content_localizations cl
     JOIN contents c ON c.id=cl.content_id AND c.kind='knowledge'
     JOIN content_versions cv ON cv.id=cl.current_published_version_id
     WHERE cl.route_scope='knowledge' AND cl.workflow_status='published'
     ORDER BY cv.created_at DESC,cl.slug ASC`,
  );
  return rows.rows.map((row) => {
    const version = metadata(row.metadata);
    return {
      slug: version.slug ?? row.slug,
      title: version.title ?? row.title,
      summary: version.summary ?? row.summary,
      tags: strings(version.tags),
      versionNumber: Number(row.version_number),
      publishedAt: (row.first_published_at ?? row.current_published_at ?? row.created_at).toISOString(),
      createdAt: row.created_at.toISOString(),
      updatedAt: (row.current_published_at ?? row.created_at).toISOString(),
    };
  });
}

export async function getPublishedKnowledge(
  pool: Pool,
  slug: string,
): Promise<PublishedKnowledge | null> {
  const row = (
    await pool.query<{
      slug: string;
      title: string;
      summary: string;
      version_id: string;
      version_number: number;
      created_at: Date;
      updated_at: Date;
      published_at: Date | null;
      first_published_at: Date | null;
      document: DechiveDocument;
      metadata: unknown;
    }>(
      `SELECT cl.slug,cl.title,cl.summary,cv.id AS version_id,cv.version_number,c.created_at,cl.updated_at,
              cv.published_at,
              (SELECT min(history.published_at) FROM content_versions history WHERE history.localization_id=cl.id AND history.published_at IS NOT NULL) AS first_published_at,
              cv.canonical_document AS document,cv.migration_metadata AS metadata
       FROM content_localizations cl
       JOIN contents c ON c.id=cl.content_id AND c.kind='knowledge'
       JOIN content_versions cv ON cv.id=cl.current_published_version_id
       WHERE cl.route_scope='knowledge'
         AND cl.workflow_status='published'
         AND cl.slug=$1`,
      [slug],
    )
  ).rows[0];
  if (!row) return null;
  const version = metadata(row.metadata);
  const document = await resolveKnowledgeDocument(pool, row.version_id, row.document);
  const hero = await getKnowledgeHero(pool, row.version_id);
  return {
    slug: version.slug ?? row.slug,
    title: version.title ?? row.title,
    summary: version.summary ?? row.summary,
    tags: strings(version.tags),
    references: references(version.references),
    versionNumber: Number(row.version_number),
    publishedAt: (row.first_published_at ?? row.published_at ?? row.created_at).toISOString(),
    createdAt: row.created_at.toISOString(),
    updatedAt: (row.published_at ?? row.created_at).toISOString(),
    hero,
    document,
  };
}
