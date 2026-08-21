# Decision Theory — Teaching Notes

## Approach

Decision theory at the intermediate level is taught through **paradoxes and violations**. Rather than presenting expected utility theory as the truth, introduce it as a powerful normative framework, then immediately challenge it with Allais, Ellsberg, and St. Petersburg. This keeps students engaged and critical rather than passive.

The field has a rich **visual tradition** — indifference curves, utility functions, decision trees, probability triangles — so use diagrams liberally. Students grasp risk aversion much faster when they see a concave utility curve than when they read axioms.

Balance **normative and descriptive** throughout. Expected utility tells us how ideally rational agents should decide; prospect theory and behavioral work tell us how humans actually decide. Both are valuable. Frame this as complementary, not competing (though acknowledge the philosophical debate).

## Common Misconceptions

### 1. "Utility = money"
**Why students get this wrong**: Early examples use money as the outcome, so students conflate the two.

**How to correct**: Introduce non-monetary outcomes early (lesson 1-2: "Would you rather have $100 or a day with a friend?"). Then show how even for money, utility ≠ value because of diminishing marginal utility. Use the classic "utility of first dollar vs. millionth dollar" thought experiment.

### 2. "Expected value and expected utility are the same thing"
**Why students get this wrong**: The formulas look similar (both are weighted averages), and when utility is linear, they give the same answer.

**How to correct**: St. Petersburg paradox (lesson 12) is the perfect corrective. The expected value is infinite, but no one would pay infinite money to play. That gap is explained by bounded/concave utility. Make this the key lesson: EV ignores risk attitudes, EU captures them.

### 3. "Being risk-averse means avoiding all risk"
**Why students get this wrong**: Colloquial use of "risk-averse" sounds absolute.

**How to correct**: Clarify that risk aversion means "preferring certainty to fair gambles" (lesson 8). A risk-averse person might still take a favorable gamble (positive expected utility). Show examples: insurance (pay to avoid risk) vs. lottery (pay to take on risk with positive EV).

### 4. "Violating the VNM axioms makes you irrational"
**Why students get this wrong**: The term "rationality axioms" sounds prescriptive.

**How to correct**: Present this as an open question (lessons 9-10). The axioms define a specific notion of rationality (consistency under certain assumptions), but you can have a different coherent notion. Many smart people violate independence and don't care. The question is whether you want to be vulnerable to Dutch books and money pumps.

### 5. "Prospect theory replaces expected utility"
**Why students get this wrong**: Textbooks sometimes frame it as "the new theory."

**How to correct**: Draw a clear normative/descriptive distinction (lesson 13). EU is a normative ideal; prospect theory is a descriptive model. You can believe EU is how you should decide while acknowledging prospect theory is how you do decide. They're answering different questions.

### 6. "Subjective probability is just guessing"
**Why students get this wrong**: "Subjective" sounds arbitrary or unscientific.

**How to correct**: Explain that subjective probabilities must obey the probability axioms and should be coherent (lesson 20). They're not arbitrary — they're your best rational beliefs given your information. Bayesian updating (lesson 21) shows how they respond to evidence, making them disciplined rather than capricious.

### 7. "Uncertainty means you have no information"
**Why students get this wrong**: Students conflate "unknown probabilities" with "complete ignorance."

**How to correct**: Show the spectrum (lesson 17): risk (known probabilities) → ambiguity (probabilities unknown but bounded) → ignorance (genuinely no clue). Most real decisions fall in the middle. Ellsberg (lesson 18) demonstrates that even a little ambiguity affects choices.

### 8. "Bayesian decision theory requires you to have prior probabilities"
**Why students get this wrong**: The formula always starts with a prior.

**How to correct**: Acknowledge the "problem of priors" but note that (1) in many cases, data overwhelms the prior quickly, and (2) you can use uninformative priors or compare sensitivity to prior choice. The key is updating coherently, not having a perfect starting point (lesson 21).

### 9. "Decision trees are just for simple problems"
**Why students get this wrong**: Textbook examples are toy cases (umbrella, coin flips).

**How to correct**: Show real-world applications in lesson 15 and 24 — medical diagnosis, R&D investment, sequential market entry. Trees scale via software. The method is general; we just use small trees for pedagogy.

### 10. "More information is always good"
**Why students get this wrong**: Intuition says knowledge is power.

**How to correct**: Information has a cost (time, money, cognitive load). The value of information (lesson 23) is the expected utility gain from getting it, minus the cost. Sometimes the cost exceeds the benefit, so you should stay ignorant and just decide.

## Level Adjustments

### Compared to Beginner Level
- **More formalism**: Introduce the VNM axioms explicitly (lesson 10), not just the EU formula. Expect students to work with utility functions algebraically.
- **Proof sketches**: Briefly show why the axioms imply the representation theorem, even if not a full proof.
- **Paradoxes as central**: Allais, Ellsberg, St. Petersburg are not footnotes — they're core lessons that teach as much as the standard theory.
- **Bayesian updating**: Full treatment of Bayes' rule applied to decision problems (lesson 21), not just a mention.

### Compared to Advanced Level
- **Skip measure-theoretic foundations**: No need for σ-algebras, Borel sets, or the full Savage representation theorem proof.
- **Intuitive risk measures**: Arrow-Pratt coefficient is introduced (lesson 8) but not derived rigorously or extended to CARA/CRRA families in detail.
- **Prospect theory**: Covered descriptively (lessons 13-14) but without the full functional form or econometric estimation.
- **Ambiguity models**: Ellsberg paradox and ambiguity aversion are discussed (lesson 18), but no Choquet expected utility, maxmin EU, or α-maxmin models.
- **Dynamic consistency**: Sequential decisions are covered (lesson 24) but without the sophistication of dynamic programming or backward induction in game-theoretic settings.

### Key Emphasis at Intermediate Level
- **Conceptual clarity**: Students should deeply understand what expected utility is, why it matters, and when it fails.
- **Critical thinking**: Engage with paradoxes and anomalies. Don't just accept EU as gospel.
- **Practical application**: Use decision trees and real-world cases. Make it feel useful, not just abstract.
- **Philosophical awareness**: Touch on normative vs. descriptive debates without getting lost in them.

## Rabbit Holes (Fascinating Connections)

### 1. Money Pumps and Dutch Books
**When to drop this in**: Lesson 9-10, when discussing violations of transitivity or independence.

**The idea**: If you violate certain axioms, a clever bookie can set up a sequence of trades that guarantees you lose money. This makes violations look costly, not just "quirky." Great for students who respond to practical consequences.

**How deep to go**: Explain one simple example (e.g., intransitive preferences → cycle of trades). Don't formalize the general theorem.

### 2. Arrow's Impossibility Theorem
**When to drop this in**: Lesson 4, when discussing preferences and rationality.

**The idea**: Aggregating individual preferences into social preferences is impossible without violating some desirable axiom. Connects decision theory to voting theory and social choice.

**How deep to go**: State the result and intuition (no voting rule is perfect). Don't prove it or list all axioms.

### 3. Insurance and Gambling
**When to drop this in**: Lesson 8, on risk aversion.

**The idea**: If you're risk-averse, you should buy insurance (pay to avoid risk). But people also buy lottery tickets (pay to take on risk). How is that consistent?

**How deep to go**: Discuss possible explanations (entertainment value, probability weighting, different reference points). Use this to foreshadow prospect theory.

### 4. Newcomb's Paradox
**When to drop this in**: Lesson 25, in the synthesis.

**The idea**: A decision problem where expected utility theory (two-box) and causal reasoning (one-box) give different answers. Deeply weird and still debated.

**How deep to go**: Present the setup and the puzzle. Let students argue. Don't try to "solve" it — there's no consensus.

### 5. Ergodicity Economics
**When to drop this in**: Lesson 12 (St. Petersburg) or lesson 24 (sequential decisions).

**The idea**: Expected utility assumes you average over many realizations, but you live in one timeline. Time averages ≠ ensemble averages. Challenges the foundations of EU.

**How deep to go**: Mention the critique and point to Ole Peters' work. Don't get into the math.

### 6. Frequentist vs. Bayesian Probability
**When to drop this in**: Lesson 20-21, on subjective probability and Bayesian updating.

**The idea**: Is probability a property of the world (long-run frequency) or a state of knowledge (degree of belief)? This is one of the deepest splits in statistics and philosophy of science.

**How deep to go**: Acknowledge the debate, note that decision theory is firmly Bayesian. Mention that frequentists still use probability but interpret it differently.

### 7. AI Alignment and Utility Functions
**When to drop this in**: Lesson 6 (utility functions) or lesson 25 (synthesis).

**The idea**: If we're building AI systems, we need to specify their goals as utility functions. But human values are messy, multi-dimensional, and context-dependent. Can we even write down what we want?

**How deep to go**: Raise the question, mention "value alignment" as an active research area. Don't get into RLHF or specific technical approaches unless the student is interested.

### 8. Game Theory and Strategic Interaction
**When to drop this in**: Lesson 17 or 19, when discussing uncertainty.

**The idea**: When the "states of the world" are other agents' choices, decision theory becomes game theory. Uncertainty about what others will do is strategic uncertainty.

**How deep to go**: Mention Nash equilibrium as the game-theoretic analog of EU maximization. Don't teach game theory — just note the connection.

## Difficulty Progression

### Module 1 (Lessons 1-5): Gentle Start
**Difficulty range**: 1-2

Start with intuitive ideas — what is a preference, what makes it consistent. Use everyday examples (choosing meals, consumer products). The only formal concept is transitivity, which is easy to grasp. Review lesson at the end to consolidate.

### Module 2 (Lessons 6-11): Formal Machinery
**Difficulty range**: 2-4, peaks at 4 (Allais)

Introduce the core mathematical framework: utility functions, expected utility, VNM axioms. This is the steepest climb. Lesson 9 (Allais) is the peak because it requires understanding the axioms well enough to see how they're violated. Lesson 10 (resource drop on VNM) is difficult content but lower cognitive load because it's "read and absorb," not "solve and apply."

### Module 3 (Lessons 12-16): Application and Critique
**Difficulty range**: 1-3, mostly 3

Use the EU framework to analyze paradoxes (St. Petersburg) and behavioral anomalies (prospect theory, loss aversion). These lessons are conceptually challenging (3) but students now have the tools, so it feels more manageable. Decision trees (lesson 15) is easier (2) — a practical skill. Review drops back to 1.

### Module 4 (Lessons 17-22): Conceptual Shift
**Difficulty range**: 2-4, peaks at 4 (maximin/minimax, Bayesian)

Moving from risk to uncertainty is a subtle conceptual shift (lesson 17, difficulty 2). Ellsberg (18) and decision rules under uncertainty (19) are hard (3-4) because students have to let go of probabilities as a crutch. Bayesian decision theory (21) is peak difficulty (4) because it combines two hard things: Bayes' rule and EU maximization. Review (22) gives breathing room.

### Module 5 (Lessons 23-25): Synthesis
**Difficulty range**: 2-4

Value of information (23) is challenging (4) but rewarding — it ties together everything. Sequential decisions (24) are moderately hard (3) but feel practical. Final teach-back (25) is easier (2) because it's reflection and integration, not new content.

### Overall Arc
- **Start accessible** (1-2) to build confidence and intuition
- **Ramp up through the formal core** (module 2, peaking at 4)
- **Plateau with applications** (module 3, steady 3)
- **Second peak with uncertainty** (module 4, peaks at 4 again)
- **Finish with synthesis** (module 5, moderate)

### Review Lesson Placement
- Lesson 5: After foundations, before EU machinery
- Lesson 11: After EU theory, before switching to behavioral/risk focus
- Lesson 16: After risk module, before uncertainty shift
- Lesson 22: After uncertainty, before final applications

These are spaced roughly every 5-7 lessons and always drop difficulty to 1-2 to give students a breather and consolidate learning.

## Engagement Strategies

### Use Real Decisions
Don't just talk about abstract gambles. Use:
- Health insurance vs. out-of-pocket (lesson 8)
- Investing in stocks vs. bonds (lesson 8)
- Medical treatment decisions under uncertainty (lesson 20-21)
- Hiring decisions with imperfect information (lesson 23)

### Pose Dilemmas
Many lessons are framed as questions ("Would you bet on an unknown urn?"). Have students answer first, then explain the theory. This creates cognitive engagement before the resolution.

### Highlight Disagreement
Decision theory has live debates (Are the VNM axioms normative? Is ambiguity aversion irrational?). Don't hide this — embrace it. Students love that even experts disagree.

### Connect to Other Fields
- Economics (consumer choice, finance)
- Philosophy (rationality, epistemology)
- Psychology (biases, heuristics)
- Computer science (AI, game theory)
- Medicine (diagnostic reasoning)

Show that decision theory is a hub, not a silo.

## Common Pitfalls (Instructor)

### 1. Too much formalism too fast
Students can drown in axioms and theorems. Build intuition first, formalize second. Always show "here's the problem this solves" before "here's the axiom."

### 2. Treating EU as gospel
If you present expected utility as the only rational approach, students will either accept it uncritically or reject it entirely. Present it as one coherent framework with known limits.

### 3. Skipping the paradoxes
Allais, Ellsberg, and St. Petersburg are not cute asides — they're where deep learning happens. Don't rush past them.

### 4. Ignoring the descriptive/normative split
Students will ask: "So should I use EU or prospect theory?" The answer is "It depends on whether you're trying to predict behavior or decide how to act." Make this distinction explicit.

### 5. Overloading with probability
Some students will struggle with the probability prerequisites (conditional probability, Bayes' rule). Budget time to review these in context (lessons 17, 21) rather than assuming mastery.

### 6. Not varying delivery types
If every lesson is a mini-lecture, students will zone out. Use questions, teach-backs, resource drops, and real-world cases to keep variety high.
