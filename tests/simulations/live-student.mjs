#!/usr/bin/env node
/**
 * End-to-end trajectory check with a *real* student on the other side.
 *
 *   Tutor   — the shipped product, whatever OPENTUTOR_LLM points at
 *             (DeepSeek Flash via OpenRouter, per the project's model policy).
 *   Student — `claude -p`, role-playing one of the personas in students.js.
 *
 * The Claude CLI is used ONLY here, to play the student. The product itself
 * never calls it. That separation is deliberate: it keeps the thing under test
 * and the thing testing it on different models.
 *
 * Nothing touches the repo — each run gets a temp copy of the domain, so
 * completion state and learning.md land in a throwaway directory.
 *
 * Usage:
 *   node tests/simulations/live-student.mjs                 # one lesson, alex
 *   node tests/simulations/live-student.mjs --student=yuki --lessons=2
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { STUDENTS, STUDENT_LIST } from './students.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : fallback;
};

const studentKey = arg('student', 'alex');
const lessonCount = Number(arg('lessons', 1));
if (!STUDENTS[studentKey]) {
  console.error(`Unknown student "${studentKey}". Try: ${STUDENT_LIST.join(', ')}`);
  process.exit(1);
}

const { TutorStore } = await import(`${ROOT}/lib/core/store.js`);
const { createAdapterFromEnv, createAdapter } = await import(`${ROOT}/lib/adapters/index.js`);
const { lessonTurn } = await import(`${ROOT}/api/lesson.js`);

const student = STUDENTS[studentKey];
const SLUG = student.slug;

// Temp workspace: a copy of the domain, so the repo is never written to.
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'opentutor-live-'));
fs.cpSync(path.join(ROOT, 'skills/tutor/domains', SLUG), path.join(root, 'skills/tutor/domains', SLUG), { recursive: true });
fs.mkdirSync(path.join(root, 'workspace/tutor'), { recursive: true });
fs.writeFileSync(path.join(root, 'workspace/USER.md'), student.profile);

const skills = new Map();
for (const [key, file] of [
  ['teaching-method', 'references/teaching-method.md'],
  ['lesson-delivery', 'references/lesson-delivery.md'],
  ['curriculum-format', 'references/curriculum-format.md'],
]) {
  try { skills.set(key, fs.readFileSync(path.join(ROOT, 'skills/tutor', file), 'utf8')); } catch { /* optional */ }
}

const state = new TutorStore(root);
const tutor = createAdapterFromEnv();
const studentLLM = createAdapter('claude-cli');   // the ONLY use of claude -p

const STUDENT_BRIEF = `You are role-playing a student in a one-to-one tutoring session. Stay in character.

${student.profile}

Rules:
- Answer as this student would: their level, their pace, their tone.
- You are LEARNING. Do not answer like an expert. It is fine — expected — to be partly wrong, to guess, or to say you are not sure.
- Keep answers to 1-2 sentences, the way someone types in a chat.
- Never break character, never mention that you are an AI, never comment on the exercise.
- Reply with the answer only. No preamble.`;

const wrap = (s, indent = '    ') => String(s).replace(/(.{1,92})(\s+|$)/g, `${indent}$1\n`).trimEnd();

console.log(`student   ${student.name} (${studentKey}) — ${SLUG}`);
console.log(`tutor     ${tutor.name} · ${tutor.cheapModel || 'default'}`);
console.log(`student LLM  ${studentLLM.name} (claude -p)`);
console.log(`workspace ${root.replace(os.tmpdir(), '$TMP')}\n`);

let turns = 0;
let failures = 0;

for (let n = 1; n <= lessonCount; n++) {
  const start = await lessonTurn({ state, adapter: tutor, skills }, { topicSlug: SLUG });
  if (start.body.done) { console.log('  curriculum complete'); break; }
  if (start.body.error) { console.log(`  FAILED to start: ${start.body.error}`); failures++; break; }

  console.log(`── Lesson ${n}: ${start.body.lesson.title}`);
  console.log(`\n  TUTOR:\n${wrap(start.body.reply)}`);

  const history = [{ role: 'assistant', content: start.body.reply }];
  let turn = start;

  while (!turn.body.done) {
    const { text: answer } = await studentLLM.generate(STUDENT_BRIEF, history, { model: 'cheap' });
    const said = answer.trim();
    console.log(`\n  ${student.name.toUpperCase()}:\n${wrap(said)}`);
    history.push({ role: 'user', content: said });
    turns++;

    turn = await lessonTurn({ state, adapter: tutor, skills }, { topicSlug: SLUG, answer: said });
    if (turn.body.error) { console.log(`  FAILED: ${turn.body.error}`); failures++; break; }
    console.log(`\n  TUTOR (step ${turn.body.step}/${turn.body.totalSteps}${turn.body.done ? ', done' : ''}):\n${wrap(turn.body.reply)}`);
    history.push({ role: 'assistant', content: turn.body.reply });

    if (/<assessment>/.test(turn.body.reply)) { console.log('  FAILED: hidden assessment leaked to the student'); failures++; }
    if (history.length > 20) break;   // safety valve
  }
  console.log('');
}

const learning = (() => {
  try { return fs.readFileSync(path.join(root, 'skills/tutor/domains', SLUG, 'learning.md'), 'utf8'); } catch { return ''; }
})();
const line = (label) => learning.split('\n').find((l) => l.includes(label))?.trim() || '(none)';

console.log('── After the session');
console.log(`  ${line('**Engagement:**')}`);
console.log(`  ${line('**Step scores:**')}`);
console.log(`  ${line('**Progress:**')}`);
console.log(`  next lesson: ${state.getNextLesson(SLUG)?.title || 'curriculum complete'}`);
console.log(`\n  ${turns} student turns, ${failures} failure(s)`);

state.close();
fs.rmSync(root, { recursive: true, force: true });
process.exit(failures ? 1 : 0);
