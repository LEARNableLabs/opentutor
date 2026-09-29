/**
 * Wraps a route that reads a JSON body (#228). Vercel parses the body when a route first reads
 * `req.body`, and throws on one that isn't JSON; inside the route's own try, that throw was a 500.
 */
export const readsJson = (handler) => (req, res) => {
  try { void req.body; } catch { return res.status(400).json({ error: 'The request body must be a JSON object.' }); }
  return handler(req, res);
};
