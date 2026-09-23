// Connect a student's own OpenRouter account with OAuth PKCE (#132). The key is
// claimed server-side, sealed into the student's store, and never sent back.
import { createHash, randomBytes } from 'node:crypto';
import { getState } from './_lib/init.js';
import { authenticateRequest, authFailure } from './_lib/auth.js';
import { cookies, originFor, setCookie, signFlow, readFlow } from '../lib/core/accounts.js';
import { saveKey, readKey, deleteKey, hasStoredKey, trialLessonsLeft, TRIAL_LESSONS } from '../lib/core/llm-access.js';

const FLOW = 'ot_openrouter';
const api = () => process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

async function keyInfo(apiKey, fetchImpl) {
  const res = await fetchImpl(`${api()}/key`, { headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(10_000) });
  return res.ok ? (await res.json()).data || null : null;
}

export function openrouterHandler({ getStore = getState, fetchImpl = fetch } = {}) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-store');
    if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });
    // Also enforces same-origin on cookie-authenticated POSTs.
    const auth = await authenticateRequest(req, () => getStore());
    if (!auth.ok) {
      const { status, body } = authFailure(auth);
      return res.status(status).json(body);
    }
    if (!auth.account) return res.status(403).json({ error: 'Only self-signup accounts connect their own OpenRouter key.' });
    try {
      const state = await getStore(auth.userId);
      if (req.method === 'GET') {
        const apiKey = await readKey(state);
        // The credit lookup is a nicety: an OpenRouter hiccup must not hide the connection.
        const info = apiKey ? await keyInfo(apiKey, fetchImpl).catch(() => null) : null;
        return res.status(200).json({ connected: await hasStoredKey(state), trialLessons: TRIAL_LESSONS, trialLessonsLeft: await trialLessonsLeft(state), limitRemaining: info?.limit_remaining ?? null });
      }
      const { action, code } = req.body || {};
      if (action === 'start') {
        const verifier = randomBytes(32).toString('base64url');
        // The signed flow binds the verifier to this account for ten minutes.
        setCookie(req, res, FLOW, signFlow({ intent: 'openrouter', id: auth.userId, verifier }, 600), 600);
        const url = new URL('https://openrouter.ai/auth');
        url.searchParams.set('callback_url', `${originFor(req)}/learn.html`);
        url.searchParams.set('code_challenge', createHash('sha256').update(verifier).digest('base64url'));
        url.searchParams.set('code_challenge_method', 'S256');
        return res.status(200).json({ url: url.toString() });
      }
      if (action === 'connect') {
        if (typeof code !== 'string' || !code || code.length > 2048) return res.status(400).json({ error: 'This OpenRouter link is invalid.' });
        const flow = readFlow(cookies(req)[FLOW]);
        if (flow?.intent !== 'openrouter' || flow.id !== auth.userId) return res.status(400).json({ error: 'This connection expired. Please start again.' });
        setCookie(req, res, FLOW, '', 0);
        const exchange = await fetchImpl(`${api()}/auth/keys`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, code_verifier: flow.verifier, code_challenge_method: 'S256' }),
          signal: AbortSignal.timeout(10_000),
        });
        const apiKey = exchange.ok ? (await exchange.json()).key : null;
        // Only a plain printable token may reach a header: anything else would be echoed in the error.
        const info = typeof apiKey === 'string' && /^[\x21-\x7e]{1,512}$/.test(apiKey) ? await keyInfo(apiKey, fetchImpl) : null;
        if (!info) return res.status(502).json({ error: 'OpenRouter did not accept the connection. Please try again.' });
        await saveKey(state, apiKey);
        return res.status(200).json({ connected: true, freeTier: !!info.is_free_tier, limitRemaining: info.limit_remaining ?? null });
      }
      if (action === 'disconnect') {
        await deleteKey(state);
        return res.status(200).json({ connected: false });
      }
      return res.status(400).json({ error: 'Unknown action.' });
    } catch (err) {
      console.error('[openrouter]', err.message);
      return res.status(503).json({ error: 'The OpenRouter connection is unavailable right now.' });
    }
  };
}

export default openrouterHandler();
