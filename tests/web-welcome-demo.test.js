import { it, expect, vi } from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';

// Runs the landing page's real script against a DOM double built from index.html's
// ids (#153). `stored` seeds localStorage; null makes the browser refuse storage.
// `search` is the page's query string.
function landing(respond, stored = {}, search = '', { user = null, catalog = [] } = {}) {
  const html = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  const source = fs.readFileSync(new URL('../public/welcome.js', import.meta.url), 'utf8');
  const created = [], htmlWrites = [], calls = [];
  const element = (tag, attrs = '') => {
    const listeners = {};
    return {
      tagName: tag.toUpperCase(),
      className: attrs.match(/\bclass="([^"]*)"/)?.[1] ?? '',
      href: (attrs.match(/\bhref="([^"]*)"/)?.[1] ?? '').replaceAll('&amp;', '&'),
      hidden: /(^|\s)hidden(\s|=|$)/.test(attrs),
      value: '', textContent: '', children: [], attributes: {},
      set innerHTML(value) { htmlWrites.push(value); },
      addEventListener(name, fn) { listeners[name] = fn; },
      dispatch(name, event) { return listeners[name]?.(event); },
      append(...nodes) { this.children.push(...nodes); },
      replaceChildren(...nodes) { this.children = nodes; },
      setAttribute(name, value) { this.attributes[name] = value; },
      focus() {},
    };
  };
  const nodes = new Map([...html.matchAll(/<(\w+)([^>]*\bid="([^"]+)"[^>]*)>/g)].map(([, tag, attrs, id]) => [`#${id}`, element(tag, attrs)]));
  const storage = stored && new Map(Object.entries(stored));
  const context = vm.createContext({
    document: {
      querySelector: (s) => nodes.get(s) ?? null,
      createElement: (tag) => { const node = element(tag); created.push(node); return node; },
    },
    fetch: async (url, init = {}) => {
      calls.push({ url, init });
      if (url === '/api/demo') return respond(init);
      return Response.json(url === '/api/catalog' ? catalog : { user });
    },
    location: { search, pathname: '/', hash: '' },
    history: { replaceState: vi.fn() },
    Response, URLSearchParams, console,
  });
  if (storage) context.localStorage = { getItem: (k) => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, String(v)) };
  else Object.defineProperty(context, 'localStorage', { get() { throw new Error('SecurityError: storage is disabled'); } });
  context.window = context;
  vm.runInContext(source, context);
  return { $: (s) => nodes.get(s), calls, created, htmlWrites, storage, context, html };
}
const settle = async () => { for (let i = 0; i < 6; i++) await new Promise(setImmediate); };
async function answer(page, text) {
  page.$('#demo-answer').value = text;
  await page.$('#demo-form').dispatch('submit', { preventDefault() {} });
  await settle();
}
const bubbles = (page) => page.$('#demo-thread').children.map((n) => (n.children.length ? n.children.at(-1).textContent : n.textContent));

it('swaps the sample for a form, sends the answer, renders the reply as text, then offers signup into the lesson', async () => {
  const reply = '<img src=x onerror=alert(1)>What would make them trust each other?';
  const page = landing(() => Response.json({ reply }));
  await settle();
  expect(page.$('#demo-sample').hidden).toBe(true);
  expect(page.$('#demo-form').hidden).toBe(false);
  expect(page.$('#demo-next').hidden).toBe(true);

  await answer(page, '  What if they took turns?  ');
  const sent = page.calls.filter((c) => c.url === '/api/demo');
  expect(sent).toHaveLength(1);
  expect(sent[0].init.method).toBe('POST');
  expect(JSON.parse(sent[0].init.body)).toEqual({ answer: 'What if they took turns?' });

  expect(bubbles(page)).toEqual(['What if they took turns?', reply]);
  expect(page.htmlWrites).toEqual([]);
  expect(page.created.some((n) => n.tagName === 'IMG')).toBe(false);

  expect(page.$('#demo-form').hidden).toBe(true);
  expect(page.$('#demo-next').hidden).toBe(false);
  expect(page.$('#demo-signup').href).toBe('/login.html?mode=signup&topic=game-theory');
  expect(page.storage.get('opentutor-demo-used')).toBeTruthy();
});

it('shows the call to action instead of the form once this browser has had its reply', async () => {
  const page = landing(() => { throw new Error('the demo must not be called'); }, { 'opentutor-demo-used': '1' });
  await settle();
  expect(page.$('#demo-form').hidden).toBe(true);
  expect(page.$('#demo-sample').hidden).toBe(true);
  expect(page.$('#demo-next').hidden).toBe(false);
  expect(page.calls.some((c) => c.url === '/api/demo')).toBe(false);
});

it('offers signup with a short note when the demo is at its cap, fails, or cannot be reached', async () => {
  for (const [respond, note] of [
    [() => Response.json({ error: 'Busy.', signup: true }, { status: 429 }), /^The demo is busy right now\./],
    [() => Response.json({ error: 'openrouter: HTTP 402' }, { status: 503 }), /^The tutor could not reply/],
    [() => Promise.reject(new TypeError('Failed to fetch')), /^The tutor could not reply/],
  ]) {
    const page = landing(respond);
    await settle();
    await answer(page, 'Take turns');
    expect(bubbles(page)[1]).toMatch(note);
    expect(page.$('#demo-form').hidden).toBe(true);
    expect(page.$('#demo-next').hidden).toBe(false);
    expect(page.storage.has('opentutor-demo-used')).toBe(false);
  }
});

it('still runs when the browser refuses storage', async () => {
  const page = landing(() => Response.json({ reply: 'Why turns?' }), null);
  await settle();
  expect(page.$('#demo-form').hidden).toBe(false);
  await answer(page, 'Take turns');
  expect(bubbles(page)).toEqual(['Take turns', 'Why turns?']);
  expect(page.$('#demo-next').hidden).toBe(false);
});

// #160: where a student lands after deleting their account. Checked before any request
// settles and with storage refused: the notice needs nothing but the address.
it.each([
  ['?deleted=1', '/'],
  ['?deleted=1&ref=mail', '/?ref=mail'],
])('confirms the deletion for %s, then drops the flag so a reload does not repeat it', (search, left) => {
  const page = landing(() => Response.json({}), null, search);
  expect(page.$('#deleted-notice').textContent).toBe('Your account and learning data have been deleted.');
  expect(page.html).toMatch(/<p id="deleted-notice"[^>]*\brole="status"/);
  expect(page.context.history.replaceState).toHaveBeenCalledWith(null, '', left);
});

it.each([[''], ['?deleted=0'], ['?deleted=yes']])('says nothing about a deletion for %j', (search) => {
  const page = landing(() => Response.json({}), {}, search);
  expect(page.$('#deleted-notice').textContent).toBe('');
  expect(page.context.history.replaceState).not.toHaveBeenCalled();
});

// Codex on #176: a signed-in visitor is sent to their lessons, never to a signup form.
it('points every account call to action at the learning app once the visitor is signed in', async () => {
  const catalog = [{ slug: 'game-theory', topic: 'Game theory', total: 29, preview: ['What is a game?'] }];
  const page = landing(() => Response.json({}), {}, '', { user: { id: 'acct-1' }, catalog });
  await settle();
  for (const id of ['#account-link', '#hero-signup', '#closing-signup']) {
    expect(page.$(id).href, id).toBe('/learn.html');
    expect(page.$(id).textContent, id).toBe('Continue learning');
  }
  expect(page.$('#demo-signup').href).toBe('/learn.html?topic=game-theory');
  const start = page.created.filter((n) => n.textContent === 'Start this topic').at(-1);
  expect(start.href).toBe('/learn.html?topic=game-theory');
});

// #251: each catalog card says how hard the topic is and what to know first.
it('shows a catalog card\'s level and prerequisites, as text', async () => {
  const catalog = [{ slug: 'knots', topic: 'Knots', total: 5, level: 'beginner', prerequisites: ['<b>curiosity</b>', 'string'], preview: ['Loops'] }];
  const page = landing(() => Response.json({}), {}, '', { catalog });
  await settle();
  const texts = page.created.map((n) => n.textContent);
  expect(texts).toContain('Beginner');
  expect(texts).toContain('Before you start: <b>curiosity</b>, string. Rusty on any of these? Ask the tutor as you go.');
  expect(page.htmlWrites.join('')).not.toContain('curiosity'); // textContent, never HTML
});

it('leaves out the level and prerequisites a card does not have', async () => {
  const catalog = [{ slug: 'knots', topic: 'Knots', total: 5, level: null, prerequisites: [], preview: ['Loops'] }];
  const page = landing(() => Response.json({}), {}, '', { catalog });
  await settle();
  const texts = page.created.map((n) => n.textContent);
  expect(texts.some((t) => /Before you start|null/.test(t))).toBe(false);
});
