import { getState } from './_lib/init.js';
import { authenticateRequest } from './_lib/auth.js';
import { openrouterHandler } from './_lib/openrouter.js';
import {
  accountsConfigured,
  createAccountClient,
  accessToken,
  refreshToken,
  cookies,
  sameOrigin,
  originFor,
  setCookie,
  setSession,
  clearSession,
  verifyAccountRequest,
  ensureAccount,
  recoveryCallback,
  grantRecovery,
  canReset,
} from '../lib/core/accounts.js';

export function accountHandler({ getStore = getState, clientFactory = createAccountClient } = {}) {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'private, no-store');
    if (!['GET', 'POST'].includes(req.method))
      return res.status(405).json({ error: 'Method not allowed' });
    if (req.method === 'POST' && !sameOrigin(req))
      return res.status(403).json({ error: 'Please submit this form from OpenTutor.' });
    try {
      const body = req.body || {},
        action = body.action;
      if (req.method === 'GET') {
        const hasCredential = accessToken(req) || refreshToken(req) || cookies(req).ot_legacy;
        if (!hasCredential)
          return res
            .status(200)
            .json({
              user: null,
              available: accountsConfigured(),
              local:
                !process.env.VERCEL && !process.env.OPENTUTOR_PASSWORD && !accountsConfigured(),
            });
        const auth = await authenticateRequest(req, getStore);
        return res
          .status(200)
          .json({
            user: auth.ok
              ? {
                  id: auth.userId,
                  name: auth.account?.name || 'Your workspace',
                  email: auth.account?.email,
                }
              : null,
            available: accountsConfigured(),
          });
      }
      if (action === 'logout') {
        if (accessToken(req) && accountsConfigured()) {
          try {
            await clientFactory(req, res).auth.admin.signOut(accessToken(req), 'local');
          } catch {
            /* cookies are cleared even if provider is unavailable */
          }
        }
        clearSession(req, res);
        setCookie(req, res, 'ot_legacy', '', 0);
        return res.status(200).json({ ok: true });
      }
      if (action === 'legacy') {
        if (typeof body.credential !== 'string' || !body.credential)
          return res.status(400).json({ error: 'Enter your access token or instance password.' });
        const auth = await authenticateRequest(
          {
            ...req,
            headers: { ...req.headers, cookie: '', authorization: `Bearer ${body.credential}` },
          },
          getStore,
        );
        if (!auth.ok)
          return res.status(401).json({ error: 'That access credential is not valid.' });
        clearSession(req, res);
        setCookie(req, res, 'ot_legacy', body.credential, 60 * 60 * 24 * 7);
        return res.status(200).json({ ok: true });
      }
      if (!accountsConfigured())
        return res
          .status(503)
          .json({ error: 'Account sign-in is not configured yet. You can still browse topics.' });
      const client = clientFactory(req, res);
      const finish = async (session, user, recovery = false) => {
        if (!session || !user?.email_confirmed_at)
          return res.status(400).json({ error: 'Confirm your email before signing in.' });
        // Validate provider identity before provisioning; never accept body userId.
        const { data, error } = await client.auth.getUser(session.access_token);
        if (error || data.user?.id !== user.id)
          return res.status(401).json({ error: 'Could not verify the account.' });
        const student = await ensureAccount(await getStore(), data.user);
        setCookie(req, res, 'ot_legacy', '', 0);
        setSession(req, res, session);
        if (recovery) grantRecovery(req, res, data.user, session);
        else setCookie(req, res, 'ot_recovery', '', 0);
        return res
          .status(200)
          .json({ user: { id: student.id, name: student.name, email: data.user.email }, recovery });
      };
      if (action === 'refresh') {
        const refresh = refreshToken(req);
        if (!refresh) return res.status(401).json({ error: 'Please sign in.' });
        const { data, error } = await client.auth.refreshSession({ refresh_token: refresh });
        if (error) {
          // Only a rejected token ends the session; an outage must not wipe everyone's cookies.
          if (error.status >= 400 && error.status < 500) {
            clearSession(req, res);
            return res.status(401).json({ error: 'Your session expired. Please sign in again.' });
          }
          console.error('[account] refresh failed:', error.message);
          return res.status(503).json({ error: 'Sign-in is temporarily unavailable. Please try again.' });
        }
        return await finish(data.session, data.user);
      }
      if (action === 'callback') {
        if (typeof body.code !== 'string' || !body.code || body.code.length > 2048)
          return res.status(400).json({ error: 'This sign-in link is invalid.' });
        const { data, error } = await client.auth.exchangeCodeForSession(body.code);
        if (error)
          return res
            .status(400)
            .json({
              error:
                'This link expired or was opened in a different browser. Please sign in or request a new link.',
            });
        return await finish(data.session, data.user, recoveryCallback(req));
      }
      if (action === 'reset') {
        const user = await verifyAccountRequest(req, await getStore(), client);
        if (!user || !canReset(req, user))
          return res.status(401).json({ error: 'Please open a fresh password reset link.' });
        if (
          typeof body.password !== 'string' ||
          body.password.length < 12 ||
          body.password.length > 128
        )
          return res.status(400).json({ error: 'Use a password between 12 and 128 characters.' });
        const session = await client.auth.setSession({
          access_token: accessToken(req),
          refresh_token: refreshToken(req),
        });
        if (session.error)
          return res.status(401).json({ error: 'Please request a new password reset link.' });
        const { error } = await client.auth.updateUser({ password: body.password });
        if (error)
          return res
            .status(400)
            .json({ error: 'The password could not be updated. Try a different password.' });
        setSession(req, res, session.data.session);
        setCookie(req, res, 'ot_recovery', '', 0);
        return res.status(200).json({ ok: true });
      }
      if (!['signup', 'login', 'forgot'].includes(action))
        return res.status(400).json({ error: 'Unknown account action.' });
      // No email until #133: a reset link would never arrive (and must not be sent).
      if (action === 'forgot')
        return res.status(404).json({ error: 'Password reset by email is not available yet.' });
      const email = typeof body.email === 'string' ? body.email.trim() : '';
      if (email.length > 254 || !/^\S+@\S+\.\S+$/.test(email))
        return res.status(400).json({ error: 'Enter a valid email address.' });
      if (action === 'forgot') {
        const { error } = await client.auth.resetPasswordForEmail(email, {
          redirectTo: `${originFor(req)}/login.html?mode=reset`,
        });
        // Supabase rate-limits only addresses it would email, so a distinct 429
        // would tell anyone which emails are registered. Answer it like success.
        if (error && error.status !== 429)
          return res
            .status(503)
            .json({ error: 'Could not send a reset email right now. Please try again later.' });
        return res
          .status(200)
          .json({
            message: 'If an account exists for that email, a password reset link is on its way.',
          });
      }
      if (
        typeof body.password !== 'string' ||
        body.password.length > 128 ||
        body.password.length < (action === 'signup' ? 12 : 1)
      )
        return res
          .status(400)
          .json({
            error:
              action === 'signup'
                ? 'Use a password between 12 and 128 characters.'
                : 'Enter your password.',
          });
      const result =
        action === 'signup'
          ? await client.auth.signUp({
              email,
              password: body.password,
              options: {
                data: {
                  name: String(body.name || '')
                    .trim()
                    .slice(0, 80),
                },
                emailRedirectTo: `${originFor(req)}/login.html`,
              },
            })
          : await client.auth.signInWithPassword({ email, password: body.password });
      if (result.error)
        return res
          .status(result.error.status === 429 ? 429 : 400)
          .json({
            error:
              action === 'login'
                ? 'Could not sign in. Check your email and password, and confirm your email first.'
                : 'Could not create the account. Try signing in, or try again later.',
          });
      if (action === 'signup' && !result.data.session)
        return res
          .status(200)
          .json({
            message:
              'Check your email to confirm your account, then return here to sign in. Open the link in this browser.',
          });
      return await finish(result.data.session, result.data.user);
    } catch (err) {
      console.error('[account]', err.message);
      return res
        .status(/disabled/.test(err.message) ? 403 : 503)
        .json({
          error: /disabled/.test(err.message)
            ? 'Account access has been disabled.'
            : 'Sign-in is temporarily unavailable. Please try again.',
        });
    }
  };
}
// One function serves /api/account and /api/openrouter: the Hobby plan allows 12 functions
// per deployment, and vercel.json rewrites /api/openrouter here with ?via=openrouter.
const account = accountHandler();
const openrouter = openrouterHandler();
export default (req, res) => (req.query?.via === 'openrouter' ? openrouter : account)(req, res);
