import { it, expect } from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';

// Execute the actual frontend with a DOM double. This exercises the recovery
// path from a refused onboarding topic through browsing to a valid activation.
function frontend() {
  const html = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  const source = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  const element = (classes = '') => {
    const names = new Set(classes.split(' '));
    const listeners = new Map();
    return {
      value: '', textContent: '', innerHTML: '', disabled: false,
      dataset: {}, style: {}, children: [], focused: false,
      classList: { add: (v) => names.add(v), remove: (v) => names.delete(v), contains: (v) => names.has(v) },
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
    if (url === '/api/user') body = { hasProfile: false };
    else if (url === '/api/progress') body = { active_topics: activeTopics };
    else if (url === '/api/topics') body = [{ slug: 'game-theory', topic: 'Game theory', completed: 0, total: 29, percent: 0 }];
    else if (url === '/api/onboard') body = { reply: 'Let us try that topic.', confirmedTopic: 'never-built' };
    else if (url === '/api/add-topic') {
      if (JSON.parse(init.body).topic === 'game-theory') {
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
    setTimeout: (fn) => timers.push(fn),
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
