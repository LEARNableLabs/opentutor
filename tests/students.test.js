import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TutorState } from '../lib/core/state.js';
import { TutorStore } from '../lib/core/store.js';
import { listStudents, provisionStudent, decommissionStudent, findStudent } from '../lib/core/students.js';

// #80 — the registry of who exists on this instance.
//
// It is kept in the unnamed install's kv rather than a table, because kv is the
// one durable store all three backends share. The filesystem is not: on Vercel
// it is ephemeral, so a registry under workspace/ would vanish between requests.

let root;
beforeEach(() => { root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-students-')); });
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

const backends = [
  ['TutorState', () => new TutorState(root)],
  ['TutorStore', () => new TutorStore(root)],
];

describe.each(backends)('the student registry on %s', (_name, make) => {
  let store;
  beforeEach(() => { store = make(); });
  afterEach(() => store.close?.());

  it('starts empty', async () => {
    expect(await listStudents(store)).toEqual([]);
  });

  it('records a provisioned student', async () => {
    const created = await provisionStudent(store, 'alice', { name: 'Alice' });

    expect(created).toMatchObject({ id: 'alice', name: 'Alice', status: 'active' });
    expect(created.provisioned_at).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(await listStudents(store)).toHaveLength(1);
  });

  it('refuses a duplicate rather than silently resetting an existing student', async () => {
    await provisionStudent(store, 'alice', { name: 'Alice' });
    await expect(provisionStudent(store, 'alice', { name: 'Impostor' })).rejects.toThrow(/exists/i);
    expect((await findStudent(store, 'alice')).name).toBe('Alice');
  });

  it('rejects an id that would escape the workspace', async () => {
    await expect(provisionStudent(store, '../etc', {})).rejects.toThrow(/Invalid student id/);
    expect(await listStudents(store)).toEqual([]);
  });

  it('keeps several students and finds one by id', async () => {
    await provisionStudent(store, 'alice', { name: 'Alice' });
    await provisionStudent(store, 'bob', { name: 'Bob' });

    expect((await listStudents(store)).map((s) => s.id).sort()).toEqual(['alice', 'bob']);
    expect((await findStudent(store, 'bob')).name).toBe('Bob');
    expect(await findStudent(store, 'carol')).toBeNull();
  });

  it('decommissions a student and deletes their work', async () => {
    await provisionStudent(store, 'alice', { name: 'Alice' });

    const alice = new TutorState(root, { userId: 'alice' });
    alice.writeUser('# Student Profile\n- **Name:** Alice');
    const dir = path.join(root, 'workspace', 'students', 'alice');
    expect(fs.existsSync(dir)).toBe(true);

    await decommissionStudent(store, 'alice');

    expect(await listStudents(store)).toEqual([]);
    expect(fs.existsSync(dir), 'their workspace is gone, not orphaned').toBe(false);
  });

  it('decommissioning one student leaves the others alone', async () => {
    await provisionStudent(store, 'alice', {});
    await provisionStudent(store, 'bob', {});
    new TutorState(root, { userId: 'bob' }).writeUser('# Student Profile\n- **Name:** Bob');

    await decommissionStudent(store, 'alice');

    expect((await listStudents(store)).map((s) => s.id)).toEqual(['bob']);
    expect(new TutorState(root, { userId: 'bob' }).readUser()).toContain('Bob');
  });

  it('decommissioning someone who does not exist is an error, not a silent no-op', async () => {
    await expect(decommissionStudent(store, 'nobody')).rejects.toThrow(/not found/i);
  });

  it('never lets a traversal id reach the filesystem on delete', async () => {
    await expect(decommissionStudent(store, '../../etc')).rejects.toThrow(/Invalid student id/);
  });
});
