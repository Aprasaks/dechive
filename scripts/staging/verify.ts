import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createDatabase } from '../../src/db/client';
import { PostgresRepositories } from '../../src/repositories/postgres';
import { importLegacyContent, importSpecs } from '../../src/services/legacy-import';
import { dailyIssues } from '../../src/data/dailyIssues';

const exec=promisify(execFile); const output=path.resolve('fixtures/staging-import/output');
const tables=['contents','content_localizations','content_versions','knowledge_details','ai_updates','update_digests','update_digest_items','content_routes','sources','content_sources','media_assets','media_usages','legacy_identities','import_batches','import_items','editorial_issues','editorial_issue_items'];

async function counts(url?:string){const {pool}=createDatabase(url);try{const result:Record<string,number>={};for(const table of tables)result[table]=Number((await pool.query(`SELECT count(*) FROM ${table}`)).rows[0].count);return result;}finally{await pool.end();}}
async function integrity(url?:string){const {pool}=createDatabase(url);try{return (await pool.query(`SELECT md5(concat_ws('|',
  (SELECT string_agg(document_checksum,',' ORDER BY id) FROM content_versions),
  (SELECT string_agg(checksum,',' ORDER BY id) FROM content_version_artifacts),
  (SELECT string_agg(route,',' ORDER BY route) FROM content_routes),
  (SELECT string_agg(source_checksum,',' ORDER BY stable_key) FROM legacy_identities)
)) AS checksum`)).rows[0].checksum as string;}finally{await pool.end();}}
async function runDocker(args:string[]){return exec('docker',['compose','-f','docker-compose.db.yml','exec','-T','postgres',...args],{cwd:process.cwd(),maxBuffer:50*1024*1024});}

async function main(){const {pool}=createDatabase();const repositories=new PostgresRepositories(pool);try{
  const imported=await importLegacyContent(repositories,'stage9-expanded-dry-run');assert.equal(imported.results.length,importSpecs.length+2);
  const issueFixtures=dailyIssues.filter((issue)=>['2026-06-15','2026-06-16'].includes(issue.date));
  for(const issue of issueFixtures){const issueId=(await pool.query<{id:string}>(`INSERT INTO editorial_issues(legacy_key,issue_date,title,summary,editorial_note,provenance,generation_mode,legacy_route) VALUES ($1,$2,$3,$4,$5,'src/data/dailyIssues.ts','manual',$6) RETURNING id`,[`daily_issue:${issue.id}`,issue.date,issue.question.title.ko,issue.question.description?.ko??'',issue.question.kicker?.ko??null,`/issues/${issue.date}`])).rows[0]!.id;const route=await repositories.findByRoute(issue.question.href);await pool.query(`INSERT INTO editorial_issue_items(issue_id,content_id,legacy_content_route,order_index,editorial_label,provenance) VALUES ($1,$2,$3,0,$4,'question.href')`,[issueId,route?.content_id??null,issue.question.href,issue.question.label.ko]);}
  assert.equal(Number((await pool.query(`SELECT count(*) FROM editorial_issues`)).rows[0].count),2);
  const portable={formatVersion:1,exportedFrom:'staging-compatible-local-rehearsal',contents:(await pool.query(`SELECT li.stable_key AS "stableKey",li.source_checksum AS "sourceChecksum",cl.locale,cl.slug,cl.title,cr.route,kd.format,kd.depth,cv.schema_version AS "schemaVersion",cv.canonical_document AS document,cv.document_checksum AS "documentChecksum",(SELECT jsonb_agg(jsonb_build_object('legacyPath',mu.metadata->>'legacyPath','usageType',mu.usage_type,'alt',mu.alt) ORDER BY mu.order_index) FROM media_usages mu WHERE mu.content_version_id=cv.id) AS media FROM legacy_identities li JOIN content_localizations cl ON cl.id=li.localization_id JOIN content_versions cv ON cv.id=cl.current_draft_version_id LEFT JOIN knowledge_details kd ON kd.localization_id=cl.id LEFT JOIN content_routes cr ON cr.localization_id=cl.id AND cr.is_canonical WHERE li.localization_id IS NOT NULL ORDER BY li.stable_key`)).rows,digests:(await pool.query(`SELECT li.stable_key AS "stableKey",d.digest_date AS date,d.locale,d.title,cr.route,(SELECT jsonb_agg(jsonb_build_object('order',udi.order_index,'slug',cl.slug,'legacyAnchor',cv.migration_metadata->>'legacyAnchor') ORDER BY udi.order_index) FROM update_digest_items udi JOIN content_localizations cl ON cl.id=udi.update_localization_id JOIN content_versions cv ON cv.id=cl.current_draft_version_id WHERE udi.digest_id=d.id) AS items FROM legacy_identities li JOIN update_digests d ON d.id=li.digest_id LEFT JOIN content_routes cr ON cr.digest_id=d.id AND cr.is_canonical ORDER BY li.stable_key`)).rows,issues:(await pool.query(`SELECT legacy_key AS "stableKey",issue_date AS date,locale,title,summary,legacy_route AS route,(SELECT jsonb_agg(jsonb_build_object('order',order_index,'route',legacy_content_route) ORDER BY order_index) FROM editorial_issue_items WHERE issue_id=editorial_issues.id) AS items FROM editorial_issues ORDER BY legacy_key`)).rows};
  await mkdir(output,{recursive:true});await writeFile(path.join(output,'portable-export.json'),`${JSON.stringify(portable,null,2)}\n`);
  const before=await counts();const checksumBefore=await integrity();await runDocker(['pg_dump','-U','dechive','-d','dechive_test','--data-only','--format=custom','--exclude-table=schema_migrations','--file=/tmp/dechive-stage9.dump']);await runDocker(['dropdb','-U','dechive','--if-exists','dechive_restore']);await runDocker(['createdb','-U','dechive','dechive_restore']);
  const restoreUrl='postgresql://dechive:dechive_local_only@127.0.0.1:55432/dechive_restore';await execFileAsyncMigration(restoreUrl);await runDocker(['pg_restore','-U','dechive','-d','dechive_restore','--data-only','--single-transaction','--exit-on-error','/tmp/dechive-stage9.dump']);const after=await counts(restoreUrl);const checksumAfter=await integrity(restoreUrl);assert.deepEqual(after,before);assert.equal(checksumAfter,checksumBefore);
  const report={environment:'local PostgreSQL rehearsal; Neon credentials unavailable',cloudExecuted:false,import:{sourceIdentities:imported.results.length,localizations:before.content_localizations,statuses:imported.results.map((item)=>({id:item.id,status:item.status}))},issues:2,backup:{postgresLogical:'data-only custom format, secret-free',portableFormatVersion:1},restore:{countsBefore:before,countsAfter:after,equal:true,integrityChecksumBefore:checksumBefore,integrityChecksumAfter:checksumAfter,checksumEqual:true},credentialsRedacted:true};await writeFile(path.join(output,'staging-rehearsal-report.json'),`${JSON.stringify(report,null,2)}\n`);console.log(`staging-compatible rehearsal: ${before.content_localizations} localizations; restore counts/checksum exact`);
}finally{await pool.end();}}
async function execFileAsyncMigration(url:string){await exec('npx',['tsx','scripts/db/migrate.ts'],{cwd:process.cwd(),env:{...process.env,DATABASE_URL:url},maxBuffer:10*1024*1024});}
void main();
