// Only links a student can trust reach them (#271): the lesson's own resources, a Wikipedia
// article, or a YouTube search. Any other markdown link keeps its text and loses its URL, so an
// invented or lookalike address is never clickable.
const WIKIPEDIA = /^https:\/\/en\.wikipedia\.org\/wiki\/[^\s?#]+$/;
const YOUTUBE_SEARCH = /^https:\/\/www\.youtube\.com\/results\?search_query=[^\s#]+$/;
const SOURCE_FOOTER = /^>\s*(?:📚\s*)?Sources?:/i;

/** Stream prose immediately, but hold quoted lines until they can be identified as source footers. */
export function sourceFilter(onToken) {
  let lineStart = true;
  let quote = '';
  let footer = false;
  return (chunk) => {
    if (footer) return;
    let out = '';
    for (const ch of chunk) {
      if (quote) {
        quote += ch;
        if (ch === '\n') {
          if (SOURCE_FOOTER.test(quote)) { footer = true; break; }
          out += quote;
          quote = '';
          lineStart = true;
        }
      } else if (lineStart && ch === '>') quote = ch;
      else { out += ch; lineStart = ch === '\n'; }
    }
    if (out) onToken(out);
  };
}

/** Keep a source footer only when its citations are supplied resources or existing Wikipedia pages. */
export async function keepVerifiedSources(text, allowed = []) {
  const lines = String(text ?? '').split('\n');
  const footer = SOURCE_FOOTER;
  const indices = lines.flatMap((line, index) => footer.test(line) ? [index] : []);
  if (!indices.length) return String(text ?? '');
  const last = indices.at(-1);
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
  return lines.flatMap((line, index) => !footer.test(line) ? [line]
    : index === last && kept.length ? [`> 📚 Sources: ${kept.join('; ')}`] : []).join('\n').trimEnd();
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
