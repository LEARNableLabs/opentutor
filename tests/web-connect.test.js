import { it, expect, vi } from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';

// Runs the real frontend against a DOM double. `window` is the global, as in a
// browser, so app.js's fetch wrapper is the fetch every call goes through.
function frontend(route, search = '') {
  const html = fs.readFileSync(new URL('../public/learn.html', import.meta.url), 'utf8');
  const source = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  const element = (classes = '') => {
    const names = new Set(classes.split(' '));
    const listeners = new Map();
    return {
      value: '', textContent: '', innerHTML: '', disabled: false, dataset: {}, style: {}, children: [],
      classList: { add: (v) => names.add(v), remove: (v) => names.delete(v), contains: (v) => names.has(v), toggle: (v, force) => (force ? names.add(v) : names.delete(v)) },
      addEventListener: (name, fn) => listeners.set(name, fn),
      click() { return listeners.get('click')?.(); },
      focus() {}, appendChild(child) { this.children.push(child); }, remove() {}, querySelectorAll() { return []; },
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
    Response, Headers, URLSearchParams, console, setTimeout: () => 0, clearTimeout() {},
    fetch: async (url, init = {}) => {
      calls.push({ url, init });
      const [status, body] = route(url, init) || base[url] || [200, {}];
      return new Response(JSON.stringify(body), { status });
    },
  });
  context.window = context;
  vm.runInContext(source, context);
  return { $, calls, context };
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
