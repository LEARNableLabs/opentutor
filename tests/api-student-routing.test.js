import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { TutorStore } from '../lib/core/store.js';
import { provisionStudent } from '../lib/core/students.js';
import { issueStudentToken } from '../lib/core/student-auth.js';
let root, store, alice, bob;
vi.mock('../api/_lib/init.js', () => ({
  getState: async (id) => id == null ? store : store.forStudent(id),
  getAdapter: () => ({ generate: async () => ({ text: '{"diagnostic":"Why?","goal":"Learn"}' }) }),
  getSkills: () => new Map(),
}));
const routes = Object.fromEntries(await Promise.all(['user','progress','topics','chat','onboard','add-topic','lesson'].map(async (name) => [name, (await import(`../api/${name}.js`)).default])));
async function call(route, token, body) {
  const res = { status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return this; } };
  await routes[route]({ method: body ? 'POST' : 'GET', headers: { authorization: `Bearer ${token}` }, body }, res);
  return res;
}
beforeEach(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-api-users-'));
  store = new TutorStore(root);
  vi.stubEnv('OPENTUTOR_PASSWORD', 'shared');
  await provisionStudent(store,'alice'); await provisionStudent(store,'bob');
  alice=await issueStudentToken(store,'alice'); bob=await issueStudentToken(store,'bob');
  store.writeCurriculum('math',{topic:'Math',lessons:[{lesson:1,title:'Numbers',concepts:['counting']}]});
});
afterEach(() => { store.close(); fs.rmSync(root,{recursive:true,force:true}); vi.unstubAllEnvs(); });
it('routes profile and progress reads/writes to the authenticated student',async()=>{
  await call('user',alice,{name:'Alice',userId:'bob'});
  expect((await call('user',alice)).body.profile).toContain('Alice');
  expect((await call('user',bob)).body.profile).not.toContain('Alice');
  await call('add-topic',alice,{topic:'math',userId:'bob'});
  expect((await call('progress',alice)).body.active_topics).toEqual(['math']);
  expect((await call('progress',bob)).body.active_topics).toEqual([]);
  expect((await call('progress','shared')).body.active_topics).toEqual([]);
});
it('keeps hosted same-topic lessons isolated and rejects revoked credentials on every route',async()=>{
  await call('lesson',alice,{topicSlug:'math'}); await call('lesson',bob,{topicSlug:'math'});
  await call('lesson',alice,{topicSlug:'math',answer:'Alice private answer'});
  expect(store.forStudent('alice').readKV('web_lesson:math')).toContain('Alice private answer');
  expect(store.forStudent('bob').readKV('web_lesson:math')).not.toContain('Alice private answer');
  await issueStudentToken(store,'alice');
  for(const route of Object.keys(routes)) {
    const body=['user','progress','topics'].includes(route)?undefined:{topic:'math',topicSlug:'math',message:'hi'};
    expect((await call(route,alice,body)).statusCode,route).toBe(401);
  }
});
