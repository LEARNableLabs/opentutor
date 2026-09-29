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

// Spaces inside a tag are the model's slip, and still a grade: "<assessment >", "</ assessment>".
const OPEN = /<\s*assessment\s*>/i;
const CLOSE = /<\s*\/\s*assessment\s*>/i;
const BLOCK = /<\s*assessment\s*>([\s\S]*?)<\s*\/\s*assessment\s*>\s*/gi;
// Could this tail still grow into an opening tag? "<", "< assess", "<assessment ".
const couldOpen = (tail) => '<assessment>'.startsWith(tail.replace(/\s+/g, '').toLowerCase());

/**
 * Split a complete response into its assessment (if any) and the visible text.
 * An assessment without a score from 0 to 1 is no grade, so it counts as none.
 */
export function parseAssessment(text = '') {
  const match = text.match(new RegExp(BLOCK.source, 'i'));
  const visible = text.replace(BLOCK, '').trim();
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
        const end = pending.match(CLOSE);
        if (!end) return; // still inside the block
        pending = pending.slice(end.index + end[0].length);
        inBlock = false;
        trimNext = true;
        continue;
      }
      const start = pending.match(OPEN);
      if (start) {
        emit(pending.slice(0, start.index));
        pending = pending.slice(start.index + start[0].length);
        inBlock = true;
        continue;
      }
      const lt = pending.lastIndexOf('<');
      const hold = lt !== -1 && couldOpen(pending.slice(lt)) ? pending.length - lt : 0;
      emit(pending.slice(0, pending.length - hold));
      pending = pending.slice(pending.length - hold);
      return;
    }
  };
}
