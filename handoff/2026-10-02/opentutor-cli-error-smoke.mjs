import fs from 'node:fs';
import net from 'node:net';
import {spawn,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import assert from 'node:assert/strict';
const root='/Users/ggiannon/Documents/gcg/opentutor';
const {TutorStore}=await import(`${root}/lib/core/store.js`);
const execute=promisify(execFile);
for(const [version,mode] of [['original','stdout'],['fixed','stdout'],['fixed','stderr']]){
 const data=fs.mkdtempSync('/private/tmp/ot-cli-error-live-');process.env.OPENTUTOR_DATA_DIR=data;
 const store=new TutorStore(root);store.writeKV('generated_topic:smoke-private',JSON.stringify({id:'smoke',revision:0,status:'ready',slug:'smoke-private',curriculum:{topic:'Smoke',lessons:[{lesson:1,title:'One',concepts:['one']}]},files:{}}));
 store.writeKV('web_lesson:smoke-private',JSON.stringify({id:'private-smoke',topicSlug:'smoke-private',lessonDay:1,lesson:{lesson:1,title:'One',concepts:['one']},plan:{diagnostic:'Question'},steps:['diagnostic'],step:0,history:[],assessments:[],reply:'Question'}));
 const port=await new Promise(resolve=>{const s=net.createServer().listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p))});});
 const args=version==='original'?['--import','/private/tmp/ot-cli-private-output/legacy-bootstrap.mjs','scripts/web/server.js']:['scripts/web/server.js'];
 const child=spawn(process.execPath,args,{cwd:root,env:{PATH:`/private/tmp/ot-cli-private-output/bin:${process.env.PATH}`,HOME:process.env.HOME,PRIVATE_OUTPUT_MODE:mode,OPENTUTOR_DATA_DIR:data,OPENTUTOR_PORT:String(port),OPENTUTOR_HOST:'127.0.0.1',OPENTUTOR_PASSWORD:'local-smoke-password',OPENTUTOR_LLM:'cli',OPENTUTOR_PIPELINE_LLM:'cli'},stdio:['ignore','pipe','pipe']});
 let logs='';child.stderr.on('data',d=>{logs+=d});
 try{
  await new Promise((resolve,reject)=>{child.stdout.on('data',d=>{if(String(d).includes('running at'))resolve()});child.on('exit',c=>reject(new Error(`Server exited ${c}`)))});
  const {stdout}=await execute('curl',['-sS','--max-time','10','-w','\n%{http_code}','-H','Content-Type: application/json','-H','Authorization: Bearer local-smoke-password','-d','{"topicSlug":"smoke-private","answer":"Answer","lessonId":"private-smoke","step":0}',`http://127.0.0.1:${port}/api/lesson`]);
  const split=stdout.lastIndexOf('\n');assert.equal(Number(stdout.slice(split+1)),500);assert(!stdout.includes('PRIVATE_'));
  const leaked=/PRIVATE_(?:COMPLETION|DIAGNOSTIC)_SENTINEL/.test(logs);assert.equal(leaked,version==='original');
  const {stdout:sse}=await execute('curl',['-sS','--max-time','10','-H','Content-Type: application/json','-H','Accept: text/event-stream','-H','Authorization: Bearer local-smoke-password','-d','{"topicSlug":"smoke-private","answer":"Answer","lessonId":"private-smoke","step":0}',`http://127.0.0.1:${port}/api/lesson`]);
  assert(sse.includes('event: error'));assert(!sse.includes('PRIVATE_'));
  console.log(JSON.stringify({version,outputChannel:mode,errorStatus:500,privateOutputInLogs:leaked,sseErrorVerified:true}));
 }finally{child.kill();store.close();fs.rmSync(data,{recursive:true,force:true});}
}
