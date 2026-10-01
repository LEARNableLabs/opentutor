import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TutorStore } from '../lib/core/store.js';
import { streakDays, progressView } from '../lib/core/progress-stats.js';

// #292: the bot's /progress showed a streak and each topic's numbers, the web showed none of
// them, and the local server and the Vercel route answered GET /api/progress differently.

// The bot's own state, in a directory of its own: the comparison below reads the very files the bot does.
const BOT = vi.hoisted(() => `${process.env.TMPDIR || '/tmp'}/ot-progress-stats-${process.pid}`);
vi.mock('../scripts/bot/config.js', () => ({
  PATHS: { workspace: `${BOT}/workspace`, domains: `${BOT}/domains`, progress: `${BOT}/workspace/tutor/progress.json`, user: `${BOT}/workspace/USER.md`, memory: `${BOT}/workspace/memory` },
}));
vi.mock('../scripts/bot/lesson.js', () => ({ deliverNextLesson: vi.fn() }));
vi.mock('../scripts/bot/quiz.js', () => ({ generateQuiz: vi.fn() }));
vi.mock('../scripts/bot/scheduler.js', () => ({ startScheduler: vi.fn(), stopScheduler: vi.fn() }));
vi.mock('../scripts/bot/curriculum.js', () => ({ generateAndRegisterTopic: vi.fn() }));
vi.mock('../scripts/bot/logger.js', () => ({ log: { info: vi.fn(), debug: vi.fn(), error: vi.fn(), warn: vi.fn() } }));

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NOW = Date.parse('2026-10-01T12:00:00Z');
const daysAgo = (n, from = NOW) => new Date(from - n * 86_400_000).toISOString().slice(0, 10);
const lessonsOn = (...dates) => dates.map((date, i) => ({ date, topic: 'game-theory', lesson: i + 1, engagement: 'engaged' }));

// Two graded lessons of the shipped game theory course: lesson 1 right, lesson 2 wrong, then a
// retest passed on one of lesson 2's concepts (#227), and a learning log of ✓ ✓ ✗.
const LEARNING = '## Accuracy Trend\n- **Last 5:** ✓ ✓ ✗\n';
const FEEDBACK = '# Practice Feedback: Game theory\n\n## Retested\n- payoff matrix — passed after 2 lessons\n';
async function twoLessons(state, earlier = []) {
  await state.writeProgress({ active_topics: ['game-theory'], schedule: {}, history: earlier });
  await state.markLessonComplete('game-theory', 1, 'correct');
  await state.markLessonComplete('game-theory', 2, 'incorrect');
  await state.writeDomainFile('game-theory', 'learning.md', LEARNING);
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('streakDays', () => {
  it('has no streak to show for an empty or a broken history', () => {
    expect(streakDays([], NOW)).toBe(0);
    expect(streakDays(undefined, NOW)).toBe(0);
    expect(streakDays(lessonsOn(daysAgo(2), daysAgo(3)), NOW)).toBe(0);
  });

  it('counts days in a row up to today, or up to yesterday while today is still open', () => {
    expect(streakDays(lessonsOn(daysAgo(0)), NOW)).toBe(1);
    expect(streakDays(lessonsOn(daysAgo(3), daysAgo(2), daysAgo(1)), NOW)).toBe(3);
    // Two lessons on one day count once, and a missed day ends the run.
    expect(streakDays(lessonsOn(daysAgo(3), daysAgo(1), daysAgo(0), daysAgo(0)), NOW)).toBe(2);
  });

  it('turns the day over at midnight UTC, the clock history dates are written in', () => {
    const history = lessonsOn('2026-09-29', '2026-09-30');
    expect(streakDays(history, Date.parse('2026-10-01T23:59:59.999Z'))).toBe(2);
    expect(streakDays(history, Date.parse('2026-10-02T00:00:00.000Z'))).toBe(0);
    expect(streakDays(lessonsOn('2026-09-30', '2026-10-01'), Date.parse('2026-10-01T00:00:00.000Z'))).toBe(2);
    expect(streakDays(lessonsOn('2026-10-01'), Date.parse('2026-09-30T23:59:59.999Z'))).toBe(0); // not yet
  });
});

describe('progressView', () => {
  let dataDir, store;
  beforeEach(() => {
    dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-progress-stats-'));
    vi.stubEnv('OPENTUTOR_DATA_DIR', dataDir);
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOW);
    store = new TutorStore(ROOT);
  });
  afterEach(() => {
    store.close();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it('gives a student with no progress yet no streak, no lessons and no topics', async () => {
    const view = await progressView(store.forStudent('newcomer'));
    expect(view).toMatchObject({ active_topics: [], history: [], streak: 0, lessonsThisWeek: 0, topics: [] });
  });

  it('gives each active topic its completion, recent accuracy, and the concepts mastered and due', async () => {
    await twoLessons(store, lessonsOn(daysAgo(8), daysAgo(2), daysAgo(1)));
    await store.writeDomainFile('game-theory', 'practice-feedback.md', FEEDBACK);

    const view = await progressView(store);
    expect(view).toMatchObject({ active_topics: ['game-theory'], schedule: {}, streak: 3, lessonsThisWeek: 4 }); // 8 days ago is last week
    expect(view.history).toHaveLength(5);
    expect(view.topics).toEqual([{
      slug: 'game-theory',
      topic: store.readCurriculum('game-theory').topic,
      completed: 2,
      total: 29,
      percent: 7,
      accuracy: 67,
      mastered: 5, // lesson 1's four concepts, and the payoff matrix its retest settled
      reviewDue: 2, // lesson 2's other two
      nextLesson: "Why don't both prisoners stay silent?",
    }]);
  });

  it('shows no accuracy before a graded lesson, rather than the model\'s starting guess of 50%', async () => {
    await store.writeProgress({ active_topics: ['game-theory', 'no-such-topic'], schedule: {}, history: [] });
    const view = await progressView(store);
    expect(view.topics).toEqual([expect.objectContaining({ slug: 'game-theory', completed: 0, accuracy: null, mastered: 0, reviewDue: 0 })]);
  });

  // Review of #308: what the stores never write, but older or hand-edited state could hold.
  it('counts only this week\'s real dates, never a future or malformed one', async () => {
    const history = lessonsOn(daysAgo(0), daysAgo(6), daysAgo(7), '2099-01-01', '2026-10', 'n/a', '');
    await store.writeProgress({ active_topics: [], schedule: {}, history: [...history, null, {}] });
    expect(await progressView(store)).toMatchObject({ streak: 1, lessonsThisWeek: 2 });
  });

  it('skips an active topic that is not a topic slug, instead of failing every other topic', async () => {
    await store.writeProgress({ active_topics: ['Not A Slug', '../game-theory', 42, null, 'game-theory'], schedule: {}, history: [] });
    const view = await progressView(store);
    expect(view.topics.map((t) => t.slug)).toEqual(['game-theory']);
    expect(view.active_topics).toHaveLength(5); // the record itself is the student's, as it was
  });

  // The bot keeps its own files and still shows its own mastered and due (SM-2) until #214. The streak,
  // completion and accuracy are the same numbers, computed the same way.
  it('gives the numbers the bot\'s /progress shows for the same state', async () => {
    fs.rmSync(BOT, { recursive: true, force: true });
    fs.cpSync(path.join(ROOT, 'skills', 'tutor', 'domains', 'game-theory'), `${BOT}/domains/game-theory`, { recursive: true });
    const bot = await import('../scripts/bot/state.js');
    const { handleCommand } = await import('../scripts/bot/commands.js');
    try {
      await twoLessons(bot, lessonsOn(daysAgo(2), daysAgo(1)));
      const channel = { sendMessage: vi.fn() };
      await handleCommand('/progress', 1, channel, new Map());
      const shown = channel.sendMessage.mock.calls.at(-1)[1];

      const view = await progressView(bot);
      const [topic] = view.topics;
      expect([view.streak, topic.completed, topic.total, topic.percent, topic.accuracy]).toEqual([3, 2, 29, 7, 67]);
      expect(shown).toContain(`Streak: ${view.streak} days`);
      expect(shown).toContain(`Day ${topic.completed}/${topic.total}`);
      expect(shown).toContain(`${topic.percent}%`);
      expect(shown).toContain(`Accuracy: ${topic.accuracy}%`);
    } finally {
      fs.rmSync(BOT, { recursive: true, force: true });
    }
  });
});

// The local server and the Vercel route, over the same data: one answer, field for field.
describe('GET /api/progress', () => {
  const PASSWORD = 'test-progress-stats-password';
  let child, dataDir, base, handler;
  beforeAll(async () => {
    dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-progress-route-'));
    vi.stubEnv('OPENTUTOR_DATA_DIR', dataDir);
    const seed = new TutorStore(ROOT);
    await twoLessons(seed, lessonsOn(daysAgo(1, Date.now())));
    seed.close();

    const port = await new Promise((resolve) => {
      const probe = net.createServer().listen(0, '127.0.0.1', () => { const { port } = probe.address(); probe.close(() => resolve(port)); });
    });
    base = `http://127.0.0.1:${port}`;
    // Explicit env only: a checkout's .env holds production keys.
    child = spawn(process.execPath, ['scripts/web/server.js'], {
      cwd: ROOT,
      env: { PATH: process.env.PATH, HOME: process.env.HOME, OPENTUTOR_PORT: String(port), OPENTUTOR_HOST: '127.0.0.1', OPENTUTOR_DATA_DIR: dataDir, OPENTUTOR_PASSWORD: PASSWORD, OPENTUTOR_LLM: 'openrouter', OPENROUTER_API_KEY: 'unused' },
      stdio: ['ignore', 'pipe', 'inherit'],
    });
    await new Promise((resolve, reject) => {
      child.stdout.on('data', (d) => { if (String(d).includes('running at')) resolve(); });
      child.on('exit', (code) => reject(new Error(`server exited ${code}`)));
    });
    handler = (await import('../api/progress.js')).default;
  }, 20_000);
  beforeEach(() => {
    vi.stubEnv('OPENTUTOR_DATA_DIR', dataDir);
    vi.stubEnv('OPENTUTOR_PASSWORD', PASSWORD);
  });
  afterAll(() => {
    child?.kill();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  const local = async () => {
    const res = await fetch(`${base}/api/progress`, { headers: { Authorization: `Bearer ${PASSWORD}` } });
    return [res.status, await res.json()];
  };
  const vercel = async () => {
    const res = { setHeader() {}, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
    await handler({ method: 'GET', headers: { authorization: `Bearer ${PASSWORD}` } }, res);
    return [res.statusCode, res.body];
  };

  it('answers the same on the local server as on Vercel', async () => {
    const [status, body] = await vercel();
    expect(status).toBe(200);
    expect(body).toMatchObject({ streak: 2, lessonsThisWeek: 3, topics: [{ slug: 'game-theory', completed: 2, accuracy: 67 }] });
    expect(await local()).toEqual([200, body]);
  });

  it('answers a failure the same way too, with its cause only in the log', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    // A learning log the store cannot read, a directory where the file should be: an error, not "missing".
    const learning = path.join(dataDir, 'workspace', 'tutor', 'domains', 'game-theory', 'learning.md');
    fs.rmSync(learning);
    fs.mkdirSync(learning);

    const failure = [500, { error: 'Could not load your progress.' }];
    expect(await vercel()).toEqual(failure);
    expect(await local()).toEqual(failure);
    expect(log).toHaveBeenCalledWith('[progress]', expect.stringContaining('EISDIR'));
  });
});
