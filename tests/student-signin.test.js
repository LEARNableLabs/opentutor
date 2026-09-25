import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { TutorStore } from '../lib/core/store.js';
import { provisionStudent, decommissionStudent, listStudents } from '../lib/core/students.js';
import { issueStudentToken } from '../lib/core/student-auth.js';
import { authenticateRequest } from '../api/_lib/auth.js';
import { lessonTurn } from '../api/lesson.js';

let root, store;
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-signin-'));
  store = new TutorStore(root);
  vi.stubEnv('OPENTUTOR_PASSWORD', 'shared-password');
  vi.stubEnv('VERCEL', '1');
});
afterEach(() => { store.close(); fs.rmSync(root, { recursive: true, force: true }); vi.unstubAllEnvs(); });
const auth = (token, extra = {}) => authenticateRequest({ headers: { authorization: `Bearer ${token}`, ...extra } }, () => store);
async function student(id) {
  await provisionStudent(store, id);
  return issueStudentToken(store, id);
}

it('authenticates each token to its own student and stores only its digest', async () => {
  const alice = await student('alice');
  const bob = await student('bob');
  expect(await auth(alice)).toMatchObject({ ok: true, userId: 'alice' });
  expect(await auth(bob)).toMatchObject({ ok: true, userId: 'bob' });
  expect(await auth(alice, { 'x-user-id': 'bob' })).toMatchObject({ userId: 'alice' });
  expect(store.readKV('student_credential:alice')).not.toContain(alice);
  expect(JSON.stringify(await listStudents(store))).not.toContain(alice);
});

it('revokes the previous token on rotation and rejects forged ids', async () => {
  const old = await student('alice');
  await student('bob');
  const next = await issueStudentToken(store, 'alice');
  expect((await auth(old)).ok).toBe(false);
  expect((await auth(next)).ok).toBe(true);
  expect((await auth(next.replace('otst_alice.', 'otst_bob.'))).ok).toBe(false);
  expect((await auth('otst_../../bob.bad')).ok).toBe(false);
});

it('does not downgrade invalid credentials to anonymous use on localhost', async () => {
  vi.stubEnv('OPENTUTOR_PASSWORD', ''); vi.stubEnv('VERCEL', '');
  expect((await auth('wrong')).ok).toBe(false);
  expect((await auth('otst_alice.bad')).ok).toBe(false);
  expect(await authenticateRequest({ headers: {} }, () => store)).toMatchObject({ ok: true, userId: null });
});

it('retains the shared single-user identity without touching the registry', async () => {
  const getRoot = vi.fn();
  expect(await authenticateRequest({ headers: { authorization: 'Bearer shared-password' } }, getRoot)).toMatchObject({ ok: true, userId: null });
  expect(getRoot).not.toHaveBeenCalled();
});

it('fails closed when credential storage is unavailable', async () => {
  const token = await student('alice');
  const error = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const result = await authenticateRequest({ headers: { authorization: `Bearer ${token}` } }, async () => { throw new Error('database down'); });
    expect(result).toMatchObject({ ok: false, misconfigured: true });
  } finally { error.mockRestore(); }
});

it('reuses the SQLite connection without allowing scoped handles to close it', async () => {
  const alice = store.forStudent('alice');
  expect(alice.db).toBe(store.db);
  alice.close();
  store.writeKV('health', 'ok');
  expect(store.readKV('health')).toBe('ok');
});

it('decommissioning revokes access and removes in-flight state before id reuse', async () => {
  const token = await student('alice');
  const alice = store.forStudent('alice');
  alice.writeKV('web_lesson:math', 'private lesson');
  alice.writeUser('private profile');
  await decommissionStudent(store, 'alice');
  expect((await auth(token)).ok).toBe(false);
  const replacement = await student('alice');
  expect((await auth(token)).ok).toBe(false);
  expect((await auth(replacement)).ok).toBe(true);
  expect(store.forStudent('alice').readKV('web_lesson:math')).toBeNull();
  expect(store.forStudent('alice').readUser()).not.toContain('private profile');
});

describe('two students on the same lesson', () => {
  it('keeps profiles and active conversations separate', async () => {
    const a = await student('alice'); const b = await student('bob');
    store.writeCurriculum('math', { topic: 'Math', lessons: [{ lesson: 1, title: 'Numbers', concepts: ['counting'] }] });
    const alice = store.forStudent((await auth(a)).userId);
    const bob = store.forStudent((await auth(b)).userId);
    alice.writeUser('Alice profile'); bob.writeUser('Bob profile');
    const adapter = { generate: async () => ({ text: JSON.stringify({ diagnostic: 'How many?', goal: 'Count' }) }) };
    const ctx = (state) => ({ state, getAdapter: async () => adapter, skills: new Map() });
    await lessonTurn(ctx(alice), { topicSlug: 'math' });
    await lessonTurn(ctx(bob), { topicSlug: 'math' });
    await lessonTurn(ctx(alice), { topicSlug: 'math', answer: 'Alice answer' });
    expect(alice.readKV('web_lesson:math')).toContain('Alice answer');
    expect(bob.readKV('web_lesson:math')).not.toContain('Alice answer');
    expect(store.readKV('web_lesson:math')).toBeNull();
    expect(bob.readUser()).toBe('Bob profile');
  });
  it('rejects traversal before accessing lesson state', async () => {
    const state = { readKV: vi.fn() };
    expect((await lessonTurn({ state }, { topicSlug: '../../bob/tutor/domains/math' })).status).toBe(400);
    expect(state.readKV).not.toHaveBeenCalled();
  });
});

it('preserves existing shared passwords even if they use the student-token prefix', async () => {
  vi.stubEnv('OPENTUTOR_PASSWORD', 'otst_existing-shared-password');
  const getRoot = vi.fn();
  expect(await authenticateRequest({ headers: { authorization: 'Bearer otst_existing-shared-password' } }, getRoot)).toMatchObject({ ok: true, userId: null });
  expect(getRoot).not.toHaveBeenCalled();
});
