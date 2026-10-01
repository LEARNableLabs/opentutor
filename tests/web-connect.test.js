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
      dispatch(name, event = { preventDefault() {} }) { return listeners.get(name)?.(event); },
      dispatch(name, event = { preventDefault() {} }) { return listeners.get(name)?.(event); },
      focus() { focused = this; }, appendChild(child) { this.children.push(child); }, replaceChildren(...nodes) { this.children = nodes; }, remove() {}, querySelectorAll() { return []; },
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
    Response, Headers, URLSearchParams, TextDecoder, console, setTimeout: (fn) => (timers.push(fn), 0), clearTimeout() {},
    fetch: async (url, init = {}) => {
      calls.push({ url, init });
      const answer = await (route(url, init) || base[url] || [200, {}]); // a route may answer later
      if (answer instanceof Response) return answer; // e.g. a stream
      const [status, body] = answer;
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
  const refusal = { error: 'Chatting with OpenTutor needs your OpenRouter account.', connect: true, reason: 'chat' };
  const { $ } = frontend((url) => (url === '/api/chat' ? [402, refusal] : null));
  await settle();
  $('#chat-input').value = 'hi';
  await $('#btn-send').click();
  await settle();
  expect($('#connect-banner').classList.contains('hidden')).toBe(false);
  expect($('#connect-message').textContent).toBe(refusal.error);
  expect($('#chat-messages').children.some((n) => String(n.innerHTML + n.textContent).includes('undefined'))).toBe(false);
});

// #180: a spent daily trial budget reaches the page as the connect prompt, from either lesson path.
const DAILY = { error: 'Free lessons are used up for today. Connect your OpenRouter account to keep going, or come back tomorrow.', connect: true, reason: 'daily_limit' };
it.each([
  ['a 402', () => new Response(JSON.stringify(DAILY), { status: 402 })],
  ['one SSE error event', () => new Response(`event: error\ndata: ${JSON.stringify(DAILY)}\n\n`, { headers: { 'Content-Type': 'text/event-stream' } })],
])('shows the daily trial limit in the connect banner when a lesson gets %s', async (_case, reply) => {
  const { $ } = frontend((url) => (url === '/api/lesson' ? reply() : null));
  await settle();
  $('#active-topic').value = 'demo';
  await $('#btn-next').click();
  await settle();
  expect($('#connect-banner').classList.contains('hidden')).toBe(false);
  expect($('#connect-message').textContent).toBe(DAILY.error);
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
  const { $, focused } = frontend((url) => ({
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
  // #272: a short tour of the tabs waits for the student, focused on its one button.
  expect(focused()).toBe($('#btn-tour-start'));
  await $('#btn-tour-start').click();
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

// #149: an open BLOCK starts a review lesson; the page says why before the question.
it('shows a review lesson\'s note before its question, and names it in the lesson header', async () => {
  const review = { reply: 'Explain **alpha** in your own words.', lesson: { module: 'M', day: 7, title: 'Review: alpha', review: true }, step: 0, totalSteps: 3, done: false, note: "Let's revisit alpha before moving on." };
  const { $ } = frontend((url) => (url === '/api/lesson' ? [200, review] : null));
  await settle();
  $('#active-topic').value = 'demo';
  await $('#btn-next').click();
  await settle();
  const shown = $('#lesson-conversation').children.map((n) => n.innerHTML);
  expect(shown.findIndex((h) => h.includes('revisit alpha before moving on.'))).toBe(0); // md() escapes the apostrophe
  expect(shown[1]).toContain('Explain <strong>alpha</strong> in your own words.');
  expect($('#lesson-meta').textContent).toBe('M — Day 7: Review: alpha');
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
  expect($('#lesson-conversation').children.some((n) => n.className === 'lesson-celebration')).toBe(celebrates);
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

// #203: a returning student lands on their topic, not on an empty "Select a topic".
it('selects the topic of the most recent lesson for a returning student, and says so', async () => {
  const progress = {
    active_topics: ['astrophysics', 'game-theory'],
    history: [{ topic: 'astrophysics', lesson: 1 }, { topic: 'game-theory', lesson: 1 }],
  };
  const { $ } = frontend((url) => (url === '/api/progress' ? [200, progress] : null));
  await settle();
  expect($('#active-topic').value).toBe('game-theory');
  expect($('#empty-title').textContent).toBe('Ready for your next lesson?');
});

it('falls back to the first topic when the history names none of them', async () => {
  const progress = { active_topics: ['astrophysics', 'game-theory'], history: [{ topic: 'removed-topic', lesson: 3 }] };
  const { $ } = frontend((url) => (url === '/api/progress' ? [200, progress] : null));
  await settle();
  expect($('#active-topic').value).toBe('astrophysics');
});

it('picks once per page view: a deliberate "Select a topic" stays, a chosen topic stays while active', async () => {
  const progress = { active_topics: ['astrophysics', 'game-theory'], history: [] };
  const { $ } = frontend((url) => (url === '/api/progress' ? [200, progress] : null));
  await settle();
  const backToLearn = async () => { await $('.nav-btn[data-view="learn"]').click(); await settle(); };
  $('#active-topic').value = '';
  await backToLearn();
  expect($('#active-topic').value).toBe('');
  $('#active-topic').value = 'astrophysics';
  await backToLearn();
  expect($('#active-topic').value).toBe('astrophysics');
  progress.active_topics = ['game-theory'];
  await backToLearn();
  expect($('#active-topic').value).toBe('game-theory');
});

// Review of #218: choosing a topic hides the list the student was in, so focus must go somewhere visible.
it('moves focus to Next lesson after a topic is chosen from the list', async () => {
  const { $, context, focused } = frontend((url) => (
    url === '/api/add-topic' ? [200, { status: 'existing', slug: 'game-theory', lessonCount: 27 }]
      : url === '/api/progress' ? [200, { active_topics: ['game-theory'] }]
        : null));
  await settle();
  await context.selectTopic('game-theory');
  await settle();
  expect(focused()).toBe($('#btn-next'));
});

// #215: `.hidden` is !important, so a view that starts hidden never shows, whatever the tab handler does.
it('shows the view of whichever tab is clicked', async () => {
  const { $ } = frontend((url) => (url === '/api/topics' ? [200, []] : null));
  await settle();
  for (const view of ['topics', 'chat', 'learn']) {
    await $(`.nav-btn[data-view="${view}"]`).click();
    await settle();
    const section = $(`#view-${view}`);
    expect([view, section.classList.contains('active'), section.classList.contains('hidden')]).toEqual([view, true, false]);
  }
});

// #246: pasting a key is the other way to connect.
it('saves a pasted key, clears the field and closes the banner', async () => {
  const { $, calls } = frontend((url, init) => (url === '/api/openrouter' && init.method === 'POST' ? [200, { connected: true, freeTier: false, limitRemaining: 5 }] : null));
  await settle();
  $('#connect-banner').classList.remove('hidden');
  $('#key-input').value = '  sk-or-mine  ';
  await $('#key-form').dispatch('submit');
  await settle();
  const save = calls.find((c) => c.url === '/api/openrouter' && c.init.method === 'POST');
  expect(JSON.parse(save.init.body)).toEqual({ action: 'save', key: 'sk-or-mine' });
  expect($('#key-input').value).toBe('');
  expect($('#connect-banner').classList.contains('hidden')).toBe(true);
  expect($('#btn-save-key').disabled).toBe(false);
});

it('shows why a pasted key was refused, and keeps the banner open', async () => {
  const { $ } = frontend((url, init) => (url === '/api/openrouter' && init.method === 'POST' ? [400, { error: 'OpenRouter did not accept that key. Check it and try again.' }] : null));
  await settle();
  $('#connect-banner').classList.remove('hidden');
  $('#key-input').value = 'sk-or-typo';
  await $('#key-form').dispatch('submit');
  await settle();
  expect($('#connect-message').textContent).toBe('OpenRouter did not accept that key. Check it and try again.');
  expect($('#connect-banner').classList.contains('hidden')).toBe(false);
  expect($('#key-input').value).toBe(''); // a refused secret does not stay in the page
});

it('clears the key from the field even when the request fails', async () => {
  const { $ } = frontend((url, init) => {
    if (url === '/api/openrouter' && init.method === 'POST') throw new Error('offline');
    return null;
  });
  await settle();
  $('#key-input').value = 'sk-or-mine';
  await $('#key-form').dispatch('submit');
  await settle();
  expect($('#key-input').value).toBe('');
  expect($('#connect-message').textContent).toBe('Could not save the key. Please try again.');
});

it('does not send an empty key', async () => {
  const { $, calls } = frontend(() => null);
  await settle();
  $('#key-input').value = '   ';
  await $('#key-form').dispatch('submit');
  await settle();
  expect(calls.some((c) => c.url === '/api/openrouter' && c.init.method === 'POST')).toBe(false);
});

// #251: the Topics tab says how hard a topic is and what to know first, escaped.
it('shows each topic\'s level and prerequisites on the Topics tab', async () => {
  const topics = [
    { slug: 'knots', topic: 'Knots', total: 5, completed: 0, percent: 0, level: 'advanced', prerequisites: ['<img src=x>', 'string theory'] },
    { slug: 'mine', topic: 'Mine', total: 3, completed: 0, percent: 0, level: null, prerequisites: [] },
  ];
  const { $ } = frontend((url) => (url === '/api/topics' ? [200, topics] : null));
  await settle();
  await $('.nav-btn[data-view="topics"]').click();
  await settle();
  const html = $('#topic-list').innerHTML;
  expect(html).toContain('Advanced');
  expect(html).toContain('Before you start: &lt;img src=x&gt;, string theory. Rusty on any of these? Ask the tutor as you go.');
  expect(html).not.toContain('<img src=x>');
  expect(html.match(/Before you start/g)).toHaveLength(1);
});

// #250: the chat always runs on the student's own key, so offer it before they type.
const CHAT_OFFER = 'Chatting with OpenTutor uses your own OpenRouter key. Connect your account or paste a key to start.';
it('offers OpenRouter setup as soon as a student without a key opens the chat', async () => {
  const { $ } = frontend(() => null); // base: connected false
  await settle();
  expect($('#connect-banner').classList.contains('hidden')).toBe(true);
  await $('.nav-btn[data-view="chat"]').click();
  await settle();
  expect($('#connect-banner').classList.contains('hidden')).toBe(false);
  expect($('#connect-message').textContent).toBe(CHAT_OFFER);
});

it.each([
  ['a connected student', [200, { connected: true, trialLessons: 3, trialLessonsLeft: 0, limitRemaining: 5 }]],
  ['the owner, who has no account', [403, { error: 'Only self-signup accounts connect their own OpenRouter key.' }]],
])('does not offer setup to %s', async (_who, status) => {
  const { $ } = frontend((url, init) => (url === '/api/openrouter' && !init.method ? status : null));
  await settle();
  await $('.nav-btn[data-view="chat"]').click();
  await settle();
  expect($('#connect-banner').classList.contains('hidden')).toBe(true);
});

it('takes the chat offer away when the student leaves the chat', async () => {
  const { $ } = frontend(() => null);
  await settle();
  await $('.nav-btn[data-view="chat"]').click();
  await settle();
  await $('.nav-btn[data-view="learn"]').click();
  await settle();
  expect($('#connect-banner').classList.contains('hidden')).toBe(true);
});

// #254 review: the chat offer's state under slow, failed and out-of-order status loads.
const deferred = () => { let resolve; const promise = new Promise((r) => (resolve = r)); return { promise, resolve }; };
const NO_KEY = [200, { connected: false, trialLessons: 3, trialLessonsLeft: 0, limitRemaining: null }];

it('does not put the chat offer on another tab when the student leaves Chat before the status loads', async () => {
  let first = true;
  const slow = deferred();
  const { $ } = frontend((url, init) => {
    if (url !== '/api/openrouter' || init.method) return null;
    if (first) { first = false; return [503, {}]; } // the page's own load fails, so Chat has to ask again
    return slow.promise;
  });
  await settle();
  await $('.nav-btn[data-view="chat"]').click();
  await $('.nav-btn[data-view="learn"]').click();
  slow.resolve(NO_KEY);
  await settle();
  expect($('#connect-banner').classList.contains('hidden')).toBe(true);
});

it('asks again after a failed status load, instead of treating the student as the owner', async () => {
  let calls = 0;
  const { $ } = frontend((url, init) => (url === '/api/openrouter' && !init.method ? (++calls === 1 ? [503, { error: 'unavailable' }] : NO_KEY) : null));
  await settle();
  await $('.nav-btn[data-view="chat"]').click();
  await settle();
  expect($('#connect-banner').classList.contains('hidden')).toBe(false);
  expect($('#connect-message').textContent).toBe(CHAT_OFFER);
});

it('lets the newest status win when an older one arrives late', async () => {
  const stale = deferred();
  let gets = 0;
  const { $ } = frontend((url, init) => {
    if (url !== '/api/openrouter') return null;
    if (init.method === 'POST') return [200, { connected: false }];
    return ++gets === 1 ? stale.promise : NO_KEY; // the page's first load is slow; the one after disconnect is not
  });
  await $('#btn-disconnect').click();
  await settle();
  stale.resolve([200, { connected: true, trialLessons: 3, trialLessonsLeft: 0, limitRemaining: 5 }]);
  await settle();
  $('#connect-banner').classList.add('hidden'); // the student dismisses the disconnect notice
  await $('.nav-btn[data-view="chat"]').click();
  await settle();
  expect($('#connect-message').textContent).toBe(CHAT_OFFER);
});

it('leaves another connect message alone, and it survives a visit to Chat', async () => {
  const { $ } = frontend(() => null);
  await settle();
  $('#connect-message').textContent = DAILY.error;
  $('#connect-banner').classList.remove('hidden');
  await $('.nav-btn[data-view="chat"]').click();
  await settle();
  expect($('#connect-message').textContent).toBe(DAILY.error);
  await $('.nav-btn[data-view="learn"]').click();
  await settle();
  expect($('#connect-banner').classList.contains('hidden')).toBe(false);
  expect($('#connect-message').textContent).toBe(DAILY.error);
});

it('lets the chat layout shrink to the visible window on phones', () => {
  const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
  const rule = css.match(/#app:has\(#view-chat\.active\) \{([^}]*)\}/)[1];
  expect(rule).toMatch(/height: 100dvh/);
  expect(rule).toMatch(/min-height: 0/);
});

// A suggested answer can be a sentence. Buttons don't wrap, so one widened the whole page on a phone.
it('wraps a long suggested answer instead of widening the page', () => {
  const css = fs.readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');
  expect(css.match(/\n\.answer-option \{([^}]*)\}/)[1]).toMatch(/white-space: normal/);
});

it('knows a saved key at once, without waiting for the status to reload', async () => {
  const never = deferred();
  let gets = 0;
  const { $ } = frontend((url, init) => {
    if (url !== '/api/openrouter') return null;
    if (init.method === 'POST') return [200, { connected: true, freeTier: false, limitRemaining: 5 }];
    return ++gets === 1 ? NO_KEY : never.promise; // the reload after saving hangs
  });
  await settle();
  $('#key-input').value = 'sk-or-mine';
  await $('#key-form').dispatch('submit');
  await settle();
  await $('.nav-btn[data-view="chat"]').click();
  await settle();
  expect($('#connect-banner').classList.contains('hidden')).toBe(true);
});


// #263: the companion shows up at four moments only.
const LESSON_START = { reply: 'Why does alpha matter?', step: 0, totalSteps: 3, done: false, lesson: { module: 'Basics', day: 1, title: 'Alpha' }, lessonId: 'L1' };
async function lessonWith(replies) {
  const f = frontend((url, init) => {
    if (url !== '/api/lesson') return null;
    return JSON.parse(init.body).answer ? replies.shift() : [200, LESSON_START];
  });
  await settle();
  f.$('#active-topic').value = 'demo';
  await f.$('#btn-next').click();
  await settle();
  return f;
}
const answer = async (f, text = 'my answer') => { f.$('#lesson-input').value = text; await f.$('#btn-lesson-answer').click(); await settle(); };
const shown = (f) => !f.$('#companion').classList.contains('hidden');

it('greets a new lesson, then reacts to a right answer', async () => {
  const f = await lessonWith([[200, { ...LESSON_START, reply: 'Yes. Next?', step: 1, mood: 'right' }]]);
  expect(shown(f)).toBe(true);
  expect(f.$('#companion').dataset.state).toBe('idle');
  expect(f.$('#companion-says').textContent).toBe('Ready when you are.');
  await answer(f);
  expect(f.$('#companion').dataset.state).toBe('right');
  expect(f.$('#companion-says').textContent).toBe("That's it. Now it's yours.");
});

it('offers a way in after a second miss, and stays out of the way otherwise', async () => {
  const f = await lessonWith([[200, { ...LESSON_START, reply: 'Hmm. Next?', step: 1 }], [200, { ...LESSON_START, reply: 'Not quite.', step: 2, mood: 'stuck' }]]);
  await answer(f);
  expect(shown(f)).toBe(false); // an ordinary reply: nothing to react to
  await answer(f);
  expect(f.$('#companion').dataset.state).toBe('stuck');
  expect(f.$('#companion-says').textContent).toBe('Try the smallest version of the problem first.');
});

it('reads along while an answer is graded', async () => {
  let release;
  const pending = new Promise((r) => (release = r));
  const f = await lessonWith([pending]);
  f.$('#lesson-input').value = 'thinking out loud';
  const sent = f.$('#btn-lesson-answer').click();
  await settle();
  expect(f.$('#companion').dataset.state).toBe('thinking');
  expect(f.$('#companion-says').textContent).toBe('Reading your answer.');
  release([200, { ...LESSON_START, reply: 'Ok.', step: 1 }]);
  await sent; await settle();
});

it('steps back while the student types', async () => {
  const f = await lessonWith([]);
  f.$('#lesson-input').value = 'I think';
  f.$('#lesson-input').dispatch('input');
  expect(shown(f)).toBe(false);
});

it('stays hidden for the session once the student taps it away', async () => {
  const f = await lessonWith([[200, { ...LESSON_START, reply: 'Yes.', step: 1, mood: 'right' }]]);
  await f.$('#companion-hide').click();
  expect(shown(f)).toBe(false);
  await answer(f);
  expect(shown(f)).toBe(false); // even for a right answer
});

it('keeps a new lesson\'s companion when an old lesson\'s answer fails late', async () => {
  let fail;
  const late = new Promise((r) => (fail = r));
  let starts = 0;
  const f = frontend((url, init) => {
    if (url !== '/api/lesson') return null;
    if (JSON.parse(init.body).answer) return late;
    return [200, { ...LESSON_START, lessonId: `L${++starts}` }];
  });
  await settle();
  f.$('#active-topic').value = 'demo';
  await f.$('#btn-next').click();
  await settle();
  f.$('#lesson-input').value = 'an answer for lesson one';
  const sent = f.$('#btn-lesson-answer').click();
  await settle();
  f.$('#active-topic').value = 'other';
  await f.$('#btn-next').click(); // lesson two starts while lesson one's answer is out
  await settle();
  expect(f.$('#companion').dataset.state).toBe('idle');
  fail([409, { error: 'That answer was for an earlier question.' }]);
  await sent; await settle();
  expect(f.$('#companion').classList.contains('hidden')).toBe(false); // lesson two keeps its companion
  expect(f.$('#companion').dataset.state).toBe('idle');
});

// #255: suggested answers under a checking question, tappable, with typing still open.
const LESSON = { reply: 'Why does alpha matter?', step: 0, totalSteps: 3, done: false, lesson: { module: 'Basics', day: 1, title: 'Alpha' }, lessonId: 'L1' };
async function startedLesson(first, next) {
  const f = frontend((url, init) => {
    if (url !== '/api/lesson') return null;
    return JSON.parse(init.body).answer ? next : first;
  });
  await settle();
  f.$('#active-topic').value = 'demo';
  await f.$('#btn-next').click();
  await settle();
  return f;
}

it('shows a checking question\'s suggested answers, and sends the one the student taps', async () => {
  const options = ['Because it compounds', 'Because it is fast', "I'm not sure — explain it to me"];
  const { $, calls } = await startedLesson([200, { ...LESSON, options }], [200, { ...LESSON, reply: 'Right. Now apply it: ___', step: 1 }]);
  const box = $('#answer-options');
  expect(box.classList.contains('hidden')).toBe(false);
  expect(box.children.map((b) => b.textContent)).toEqual(options);
  await box.children[0].click();
  await settle();
  const sent = calls.filter((c) => c.url === '/api/lesson').at(-1);
  expect(JSON.parse(sent.init.body)).toMatchObject({ topicSlug: 'demo', answer: 'Because it compounds', lessonId: 'L1', step: 0 });
  expect(box.classList.contains('hidden')).toBe(true); // the application question comes with none
  expect(box.children).toEqual([]);
});

it('keeps typing open: a typed answer goes as usual, and clears the suggestions', async () => {
  const { $, calls } = await startedLesson([200, { ...LESSON, options: ['A', 'B'] }], [200, { ...LESSON, reply: 'Next?', step: 1, options: ['C', 'D'] }]);
  $('#lesson-input').value = 'My own words';
  await $('#btn-lesson-answer').click();
  await settle();
  expect(JSON.parse(calls.filter((c) => c.url === '/api/lesson').at(-1).init.body).answer).toBe('My own words');
  expect($('#answer-options').children.map((b) => b.textContent)).toEqual(['C', 'D']);
});

it('shows no suggestions for a question that has none', async () => {
  const { $ } = await startedLesson([200, LESSON], null);
  expect($('#answer-options').classList.contains('hidden')).toBe(true);
});

it('clears the suggested answers when another lesson starts, even if that start fails', async () => {
  let starts = 0;
  const f = frontend((url, init) => {
    if (url !== '/api/lesson') return null;
    return ++starts === 1 ? [200, { ...LESSON, options: ['A', 'B'] }] : [500, { error: 'The tutor is unavailable right now.' }];
  });
  await settle();
  f.$('#active-topic').value = 'demo';
  await f.$('#btn-next').click();
  await settle();
  expect(f.$('#answer-options').children).toHaveLength(2);
  f.$('#active-topic').value = 'other';
  await f.$('#btn-next').click();
  await settle();
  expect(f.$('#answer-options').children).toEqual([]);
  expect(f.$('#answer-options').classList.contains('hidden')).toBe(true);
});

// #268: the companion is beside the chat too.
it('greets the chat, thinks while a reply is written, then steps aside', async () => {
  let reply;
  const pending = new Promise((r) => (reply = r));
  const f = frontend((url) => (url === '/api/chat' ? pending : null));
  await settle();
  await f.$('.nav-btn[data-view="chat"]').click();
  await settle();
  expect(f.$('#companion').classList.contains('hidden')).toBe(false);
  expect(f.$('#companion').dataset.state).toBe('idle');
  expect(f.$('#companion-says').textContent).toBe("What's on your mind?");
  f.$('#chat-input').value = 'Why is the sky blue?';
  const sent = f.$('#btn-send').click();
  await settle();
  expect(f.$('#companion').dataset.state).toBe('thinking');
  expect(f.$('#companion-says').textContent).toBe('Thinking it over.');
  reply([200, { reply: 'Scattering.', model: 'm' }]);
  await sent; await settle();
  expect(f.$('#companion').classList.contains('hidden')).toBe(true);
});

it('steps back while the student types a chat message', async () => {
  const f = frontend(() => null);
  await settle();
  await f.$('.nav-btn[data-view="chat"]').click();
  await settle();
  f.$('#chat-input').value = 'Why';
  f.$('#chat-input').dispatch('input');
  expect(f.$('#companion').classList.contains('hidden')).toBe(true);
});

it('stays hidden in the chat once tapped away, and leaves with the chat', async () => {
  const f = frontend(() => null);
  await settle();
  await f.$('.nav-btn[data-view="chat"]').click();
  await settle();
  await f.$('.nav-btn[data-view="learn"]').click(); // no lesson running: nothing to say there
  await settle();
  expect(f.$('#companion').classList.contains('hidden')).toBe(true);
  await f.$('.nav-btn[data-view="chat"]').click();
  await settle();
  await f.$('#companion-hide').click();
  await f.$('.nav-btn[data-view="learn"]').click();
  await f.$('.nav-btn[data-view="chat"]').click();
  await settle();
  expect(f.$('#companion').classList.contains('hidden')).toBe(true);
});

// #269 review: each tab keeps its own companion; a reply in one never changes the other.
function twoTabs() {
  const pend = {};
  const f = frontend((url, init) => {
    if (url === '/api/chat') return new Promise((r) => (pend.chat = r));
    if (url === '/api/topics') return [200, []]; // the Topics tab lists topics, an array
    if (url !== '/api/lesson') return null;
    return JSON.parse(init.body).answer ? new Promise((r) => (pend.lesson = r)) : [200, LESSON_START];
  });
  return { f, pend };
}
const tab = (f, view) => f.$(`.nav-btn[data-view="${view}"]`).click();
const seen = (f) => (f.$('#companion').classList.contains('hidden') ? null : [f.$('#companion').dataset.state, f.$('#companion-says').textContent]);

it('shows each tab its own companion, and a background reply only updates its own tab', async () => {
  const { f, pend } = twoTabs();
  await settle();
  f.$('#active-topic').value = 'demo';
  await f.$('#btn-next').click();
  await settle();
  f.$('#lesson-input').value = 'a lesson answer';
  const lessonSent = f.$('#btn-lesson-answer').click(); // the lesson is reading an answer
  await settle();
  await tab(f, 'chat');
  await settle();
  expect(seen(f)).toEqual(['idle', "What's on your mind?"]);
  f.$('#chat-input').value = 'a chat question';
  const chatSent = f.$('#btn-send').click();
  await settle();
  pend.lesson([200, { ...LESSON_START, reply: 'Yes.', step: 1, mood: 'right' }]); // the lesson answer lands while Chat is open
  await lessonSent; await settle();
  expect(seen(f)).toEqual(['thinking', 'Thinking it over.']); // the chat keeps its own moment
  await tab(f, 'learn');
  await settle();
  expect(seen(f)).toEqual(['right', "That's it. Now it's yours."]); // the lesson's reaction was kept for its tab
  pend.chat([200, { reply: 'Answer.', model: 'm' }]); // the chat reply lands while Learn is open
  await chatSent; await settle();
  expect(seen(f)).toEqual(['right', "That's it. Now it's yours."]);
});

it('keeps the chat thinking across a round trip to another tab', async () => {
  const { f, pend } = twoTabs();
  await settle();
  await tab(f, 'chat');
  f.$('#chat-input').value = 'a question';
  const sent = f.$('#btn-send').click();
  await settle();
  await tab(f, 'topics');
  await tab(f, 'chat');
  await settle();
  expect(seen(f)).toEqual(['thinking', 'Thinking it over.']);
  pend.chat([200, { reply: 'Answer.', model: 'm' }]);
  await sent; await settle();
  expect(seen(f)).toBe(null);
});

it('keeps the companion out of the way of a draft, after a round trip', async () => {
  const { f } = twoTabs();
  await settle();
  await tab(f, 'chat');
  f.$('#chat-input').value = 'half a thought';
  f.$('#chat-input').dispatch('input');
  await tab(f, 'topics');
  await tab(f, 'chat');
  await settle();
  expect(seen(f)).toBe(null);
});

it('sends one chat message at a time, so the companion thinks until the reply arrives', async () => {
  const { f, pend } = twoTabs();
  await settle();
  await tab(f, 'chat');
  const enter = { key: 'Enter', shiftKey: false, preventDefault() {} };
  f.$('#chat-input').value = 'first';
  const first = f.$('#chat-input').dispatch('keydown', enter);
  await settle();
  f.$('#chat-input').value = 'second, while the first is pending';
  await f.$('#chat-input').dispatch('keydown', enter); // Enter, like the disabled Send button, waits
  await settle();
  expect(f.calls.filter((c) => c.url === '/api/chat')).toHaveLength(1);
  expect(f.$('#chat-input').value).toBe('second, while the first is pending'); // kept for later
  pend.chat([200, { reply: 'One.', model: 'm' }]);
  await first; await settle();
  expect(seen(f)).toBe(null);
});

// #273: a course offered in the chat starts with one tap, through the usual add-topic flow.
it('turns a course offered in the chat into a button that starts it', async () => {
  const f = frontend((url) => {
    if (url === '/api/chat') return [200, { reply: 'Game theory studies strategic choices.', model: 'm', course: { topic: 'Game Theory', slug: 'game-theory' } }];
    if (url === '/api/add-topic') return [200, { slug: 'game-theory', status: 'existing', lessonCount: 29 }];
    if (url === '/api/topics') return [200, []];
    return null;
  });
  await settle();
  await f.$('.nav-btn[data-view="chat"]').click();
  f.$('#chat-input').value = 'teach me game theory';
  await f.$('#btn-send').click();
  await settle();
  const offer = f.$('#chat-messages').children.find((n) => n.className?.includes('course-offer'));
  expect(offer).toBeTruthy();
  const button = offer.children.find((n) => n.tagName === 'BUTTON' || n.className?.includes('primary')) || offer.children[0];
  expect(button.textContent).toBe('📚 Start the course: Game Theory');
  await button.click();
  await settle();
  const add = f.calls.find((c) => c.url === '/api/add-topic');
  expect(JSON.parse(add.init.body)).toEqual({ topic: 'game-theory', level: 'intermediate' });
});

it('switches to the offered course even while another lesson is open', async () => {
  const f = frontend((url, init) => {
    if (url === '/api/lesson') return [200, { reply: JSON.parse(init.body).topicSlug === 'game-theory' ? 'Game theory, lesson one.' : 'Alpha, lesson one.', step: 0, totalSteps: 3, done: false, lesson: { module: 'M', day: 1, title: 'T' }, lessonId: `L-${JSON.parse(init.body).topicSlug}` }];
    if (url === '/api/chat') return [200, { reply: 'Sure.', model: 'm', course: { topic: 'Game Theory', slug: 'game-theory' } }];
    if (url === '/api/add-topic') return [200, { slug: 'game-theory', status: 'existing', lessonCount: 29 }];
    if (url === '/api/progress') return [200, { active_topics: ['demo', 'game-theory'] }];
    if (url === '/api/topics') return [200, []];
    return null;
  });
  await settle();
  f.$('#active-topic').value = 'demo';
  await f.$('#btn-next').click(); // a lesson in "demo" is open
  await settle();
  await f.$('.nav-btn[data-view="chat"]').click();
  f.$('#chat-input').value = 'teach me game theory';
  await f.$('#btn-send').click();
  await settle();
  const offer = f.$('#chat-messages').children.find((n) => n.className?.includes('course-offer'));
  await offer.children[0].click();
  await settle();
  const starts = f.calls.filter((c) => c.url === '/api/lesson' && !JSON.parse(c.init.body).answer).map((c) => JSON.parse(c.init.body).topicSlug);
  expect(starts).toEqual(['demo', 'game-theory']); // the offered course's lesson opens
});

// Review of #273: a switch that fails half-way leaves the open lesson taking answers.
it('keeps the open lesson answerable when the offered course cannot be opened', async () => {
  let added = false;
  const f = frontend((url, init) => {
    if (url === '/api/lesson') return [200, { reply: 'Alpha.', step: 0, totalSteps: 3, done: false, lesson: { module: 'M', day: 1, title: 'T' }, lessonId: 'L-demo' }];
    if (url === '/api/chat') return [200, { reply: 'Sure.', model: 'm', course: { topic: 'Game Theory', slug: 'game-theory' } }];
    if (url === '/api/add-topic') { added = true; return [200, { slug: 'game-theory', status: 'existing', lessonCount: 29 }]; }
    if (url === '/api/progress') return added ? [500, { error: 'down' }] : [200, { active_topics: ['demo'] }];
    if (url === '/api/topics') return [200, []];
    return null;
  });
  await settle();
  f.$('#active-topic').value = 'demo';
  await f.$('#btn-next').click();
  await settle();
  await f.$('.nav-btn[data-view="chat"]').click();
  f.$('#chat-input').value = 'teach me game theory';
  await f.$('#btn-send').click();
  await settle();
  await f.$('#chat-messages').children.find((n) => n.className?.includes('course-offer')).children[0].click();
  await settle();
  await f.$('.nav-btn[data-view="learn"]').click();
  f.$('#lesson-input').value = 'my answer';
  await f.$('#btn-lesson-answer').click();
  await settle();
  expect(f.calls.some((c) => c.url === '/api/lesson' && JSON.parse(c.init.body).answer === 'my answer')).toBe(true);
  // and the chat never said the course was open
  expect(f.$('#chat-messages').children.some((n) => /is in Learn|is open in Learn/.test(n.innerHTML))).toBe(false);
});

// #272: onboarding is a guided chat: choices as buttons, then a short tour of the tabs.
function newStudent(onboard) {
  const f = frontend((url, init) => {
    if (url === '/api/user') return [200, { hasProfile: false, onboarded: false }];
    if (url === '/api/onboard') return onboard(JSON.parse(init.body));
    if (url === '/api/add-topic') return [200, { slug: 'game-theory', status: 'existing', lessonCount: 29 }];
    if (url === '/api/topics') return [200, []];
    if (url === '/api/lesson') return [200, { reply: 'First question?', step: 0, totalSteps: 3, done: false, lesson: { module: 'Basics', day: 1, title: 'Games' }, lessonId: 'L1' }];
    return null;
  });
  return f;
}
const onboardCalls = (f) => f.calls.filter((c) => c.url === '/api/onboard').map((c) => JSON.parse(c.init.body).message);

it('greets a new student by asking only their name', async () => {
  const f = newStudent(() => [200, { reply: 'Hi.' }]);
  await settle();
  expect(f.$('#onboarding-overlay').classList.contains('hidden')).toBe(false);
  expect(f.$('#onboarding-chat').children[0].innerHTML).toMatch(/What(&#39;|&#x27;|')s your name\?<\/div>$/); // and nothing more
  expect(f.$('#onboarding-options').classList.contains('hidden')).toBe(true);
});

it('shows an onboarding question\'s choices as buttons, and a tap answers with that text', async () => {
  const f = newStudent(({ message }) => (message === 'Sam'
    ? [200, { reply: 'Nice to meet you, Sam! What brings you here?', options: ['School', 'Work', 'Pure curiosity'] }]
    : [200, { reply: 'Which area are you curious about?', options: ['Science', 'Maths'] }]));
  await settle();
  f.$('#onboarding-input').value = 'Sam';
  await f.$('#btn-onboard-send').click();
  await settle();
  const box = f.$('#onboarding-options');
  expect(box.classList.contains('hidden')).toBe(false);
  expect(box.children.map((b) => b.textContent)).toEqual(['School', 'Work', 'Pure curiosity']);
  await box.children[1].click();
  await settle();
  expect(onboardCalls(f)).toEqual(['Sam', 'Work']);
  expect(box.children.map((b) => b.textContent)).toEqual(['Science', 'Maths']);
});

// Live, a model shown its own questions without their choices stopped offering any (0 of 4 runs).
it('sends the choices it showed back in the history, so the model keeps offering them', async () => {
  const f = newStudent(({ message }) => (message === 'Sam'
    ? [200, { reply: 'What brings you here?', options: ['School', 'Work'] }]
    : [200, { reply: 'Which area?' }]));
  await settle();
  f.$('#onboarding-input').value = 'Sam';
  await f.$('#btn-onboard-send').click();
  await settle();
  await f.$('#onboarding-options').children[0].click();
  await settle();
  const sent = JSON.parse(f.calls.filter((c) => c.url === '/api/onboard')[1].init.body);
  expect(sent.history).toEqual([{ role: 'user', content: 'Sam' }, { role: 'assistant', content: 'What brings you here?\n<OPTIONS>School | Work</OPTIONS>' }]);
});

it('sends one onboarding answer at a time, however fast the taps', async () => {
  let release;
  const f = newStudent(({ message }) => (message === 'Sam'
    ? [200, { reply: 'What brings you here?', options: ['School', 'Work'] }]
    : new Promise((r) => (release = r))));
  await settle();
  f.$('#onboarding-input').value = 'Sam';
  await f.$('#btn-onboard-send').click();
  await settle();
  const [school, work] = f.$('#onboarding-options').children;
  school.click();
  work.click(); // a second tap while the first answer is on its way
  await settle();
  expect(onboardCalls(f)).toEqual(['Sam', 'School']);
  // Review of #277: Browse would close the card under a reply that then opens the tour.
  expect(f.$('#btn-onboard-browse').disabled).toBe(true);
  release([200, { reply: 'Got it.' }]);
  await settle();
  expect(f.$('#btn-onboard-browse').disabled).toBe(false);
});

it('shows a short tour of the tabs once a course is chosen, and Start learning closes it', async () => {
  const f = newStudent(({ message }) => (message === 'Game theory'
    ? [200, { reply: 'Great pick. Your first lesson is ready.', confirmedTopic: 'game-theory' }]
    : [200, { reply: 'Hi.' }]));
  await settle();
  f.$('#onboarding-input').value = 'Game theory';
  await f.$('#btn-onboard-send').click();
  await settle();
  expect(f.$('#onboarding-tour').classList.contains('hidden')).toBe(false);
  expect(f.$('#onboarding-input-area').classList.contains('hidden')).toBe(true);
  expect(f.$('#onboarding-overlay').classList.contains('hidden')).toBe(false); // it waits for the student
  f.runTimers();
  expect(f.$('#onboarding-overlay').classList.contains('hidden')).toBe(false); // no timer closes it
  await f.$('#btn-tour-start').click();
  await settle();
  expect(f.$('#onboarding-overlay').classList.contains('hidden')).toBe(true);
});

// #271: the page renders links, lists and small headings, and nothing unsafe.
it('renders a safe link only where links are allowed, and never an unsafe one', () => {
  const { context } = frontend(() => null);
  const link = '[Nash](https://en.wikipedia.org/wiki/Nash_equilibrium)';
  expect(context.md(link)).toBe('Nash'); // off by default: user text, streaming, onboarding
  expect(context.md(link, { links: true })).toBe('<a href="https://en.wikipedia.org/wiki/Nash_equilibrium" target="_blank" rel="noopener noreferrer">Nash</a>');
  expect(context.md('[click](javascript:alert(1))', { links: true })).not.toContain('<a');
  expect(context.md('[x](https://a.example/"onmouseover="alert(1))', { links: true })).not.toMatch(/"onmouseover/);
  expect(context.md('[<img src=x onerror=alert(1)>](https://a.example/)', { links: true })).not.toContain('<img');
  // A * in a URL is part of it, not emphasis (review of #276).
  expect(context.md('[A* search](https://en.wikipedia.org/wiki/A*_search_algorithm) is *fast*', { links: true })).toBe('<a href="https://en.wikipedia.org/wiki/A*_search_algorithm" target="_blank" rel="noopener noreferrer">A* search</a> is <em>fast</em>');
  expect(context.md('[MASH](https://en.wikipedia.org/wiki/M*A*S*H_(TV_series))', { links: true })).toBe('<a href="https://en.wikipedia.org/wiki/M*A*S*H_(TV_series)" target="_blank" rel="noopener noreferrer">MASH</a>');
  expect(context.md('[Mercury](https://en.wikipedia.org/wiki/Mercury_(planet)).', { links: true })).toBe('<a href="https://en.wikipedia.org/wiki/Mercury_(planet)" target="_blank" rel="noopener noreferrer">Mercury</a>.');
});

it('renders numbered steps, bullets and a small heading', () => {
  const { context } = frontend(() => null);
  expect(context.md('### How it works\n1. First\n2. Then\n\n- one\n- two')).toBe('<h4 class="md-h">How it works</h4><ol><li>First</li><li>Then</li></ol><br><ul><li>one</li><li>two</li></ul>');
});

it('makes links clickable in the tutor\'s chat replies, not in the student\'s messages', async () => {
  const f = frontend((url) => (url === '/api/chat' ? [200, { reply: 'See [Vaccines](https://en.wikipedia.org/wiki/Vaccine).', model: 'm' }] : null));
  await settle();
  await f.$('.nav-btn[data-view="chat"]').click();
  f.$('#chat-input').value = 'Read [this](https://en.wikipedia.org/wiki/Vaccine)';
  await f.$('#btn-send').click();
  await settle();
  const kids = f.$('#chat-messages').children; // the double keeps the removed "Thinking..." in between
  const [mine, tutor] = [kids[0], kids.at(-1)];
  expect(mine.innerHTML).not.toContain('<a ');
  expect(tutor.innerHTML).toContain('<a href="https://en.wikipedia.org/wiki/Vaccine"');
});

// #270: a tap on the companion helps; "Hide" in its bubble is how it goes away.
it('shows a tip for the lesson that matches what is on screen', async () => {
  const f = await lessonWith([]);
  await f.$('#companion-tip').click();
  expect(f.$('#companion').classList.contains('hidden')).toBe(false);
  expect(f.$('#companion-says').textContent).toBe('Answer in your own words. A sentence or two is enough.'); // no suggested answers here
  f.$('#answer-options').children = [{}, {}]; // a question with suggested answers on screen
  f.$('#answer-options').classList.remove('hidden');
  await f.$('#companion-tip').click();
  expect(f.$('#companion-says').textContent).toBe('Tap a suggested answer, or answer in your own words.');
  await f.$('.nav-btn[data-view="chat"]').click();
  await f.$('.nav-btn[data-view="learn"]').click();
  await settle();
  expect(f.$('#companion-says').textContent).toBe('Ready when you are.'); // the tip was never the lesson's moment
});

it('a tip never replaces what the tab is waiting for', async () => {
  let reply;
  const pending = new Promise((r) => (reply = r));
  const f = frontend((url) => (url === '/api/chat' ? pending : url === '/api/topics' ? [200, []] : null));
  await settle();
  await f.$('.nav-btn[data-view="chat"]').click();
  f.$('#chat-input').value = 'a question';
  const sent = f.$('#btn-send').click();
  await settle();
  await f.$('#companion-tip').click(); // a tip while the reply is on its way
  expect(f.$('#companion-says').textContent).toBe('Ask me anything: a question, an example, or a quick explanation.');
  await f.$('.nav-btn[data-view="topics"]').click();
  await f.$('.nav-btn[data-view="chat"]').click();
  await settle();
  expect(f.$('#companion').dataset.state).toBe('thinking'); // back to what the chat is doing
  expect(f.$('#companion-says').textContent).toBe('Thinking it over.');
  reply([200, { reply: 'Answer.', model: 'm' }]);
  await sent; await settle();
});

it('shows a tip for the chat when the student taps the companion there', async () => {
  const f = frontend(() => null);
  await settle();
  await f.$('.nav-btn[data-view="chat"]').click();
  await settle();
  await f.$('#companion-tip').click();
  expect(f.$('#companion').classList.contains('hidden')).toBe(false);
  expect(f.$('#companion-says').textContent).toBe('Ask me anything: a question, an example, or a quick explanation.');
});

it('goes away only through Hide, and stays away for the session', async () => {
  const f = await lessonWith([]);
  await f.$('#companion-tip').click();
  await f.$('#companion-hide').click();
  expect(f.$('#companion').classList.contains('hidden')).toBe(true);
  await f.$('.nav-btn[data-view="chat"]').click();
  await settle();
  expect(f.$('#companion').classList.contains('hidden')).toBe(true);
});

// Review of #273: overlapping starts and a failed switch.
const lessonReply = (slug) => [200, { reply: `${slug}, lesson one.`, step: 0, totalSteps: 3, done: false, lesson: { module: 'M', day: 1, title: slug }, lessonId: `L-${slug}` }];

it('lets the newest lesson start win when an older one answers late', async () => {
  let late;
  const f = frontend((url, init) => {
    if (url !== '/api/lesson') return null;
    const { topicSlug, answer } = JSON.parse(init.body);
    if (answer) return [200, { reply: 'ok', step: 1, totalSteps: 3, done: false }];
    return topicSlug === 'beta' ? new Promise((resolve) => { late = () => resolve(lessonReply('beta')); }) : lessonReply(topicSlug);
  });
  await settle();
  f.$('#active-topic').value = 'beta';
  f.$('#btn-next').click(); // still pending
  await settle();
  f.$('#active-topic').value = 'gamma';
  f.context.startLesson(); // e.g. a second course offer
  await settle();
  late();
  await settle();
  expect(f.$('#lesson-meta').textContent).toBe('M — Day 1: gamma');
  f.$('#lesson-input').value = 'mine';
  await f.$('#btn-lesson-answer').click();
  await settle();
  const sent = JSON.parse(f.calls.findLast((c) => c.url === '/api/lesson').init.body);
  expect(sent).toMatchObject({ topicSlug: 'gamma', lessonId: 'L-gamma', answer: 'mine' });
});

it('takes no answer for the lesson it left when the new one fails to start', async () => {
  const f = frontend((url, init) => {
    if (url !== '/api/lesson') return null;
    return JSON.parse(init.body).topicSlug === 'beta' ? [500, { error: 'The tutor is unavailable right now.' }] : lessonReply('alpha');
  });
  await settle();
  f.$('#active-topic').value = 'alpha';
  await f.$('#btn-next').click();
  await settle();
  f.$('#active-topic').value = 'beta';
  await f.$('#btn-next').click();
  await settle();
  expect(f.$('#lesson-input-area').classList.contains('hidden')).toBe(true);
  f.$('#lesson-input').value = 'for alpha';
  await f.context.sendLessonAnswer();
  expect(f.calls.some((c) => c.url === '/api/lesson' && JSON.parse(c.init.body).answer)).toBe(false);
});

it('opens a course built from the chat once its first lessons are ready, even over an open lesson', async () => {
  const f = frontend((url, init) => {
    if (url === '/api/lesson') return lessonReply(JSON.parse(init.body).topicSlug);
    if (url === '/api/chat') return [200, { reply: 'Sure.', model: 'm', course: { topic: 'Bread', slug: null } }];
    if (url === '/api/add-topic') return [200, { slug: 'bread', status: 'queued', lessonCount: 0 }];
    if (url.startsWith('/api/topic-build?')) return [200, { slug: 'bread', status: 'building', phase: 'plan', lessonCount: 5 }];
    if (url === '/api/progress') return [200, { active_topics: ['alpha', 'bread'] }];
    if (url === '/api/topics') return [200, []];
    return null;
  });
  await settle();
  f.$('#active-topic').value = 'alpha';
  await f.$('#btn-next').click();
  await settle();
  await f.$('.nav-btn[data-view="chat"]').click();
  f.$('#chat-input').value = 'teach me to bake bread';
  await f.$('#btn-send').click();
  await settle();
  await f.$('#chat-messages').children.find((n) => n.className?.includes('course-offer')).children[0].click();
  await settle();
  const starts = f.calls.filter((c) => c.url === '/api/lesson').map((c) => JSON.parse(c.init.body).topicSlug);
  expect(starts).toEqual(['alpha', 'bread']);
});

// Review of #273, round 4: the latest choice opens, whatever answers first.
const offerTwice = async (f, courses) => {
  await f.$('.nav-btn[data-view="chat"]').click();
  for (const _ of courses) { f.$('#chat-input').value = 'teach me'; await f.$('#btn-send').click(); await settle(); }
  return f.$('#chat-messages').children.filter((n) => n.className?.includes('course-offer')).map((n) => n.children[0]);
};

it('opens the course tapped last, even when the one tapped first answers later', async () => {
  const offers = [{ topic: 'Alpha', slug: 'alpha' }, { topic: 'Beta', slug: 'beta' }];
  let release;
  const f = frontend((url, init) => {
    if (url === '/api/chat') return [200, { reply: 'Sure.', model: 'm', course: offers.shift() }];
    if (url === '/api/add-topic') {
      const { topic } = JSON.parse(init.body);
      const answer = [200, { slug: topic, status: 'existing', lessonCount: 9 }];
      return topic === 'alpha' ? new Promise((resolve) => { release = () => resolve(answer); }) : answer;
    }
    if (url === '/api/lesson') return lessonReply(JSON.parse(init.body).topicSlug);
    if (url === '/api/progress') return [200, { active_topics: ['alpha', 'beta'] }];
    if (url === '/api/topics') return [200, []];
    return null;
  });
  await settle();
  const [a, b] = await offerTwice(f, [1, 2]);
  a.click(); // still being added
  await settle();
  await b.click();
  await settle();
  release();
  await settle();
  expect(f.calls.filter((c) => c.url === '/api/lesson').map((c) => JSON.parse(c.init.body).topicSlug)).toEqual(['beta']);
  expect(a.disabled).toBe(false); // free for another try
});

it('does not open a course built from the chat over one chosen after it', async () => {
  const offers = [{ topic: 'Bread', slug: null }, { topic: 'Beta', slug: 'beta' }];
  let breadLessons = 0;
  const f = frontend((url, init) => {
    if (url === '/api/chat') return [200, { reply: 'Sure.', model: 'm', course: offers.shift() }];
    if (url === '/api/add-topic') {
      const { topic } = JSON.parse(init.body);
      return topic === 'beta' ? [200, { slug: 'beta', status: 'existing', lessonCount: 9 }] : [200, { slug: 'bread', status: 'queued', lessonCount: breadLessons }];
    }
    if (url.startsWith('/api/topic-build?')) return [200, { slug: 'bread', status: 'building', phase: 'plan', lessonCount: breadLessons }];
    if (url === '/api/lesson') return lessonReply(JSON.parse(init.body).topicSlug);
    if (url === '/api/progress') return [200, { active_topics: ['bread', 'beta'] }];
    if (url === '/api/topics') return [200, []];
    return null;
  });
  await settle();
  const [bread, beta] = await offerTwice(f, [1, 2]);
  await bread.click(); // building, no lessons yet
  await settle();
  await beta.click(); // opens now
  await settle();
  breadLessons = 5; // Bread's starter lessons are ready
  f.runTimers();
  await settle();
  expect(f.calls.filter((c) => c.url === '/api/lesson').map((c) => JSON.parse(c.init.body).topicSlug)).toEqual(['beta']);
  expect(f.$('#lesson-meta').textContent).toBe('M — Day 1: beta');
});

it('does not say a course is open when its first lesson fails to start', async () => {
  const f = frontend((url) => {
    if (url === '/api/chat') return [200, { reply: 'Sure.', model: 'm', course: { topic: 'Beta', slug: 'beta' } }];
    if (url === '/api/add-topic') return [200, { slug: 'beta', status: 'existing', lessonCount: 9 }];
    if (url === '/api/lesson') return [500, { error: 'The tutor is unavailable right now.' }];
    if (url === '/api/progress') return [200, { active_topics: ['beta'] }];
    if (url === '/api/topics') return [200, []];
    return null;
  });
  await settle();
  const [beta] = await offerTwice(f, [1]);
  await beta.click();
  await settle();
  expect(f.$('#chat-messages').children.some((n) => /open in Learn/.test(n.innerHTML))).toBe(false);
  expect(beta.disabled).toBe(false);
});

// Review of #273, round 5.
it('does not let a build finishing during the next lesson\'s load take the screen', async () => {
  const offers = [{ topic: 'Bread', slug: null }, { topic: 'Beta', slug: 'beta' }];
  let breadLessons = 0;
  let releaseBeta;
  const f = frontend((url, init) => {
    if (url === '/api/chat') return [200, { reply: 'Sure.', model: 'm', course: offers.shift() }];
    if (url === '/api/add-topic') {
      const { topic } = JSON.parse(init.body);
      return topic === 'beta' ? [200, { slug: 'beta', status: 'existing', lessonCount: 9 }] : [200, { slug: 'bread', status: 'queued', lessonCount: breadLessons }];
    }
    if (url.startsWith('/api/topic-build?')) return [200, { slug: 'bread', status: 'building', phase: 'plan', lessonCount: breadLessons }];
    if (url === '/api/lesson') {
      const { topicSlug } = JSON.parse(init.body);
      return topicSlug === 'beta' ? new Promise((resolve) => { releaseBeta = () => resolve(lessonReply('beta')); }) : lessonReply(topicSlug);
    }
    if (url === '/api/progress') return [200, { active_topics: ['bread', 'beta'] }];
    if (url === '/api/topics') return [200, []];
    return null;
  });
  await settle();
  const [bread, beta] = await offerTwice(f, [1, 2]);
  await bread.click();
  await settle();
  beta.click(); // Beta's lesson is loading
  await settle();
  breadLessons = 5;
  f.runTimers(); // Bread's starter lessons arrive meanwhile
  await settle();
  releaseBeta();
  await settle();
  expect(f.calls.filter((c) => c.url === '/api/lesson').map((c) => JSON.parse(c.init.body).topicSlug)).toEqual(['beta']);
  expect(f.$('#lesson-meta').textContent).toBe('M — Day 1: beta');
});

it('says a finished course is finished, not open', async () => {
  const f = frontend((url) => {
    if (url === '/api/chat') return [200, { reply: 'Sure.', model: 'm', course: { topic: 'Beta', slug: 'beta' } }];
    if (url === '/api/add-topic') return [200, { slug: 'beta', status: 'existing', lessonCount: 9 }];
    if (url === '/api/lesson') return [200, { done: true, message: 'All lessons completed!' }];
    if (url === '/api/progress') return [200, { active_topics: ['beta'] }];
    if (url === '/api/topics') return [200, []];
    return null;
  });
  await settle();
  const [beta] = await offerTwice(f, [1]);
  await beta.click();
  await settle();
  const said = f.$('#chat-messages').children.map((n) => n.innerHTML).join('\n');
  expect(said).not.toMatch(/open in Learn/);
  expect(said).toMatch(/already finished every lesson in <strong>Beta<\/strong>/);
});
