// Suggested answers (#255): one tap to answer a question that checks what the student knows.
// The application step never gets them: there the student has to produce the answer, which is
// the point of it. The web route and the Telegram bot both settle a plan's answers here.

export const CHECKING_STEPS = ['retrieval', 'diagnostic', 'followUp'];

/** A step's suggested answers, cleaned: 2 to 5 distinct non-empty strings, or null. */
export function suggestedAnswers(plan, step) {
  if (!CHECKING_STEPS.includes(step)) return null;
  const list = plan?.[`${step}Options`];
  if (!Array.isArray(list)) return null;
  const clean = [...new Set(list.filter((o) => typeof o === 'string').map((o) => o.trim()).filter((o) => o && o.length <= 120))];
  return clean.length >= 2 ? clean.slice(0, 5) : null;
}

/**
 * Clean each checking step's answers and shuffle them once, when the lesson is planned, so a
 * resumed lesson shows the same order. Planners tend to put the right answer first; the escape
 * option ("I'm not sure") stays last. The application step's answers are dropped.
 */
export function settleOptions(plan, random = Math.random) {
  for (const step of CHECKING_STEPS) {
    const list = suggestedAnswers(plan, step);
    plan[`${step}Options`] = list && shuffleButLast(list, random);
  }
  plan.applicationOptions = null;
  return plan;
}

function shuffleButLast(list, random) {
  const head = list.slice(0, -1);
  for (let i = head.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [head[i], head[j]] = [head[j], head[i]];
  }
  return [...head, list.at(-1)];
}
