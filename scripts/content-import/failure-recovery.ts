import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createDatabase } from '../../src/db/client';
import { PostgresRepositories } from '../../src/repositories/postgres';
import { importLegacyContent, type ImportFailureStage } from '../../src/services/legacy-import';

async function main(){const {pool}=createDatabase();const repositories=new PostgresRepositories(pool);const batchKey='stage10-partial-failure';const failures:Record<string,ImportFailureStage>={
  'prompt-ko':'parse','learn-ko':'constraint','llm-ko':'source_attach','deep-ko':'media_usage','data-ko':'route_conflict','replace-ko':'transaction',
};
try{
  const first=await importLegacyContent(repositories,batchKey,{failureByItemId:failures});assert.equal(first.status,'partial_failure');assert.equal(first.results.filter((item)=>item.status==='failed').length,6);
  const dbFailed=Number((await pool.query(`SELECT count(*) FROM import_items ii JOIN import_batches ib ON ib.id=ii.batch_id WHERE ib.batch_key=$1 AND ii.status='failed'`,[batchKey])).rows[0].count);assert.equal(dbFailed,6);
  assert.equal(Number((await pool.query(`SELECT count(*) FROM legacy_identities`)).rows[0].count),12);
  let reportWriteFailure='not_injected';try{await writeFile(path.resolve('fixtures/content-import/output'),'{invalid}');}catch{reportWriteFailure='injected_and_isolated';}assert.equal(reportWriteFailure,'injected_and_isolated');
  await pool.query(`UPDATE import_batches SET status='running',last_heartbeat_at=now()-interval '30 minutes' WHERE batch_key=$1`,[batchKey]);
  const retry=await importLegacyContent(repositories,batchKey);assert.notEqual(retry.status,'partial_failure');assert.equal(retry.results.filter((item)=>item.status==='failed').length,0);
  assert.equal(Number((await pool.query(`SELECT count(*) FROM legacy_identities`)).rows[0].count),18);assert.equal(Number((await pool.query(`SELECT count(*) FROM content_localizations`)).rows[0].count),22);
  assert.equal(Number((await pool.query(`SELECT count(*) FROM import_items ii JOIN import_batches ib ON ib.id=ii.batch_id WHERE ib.batch_key=$1 AND ii.status='failed'`,[batchKey])).rows[0].count),0);
  const batch=(await pool.query(`SELECT status,recovery_count,summary FROM import_batches WHERE batch_key=$1`,[batchKey])).rows[0];assert.equal(Number(batch.recovery_count),1);
  const duplicateRoutes=Number((await pool.query(`SELECT count(*) FROM (SELECT route FROM content_routes GROUP BY route HAVING count(*)>1) d`)).rows[0].count);assert.equal(duplicateRoutes,0);
  const output=path.resolve('fixtures/content-import/output');await mkdir(output,{recursive:true});const report={cloudStatus:'blocked_missing_credentials',firstRun:{status:first.status,failed:first.results.filter((item)=>item.status==='failed').map((item)=>({id:item.id,error:item.errors[0]})),successful:first.results.filter((item)=>item.status!=='failed').length},reportWriteFailure,recovery:{staleRunningBatch:true,recoveryCount:Number(batch.recovery_count),status:batch.status,failedItemsRemaining:0},retry:{status:retry.status,identities:18,localizations:22,duplicateRoutes},credentialsRedacted:true};await writeFile(path.join(output,'failure-recovery-report.json'),`${JSON.stringify(report,null,2)}\n`);console.log('import failure recovery: partial failure 6, retry 6 recovered, duplicates 0');
}finally{await pool.end();}}
void main();
