/**
 * Is this link real? The one answer the pipeline's URL check and the shipped-domain audit share (#293).
 *
 * "dead" only on evidence the link does not exist: a YouTube id oEmbed does not know, a DOI Crossref
 * or arXiv does not know, a 404/410, an unresolvable host. A 403, 429, timeout or anything else is
 * "unknown": sites that block bots must not cost a course its reading.
 */

const UA = 'Mozilla/5.0 (compatible; OpenTutorLinkCheck/1.0; +https://github.com/LEARNableLabs/opentutor)';
const YT_ID = /^[\w-]{11}$/;

/** Which check a URL gets, and the URL to ask. Pure, so the routing is testable. */
export function plan(url) {
  let u;
  try { u = new URL(url); } catch { return { kind: 'dead', reason: 'malformed' }; }
  const host = u.hostname.replace(/^www\./, '');
  const short = host === 'youtube.com' && u.pathname.match(/^\/shorts\/([^/]+)/);
  if (host === 'youtube.com' && u.pathname === '/watch' || host === 'youtu.be' || short) {
    const id = short ? short[1] : host === 'youtu.be' ? u.pathname.slice(1) : u.searchParams.get('v');
    if (!YT_ID.test(id || '')) return { kind: 'dead', reason: 'not a YouTube id' }; // "pantheon-construction"
    return { kind: 'get', url: `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`, deadOn: [404], host: 'youtube.com' };
  }
  // The handle system knows every registered DOI. Crossref knows only its own: Zenodo, arXiv and
  // figshare DOIs are DataCite's, and a 404 from Crossref says nothing about them.
  if (host === 'doi.org' || host === 'dx.doi.org') return { kind: 'get', url: `https://doi.org/api/handles/${u.pathname.slice(1)}`, deadOn: [404], host: 'doi.org' };
  if (host === 'arxiv.org' && /^\/(abs|pdf)\//.test(u.pathname)) {
    const id = u.pathname.replace(/^\/(abs|pdf)\//, '').replace(/\.pdf$/, '');
    return { kind: 'arxiv', url: `https://export.arxiv.org/api/query?id_list=${id}`, host: 'arxiv.org' };
  }
  return { kind: 'get', url, deadOn: [404, 410], host };
}

export async function check(url, fetchFn = fetch) {
  const p = plan(url);
  if (p.kind === 'dead') return { status: 'dead', reason: p.reason };
  try {
    const res = await fetchFn(p.url, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(15000) });
    if (p.kind === 'arxiv') {
      const xml = await res.text();
      return res.ok && /<entry>/.test(xml) && !/<title>Error<\/title>/.test(xml) ? { status: 'ok' } : res.ok ? { status: 'dead', reason: 'unknown arXiv id' } : { status: 'unknown', reason: res.status };
    }
    return p.deadOn.includes(res.status) ? { status: 'dead', reason: res.status }
      : res.ok ? { status: 'ok' } : { status: 'unknown', reason: res.status };
  } catch (err) {
    const code = err.cause?.code || err.code;
    return code === 'ENOTFOUND' ? { status: 'dead', reason: 'host does not resolve' } : { status: 'unknown', reason: code || err.name };
  }
}

/**
 * The URLs in a text, or in every string of a value (a curriculum). A closing ")" belongs to a URL
 * only when it opens one inside it, as in the DOI 10.1016/0167-2681(80)90001-1; otherwise it closes
 * the link around it. Sentence punctuation after a URL is not part of it.
 */
export function extractUrls(value) {
  if (Array.isArray(value)) return value.flatMap(extractUrls);
  if (value && typeof value === 'object') return Object.values(value).flatMap(extractUrls);
  const text = String(value ?? '').replaceAll('\\/', '/');
  // A resource that is just a URL has no surrounding prose delimiter to remove.
  if (/^https?:\/\/[^\s<>"'\\]+$/.test(text)) return [text];
  return [...text.matchAll(/https?:\/\/[^\s>"'\]\\]+/g)].map(([url]) => {
    let end = url.replace(/[.,;:!?]+$/, '');
    while (end.endsWith(')') && end.split(')').length > end.split('(').length) end = end.slice(0, -1).replace(/[.,;:!?]+$/, '');
    return end;
  });
}
