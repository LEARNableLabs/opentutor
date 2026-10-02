import http from 'node:http';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import assert from 'node:assert/strict';
const {SupabaseStore:Fixed}=await import('/private/tmp/opentutor-review-329/lib/core/supabase-store.js');
const {SupabaseStore:Original}=await import('/private/tmp/ot-cli-private-output/legacy-supabase.mjs');
const execute=promisify(execFile);
for(const [version,Store] of [['original',Original],['fixed',Fixed]]){
 const rows=[{user_id:'alice',key:'progress',value:{spaced_repetition:{},history:[]}},{user_id:'bob',key:'progress',value:{history:['private-bob']}}];
 let arrivals=0,release,conflicts=0;const gate=new Promise(r=>{release=r});
 const db=http.createServer(async(req,res)=>{
  const u=new URL(req.url,'http://local');let body='';for await(const chunk of req)body+=chunk;
  const matches=row=>[...u.searchParams].every(([k,v])=>!v.startsWith('eq.')||(k==='value'?JSON.stringify(row[k]):String(row[k]))===v.slice(3));
  if(req.method==='GET'){
   const found=structuredClone(rows.filter(matches));
   if(u.searchParams.get('key')==='eq.progress'&&arrivals<2){if(++arrivals===2)release();await gate;}
   res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify(found[0]||null));
  }else if(req.method==='PATCH'){
   const found=rows.filter(matches);if(!found.length)conflicts++;for(const row of found)Object.assign(row,JSON.parse(body));res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify(found.map(r=>({key:r.key}))));
  }else if(req.method==='POST'){
   const row=JSON.parse(body),existing=rows.find(r=>r.user_id===row.user_id&&r.key===row.key);if(existing){if(!String(req.headers.prefer).includes('ignore-duplicates'))Object.assign(existing,row);}else rows.push(row);res.writeHead(201);res.end();
  }else{res.writeHead(405);res.end();}
 });await new Promise(r=>db.listen(0,'127.0.0.1',r));
 const store=new Store('/private/tmp',{url:`http://127.0.0.1:${db.address().port}`,key:'local-test-key',userId:'alice'});
 const app=http.createServer(async(req,res)=>{try{const topic=req.url.slice(1);await store.updateProgress(p=>{p.spaced_repetition[topic]={concept:topic};p.history.push(topic)});res.writeHead(200);res.end('saved');}catch{res.writeHead(500);res.end('save failed');}});
 await new Promise(r=>app.listen(0,'127.0.0.1',r));
 try{
  const responses=await Promise.all(['a','b'].map(topic=>execute('curl',['-sS','--max-time','10','-w','\n%{http_code}','-X','POST',`http://127.0.0.1:${app.address().port}/${topic}`])));
  for(const r of responses)assert(r.stdout.endsWith('\n200'));
  const result=rows[0].value;assert.equal(Object.keys(result.spaced_repetition).length,version==='fixed'?2:1);assert.deepEqual(rows[1].value,{history:['private-bob']});
  console.log(JSON.stringify({version,bothRequestsSuccessful:true,savedTopics:Object.keys(result.spaced_repetition).sort(),casConflictsRetried:conflicts,studentIsolationVerified:true}));
 }finally{app.close();db.close();}
}
