/**
 * The registry of students on this instance (#80).
 *
 * Kept as a single kv entry on the *unnamed* store rather than in a table,
 * because kv is the one durable thing all three backends share. The filesystem
 * is not: on Vercel it is ephemeral, so a registry under workspace/ would be
 * gone by the next request. A `students` table exists in Postgres and SQLite,
 * but adding a third implementation of list/create/delete to satisfy an
 * interface only the admin routes use is more code than this is worth.
 *
 * ponytail: read-modify-write on one row, so two admins provisioning at the
 * same instant can lose one entry. Move to the `students` table if provisioning
 * ever stops being one person clicking a button.
 */

import fs from 'fs';
import { assertUserId, workspaceDir } from './progress.js';

const REGISTRY_KEY = 'students';

async function read(store) {
  const raw = await store.readKV(REGISTRY_KEY);
  if (!raw) return [];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function write(store, students) {
  // SupabaseStore stores jsonb and hands back objects; the others round-trip
  // strings. Writing a string is read back correctly by all three.
  await store.writeKV(REGISTRY_KEY, JSON.stringify(students));
}

/** Everyone provisioned on this instance, oldest first. */
export async function listStudents(store) {
  return read(store);
}

/** One student, or null. */
export async function findStudent(store, userId) {
  const id = assertUserId(userId);
  return (await read(store)).find((s) => s.id === id) || null;
}

/**
 * Register a new student. Their state is created lazily on first use — this
 * only records that they exist, and refuses to overwrite someone who already
 * does, so a repeated POST cannot silently wipe an active learner.
 */
export async function provisionStudent(store, userId, meta = {}) {
  const id = assertUserId(userId);
  const students = await read(store);

  if (students.some((s) => s.id === id)) {
    throw new Error(`Student ${id} already exists`);
  }

  const student = {
    id,
    name: meta.name || id,
    status: 'active',
    provisioned_at: new Date().toISOString(),
  };
  students.push(student);
  await write(store, students);
  return student;
}

/**
 * Remove a student and everything they wrote.
 *
 * Their rows are keyed by id and their workspace is a directory named after it,
 * so both go. The id is validated first: it is about to be handed to a recursive
 * delete, which is the last place to discover it contains `..`.
 */
export async function decommissionStudent(store, userId) {
  const id = assertUserId(userId);
  const students = await read(store);

  const remaining = students.filter((s) => s.id !== id);
  if (remaining.length === students.length) {
    throw new Error(`Student ${id} not found`);
  }

  await write(store, remaining);

  // A store is scoped at construction, not per call, so deleting their rows
  // means acting through a store that is already theirs.
  const theirs = store.forStudent(id);
  try {
    for (const key of ['progress', 'user_profile', 'students']) {
      await theirs.deleteKV(key);
    }
  } finally {
    theirs.close?.();
  }

  const dir = workspaceDir(store.root, id);
  fs.rmSync(dir, { recursive: true, force: true });

  return { id, status: 'decommissioned' };
}
