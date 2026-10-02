import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import net from 'node:net';
import {spawn, execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

const execute = promisify(execFile);
const fake = http.createServer((req, res) => {
  let body = '';
  req.on('data', d => { body += d; });
  req.on('end', () => {
    JSON.parse(body);
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({choices:[{message:{content:'<assessment>{"score":0.1}</assessment>\nTry again.'}}]}));
  });
});
await new Promise(r => fake.listen(0, '127.0.0.1', r));
const port = async () => new Promise(r => {
  const server = net.createServer().listen(0, '127.0.0.1', () => { const p=server.address().port;server.close(()=>r(p)); });
});
const feedback = '## Directives\n\n- **BLOCK** [critical]: blocked — BLOCK advancement until retested\n';
try {
  for (const [root, fixed] of [
    ['/Users/ggiannon/Documents/gcg/opentutor-wt-sr', false],
    ['/private/tmp/opentutor-review-329', true],
  ]) {
    const data = fs.mkdtempSync('/private/tmp/opentutor-live-review-');
    process.env.OPENTUTOR_DATA_DIR = data;
    const {TutorStore} = await import(pathToFileURL(path.join(root,'lib/core/store.js')));
    const store = new TutorStore(root);
    const curriculum = {topic:'Smoke review',lessons:[1,2,3].map(n=>({lesson:n,title:`L${n}`,concepts:[`c${n}`],module:'M'}))};
    store.writeKV('generated_topic:smoke-review',JSON.stringify({id:'smoke',revision:0,status:'ready',slug:'smoke-review',curriculum,files:{}}));
    for(let n=1;n<=3;n++)store.markLessonComplete('smoke-review',n,'correct');
    store.db.prepare("INSERT OR REPLACE INTO kv (user_id,key,value) VALUES ('','progress','invalid-json')").run();
    const p=await port();
    const child=spawn(process.execPath,['scripts/web/server.js'],{cwd:root,env:{
      PATH:process.env.PATH,HOME:process.env.HOME,OPENTUTOR_DATA_DIR:data,
      OPENTUTOR_PORT:String(p),OPENTUTOR_HOST:'127.0.0.1',OPENTUTOR_PASSWORD:'local-smoke-password',
      OPENTUTOR_LLM:'openrouter',OPENTUTOR_PIPELINE_LLM:'openrouter',OPENROUTER_API_KEY:'local-smoke-key',
      OPENROUTER_BASE_URL:`http://127.0.0.1:${fake.address().port}`,
    },stdio:['ignore','pipe','pipe']});
    try {
      await new Promise((resolve,reject)=>{child.stdout.on('data',d=>{if(String(d).includes('running at'))resolve()});child.on('exit',c=>reject(new Error(`Server exited ${c}`)))});
      const post = async body => {
        const {stdout}=await execute('curl',['-sS','--max-time','10','-w','\n%{http_code}',
          '-H','Content-Type: application/json','-H','Authorization: Bearer local-smoke-password',
          '-d',JSON.stringify(body),`http://127.0.0.1:${p}/api/lesson`]);
        const split=stdout.lastIndexOf('\n');return {status:Number(stdout.slice(split+1)),body:JSON.parse(stdout.slice(0,split))};
      };
      const failure=await post({topicSlug:'smoke-review'});
      assert.equal(failure.status,fixed?500:200);
      store.writeProgress({active_topics:[],spaced_repetition:{'smoke-review::c1':{
        topic:'smoke-review',concept:'c1',next_review:'2000-01-01',ease:2.5,interval:1,reps:0,streak:0,first_seen:'2000-01-01',
      }}});
      const reviews={concept:'blocked',day:3,count:2};
      store.writeKV('web_lesson:smoke-review',JSON.stringify({reviews}));
      store.writeDomainFile('smoke-review','practice-feedback.md',feedback);
      const first=await post({topicSlug:'smoke-review'});
      assert.equal(first.body.lesson.concepts[0],'c1');
      assert.equal(JSON.parse(store.readKV('web_lesson:smoke-review')).reviews?.count,fixed?2:undefined);
      let active=first;
      for(let i=0;i<5&&!active.body.done;i++)active=await post({topicSlug:'smoke-review',answer:'I do not know',lessonId:active.body.lessonId,step:active.body.step});
      assert.equal(active.body.done,true);
      store.writeDomainFile('smoke-review','practice-feedback.md',feedback);
      const next=await post({topicSlug:'smoke-review'});
      assert.equal(Boolean(next.body.done),fixed);
      console.log(JSON.stringify({version:fixed?'fixed':'original',progressReadFailureStatus:failure.status,blockCountAfterScheduledReview:JSON.parse(store.readKV('web_lesson:smoke-review')||'{}').reviews?.count,nextStart:next.body.done?'course complete':'extra BLOCK review'}));
      const missing=await post({topicSlug:'missing-smoke-course'});assert.equal(missing.status,404);
    } finally {child.kill();store.close();fs.rmSync(data,{recursive:true,force:true});}
  }
} finally {fake.close();}
