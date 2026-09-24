import {it,expect} from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createClient} from '@supabase/supabase-js';
import {SupabaseStore} from '../lib/core/supabase-store.js';
import {prepareTopicBuild,runTopicBuildStep,readTopicBuild} from '../lib/core/topic-builds.js';

// Exercise the real Supabase/PostgREST serializer against an HTTP contract
// double. This is not a live Postgres test; it checks the wire-level filters
// on which the atomic update and student boundary depend.
it('serializes scoped atomic updates and reads generated lessons without disk writes',async()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'ot-sb-build-'));
  const rows=[];const patches=[];
  const client=createClient('https://test.supabase.co','test-key',{auth:{persistSession:false},global:{fetch:async(url,options)=>{
    const u=new URL(url);const headers=new Headers(options.headers);const method=options.method;
    if(!u.pathname.endsWith('/kv'))return Response.json([]);
    const matches=(row)=>[...u.searchParams].every(([key,value])=>{
      if(['select','on_conflict','order','offset','limit'].includes(key))return true;
      const actual=key.startsWith('value->>')?row.value[key.slice(8)]:row[key];
      if(value.startsWith('eq.'))return String(actual)===value.slice(3);
      if(value.startsWith('like.'))return String(actual).startsWith(value.slice(5).replace(/%$/,''));
      throw new Error(`Unexpected filter ${key}=${value}`);
    });
    let result;
    if(method==='POST'){
      const row=JSON.parse(options.body);const exists=rows.some(r=>r.user_id===row.user_id&&r.key===row.key);
      expect(headers.get('Prefer')).toContain('resolution=ignore-duplicates');
      if(!exists)rows.push(row);result=exists?[]:[row];
    }else if(method==='PATCH'){
      patches.push(u);result=rows.filter(matches);const updates=JSON.parse(options.body);for(const row of result)Object.assign(row,updates);
    }else{const offset=Number(u.searchParams.get('offset')??0);result=rows.filter(matches).slice(offset,offset+Number(u.searchParams.get('limit')??Infinity));}
    return Response.json(headers.get('Accept')?.includes('vnd.pgrst.object')?(result[0]??null):result);
  }}});
  try{
    fs.chmodSync(root,0o555);
    const alice=new SupabaseStore(root,{client,userId:'alice'}),bob=new SupabaseStore(root,{client,userId:'bob'});
    const {doc}=await prepareTopicBuild(alice,{topic:'Knots'});
    const duplicate=await prepareTopicBuild(alice,{topic:'Knots'});expect(duplicate.doc.id).toBe(doc.id);
    const result=await runTopicBuildStep({state:alice,adapter:{},skills:new Map(),slug:doc.slug,id:doc.id,seq:0,quickStart:async()=>({curriculum:{topic:'Knots',lessons:[{lesson:1,title:'Loops',status:'pending'}]},intro:'Hi',researchContext:'Source'})});
    expect(result.phase).toBe('plan');
    for(const url of patches){expect(url.searchParams.get('user_id')).toBe('eq.alice');expect(url.searchParams.get('value->>id')).toBe(`eq.${doc.id}`);expect(url.searchParams.has('value->>revision')).toBe(true);}
    expect(await alice.compareAndSetTopic('knots',doc,{...doc,revision:99})).toBe(false);
    const restarted=new SupabaseStore(root,{client,userId:'alice'});
    expect((await restarted.readCurriculum('knots')).lessons[0].title).toBe('Loops');
    expect(await restarted.readDomainFile('knots','research.md')).toBe('Source');
    expect(await restarted.listTopics()).toEqual(['knots']);
    expect(await restarted.listTopicProgress()).toEqual([{slug:'knots',topic:'Knots',total:1,completed:0,percent:0,current:{lesson:1,title:'Loops',status:'pending'}}]);
    expect(await readTopicBuild(bob,'knots')).toBeNull();expect(await bob.listTopics()).toEqual([]);expect(await bob.listTopicProgress()).toEqual([]);
    expect(fs.readdirSync(root)).toEqual([]);
  }finally{fs.chmodSync(root,0o755);fs.rmSync(root,{recursive:true,force:true});}
});
