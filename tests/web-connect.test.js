import { it, expect, vi } from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';

// Runs the real frontend against a DOM double. `window` is the global, as in a
// browser, so app.js's fetch wrapper is the fetch every call goes through.
function frontend(route, search = '') {
  const html = fs.readFileSync(new URL('../public/learn.html', import.meta.url), 'utf8');
  const source = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  let focused = null;
  const timers = [];
  const element = (classes = '') => {
    const names = new Set(classes.split(' '));
    const listeners = new Map();
    return {
      value: '', textContent: '', innerHTML: '', disabled: false, dataset: {}, style: {}, children: [],
      classList: { add: (v) => names.add(v), remove: (v) => names.delete(v), contains: (v) => names.has(v), toggle: (v, force) => (force ? names.add(v) : names.delete(v)) },
      addEventListener: (name, fn) => listeners.set(name, fn),
      click() { return listeners.get('click')?.(); },
      focus() { focused = this; }, appendChild(child) { this.children.push(child); }, remove() {}, querySelectorAll() { return []; },
    };
  };
  const nodes = new Map([...html.matchAll(/<[^>]*\bid="([^"]+)"[^>]*>/g)].map(([tag, id]) => [`#${id}`, element(tag.match(/class="([^"]+)"/)?.[1])]));
  const nav = [...html.matchAll(/<button[^>]*data-view="([^"]+)"[^>]*>/g)].map(([, view]) => Object.assign(element('nav-btn'), { dataset: { view } }));
  const $ = (s) => nodes.get(s) || nav.find((n) => s === `.nav-btn[data-view="${n.dataset.view}"]`);
  const calls = [];
  const base = {
    '/api/account': [200, { user: { id: 'acct-1' } }],
    '/api/progress': [200, { active_topics: [] }],
    '/api/topic-build': [200, []],
    '/api/user': [200, { hasProfile: true }],
    '/api/openrouter': [200, { connected: false, trialLessons: 3, trialLessonsLeft: 3, limitRemaining: null }],
  };
  const context = vm.createContext({
    document: { querySelector: $, createElement: () => element(), querySelectorAll: (s) => (s === '.nav-btn' ? nav : ['learn', 'topics', 'chat'].map((v) => $(`#view-${v}`))) },
    localStorage: { getItem: () => null, removeItem() {} }, sessionStorage: { removeItem() {} },
    location: { search, pathname: '/learn.html', assign: vi.fn(), replace: vi.fn() },
    history: { replaceState: vi.fn() },
    Response, Headers, URLSearchParams, console, setTimeout: (fn) => (timers.push(fn), 0), clearTimeout() {},
    fetch: async (url, init = {}) => {
      calls.push({ url, init });
      const [status, body] = route(url, init) || base[url] || [200, {}];
      return new Response(JSON.stringify(body), { status });
    },
  });
  context.window = context;
  vm.runInContext(source, context);
  // Timers wait until a test runs them, as a browser runs them after the current task.
  return { $, calls, context, focused: () => focused, runTimers: () => timers.splice(0).forEach((fn) => fn()) };
}
const settle = async () => { for (let i = 0; i < 6; i++) await new Promise(setImmediate); };

it('shows a self-signup account how many free lessons it has left', async () => {
  const { $ } = frontend((url) => (url === '/api/openrouter' ? [200, { connected: false, trialLessons: 3, trialLessonsLeft: 2, limitRemaining: null }] : null));
  await settle();
  expect($('#key-status').textContent).toBe('2 of 3 free lessons left');
  expect($('#key-status').classList.contains('hidden')).toBe(false);
});

it('turns any 402 into the connect banner, in the server\'s words, and shows the error instead of "undefined"', async () => {
  const refusal = { error: 'Study Buddy needs your OpenRouter account.', connect: true, reason: 'chat' };
  const { $ } = frontend((url) => (url === '/api/chat' ? [402, refusal] : null));
  await settle();
  $('#chat-input').value = 'hi';
  await $('#btn-send').click();
  await settle();
  expect($('#connect-banner').classList.contains('hidden')).toBe(false);
  expect($('#connect-message').textContent).toBe(refusal.error);
  expect($('#chat-messages').children.some((n) => String(n.innerHTML + n.textContent).includes('undefined'))).toBe(false);
});

it('sends the student to OpenRouter, and finishes the connection when they come back', async () => {
  const { $, calls, context } = frontend((url, init) => {
    if (url !== '/api/openrouter' || init.method !== 'POST') return null;
    return JSON.parse(init.body).action === 'start'
      ? [200, { url: 'https://openrouter.ai/auth?code_challenge=x' }]
      : [200, { connected: true, freeTier: false, limitRemaining: null }];
  }, '?code=abc123');
  await settle();
  const connect = calls.find((c) => c.url === '/api/openrouter' && c.init.method === 'POST');
  expect(JSON.parse(connect.init.body)).toEqual({ action: 'connect', code: 'abc123' });
  expect(context.history.replaceState).toHaveBeenCalledWith(null, '', '/learn.html');
  await $('#btn-connect').click();
  await settle();
  expect($('#btn-connect').disabled).toBe(false);
  expect(context.location.assign).toHaveBeenCalledWith('https://openrouter.ai/auth?code_challenge=x');
});

it('tells the student when OpenRouter cannot be reached', async () => {
  const { $ } = frontend((url, init) => {
    if (url === '/api/openrouter' && init.method === 'POST') throw new Error('offline');
    return null;
  });
  await settle();
  await $('#btn-connect').click();
  await settle();
  expect($('#connect-message').textContent).toBe('Could not reach OpenRouter. Please try again.');
  expect($('#btn-connect').disabled).toBe(false);
});

it('does not start a custom-topic build for a topic missing from the catalog', async () => {
  const catalog = [{ slug: 'game-theory', topic: 'Game theory', total: 29, level: 'All levels', preview: [] }];
  const { calls } = frontend((url) => (url === '/api/catalog' ? [200, catalog] : null), '?topic=not-a-shipped-topic');
  await settle();
  expect(calls.some((c) => c.url === '/api/add-topic')).toBe(false);
});

it('pre-selects a topic that is in the public catalog, from a link', async () => {
  const catalog = [{ slug: 'game-theory', topic: 'Game theory', total: 29, level: 'All levels', preview: [] }];
  const { calls } = frontend((url) => {
    if (url === '/api/catalog') return [200, catalog];
    if (url === '/api/add-topic') return [200, { slug: 'game-theory', status: 'existing', lessonCount: 29 }];
    if (url === '/api/topics') return [200, []];
    return null;
  }, '?topic=game-theory');
  await settle();
  const addTopic = calls.find((c) => c.url === '/api/add-topic');
  expect(addTopic).toBeTruthy();
  expect(JSON.parse(addTopic.init.body)).toEqual({ topic: 'game-theory', level: 'intermediate' });
});

it('keeps a signed-in student on the page during a sign-in outage, and sends only an ended session to login', async () => {
  const unavailable = [503, { error: 'Sign-in is temporarily unavailable.' }];
  for (const account of [
    () => unavailable,
    (init) => (init.method === 'POST' ? unavailable : [200, { user: null }]),
  ]) {
    const { $, context } = frontend((url, init) => (url === '/api/account' ? account(init) : null));
    await settle();
    expect(context.location.replace).not.toHaveBeenCalled();
    expect($('#empty-state').textContent).toMatch(/refresh/i);
  }
  const { context } = frontend((url, init) => {
    if (url !== '/api/account') return null;
    return init.method === 'POST' ? [401, { error: 'Your session expired.' }] : [200, { user: null }];
  });
  await settle();
  expect(context.location.replace).toHaveBeenCalledWith('/login.html');
});

it('reports an outage when a mid-session refresh fails, instead of sending the student to login', async () => {
  const { $, context } = frontend((url, init) => {
    if (url === '/api/chat') return [401, { error: 'Please sign in again.' }];
    if (url === '/api/account' && init.method === 'POST') return [503, { error: 'Sign-in is temporarily unavailable. Please try again.' }];
    return null;
  });
  await settle();
  $('#chat-input').value = 'hi';
  await $('#btn-send').click();
  await settle();
  expect(context.location.assign).not.toHaveBeenCalled();
  expect($('#chat-messages').children.some((n) => String(n.innerHTML + n.textContent).includes('temporarily unavailable'))).toBe(true);
});

it('never mistakes an error response for data: no onboarding for a returning student, no empty topic list', async () => {
  const outage = [503, { error: 'Sign-in is temporarily unavailable. Please try again.' }];
  const user = frontend((url, init) => {
    if (url === '/api/user') return [401, { error: 'Please sign in again.' }];
    return url === '/api/account' && init.method === 'POST' ? outage : null;
  });
  await settle();
  expect(user.$('#onboarding-overlay').classList.contains('hidden')).toBe(true);
  const progress = frontend((url) => (url === '/api/progress' ? outage : null));
  await settle();
  expect(progress.$('#empty-state').textContent).toMatch(/refresh/i);
  expect(progress.calls.some((c) => c.url === '/api/user')).toBe(false);
});

// #155: a student with topics has been onboarded, whatever their profile says.
// The overlay used to come back on every visit and spend their free messages.
it.each([
  [{ hasProfile: false, onboarded: true }, 'stays hidden for a student who already has topics', true],
  [{ hasProfile: false, onboarded: false }, 'opens for a new student', false],
])('onboarding with %j %s', async (user, _case, hidden) => {
  const { $ } = frontend((url) => (url === '/api/user' ? [200, user] : null));
  await settle();
  expect($('#onboarding-overlay').classList.contains('hidden')).toBe(hidden);
});

// #167: the onboarding dialog is modal, so the page behind it is inert while it is open.
it('makes the page behind the onboarding dialog inert until the dialog closes', async () => {
  const { $ } = frontend((url) => (url === '/api/user' ? [200, { hasProfile: false, onboarded: false }] : url === '/api/topics' ? [200, []] : null));
  await settle();
  expect($('#onboarding-overlay').classList.contains('hidden')).toBe(false);
  expect($('#app').inert).toBe(true);
  await $('#btn-onboard-browse').click();
  expect($('#onboarding-overlay').classList.contains('hidden')).toBe(true);
  expect($('#app').inert).toBe(false);
});

it('returns focus to the topic picker when onboarding closes on a chosen topic', async () => {
  const start = { reply: 'Why?', lesson: { module: 'M', day: 1, title: 'T' }, step: 0, totalSteps: 3 };
  const { $, focused, runTimers } = frontend((url) => ({
    '/api/user': [200, { hasProfile: false, onboarded: false }],
    '/api/onboard': [200, { reply: 'Game theory it is.', confirmedTopic: 'game-theory' }],
    '/api/add-topic': [200, { slug: 'game-theory', status: 'existing', lessonCount: 29 }],
    '/api/topics': [200, []],
    '/api/lesson': [200, start],
  })[url] || null);
  await settle();
  $('#onboarding-input').value = 'Game theory, please';
  await $('#btn-onboard-send').click();
  await settle();
  expect(focused()).toBe($('#onboarding-input'));
  runTimers();
  await settle();
  expect($('#onboarding-overlay').classList.contains('hidden')).toBe(true);
  expect($('#app').inert).toBe(false);
  expect(focused()).toBe($('#active-topic'));
});

it('keeps an over-long answer or message in its box and says why, instead of sending it', async () => {
  const start = { reply: 'Why?', lesson: { module: 'M', day: 1, title: 'T' }, step: 0, totalSteps: 4 };
  const { $, calls } = frontend((url) => (url === '/api/lesson' ? [200, start] : null));
  await settle();
  $('#active-topic').value = 'demo';
  await $('#btn-next').click();
  await settle();
  const long = 'x'.repeat(4001);
  $('#lesson-input').value = long;
  await $('#btn-lesson-answer').click();
  $('#onboarding-input').value = long;
  await $('#btn-onboard-send').click();
  await settle();
  expect(calls.filter((c) => c.url === '/api/lesson')).toHaveLength(1); // the start, not the answer
  expect(calls.some((c) => c.url === '/api/onboard')).toBe(false);
  expect([$('#lesson-input').value, $('#onboarding-input').value]).toEqual([long, long]);
  for (const box of ['#lesson-conversation', '#onboarding-chat'])
    expect($(box).children.some((n) => String(n.innerHTML + n.textContent).includes('4,000 characters'))).toBe(true);
});

// #159: a reload resumes the lesson in progress; the page says so and shows where it was.
it('shows a resumed lesson\'s last tutor message, with a note that it picked up where it left off', async () => {
  const resumed = { reply: 'So what would change if the payoffs did?', lesson: { module: 'M', day: 1, title: 'T' }, step: 1, totalSteps: 3, done: false, resumed: true };
  const { $ } = frontend((url) => (url === '/api/lesson' ? [200, resumed] : null));
  await settle();
  $('#active-topic').value = 'demo';
  await $('#btn-next').click();
  await settle();
  const shown = $('#lesson-conversation').children.map((n) => n.innerHTML);
  expect(shown.filter((h) => h.includes('Picking up where you left off.'))).toHaveLength(1);
  expect(shown.filter((h) => h.includes(resumed.reply))).toHaveLength(1);
  expect($('#lesson-input-area').classList.contains('hidden')).toBe(false);
});

// A lesson on its last step: `last` answers the student's answer.
async function lastStep(last) {
  const start = { reply: 'Why?', lesson: { module: 'M', day: 1, title: 'T' }, step: 0, totalSteps: 3, done: false };
  const page = frontend((url, init) => {
    if (url !== '/api/lesson') return null;
    return JSON.parse(init.body).answer ? [200, { reply: 'Well reasoned.', step: 3, totalSteps: 3, lesson: start.lesson, ...last }] : [200, start];
  });
  await settle();
  page.$('#active-topic').value = 'demo';
  await page.$('#btn-next').click();
  await settle();
  return page;
}
const starts = (calls) => calls.filter((c) => c.url === '/api/lesson' && !JSON.parse(c.init.body).answer).length;

it('never sends a blank answer', async () => {
  const { $, calls } = await lastStep({ done: false });
  $('#lesson-input').value = '   ';
  await $('#btn-lesson-answer').click();
  await settle();
  expect(calls.filter((c) => c.url === '/api/lesson')).toHaveLength(1); // the start, not the blank answer
});

// #159: the route said a finished lesson was not saved, and the page never showed it,
// then celebrated the progress. It says so instead, and Next Lesson still continues.
it.each([
  ['celebrates a finished lesson that was saved', {}, true],
  ['warns, and does not celebrate, when a finished lesson could not be saved', { warning: 'This lesson could not be saved — your progress may not be recorded.' }, false],
])('%s', async (_case, extra, celebrates) => {
  const { $, calls } = await lastStep({ done: true, ...extra });
  $('#lesson-input').value = 'because the payoffs change';
  await $('#btn-lesson-answer').click();
  await settle();
  const shown = $('#lesson-conversation').children.map((n) => n.innerHTML).join('\n');
  expect(shown.includes('making progress')).toBe(celebrates);
  if (extra.warning) expect(shown).toContain(extra.warning);
  expect($('#lesson-input-area').classList.contains('hidden')).toBe(true);
  expect($('#btn-next').disabled).toBe(false);
  await $('#btn-next').click();
  await settle();
  expect(starts(calls)).toBe(2);
});

// #150: a reply is model output, and model output can carry text from the research
// sources. Markdown is rendered; HTML in the reply is shown as text, never parsed.
it('shows HTML in a tutor reply as text, while still rendering its markdown', async () => {
  const reply = 'Try **this**: <img src=x onerror="alert(1)"> and <script>steal()</script>';
  const { $ } = frontend((url) => (url === '/api/chat' ? [200, { reply }] : null));
  await settle();
  $('#chat-input').value = 'hi <b>there</b>';
  await $('#btn-send').click();
  await settle();
  const html = $('#chat-messages').children.map((n) => n.innerHTML).join('\n');
  expect(html).toContain('<strong>this</strong>');
  expect(html).toContain('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  expect(html).not.toMatch(/<img|<script|<b>/);
});

// #160: a self-signup account deletes itself, behind a typed confirmation.
const CONFIRM = 'This permanently deletes your account and all your learning data. Type DELETE to confirm.';
const deletions = (calls) =>
  calls.filter((c) => c.url === '/api/account' && JSON.parse(c.init.body || '{}').action === 'delete');

it.each([
  ['a self-signup account', true, { user: { id: 'acct-1' } }],
  ['a self-signup account whose session was just refreshed', true, { user: null }, { user: { id: 'acct-1' } }],
  ['a student the operator created', false, { user: { id: 'carol' } }],
  ['the owner', false, { user: { id: null, name: 'Your workspace' } }],
  ['a local install', false, { user: null, local: true }],
])('%s sees Delete account: %s', async (_who, visible, session, refreshed) => {
  const { $ } = frontend((url, init) => (url === '/api/account' ? [200, init.method === 'POST' ? refreshed : session] : null));
  await settle();
  expect($('#btn-delete-account').classList.contains('hidden')).toBe(!visible);
});

it.each([[null], [''], ['delete'], ['DELETE ']])('sends nothing when the confirmation is %j', async (answer) => {
  const { $, calls, context } = frontend(() => null);
  await settle();
  context.prompt = vi.fn(() => answer);
  await $('#btn-delete-account').click();
  await settle();
  expect(context.prompt).toHaveBeenCalledWith(CONFIRM);
  expect(deletions(calls)).toEqual([]);
  expect(context.location.assign).not.toHaveBeenCalled();
});

it('deletes the account once the student types DELETE, then leaves for the home page', async () => {
  const { $, calls, context } = frontend((url, init) => (url === '/api/account' && init.method === 'POST' ? [200, { ok: true }] : null));
  await settle();
  context.prompt = vi.fn(() => 'DELETE');
  await $('#btn-delete-account').click();
  await settle();
  expect(deletions(calls).map((c) => [c.init.method, JSON.parse(c.init.body)])).toEqual([['POST', { action: 'delete', confirm: 'DELETE' }]]);
  expect(context.location.assign).toHaveBeenCalledWith('/?deleted=1');
});

it.each([
  ['refuses', () => [500, { error: 'Your account could not be deleted. Please try again.' }], 'Your account could not be deleted. Please try again.'],
  ['cannot be reached', () => { throw new Error('offline'); }, 'Your account could not be deleted. Please try again.'],
])('stays and says why when the server %s', async (_how, answer, message) => {
  const { $, context } = frontend((url, init) => (url === '/api/account' && init.method === 'POST' ? answer() : null));
  await settle();
  context.prompt = vi.fn(() => 'DELETE');
  context.alert = vi.fn();
  await $('#btn-delete-account').click();
  await settle();
  expect(context.alert).toHaveBeenCalledWith(message);
  expect(context.location.assign).not.toHaveBeenCalled();
  expect(context.location.replace).not.toHaveBeenCalled();
});

// The fetch wrapper leaves /api/account alone, so the delete refreshes an expired session itself.
const accountPosts = (calls) =>
  calls.filter((c) => c.url === '/api/account' && c.init.method === 'POST').map((c) => JSON.parse(c.init.body).action);

it('refreshes an expired session once and retries the delete without asking again', async () => {
  let deletes = 0;
  const { $, calls, context } = frontend((url, init) => {
    if (url !== '/api/account' || init.method !== 'POST') return null;
    if (JSON.parse(init.body).action === 'refresh') return [200, { user: { id: 'acct-1' } }];
    return ++deletes === 1 ? [401, { error: 'Please sign in again to delete your account.' }] : [200, { ok: true }];
  });
  await settle();
  context.prompt = vi.fn(() => 'DELETE');
  context.alert = vi.fn();
  await $('#btn-delete-account').click();
  await settle();
  expect(accountPosts(calls)).toEqual(['delete', 'refresh', 'delete']);
  expect(context.prompt).toHaveBeenCalledTimes(1);
  expect(context.alert).not.toHaveBeenCalled();
  expect(context.location.assign).toHaveBeenCalledWith('/?deleted=1');
});

it.each([
  ['has ended, to the login page', [401, { error: 'Your session expired. Please sign in again.' }], null],
  ['cannot be checked, with a message and no sign-out', [503, { error: 'Sign-in is temporarily unavailable. Please try again.' }], 'Sign-in is temporarily unavailable. Please try again.'],
])('when the refreshed session %s', async (_what, refreshed, message) => {
  const { $, calls, context } = frontend((url, init) => {
    if (url !== '/api/account' || init.method !== 'POST') return null;
    return JSON.parse(init.body).action === 'refresh' ? refreshed : [401, { error: 'Please sign in again to delete your account.' }];
  });
  await settle();
  context.prompt = vi.fn(() => 'DELETE');
  context.alert = vi.fn();
  await $('#btn-delete-account').click();
  await settle();
  expect(accountPosts(calls)).toEqual(['delete', 'refresh']);
  if (message) {
    expect(context.alert).toHaveBeenCalledWith(message);
    expect(context.location.assign).not.toHaveBeenCalled();
  } else {
    expect(context.alert).not.toHaveBeenCalled();
    expect(context.location.assign).toHaveBeenCalledWith('/login.html');
  }
});
