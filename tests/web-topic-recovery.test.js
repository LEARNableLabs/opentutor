import { it, expect } from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';

// Execute the actual frontend with a DOM double. This exercises the recovery
// path from a refused onboarding topic through browsing to a valid activation.
function frontend({ builds = [], buildStatus = null } = {}) {
  const html = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  const source = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  const element = (classes = '') => {
    const names = new Set(classes.split(' '));
    const listeners = new Map();
    return {
      value: '', textContent: '', innerHTML: '', disabled: false,
      dataset: {}, style: {}, children: [], focused: false,
      classList: { add: (v) => names.add(v), remove: (v) => names.delete(v), contains: (v) => names.has(v), toggle: (v, force) => force ? names.add(v) : names.delete(v) },
      addEventListener: (name, fn) => listeners.set(name, fn),
      click() { return listeners.get('click')?.(); },
      focus() { this.focused = true; },
      appendChild(child) { this.children.push(child); },
      remove() {}, querySelectorAll() { return []; },
    };
  };
  const nodes = new Map([...html.matchAll(/<[^>]*\bid="([^"]+)"[^>]*>/g)].map(([tag, id]) =>
    [`#${id}`, element(tag.match(/class="([^"]+)"/)?.[1])],
  ));
  const nav = [...html.matchAll(/<button[^>]*data-view="([^"]+)"[^>]*>/g)].map(([, view]) => {
    const node = element('nav-btn');
    node.dataset.view = view;
    return node;
  });
  const $ = (selector) => nodes.get(selector) || nav.find((n) => selector === `.nav-btn[data-view="${n.dataset.view}"]`);
  let activeTopics = [];
  const calls = [];
  const timers = [];
  const fetch = async (url, init) => {
    calls.push(url);
    let body, status = 200;
    if (url.startsWith('/api/topic-build?')) body = buildStatus;
    else if (url === '/api/lesson') body = { done: false, step: 0, response: 'First lesson', lesson: { title: 'Starter 1' } };
    else if (url === '/api/user') body = { hasProfile: false };
    else if (url === '/api/topic-build') body = builds;
    else if (url === '/api/progress') body = { active_topics: activeTopics };
    else if (url === '/api/topics') body = [{ slug: 'game-theory', topic: 'Game theory', completed: 0, total: 29, percent: 0 }];
    else if (url === '/api/onboard') body = { reply: 'Let us try that topic.', confirmedTopic: 'never-built' };
    else if (url === '/api/add-topic') {
      if (buildStatus && JSON.parse(init.body).topic === buildStatus.slug) {
        activeTopics = [buildStatus.slug]; body = buildStatus;
      } else if (JSON.parse(init.body).topic === 'game-theory') {
        activeTopics = ['game-theory'];
        body = { slug: 'game-theory', status: 'existing', lessonCount: 29 };
      } else {
        status = 501;
        body = { error: 'Custom topic generation is not available. Choose an available topic from the Topics list.' };
      }
    } else throw new Error(`Unexpected request: ${url}`);
    return new Response(JSON.stringify(body), { status });
  };
  const context = vm.createContext({
    document: {
      querySelector: $, createElement: () => element(),
      querySelectorAll: (s) => s === '.nav-btn' ? nav : ['learn', 'topics', 'chat'].map((v) => $(`#view-${v}`)),
    },
    localStorage: { getItem: () => null }, window: { fetch }, fetch, Headers, console,
    setTimeout: (fn) => timers.push(fn), clearTimeout() {},
  });
  vm.runInContext(source, context);
  return { $, context, calls, timers };
}

const settle = () => new Promise(setImmediate);

it('lets a student recover from a refused onboarding topic by browsing and activating an available one', async () => {
  const { $, context, calls, timers } = frontend();
  await settle();
  expect($('#onboarding-overlay').classList.contains('hidden')).toBe(false);

  $('#onboarding-input').value = 'Teach me a topic without a curriculum';
  await $('#btn-onboard-send').click();
  expect($('#onboarding-chat').children.some((n) => n.innerHTML.includes('Error: Custom topic generation'))).toBe(true);
  expect(timers).toHaveLength(0);
  expect($('#btn-onboard-send').disabled).toBe(false);

  await $('#btn-onboard-browse').click();
  await settle();
  expect($('#onboarding-overlay').classList.contains('hidden')).toBe(true);
  expect($('#view-topics').style.display).toBe('block');
  expect($('#search-topics').focused).toBe(true);
  expect(calls).toContain('/api/topics');
  expect($('#topic-list').innerHTML).toContain('Game theory');

  await context.selectTopic('game-theory');
  await settle();
  expect($('#active-topic').value).toBe('game-theory');
  expect($('#view-learn').style.display).toBe('block');
  expect($('#topic-error').textContent).toBe('');
});


it('restores a pending topic after reload and starts its saved starter lessons', async () => {
  const { $, calls } = frontend({builds:[{slug:'knots',status:'queued',lessonCount:0}],buildStatus:{slug:'knots',status:'ready',phase:'ready',lessonCount:6,approved:true}});
  await settle(); await settle();
  expect(calls).toContain('/api/topic-build?slug=knots');
  expect(calls).toContain('/api/add-topic');
  expect(calls).toContain('/api/lesson');
  expect($('#active-topic').value).toBe('knots');
  expect($('#topic-build-status').textContent).toBe('Full curriculum ready.');
});
it('offers retry without claiming nonexistent lessons were saved', async () => {
  const { $ } = frontend({builds:[{slug:'knots',status:'failed',lessonCount:0}],buildStatus:{slug:'knots',status:'failed',phase:'quick',lessonCount:0}});
  await settle();
  expect($('#topic-build-status').textContent).toContain('Starter lessons could not');
  expect($('#btn-retry-build').classList.contains('hidden')).toBe(false);
});
