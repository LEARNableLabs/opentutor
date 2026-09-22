# How OpenTutor teaches

The short version: it asks before it tells, it targets what you keep getting wrong,
and it brings things back after you've started to forget them.

Those three ideas come from a body of research that is unusually consistent about
what works and unusually ignored by most software that claims to teach. This
document explains what OpenTutor does, why, and where it falls short.

For the code, see [architecture.md](architecture.md). For the gap analysis that
drove these choices, see [teaching-research.md](teaching-research.md).

---

## The premise: about 1% a day

No cramming. One topic, one short session, most days. The claim isn't that daily
practice is magic — it's that the alternatives are worse. Massed practice
produces confidence without retention, and the confidence is the dangerous part:
it feels like learning while you're actually just re-reading things you already
recognise.

Sessions are 1–10 minutes depending on how you're doing. Short enough that you
actually do them.

## Socratic delivery: ask before telling

Every lesson is a conversation with four steps, and the tutor waits for your
answer before continuing.

| Step | What it does | Why |
|---|---|---|
| **Retrieval** | A question about a *previous* concept | Recalling is what strengthens memory — recognising doesn't |
| **Diagnostic** | An open question about today's topic, *before* any explanation | Teaching starts from what you actually know, not what the curriculum assumed |
| **Follow-up** | Connects today to a concept from a different module | Interleaving: mixing topics beats blocking them, even though it feels worse |
| **Application** | A real scenario where you explain *why* | Self-explanation is one of the most reliable effects in the literature |

Then a confidence rating, 1–5, which feeds the next lesson.

The length adapts: roughly 1 minute when you're accurate and moving fast, 3–5
normally, 8–10 when you're struggling or ask to go deeper. It also branches
mid-lesson — say "go deeper" and it expands, nail the diagnostic and it contracts.
You can say "skip" at any point and it moves on without friction. Autonomy
outranks the plan.

**Why ask first?** Because an explanation you receive before you've tried to
produce the answer lands on nothing. The diagnostic question is doing work even
when you get it wrong — especially then.

## Deliberate practice: target the weakness

Ericsson's work on expert performance is often reduced to "10,000 hours", which
misses the point. The finding was about the *structure* of practice: working
specifically at the edge of your ability, with immediate feedback, on the things
you're bad at rather than the things you enjoy.

Most tutoring software does the opposite — it marches through a syllabus at a
fixed pace and calls that a curriculum.

After every lesson OpenTutor evaluates the session and writes directives the next
lesson has to follow:

| Directive | Meaning |
|---|---|
| `BLOCK` | Do not advance past this concept. Re-teach it in a new framing. |
| `BUMP` / `DROP` | Move the difficulty, after sustained accuracy or a bad session |
| `REVISIT` | Bring this concept back, in a *different* context |
| `VARY` | Stop using this question shape — the student is pattern-matching, not thinking |
| `GOAL` | The specific, testable thing the next lesson must produce |

This runs deterministically from the session record — no model call, no
persuading an LLM to be strict with you. The directives are written to
`practice-feedback.md`, and the Teacher reads them *before* planning the next
lesson.

A directive the next lesson ignores is worse than none, because the file then
claims a weak spot is being handled when it isn't.

## Spaced review: come back later, in a different shape

Material returns after you've started to forget it — that's when retrieval does
the most good. Returning too early is comfortable and nearly useless.

Two mechanisms, and they don't run everywhere:

- **The `REVISIT` directive and the retrieval step** — every surface. Concepts
  come back roughly 1 session later, then 3, then 7, and deliberately in a
  different context each time, so you're recalling the idea rather than the
  wording of the question.
- **SM-2 scheduling** — **Telegram only** (`scripts/bot/spaced-repetition.js`).
  Per-concept intervals that stretch or collapse based on how you answered,
  driving `/review` and the daily push. The web and hosted paths don't have this
  yet; they get the directive-driven form above, which is weaker.

## Where the curriculum comes from

Not from the model's memory. Each topic is researched across eight sources —
arxiv, Semantic Scholar, OpenAlex, Wikipedia, university syllabi, YouTube, GitHub,
and Wikipedia's concept graph — and the sources are cited in the lessons. A draft
is then reviewed by a separate Critic agent and rewritten until it passes, up to
three rounds.

A curriculum invented from a model's priors is exactly the failure this is built
to avoid: fluent, plausible, and wrong in ways a beginner cannot detect.

## What it deliberately doesn't do

- **No streaks or points.** Extrinsic rewards reliably crowd out the intrinsic
  motivation that makes someone keep learning once the app is gone.
- **No "you're doing great!" when you aren't.** Feedback that isn't calibrated is
  noise, and students learn to discount it.
- **No lecture mode.** If you want an explanation without being asked anything
  first, a plain chatbot is a better tool.
- **No fixed pace.** The curriculum is a plan, not a schedule; the directives
  overrule it.

## Honest limitations

- **SM-2 is Telegram-only.** Everywhere else, spacing is directive-driven and
  less principled.
- **Difficulty adaptation is coarse** — a 1–5 scale moved by recent accuracy,
  not a per-concept mastery model.
- **The confidence rating is self-reported**, and self-assessment is exactly what
  novices are worst at. It's used as a weak signal, not a control input.
- **No long-term retention data.** Nothing here has been measured against a
  control group. The methods have evidence behind them; this particular
  implementation of them does not yet.

## Reading

The research this is built on, in rough order of how much it shaped the design:

- Ericsson, Krampe & Tesch-Römer (1993) — *The Role of Deliberate Practice in the
  Acquisition of Expert Performance*
- Roediger & Karpicke (2006) — *Test-Enhanced Learning* — the testing effect
- Bjork & Bjork (2011) — *Making Things Hard on Yourself, But in a Good Way* —
  desirable difficulties
- Chi et al. (1994) — *Eliciting Self-Explanations Improves Understanding*
- Rohrer & Taylor (2007) — on interleaving versus blocked practice
- Bloom (1984) — *The 2 Sigma Problem* — the tutoring result this is chasing

[teaching-research.md](teaching-research.md) works through each of these against
what OpenTutor actually implements, including the gaps.
