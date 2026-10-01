// Only links a student can trust reach them (#271): the lesson's own resources, a Wikipedia
// article, or a YouTube search. Any other markdown link keeps its text and loses its URL, so an
// invented or lookalike address is never clickable.
const WIKIPEDIA = /^https:\/\/en\.wikipedia\.org\/wiki\/[^\s?#]+$/;
const YOUTUBE_SEARCH = /^https:\/\/www\.youtube\.com\/results\?search_query=[^\s#]+$/;

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
