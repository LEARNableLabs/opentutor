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

/**
 * Split a complete response into its assessment (if any) and the visible text.
 * An assessment without a score from 0 to 1 is no grade, so it counts as none.
 */
export function parseAssessment(text = '') {
  const match = text.match(/<assessment>([\s\S]*?)<\/assessment>/);
  const visible = text.replace(/<assessment>[\s\S]*?<\/assessment>\s*/g, '').trim();
  if (!match) return { assessment: null, visible };
  try {
    const assessment = JSON.parse(match[1]);
    const { score } = assessment || {};
    return { assessment: typeof score === 'number' && score >= 0 && score <= 1 ? assessment : null, visible };
  } catch {
    return { assessment: null, visible };
  }
}

/**
 * Wrap an onToken callback so no assessment block reaches it, wherever it falls.
 *
 * Returns a chunk handler. The model is told to put the block first, but sometimes writes it
 * after part of the reply (#224), so the filter looks for one throughout. It holds back only
 * text that could still turn into one (a partial "<assessment>"), or is inside one.
 */
export function assessmentFilter(onToken) {
  let pending = '';
  let inBlock = false;
  let trimNext = true;   // like parseAssessment: no leading space, none right after a block

  const emit = (text) => {
    const out = trimNext ? text.replace(/^\s+/, '') : text;
    trimNext = trimNext && out === '';
    if (out) onToken(out);
  };

  return (chunk) => {
    pending += chunk;
    for (;;) {
      if (inBlock) {
        const end = pending.indexOf(CLOSE);
        if (end === -1) return; // still inside the block
        pending = pending.slice(end + CLOSE.length);
        inBlock = false;
        trimNext = true;
        continue;
      }
      const start = pending.indexOf(OPEN);
      if (start !== -1) {
        emit(pending.slice(0, start));
        pending = pending.slice(start + OPEN.length);
        inBlock = true;
        continue;
      }
      let hold = Math.min(OPEN.length - 1, pending.length);
      while (hold > 0 && !OPEN.startsWith(pending.slice(-hold))) hold--;
      emit(pending.slice(0, pending.length - hold));
      pending = pending.slice(pending.length - hold);
      return;
    }
  };
}
