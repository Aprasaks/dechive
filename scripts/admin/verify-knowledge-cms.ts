import assert from 'node:assert/strict';
import {
  normalizeKnowledgeTags,
  validateKnowledgePublishReadiness,
} from '../../src/services/knowledge-drafts';
import { collectBodyMedia } from '../../src/services/media-assets';

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
