import { describe, it, expect } from 'vitest';
import { plan, check } from '../lib/core/link-check.js';

// #293: only evidence of absence removes a link; a blocked or slow site is kept.

const answer = (status, body = '') => async () => ({ ok: status < 400, status, text: async () => body });
const throws = (code) => async () => { throw Object.assign(new Error('x'), { cause: { code } }); };

describe('verify-links', () => {
  it('does not use an HTTP page verdict to remove a Git clone URL', async () => {
    expect(await check('https://github.com/google/or-tools.git', answer(404))).toMatchObject({ status: 'unknown' });
  });
  it('rejects a YouTube slug where an 11-character id belongs, with no network', async () => {
    const never = async () => { throw new Error('fetched'); };
    expect(await check('https://www.youtube.com/watch?v=pantheon-construction', never)).toMatchObject({ status: 'dead' });
    expect(plan('https://youtu.be/dQw4w9WgXcQ').url).toContain('oembed');
  });

  it('routes DOIs to the handle system and arXiv to its API', () => {
    // The handle system, not Crossref: a Zenodo or arXiv DOI is DataCite's and Crossref answers 404 for it.
    expect(plan('https://doi.org/10.5281/zenodo.1234').url).toBe('https://doi.org/api/handles/10.5281/zenodo.1234');
    expect(plan('https://arxiv.org/pdf/1706.03762.pdf').url).toContain('id_list=1706.03762');
  });

  it('keeps transient and access failures unknown so the audit retries them', async () => {
    for (const status of [401, 403, 429, 500, 503]) {
      expect(await check('https://example.org/a', answer(status))).toEqual({ status: 'unknown', reason: status });
    }
    expect(await check('https://example.org/a', answer(200))).toEqual({ status: 'ok' });
  });

  it('calls a link dead on 404/410 or an unresolvable host, and nothing else', async () => {
    expect((await check('https://example.org/a', answer(404))).status).toBe('dead');
    expect((await check('https://example.org/a', answer(410))).status).toBe('dead');
    expect((await check('https://example.org/a', throws('ENOTFOUND'))).status).toBe('dead');
    for (const f of [answer(200), answer(403), answer(429), answer(500), throws('ETIMEDOUT')]) {
      expect((await check('https://example.org/a', f)).status).not.toBe('dead');
    }
  });

  it('treats an arXiv API error entry as a missing paper', async () => {
    expect((await check('https://arxiv.org/abs/0000.00000', answer(200, '<entry><title>Error</title></entry>'))).status).toBe('dead');
    expect((await check('https://arxiv.org/abs/1706.03762', answer(200, '<entry><title>Attention</title></entry>'))).status).toBe('ok');
  });
});
