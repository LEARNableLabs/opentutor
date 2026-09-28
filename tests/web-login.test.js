import { it, expect, vi } from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';

// login.js against a DOM double: where a visitor who is already signed in ends up. Codex on
// #176: a signup link followed before the landing page's account check settles must not
// leave a signed-in student on a redundant signup form.
function loginPage(search, account) {
  const html = fs.readFileSync(new URL('../public/login.html', import.meta.url), 'utf8');
  const source = fs.readFileSync(new URL('../public/login.js', import.meta.url), 'utf8');
  const element = () => ({
    textContent: '', hidden: false, children: [],
    addEventListener() {}, append(...n) { this.children.push(...n); }, replaceChildren(...n) { this.children = n; },
  });
  const nodes = new Map([...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => [`#${id}`, element()]));
  const storage = new Map();
  const context = vm.createContext({
    document: { querySelector: (s) => nodes.get(s) ?? null, createElement: () => element() },
    location: { search, replace: vi.fn(), assign: vi.fn() },
    history: { replaceState: vi.fn() },
    localStorage: { getItem: (k) => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: (k) => storage.delete(k) },
    fetch: async () => Response.json(account),
    Response, URLSearchParams, console,
  });
  context.window = context;
  vm.runInContext(source, context);
  return context;
}
const settle = async () => { for (let i = 0; i < 6; i++) await new Promise(setImmediate); };

it.each(['login', 'signup'])('sends a signed-in visitor on the %s form straight to their lessons, keeping the topic', async (mode) => {
  const page = loginPage(`?mode=${mode}&topic=game-theory`, { user: { id: 'acct-1' }, available: true });
  await settle();
  expect(page.location.replace).toHaveBeenCalledWith('/learn.html?topic=game-theory');
});

it('leaves a signed-out visitor on the signup form', async () => {
  const page = loginPage('?mode=signup', { user: null, available: true });
  await settle();
  expect(page.location.replace).not.toHaveBeenCalled();
});
