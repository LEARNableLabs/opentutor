import { it, expect } from 'vitest';

// #228 on Vercel: the platform parses a JSON body when a route first reads `req.body`, and throws
// on one that isn't JSON. Inside a route's try that throw became its 500: production answered a
// malformed body with 500 on /api/lesson, /api/onboard and /api/user.
const ROUTES = {
  account: () => import('../api/account.js'),
  'add-topic': () => import('../api/add-topic.js'),
  catalog: () => import('../api/catalog.js'),
  chat: () => import('../api/chat.js'),
  lesson: () => import('../api/lesson.js'),
  onboard: () => import('../api/onboard.js'),
  user: () => import('../api/user.js'),
  'admin/students': () => import('../api/admin/students.js'),
};

const call = async (handler, req) => {
  let status, sent;
  const res = { setHeader() {}, status(code) { status = code; return this; }, json(body) { sent = body; return this; }, end() { return this; } };
  await handler({ headers: {}, query: {}, ...req }, res);
  return { status, sent };
};

// Review of #232: a body that parses but isn't an object reached the route: `null` was a 500,
// and `[]` or `"x"` saved a blank profile.
it.each([['null', null], ['an array', []], ['a string', 'x'], ['no body', undefined]])('refuses a POST whose body is %s', async (_case, body) => {
  const { default: handler } = await ROUTES.user();
  expect((await call(handler, { method: 'POST', body })).status).toBe(400);
});

it('leaves a GET, which has no body, to the route', async () => {
  const { default: handler } = await ROUTES.catalog();
  expect((await call(handler, { method: 'GET' })).status).toBe(200);
});

it.each(Object.keys(ROUTES))('answers a body Vercel cannot parse with 400 on api/%s', async (route) => {
  const { default: handler } = await ROUTES[route]();
  let status, sent;
  const res = { setHeader() {}, status(code) { status = code; return this; }, json(body) { sent = body; return this; }, end() { return this; } };
  const req = { method: 'POST', url: `/api/${route}`, headers: { 'content-type': 'application/json' }, query: {}, get body() { throw new Error('Invalid JSON'); } };
  await handler(req, res);
  expect(status).toBe(400);
  expect(sent.error).toMatch(/JSON/);
});
