/**
 * Wraps a route that reads a JSON body (#228). Vercel parses the body when a route first reads
 * `req.body`, and throws on one that isn't JSON; inside the route's own try, that throw was a 500.
 * A POST must carry a JSON object: `null` was a 500 too, and `[]` or `"x"` saved a blank profile.
 */
export const readsJson = (handler) => (req, res) => {
  if (req.method === 'POST') {
    let body = null;
    try { body = req.body; } catch { /* not JSON: answered below */ }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'The request body must be a JSON object.' });
    }
  }
  return handler(req, res);
};
