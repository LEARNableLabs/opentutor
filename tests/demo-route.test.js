import { it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { TutorStore } from '../lib/core/store.js';
import { SupabaseStore } from '../lib/core/supabase-store.js';
import { demoHandler, DEMO_PER_IP, DEMO_MAX_CHARS } from '../api/_lib/demo.js';

// The landing page's example lesson (#153): a public route that spends the
// deployment's key, run against a real store on a temp root and a fake model.
let root, store, host;

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'ot-demo-'));
  vi.stubEnv('OPENTUTOR_DATA_DIR', '');
  vi.stubEnv('OPENTUTOR_PUBLIC_URL', '');
  vi.stubEnv('VERCEL', '');
  vi.stubEnv('SUPABASE_SECRET_KEY', 'server-secret');
  store = new TutorStore(root);
  host = { generate: vi.fn(async () => ({ text: 'Interesting. What would keep the turns going?' })) };
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  store.close();
  fs.rmSync(root, { recursive: true, force: true });
  vi.unstubAllEnvs();
});

const request = ({ method = 'POST', answer = 'Take turns each week.', body = { answer }, ip = '203.0.113.7', origin = 'http://localhost:3000', headers = { 'x-forwarded-for': `${ip}, 10.0.0.1` }, socket } = {}) =>
  ({ method, body, socket, headers: { host: 'localhost:3000', origin, ...headers } });
// Like Node's, this response takes one set of headers.
function response() {
  return {
    headersSent: false, headers: {},
    setHeader(k, v) { if (this.headersSent) throw new Error('ERR_HTTP_HEADERS_SENT'); this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(body) { if (this.headersSent) throw new Error('ERR_HTTP_HEADERS_SENT'); this.headersSent = true; this.body = body; return this; },
  };
}
async function call(options, limits) {
  const res = response();
  await demoHandler({ getStore: async () => store, host: () => host, ...limits })(request(options), res);
  return res;
}
const rows = () => store.listKV('demo:');

it('refuses anything but a same-origin POST with 1 to 300 characters, before spending anything', async () => {
  expect((await call({ method: 'GET' })).statusCode).toBe(405);
  expect((await call({ origin: 'https://elsewhere.example' })).statusCode).toBe(403);
  expect((await call({ headers: { origin: undefined } })).statusCode).toBe(403);
  for (const body of [{}, null, { answer: '' }, { answer: '   ' }, { answer: 42 }, { answer: ['a'] }, { answer: 'x'.repeat(DEMO_MAX_CHARS + 1) }])
    expect((await call({ body })).statusCode).toBe(400);
  expect(host.generate).not.toHaveBeenCalled();
  expect(rows()).toEqual([]);
});

it('replies with one capped follow-up on the cheap model: the card in the prompt, the visitor as the user message', async () => {
  const card = fs.readFileSync('public/index.html', 'utf8')
    .match(/<div class="conversation">\s*<span[^>]*>✦<\/span>\s*<p>([\s\S]*?)<\/p>/)[1].replace(/\s+/g, ' ').trim();
  expect(card).toMatch(/^Two neighbours share a garden\..*What would you try\?$/);

  const res = await call({ answer: `  ${'x'.repeat(DEMO_MAX_CHARS - 2)} a` });
  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({ reply: 'Interesting. What would keep the turns going?' });
  expect(res.headers['Cache-Control']).toBe('private, no-store');
  const [system, messages, options] = host.generate.mock.calls[0];
  expect(system.replace(/\s+/g, ' ')).toContain(card);
  expect(messages).toEqual([{ role: 'user', content: `${'x'.repeat(DEMO_MAX_CHARS - 2)} a` }]);
  expect(system).not.toContain('xxxx');
  expect(options.model).toBe('cheap');

  host.generate.mockResolvedValueOnce({ text: 'y'.repeat(2000) });
  expect((await call({ ip: '198.51.100.1' })).body.reply).toHaveLength(500);
});

it('gives one address 3 replies a day, then offers signup without calling the model', async () => {
  for (let i = 0; i < DEMO_PER_IP; i++) expect((await call()).statusCode).toBe(200);
  const fourth = await call();
  expect(fourth.statusCode).toBe(429);
  expect(fourth.body).toMatchObject({ signup: true });
  expect(fourth.body.error).toEqual(expect.any(String));
  expect(host.generate).toHaveBeenCalledTimes(DEMO_PER_IP);
  expect((await call({ ip: '198.51.100.9' })).statusCode).toBe(200);
});

it('stops every address at the daily cap', async () => {
  for (const ip of ['198.51.100.1', '198.51.100.2']) expect((await call({ ip }, { perDay: 2 })).statusCode).toBe(200);
  const third = await call({ ip: '198.51.100.3' }, { perDay: 2 });
  expect(third.statusCode).toBe(429);
  expect(third.body.signup).toBe(true);
  expect(host.generate).toHaveBeenCalledTimes(2);
  // A full day claims nothing more, not even the new address's own slot.
  expect(rows().filter((r) => r.key.startsWith('demo:ip:'))).toHaveLength(2);
});

it('holds both caps when requests arrive at the same time', async () => {
  const many = await Promise.all(Array.from({ length: 12 }, (_, i) => call({ ip: `198.51.100.${i}` }, { perDay: 5 })));
  expect(many.filter((r) => r.statusCode === 200)).toHaveLength(5);
  expect(many.filter((r) => r.statusCode !== 200).every((r) => r.statusCode === 429)).toBe(true);
  const same = await Promise.all(Array.from({ length: 10 }, () => call()));
  expect(same.filter((r) => r.statusCode === 200)).toHaveLength(DEMO_PER_IP);
  expect(host.generate).toHaveBeenCalledTimes(5 + DEMO_PER_IP);
});

it('counts the first forwarded address, else x-real-ip, else the socket, and stores none of them', async () => {
  const sources = [
    { headers: { 'x-forwarded-for': '203.0.113.7' } },
    { headers: { 'x-forwarded-for': ' 203.0.113.7 , 10.9.9.9' } },
    { headers: { 'x-real-ip': '203.0.113.7' } },
    { headers: {}, socket: { remoteAddress: '203.0.113.7' } },
  ];
  const results = [];
  for (const source of sources) results.push((await call(source)).statusCode);
  expect(results).toEqual([200, 200, 200, 429]);
  expect((await call({ headers: {}, socket: { remoteAddress: '2001:db8::1' } })).statusCode).toBe(200);

  const all = store.listKV('');
  expect(all.length).toBeGreaterThan(0);
  for (const { key, value } of all) expect(`${key} ${value}`).not.toMatch(/203\.0\.113\.7|2001:db8|10\.9\.9\.9/);
  expect(all.filter((r) => /^demo:ip:\d{4}-\d\d-\d\d:[0-9a-f]{16}:\d$/.test(r.key))).toHaveLength(4);
});

it('answers a provider failure in its own words, never the provider\'s', async () => {
  host.generate.mockRejectedValueOnce(Object.assign(new Error('openrouter: HTTP 402 {"error":{"message":"Insufficient credits"}}'), { status: 402 }));
  const res = await call();
  expect(res.statusCode).toBeGreaterThanOrEqual(500);
  expect(JSON.stringify(res.body)).not.toMatch(/credits|openrouter|402/i);
  expect(res.body.error).toEqual(expect.any(String));
});

it('deletes earlier days\' rows when a new day starts, and gives each address its replies again', async () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-09-23T23:59:00Z'));
  for (let i = 0; i < DEMO_PER_IP; i++) await call();
  await call({ ip: '198.51.100.1' });
  expect((await call()).statusCode).toBe(429);
  expect(rows().length).toBe(8);

  vi.setSystemTime(new Date('2026-09-24T00:01:00Z'));
  expect((await call()).statusCode).toBe(200);
  const keys = rows().map((r) => r.key);
  expect(keys).toHaveLength(2);
  expect(keys.every((k) => k.includes(':2026-09-24:'))).toBe(true);
});

it('is served by the catalog function, which vercel.json points /api/demo at', async () => {
  const { default: catalog } = await import('../api/catalog.js');
  const demo = response();
  await catalog({ method: 'GET', query: { via: 'demo' }, headers: {} }, demo);
  expect(demo.statusCode).toBe(405);
  const list = response();
  await catalog({ method: 'GET', query: {}, headers: {} }, list);
  expect(list.statusCode).toBe(200);
  expect(list.body.some((t) => t.slug === 'game-theory')).toBe(true);
});

// The sweep deletes in the root store, beside the owner's progress and the account
// registry. An empty, short or wildcard prefix would reach every row there.
it('refuses a bulk kv delete that could reach more than the rows it names, on both stores', async () => {
  for (const bad of ['', 'demo:', 'demo:%', 'demo:day_2026', 'demo:day\\2026', null]) {
    expect(() => store.deleteKVBefore(bad, '2026-09-24')).toThrow(/broad kv delete/);
  }
  await expect(new SupabaseStore(root, { client: {} }).deleteKVBefore('', '2026-09-24')).rejects.toThrow(/broad kv delete/);

  for (const key of ['demo:day:2026-01-01:1', 'demo:day:2026-09-23:7', 'demo:day:2026-09-24:1']) store.writeKV(key, 'x');
  store.writeKV('progress', '{"active_topics":[]}');
  store.deleteKVBefore('demo:day:', '2026-09-24');
  expect(store.listKV('demo:day:').map((r) => r.key)).toEqual(['demo:day:2026-09-24:1']);
  expect(store.readKV('progress')).toBe('{"active_topics":[]}');
});

// On Supabase a listing stops at the project's max rows, so a sweep that first lists
// the dates to delete can miss the oldest ones. The sweep must not depend on a listing.
it('clears every earlier day, even when a listing of demo rows would come back truncated', async () => {
  for (const day of ['2026-08-01', '2026-09-01', '2026-09-22', '2026-09-23']) {
    store.insertKV(`demo:day:${day}:1`, 'x');
    store.insertKV(`demo:ip:${day}:abcdef0123456789:1`, 'x');
  }
  const list = store.listKV.bind(store);
  // A first page that only reaches the newest earlier day, as a capped response might.
  vi.spyOn(store, 'listKV').mockImplementation((prefix) =>
    prefix === 'demo:' ? list(prefix).filter((r) => r.key.includes(':2026-09-23:')) : list(prefix));
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-09-24T00:01:00Z'));

  expect((await call()).statusCode).toBe(200);
  expect(list('demo:').map((r) => r.key).every((k) => k.includes(':2026-09-24:'))).toBe(true);
});
