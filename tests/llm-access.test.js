import { it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { TutorStore } from '../lib/core/store.js';
import { saveKey, readKey, deleteKey } from '../lib/core/llm-access.js';

let root, store, host;
const account = () => store.forStudent('acct-11111111-1111-4111-8111-111111111111');
const other = () => store.forStudent('acct-22222222-2222-4222-8222-222222222222');

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-llm-'));
  vi.stubEnv('OPENTUTOR_DATA_DIR', '');
  vi.stubEnv('SUPABASE_SECRET_KEY', 'server-secret');
  store = new TutorStore(root);
  host = { generate: vi.fn() };
});
afterEach(() => {
  store.close();
  fs.rmSync(root, { recursive: true, force: true });
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it('seals a student key, binds it to that student, and forgets it on tampering, rotation or disconnect', async () => {
  const state = account();
  await saveKey(state, 'sk-or-student');
  const sealed = state.readKV('openrouter_key');
  expect(sealed.startsWith('v1.')).toBe(true);
  expect(sealed).not.toContain('sk-or-student');
  expect(await readKey(state)).toBe('sk-or-student');

  const theirs = other();
  theirs.writeKV('openrouter_key', sealed); // copied into another student's record
  expect(await readKey(theirs)).toBeNull();

  const [version, iv, tag, body] = sealed.split('.');
  state.writeKV('openrouter_key', [version, iv, tag, body.slice(0, -2) + (body.endsWith('AA') ? 'BB' : 'AA')].join('.'));
  expect(await readKey(state)).toBeNull();

  await saveKey(state, 'sk-or-student');
  vi.stubEnv('SUPABASE_SECRET_KEY', 'rotated-secret');
  expect(await readKey(state)).toBeNull();

  vi.stubEnv('SUPABASE_SECRET_KEY', 'server-secret');
  await deleteKey(state);
  expect(await readKey(state)).toBeNull();
});
it('is deleted with the account', async () => {
  const { ensureAccount, accountId } = await import('../lib/core/accounts.js');
  const { decommissionStudent } = await import('../lib/core/students.js');
  const user = { id: '11111111-1111-4111-8111-111111111111', email: 'a@example.test', email_confirmed_at: '2026-01-01' };
  await ensureAccount(store, user);
  await saveKey(store.forStudent(accountId(user)), 'sk-or-student');
  await decommissionStudent(store, accountId(user));
  expect(store.forStudent(accountId(user)).readKV('openrouter_key')).toBeNull();
});
