// Only links a student can trust reach them (#271): the lesson's own resources, a Wikipedia
// article, or a YouTube search. Any other markdown link keeps its text and loses its URL, so an
// invented or lookalike address is never clickable.
const WIKIPEDIA = /^https:\/\/en\.wikipedia\.org\/wiki\/[^\s?#]+$/;
const YOUTUBE_SEARCH = /^https:\/\/www\.youtube\.com\/results\?search_query=[^\s#]+$/;
const SOURCE_FOOTER = /^[ \t]*>[ \t]*📚[ \t]*Sources?[ \t]*:/i;

/** Drop protocol source lines when they have not been verified, preserving ordinary quoted text. */
export function withoutSources(text) {
  return String(text ?? '').split('\n').filter((line) => !SOURCE_FOOTER.test(line)).join('\n').trimEnd();
}

/** Stream prose immediately, but hold quoted lines until they can be identified as source footers. */
export function sourceFilter(onToken) {
  let lineStart = true;
  let quote = '';
  let footer = false;
  const filter = (chunk) => {
    let out = '';
    for (const ch of chunk) {
      if (footer) {
        if (ch === '\n') { footer = false; lineStart = true; }
      } else if (quote) {
        quote += ch;
        if (SOURCE_FOOTER.test(quote)) { footer = true; quote = ''; continue; }
        // Once this prefix cannot be source metadata, emit it immediately. An
        // ordinary final quote streams even when it never ends with a newline.
        const prefix = quote.replace(/[ \t]/g, '').toLowerCase();
        if (!['>📚source:', '>📚sources:'].some((head) => head.startsWith(prefix))) {
          out += quote;
          quote = '';
          lineStart = ch === '\n';
        }
      } else if (lineStart && (ch === '>' || ch === ' ' || ch === '\t')) quote = ch;
      else { out += ch; lineStart = ch === '\n'; }
    }
    if (out) onToken(out);
  };
  filter.flush = () => {
    if (quote) { const tail = quote; quote = ''; onToken(tail); }
  };
  return filter;
}

/** Keep a source footer only when its citations are supplied resources or existing Wikipedia pages. */
export async function keepVerifiedSources(text, allowed = []) {
  const original = String(text ?? '');
  const lines = original.trimEnd().split('\n');
  const last = lines.length - 1;
  if (!SOURCE_FOOTER.test(lines[last])) return withoutSources(original);
  const trusted = new Set(Array.isArray(allowed) ? allowed : []);
  const citations = [...lines[last].matchAll(/\[([^\]\n]+)\]\((https?:\/\/(?:[^\s()]|\([^\s()]*\))+)\)/g)].slice(0, 2);
  const verified = await Promise.all(citations.map(async ([, label, address]) => {
    const url = address.replaceAll('&amp;', '&');
    if (trusted.has(url)) return `[${label}](${url})`;
    if (!WIKIPEDIA.test(url)) return null;
    try {
      // Only the fixed Wikipedia origin is fetched. A redirect or a timeout loses the
      // citation rather than letting a source check follow an arbitrary target.
      const response = await fetch(url, { method: 'HEAD', redirect: 'error', signal: AbortSignal.timeout(2500) });
      return response.ok ? `[${label}](${url})` : null;
    } catch { return null; }
  }));
  const kept = verified.filter(Boolean);
  const prose = lines.slice(0, last).filter((line) => !SOURCE_FOOTER.test(line)).join('\n');
  return kept.length ? `${prose}\n> 📚 Sources: ${kept.join('; ')}` : prose.trimEnd();
}

export function keepTrustedLinks(text, allowed = []) {
  const trusted = new Set(Array.isArray(allowed) ? allowed.filter((u) => typeof u === 'string') : []);
  // One level of parentheses inside a URL, as in a Wikipedia title like Mercury_(planet).
  const unlinkOnce = (s) => s.replace(/\[([^\]\n]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g, (link, label, url) => {
    // The prompt shows resources XML-escaped, so a copied one may come back with &amp; for &.
    const plain = url.replaceAll('&amp;', '&');
    return trusted.has(plain) || WIKIPEDIA.test(plain) || YOUTUBE_SEARCH.test(plain) ? `[${label}](${plain})` : label;
  });
  // Until nothing changes: unlinking [[x](a)](b) leaves [x](b), a new link to check. Each pass
  // that changes anything makes the text shorter, so this ends.
  let out = String(text ?? '');
  for (let prev; prev !== out;) [prev, out] = [out, unlinkOnce(out)];
  return out;
}

// #293: a YouTube video id is 64 bits in 11 characters, so its last character holds 4 bits: one of 16.
const VIDEO_ID = /^[\w-]{10}[AEIMQUYcgkosw048]$/;
// A playlist id is PL and 16 hex digits (the older kind) or 32 characters, as every shipped one is.
// Rarer kinds (a channel's uploads, a mix, an album) only have to start with their two capitals.
const PLAYLIST_ID = /^(?:PL(?:[0-9A-F]{16}|[\w-]{32})|(?!PL)[A-Z]{2}[\w-]*)$/;

/**
 * Why a lesson resource can't be a real link, or null when its shape could be (#293): a YouTube id of
 * the wrong shape, or a placeholder. Offline, so a real-shaped link can still be dead.
 */
export function inventedLink(url) {
  let u;
  try { u = new URL(url); } catch { return null; } // a reference such as "Futuyma Ch. 11" is no link to judge
  const youtube = /(^|\.)youtube\.com$/.test(u.hostname);
  const [, first, second] = u.pathname.split('/');
  let video = null;
  if (u.hostname === 'youtu.be') video = first;
  else if (youtube && u.pathname === '/watch') video = u.searchParams.get('v'); // no v (watch?list=…): no id to judge
  else if (youtube && (first === 'embed' || first === 'shorts')) video = second;
  if (video != null && !VIDEO_ID.test(video)) return 'invalid YouTube video id';
  if (youtube && u.pathname === '/playlist' && !PLAYLIST_ID.test(u.searchParams.get('list') || '')) return 'invalid YouTube playlist id';
  if (/(^|\.)example(\.(com|net|org))?$/.test(u.hostname)) return 'placeholder';
  // A slug starting example-, after an id's prefix too (PMC-example-…). Not example-3-…: Khan Academy's "Example 3" videos.
  if (/\/(?:[A-Z]+-)?example-(?!\d)/.test(u.pathname)) return 'placeholder';
  return null;
}
