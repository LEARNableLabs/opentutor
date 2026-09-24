import { listStudents } from './students.js';
import { readTopicBuild, runTopicBuildStep, BuildBusyError } from './topic-builds.js';
import { adapterFor } from './llm-access.js';

// Jobs live in SQLite; the timer only wakes the worker. Restarting the web
// process scans the same rows and resumes interrupted work after its lease.
export function startLocalBuildWorker({ state, adapter, skills, interval = 2000 }) {
  let timer, stopped = false;
  async function tick() {
    try {
      const ids = [null, ...(await listStudents(state)).map((s) => s.id)];
      for (const id of ids) {
        const scoped = id == null ? state : state.forStudent(id);
        for (const slug of await scoped.listGeneratedTopics()) {
          if (stopped) return;
          const doc = await readTopicBuild(scoped, slug);
          if (!doc || ['ready', 'failed'].includes(doc.status)) continue;
          try { await runTopicBuildStep({ state: scoped, getAdapter: () => adapterFor({ state: scoped, use: 'custom-topic', host: () => adapter }), skills, slug, id: doc.id, seq: doc.seq }); }
          catch (err) { if (!(err instanceof BuildBusyError)) console.error('[local-build]', err.message); }
        }
      }
    } catch (err) { console.error('[local-build]', err.message); }
    finally { if (!stopped) { timer = setTimeout(tick, interval); timer.unref(); } }
  }
  timer = setTimeout(tick, interval); timer.unref();
  return { enqueue: async () => {}, stop() { stopped = true; clearTimeout(timer); } };
}
