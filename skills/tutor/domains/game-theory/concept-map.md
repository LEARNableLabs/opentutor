# Game Theory — Concept Map

## Core Concepts (in learning order)

1. **Strategic interaction** — situations where outcomes depend on multiple decision-makers' choices
2. **Players, strategies, payoffs** — the three building blocks of any game
3. **Normal form representation** — matrix representation of simultaneous-move games
4. **Prisoner's dilemma** — canonical example where individual rationality leads to collective suboptimality
5. **Dominant strategy** — a strategy that is best regardless of what others do
6. **Iterated elimination of dominated strategies** — reasoning process based on common knowledge of rationality. Depends on: dominant strategy
7. **Rationalizability** — strategies that survive iterated elimination. Depends on: iterated elimination
8. **Best response** — optimal strategy given others' strategies
9. **Nash equilibrium** — mutual best response; no player wants to deviate unilaterally. Depends on: best response
10. **Mixed strategy** — randomization over pure strategies. Depends on: Nash equilibrium
11. **Mixed strategy Nash equilibrium** — equilibrium where players may randomize. Depends on: mixed strategy, Nash equilibrium
12. **Extensive form** — tree representation of sequential games
13. **Backward induction** — solving sequential games from the end backwards. Depends on: extensive form
14. **Subgame perfect equilibrium** — Nash equilibrium requiring optimal play in every subgame. Depends on: Nash equilibrium, backward induction
15. **Credible threats** — commitments that are sequentially rational. Depends on: subgame perfect equilibrium
16. **Repeated games** — the same game played multiple times
17. **Trigger strategies** — cooperate until someone defects, then punish. Depends on: repeated games
18. **Discount factor** — how much players value future payoffs. Depends on: repeated games
19. **Folk theorem** — characterizes sustainable outcomes in infinitely repeated games. Depends on: repeated games, trigger strategies, discount factor
20. **Incomplete information** — players don't know something about the game structure
21. **Types** — different possible private information a player might have. Depends on: incomplete information
22. **Bayesian Nash equilibrium** — equilibrium concept for games with incomplete information. Depends on: Nash equilibrium, types
23. **Mechanism design** — reverse engineering games to achieve desired outcomes. Depends on: Bayesian Nash equilibrium
24. **Evolutionarily stable strategy** — strategy that resists invasion by mutants
25. **Replicator dynamics** — evolutionary process of strategy adoption. Depends on: evolutionarily stable strategy

## Dependencies

- **Nash equilibrium requires understanding best responses** because equilibrium is defined as mutual best response — each player's strategy is optimal given others' strategies
- **Mixed strategies build on pure Nash equilibrium** because mixing is only rational when a player is indifferent between pure strategies, which happens when opponents mix to equalize expected payoffs
- **Subgame perfect equilibrium refines Nash equilibrium** because it applies Nash reasoning to every subgame, ruling out non-credible threats
- **Backward induction enables subgame perfection** because it provides the computational method for finding subgame perfect equilibria in finite games
- **The folk theorem depends on trigger strategies and discount factors** because sustainability of cooperation requires that the threat of future punishment (trigger) is sufficiently valuable (high discount factor) to deter current defection
- **Bayesian Nash equilibrium generalizes Nash to incomplete information** by having players best-respond in expectation over their beliefs about others' types
- **Mechanism design inverts the equilibrium concept** — instead of predicting behavior given rules, it designs rules to induce desired behavior

## Bottleneck Concepts

**Nash equilibrium** — This is the central solution concept. Understanding Nash equilibrium deeply is essential for everything that follows. Students must grasp:
- Why mutual best response is the right definition
- Why Nash equilibria always exist in mixed strategies (even if proof is beyond scope)
- How to compute equilibria systematically
- The interpretation: prediction vs prescription vs focal point

**Subgame perfect equilibrium** — This is the key refinement that makes dynamic games tractable. Students must understand:
- Why some Nash equilibria involve non-credible threats
- How backward induction enforces sequential rationality
- The tension between commitment and flexibility

**Incomplete information (types)** — This conceptual leap is challenging. Students must grasp:
- The difference between uncertainty about nature and uncertainty about opponents
- How beliefs enter payoff calculations
- Why we model private information as "types" drawn from a distribution

## Mind-Blowing Moments

1. **Mixed equilibria exist** — The idea that optimal play can require randomization is initially counterintuitive. Why would rational players flip coins?

2. **The folk theorem** — Almost any outcome better than permanent punishment can be sustained in equilibrium if players are patient enough. Cooperation is possible without external enforcement!

3. **Mechanism design / revelation principle** — You can design institutions (auctions, voting rules, contracts) to achieve goals even when participants act selfishly and have private information.

4. **Evolution plays Nash** — Evolutionary dynamics often lead to Nash equilibria even without conscious optimization. Game theory applies beyond rational agents.

5. **Backward induction paradox** — In the finitely repeated prisoner's dilemma, backward induction predicts universal defection, yet experimental subjects often cooperate. What gives?

## Common Misconceptions

1. **"Nash equilibrium means everyone gets the best possible outcome"** — No! Nash is about individual optimization, not collective. The prisoner's dilemma Nash equilibrium is terrible for both players.

2. **"Dominant strategies and Nash equilibrium are the same"** — Dominant strategy equilibrium is a special (stronger) case. Nash equilibria often exist when no player has a dominant strategy.

3. **"Mixed strategies mean players are confused or irrational"** — Mixing is fully rational when facing an opponent who is also mixing. It's about keeping opponents indifferent.

4. **"Subgame perfection eliminates all Nash equilibria"** — It only eliminates those involving non-credible threats. Subgame perfect equilibria are a subset of Nash equilibria.

5. **"In repeated games, cooperation always emerges"** — Only if the discount factor is high enough and the horizon is infinite (or indefinite). Finite repetition unravels via backward induction.

6. **"Bayesian games require learning/updating"** — Bayesian games model initial uncertainty (types drawn at the start), not learning over time. Learning would be a dynamic Bayesian game.

7. **"Game theory assumes people are selfish"** — Game theory assumes people optimize their payoffs, but payoffs can include altruism, fairness, spite, etc. The theory is about strategic reasoning, not selfishness.

## Prerequisite Topics

- **Probability theory** — needed for mixed strategies, expected payoffs, Bayesian games, beliefs over types
- **Basic optimization** — finding best responses requires maximizing expected payoffs
- **Mathematical reasoning / proof techniques** — understanding why equilibria exist, working through iterated elimination, backward induction arguments
- **Set theory and functions** — strategies are functions from information sets to actions; strategy spaces are sets

## Learning Obstacles

- **The leap from dominance to Nash** — Dominant strategies are algorithmic (just compare rows/columns), but Nash requires simultaneous best-response reasoning, which is more abstract
- **Notation density** — Game theory notation can be heavy (subscripts for players, superscripts for opponents, primes for deviations). Keep examples concrete.
- **Multiple equilibria** — Many games have multiple Nash equilibria. Students expect "the answer" but game theory often gives "the set of reasonable predictions."
- **Mixed strategies feel unnatural** — Most people don't walk around flipping coins. Frame mixing as population heterogeneity or as limiting behavior of perturbed games.
- **Infinite vs finite repetition** — The folk theorem feels magical, but only applies to infinite/indefinite horizons. The finite case unravels completely.
