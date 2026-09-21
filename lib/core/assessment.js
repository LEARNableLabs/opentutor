/**
 * The hidden per-step assessment.
 *
 * `buildSocraticResponsePrompt` asks the model to emit
 * `<assessment>{…}</assessment>` *before* the student-facing reply. It is used
 * to grade the session and must never reach the student.
 *
 * That ordering matters for streaming: the first tokens off the wire are the
 * grading JSON, so a naive stream would show it. `assessmentFilter` holds them
 * back until the block closes, then streams everything after it.
 */

const OPEN = '<assessment>';
const CLOSE = '</assessment>';

/** Split a complete response into its assessment (if any) and the visible text. */
export function parseAssessment(text = '') {
  const match = text.match(/<assessment>([\s\S]*?)<\/assessment>/);
  const visible = text.replace(/<assessment>[\s\S]*?<\/assessment>\s*/g, '').trim();
  if (!match) return { assessment: null, visible };
  try {
    return { assessment: JSON.parse(match[1]), visible };
  } catch {
    return { assessment: null, visible };
  }
}

/**
 * Wrap an onToken callback so the assessment block never reaches it.
 *
 * Returns a chunk handler. Chunks are buffered only while the text so far could
 * still turn out to be an assessment block — once that is ruled out, or the
 * block closes, everything flows straight through.
 */
export function assessmentFilter(onToken) {
  let buffer = '';
  let streaming = false;
  let trimNext = false;   // the block may close exactly on a chunk boundary

  const emit = (text) => {
    const out = trimNext ? text.replace(/^\s+/, '') : text;
    trimNext = trimNext && out === '';
    if (out) onToken(out);
  };

  return (chunk) => {
    if (streaming) { emit(chunk); return; }

    buffer += chunk;
    const leading = buffer.replace(/^\s+/, '');

    // Not an assessment block at all — flush and stop buffering.
    if (leading && !OPEN.startsWith(leading.slice(0, OPEN.length)) && !leading.startsWith(OPEN)) {
      streaming = true;
      if (leading) emit(leading);
      buffer = '';
      return;
    }

    const end = buffer.indexOf(CLOSE);
    if (end === -1) return;   // still inside the block

    streaming = true;
    trimNext = true;
    const rest = buffer.slice(end + CLOSE.length);
    buffer = '';
    emit(rest);
  };
}
