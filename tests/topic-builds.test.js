import { it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { TutorStore } from '../lib/core/store.js';
import { prepareTopicBuild, readTopicBuild, runTopicBuildStep, BuildBusyError } from '../lib/core/topic-builds.js';
import { addTopic } from '../lib/core/topic-service.js';
import { generateQuickStart } from '../lib/core/quick-start.js';
let root,state;
const starter = (topic='Knots')=>({topic,lessons:Array.from({length:5},(_,i)=>({day:i+1,lesson:i+1,title:`Starter ${i+1}`,concepts:['loops'],status:'pending'}))});
const quickStart=async()=>({curriculum:starter(),intro:'Welcome',researchContext:'Verified sources'});
const adapter={generate:vi.fn(async(_s,m)=>{
  const text=m[0].content;
  if(text.startsWith('Create')||text.startsWith('Revise'))return {text:JSON.stringify({plan:'Learn the foundations'})};
  if(text.startsWith('Build'))return {text:JSON.stringify({curriculum:{topic:'Knots',lessons:[{lesson:1,title:'Advanced knots',concepts:[]}]},conceptMap:'Map'})};
  if(text.startsWith('Generate'))return {text:JSON.stringify({resources:'Resources',teacher:'Teacher'})};
  return {text:JSON.stringify({status:'APPROVED',critique:'Good'})};
})};
const step=(doc,extra={})=>runTopicBuildStep({state,adapter,skills:new Map(),slug:doc.slug,id:doc.id,seq:doc.seq,quickStart,...extra});
beforeEach(()=>{root=fs.mkdtempSync(path.join(os.tmpdir(),'ot-build-'));state=new TutorStore(root);adapter.generate.mockClear();});
afterEach(()=>{state.close();fs.rmSync(root,{recursive:true,force:true});});
it('checkpoints across restart, publishes domain assets, and preserves starter completions',async()=>{
  let {doc}=await prepareTopicBuild(state,{topic:'Knots'});doc=await step(doc);
  const original=state.readCurriculum('knots').lessons;
  state.markLessonComplete('knots',1,'high');state.close();state=new TutorStore(root);
  doc=await readTopicBuild(state,'knots');
  for(let i=0;i<3;i++)doc=await step(doc);
  expect(doc.status).toBe('ready');expect(doc.approved).toBe(true);
  const curriculum=state.readCurriculum('knots');
  expect(curriculum.lessons).toHaveLength(6);
  expect(curriculum.lessons.slice(0,5).map(l=>l.title)).toEqual(original.map(l=>l.title));
  expect(curriculum.lessons[0].status).toBe('completed');
  expect(state.readDomainFile('knots','teacher.md')).toBe('Teacher');
  expect(state.readDomainFile('knots','research.md')).toBe('Verified sources');
  expect(fs.existsSync(path.join(root,'skills/tutor/domains/knots'))).toBe(false);
});
it('only one duplicate worker claims a step, and old deliveries do no model work',async()=>{
  const {doc}=await prepareTopicBuild(state,{topic:'Knots'});
  let release;const gate=new Promise(r=>{release=r;});
  const running=step(doc,{quickStart:async()=>{await gate;return quickStart();}});
  await vi.waitFor(async()=>expect((await readTopicBuild(state,'knots')).lease).toBeTruthy());
  await expect(step(doc)).rejects.toBeInstanceOf(BuildBusyError);
  release();await running;
  const duplicate=vi.fn(quickStart);await step(doc,{quickStart:duplicate});expect(duplicate).not.toHaveBeenCalled();
});
it('fences a late result when an expired lease was recovered',async()=>{
  const {doc}=await prepareTopicBuild(state,{topic:'Knots'});let release;
  const gate=new Promise(r=>{release=r;});
  const old=step(doc,{now:()=>0,quickStart:async()=>{await gate;return {curriculum:starter('STALE'),intro:'',researchContext:''};}});
  await vi.waitFor(async()=>expect((await readTopicBuild(state,'knots')).lease).toBeTruthy());
  await step(doc,{now:()=>200000});release();await old;
  expect(state.readCurriculum('knots').topic).toBe('Knots');
});
it('cannot resurrect content after deletion and recreation',async()=>{
  const {doc}=await prepareTopicBuild(state,{topic:'Knots'});let release;
  const gate=new Promise(r=>{release=r;});
  const old=step(doc,{quickStart:async()=>{await gate;return quickStart();}});
  await vi.waitFor(async()=>expect((await readTopicBuild(state,'knots')).lease).toBeTruthy());
  state.deleteKV('generated_topic:knots');const replacement=await prepareTopicBuild(state,{topic:'Knots'});
  release();await old;
  expect((await readTopicBuild(state,'knots')).id).toBe(replacement.doc.id);
  expect(state.readCurriculum('knots')).toBeNull();expect(state.readProgress().active_topics).toEqual([]);
});
it('retains starter lessons on repeated Phase B failure and resumes the saved phase on retry',async()=>{
  let {doc}=await prepareTopicBuild(state,{topic:'Knots'});doc=await step(doc);
  const broken={generate:async()=>{throw new Error('offline');}};
  for(let i=0;i<3;i++){await expect(step(doc,{adapter:broken})).rejects.toThrow('offline');doc=await readTopicBuild(state,'knots');}
  expect(doc.status).toBe('failed');expect(state.readCurriculum('knots').lessons).toHaveLength(5);
  const retried=await prepareTopicBuild(state,{topic:'Knots'});
  expect(retried.doc).toMatchObject({phase:'plan',attempts:0,status:'queued',seq:doc.seq+1});
  expect((await step(retried.doc)).phase).toBe('build');
});
it('scopes same-slug generated topics and files to each student',async()=>{
  const alice=state.forStudent('alice'),bob=state.forStudent('bob');
  for(const scoped of [alice,bob]){
    const {doc}=await prepareTopicBuild(scoped,{topic:'Knots'});
    await step(doc,{state:scoped,quickStart:async()=>({curriculum:starter(scoped.userId),intro:'',researchContext:scoped.userId})});
  }
  expect(alice.readCurriculum('knots').topic).toBe('alice');expect(bob.readDomainFile('knots','research.md')).toBe('bob');
  expect(state.readCurriculum('knots')).toBeNull();
});
it('accepts the durable job before beginning quick generation',async()=>{
  let accepted=false;
  await addTopic({state,adapter,skills:new Map(),enqueue:async()=>{accepted=true;},quickStart:async()=>{expect(accepted).toBe(true);return quickStart();}},{topic:'Knots'});
});
it('bounds slow research independently and still produces starters',async()=>{
  const model={generate:vi.fn(async()=>({text:JSON.stringify({taster:'Intro',roadmap:'Plan',quickCurriculum:starter().lessons})}))};
  const result=await generateQuickStart({adapter:model,skills:new Map(),topic:'Knots',slug:'knots',researchTimeout:5,research:()=>new Promise(()=>{}),wikipedia:()=>new Promise(()=>{})});
  expect(result.curriculum.lessons).toHaveLength(5);expect(model.generate).toHaveBeenCalledOnce();
});
it.each([null,{}, {topic:'!!!'}])('rejects invalid payload %j',async(payload)=>{
  await expect(prepareTopicBuild(state,payload)).rejects.toThrow(/topic name|Invalid topic slug/);
});

it('records adapter construction errors as bounded worker failures',async()=>{
  const {doc}=await prepareTopicBuild(state,{topic:'Knots'});
  await expect(step(doc,{adapter:null,getAdapter:()=>{throw new Error('invalid backend');}})).rejects.toThrow('invalid backend');
  expect(await readTopicBuild(state,'knots')).toMatchObject({attempts:1,status:'queued',lease:null});
});

it('refuses a new custom topic before recording any build, but still activates a shipped one', async () => {
  const { KeyRequired } = await import('../lib/core/llm-access.js');
  const refuse = async () => { throw new KeyRequired('custom_topic'); };
  const enqueue = vi.fn();
  await expect(addTopic({ state, getAdapter: refuse, skills: new Map(), enqueue, quickStart }, { topic: 'Knots' })).rejects.toThrow(KeyRequired);
  expect(await readTopicBuild(state, 'knots')).toBeNull();
  expect(enqueue).not.toHaveBeenCalled();
  state.writeCurriculum('math', { lessons: [{ lesson: 1, title: 'Numbers' }] });
  expect(await addTopic({ state, getAdapter: refuse, skills: new Map(), enqueue, quickStart }, { topic: 'Math' }))
    .toEqual({ slug: 'math', status: 'existing', lessonCount: 1 });
});

it('fails a build at once, with the reason, when its student may no longer build', async () => {
  const { KeyRequired } = await import('../lib/core/llm-access.js');
  const { doc } = await prepareTopicBuild(state, { topic: 'Knots' });
  const after = await runTopicBuildStep({
    state, getAdapter: async () => { throw new KeyRequired('reconnect'); },
    skills: new Map(), slug: doc.slug, id: doc.id, seq: doc.seq, quickStart,
  });
  expect(after.status).toBe('failed');
  expect(after.error).toMatch(/connect your account again/i);
});
