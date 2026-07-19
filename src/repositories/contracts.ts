import type { PoolClient } from 'pg';

export type TransactionContext = PoolClient;
export type LegacyIdentity = { sourceType: string; stableKey: string; sourceChecksum: string };

export interface ContentRepository {
  findByLegacyIdentity(identity: LegacyIdentity, tx?: TransactionContext): Promise<{ localizationId?: string; digestId?: string; sourceChecksum: string } | null>;
  findByRoute(route: string, tx?: TransactionContext): Promise<Record<string, unknown> | null>;
  getCanonicalRoute(localizationId: string, tx?: TransactionContext): Promise<Record<string, unknown> | null>;
  findKnowledgeBySlug(locale: string, slug: string, tx?: TransactionContext): Promise<Record<string, unknown> | null>;
  listVersions(localizationId: string, tx?: TransactionContext): Promise<Record<string, unknown>[]>;
  getCurrentDraft(localizationId: string, tx?: TransactionContext): Promise<Record<string, unknown> | null>;
  getCurrentPublished(localizationId: string, tx?: TransactionContext): Promise<Record<string, unknown> | null>;
  getTranslationSiblings(localizationId: string, tx?: TransactionContext): Promise<Record<string, unknown>[]>;
  getVersionSources(versionId: string, tx?: TransactionContext): Promise<Record<string, unknown>[]>;
  getVersionMedia(versionId: string, tx?: TransactionContext): Promise<Record<string, unknown>[]>;
  getRelatedContent(contentId: string, tx?: TransactionContext): Promise<Record<string, unknown>[]>;
}

export interface KnowledgeRepository {
  getDetails(localizationId: string, tx?: TransactionContext): Promise<Record<string, unknown> | null>;
}

export interface AIUpdateRepository {
  listDigestItems(digestId: string, tx?: TransactionContext): Promise<Record<string, unknown>[]>;
}

export interface ImportRepository {
  startBatch(batchKey: string, importerVersion: string, tx: TransactionContext): Promise<string>;
  finishBatch(batchId: string, status: string, summary: Record<string, unknown>, tx: TransactionContext): Promise<void>;
}
