# Microeconomics — Teaching Notes

## Approach

Microeconomics at the intermediate level requires balancing formal rigor with intuitive understanding. The subject is fundamentally about optimization under constraints — consumers maximizing utility given budgets, firms maximizing profit given costs, societies maximizing welfare given resources. At this level, students should be comfortable with calculus-based optimization while also developing strong graphical intuition. The best approach interweaves three modes: (1) mathematical formalism for precision, (2) graphical analysis for intuition, and (3) real-world applications for motivation. Unlike introductory micro, we derive results rather than assert them, and unlike graduate micro, we emphasize economic intuition over mathematical technique.

The progression moves from partial equilibrium (one market at a time) to general principles (market structures, welfare, failures). Start with the mechanics of supply and demand to build confidence, then dive into the microfoundations (utility and cost minimization) that explain where curves come from. Once students can derive behavior from first principles, introduce market structures that break competitive assumptions one at a time (monopoly, oligopoly, information problems). End with game theory as a unifying framework for strategic thinking.

## Common Misconceptions

### 1. Confusing movement along curves vs. shifts of curves
**The error**: Students think a price change "shifts demand" when it actually causes movement along the demand curve.
**Why it happens**: The language is tricky — "demand increases" could mean the curve shifts OR quantity demanded increases.
**How to correct**: Always distinguish "change in quantity demanded" (movement along) from "change in demand" (shift of curve). Use different verbal cues: "move to a new point on the curve" vs. "the whole relationship changes."

### 2. Thinking marginal = average
**The error**: Using average cost when marginal cost is needed for decisions, or thinking marginal utility is the same as total utility.
**Why it happens**: Everyday language uses "on average" for typical cases, but economics cares about incremental changes.
**How to correct**: Emphasize "next unit" vs. "typical unit." Use discrete examples first (what's the cost of the 5th vs. the average cost of 5 units?), then move to continuous. Physical metaphors help: marginal = slope, average = height.

### 3. Believing sunk costs should influence decisions
**The error**: Thinking "I've already spent $X, so I should continue" or "I can't quit now after investing so much."
**Why it happens**: Psychologically, we hate waste and want to justify past decisions. Sunk costs feel relevant.
**How to correct**: Emphasize that only future costs and benefits matter. Use stark examples: "Would you pay $20 to see a boring movie you already paid $15 for?" Acknowledge the psychological pull while explaining why it's irrational.

### 4. Thinking monopolies charge "the highest price possible"
**The error**: Believing monopolists always maximize price rather than profit.
**Why it happens**: Market power is conflated with unlimited pricing power; students forget about the demand curve constraint.
**How to correct**: Show that raising price reduces quantity sold. Draw the tradeoff: higher margin per unit vs. fewer units sold. Emphasize MR = MC condition, not "charge as much as you can."

### 5. Assuming efficiency means fairness
**The error**: Thinking Pareto efficient outcomes are necessarily just or equitable.
**Why it happens**: "Efficient" sounds like "good," and economists emphasize efficiency.
**How to correct**: Give stark examples where efficiency is unfair (slave owning can be Pareto efficient if the slave can't compensate the master to be free). Distinguish positive (efficiency) from normative (fairness). Explain the efficiency-equity tradeoff.

### 6. Treating demand as "what people want" rather than "what they'll pay for"
**The error**: Saying there's high demand for something when people want it but won't pay for it.
**Why it happens**: Colloquial usage of "demand" differs from economic definition.
**How to correct**: Always include "at a given price" when discussing demand. Emphasize willingness AND ability to pay. Example: everyone wants a Ferrari, but that doesn't mean demand is high at $300k.

### 7. Thinking externalities always require government intervention
**The error**: Assuming market failures automatically justify regulation or Pigouvian taxes.
**Why it happens**: Market failure section emphasizes problems, and government solutions are taught immediately after.
**How to correct**: Introduce Coase theorem and examples of private bargaining solutions. Discuss government failure. Emphasize transaction costs as the key determinant of whether private or public solutions work better.

### 8. Believing profit maximization is immoral or unrealistic
**The error**: Rejecting models because "real firms care about more than profit" or "this is too cynical."
**Why it happens**: Normative discomfort with greed; confusion between positive and normative economics.
**How to correct**: Explain that models are simplifications for prediction, not moral endorsements. Show that profit maximization can explain behavior even when firms have other goals (satisficing, sales maximization). Distinguish "firms maximize profit" (positive) from "firms should maximize profit" (normative).

### 9. Confusing Nash equilibrium with the best outcome
**The error**: Thinking Nash equilibrium is optimal rather than merely stable.
**Why it happens**: Equilibrium sounds like a good thing; stability is conflated with desirability.
**How to correct**: Use prisoner's dilemma to show Nash equilibrium can be terrible. Emphasize that Nash equilibrium is where no one wants to unilaterally deviate, not where everyone is happy. Connect to coordination failures.

### 10. Applying partial equilibrium intuition to general equilibrium
**The error**: Thinking "reduce supply of X → price of X rises" works when there are strong income or substitution effects across markets.
**Why it happens**: Supply-demand analysis is taught in isolation before general equilibrium considerations.
**How to correct**: Point out when partial equilibrium breaks down (e.g., taxing all goods, major commodity price changes). Explain when to trust partial vs. when to consider broader effects.

## Level Adjustments

### For intermediate level (this curriculum)

**Mathematical sophistication**: Use calculus for optimization (derivatives, Lagrangians), but don't require proof-based analysis. Students should be able to set up and solve max/min problems with constraints. Emphasize first-order conditions and economic interpretation. Skip envelope theorem, second-order conditions (except to check for max vs. min), and measure theory.

**Graphical emphasis**: Heavy use of diagrams — students should be able to draw and manipulate supply/demand, indifference curves, budget constraints, isoquants, cost curves, and game matrices. Graphical intuition is as important as algebraic solutions.

**Formalism vs. intuition**: Derive results formally, but always provide intuitive interpretation. For example, MRS = price ratio is derived via Lagrangian, but explain it as "bang for buck" equalization. Balance rigor with economic storytelling.

**Depth of coverage**: Cover the core models thoroughly (utility max, profit max, market structures, externalities, game theory basics) but skip advanced topics (general equilibrium, mechanism design, auction theory, contract theory). Focus on understanding over breadth.

**Applications**: Use real-world examples throughout, but students aren't expected to do original empirical work. Examples should be accessible and current (Uber surge pricing, carbon taxes, COVID-19 price effects).

### Adaptations from introductory level
- **More math**: Introductory uses mostly graphs; intermediate uses calculus for optimization
- **Microfoundations**: Introductory asserts demand curves slope down; intermediate derives them from utility maximization
- **Formal models**: Introductory relies on intuition; intermediate builds formal models and proves results
- **Complexity**: Introductory covers one market at a time; intermediate considers multiple effects (income + substitution, short-run + long-run)

### Adaptations from advanced level
- **Less abstraction**: Graduate micro uses axiomatic foundations, measure theory, and functional analysis; intermediate uses concrete utility functions
- **Fewer proofs**: Graduate micro proves existence and uniqueness; intermediate assumes well-behaved functions
- **Less generality**: Graduate micro covers arbitrary preference relations; intermediate uses differentiable utility functions
- **Less technique**: Graduate micro requires sophisticated math (dynamic programming, topology); intermediate uses calculus and algebra

## Rabbit Holes (Fascinating Extensions)

### When to deploy each

1. **Behavioral economics** — Drop in during consumer theory (lesson 6-10) when discussing utility maximization. Examples: anchoring, framing effects, present bias. Connection: Traditional theory assumes rationality; behavioral econ studies systematic departures.

2. **Auction theory** — Introduce during price discrimination (lesson 18) or game theory (lesson 27). Examples: Google AdWords auctions, FCC spectrum auctions. Connection: Auctions are mechanisms for price discovery and revenue maximization under asymmetric information.

3. **Network effects** — Discuss during market structures (lesson 16-20) or market failures (lesson 22-26). Examples: Facebook, operating systems, payment networks. Connection: Value depends on how many others use it; creates winner-take-all dynamics and natural monopolies.

4. **Mechanism design** — Introduce during game theory (lesson 27-29) or information asymmetries (lesson 25-26). Examples: designing voting systems, matching markets (kidney exchange, school choice). Connection: "Reverse game theory" — design rules to induce desired outcomes.

5. **Experimental economics** — Drop in throughout when discussing predictions. Examples: ultimatum game, trust game, public goods experiments. Connection: Lab tests of theoretical predictions; often reveals where theory fails behaviorally.

6. **Inequality and distribution** — Discuss during welfare economics (lesson 22) or market failures. Examples: Gini coefficients, top 1% wealth shares, inequality trends. Connection: Efficiency says nothing about distribution; separate equity considerations.

7. **Labor market applications** — Introduce during producer theory (lesson 12-15) or market structures (lesson 16-20). Examples: minimum wage effects, monopsony power, occupational licensing. Connection: Labor is an input; same optimization principles apply.

8. **Environmental economics** — Natural fit during externalities (lesson 23). Examples: carbon pricing, cap-and-trade vs. taxes, climate change. Connection: Classic externality problem at massive scale.

9. **Industrial organization** — Discuss during oligopoly (lesson 19). Examples: airline pricing, tech platform competition, merger analysis. Connection: Real-world application of market structure theory and game theory.

10. **Matching markets** — Introduce during market failures (lesson 22-26) or game theory. Examples: residency matching, school choice, dating apps. Connection: Markets without prices; stability and efficiency in matching.

11. **Global trade** — Connect during comparative advantage discussion (can add to lesson 1) or market structures. Examples: tariffs, trade wars, globalization effects. Connection: Same supply-demand logic applies internationally; comparative advantage drives gains from trade.

12. **Cryptocurrency and digital goods** — Discuss during public goods (lesson 24) or network effects. Examples: Bitcoin, NFTs, digital piracy. Connection: Interesting IP and excludability questions; network effects in payments.

## Difficulty Progression

### Overall arc
The curriculum follows a wave pattern: build foundations (low difficulty) → introduce optimization (peak difficulty) → apply to markets (moderate) → add complications (second peak) → integrate and review (low).

### Module-by-module breakdown

**Market Fundamentals (lessons 1-5)**: Difficulty 1-3
- Start easy with scarcity and opportunity cost (lesson 1, difficulty 1)
- Build to supply/demand mechanics (lessons 2-3, difficulty 2)
- Peak with equilibrium analysis and comparative statics (lesson 4, difficulty 3)
- Introduce elasticity with real-world application (lesson 5, difficulty 3)
- **Why**: Build confidence with accessible concepts; establish graphical literacy before hitting optimization

**Consumer Theory (lessons 6-10)**: Difficulty 2-4
- Start moderate with utility concepts (lesson 6, difficulty 2)
- Continue with budget constraints (lesson 7, difficulty 2)
- **First major peak**: Utility maximization and tangency (lesson 8, difficulty 4)
- **Second peak**: Income and substitution effects (lesson 9, difficulty 4)
- Step down with revealed preference (lesson 10, difficulty 3)
- **Why**: Constrained optimization is hard; front-load the difficulty so students can struggle when they're fresh

**Review (lesson 11)**: Difficulty 2
- Consolidate everything so far; spaced repetition
- **Why**: Cognitive break before producer theory; reinforce graphical skills

**Producer Theory (lessons 12-15)**: Difficulty 2-4
- Ease in with production functions (lesson 12, difficulty 2)
- Build with cost curves (lesson 13, difficulty 3)
- **Peak**: Profit maximization and MR=MC (lesson 14, difficulty 4)
- Apply to real-world case (lesson 15, difficulty 3)
- **Why**: Mirror consumer theory structure; optimization is hard but students have seen it before

**Market Structures (lessons 16-20)**: Difficulty 3-4
- Start with perfect competition (lesson 16, difficulty 3)
- **Peaks**: Monopoly and price discrimination (lessons 17-18, difficulty 4)
- Oligopoly with game theory (lesson 19, difficulty 4)
- Finish moderate with monopolistic competition (lesson 20, difficulty 3)
- **Why**: Applying optimization to market structures; conceptually challenging but builds on earlier work

**Review (lesson 21)**: Difficulty 2
- Second checkpoint; review producers and market structures
- **Why**: Mental reset before market failures

**Market Failures (lessons 22-26)**: Difficulty 3-4
- Introduce framework (lesson 22, difficulty 3)
- Real-world externalities (lesson 23, difficulty 3)
- Public goods question (lesson 24, difficulty 3)
- **Peaks**: Information asymmetries (lessons 25-26, difficulty 4)
- **Why**: Conceptually rich material; adverse selection and moral hazard are subtle

**Game Theory (lessons 27-29)**: Difficulty 3-4
- **Peak**: Nash equilibrium (lesson 27, difficulty 4)
- Apply to prisoner's dilemma (lesson 28, difficulty 3)
- Extend to repeated games (lesson 29, difficulty 4)
- **Why**: Strategic thinking is hard; save for end when students are sophisticated

**Final Review (lesson 30)**: Difficulty 2
- Integrate market failures and game theory
- **Why**: Consolidation before finishing

### Teaching tips for difficulty management

- **Difficulty 4-5 lessons**: Spend extra time, provide scaffolding, break into smaller steps, assign practice problems, encourage peer discussion
- **After difficulty peaks**: Follow with easier application or review to consolidate understanding
- **Review lessons (difficulty 1-2)**: Use spaced repetition; test recall, not re-teaching; make it active (problems, quizzes, teach-backs)
- **Real-world lessons**: Can be easier (difficulty 2-3) if they apply known concepts, or harder (difficulty 4) if they introduce new complications
- **Teach-back lessons**: Effective for difficult concepts; having students explain reinforces their understanding

### Signs a lesson is too hard
- Student gives up quickly without trying
- Errors are random rather than systematic (suggests guessing)
- Student can't explain their reasoning
- Frustration overwhelms curiosity

### Adjustments when students struggle
- **Break it down**: Split one lesson into two shorter ones
- **Add scaffolding**: Provide more structure (worked examples, templates, intermediate steps)
- **Increase concreteness**: Use numerical examples before algebra, specific functions before general
- **Add review**: Insert extra practice on prerequisites before returning to the hard topic

### Adjustments when students breeze through
- **Combine lessons**: Cover two in one session
- **Add depth**: Introduce extensions (behavioral economics, experimental results, current research)
- **Increase abstraction**: Move from specific examples to general principles faster
- **Add challenges**: Pose harder problems, ask for proofs, request independent applications
