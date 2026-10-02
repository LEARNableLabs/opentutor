import fs from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const root='/private/tmp/opentutor-review-329';
const fixed=process.argv.includes('--fixed');
const data=fs.mkdtempSync('/private/tmp/ot-review-save-');
process.env.OPENTUTOR_DATA_DIR=data;
const {TutorStore}=await import(pathToFileURL(`${root}/lib/core/store.js`));
const store=new TutorStore(root);
store.writeKV('generated_topic:smoke-review',JSON.stringify({id:'smoke',revision:0,status:'ready',slug:'smoke-review',curriculum:{topic:'Smoke review',lessons:[{lesson:1,title:'One',concepts:['c1']}]},files:{}}));
store.markLessonComplete('smoke-review',1,'correct');
store.writeProgress({active_topics:[],spaced_repetition:{'smoke-review::c1':{topic:'smoke-review',concept:'c1',next_review:'2000-01-01',ease:2.5,interval:1,reps:0,streak:0,first_seen:'2000-01-01'}}});
const fake=http.createServer((req,res)=>{req.resume();req.on('end',()=>{res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({choices:[{message:{content:'<assessment>{"score":0.9}</assessment>\nCorrect.'}}]}));});});
await new Promise(r=>fake.listen(0,'127.0.0.1',r));
const serverPort=await new Promise(resolve=>{const probe=net.createServer().listen(0,'127.0.0.1',()=>{const port=probe.address().port;probe.close(()=>resolve(port));});});
const child=spawn(process.execPath,['scripts/web/server.js'],{cwd:root,env:{PATH:process.env.PATH,HOME:process.env.HOME,OPENTUTOR_DATA_DIR:data,OPENTUTOR_PORT:String(serverPort),OPENTUTOR_HOST:'127.0.0.1',OPENTUTOR_PASSWORD:'local-smoke-password',OPENTUTOR_LLM:'openrouter',OPENROUTER_API_KEY:'local-smoke-key',OPENROUTER_BASE_URL:`http://127.0.0.1:${fake.address().port}`},stdio:['ignore','pipe','pipe']});
const execute=promisify(execFile);
let logs='';child.stderr.on('data',d=>{logs+=d});
try{
 const base=await new Promise((resolve,reject)=>{child.stdout.on('data',d=>{const m=String(d).match(/running at (http:\/\/[^\s]+)/);if(m)resolve(m[1])});child.on('exit',c=>reject(new Error(`Server exited ${c}`)))});
 const post=async body=>{const {stdout}=await execute('curl',['-sS','--max-time','10','-w','\n%{http_code}','-H','Content-Type: application/json','-H','Authorization: Bearer local-smoke-password','-d',JSON.stringify(body),`${base}/api/lesson`]);const split=stdout.lastIndexOf('\n');return{status:Number(stdout.slice(split+1)),body:JSON.parse(stdout.slice(0,split))};};
 let r=await post({topicSlug:'smoke-review'});
 while(r.body.step<r.body.totalSteps-1)r=await post({topicSlug:'smoke-review',answer:'Answer',lessonId:r.body.lessonId,step:r.body.step});
 const beforeLast=store.readKV('web_lesson:smoke-review');
 const last={topicSlug:'smoke-review',answer:'Final answer',lessonId:r.body.lessonId,step:r.body.step};
 store.db.exec("CREATE TRIGGER fail_review_save BEFORE INSERT ON kv WHEN NEW.key='progress' BEGIN SELECT RAISE(ABORT, 'injected schedule save failure'); END;");
 const failed=await post(last);
 const retained=JSON.parse(store.readKV('web_lesson:smoke-review')||'{}').id===last.lessonId;
 assert.equal(failed.status,fixed?503:200);assert.equal(retained,fixed);
 assert.equal(store.readProgress().spaced_repetition['smoke-review::c1'].next_review,'2000-01-01');
 store.db.exec('DROP TRIGGER fail_review_save');
 if(fixed){const recovered=await post({topicSlug:'smoke-review'});assert.equal(recovered.body.lessonId,last.lessonId);assert.equal(recovered.body.done,true);assert.equal(store.readProgress().spaced_repetition['smoke-review::c1'].reps,1);store.writeKV('web_lesson:smoke-review',beforeLast);const late=await post(last);assert.equal(late.body.done,true);assert.equal(store.readProgress().spaced_repetition['smoke-review::c1'].reps,1);assert.equal((await post({topicSlug:'smoke-review'})).body.message,'All lessons completed!');}
 assert.equal((await post({topicSlug:'missing-smoke-course'})).status,404);
 console.log(JSON.stringify({version:fixed?'fixed':'original',failedSaveStatus:failed.status,reportedDone:failed.body.done??false,retainedReview:retained,retryVerified:fixed}));
}finally{child.kill();fake.close();store.close();fs.rmSync(data,{recursive:true,force:true});}
