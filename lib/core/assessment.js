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
// A block that isn't JSON ends at its closing tag.
const CLOSED_AT = /<\s*assessment\s*>([\s\S]*?)<\s*\/\s*assessment\s*>\s*/iy;
const CLOSE_NEXT = /^\s*<\s*\/\s*assessment\s*>\s*/i;
// Could this text still grow into the tag? "<", "< assess", "<assessment ".
const couldBe = (tag, text) => tag.startsWith(text.replace(/\s+/g, '').toLowerCase());

// Where the JSON object starting at `start` ends, reading its strings as strings: a grade that
// quotes the tag itself, as an XML lesson's can ("you named </assessment>"), must not end there.
function jsonEnd(text, start) {
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

/**
 * The reply's first assessment block: `{ index, length, content }`, or null. The grade is the JSON
 * object after the opening tag, then its closing tag if the model wrote one. `streaming`: text may
 * still arrive, so a block counts only once nothing after it can change where it ends.
 */
function firstBlock(text, streaming = false) {
  const open = text.match(OPEN);
  if (!open) return null;
  const from = open.index + open[0].length;
  const brace = from + text.slice(from).match(/^\s*/)[0].length;
  const end = text[brace] === '{' ? jsonEnd(text, brace) : -1;
  if (streaming && text[brace] === '{' && end === -1) return null; // the grade is still arriving
  if (end !== -1) {
    const after = text.slice(end);
    const close = after.match(CLOSE_NEXT);
    // Unclosed, the block ends with its JSON, once what follows can't be the closing tag.
    if (streaming && !close && couldBe('</assessment>', after)) return null;
    const length = end - open.index + (close ? close[0].length : after.match(/^\s*/)[0].length);
    return { index: open.index, length, content: text.slice(brace, end) };
  }
  CLOSED_AT.lastIndex = open.index;
  const match = CLOSED_AT.exec(text);
  return match && { index: match.index, length: match[0].length, content: match[1] };
}

/**
 * Split a complete response into its assessment (if any) and the visible text.
 * An assessment without a score from 0 to 1 is no grade, so it counts as none. Only the first
 * block is the grade: a later one is the tutor's own, such as an example in an XML lesson.
 */
export function parseAssessment(text = '') {
  const block = firstBlock(text);
  if (!block) return { assessment: null, visible: text.trim() };
  const visible = (text.slice(0, block.index) + text.slice(block.index + block.length)).trim();
  try {
    const assessment = JSON.parse(block.content);
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
 * text that could still turn into one (a partial "<assessment>"), or is inside one. It finds the
 * block's end exactly as parseAssessment does, and after the first block streams the rest as is.
 */
export function assessmentFilter(onToken) {
  let pending = '';
  let graded = false;
  let trimNext = true; // like parseAssessment: no leading space, none right after a block

  const emit = (text) => {
    const out = trimNext ? text.replace(/^\s+/, '') : text;
    trimNext = trimNext && out === '';
    if (out) onToken(out);
  };

  return (chunk) => {
    pending += chunk;
    if (!graded) {
      const open = pending.match(OPEN);
      if (!open) {
        const lt = pending.lastIndexOf('<');
        const hold = lt !== -1 && couldBe('<assessment>', pending.slice(lt)) ? pending.length - lt : 0;
        emit(pending.slice(0, pending.length - hold));
        pending = pending.slice(pending.length - hold);
        return;
      }
      emit(pending.slice(0, open.index));
      pending = pending.slice(open.index);
      const block = firstBlock(pending, true);
      if (!block) return; // still inside the block
      pending = pending.slice(block.length);
      graded = true;
      trimNext = true;
    }
    emit(pending);
    pending = '';
  };
}
