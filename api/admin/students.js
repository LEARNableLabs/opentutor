/**
 * Provisioning (#80) — create, list, inspect and decommission students.
 *
 *   GET    /api/admin/students          every student on this instance
 *   GET    /api/admin/students?id=alice one student's progress
 *   POST   /api/admin/students          { userId, name? }
 *   DELETE /api/admin/students?id=alice removes them and everything they wrote
 *
 * Behind OPENTUTOR_ADMIN_PASSWORD, which is deliberately not the password
 * students use — see api/_lib/admin-auth.js.
 */

import { issueStudentToken } from '../../lib/core/student-auth.js';
import { getState } from '../_lib/init.js';
import { checkAdmin, adminFailure } from '../_lib/admin-auth.js';
import { listStudents, findStudent, provisionStudent, decommissionStudent } from '../../lib/core/students.js';

const idFrom = (req) => req.query?.id ?? new URL(req.url || '/', 'http://x').searchParams.get('id');

export default async function handler(req, res) {
  const auth = checkAdmin(req);
  if (!auth.ok) {
    const { status, body } = adminFailure(auth);
    return res.status(status).json(body);
  }

  try {
    const store = await getState();
    const id = idFrom(req);

    if (req.method === 'GET') {
      if (!id) return res.status(200).json({ students: await listStudents(store) });

      const student = await findStudent(store, id);
      if (!student) return res.status(404).json({ error: `Student ${id} not found` });
      return res.status(200).json(await statsFor(store, student));
    }

    if (req.method === 'POST') {
      const { userId, name } = req.body || {};
      if (!userId) return res.status(400).json({ error: 'userId is required' });

      const student = await provisionStudent(store, userId, { name });
      return res.status(201).json({ ...student, token: await issueStudentToken(store, student.id) });
    }

    if (req.method === 'PATCH') {
      if (!id) return res.status(400).json({ error: 'id is required' });
      return res.status(200).json({ id, token: await issueStudentToken(store, id) });
    }

    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'id is required' });
      return res.status(200).json(await decommissionStudent(store, id));
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    // An invalid id and a duplicate are the caller's problem, not the server's;
    // returning 500 for either would make a typo look like an outage.
    const message = err.message || 'Provisioning failed';
    if (/Invalid student id/.test(message)) return res.status(400).json({ error: message });
    if (/already exists/i.test(message)) return res.status(409).json({ error: message });
    if (/not found/i.test(message)) return res.status(404).json({ error: message });

    console.error('[admin/students]', err);
    return res.status(500).json({ error: message });
  }
}

/** What one student has done, read through a store scoped to them. */
async function statsFor(store, student) {
  const theirs = store.forStudent(student.id);
  try {
    const progress = await theirs.readProgress();
    const active = progress?.active_topics || [];

    const topics = [];
    for (const slug of active) {
      const p = await theirs.getTopicProgress(slug);
      if (p) topics.push({ slug, ...p });
    }

    return {
      ...student,
      active_topics: active,
      topics,
      lessons_completed: topics.reduce((n, t) => n + t.completed, 0),
      last_session: progress?.history?.at(-1)?.date ?? null,
    };
  } finally {
    theirs.close?.();
  }
}
