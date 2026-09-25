import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TutorState } from '../lib/core/state.js';

// #80 — the provisioning route. It creates and destroys students, so the tests
// that matter most are the ones about who is allowed to call it.

let root, store;

vi.mock('../api/_lib/init.js', () => ({
  getState: async () => store,
  getAdapter: () => ({ generate: async () => ({ text: '' }) }),
  getSkills: () => new Map(),
}));

const handler = (await import('../api/admin/students.js')).default;

const res = () => {
  const r = { statusCode: null, body: null };
  r.status = (c) => { r.statusCode = c; return r; };
  r.json = (b) => { r.body = b; return r; };
  r.end = () => r;
  return r;
};

const ADMIN = { authorization: 'Bearer admin-secret' };
const call = async (req) => { const r = res(); await handler(req, r); return r; };

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-admin-'));
  store = new TutorState(root);
  vi.stubEnv('OPENTUTOR_ADMIN_PASSWORD', 'admin-secret');
  vi.stubEnv('OPENTUTOR_PASSWORD', 'student-secret');
});
afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('who may provision', () => {
  it('turns away a request with no credentials', async () => {
    const r = await call({ method: 'GET', headers: {} });
    expect(r.statusCode).toBe(401);
  });

  it('turns away a student holding the ordinary password', async () => {
    const r = await call({ method: 'POST', headers: { authorization: 'Bearer student-secret' }, body: { userId: 'mallory' } });
    expect(r.statusCode).toBe(401);
    expect(await new TutorState(root).readKV('students')).toBeNull();
  });

  it('refuses outright when no admin password is configured', async () => {
    vi.stubEnv('OPENTUTOR_ADMIN_PASSWORD', '');
    const r = await call({ method: 'GET', headers: ADMIN });
    expect(r.statusCode).toBe(503);
  });

  it('lets the admin in', async () => {
    const r = await call({ method: 'GET', headers: ADMIN });
    expect(r.statusCode).toBe(200);
    expect(r.body).toEqual({ students: [] });
  });
});

describe('provisioning', () => {
  it('creates a student and lists them afterwards', async () => {
    const created = await call({ method: 'POST', headers: ADMIN, body: { userId: 'alice', name: 'Alice' } });
    expect(created.statusCode).toBe(201);
    expect(created.body).toMatchObject({ id: 'alice', name: 'Alice', status: 'active' });

    const listed = await call({ method: 'GET', headers: ADMIN });
    expect(listed.body.students.map((s) => s.id)).toEqual(['alice']);
  });

  it('rejects a bad id with 400, not 500', async () => {
    const r = await call({ method: 'POST', headers: ADMIN, body: { userId: '../etc/passwd' } });
    expect(r.statusCode).toBe(400);
    expect(r.body.error).toMatch(/Invalid student id/);
  });

  it('rejects a duplicate with 409 rather than resetting the existing student', async () => {
    await call({ method: 'POST', headers: ADMIN, body: { userId: 'alice', name: 'Alice' } });
    const again = await call({ method: 'POST', headers: ADMIN, body: { userId: 'alice', name: 'Impostor' } });

    expect(again.statusCode).toBe(409);
    const listed = await call({ method: 'GET', headers: ADMIN });
    expect(listed.body.students[0].name).toBe('Alice');
  });

  it('requires a userId', async () => {
    const r = await call({ method: 'POST', headers: ADMIN, body: {} });
    expect(r.statusCode).toBe(400);
  });
});

describe('decommissioning', () => {
  beforeEach(async () => {
    await call({ method: 'POST', headers: ADMIN, body: { userId: 'alice', name: 'Alice' } });
    new TutorState(root, { userId: 'alice' }).writeUser('# Student Profile\n- **Name:** Alice');
  });

  it('removes the student and their work', async () => {
    const r = await call({ method: 'DELETE', headers: ADMIN, query: { id: 'alice' } });

    expect(r.statusCode).toBe(200);
    expect(fs.existsSync(path.join(root, 'workspace', 'students', 'alice'))).toBe(false);
    expect((await call({ method: 'GET', headers: ADMIN })).body.students).toEqual([]);
  });

  it('404s on someone who does not exist, rather than reporting success', async () => {
    expect((await call({ method: 'DELETE', headers: ADMIN, query: { id: 'nobody' } })).statusCode).toBe(404);
  });

  it('refuses a traversal id with 400 before it reaches a recursive delete', async () => {
    const r = await call({ method: 'DELETE', headers: ADMIN, query: { id: '../../etc' } });
    expect(r.statusCode).toBe(400);
  });

  it('cannot be called by a student', async () => {
    const r = await call({ method: 'DELETE', headers: { authorization: 'Bearer student-secret' }, query: { id: 'alice' } });
    expect(r.statusCode).toBe(401);
    expect(fs.existsSync(path.join(root, 'workspace', 'students', 'alice'))).toBe(true);
  });
});

describe('per-student stats', () => {
  it('reports what one student has done', async () => {
    await call({ method: 'POST', headers: ADMIN, body: { userId: 'alice' } });
    const alice = new TutorState(root, { userId: 'alice' });
    alice.writeCurriculum('knot-theory', { topic: 'Knot theory', lessons: [{ lesson: 1, title: 'A' }, { lesson: 2, title: 'B' }] });
    alice.writeProgress({ active_topics: ['knot-theory'], schedule: {}, history: [] });
    alice.markLessonComplete('knot-theory', 1, 'engaged');

    const r = await call({ method: 'GET', headers: ADMIN, query: { id: 'alice' } });

    expect(r.statusCode).toBe(200);
    expect(r.body).toMatchObject({ id: 'alice', active_topics: ['knot-theory'] });
    expect(r.body.topics[0]).toMatchObject({ slug: 'knot-theory', completed: 1, total: 2 });
  });

  it('404s for a student who was never provisioned', async () => {
    expect((await call({ method: 'GET', headers: ADMIN, query: { id: 'ghost' } })).statusCode).toBe(404);
  });

  it('keeps upstream error text out of a failed read (#144)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await call({ method: 'POST', headers: ADMIN, body: { userId: 'alice' } });
    store.forStudent = () => ({ readProgress: async () => { throw new Error('relation "kv" does not exist'); } });

    const r = await call({ method: 'GET', headers: ADMIN, query: { id: 'alice' } });
    expect(r.statusCode).toBe(500);
    expect(JSON.stringify(r.body)).not.toMatch(/relation|kv/);
  });
});

describe('unsupported methods', () => {
  it('405s rather than falling through', async () => {
    expect((await call({ method: 'PUT', headers: ADMIN })).statusCode).toBe(405);
  });
});
