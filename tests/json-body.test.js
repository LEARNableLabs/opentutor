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

it.each(Object.keys(ROUTES))('answers a body Vercel cannot parse with 400 on api/%s', async (route) => {
  const { default: handler } = await ROUTES[route]();
  let status, sent;
  const res = { setHeader() {}, status(code) { status = code; return this; }, json(body) { sent = body; return this; }, end() { return this; } };
  const req = { method: 'POST', url: `/api/${route}`, headers: { 'content-type': 'application/json' }, query: {}, get body() { throw new Error('Invalid JSON'); } };
  await handler(req, res);
  expect(status).toBe(400);
  expect(sent.error).toMatch(/JSON/);
});
