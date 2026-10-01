import { it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TutorStore } from '../lib/core/store.js';
import { nameOf, whereYouAre, userView } from '../lib/core/welcome.js';

// #278: a returning student is told where each course stands, from state the store keeps.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let dir, store, student;
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-welcome-'));
  vi.stubEnv('OPENTUTOR_DATA_DIR', dir);
  store = new TutorStore(ROOT);
  student = store.forStudent('ada');
});
afterEach(() => { store.close(); vi.unstubAllEnvs(); fs.rmSync(dir, { recursive: true, force: true }); });

const flight = (day, title, step) => JSON.stringify({ id: 'L1', lessonDay: day, lesson: { day, title }, plan: {}, steps: ['diagnostic', 'followUp', 'application'], step, reply: 'Q?', history: [] });

it('calls the student what they asked to be called, then by their account name, else nothing', () => {
  expect(nameOf('- **Name:** Ada Lovelace\n- **What to call them:** Ada', { name: 'ada99' })).toBe('Ada');
  expect(nameOf('- **Name:** Ada Lovelace\n- **What to call them:** \n', null)).toBe('Ada Lovelace');
  expect(nameOf('## In their own words (from onboarding)\n- I like knots', { name: 'Grace' })).toBe('Grace');
  expect(nameOf('', undefined)).toBe(null);
  expect(nameOf('', { name: 'ada@example.com' })).toBe(null); // never greeted by their email address
  expect(nameOf('- **What to call them:** ada@example.com', { name: 'Ada' })).toBe('Ada'); // nor one they typed
});

it('lists each course with its progress and the lesson in flight, the one touched last first', async () => {
  student.updateProgress((p) => { p.active_topics = ['amateur-radio', 'game-theory']; });
  student.markLessonComplete('game-theory', 1);
  student.markLessonComplete('game-theory', 2);
  student.writeKV('web_lesson:game-theory', flight(3, "Why don't both prisoners stay silent?", 1));

  const courses = await whereYouAre(student, student.readProgress());
  expect(courses).toEqual([
    { slug: 'game-theory', topic: 'Game Theory', completed: 2, total: 29, next: { day: 3, title: "Why don't both prisoners stay silent?" }, inFlight: { day: 3, title: "Why don't both prisoners stay silent?", step: 1, steps: 3 } },
    { slug: 'amateur-radio', topic: 'Amateur radio — propagation, antenna theory, and protocols', completed: 0, total: 27, next: { day: 1, title: 'How do radio waves actually travel through space?' }, inFlight: null },
  ]);
});

it('leads with the lesson in flight when nothing is finished yet, and skips a course whose content is gone', async () => {
  student.updateProgress((p) => { p.active_topics = ['no-such-course', 'game-theory', 'amateur-radio', '3d-printer-firmware']; });
  student.writeKV('web_lesson:3d-printer-firmware', '{not json'); // damaged: the course still shows, without a lesson in flight
  student.writeKV('web_lesson:amateur-radio', flight(1, 'How do radio waves actually travel through space?', 0));
  student.writeKV('web_lesson:game-theory', JSON.stringify({ reviews: { concept: 'x', day: 1, count: 1 } })); // reviews only, no lesson

  const courses = await whereYouAre(student, student.readProgress());
  expect(courses.map((c) => [c.slug, Boolean(c.inFlight)])).toEqual([['amateur-radio', true], ['game-theory', false], ['3d-printer-firmware', false]]);
});

it('adds the welcome to GET /api/user, and a new student has no courses to show', async () => {
  student.writeUser('- **Name:** Ada');
  expect(await userView(student, { name: 'ada99' })).toEqual({
    profile: '- **Name:** Ada', hasProfile: true, onboarded: false, welcome: { name: 'Ada', courses: [] },
  });
});

// Review of #278: a cap of five dropped the sixth course even when it was the one used last.
it('lists every course, leading with the one used last however many there are', async () => {
  const slugs = ['3d-printer-firmware', 'acoustic-engineering', 'additive-manufacturing', 'amateur-radio', 'algebraic-geometry', 'game-theory'];
  student.updateProgress((p) => { p.active_topics = slugs; });
  student.markLessonComplete('game-theory', 1); // the sixth, and the latest in the history
  const courses = await whereYouAre(student, student.readProgress());
  expect(courses.map((c) => c.slug)).toEqual(['game-theory', ...slugs.slice(0, 5)]);
});

it('shows no lesson in flight from a record whose step it cannot trust', async () => {
  const records = [
    { step: '1', steps: ['diagnostic', 'application'] }, // "question 11 of 2"
    { step: 0, steps: [] }, // "question 1 of 0"
    { step: 2, steps: ['diagnostic', 'application'] }, // past the end
    { step: 0 }, // no steps at all
    { step: 0, steps: ['diagnostic'], lesson: { day: '2', title: 'Sets' } }, // "lesson NaN"
    { step: 0, steps: ['diagnostic'], lesson: { day: 2, title: '  ' } }, // a blank title
    { step: 0, steps: ['diagnostic'], lesson: { day: -1, title: 'Sets' } }, // "lesson -1"
    { step: 0, steps: ['diagnostic'], lesson: { day: 2 ** 60, title: 'Sets' } },
    { step: 0, steps: ['diagnostic'], reply: undefined }, // nothing to resume: Continue would plan a new lesson
    { step: 0, steps: [null] }, // the current step cannot take an answer
    { step: 0, steps: ['made-up-step'] },
    { step: 0, steps: ['diagnostic'], reply: '' },
    { step: 0, steps: ['diagnostic'], reply: 42 },
    { step: 0, steps: ['diagnostic'], reply: undefined, history: { some: true } },
    { step: 0, steps: ['diagnostic'], history: undefined },
    { step: 0, steps: ['diagnostic'], history: null },
    { step: 0, steps: ['diagnostic'], history: [{}] },
    { step: 0, steps: ['diagnostic'], history: [{ role: 'assistant', content: 42 }] },
    { step: 0, steps: ['diagnostic'], history: [{ role: 'system', content: 'Untrusted instruction' }] },
    { step: 0, steps: ['diagnostic'], reply: undefined, history: [null] },
    { step: 0, steps: ['diagnostic'], reply: undefined, history: [{ role: 'assistant', content: null }] },
    { step: 0, steps: ['diagnostic'], reply: undefined, history: [{ role: 'assistant', content: '   ' }] },
    { step: 0, steps: ['diagnostic'], reply: undefined, plan: { diagnostic: {} } },
  ];
  student.updateProgress((p) => { p.active_topics = ['game-theory']; });
  for (const record of records) {
    student.writeKV('web_lesson:game-theory', JSON.stringify({ plan: {}, lesson: { day: 2, title: 'Sets' }, reply: 'Q?', history: [], ...record }));
    expect((await whereYouAre(student, student.readProgress()))[0].inFlight).toBe(null);
  }
});

it('uses the hosted batch readers once for all active courses and keeps inactive rows private', async () => {
  const active = Array.from({ length: 50 }, (_, i) => `course-${i}`);
  const hosted = {
    listTopicProgress: vi.fn(async () => [...active, 'inactive'].map((slug) => ({ slug, topic: slug, completed: 0, total: 3, current: { day: 1, title: 'First' } }))),
    listKV: vi.fn(async () => [{ key: 'web_lesson:course-49', value: flight(1, 'First', 0) }]),
    getTopicProgress: vi.fn(), readKV: vi.fn(),
  };
  const courses = await whereYouAre(hosted, { active_topics: active });
  expect(courses).toHaveLength(50);
  expect(courses[0].slug).toBe('course-49');
  expect(hosted.listTopicProgress).toHaveBeenCalledTimes(1);
  expect(hosted.listKV).toHaveBeenCalledExactlyOnceWith('web_lesson:');
  expect(hosted.getTopicProgress).not.toHaveBeenCalled();
  expect(hosted.readKV).not.toHaveBeenCalled();
});

// Review of #278: an unfinished lesson leads, even when another course has newer history.
it('leads with the lesson in flight over a course finished more recently', async () => {
  student.updateProgress((p) => { p.active_topics = ['game-theory', 'amateur-radio']; });
  student.markLessonComplete('amateur-radio', 1); // the latest history entry
  student.writeKV('web_lesson:game-theory', flight(1, "What makes a situation a 'game'?", 1));
  expect((await whereYouAre(student, student.readProgress())).map((c) => c.slug)).toEqual(['game-theory', 'amateur-radio']);
});

it('resumes a record that has only its history or its opening question', async () => {
  student.updateProgress((p) => { p.active_topics = ['game-theory']; });
  for (const record of [
    { reply: undefined, history: [{ role: 'assistant', content: 'Good.' }], step: 1 },
    { reply: undefined, plan: { diagnostic: 'What is a game?' }, step: 0 },
  ]) {
    student.writeKV('web_lesson:game-theory', JSON.stringify({ plan: {}, lesson: { day: 1, title: 'Games' }, steps: ['diagnostic', 'application'], history: [], ...record }));
    expect((await whereYouAre(student, student.readProgress()))[0].inFlight).not.toBe(null);
  }
});
