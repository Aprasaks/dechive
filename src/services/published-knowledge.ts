import type { Pool } from 'pg';
import { createDatabase } from '@/db/client';
import type { DechiveDocument } from '@/features/editor-lab/document';
import {
  classifyKnowledgeTags,
  normalizeKnowledgeCategory,
  type KnowledgeCategory,
} from '@/features/knowledge/categories';
import { normalizeKnowledgeSearchQuery } from '@/features/knowledge/search';
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
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  versionNumber: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  category: KnowledgeCategory;
};

export type PublishedKnowledgeHero = KnowledgeHero & {
  publicUrl: string;
  width: number | null;
  height: number | null;
  aiGenerated: boolean;
};

export type PublishedKnowledgeFeedItem = PublishedKnowledgeListItem & {
  id: string;
  hero: PublishedKnowledgeHero | null;
};

export type PublishedKnowledgeCursor = {
  createdAt: string;
  slug: string;
  id: string;
};

export type PublishedKnowledge = PublishedKnowledgeListItem & {
  document: DechiveDocument;
  references: KnowledgeReference[];
  hero: PublishedKnowledgeHero | null;
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

export function encodePublishedKnowledgeCursor(cursor: PublishedKnowledgeCursor): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}

export function decodePublishedKnowledgeCursor(value: string): PublishedKnowledgeCursor {
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
  } catch {
    throw new Error('invalid_knowledge_cursor');
  }
  if (!parsed || typeof parsed !== 'object') throw new Error('invalid_knowledge_cursor');
  const cursor = parsed as Partial<PublishedKnowledgeCursor>;
  if (typeof cursor.createdAt !== 'string' || typeof cursor.slug !== 'string' || typeof cursor.id !== 'string') {
    throw new Error('invalid_knowledge_cursor');
  }
  if (Number.isNaN(new Date(cursor.createdAt).getTime())) throw new Error('invalid_knowledge_cursor');
  return { createdAt: cursor.createdAt, slug: cursor.slug, id: cursor.id };
}

type PublishedKnowledgeFeedRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  version_id: string;
  version_number: number;
  created_at: Date;
  sort_created_at: Date;
  current_published_at: Date | null;
  first_published_at: Date | null;
  metadata: unknown;
};

function publishedSearchQuery(query: string, cursor: string | null, category: KnowledgeCategory) {
  const clauses = [
    `cl.route_scope='knowledge'`,
    `cl.workflow_status='published'`,
  ];
  const values: unknown[] = [];
  const add = (value: unknown) => {
    values.push(value);
    return `$${values.length}`;
  };
  const search = normalizeKnowledgeSearchQuery(query);
  if (search) {
    const searchValue = add(search.toLowerCase());
    clauses.push(`(
      position(${searchValue} in lower(coalesce(cv.migration_metadata #>> '{knowledge,title}', cl.title))) > 0
      OR position(${searchValue} in lower(coalesce(cv.migration_metadata #>> '{knowledge,summary}', cl.summary))) > 0
      OR EXISTS (
        SELECT 1
          FROM jsonb_array_elements_text(
            CASE
              WHEN jsonb_typeof(cv.migration_metadata #> '{knowledge,tags}') = 'array'
              THEN cv.migration_metadata #> '{knowledge,tags}'
              ELSE '[]'::jsonb
            END
          ) AS tag(value)
         WHERE position(${searchValue} in lower(tag.value)) > 0
      )
    )`);
  }
  if (category !== 'all') {
    const categoryTags = {
      foundations: ['인공지능', 'ai', '머신러닝', '딥러닝', '신경망', '알고리즘', '확률', '통계', '예측'],
      'use-and-verify': ['프롬프트', '컨텍스트', '평가', '검증', '입력 설계', '대화 설계'],
      systems: ['rag', '에이전트', '시스템', '파이프라인', '데이터', '검색'],
      responsibility: ['안전', '보안', '윤리', '거버넌스', '운영', '책임'],
    } satisfies Record<Exclude<KnowledgeCategory, 'all'>, string[]>;
    const categoryValue = add(categoryTags[category].map((tag) => tag.toLowerCase()));
    clauses.push(`EXISTS (
      SELECT 1
        FROM jsonb_array_elements_text(
          CASE
            WHEN jsonb_typeof(cv.migration_metadata #> '{knowledge,tags}') = 'array'
            THEN cv.migration_metadata #> '{knowledge,tags}'
            ELSE '[]'::jsonb
          END
        ) AS category_tag(value)
       WHERE lower(category_tag.value) = ANY(${categoryValue}::text[])
    )`);
  }
  if (cursor) {
    const decoded = decodePublishedKnowledgeCursor(cursor);
    const createdAt = add(decoded.createdAt);
    const slug = add(decoded.slug);
    const id = add(decoded.id);
    clauses.push(`(cv.created_at,cl.slug,cl.id) < (${createdAt}::timestamptz,${slug},${id}::uuid)`);
  }
  return { where: clauses.join(' AND '), values };
}

function feedItem(row: PublishedKnowledgeFeedRow, hero: PublishedKnowledgeHero | null): PublishedKnowledgeFeedItem {
  const version = metadata(row.metadata);
  return {
    id: row.id,
    slug: version.slug ?? row.slug,
    title: version.title ?? row.title,
    summary: version.summary ?? row.summary,
    tags: strings(version.tags),
    category: classifyKnowledgeTags(strings(version.tags)),
    versionNumber: Number(row.version_number),
    publishedAt: (row.first_published_at ?? row.current_published_at ?? row.sort_created_at).toISOString(),
    createdAt: row.created_at.toISOString(),
    updatedAt: (row.current_published_at ?? row.sort_created_at).toISOString(),
    hero,
  };
}

export async function countPublishedKnowledge(pool: Pool, category?: string | null): Promise<number> {
  const normalizedCategory = normalizeKnowledgeCategory(category);
  const { where, values } = publishedSearchQuery('', null, normalizedCategory);
  const row = (await pool.query<{ count: string }>(
    `SELECT count(*)::text AS count
       FROM content_localizations cl
       JOIN contents c ON c.id=cl.content_id AND c.kind='knowledge'
       JOIN content_versions cv ON cv.id=cl.current_published_version_id
      WHERE ${where}`,
    values,
  )).rows[0];
  return Number(row?.count ?? 0);
}

export async function searchPublishedKnowledge(
  pool: Pool,
  options: { query?: string; cursor?: string | null; limit?: number; category?: string | null } = {},
): Promise<{ items: PublishedKnowledgeFeedItem[]; nextCursor: string | null }> {
  const limit = Math.min(Math.max(options.limit ?? 12, 1), 24);
  const query = normalizeKnowledgeSearchQuery(options.query);
  const category = normalizeKnowledgeCategory(options.category);
  const { where, values } = publishedSearchQuery(query, options.cursor ?? null, category);
  const limitValue = values.length + 1;
  values.push(limit);
  const rows = (await pool.query<PublishedKnowledgeFeedRow>(
    `SELECT cl.id,cl.slug,cl.title,cl.summary,cv.id AS version_id,cv.version_number,
            c.created_at,cv.created_at AS sort_created_at,
            (SELECT min(history.published_at) FROM content_versions history WHERE history.localization_id=cl.id AND history.published_at IS NOT NULL) AS first_published_at,
            cv.published_at AS current_published_at,cv.migration_metadata AS metadata
       FROM content_localizations cl
       JOIN contents c ON c.id=cl.content_id AND c.kind='knowledge'
       JOIN content_versions cv ON cv.id=cl.current_published_version_id
      WHERE ${where}
      ORDER BY cv.created_at DESC,cl.slug ASC,cl.id ASC
      LIMIT $${limitValue}`,
    values,
  )).rows;
  const hasMore = rows.length > limit;
  const visibleRows = hasMore ? rows.slice(0, limit) : rows;
  const items = await Promise.all(visibleRows.map(async (row) => feedItem(row, await getKnowledgeHero(pool, row.version_id))));
  const last = visibleRows.at(-1);
  return {
    items,
    nextCursor: hasMore && last
      ? encodePublishedKnowledgeCursor({ createdAt: last.sort_created_at.toISOString(), slug: last.slug, id: last.id })
      : null,
  };
}

function references(value: unknown) {
  return Array.isArray(value) ? (value as KnowledgeReference[]) : [];
}

export async function listPublishedKnowledge(
  pool: Pool,
): Promise<PublishedKnowledgeListItem[]> {
  const rows = await pool.query<{
    id: string;
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
    `SELECT cl.id,cl.slug,cl.title,cl.summary,cv.version_number,c.created_at,cl.updated_at,
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
      id: row.id,
      slug: version.slug ?? row.slug,
      title: version.title ?? row.title,
      summary: version.summary ?? row.summary,
      tags: strings(version.tags),
      category: classifyKnowledgeTags(strings(version.tags)),
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
      id: string;
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
      `SELECT cl.id,cl.slug,cl.title,cl.summary,cv.id AS version_id,cv.version_number,c.created_at,cl.updated_at,
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
    id: row.id,
    slug: version.slug ?? row.slug,
    title: version.title ?? row.title,
    summary: version.summary ?? row.summary,
    tags: strings(version.tags),
    category: classifyKnowledgeTags(strings(version.tags)),
    references: references(version.references),
    versionNumber: Number(row.version_number),
    publishedAt: (row.first_published_at ?? row.published_at ?? row.created_at).toISOString(),
    createdAt: row.created_at.toISOString(),
    updatedAt: (row.published_at ?? row.created_at).toISOString(),
    hero,
    document,
  };
}
