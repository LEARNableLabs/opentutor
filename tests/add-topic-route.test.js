import { it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { TutorStore } from '../lib/core/store.js';
let state, root;
const getState = vi.fn(async () => state);
const getPipelineAdapter = vi.fn(() => ({}));
const enqueue = vi.fn(async () => {});
vi.mock('../api/_lib/init.js', () => ({ getState: (...a) => getState(...a), getPipelineAdapter: () => getPipelineAdapter(), getSkills: () => new Map() }));
vi.mock('../api/_lib/topic-queue.js', () => ({ enqueueTopicBuild: (...a) => enqueue(...a) }));
vi.mock('../lib/core/quick-start.js', () => ({ generateQuickStart: async ({ topic, slug }) => ({ curriculum: { topic, slug, lessons: Array.from({length:5},(_,i)=>({lesson:i+1,title:`Starter ${i+1}`})) }, intro:'Start here', researchContext:'' }) }));
const handler = (await import('../api/add-topic.js')).default;
async function call(body, overrides = {}) {
  const res = { status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return this; } };
  await handler({ method:'POST',headers:{authorization:'Bearer test-password'},body,...overrides },res); return res;
}
beforeEach(() => {
  vi.stubEnv('VERCEL','1'); vi.stubEnv('OPENTUTOR_PASSWORD','test-password'); vi.clearAllMocks();
  root=fs.mkdtempSync(path.join(os.tmpdir(),'ot-add-')); state=new TutorStore(root);
});
afterEach(()=>{state.close();fs.rmSync(root,{recursive:true,force:true});vi.unstubAllEnvs();});
it('publishes five durable starter lessons and schedules the continuation',async()=>{
  const res=await call({topic:'Knot Theory'});
  expect(res.statusCode).toBe(200);expect(res.body).toMatchObject({slug:'knot-theory',status:'queued',phase:'plan',lessonCount:5});
  expect(enqueue.mock.calls.map(([m])=>m.seq)).toEqual([0,1]);
  expect(state.readProgress().active_topics).toEqual(['knot-theory']);
  expect(state.readCurriculum('knot-theory').lessons).toHaveLength(5);
});
it('does not create a phantom active topic if queue acceptance fails',async()=>{
  enqueue.mockRejectedValueOnce(new Error('queue offline'));
  expect((await call({topic:'Knot Theory'})).statusCode).toBe(503);
  expect(state.readProgress().active_topics).toEqual([]);expect(state.readCurriculum('knot-theory')).toBeNull();
  expect(getPipelineAdapter).toHaveBeenCalledOnce();
});
it('activates existing topics without a build adapter, preserving progress and avoiding duplicates',async()=>{
  state.writeCurriculum('math',{lessons:[{lesson:1,title:'Numbers'}]});
  getPipelineAdapter.mockImplementationOnce(()=>{throw new Error('invalid backend');});
  expect((await call({topic:'Math'})).body).toEqual({slug:'math',status:'existing',lessonCount:1});
  await call({topic:'Math'});expect(state.readProgress().active_topics).toEqual(['math']);
  expect(getPipelineAdapter).not.toHaveBeenCalled();expect(enqueue).not.toHaveBeenCalled();
  getPipelineAdapter.mockReset().mockReturnValue({});
});
it.each([undefined,null,{}, {topic:42},{topic:''},{topic:'   '},{topic:'!!!'},{topic:'Math',level:'nope'}])('rejects invalid input before storage: %j',async(body)=>{
  expect((await call(body)).statusCode).toBe(400);expect(getState).not.toHaveBeenCalled();
});
it('rejects unauthenticated and unsupported requests',async()=>{
  expect((await call({topic:'Math'},{headers:{}})).statusCode).toBe(401);
  expect((await call({},{method:'GET'})).statusCode).toBe(405);expect(getState).not.toHaveBeenCalled();
});
