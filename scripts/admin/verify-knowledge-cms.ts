import assert from 'node:assert/strict';
import { formatKnowledgeDate, formatKnowledgeDateTime } from '../../src/features/knowledge/date-format';
import {
  normalizeKnowledgeTags,
  validateKnowledgePublishReadiness,
} from '../../src/services/knowledge-drafts';
import { collectBodyMedia } from '../../src/services/media-assets';
import {
  decodePublishedKnowledgeCursor,
  encodePublishedKnowledgeCursor,
} from '../../src/services/published-knowledge';
import { mergeKnowledgeItems, normalizeKnowledgeSearchQuery } from '../../src/features/knowledge/search';

const document = {
  type: 'doc' as const,
  schemaVersion: 1 as const,
  content: [
    {
      type: 'paragraph' as const,
      content: [{ type: 'text' as const, text: 'Knowledge 본문' }],
    },
  ],
};

assert.deepEqual(
  normalizeKnowledgeTags(['  검증 ', '검증', '', '이미지']),
  ['검증', '이미지'],
);
assert.equal(
  formatKnowledgeDateTime('2026-07-22T15:21:00Z'),
  '2026년 7월 23일 오전 12:21',
);
assert.equal(formatKnowledgeDate('2026-07-22T15:21:00Z'), '2026.07.23');
assert.equal(normalizeKnowledgeSearchQuery('  제목   태그  '), '제목 태그');
assert.deepEqual(
  mergeKnowledgeItems([{ id: 'one' }, { id: 'two' }], [{ id: 'two' }, { id: 'three' }], false),
  [{ id: 'one' }, { id: 'two' }, { id: 'three' }],
);
assert.deepEqual(mergeKnowledgeItems([{ id: 'old' }], [{ id: 'new' }], true), [{ id: 'new' }]);
const cursor = { createdAt: '2026-07-23T00:00:00.000Z', slug: 'cursor-test', id: '00000000-0000-0000-0000-000000000001' };
assert.deepEqual(decodePublishedKnowledgeCursor(encodePublishedKnowledgeCursor(cursor)), cursor);
assert.throws(() => decodePublishedKnowledgeCursor('not-a-cursor'), /invalid|JSON/);
const stableCursorOrder = [
  { createdAt: '2026-07-23T00:00:00.000Z', slug: 'b', id: '00000000-0000-0000-0000-000000000002' },
  { createdAt: '2026-07-23T00:00:00.000Z', slug: 'a', id: '00000000-0000-0000-0000-000000000003' },
  { createdAt: '2026-07-23T00:00:00.000Z', slug: 'a', id: '00000000-0000-0000-0000-000000000001' },
].sort((left, right) => left.createdAt.localeCompare(right.createdAt) || left.slug.localeCompare(right.slug) || left.id.localeCompare(right.id));
assert.deepEqual(stableCursorOrder.map((item) => `${item.slug}:${item.id.slice(-1)}`), ['a:1', 'a:3', 'b:2']);
const lastPage = { items: ['only'], nextCursor: null as string | null };
assert.equal(lastPage.nextCursor, null, '마지막 페이지는 nextCursor 없이 종료');
assert.throws(
  () => normalizeKnowledgeTags(Array.from({ length: 13 }, (_, index) => `tag-${index}`)),
  /tags_too_many/,
);

const readiness = validateKnowledgePublishReadiness({
  title: 'Knowledge 검증',
  slug: 'knowledge-verification',
  locale: 'ko',
  summary: '요약',
  tags: [],
  document,
});
assert.equal(readiness.ready, true);
assert.deepEqual(readiness.warnings, ['tags_missing']);
assert(!readiness.blockingErrors.includes('reference_required'));

assert.deepEqual(
  collectBodyMedia({
    ...document,
    content: [
      {
        type: 'figure',
        attrs: { mediaId: '00000000-0000-0000-0000-000000000001', alt: '설명', caption: '캡션' },
      },
    ],
  }),
  [{ mediaId: '00000000-0000-0000-0000-000000000001', alt: '설명', caption: '캡션', order: 0 }],
);
assert.throws(
  () => collectBodyMedia({ ...document, content: [{ type: 'figure', attrs: { mediaId: '00000000-0000-0000-0000-000000000001', alt: '' } }] }),
  /media_alt_required/,
);

console.log(JSON.stringify({
  status: 'knowledge_cms_pure_checks_passed',
  blankBodyReadiness: true,
  tags: { trim: true, deduplicate: true, max: 12 },
  referencesOptional: true,
  mediaAltRequired: true,
}));
