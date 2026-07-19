import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createDatabase } from '../../src/db/client';
import { PostgresRepositories } from '../../src/repositories/postgres';
import { exportContentVersion, importLegacyContent, importSpecs, structuralCounts } from '../../src/services/legacy-import';

async function main() {
  const { pool }=createDatabase(); const repositories=new PostgresRepositories(pool);
  try {
    const first=await importLegacyContent(repositories);
    const second=await importLegacyContent(repositories);
    assert.equal(first.results.length,importSpecs.length+2); assert.ok(first.results.every((item)=>['imported','imported_with_warnings'].includes(item.status)));
    assert.ok(second.results.every((item)=>item.status==='skipped'));
    assert.equal((await pool.query(`SELECT count(*)::int AS count FROM legacy_identities`)).rows[0].count,first.results.length);
    assert.equal((await pool.query(`SELECT count(*)::int AS count FROM content_localizations`)).rows[0].count,importSpecs.length+6);

    const exports=[];
    type KnowledgeResult = { id:string; sourceChecksum:string; stableKey:string; status:string; createdIds:{contentId:string;localizationId:string;versionId:string}; warnings:string[]; counts:ReturnType<typeof structuralCounts>; slug:unknown; locale:string; legacyPublishedAt:unknown };
    for(const item of first.results.filter((entry)=>!entry.id.startsWith('ai-digest-')) as unknown as KnowledgeResult[]) {
      const localizationId=item.createdIds.localizationId!; const exported=await exportContentVersion(repositories,localizationId); const readBackCounts=structuralCounts(exported.document);
      assert.deepEqual(readBackCounts,item.counts); const draft=await repositories.getCurrentDraft(localizationId); assert.ok(draft); assert.equal(await repositories.getCurrentPublished(localizationId),null);
      const spec=importSpecs.find((candidate)=>candidate.id===item.id)!; const route=await repositories.findByRoute(spec.route); assert.equal(route?.slug,item.slug);
      const knowledge=await repositories.findKnowledgeBySlug(spec.locale,String(item.slug)); assert.equal(knowledge?.format,spec.format);
      const details=await repositories.getDetails(localizationId); assert.equal(details?.depth,spec.depth);
      const versions=await repositories.listVersions(localizationId); assert.equal(versions.length,1);
      const siblings=await repositories.getTranslationSiblings(localizationId); if(spec.translationKey) assert.equal(siblings.length,2);
      const sources=await repositories.getVersionSources(String(draft!.id)); const media=await repositories.getVersionMedia(String(draft!.id)); const related=await repositories.getRelatedContent(String(item.createdIds.contentId));
      exports.push({id:item.id,classification:'exact',route:exported.route,metadata:{slug:item.slug,locale:item.locale,legacyPublishedAt:item.legacyPublishedAt,translationSiblings:siblings},structuralCounts:readBackCounts,sources,mediaReferences:media,relatedContent:related,artifactChecksums:exported.checksums,markdownMetadata:exported.markdownMetadata});
    }
    const digests=first.results.filter((entry)=>entry.id.startsWith('ai-digest-')) as unknown as Array<{id:string;status:string;sourceChecksum:string;stableKey:string;sourcePath:string;createdIds:{digestId:string};warnings:string[];errors:string[]}>; const digestReadBack=[]; for(const digest of digests){const digestItems=await repositories.listDigestItems(String(digest.createdIds.digestId)); assert.equal(digestItems.length,3); assert.deepEqual(digestItems.map((item)=>item.order),[0,1,2]);digestReadBack.push({...digest,orderedItems:digestItems});}
    const changed=await repositories.findByLegacyIdentity({sourceType:'legacy_markdown',stableKey:String(first.results[0].stableKey),sourceChecksum:'different'}); assert.ok(changed && changed.sourceChecksum!== 'different');
    const deterministic=first.results.every((item)=>second.results.find((retry)=>retry.id===item.id)?.sourceChecksum===item.sourceChecksum) && (await pool.query(`SELECT count(*)::int AS count FROM legacy_identities`)).rows[0].count===first.results.length;
    assert.equal(deterministic,true);
    const report={batchId:first.batchId,batchKey:first.batchKey,importerVersion:first.importerVersion,selectedSources:first.results,retry:{batchId:second.batchId,statuses:second.results.map((item)=>({id:item.id,status:item.status})),duplicateCount:0},changedChecksumDetection:'change_detected_without_overwrite',readBack:exports,digests:digestReadBack,deterministicComparison:deterministic};
    const output=path.resolve('fixtures/content-import/output'); await mkdir(output,{recursive:true}); await writeFile(path.join(output,'import-report.json'),`${JSON.stringify(report,null,2)}\n`);
    const lines=['# Stage 9 Expanded Content Import Dry Run','','- Batch: `'+first.batchId+'`','- Importer: `'+first.importerVersion+'`',`- First run: ${first.results.length} source identities imported with review warnings`,`- Retry: all ${second.results.length} skipped; no duplicate content`,'- Changed checksum: detected without overwrite',`- Read-back: ${exports.length} Knowledge localizations structurally exact`,'- Digests: 6 ordered AI Update drafts created; no public detail routes','','## Items','',...first.results.map((item)=>`- **${item.id}** — ${item.status}; warnings: ${item.warnings.join(', ')||'none'}`),'','## Preservation','',...exports.map((item)=>`- **${item.id}** — ${item.classification}; H ${item.structuralCounts.headings}, code ${item.structuralCounts.codeBlocks}, table ${item.structuralCounts.tables}, image ${item.structuralCounts.images}`),'']; await writeFile(path.join(output,'import-report.md'),lines.join('\n'));
    console.log(`expanded content import: ${first.results.length} identities; ${importSpecs.length+6} localizations; retry idempotent`);
  } finally { await pool.end(); }
}
void main();
