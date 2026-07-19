import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { generateHTML } from '@tiptap/html/server';
import type { JSONContent } from '@tiptap/core';
import { aiUpdateDays } from '@/data/aiUpdates';
import { loadEditorFixtures } from '@/features/editor-lab/server-fixtures';
import { plainText } from '@/features/editor-lab/document';
import { exportPublishedMarkdown } from '@/features/editor-lab/export';
import { editorExtensions } from '@/features/editor-lab/editor-extensions';
import { validateDechiveDocument } from '@/features/editor-lab/security';
import type { DechiveDocument, FixtureDocument } from '@/features/editor-lab/document';
import { PostgresRepositories } from '@/repositories/postgres';
import type { PoolClient } from 'pg';

export const IMPORTER_VERSION = '1.0.0-stage8';
const sha = (value: string) => createHash('sha256').update(value).digest('hex');

export type ImportSpec = { id: string; fixtureId: string; sourcePath: string; legacyType: 'archive'|'deep_dive'|'book'; locale: 'ko'|'en'; route: string; format: string; depth: string; translationKey?: string };
export const importSpecs: ImportSpec[] = [
  { id:'archive-ko', fixtureId:'table-image-archive', sourcePath:'content/posts/what-null-leaves-behind.ko.md', legacyType:'archive', locale:'ko', route:'/archive/what-null-leaves-behind', format:'article', depth:'standard', translationKey:'what-null-leaves-behind' },
  { id:'archive-en', fixtureId:'table-image-archive-en', sourcePath:'content/posts/what-null-leaves-behind.en.md', legacyType:'archive', locale:'en', route:'/en/archive/what-null-leaves-behind', format:'article', depth:'standard', translationKey:'what-null-leaves-behind' },
  { id:'prompt-ko', fixtureId:'code-heavy-archive', sourcePath:'content/posts/prompt-real-world-guide.ko.md', legacyType:'archive', locale:'ko', route:'/archive/prompt-real-world-guide', format:'article', depth:'standard', translationKey:'prompt-real-world-guide' },
  { id:'prompt-en', fixtureId:'code-heavy-archive-en', sourcePath:'content/posts/prompt-real-world-guide.en.md', legacyType:'archive', locale:'en', route:'/en/archive/prompt-real-world-guide', format:'article', depth:'standard', translationKey:'prompt-real-world-guide' },
  { id:'learn-ko', fixtureId:'short-archive', sourcePath:'content/posts/can-we-learn-directly-from-ai-answers.ko.md', legacyType:'archive', locale:'ko', route:'/archive/can-we-learn-directly-from-ai-answers', format:'article', depth:'standard', translationKey:'can-we-learn-directly-from-ai-answers' },
  { id:'learn-en', fixtureId:'short-archive-en-stage9', sourcePath:'content/posts/can-we-learn-directly-from-ai-answers.en.md', legacyType:'archive', locale:'en', route:'/en/archive/can-we-learn-directly-from-ai-answers', format:'article', depth:'standard', translationKey:'can-we-learn-directly-from-ai-answers' },
  { id:'llm-ko', fixtureId:'llm-architecture-ko', sourcePath:'content/posts/llm-architecture.ko.md', legacyType:'archive', locale:'ko', route:'/archive/llm-architecture', format:'article', depth:'standard', translationKey:'llm-architecture' },
  { id:'llm-en', fixtureId:'llm-architecture-en', sourcePath:'content/posts/llm-architecture.en.md', legacyType:'archive', locale:'en', route:'/en/archive/llm-architecture', format:'article', depth:'standard', translationKey:'llm-architecture' },
  { id:'deep-ko', fixtureId:'heading-heavy-ko', sourcePath:'content/posts/ai-era-agile-verification.ko.md', legacyType:'deep_dive', locale:'ko', route:'/deep-dive/ai-era-agile-verification', format:'deep_dive', depth:'deep', translationKey:'ai-era-agile-verification' },
  { id:'deep-en', fixtureId:'heading-heavy-en', sourcePath:'content/posts/ai-era-agile-verification.en.md', legacyType:'deep_dive', locale:'en', route:'/en/deep-dive/ai-era-agile-verification', format:'deep_dive', depth:'deep', translationKey:'ai-era-agile-verification' },
  { id:'data-ko', fixtureId:'multi-image', sourcePath:'content/posts/data-analysis-beyond-business.ko.md', legacyType:'deep_dive', locale:'ko', route:'/deep-dive/data-analysis-beyond-business', format:'deep_dive', depth:'deep', translationKey:'data-analysis-beyond-business' },
  { id:'data-en', fixtureId:'synthetic-scale-source', sourcePath:'content/posts/data-analysis-beyond-business.en.md', legacyType:'deep_dive', locale:'en', route:'/en/deep-dive/data-analysis-beyond-business', format:'deep_dive', depth:'deep', translationKey:'data-analysis-beyond-business' },
  { id:'replace-ko', fixtureId:'can-ai-replace-learning-ko', sourcePath:'content/posts/can-ai-replace-learning.ko.md', legacyType:'deep_dive', locale:'ko', route:'/deep-dive/can-ai-replace-learning', format:'deep_dive', depth:'deep', translationKey:'can-ai-replace-learning' },
  { id:'replace-en', fixtureId:'can-ai-replace-learning-en', sourcePath:'content/posts/can-ai-replace-learning.en.md', legacyType:'deep_dive', locale:'en', route:'/en/deep-dive/can-ai-replace-learning', format:'deep_dive', depth:'deep', translationKey:'can-ai-replace-learning' },
  { id:'book-ko', fixtureId:'book-note', sourcePath:'src/content/books/knowing-what-we-know.ko.md', legacyType:'book', locale:'ko', route:'/book/knowing-what-we-know', format:'book_note', depth:'standard' },
  { id:'dual-brain-ko', fixtureId:'dual-brain-book', sourcePath:'src/content/books/dual-brain.ko.md', legacyType:'book', locale:'ko', route:'/book/dual-brain', format:'book_note', depth:'standard' },
];

type Counts = { headings: number; headingLevels: number[]; anchors: string[]; codeBlocks: number; codeLanguages: Array<string|null>; tables: number; images: number; imagePaths: string[]; links: number; textHash: string };
export function structuralCounts(document: JSONContent): Counts {
  const result: Counts = { headings:0, headingLevels:[], anchors:[], codeBlocks:0, codeLanguages:[], tables:0, images:0, imagePaths:[], links:0, textHash:'' };
  const text: string[] = [];
  const visit = (node: JSONContent) => {
    if (node.type === 'heading') { result.headings++; result.headingLevels.push(Number(node.attrs?.level)); result.anchors.push(String(node.attrs?.anchorId)); }
    if (node.type === 'codeBlock') { result.codeBlocks++; result.codeLanguages.push(typeof node.attrs?.language === 'string' ? node.attrs.language : null); }
    if (node.type === 'table') result.tables++;
    if (node.type === 'figure') { result.images++; result.imagePaths.push(String(node.attrs?.legacySrc ?? node.attrs?.src ?? '')); }
    if (node.type === 'text') { text.push(node.text ?? ''); result.links += (node.marks ?? []).filter((mark) => mark.type === 'link').length; }
    node.content?.forEach(visit);
  };
  visit(document); result.textHash = sha(text.join('\n').replace(/\s+/g,' ').trim()); return result;
}

async function ensureActor(tx: PoolClient) { return (await tx.query<{id:string}>(`INSERT INTO actors(role,display_name) SELECT 'owner','Legacy Import System' WHERE NOT EXISTS (SELECT 1 FROM actors WHERE display_name='Legacy Import System') RETURNING id`)).rows[0]?.id ?? (await tx.query<{id:string}>(`SELECT id FROM actors WHERE display_name='Legacy Import System'`)).rows[0]!.id; }

async function ensureKnowledgeIdentity(tx: PoolClient, spec: ImportSpec, data: Record<string, unknown>, actorId: string) {
  const key = spec.translationKey;
  if (key) {
    const existing = await tx.query<{content_id:string; group_id:string}>(`SELECT cl.content_id, c.translation_group_id AS group_id FROM content_localizations cl JOIN contents c ON c.id=cl.content_id WHERE cl.slug=$1 AND c.kind='knowledge' LIMIT 1`, [key]);
    if (existing.rows[0]) return { contentId: existing.rows[0].content_id, groupId: existing.rows[0].group_id };
  }
  const groupId = (await tx.query<{id:string}>(`INSERT INTO translation_groups(original_locale) VALUES ($1) RETURNING id`, [spec.locale])).rows[0]!.id;
  const contentId = (await tx.query<{id:string}>(`INSERT INTO contents(kind,translation_group_id,created_by) VALUES ('knowledge',$1,$2) RETURNING id`, [groupId, actorId])).rows[0]!.id;
  return { contentId, groupId };
}

async function persistKnowledge(tx: PoolClient, spec: ImportSpec, fixture: FixtureDocument, raw: string, batchId: string, repositories: PostgresRepositories) {
  const sourceChecksum = sha(raw); const stableKey = `${spec.legacyType}:${spec.locale}:${String(matter(raw).data.slug)}`;
  const existing = await repositories.findByLegacyIdentity({ sourceType:'legacy_markdown', stableKey, sourceChecksum }, tx);
  if (existing) return { id:spec.id, status: existing.sourceChecksum === sourceChecksum ? 'skipped' : 'change_detected', sourceChecksum, stableKey, sourcePath:spec.sourcePath, createdIds:{ localizationId:existing.localizationId }, warnings: existing.sourceChecksum === sourceChecksum ? ['already_imported_same_checksum'] : ['source_checksum_changed'], errors:[], counts:structuralCounts(fixture.document) };
  const parsed = matter(raw); const actorId = await ensureActor(tx); const identity = await ensureKnowledgeIdentity(tx, spec, parsed.data, actorId);
  const validation = validateDechiveDocument(fixture.document, 'draft');
  const warnings = [...fixture.warnings, ...validation.issues.map((issue) => issue.code)];
  if (!('source' in parsed.data) && !('sources' in parsed.data)) warnings.push('source_missing');
  const counts = structuralCounts(fixture.document); if (counts.images) warnings.push('unresolved_media_reference');
  const localizationId = (await tx.query<{id:string}>(`INSERT INTO content_localizations(content_id,locale,source_locale,translation_status,title,summary,slug,route_scope) VALUES ($1,$2,$2,'original',$3,$4,$5,$6) RETURNING id`, [identity.contentId,spec.locale,String(parsed.data.title),String(parsed.data.description ?? parsed.data.summary ?? ''),String(parsed.data.slug),spec.legacyType.replace('_','-')])).rows[0]!.id;
  await tx.query(`INSERT INTO knowledge_details(localization_id,format,depth,concepts) VALUES ($1,$2,$3,$4)`, [localizationId,spec.format,spec.depth,JSON.stringify(Array.isArray(parsed.data.tags) ? parsed.data.tags.filter((v:unknown) => typeof v === 'string') : [])]);
  const importedChecksum = sha(JSON.stringify(fixture.document));
  const versionId = (await tx.query<{id:string}>(`INSERT INTO content_versions(localization_id,version_number,schema_version,canonical_document,status,revision_summary,created_by,document_checksum,validation_status,validation_warnings,migration_metadata) VALUES ($1,1,$2,$3,$4,'Legacy dry-run import',$5,$6,$7,$8,$9) RETURNING id`, [localizationId,fixture.document.schemaVersion,fixture.document,warnings.length?'needs_review':'draft',actorId,importedChecksum,validation.status === 'rejected' ? 'rejected' : warnings.length ? 'needs_review':'valid',JSON.stringify(warnings),{legacyPublishedAt:parsed.data.date,legacyStatus:parsed.data.status,sourcePath:spec.sourcePath}])).rows[0]!.id;
  await tx.query(`UPDATE content_localizations SET current_draft_version_id=$1 WHERE id=$2`, [versionId,localizationId]);
  await tx.query(`INSERT INTO content_routes(localization_id,route,route_type,is_canonical) VALUES ($1,$2,'legacy_canonical',true)`, [localizationId,spec.route]);
  for (let i=0;i<counts.imagePaths.length;i++) {
    const imagePath=counts.imagePaths[i]; const mediaId=(await tx.query<{id:string}>(`INSERT INTO media_assets(status,original_filename,mime_type,checksum,source_url,created_by) VALUES ('pending',$1,'application/octet-stream',$2,$3,$4) RETURNING id`, [path.basename(imagePath),sha(imagePath),imagePath,actorId])).rows[0]!.id;
    await tx.query(`INSERT INTO media_usages(media_id,content_version_id,usage_type,alt,order_index,metadata) VALUES ($1,$2,'legacy_body','',$3,$4)`, [mediaId,versionId,i,{legacyPath:imagePath,unresolved:true}]);
  }
  await tx.query(`INSERT INTO legacy_identities(source_type,source_path,stable_key,content_id,localization_id,source_checksum,imported_checksum,importer_version) VALUES ('legacy_markdown',$1,$2,$3,$4,$5,$6,$7)`, [spec.sourcePath,stableKey,identity.contentId,localizationId,sourceChecksum,importedChecksum,IMPORTER_VERSION]);
  await tx.query(`INSERT INTO import_items(batch_id,source_type,source_path,stable_key,source_checksum,result_checksum,status,mapped_entity,content_id,localization_id,content_version_id,warnings,structural_counts) VALUES ($1,'legacy_markdown',$2,$3,$4,$5,$6,'knowledge',$7,$8,$9,$10,$11) ON CONFLICT(batch_id,source_type,stable_key) DO UPDATE SET status=EXCLUDED.status,warnings=EXCLUDED.warnings,errors='[]',result_checksum=EXCLUDED.result_checksum,content_id=EXCLUDED.content_id,localization_id=EXCLUDED.localization_id,content_version_id=EXCLUDED.content_version_id,attempt_count=import_items.attempt_count+1,last_attempted_at=now()`, [batchId,spec.sourcePath,stableKey,sourceChecksum,importedChecksum,warnings.length?'imported_with_warnings':'imported',identity.contentId,localizationId,versionId,JSON.stringify(warnings),counts]);
  return { id:spec.id,status:warnings.length?'imported_with_warnings':'imported',sourceChecksum,stableKey,sourcePath:spec.sourcePath,createdIds:{contentId:identity.contentId,localizationId,versionId},warnings,errors:[],counts,route:spec.route,slug:parsed.data.slug,locale:spec.locale,legacyPublishedAt:parsed.data.date };
}

function updateDocument(title:string, summary:string, sourceId:string): DechiveDocument { return {type:'doc',schemaVersion:2,content:[{type:'heading',attrs:{level:2,anchorId:'change-summary'},content:[{type:'text',text:title}]},{type:'paragraph',content:[{type:'text',text:summary}]},{type:'sourceReference',attrs:{sourceId,label:'Legacy official source',locator:null,note:'Imported from digest item'}}]}; }

async function persistDigest(tx:PoolClient,batchId:string,repositories:PostgresRepositories,date:string) {
  const day=aiUpdateDays.find((entry)=>entry.date===date); if(!day) throw new Error(`AI digest fixture missing: ${date}`);
  const checkedDate=(day.checkedDateKST ?? day.date).replaceAll('.','-');
  const stableKey=`ai_digest:${day.date}`; const sourcePath='src/data/aiUpdates.ts#2026-07-02'; const sourceChecksum=sha(JSON.stringify(day));
  const existing=await repositories.findByLegacyIdentity({sourceType:'legacy_typescript',stableKey,sourceChecksum},tx);
  if(existing) return {id:`ai-digest-${date}`,status:existing.sourceChecksum===sourceChecksum?'skipped':'change_detected',sourceChecksum,stableKey,sourcePath,createdIds:{digestId:existing.digestId},warnings:['already_imported_same_checksum'],errors:[]};
  const actorId=await ensureActor(tx); const digestId=(await tx.query<{id:string}>(`INSERT INTO update_digests(digest_date,locale,title,editorial_summary) VALUES ($1,'ko',$2,$3) RETURNING id`,[day.date,String(day.title ?? day.date),String(day.subtitle ?? '')])).rows[0]!.id;
  await tx.query(`INSERT INTO content_routes(digest_id,route,route_type,is_canonical) VALUES ($1,$2,'legacy_canonical',true)`,[digestId,`/ai-updates/${day.date}`]);
  const items=(day.groups ?? []).flatMap((group)=>group.updates.map((item)=>({group:group.name,item}))).slice(0,3); const itemReports=[];
  for(let order=0;order<items.length;order++) {
    const {group,item}=items[order]; const candidate=String(item.id); const source=item.officialSource ?? item.reportSource; const doc=updateDocument(item.title,item.summary,'pending-source');
    const contentId=(await tx.query<{id:string}>(`INSERT INTO contents(kind,created_by) VALUES ('ai_update',$1) RETURNING id`,[actorId])).rows[0]!.id;
    const locId=(await tx.query<{id:string}>(`INSERT INTO content_localizations(content_id,locale,source_locale,title,summary,slug,route_scope) VALUES ($1,'ko','ko',$2,$3,$4,$5) RETURNING id`,[contentId,item.title,item.summary,candidate,`ai-updates/${day.date}`])).rows[0]!.id;
    await tx.query(`INSERT INTO ai_updates(localization_id,vendor,product,announced_at,checked_at,change_summary,impact,source_confidence) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,[locId,group.split(' ')[0],null,day.date,checkedDate,item.whatChanged,item.whyItMatters,source?.url?'official_or_named':'needs_review']);
    const checksum=sha(JSON.stringify(doc)); const versionId=(await tx.query<{id:string}>(`INSERT INTO content_versions(localization_id,version_number,schema_version,canonical_document,status,revision_summary,created_by,document_checksum,validation_status,validation_warnings,migration_metadata) VALUES ($1,1,2,$2,'needs_review','Digest decomposition dry run',$3,$4,'needs_review',$5,$6) RETURNING id`,[locId,doc,actorId,checksum,JSON.stringify(source?.url?[]:['source_ambiguous']),{legacyDigestDate:day.date,legacyAnchor:item.id,slugCandidate:candidate}])).rows[0]!.id;
    await tx.query(`UPDATE content_localizations SET current_draft_version_id=$1 WHERE id=$2`,[versionId,locId]);
    if(source?.url) { const sourceId=(await tx.query<{id:string}>(`INSERT INTO sources(source_type,title,url,canonical_url,review_status) VALUES ($1,$2,$3,$3,'pending') RETURNING id`,[item.sourceType,source.label,source.url])).rows[0]!.id; await tx.query(`INSERT INTO content_sources(content_version_id,source_id,role,source_checked_at) VALUES ($1,$2,'primary',$3)`,[versionId,sourceId,checkedDate]); }
    await tx.query(`INSERT INTO update_digest_items(digest_id,update_localization_id,order_index) VALUES ($1,$2,$3)`,[digestId,locId,order]); itemReports.push({legacyAnchor:item.id,slugCandidate:candidate,order,source:source?.url??null,localizationId:locId});
  }
  const importedChecksum=sha(JSON.stringify({digestId:day.date,items:itemReports.map(({legacyAnchor,slugCandidate,order,source})=>({legacyAnchor,slugCandidate,order,source}))}));
  await tx.query(`INSERT INTO legacy_identities(source_type,source_path,stable_key,digest_id,source_checksum,imported_checksum,importer_version) VALUES ('legacy_typescript',$1,$2,$3,$4,$5,$6)`,[sourcePath,stableKey,digestId,sourceChecksum,importedChecksum,IMPORTER_VERSION]);
  await tx.query(`INSERT INTO import_items(batch_id,source_type,source_path,stable_key,source_checksum,result_checksum,status,mapped_entity,digest_id,warnings,structural_counts,review_classification,review_reasons) VALUES ($1,'legacy_typescript',$2,$3,$4,$5,'imported_with_warnings','update_digest',$6,$7,$8,'needs_editor_review',$9) ON CONFLICT(batch_id,source_type,stable_key) DO UPDATE SET status=EXCLUDED.status,errors='[]',result_checksum=EXCLUDED.result_checksum,digest_id=EXCLUDED.digest_id,attempt_count=import_items.attempt_count+1,last_attempted_at=now()`,[batchId,sourcePath,stableKey,sourceChecksum,importedChecksum,digestId,JSON.stringify(['slug_candidates_not_routes','items_require_editor_review']),{items:itemReports.length},JSON.stringify(['legacy_digest_contains_multiple_independent_updates','editor_must_approve_single_or_split'])]);
  return {id:`ai-digest-${date}`,status:'imported_with_warnings',sourceChecksum,stableKey,sourcePath,createdIds:{digestId},warnings:['slug_candidates_not_routes','items_require_editor_review'],errors:[],items:itemReports,route:`/ai-updates/${day.date}`,reviewClassification:'needs_editor_review'};
}

export type ImportFailureStage='parse'|'constraint'|'source_attach'|'media_usage'|'route_conflict'|'transaction';
export type ImportOptions={failureByItemId?:Record<string,ImportFailureStage>};

async function recordAttempt(repositories:PostgresRepositories,batchId:string,result:{id:string;status:string;sourcePath:string;stableKey:string;sourceChecksum:string;warnings:string[];errors:string[]}) {
  const sourceType=result.sourcePath.startsWith('src/data/aiUpdates.ts')?'legacy_typescript':'legacy_markdown';
  await repositories.transaction(async(tx)=>{await tx.query(`INSERT INTO import_items(batch_id,source_type,source_path,stable_key,source_checksum,status,warnings,errors,mapped_entity) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'attempt') ON CONFLICT(batch_id,source_type,stable_key) DO UPDATE SET status=EXCLUDED.status,warnings=EXCLUDED.warnings,errors=EXCLUDED.errors,source_checksum=EXCLUDED.source_checksum,attempt_count=import_items.attempt_count+1,last_attempted_at=now()`,[batchId,sourceType,result.sourcePath,result.stableKey,result.sourceChecksum,result.status,JSON.stringify(result.warnings),JSON.stringify(result.errors)]);});
}

export async function importLegacyContent(repositories:PostgresRepositories,batchKey='stage8-dry-run',options:ImportOptions={}) {
  return repositories.withBatchLock(batchKey,async()=>{
    const fixtures=new Map((await loadEditorFixtures()).map((fixture)=>[fixture.id,fixture]));
    const batchId=await repositories.transaction((tx)=>repositories.startBatch(batchKey,IMPORTER_VERSION,tx));
    const results:Array<{id:string;status:string;sourceChecksum:string;stableKey:string;sourcePath:string;createdIds:Record<string,string|undefined>;warnings:string[];errors:string[];[key:string]:unknown}>=[];
    const items=[...importSpecs.map((spec)=>({id:spec.id,kind:'knowledge' as const,spec})),{id:'ai-digest-2026-07-02',kind:'digest' as const,date:'2026-07-02'},{id:'ai-digest-2026-07-03',kind:'digest' as const,date:'2026-07-03'}];
    for(const item of items){
      const failure=options.failureByItemId?.[item.id];
      try {
        if(failure==='parse')throw new Error('injected_parse_failure');
        const result=await repositories.transaction(async(tx)=>{
          let value;
          if(item.kind==='knowledge'){const fixture=fixtures.get(item.spec.fixtureId);if(!fixture)throw new Error(`Missing fixture ${item.spec.fixtureId}`);value=await persistKnowledge(tx,item.spec,fixture,await readFile(path.resolve(item.spec.sourcePath),'utf8'),batchId,repositories);}
          else value=await persistDigest(tx,batchId,repositories,item.date);
          if(failure==='constraint')await tx.query(`INSERT INTO content_routes(route,route_type,is_canonical) VALUES ('/invalid-without-target','test',false)`);
          if(failure==='source_attach')throw new Error('injected_source_attach_failure');
          if(failure==='media_usage')throw new Error('injected_media_usage_failure');
          if(failure==='route_conflict')await tx.query(`INSERT INTO content_routes(localization_id,route,route_type,is_canonical) SELECT localization_id,route,'conflict',false FROM content_routes LIMIT 1`);
          if(failure==='transaction')throw new Error('injected_transaction_abort');
          return value;
        });
        results.push(result);
        if(result.status==='skipped'||result.status==='change_detected')await recordAttempt(repositories,batchId,result);
      } catch(error){
        const spec=item.kind==='knowledge'?item.spec:null;const digestDate=item.kind==='digest'?item.date:null;const sourcePath=spec?.sourcePath??`src/data/aiUpdates.ts#${digestDate}`;const stableKey=spec?`${spec.legacyType}:${spec.locale}:${spec.translationKey??spec.route.split('/').pop()}`:`ai_digest:${digestDate}`;const failed={id:item.id,status:'failed',sourceChecksum:'unavailable_after_failure',stableKey,sourcePath,createdIds:{},warnings:[],errors:[error instanceof Error?error.message:'unknown_failure']};
        await recordAttempt(repositories,batchId,failed);results.push(failed);
      }
      await repositories.transaction(async(tx)=>{await tx.query(`UPDATE import_batches SET last_heartbeat_at=now() WHERE id=$1`,[batchId]);});
    }
    const failed=results.filter((item)=>item.status==='failed').length;const warnings=results.reduce((total,item)=>total+item.warnings.length,0);const status=failed===results.length?'failed':failed?'partial_failure':warnings?'completed_with_warnings':'completed';
    await repositories.transaction((tx)=>repositories.finishBatch(batchId,status,{items:results.length,failed,warnings},tx));return {batchId,batchKey,importerVersion:IMPORTER_VERSION,status,results};
  });
}

export async function exportContentVersion(repositories:PostgresRepositories,localizationId:string) {
  const draft=await repositories.getCurrentDraft(localizationId); if(!draft)throw new Error('draft_not_found'); const document=draft.canonical_document as DechiveDocument;
  const markdown=exportPublishedMarkdown(document); const html=generateHTML(document,editorExtensions); const text=plainText(document); const route=await repositories.getCanonicalRoute(localizationId);
  return {document,normalizedMarkdown:markdown.markdown,markdownMetadata:markdown.metadata,renderedHtml:html,plainText:text,checksums:{document:sha(JSON.stringify(document)),markdown:sha(markdown.markdown),html:sha(html),text:sha(text)},route};
}
