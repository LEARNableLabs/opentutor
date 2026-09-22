import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { assertUserId } from './progress.js';
import { findStudent } from './students.js';

const keyFor = (id) => `student_credential:${id}`;
const digest = (token) => createHash('sha256').update(token).digest('hex');

// Tokens are bearer credentials, shown once. Only a digest is persisted.
export async function issueStudentToken(store, userId) {
  const id = assertUserId(userId);
  const student = await findStudent(store, id);
  if (!student || student.status !== 'active') throw new Error(`Student ${id} not found`);
  const token = `otst_${id}.${randomBytes(32).toString('hex')}`;
  await store.writeKV(keyFor(id), digest(token));
  return token;
}

export async function revokeStudentToken(store, userId) {
  await store.deleteKV(keyFor(assertUserId(userId)));
}

export async function authenticateStudent(store, token) {
  const match = typeof token === 'string' && token.match(/^otst_([a-z0-9][a-z0-9_-]{0,63})\.([a-f0-9]{64})$/);
  if (!match) return null;
  const id = match[1];
  const saved = await store.readKV(keyFor(id));
  if (typeof saved !== 'string' || !/^[a-f0-9]{64}$/.test(saved)) return null;
  if (!timingSafeEqual(Buffer.from(saved, 'hex'), Buffer.from(digest(token), 'hex'))) return null;
  const student = await findStudent(store, id);
  return student?.status === 'active' ? student : null;
}
