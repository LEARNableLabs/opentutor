# Behavioral Economics: Curriculum Plan (Intermediate)

## Scope
**In scope:** the standard rational-choice model and its main documented departures. This covers heuristics and biases, prospect theory and reference dependence, choice under risk and ambiguity, time preference and self-control (beta-delta and present bias), social preferences (fairness, reciprocity, trust, cooperation), mental accounting, choice architecture and nudges (with their ethics and critiques), and an introduction to behavioral finance and firms that exploit biases. Throughout, the course also teaches how to judge evidence: lab versus field experiments, effect sizes and the replication crisis.

**Out of scope:** structural estimation and econometrics, neuroeconomics beyond a brief mention, full behavioral game theory (level-k and QRE are mentioned only), behavioral macroeconomics, and formal axiomatic decision theory beyond what is needed to state the Allais and Ellsberg paradoxes.

**Assumed level:** intermediate. The student knows supply and demand and the idea of utility maximization, or can pick them up quickly. They are comfortable with high-school algebra and basic probability (expected value, percentages). Calculus is not required.

## Module Structure (7 modules, 33 lessons)
1. **The Rational Agent and Its Cracks (4).** This sets up the benchmark first. Every later lesson is a deviation from something, so the student has to own expected utility, exponential discounting and self-interest before the anomalies mean anything. The module also introduces bounded rationality (Simon) and System 1 / System 2 thinking.
2. **Heuristics and Biases (6, including 1 review).** The Tversky and Kahneman program covers anchoring, availability, representativeness (the Linda problem and base-rate neglect), overconfidence, confirmation bias and framing. These ideas need the least formal machinery and pay off fastest, so they come early to build curiosity.
3. **Risk, Reference Points and Prospect Theory (6, including 1 review).** This is the theoretical core: the Allais paradox, reference dependence, loss aversion, the endowment effect, probability weighting, the fourfold pattern, ambiguity aversion (Ellsberg) and mental accounting. It comes after module 2 because framing effects motivate why the reference point matters.
4. **Time and Self-Control (4).** Exponential versus hyperbolic discounting, beta-delta present bias, naive versus sophisticated agents, and commitment devices. It is a separate module because the math (discount factors) is a new kind of tool, and the topic is very relatable (procrastination, gym memberships).
5. **Other People: Social Preferences (5, including 1 review).** The ultimatum, dictator, trust and public-goods games, plus inequity aversion, reciprocity, punishment, and how incentives can crowd out motivation (Gneezy and Rustichini, 'A Fine Is a Price'). This module breaks the self-interest assumption, the third pillar from module 1.
6. **Choice Architecture and Policy (4).** Defaults (Madrian and Shea's 401(k) study, organ donation), Save More Tomorrow, nudges versus sludge, and libertarian paternalism and its critics. It comes late because good nudge design needs biases, loss aversion and present bias already in hand. It also covers the replication crisis and recent meta-analyses suggesting nudge effects are smaller than first reported.
7. **Markets, Finance and Synthesis (4, including the capstone review).** Behavioral finance (the disposition effect, limits to arbitrage, bubbles), firms that exploit consumer biases (shrouded fees, teaser rates, subscription traps), and a capstone where the student diagnoses a real-world case with the full toolkit.

The ordering follows the three pillars of homo economicus: **rational beliefs** (module 2), **rational preferences over risk and time** (modules 3 and 4) and **self-interest** (module 5). Applications (modules 6 and 7) come only once all three have been examined.

## Pedagogical Decisions
- **Predict, then reveal.** Many lessons open by asking the student to answer the classic experimental question themselves (Asian disease, Linda, the Allais choices, $100 today versus $110 tomorrow) before naming the effect. Catching your own bias is the strongest hook this subject has.
- **Intuition first, light formalism.** Introduce equations only where they do real work: expected value, the prospect-theory value function v(x) with loss aversion λ ≈ 2, beta-delta discounting, and the Fehr-Schmidt inequity-aversion utility. Each equation comes with a worked numeric example. There are no proofs.
- **Benchmark before anomaly.** Every bias lesson states clearly which rational-model prediction is being violated.
- **Built-in skepticism.** Teach the field's credibility problems openly: ego depletion and priming replication failures, data-fabrication retractions in honesty research, and smaller nudge effect sizes after publication-bias correction. Students should leave knowing which findings are robust (loss aversion in many contexts, defaults, present bias) and which are shaky.
- **Real-world anchoring.** Every module includes at least one field example: retirement saving, insurance deductibles, cab drivers' daily income targets, gym contracts, organ donation, the equity premium.

## Resource Strategy
- **Main textbook spine:** Erik Angner, *A Course in Behavioral Economics* (3rd ed.), which fits the intermediate level and has exercises.
- **Popular books for engagement:** Kahneman's *Thinking, Fast and Slow*, Thaler's *Misbehaving* (an intellectual history of the field) and Thaler and Sunstein's *Nudge: The Final Edition*. Add a note that some studies in Ariely's *Predictably Irrational* have been questioned.
- **Primary papers, read in short excerpts:** Tversky and Kahneman (1974, *Science*), Kahneman and Tversky (1979, *Econometrica*), Thaler (1980, 1999 on mental accounting), Laibson (1997), Fehr and Gächter (2000), Gneezy and Rustichini (2000), Madrian and Shea (2001), Thaler and Benartzi (2004), DellaVigna and Malmendier (2006, 'Paying Not to Go to the Gym'), and DellaVigna and Linos (2022, nudge units at scale).
- **Video:** Kahneman's and Thaler's Nobel lectures, Marginal Revolution University clips, and Yale/Coursera behavioral finance lectures (Shiller).
- **Interactive:** classroom-experiment platforms (MobLab, Veconlab) for ultimatum and public-goods games, plus simple online calculators or spreadsheets for the value function and discounting.
- **Code (optional bonus):** the R package johnmyleswhite/BehavioralEconomics and Pozzi's Python/Julia structural behavioral-economics notebooks, offered as extensions only.
- **Note on the research input:** most of the arxiv results are not about behavioral economics (econophysics, automation, AI supply chains) and should not be used as lesson resources. The OpenAlex topic clusters (decision-making, experimental and social preferences) do confirm the module boundaries.

## Exercise Strategy
Use mixed formats.
- **Multiple choice:** recognition (name the bias in a scenario) and predict-the-experiment questions.
- **Short computations:** expected value versus prospect-theory value of a gamble; choosing a preference reversal with beta-delta; the minimum acceptable ultimatum offer under Fehr-Schmidt.
- **Free-text application:** design a nudge for a stated problem, then name a sludge risk and an ethical objection.
- **Study critique:** given an abstract, judge sample size, external validity and replication status.
- **Self-experiments:** keep a 3-day log of a mental-accounting or present-bias moment.
- **Teach-backs:** explain loss aversion or present bias to a friend in 3 sentences.
- **Review lessons** mix earlier concepts across modules, for example a single scenario that involves both framing and present bias.

## Pacing
The course has 33 lessons at roughly 3 to 5 minutes each, about 6 to 7 weeks at 5 lessons per week. Difficulty runs from 2 in module 1, up to 3 in module 2, peaks at 4 in module 3 (prospect theory and probability weighting), dips to 3 in module 4, holds at 3 to 4 in module 5, eases to 3 in module 6 (familiar concepts in new combinations), and finishes at 4 in the module 7 synthesis. Review lessons come at lessons 10, 16, 25 and 33, so one falls every 5 to 9 lessons. Module 3 is the main gate: if the student struggles with probability weighting, split it into two lessons before moving to module 4. Delivery types rotate so that no two adjacent lessons share a format, except where a review follows a teach-back.