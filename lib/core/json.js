/**
 * The first JSON object in a model's reply, or null (#233).
 *
 * Models wrap their JSON in prose or a fence, and sometimes write more after it. The greedy
 * /\{[\s\S]*\}/ every caller used ran on to the last brace of whatever followed, so a complete
 * answer failed to parse. Here each object is read to its own closing brace, strings as strings,
 * and only top-level ones are tried: an object inside a broken one is never taken for the answer.
 */
const OBJECT_START = /\{\s*["}]/y; // however much space comes first

export function parseFirstJson(text) {
  const s = String(text ?? '');
  for (let start = s.indexOf('{'); start !== -1;) {
    // A brace no object can start with ("Use { to mark a block") is prose: skip it.
    OBJECT_START.lastIndex = start;
    if (!OBJECT_START.test(s)) { start = s.indexOf('{', start + 1); continue; }
    const end = jsonObjectEnd(s, start);
    if (end === -1) return null; // never closes: nothing after it is a separate answer
    try { return JSON.parse(s.slice(start, end)); } catch { start = s.indexOf('{', end); }
  }
  return null;
}

/** Where the JSON object starting at `start` ends, just after its closing brace, or -1. */
export function jsonObjectEnd(text, start) {
  let depth = 0;
  let inString = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === '\\') i++;
      else if (ch === '"') inString = false;
    } else if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) return i + 1;
  }
  return -1;
}
